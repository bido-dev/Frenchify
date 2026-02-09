import { db, auth } from "../src/config/firebase";
import {
    getPendingTeachers,
    getAllUsers,
    updateTeacherStatus,
    updateUserSubscription,
    createAdmin,
    deleteUserAccount
} from "../src/models/admin.model";
import * as userModel from "../src/models/user.model";

// Mock Firebase
jest.mock("../src/config/firebase", () => ({
    db: {
        collection: jest.fn(),
        batch: jest.fn()
    },
    auth: {
        createUser: jest.fn(),
        deleteUser: jest.fn()
    }
}));

// Mock user.model dependencies
jest.mock("../src/models/user.model", () => ({
    updateUserStatus: jest.fn(),
    updateUserTier: jest.fn(),
    deleteUserFromDb: jest.fn()
}));

describe("Admin Model", () => {
    let mockCollection: any;
    let mockDoc: any;
    let mockGet: any;
    let mockSet: any;
    let mockWhere: any;
    let mockOrderBy: any;
    let mockBatch: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockGet = jest.fn();
        mockSet = jest.fn();
        mockWhere = jest.fn().mockReturnThis();
        mockOrderBy = jest.fn().mockReturnThis();

        mockDoc = jest.fn(() => ({
            get: mockGet,
            set: mockSet,
            collection: jest.fn(() => ({
                get: mockGet,
                where: mockWhere
            }))
        }));

        mockCollection = jest.fn(() => ({
            doc: mockDoc,
            where: mockWhere,
            orderBy: mockOrderBy,
            get: mockGet
        }));

        mockBatch = {
            delete: jest.fn(),
            commit: jest.fn().mockResolvedValue(undefined)
        };

        (db.collection as jest.Mock) = mockCollection;
        (db.batch as jest.Mock).mockReturnValue(mockBatch);
    });

    describe("getPendingTeachers", () => {
        it("should fetch pending teachers", async () => {
            const mockTeachers = [
                {
                    id: "teacher1",
                    data: () => ({ email: "t1@test.com", name: "T1", createdAt: "2023-01-01", status: "pending" })
                }
            ];
            mockGet.mockResolvedValue({ docs: mockTeachers });

            const result = await getPendingTeachers();

            expect(result).toHaveLength(1);
            expect(result[0].uid).toBe("teacher1");
            expect(mockCollection).toHaveBeenCalledWith("users");
            expect(mockWhere).toHaveBeenCalledWith("role", "==", "teacher");
            expect(mockWhere).toHaveBeenCalledWith("status", "==", "pending");
        });
    });

    describe("getAllUsers", () => {
        it("should fetch all users ordered by createdAt", async () => {
            const mockUsers = [
                { id: "u1", data: () => ({ email: "u1@test.com" }) },
                { id: "u2", data: () => ({ email: "u2@test.com" }) }
            ];
            mockGet.mockResolvedValue({ docs: mockUsers });

            const result = await getAllUsers();

            expect(result).toHaveLength(2);
            expect(mockOrderBy).toHaveBeenCalledWith("createdAt", "desc");
        });
    });

    describe("updateTeacherStatus", () => {
        it("should call updateUserStatus", async () => {
            await updateTeacherStatus("teacher1", "active");
            expect(userModel.updateUserStatus).toHaveBeenCalledWith("teacher1", "active");
        });
    });

    describe("updateUserSubscription", () => {
        it("should call updateUserTier", async () => {
            await updateUserSubscription("user1", "paid");
            expect(userModel.updateUserTier).toHaveBeenCalledWith("user1", "paid");
        });
    });

    describe("createAdmin", () => {
        it("should create auth user and firestore doc", async () => {
            (auth.createUser as jest.Mock).mockResolvedValue({ uid: "admin123" });

            const uid = await createAdmin("admin@test.com", "password", "Admin Name");

            expect(uid).toBe("admin123");
            expect(auth.createUser).toHaveBeenCalledWith({
                email: "admin@test.com",
                password: "password",
                emailVerified: false
            });
            expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
                uid: "admin123",
                role: "admin",
                tier: "paid"
            }));
        });
    });

    describe("deleteUserAccount", () => {
        beforeEach(() => {
            // Default user finding
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ role: "student" })
            });
        });

        it("should throw if user not found", async () => {
            mockGet.mockResolvedValue({ exists: false });
            await expect(deleteUserAccount("missing")).rejects.toThrow("User not found");
        });

        it("should delete student data and account", async () => {
            // Mock student data finding
            mockGet.mockReturnValueOnce({ // user doc
                exists: true,
                data: () => ({ role: "student" })
            });

            // Mock enrollments query
            mockGet.mockReturnValueOnce({ docs: [{ ref: "enrollmentRef" }] }); // enrollments

            // Mock courses query for questions check
            mockGet.mockReturnValueOnce({ docs: [] }); // courses

            await deleteUserAccount("student1");

            expect(mockBatch.delete).toHaveBeenCalled(); // Should delete enrollment
            expect(auth.deleteUser).toHaveBeenCalledWith("student1");
            expect(userModel.deleteUserFromDb).toHaveBeenCalledWith("student1");
        });

        it("should delete teacher data and account", async () => {
            mockGet.mockReturnValueOnce({ // user doc
                exists: true,
                data: () => ({ role: "teacher" })
            });

            // Mock courses query
            mockGet.mockReturnValueOnce({
                docs: [{
                    id: "course1",
                    ref: "courseRef",
                    data: () => ({})
                }]
            });

            // Mock subcollections get
            mockGet.mockReturnValue({ docs: [] }); // materials/questions

            await deleteUserAccount("teacher1");

            expect(mockBatch.delete).toHaveBeenCalled(); // Should delete course
            expect(auth.deleteUser).toHaveBeenCalledWith("teacher1");
        });
    });
});
