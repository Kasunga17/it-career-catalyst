import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { initializeStorage } from '@/lib/storage';

// Layout
import Layout from '@/components/layout/Layout';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import RefereeVerification from '@/pages/RefereeVerification';

// Student
import StudentDashboard from '@/pages/student/Dashboard';
import ApplyPage from '@/pages/student/Apply';

// Company
import CompanyDashboard from '@/pages/company/Dashboard';
import PostOpportunity from '@/pages/company/PostOpportunity';

// Admin
import AdminDashboard from '@/pages/admin/Dashboard';

function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-referee" element={<RefereeVerification />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
        <Route path="/student/apply/:id" element={<Layout><ApplyPage /></Layout>} />
        <Route path="/student/applications" element={<Layout><StudentDashboard /></Layout>} />

        {/* Company Routes */}
        <Route path="/company/dashboard" element={<Layout><CompanyDashboard /></Layout>} />
        <Route path="/company/post" element={<Layout><PostOpportunity /></Layout>} />
        <Route path="/company/applicants" element={<Layout><CompanyDashboard /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/users" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/organizations" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/resets" element={<Layout><AdminDashboard /></Layout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
