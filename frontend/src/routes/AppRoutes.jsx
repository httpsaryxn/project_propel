import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import StudentLayout from '../layouts/StudentLayout';
import CoordinatorLayout from '../layouts/CoordinatorLayout';
import AuthPage from '../pages/auth/AuthPage';
import StudentDashboard from '../pages/student/Dashboard';
import StudentProfile from '../pages/student/Profile';
import EligibleCompanies from '../pages/student/EligibleCompanies';
import StudentApplications from '../pages/student/Applications';
import StudentOffers from '../pages/student/Offers';
import CoordinatorDashboard from '../pages/coordinator/Dashboard';
import ManageCompanies from '../pages/coordinator/ManageCompanies';
import ManageStudents from '../pages/coordinator/ManageStudents';
import CoordinatorApplications from '../pages/coordinator/Applications';
import CoordinatorResults from '../pages/coordinator/Results';
import Visits from '../pages/coordinator/Visits';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../pages/shared/Unauthorized';
import NotFound from '../pages/shared/NotFound';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Merged Unified Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
        </Route>

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/companies" element={<EligibleCompanies />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/student/offers" element={<StudentOffers />} />
            <Route path="/student/notifications" element={<StudentDashboard />} />
          </Route>
        </Route>

        {/* Protected Coordinator Routes */}
        <Route element={<ProtectedRoute allowedRoles={['coordinator', 'admin']} />}>
          <Route element={<CoordinatorLayout />}>
            <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
            <Route path="/coordinator/companies" element={<ManageCompanies />} />
            <Route path="/coordinator/students" element={<ManageStudents />} />
            <Route path="/coordinator/applications" element={<CoordinatorApplications />} />
            <Route path="/coordinator/results" element={<CoordinatorResults />} />
            <Route path="/coordinator/visits" element={<Visits />} />
            <Route path="/coordinator/notifications" element={<CoordinatorDashboard />} />
          </Route>
        </Route>

        {/* Shared Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
