import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TeacherLayout } from './teacherPages/TeacherLayout';

// Lazy load route components for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const LandingPage = lazy(() => import('./forms/LandingPage'));
const Login = lazy(() => import('./forms/Login'));
const Register = lazy(() => import('./forms/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const TeacherDashboard = lazy(() => import('./teacherPages/TeacherDashboard'));
const CourseEditor = lazy(() => import('./teacherPages/CourseEditor'));
const MyQuestions = lazy(() => import('./teacherPages/MyQuestions'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading..." /></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Wrapped in Layout) */}
            <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/course/:courseId" element={<PrivateRoute><Layout><CoursePlayer /></Layout></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<PrivateRoute><TeacherLayout><TeacherDashboard /></TeacherLayout></PrivateRoute>} />
            <Route path="/teacher/questions" element={<PrivateRoute><TeacherLayout><MyQuestions /></TeacherLayout></PrivateRoute>} />
            <Route path="/teacher/course/:courseId/edit" element={<PrivateRoute><TeacherLayout><CourseEditor /></TeacherLayout></PrivateRoute>} />
            <Route path="/teacher/course/new" element={<PrivateRoute><TeacherLayout><CourseEditor /></TeacherLayout></PrivateRoute>} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
