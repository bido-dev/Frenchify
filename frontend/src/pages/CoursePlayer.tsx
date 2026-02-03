import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft, Play, Download, MessageSquare } from 'lucide-react';

export const CoursePlayer: React.FC = () => {
    const { courseId } = useParams();

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
                    <div className="aspect-video bg-black rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                        <Play className="w-20 h-20 text-white/90 group-hover:scale-110 transition-transform duration-300 cursor-pointer" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h2 className="text-xl font-bold">Lesson 1: Basics of French Pronunciation</h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Course {courseId}</h1>
                        <p className="text-gray-600 leading-relaxed">
                            In this lesson, we will cover the fundamental sounds of the French language.
                            Pay close attention to the vowels!
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                            <Button variant="ghost" className="text-blue-600 bg-blue-50 hover:bg-blue-100">
                                <Download className="w-4 h-4 mr-2" />
                                Download Materials
                            </Button>
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
                        <h3 className="font-semibold text-lg mb-4 px-2">Course Content</h3>
                        <div className="space-y-1">
                            {[1, 2, 3, 4, 5].map((lesson) => (
                                <div key={lesson} className={`p-3 rounded-lg flex items-center cursor-pointer transition-colors ${lesson === 1 ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'hover:bg-gray-50 text-gray-600'}`}>
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border flex items-center justify-center text-xs font-medium mr-3 shadow-sm">
                                        {lesson}
                                    </div>
                                    <span className="text-sm font-medium">Lesson Title {lesson}</span>
                                    {lesson === 1 && <span className="ml-auto text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Now</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
