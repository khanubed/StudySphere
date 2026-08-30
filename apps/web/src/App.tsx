import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { PublicAuthRoute } from './components/guards/PublicAuthRoute';

// Public & Auth Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';

// Student & Shared Pages
import { Dashboard } from './pages/Dashboard';
import { ResourceHub } from './pages/ResourceHub';
import { ResourceDetail } from './pages/ResourceDetail';
import { ResourceUpload } from './pages/ResourceUpload';
import { AISummarizer } from './pages/AISummarizer';
import { AIQuizNew } from './pages/AIQuizNew';
import { AIAssignmentHelper } from './pages/AIAssignmentHelper';
import { AIResumeAnalyzer } from './pages/AIResumeAnalyzer';
import { QuizAttempt } from './pages/QuizAttempt';
import { QuizResults } from './pages/QuizResults';
import { StudyPlanner } from './pages/StudyPlanner';
import { CareerHub } from './pages/CareerHub';
import { JobDetail } from './pages/JobDetail';
import { AlumniDirectory } from './pages/AlumniDirectory';
import { AlumniProfile } from './pages/AlumniProfile';
import { CodingHub } from './pages/CodingHub';
import { ProblemDetail } from './pages/ProblemDetail';
import { LiveQuizJoin } from './pages/LiveQuizJoin';
import { LiveQuizPlay } from './pages/LiveQuizPlay';
import { Profile } from './pages/Profile';
import { Billing } from './pages/Billing';
import { Notifications } from './pages/Notifications';

// Faculty Pages
import { FacultyOverview } from './pages/faculty/FacultyOverview';
import { FacultyAnnouncements } from './pages/faculty/FacultyAnnouncements';
import { FacultyResources } from './pages/faculty/FacultyResources';
import { FacultyQuizNew } from './pages/faculty/FacultyQuizNew';
import { FacultyAnalytics } from './pages/faculty/FacultyAnalytics';
import { LiveQuizHost } from './pages/faculty/LiveQuizHost';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminModeration } from './pages/admin/AdminModeration';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminPlans } from './pages/admin/AdminPlans';
import { AdminInstitutions } from './pages/admin/AdminInstitutions';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* 1.1 Public Indexable Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/career" element={<CareerHub />} />
      <Route path="/career/:id" element={<JobDetail />} />
      <Route path="/coding" element={<CodingHub />} />
      <Route
        path="/coding/:trackSlug/:topicSlug/:problemSlug"
        element={<ProblemDetail />}
      />
      <Route path="/resources/:id" element={<ResourceDetail />} />

      {/* Public Auth Routes (Redirects away if authenticated) */}
      <Route
        path="/login"
        element={
          <PublicAuthRoute>
            <Login />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicAuthRoute>
            <Register />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicAuthRoute>
            <ForgotPassword />
          </PublicAuthRoute>
        }
      />

      {/* 1.2 Student & General Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['student', 'alumni', 'faculty', 'admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="resources" element={<ResourceHub />} />
        <Route path="resources/upload" element={<ResourceUpload />} />
        <Route path="ai/summarizer" element={<AISummarizer />} />
        <Route path="ai/quiz/new" element={<AIQuizNew />} />
        <Route path="ai/assignment-helper" element={<AIAssignmentHelper />} />
        <Route path="ai/resume-analyzer" element={<AIResumeAnalyzer />} />
        <Route path="quiz/:id/attempt" element={<QuizAttempt />} />
        <Route path="quiz/:id/results" element={<QuizResults />} />
        <Route path="planner" element={<StudyPlanner />} />
        <Route path="alumni" element={<AlumniDirectory />} />
        <Route path="alumni/:id" element={<AlumniProfile />} />
        <Route path="live-quiz/join" element={<LiveQuizJoin />} />
        <Route path="live-quiz/play/:sessionId" element={<LiveQuizPlay />} />
        <Route path="profile" element={<Profile />} />
        <Route path="billing" element={<Billing />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* 1.3 Faculty Protected Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FacultyOverview />} />
        <Route path="announcements" element={<FacultyAnnouncements />} />
        <Route path="resources" element={<FacultyResources />} />
        <Route path="quizzes/new" element={<FacultyQuizNew />} />
        <Route path="analytics" element={<FacultyAnalytics />} />
      </Route>

      <Route
        path="/live-quiz/host/new"
        element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LiveQuizHost />} />
      </Route>

      {/* 1.4 Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="moderation" element={<AdminModeration />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="billing/plans" element={<AdminPlans />} />
        <Route path="institutions" element={<AdminInstitutions />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
