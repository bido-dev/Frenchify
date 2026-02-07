import { createQuestion, getQuestionsByCourse, answerQuestion, getQuestionById } from "../src/models/question.model";
import { db } from "../src/config/firebase";

// Mock Firestore
jest.mock("../src/config/firebase", () => ({
    db: {
        collection: jest.fn()
    }
}));

describe("Question Model", () => {
    let mockCollection: any;
    let mockDoc: any;
    let mockAdd: any;
    let mockGet: any;
    let mockUpdate: any;
    let mockOrderBy: any;
    let mockWhere: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockAdd = jest.fn().mockResolvedValue({ id: "question123" });
        mockGet = jest.fn();
        mockUpdate = jest.fn().mockResolvedValue({});
        mockOrderBy = jest.fn().mockReturnThis();
        mockWhere = jest.fn().mockReturnThis();

        mockDoc = jest.fn(() => ({
            collection: jest.fn(() => ({
                add: mockAdd,
                get: mockGet,
                doc: mockDoc,
                orderBy: mockOrderBy,
                where: mockWhere
            })),
            get: mockGet,
            update: mockUpdate
        }));

        mockCollection = jest.fn(() => ({
            doc: mockDoc,
            where: mockWhere,
            add: mockAdd,
            get: mockGet
        }));

        (db.collection as jest.Mock) = mockCollection;
    });

    describe("createQuestion", () => {
        it("should create a question successfully", async () => {
            const questionId = await createQuestion(
                "course123",
                "user456",
                "John Doe",
                "How do you pronounce 'bonjour'?"
            );

            expect(questionId).toBe("question123");
            expect(mockCollection).toHaveBeenCalledWith("courses");
            expect(mockDoc).toHaveBeenCalledWith("course123");
            expect(mockAdd).toHaveBeenCalledWith(
                expect.objectContaining({
                    courseId: "course123",
                    userId: "user456",
                    userName: "John Doe",
                    content: "How do you pronounce 'bonjour'?",
                    isAnswered: false
                })
            );
        });
    });

    describe("getQuestionsByCourse", () => {
        it("should return all questions for a course", async () => {
            const mockQuestions = [
                { id: "q1", data: () => ({ content: "Question 1", isAnswered: false }) },
                { id: "q2", data: () => ({ content: "Question 2", isAnswered: true }) }
            ];

            mockGet.mockResolvedValue({ docs: mockQuestions });

            const questions = await getQuestionsByCourse("course123");

            expect(questions).toHaveLength(2);
            expect(questions[0].questionId).toBe("q1");
            expect(mockOrderBy).toHaveBeenCalledWith("createdAt", "desc");
        });
    });

    describe("answerQuestion", () => {
        it("should update question with answer", async () => {
            await answerQuestion("course123", "question456", "Bonjour is pronounced 'bon-zhoor'");

            expect(mockUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    answerText: "Bonjour is pronounced 'bon-zhoor'",
                    isAnswered: true
                })
            );
        });
    });

    describe("getQuestionById", () => {
        it("should return question if exists", async () => {
            const mockQuestionData = {
                content: "How to conjugate 'être'?",
                isAnswered: false,
                userId: "user123"
            };

            mockGet.mockResolvedValue({
                exists: true,
                id: "question789",
                data: () => mockQuestionData
            });

            const question = await getQuestionById("course123", "question789");

            expect(question).not.toBeNull();
            expect(question?.questionId).toBe("question789");
            expect(question?.content).toBe("How to conjugate 'être'?");
        });

        it("should return null if question does not exist", async () => {
            mockGet.mockResolvedValue({ exists: false });

            const question = await getQuestionById("course123", "nonexistent");

            expect(question).toBeNull();
        });
    });
});
