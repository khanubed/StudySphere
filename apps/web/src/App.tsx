import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { MainLayout } from './components/MainLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ResourceHub } from './pages/ResourceHub';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="border border-border p-8 rounded-card bg-muted/10">
    <h2 className="text-xl font-bold">{title} Page</h2>
    <p className="text-muted-foreground text-sm mt-2">
      This page is scaffolded and ready for development.
    </p>
  </div>
);

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="resources" element={<ResourceHub />} />
        <Route path="ai/summarizer" element={<PlaceholderPage title="AI Summarizer" />} />
        <Route path="planner" element={<PlaceholderPage title="Study Planner" />} />
        <Route path="coding" element={<PlaceholderPage title="Coding Hub" />} />
        <Route path="profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="billing" element={<PlaceholderPage title="Billing & Plans" />} />
        <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
