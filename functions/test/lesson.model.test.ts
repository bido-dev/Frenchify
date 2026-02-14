import * as lessonModel from '../src/models/lesson.model';
import { db } from '../src/config/firebase';

// Mock Firebase
jest.mock('../src/config/firebase', () => ({
    db: {
        collection: jest.fn(),
    },
}));

describe('Lesson Model', () => {
    const mockCollection = db.collection as jest.Mock;
    const courseId = 'course-123';
    const lessonId = 'lesson-456';

    const sampleLessonData = {
        title: 'Test Lesson',
        video: {
            type: 'youtube' as const,
            url: 'https://youtube.com/watch?v=123',
        },
        pdf: {
            url: 'https://download.com/file.pdf',
            title: 'Lesson PDF',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addLesson', () => {
        it('should add a lesson to the lessons subcollection', async () => {
            const mockAdd = jest.fn().mockResolvedValue({ id: lessonId });
            const mockLessonsCollection = { add: mockAdd };
            const mockDoc = { collection: jest.fn().mockReturnValue(mockLessonsCollection) };
            mockCollection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDoc) });

            const result = await lessonModel.addLesson(courseId, sampleLessonData);

            expect(result).toBe(lessonId);
            expect(mockCollection).toHaveBeenCalledWith('courses');
            expect(mockDoc.collection).toHaveBeenCalledWith('lessons');
            expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
                title: sampleLessonData.title,
                video: sampleLessonData.video,
                pdf: sampleLessonData.pdf,
                quiz: null,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }));
        });

        it('should add a lesson with "upload" video type', async () => {
            const uploadLessonData = {
                title: 'Upload Lesson',
                video: {
                    type: 'upload' as const,
                    url: 'https://storage.googleapis.com/bucket/video.mp4',
                },
            };

            const mockAdd = jest.fn().mockResolvedValue({ id: lessonId });
            const mockLessonsCollection = { add: mockAdd };
            const mockDoc = { collection: jest.fn().mockReturnValue(mockLessonsCollection) };
            mockCollection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDoc) });

            const result = await lessonModel.addLesson(courseId, uploadLessonData);

            expect(result).toBe(lessonId);
            expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
                title: uploadLessonData.title,
                video: uploadLessonData.video,
                pdf: null,
                quiz: null,
            }));
        });

        it('should add a lesson without optional fields', async () => {
            const basicLessonData = {
                title: 'Basic Lesson',
            };

            const mockAdd = jest.fn().mockResolvedValue({ id: lessonId });
            const mockLessonsCollection = { add: mockAdd };
            const mockDoc = { collection: jest.fn().mockReturnValue(mockLessonsCollection) };
            mockCollection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDoc) });

            const result = await lessonModel.addLesson(courseId, basicLessonData);

            expect(result).toBe(lessonId);
            expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
                title: basicLessonData.title,
                video: null,
                pdf: null,
                quiz: null,
            }));
        });
    });

    describe('getCourseLessons', () => {
        it('should return an array of lessons', async () => {
            const mockData = { title: 'Lesson 1' };
            const mockDoc1 = { id: 'l1', data: () => mockData };
            const mockGet = jest.fn().mockResolvedValue({ docs: [mockDoc1] });
            const mockOrderBy = jest.fn().mockReturnValue({ get: mockGet });
            const mockLessonsCollection = { orderBy: mockOrderBy };
            const mockDoc = { collection: jest.fn().mockReturnValue(mockLessonsCollection) };
            mockCollection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockDoc) });

            const result = await lessonModel.getCourseLessons(courseId);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ id: 'l1', ...mockData });
            expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'asc');
        });
    });

    describe('getLessonById', () => {
        it('should return lesson data if found', async () => {
            const mockData = { title: 'Found Lesson' };
            const mockGet = jest.fn().mockResolvedValue({ exists: true, data: () => mockData });
            const mockLessonDoc = { get: mockGet };
            const mockLessonsCollection = { doc: jest.fn().mockReturnValue(mockLessonDoc) };
            const mockCourseDoc = { collection: jest.fn().mockReturnValue(mockLessonsCollection) };
            mockCollection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockCourseDoc) });

            const result = await lessonModel.getLessonById(courseId, lessonId);

            expect(result).toEqual(mockData);
        });

        it('should return null if not found', async () => {
            const mockGet = jest.fn().mockResolvedValue({ exists: false });
            const mockLessonDoc = { get: mockGet };
            const mockLessonsCollection = { doc: jest.fn().mockReturnValue(mockLessonDoc) };
            const mockCourseDoc = { collection: jest.fn().mockReturnValue(mockLessonsCollection) };
            mockCollection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockCourseDoc) });

            const result = await lessonModel.getLessonById(courseId, lessonId);

            expect(result).toBeNull();
        });
    });

    describe('updateLesson', () => {
        it('should update specific fields', async () => {
            const mockUpdate = jest.fn().mockResolvedValue({});
            const mockLessonDoc = { update: mockUpdate };
            const mockLessonsCollection = { doc: jest.fn().mockReturnValue(mockLessonDoc) };
            const mockCourseDoc = { collection: jest.fn().mockReturnValue(mockLessonsCollection) };
            mockCollection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockCourseDoc) });

            await lessonModel.updateLesson(courseId, lessonId, { title: 'New Title' });

            expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Title',
                updatedAt: expect.any(String),
            }));
        });
    });

    describe('deleteLesson', () => {
        it('should delete the lesson document', async () => {
            const mockDelete = jest.fn().mockResolvedValue({});
            const mockLessonDoc = { delete: mockDelete };
            const mockLessonsCollection = { doc: jest.fn().mockReturnValue(mockLessonDoc) };
            const mockCourseDoc = { collection: jest.fn().mockReturnValue(mockLessonsCollection) };
            mockCollection.mockReturnValue({ doc: jest.fn().mockReturnValue(mockCourseDoc) });

            await lessonModel.deleteLesson(courseId, lessonId);

            expect(mockDelete).toHaveBeenCalled();
        });
    });
});
