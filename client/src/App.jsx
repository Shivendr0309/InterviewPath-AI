import { Routes, Route, Navigate } from "react-router-dom";

// ================= PUBLIC PAGES =================

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

// ================= USER PAGES =================

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import MockInterview from "./pages/MockInterview";
import StudyPlanner from "./pages/StudyPlanner";

import CompanyExplorer from "./pages/CompanyExplorer";
import CompanyDetails from "./pages/CompanyDetails";

import CodingPractice from "./pages/CodingPractice";
import ProblemDetail from "./pages/ProblemDetail";
import SubmissionHistory from "./pages/SubmissionHistory";

import RoleExplorer from "./pages/RoleExplorer";
import InterviewExperience from "./pages/InterviewExperience";

// ================= PROTECTED ROUTE =================

import ProtectedRoute from "./components/ProtectedRoute";

// ================= ADMIN =================

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";

import AdminDashboard from "./admin/AdminDashboard";
import UserManagement from "./admin/UserManagement";
import CompanyManagement from "./admin/CompanyManagement";
import RoleManagement from "./admin/RoleManagement";
import RoadmapManagement from "./admin/RoadmapManagement";
import InterviewExperienceManagement from "./admin/InterviewExperienceManagement";
import ReportsManagement from "./admin/ReportsManagement";
import AnalyticsDashboard from "./admin/AnalyticsDashboard";
import Settings from "./admin/Settings";
import AdminProfile from "./admin/AdminProfile";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/home"
        element={<Home />}
      />

      {/* ================= USER PROTECTED ROUTES ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <MockInterview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/study-planner"
        element={
          <ProtectedRoute>
            <StudyPlanner />
          </ProtectedRoute>
        }
      />

      {/* ================= COMPANY EXPLORER ================= */}

      <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <CompanyExplorer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/companies/:id"
        element={
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        }
      />

      {/* ================= CODING PRACTICE ================= */}

      <Route
        path="/coding-practice"
        element={
          <ProtectedRoute>
            <CodingPractice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coding-practice/history"
        element={
          <ProtectedRoute>
            <SubmissionHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/coding-practice/:id"
        element={
          <ProtectedRoute>
            <ProblemDetail />
          </ProtectedRoute>
        }
      />

      {/* ================= ROLE EXPLORER ================= */}

      <Route
        path="/role-explorer"
        element={
          <ProtectedRoute>
            <RoleExplorer />
          </ProtectedRoute>
        }
      />

      {/* ================= INTERVIEW EXPERIENCE COMMUNITY ================= */}

      <Route
        path="/interview-experiences"
        element={<InterviewExperience />}
      />

      {/* ================= ADMIN LOGIN ================= */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* ================= ADMIN PANEL ================= */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route
          index
          element={<AdminDashboard />}
        />

        <Route
          path="users"
          element={<UserManagement />}
        />

        <Route
          path="companies"
          element={<CompanyManagement />}
        />

        <Route
          path="roles"
          element={<RoleManagement />}
        />

        <Route
          path="roadmaps"
          element={<RoadmapManagement />}
        />

        <Route
          path="interviews"
          element={<InterviewExperienceManagement />}
        />

        <Route
          path="reports"
          element={<ReportsManagement />}
        />

        <Route
          path="analytics"
          element={<AnalyticsDashboard />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />

        <Route
          path="profile"
          element={<AdminProfile />}
        />
      </Route>

      {/* ================= UNKNOWN ROUTES ================= */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;