Product Requirements Document (PRD): Frenchify
Project Name: Frenchify (French E-Learning LMS) Version: 1.5 (Refined MVP Specs) Status: Ready for Development Tech Stack: React (Vite) + Firebase (Full Suite) + Express.js (Cloud Functions) 
________________________________________
1. Executive Summary
The goal is to rapidly develop "Frenchify," a dedicated French Language Learning Management System (LMS). The platform operates on a strict Freemium business model. Students are assigned a "Free Tier" by default but can upgrade to a "Paid Tier" for global access to all premium content (Platform-wide subscription). Teachers act as content creators with specific tools to manage French course materials—leveraging YouTube embeds for grammar to reduce costs and direct file uploads for conversation practice—while Administrators maintain oversight of users and subscriptions.
________________________________________
2. User Personas
A. The Student
•	Goal: Learn the French language through structured grammar and conversation courses.
•	Tiers:
o	Free Tier: Default status; limited content access.
o	Paid Tier: Global access to all paid courses, downloads, and teacher Q&A.
B. The Teacher
•	Goal: Create and monetize French language courses.
•	Needs: Tools to upload recordings, embed YouTube videos, create quizzes, and manage student questions.
C. The Administrator
•	Goal: Quality control and revenue management.
•	Needs: Ability to approve teachers and manage user accounts/subscriptions.
________________________________________
3. Functional Requirements
3.1 General System & Authentication
•	Scope: The platform is exclusively for teaching French.
•	Unified Login: Free tier and Paid tier students shall share the same login mechanism.
•	Default Tiering: The system shall automatically assign the student to a free tier by default upon login/signup.
3.2 Student Features (Freemium Logic)
•	Subject Areas: The system must provide specific sections for French Grammar and French Conversation.
•	Free Access: Free tier students shall be able to access only the free content.
•	Paid Access: Paid tier students shall have global access to all paid courses on the platform (Netflix-style subscription).
•	Downloads: Paid tier students shall be able to download course materials.
•	Q&A: Paid tier students shall be able to ask questions on specific courses.
•	Payments: The system shall provide payment methods for students to upgrade.
3.3 Teacher Features (Course Management)
•	Course Creation: Teachers shall be able to create a course. Unapproved teachers can create "Draft" courses but cannot "Publish" them until approved by an Admin.
•	Monetization: Teachers shall be able to choose if a course is paid or free.
•	Content Management: Teachers shall be able to add, remove, or edit materials and course information.
•	Media Support (Uploads): Teachers shall be able to upload recordings of conversations.
•	Media Support (YouTube): Teachers shall be able to embed YouTube videos (specifically for Grammar content) via URL.
•	Assessments: Teachers shall be able to create a quiz for each material.
o	Constraint: Quizzes are client-side self-checks only. No grades are stored in the database, and they do not block progression (MVP Scope).
•	Interaction: Teachers shall be able to answer student questions.
•	Course Deletion: Teachers shall be able to delete a course.
3.4 Admin Features
•	Teacher Gatekeeping: Admin shall be able to approve or reject teacher registrations.
o	Constraint: Unapproved teachers can log in to access their dashboard but are restricted from publishing content.
•	User Management: Admin shall be able to delete a Student or a Teacher.
•	Admin Management: Admin shall be able to create another admin.
•	Subscription Management: Admin shall be able to manage student subscriptions.
________________________________________
4. Technical Architecture & User Flows
Same as original document , with the understanding that the "Upgrade" flow unlocks platform-wide access.
________________________________________
5. Data Model (Firestore Schema)
Note: Data is denormalized to optimize for read performance.
Collection: users
•	uid (string): Unique Auth ID.
•	role (string): "student" | "teacher" | "admin".
•	tier (string): "free" | "paid" (Default: "free").
•	email (string).
•	createdAt (timestamp): Account creation date.
Collection: courses
•	courseId (string).
•	title (string).
•	description (string).
•	isPaid (boolean): Determines if the course requires a subscription.
•	teacherId (string).
•	teacherName (string): Cached for display.
•	status (string): "draft" | "published" (Default: "draft").
•	createdAt (timestamp).
•	updatedAt (timestamp).
Sub-Collection: courses/{courseId}/materials
•	materialId (string).
•	title (string).
•	type (string): "video" | "youtube" | "quiz" | "pdf" .
•	url (string): Stores the Firebase Download URL OR the YouTube Video ID.
•	isFreePreview (boolean): If true, even Free Tier users can view this specific file.
Sub-Collection: courses/{courseId}/questions (New for Q&A)
•	questionId (string).
•	userId (string): The student asking.
•	content (string): The question text.
•	createdAt (timestamp).
•	isAnswered (boolean).
•	answerText (string): The teacher's reply.
•	answeredAt (timestamp).
________________________________________
6. Security Strategy
Access control is enforced at the database level using Firestore Security Rules.
1.	Public Read: Anyone can read course titles/descriptions (The Catalog).
2.	Strict Write: Only Admins and the specific Teacher who owns a course can modify it.
3.	Tier Enforcement:
o	Paid Students: Can read all documents in materials.
o	Free Students: Can only read documents in materials where isFreePreview == true.
o	Mechanism: Rules check Custom Auth Claims (request.auth.token.tier) to reduce database read costs and improve security (avoiding direct document lookups).
________________________________________
7. Risk Assessment
Risk	Impact	Mitigation Strategy
Teacher Supply	High	Admin approval queue may slow down onboarding. Create a "Fast Track" for trusted teachers.
Storage Costs	Medium	Teachers uploading raw 4K video to Firebase. Mitigated by YouTube integration feature.
Tier Bypassing	High	Users sharing accounts. Implement simultaneous login detection (limit active sessions to 1 device) or show warning banner for MVP.
________________________________________
8. Implementation Roadmap
Phase 1: Foundation (Weeks 1-2)
•	Initialize Firebase Project & Repo.
•	Implement Authentication (Sign up/Login) with default "Free Tier" assignment.
•	Build Admin Dashboard for "Teacher Approval" (Handle pending vs. approved states).
Phase 2: Core LMS & Media (Weeks 3-4)
•	Teacher Dashboard: Course creation form (Draft/Publish logic).
•	Media Implementation: Build logic to handle File Uploads and YouTube parsing.
•	Student Dashboard: View Course Catalog.
•	Implement Firestore Security Rules (using Custom Claims).
•	Implement Q&A Sub-collection logic.
Phase 3: Monetization & Polish (Weeks 5-6)
•	Integrate Stripe for "Paid Tier" upgrades (Platform-wide access).
•	Unlock "Download" and "Q&A" features for Paid users.
•	Final UI Polish.
________________________________________
I apologize for that oversight. I mistakenly summarized the User Stories section to focus on the new changes, but I should have kept the full list so the document remains complete for your .docx file.
Below is the full, restored Section 9, combining your original stories with the new requirements (Global Subscription, Q&A, and Quiz boundaries).
________________________________________
9. User Stories
A. Student Stories
•	Freemium Access (The Guardrail)
o	Story: As a Free Tier student, I want to be automatically assigned a "Free" account upon signup so that I can start learning French immediately without paying.
o	Acceptance Criteria: Firestore document created with tier: "free" on signup.
•	Accessing Content
o	Story: As a Free Tier student, I want to clearly see which French lessons are locked vs. free.
o	Acceptance Criteria: Paid modules have a "Lock" icon. Clicking them triggers an "Upgrade" modal.
•	Global Subscription (Netflix Model)
o	Story: As a Paid Tier student, I want access to all paid courses on the platform immediately after upgrading, without buying them individually.
o	Acceptance Criteria: Clicking any "Locked" course grants immediate access if user.tier == 'paid'.
•	Downloads (Offline Study)
o	Story: As a Paid Tier student, I want to download French grammar sheets to my device so I can study offline.
o	Acceptance Criteria: A "Download" button appears next to materials only if user.tier == 'paid'.
•	Asking Questions (Q&A)
o	Story: As a Paid Tier student, I want to ask questions on specific course lessons to get clarification.
o	Acceptance Criteria: A "Post Question" input appears under the video. This input is hidden or disabled for Free Tier users.
B. Teacher Stories
•	YouTube Integration (Grammar)
o	Story: As a teacher, I want to paste a YouTube link for a Grammar lesson instead of uploading a file, so that I can use existing high-quality content without waiting for uploads.
o	Acceptance Criteria: The "Add Material" form accepts a YouTube URL, extracts the ID, and the student view renders a player.
•	Audio Uploads (Conversation)
o	Story: As a teacher, I want to upload recordings of French conversations.
o	Acceptance Criteria: Drag-and-drop upload to Firebase Storage supported for audio files.
•	Course Creation & Publishing
o	Story: As a teacher, I want to draft a new French course, but I understand I cannot "Publish" it until my account is approved.
o	Acceptance Criteria: A "Create Course" form exists. The "Publish" button is disabled/hidden if user.status != 'approved'.
•	Quiz Creation (Self-Check)
o	Story: As a teacher, I want to add simple multiple-choice quizzes to materials to help students check their understanding.
o	Acceptance Criteria: Quiz renders on the frontend. No grades are stored in the database (client-side only).
•	Answering Questions
o	Story: As a teacher, I want to see and reply to questions students have asked on my courses.
o	Acceptance Criteria: A "Q&A" tab in the Teacher Dashboard shows unanswered questions for their specific courses.
C. Admin Stories
•	Teacher Gatekeeping
o	Story: As an admin, I want to approve or reject new teacher registrations so that only qualified instructors can publish content.
o	Acceptance Criteria: Dashboard list of "Pending Teachers" with "Approve/Reject" buttons. Approval updates the user status to allow publishing.
•	Subscription Oversight
o	Story: As an admin, I want to manually manage a student's subscription status for support purposes.
o	Acceptance Criteria: Admin can toggle a user's tier field from "free" to "paid" in the dashboard.
•	User Management
o	Story: As an admin, I want to delete users who violate the terms of service.
o	Acceptance Criteria: "Delete User" button removes the user from Firebase Auth and Firestore.
________________________________________
10. Figma Wireframe Descriptions
Global Components
•	Top Navbar (Student): Left: Logo ("Frenchify"). Center: Nav Links (Grammar, Conversation). Right: "Upgrade to Pro" Button (Visible if Free), Profile Avatar.
Student Screens
•	Screen 1.0: Student Dashboard (Catalog): Grid layout. Filters: "All", "Grammar", "Conversation". Cards show Title, Teacher, and "Lock Icon" if the user is Free and course is Paid.
•	Screen 1.1: Course Player: Sidebar syllabus. Main area features YouTube Player (for Grammar) or Audio Player (for Conversation). "Download" button disabled for Free users. Q&A section at bottom (Input box hidden for Free users).
•	Screen 1.2: Upgrade Modal: Benefits list ("Unlimited Access", "Offline Downloads"). Pricing info. "Subscribe via Stripe" button.
Teacher Screens
•	Screen 2.0: Teacher Dashboard: List of "My Courses" with Edit/Delete actions. "Create Course" button.
•	Screen 2.1: Course Editor: Form for Title, Description, "Is Paid?" toggle. List of materials with drag-and-drop reordering.
•	Screen 2.2: Add Material Modal: Dropdown for Material Type (Video/YouTube/Quiz). Logic: If "YouTube" selected -> Show URL Input. If "Video" selected -> Show File Upload. Checkbox for "Free Preview?".
Admin Screens
•	Screen 3.0: Approvals: Table of "Pending Teachers" with Approve (Green) / Reject (Red) buttons.
•	Screen 3.1: User Management: Search bar for users. Action buttons to "Delete User" or "Override Subscription".
11. UI/UX Design System: Frenchify
Design Philosophy: Clean, distraction-free learning (Student), High-efficiency data density (Admin).
Vibe: Modern SaaS (like Duolingo met Notion).
Brand Identity: Subtle nods to the French flag (Blue/White/Red) without looking cliché.
1. Color Palette (Tailwind Mappings)
We will use a "SaaS-ified" version of the French tricolor to ensure it looks professional.
Role	Color Name	Hex Code	Tailwind Class	Usage
Primary	Azure Blue	#2563EB	bg-blue-600	Main buttons, Active states, Links.
Secondary	Marianne Red	#EF4444	bg-red-500	"Locked" icons, Reject actions, Delete buttons.
Success	Emerald	#10B981	bg-emerald-500	"Approve" buttons, "Free" badges.
Surface	Paper White	#FFFFFF	bg-white	Cards, Modals, Main content background.
Background	Mist Gray	#F3F4F6	bg-gray-100	Global app background (behind cards).
Text Main	Ink Black	#1F2937	text-gray-800	Headings, Main body text.
Text Muted	Slate	#6B7280	text-gray-500	Subtitles, Captions, Inactive icons.
Accent	Gold	#F59E0B	bg-amber-500	"Pro" Tier Badge, Stars.
________________________________________
2. Typography
Font Family: Inter (Google Font) - Standard, readable, clean.
•	H1 (Page Titles): text-3xl font-bold text-gray-800
•	H2 (Section Headers): text-xl font-semibold text-gray-700
•	H3 (Card Titles): text-lg font-medium text-gray-900
•	Body: text-sm text-gray-600 leading-relaxed
•	Table Header: text-xs font-bold text-gray-500 uppercase tracking-wider
________________________________________
3. UI Component Specifications (React + Tailwind)
A. Buttons
•	Primary Button (Save, Login): bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm.
•	Action Button (Approve): bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 rounded-md text-sm font-medium.
•	Destructive Button (Reject/Delete): bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium.
B. Course Card (Student View)
•	Structure: Image (16:9), Body (p-4), Badge (Top-right).
•	Locked State: If User=Free & Course=Paid, apply grayscale to image and overlay a Lock Icon.
C. Admin Data Tables
•	Container: bg-white rounded-lg shadow border border-gray-200 overflow-hidden.
•	Header Row: bg-gray-50 border-b border-gray-200.
•	Rows: hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0.
________________________________________
4. Key Screen Mockups (Text-Based)
Screen 1: Student Dashboard
Plaintext
+-----------------------------------------------------------------------+
|  [Logo: Frenchify]    [Nav: Grammar | Conversation]     [Avatar (O)]  |
+-----------------------------------------------------------------------+
|  [Header Background: Light Blue Gradient]                             |
|  Title: Bienvenue, Student!                                           |
+-----------------------------------------------------------------------+
|  FILTERS:  [All (Active)]  [Grammar]  [Conversation]                  |
|                                                                       |
|  +---------------------+    +---------------------+                   |
|  | [THUMBNAIL]         |    | [THUMBNAIL]         |                   |
|  | Badge: FREE (Green) |    | Badge: PRO (Gold)   |                   |
|  |                     |    | * LOCK ICON * |                   |
|  | Title: French 101   |    | Title: Adv. Grammar |                   |
|  | [ > Continue ]      |    | [ Unlock Course ]   |                   |
|  +---------------------+    +---------------------+                   |
+-----------------------------------------------------------------------+
Screen 2: Teacher "Add Material" Modal
Plaintext
+---------------------------------------------------------------+
|  Add New Material                                         [X] |
+---------------------------------------------------------------+
|  Title: [ Enter lesson title...                             ] |
|  Type:  [ (o) YouTube ]  [ ( ) Upload Video ]  [ ( ) Quiz ]   |
|                                                               |
|  +---------------------------------------------------------+  |
|  |  YouTube URL:                                           |  |
|  |  [ https://youtube.com/watch?v=...                    ] |  |
|  +---------------------------------------------------------+  |
|                                                               |
|  [ ] Free Preview? (Allow Free users to see this)             |
+---------------------------------------------------------------+
|                      [ Cancel ]   [ Save Material (Blue) ]    |
+---------------------------------------------------------------+
Screen 3: Admin Dashboard (Approvals & Users)
Layout: Sidebar Navigation (Teachers, Students, Settings).
Plaintext
+-----------------------------------------------------------------------+
|  [Frenchify Admin] |  Teacher Approvals (3 Pending)                   |
|                    |                                                  |
|  > Approvals (3)   |  +--------------------------------------------+  |
|  > All Users       |  | NAME          EMAIL              ACTION    |  |
|  > Subscriptions   |  |--------------------------------------------|  |
|                    |  | Pierre Dupont pierre@test.com    [Approve] |  |
|                    |  |                                  [Reject]  |  |
|                    |  |--------------------------------------------|  |
|                    |  | Marie Currie  marie@sci.fr       [Approve] |  |
|                    |  |                                  [Reject]  |  |
|                    |  +--------------------------------------------+  |
|                    |                                                  |
|                    |  User Management                                 |
|                    |  [ Search by email...                       ]    |
|                    |                                                  |
|                    |  +--------------------------------------------+  |
|                    |  | USER           TIER       ACTIONS          |  |
|                    |  |--------------------------------------------|  |
|                    |  | John Doe       Free       [Set to Paid]    |  |
|                    |  |                           [Delete User]    |  |
|                    |  |--------------------------------------------|  |
|                    |  | Sarah Smith    Paid       [Set to Free]    |  |
|                    |  |                           [Delete User]    |  |
|                    |  +--------------------------------------------+  |
+--------------------+--------------------------------------------------+

