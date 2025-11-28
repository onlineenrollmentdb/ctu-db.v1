import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout";

// Lazy load routes
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));

const HomePage = lazy(() => import("./pages/HomePage"));
const EnrollmentPage = lazy(() => import("./pages/EnrollmentPage"));
const GradesPage = lazy(() => import("./pages/GradesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Admin split into its own chunk
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

function AppRoutes() {

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* AUTH ROUTES */}
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/enroll" element={<Layout><EnrollmentPage /></Layout>} />
        <Route path="/grades" element={<Layout><GradesPage /></Layout>} />
        <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SettingsProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SettingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
