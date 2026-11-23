import {
  NavLink,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  FaHome,
  FaUser,
  FaBuilding,
  FaRoute,
  FaMicrophone,
  FaFileAlt,
  FaCode,\n  FaHistory,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaArrowLeft,
  FaBriefcase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({
  title,
  subtitle,
  children,
  showBackButton = true,
}) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // ================= LOGOUT =================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ================= USER DATA =================

  const userName =
    user?.fullName || "User";

  const userRole =
    user?.role === "admin"
      ? "Admin"
      : "Candidate";

  const userInitial =
    userName.charAt(0).toUpperCase();

  // ================= PROFILE IMAGE =================

  const getProfileImage = () => {
    if (!user?.profileImage) {
      return null;
    }

    if (
      user.profileImage.startsWith("http")
    ) {
      return user.profileImage;
    }

    const apiUrl =
      import.meta.env.VITE_API_URL || "";

    const backendUrl =
      apiUrl.replace("/api/v1", "");

    return `${backendUrl}${user.profileImage}`;
  };

  const profileImage =
    getProfileImage();

  // ================= NAVIGATION =================

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <FaHome />,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: <FaUser />,
    },
    {
      to: "/companies",
      label: "Companies",
      icon: <FaBuilding />,
    },
    {
      to: "/role-explorer",
      label: "Role Explorer",
      icon: <FaBriefcase />,
    },
    {
      to: "/study-planner",
      label: "Study Planner",
      icon: <FaRoute />,
    },
    {
      to: "/mock-interview",
      label: "AI Mock Interview",
      icon: <FaMicrophone />,
    },
    {
      to: "/resume-analyzer",
      label: "Resume Analyzer",
      icon: <FaFileAlt />,
    },
    {
      to: "/coding-practice",
      label: "Coding Practice",
      icon: <FaCode />,
    },
    {
      to: "/coding-practice/history",
      label: "Submission History",
      icon: <FaHistory />,
    },
    {
  to: "/interview-experiences",
  label: "Interview Community",
  icon: <FaUsers />,
},
  ];

  // ================= SIDEBAR CONTENT =================

  const SidebarContent = () => (
    <>
      {/* LOGO */}

      <div className="p-5 border-b border-[var(--secondary)] flex items-center justify-center min-h-[76px]">

        <Link
          to="/dashboard"
          className={`font-bold text-[var(--primary)] whitespace-nowrap transition-all duration-300 ${
            sidebarOpen
              ? "text-2xl"
              : "text-xl"
          }`}
        >
          {sidebarOpen
            ? "InterviewPath AI"
            : "IP"}
        </Link>

      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">

        {navItems.map((item) => (

          <NavLink
            key={item.to}
            to={item.to}
            onClick={() =>
              setMobileMenuOpen(false)
            }
            title={
              !sidebarOpen
                ? item.label
                : ""
            }
            className={({ isActive }) =>
              `flex items-center ${
                sidebarOpen
                  ? "gap-3 px-4"
                  : "justify-center px-2"
              } py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[var(--background)] text-[var(--primary)]"
                  : "text-[var(--text)] hover:bg-[var(--background)] hover:text-[var(--primary)]"
              }`
            }
          >

            <span className="text-lg">
              {item.icon}
            </span>

            {sidebarOpen && (
              <span>
                {item.label}
              </span>
            )}

          </NavLink>

        ))}

      </nav>

      {/* LOGOUT */}

      <div className="p-3 border-t border-[var(--secondary)]">

        <button
          onClick={handleLogout}
          title={
            !sidebarOpen
              ? "Logout"
              : ""
          }
          className={`w-full flex items-center ${
            sidebarOpen
              ? "gap-3 px-4"
              : "justify-center px-2"
          } py-3 rounded-xl text-[var(--text)] hover:bg-red-50 hover:text-red-600 transition`}
        >

          <FaSignOutAlt />

          {sidebarOpen && (
            <span>
              Logout
            </span>
          )}

        </button>

      </div>
    </>
  );

  return (

    <div className="min-h-screen bg-[var(--background)] flex">

      {/* ================= DESKTOP SIDEBAR ================= */}

      <div
        className={`hidden md:block relative transition-all duration-300 ${
          sidebarOpen
            ? "w-64"
            : "w-20"
        }`}
      >

        <aside className="h-screen sticky top-0 bg-white border-r border-[var(--secondary)] flex flex-col">

          <SidebarContent />

        </aside>


        {/* SIDEBAR TOGGLE */}

        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="absolute top-7 -right-3 w-7 h-7 bg-white border border-[var(--secondary)] rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--primary)] hover:shadow-md transition-all duration-200 z-40"
          title={
            sidebarOpen
              ? "Collapse Sidebar"
              : "Expand Sidebar"
          }
        >

          {sidebarOpen ? (
            <FaChevronLeft size={10} />
          ) : (
            <FaChevronRight size={10} />
          )}

        </button>

      </div>


      {/* ================= MOBILE SIDEBAR ================= */}

      {mobileMenuOpen && (

        <div className="fixed inset-0 z-50 md:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />


          <aside className="relative z-10 w-72 h-full bg-white flex flex-col">

            <div className="p-5 border-b border-[var(--secondary)] flex justify-between items-center">

              <Link
                to="/dashboard"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="text-xl font-bold text-[var(--primary)]"
              >
                InterviewPath AI
              </Link>


              <button
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <FaTimes />
              </button>

            </div>


            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">

              {navItems.map((item) => (

                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                      isActive
                        ? "bg-[var(--background)] text-[var(--primary)]"
                        : "text-[var(--text)] hover:bg-[var(--background)]"
                    }`
                  }
                >

                  <span className="text-lg">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>

                </NavLink>

              ))}

            </nav>


            <div className="p-4 border-t border-[var(--secondary)]">

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
              >

                <FaSignOutAlt />

                <span>
                  Logout
                </span>

              </button>

            </div>

          </aside>

        </div>

      )}


      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 min-w-0">


        {/* ================= HEADER ================= */}

        <header className="sticky top-0 z-30 bg-white border-b border-[var(--secondary)] px-4 md:px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">


            {/* MOBILE MENU */}

            <button
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="md:hidden w-10 h-10 rounded-lg border border-[var(--secondary)] flex items-center justify-center hover:bg-[var(--background)]"
            >
              <FaBars />
            </button>


            {/* BACK BUTTON */}

            {showBackButton &&
              location.pathname !== "/dashboard" && (

                <button
                  onClick={() =>
                    navigate(-1)
                  }
                  className="w-10 h-10 rounded-lg border border-[var(--secondary)] flex items-center justify-center hover:bg-[var(--background)] text-[var(--primary)] transition"
                  title="Go Back"
                >
                  <FaArrowLeft />
                </button>

              )}


            {/* PAGE TITLE */}

            <div>

              <p className="text-xs md:text-sm text-gray-500">
                InterviewPath AI
              </p>

              <h2 className="text-lg md:text-xl font-bold text-[var(--text)]">
                {title}
              </h2>

            </div>

          </div>


          {/* ================= USER PROFILE ================= */}

          <Link
            to="/profile"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >

            {profileImage ? (

              <img
                src={profileImage}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--primary)]"
              />

            ) : (

              <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-semibold">

                {userInitial}

              </div>

            )}


            <div className="hidden sm:block">

              <p className="font-semibold text-[var(--text)]">
                {userName}
              </p>

              <p className="text-xs text-gray-500">
                {userRole}
              </p>

            </div>

          </Link>

        </header>


        {/* ================= PAGE CONTENT ================= */}

        <div className="p-4 md:p-8 max-w-7xl mx-auto">

          {subtitle && (

            <p className="text-gray-500 mb-6 -mt-2 text-base md:text-lg">
              {subtitle}
            </p>

          )}

          {children}

        </div>

      </main>

    </div>

  );
}

export default DashboardLayout;