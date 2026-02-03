import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CoursePlayer } from './pages/CoursePlayer';
import { LandingPage } from './forms/LandingPage';
import { Login } from './forms/Login';
import { Register } from './forms/Register';
import { Profile } from './pages/Profile';
import { TeacherDashboard } from './teacherPages/TeacherDashboard';
import { CourseEditor } from './teacherPages/CourseEditor';
import { MyQuestions } from './teacherPages/MyQuestions';
import { TeacherLayout } from './teacherPages/TeacherLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Wrapped in Layout) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/course/:courseId" element={<Layout><CoursePlayer /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherLayout><TeacherDashboard /></TeacherLayout>} />
        <Route path="/teacher/questions" element={<TeacherLayout><MyQuestions /></TeacherLayout>} />
        <Route path="/teacher/course/:courseId/edit" element={<TeacherLayout><CourseEditor /></TeacherLayout>} />
        <Route path="/teacher/course/new" element={<TeacherLayout><CourseEditor /></TeacherLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
