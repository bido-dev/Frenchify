import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft, Download, MessageSquare, FileText, Video } from 'lucide-react';
import { getCourse, getCourseMaterials, type Course, type Material } from '../api/student.api';
import { getCourseLessons, type LessonData } from '../api/lesson.api';

export const CoursePlayer: React.FC = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<(LessonData & { id: string })[]>([]);
    const [resources, setResources] = useState<Material[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<(LessonData & { id: string }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                const [courseData, materialsData, lessonsData] = await Promise.all([
                    getCourse(courseId),
                    getCourseMaterials(courseId),
                    getCourseLessons(courseId)
                ]);
                setCourse(courseData);

                // Resources (PDFs/Extra materials)
                const resourceItems = materialsData.filter(m => m.type === 'pdf' || m.type === 'quiz');
                setResources(resourceItems);

                // Lessons (from distinct Lesson API)
                setLessons(lessonsData as (LessonData & { id: string })[]);

                if (lessonsData.length > 0) {
                    setSelectedLesson(lessonsData[0] as (LessonData & { id: string }));
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const handleLessonSelect = (lesson: (LessonData & { id: string })) => {
        setSelectedLesson(lesson);
    };

    const handleDownload = (url: string) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    /** Extract YouTube video ID from a full URL or bare ID */
    const getYouTubeVideoId = (urlOrId: string): string => {
        // Already a bare video ID (no slashes or dots)
        if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
        try {
            const url = new URL(urlOrId);
            // youtube.com/watch?v=ID
            if (url.searchParams.has('v')) return url.searchParams.get('v')!;
            // youtu.be/ID or youtube.com/embed/ID
            const segments = url.pathname.split('/').filter(Boolean);
            if (segments.length > 0) return segments[segments.length - 1];
        } catch { /* not a URL */ }
        return urlOrId; // fallback: return as-is
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="aspect-video bg-gray-200 rounded-xl"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-64 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="max-w-6xl mx-auto text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
                <Link to="/dashboard">
                    <Button className="mt-4">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="mb-4">
                <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Player Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Video / Content Player */}
                    <div className="aspect-video bg-black rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg group">
                        {selectedLesson ? (
                            selectedLesson.video?.type === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedLesson.video.url)}?autoplay=0`}
                                    title={selectedLesson.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : selectedLesson.video?.type === 'upload' ? (
                                <video
                                    src={selectedLesson.video.url}
                                    controls
                                    className="w-full h-full"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="text-center text-white p-8">
                                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-70" />
                                    <h3 className="text-xl font-bold mb-2">{selectedLesson.title}</h3>
                                    <p className="text-gray-300 mb-4">No video content available.</p>
                                </div>
                            )
                        ) : (
                            <div className="text-white/60">Select a lesson to start</div>
                        )}

                        {!selectedLesson && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedLesson?.title || course.title}</h1>
                                <p className="text-gray-500 text-sm mb-4">Course: {course.title}</p>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                            {course.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                            {/* Render Download Buttons for Resources (Global Course Resources) */}
                            {resources.length > 0 ? (
                                resources.map(resource => (
                                    <Button
                                        key={resource.id}
                                        variant="ghost"
                                        className="text-blue-600 bg-blue-50 hover:bg-blue-100"
                                        onClick={() => handleDownload(resource.url)}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download {resource.title}
                                    </Button>
                                ))
                            ) : null}

                            {/* Lesson Specific Materials */}
                            {selectedLesson?.materials && selectedLesson.materials.map(material => (
                                <Button
                                    key={material.id}
                                    variant="ghost"
                                    className={`
                                        ${material.type === 'pdf' ? 'text-green-600 bg-green-50 hover:bg-green-100' :
                                            material.type === 'youtube' ? 'text-red-600 bg-red-50 hover:bg-red-100' :
                                                'text-blue-600 bg-blue-50 hover:bg-blue-100'}
                                    `}
                                    onClick={() => handleDownload(material.url)}
                                >
                                    {material.type === 'pdf' ? <FileText className="w-4 h-4 mr-2" /> :
                                        material.type === 'youtube' ? <Video className="w-4 h-4 mr-2" /> :
                                            <Download className="w-4 h-4 mr-2" />}
                                    {material.title}
                                </Button>
                            ))}

                            {/* Legacy PDF Support */}
                            {selectedLesson?.pdf ? (
                                <Button
                                    variant="ghost"
                                    className="text-green-600 bg-green-50 hover:bg-green-100"
                                    onClick={() => handleDownload(selectedLesson.pdf!.url)}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Lesson PDF: {selectedLesson.pdf.title}
                                </Button>
                            ) : null}

                            {resources.length === 0 && !selectedLesson?.pdf && (!selectedLesson?.materials || selectedLesson.materials.length === 0) && (
                                <Button
                                    variant="ghost"
                                    className="text-gray-400 bg-gray-50 cursor-not-allowed"
                                    disabled
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    No Materials
                                </Button>
                            )}

                            <Button variant="ghost" className="text-gray-600">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Ask Question
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Syllabus */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
                        <h3 className="font-semibold text-lg mb-4 px-2">Course Lessons</h3>
                        {lessons.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No lessons available yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {lessons.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        onClick={() => handleLessonSelect(lesson)}
                                        className={`p-3 rounded-lg flex items-center cursor-pointer transition-colors ${selectedLesson?.id === lesson.id
                                            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                                            : 'hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium mr-3 shadow-sm ${selectedLesson?.id === lesson.id
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-500 border-gray-200'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                                            <p className="text-xs text-gray-400 capitalize">{lesson.video?.type || 'Lesson'}</p>
                                        </div>
                                        {selectedLesson?.id === lesson.id && (
                                            <span className="ml-2 flex-shrink-0 text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                Now
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
