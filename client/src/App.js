import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/Layout";

// 🔥 Lazy load pages (major performance boost)
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));

const HomePage = lazy(() => import("./pages/HomePage"));
const EnrollmentPage = lazy(() => import("./pages/EnrollmentPage"));
const GradesPage = lazy(() => import("./pages/GradesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// 🔥 Admin panel is usually very heavy — lazy load it
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));

// 🔥 SocketListener should NOT load before login
const SocketListener = lazy(() => import("./components/SocketListener"));

function App() {
  const { user } = useAuth();

  return (
    <ToastProvider>
      <SettingsProvider>
        <Router>
          {/* Suspense is required for all lazy-loaded pages */}
          <Suspense fallback={<div className="loading">Loading...</div>}>

            {/* Load socket only when user is logged in */}
            {user && <SocketListener />}

            <Routes>

              {/* Public routes (no layout) */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Admin route */}
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard currentUser={user} />}
              />

              {/* Pages wrapped in Layout */}
              <Route path="/home" element={<Layout><HomePage /></Layout>} />
              <Route path="/enroll" element={<Layout><EnrollmentPage /></Layout>} />
              <Route path="/grades" element={<Layout><GradesPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

            </Routes>
          </Suspense>
        </Router>
      </SettingsProvider>
    </ToastProvider>
  );
}

export default App;
