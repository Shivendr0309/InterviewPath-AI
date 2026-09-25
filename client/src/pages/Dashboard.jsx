import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  FaHome,
  FaUser,
  FaBuilding,
  FaRoute,
  FaMicrophone,
  FaFileAlt,
  FaCode,
  FaSignOutAlt,
  FaChartLine,
  FaBookOpen,
  FaChevronLeft,
  FaChevronRight,
  FaBriefcase,
  FaUsers,
  FaHistory,
  FaArrowRight,
  FaCheck,
  FaBolt,
} from "react-icons/fa";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          navigate("/login");
          return;
        }

        const response = await api.get("/dashboard");
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // =====================================================
  // FETCH CURRENT USER
  // =====================================================

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("User fetch error:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // =====================================================
  // USER DATA
  // =====================================================

  const userName =
    user?.fullName ||
    user?.name ||
    "User";

  const firstName = userName.split(" ")[0];

  const userInitial =
    userName.charAt(0).toUpperCase();

  const profileImage =
    user?.profileImage ||
    user?.image ||
    null;

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const atsScore =
    dashboardData?.resume?.atsScore ?? 0;

  const interviewCount =
    dashboardData?.interviews?.count ?? 0;

  const latestInterviewScore =
    dashboardData?.interviews?.latestScore ?? null;

  const latestInterviewRole =
    dashboardData?.interviews?.latestRole ?? null;

  const studyPlanExists =
    dashboardData?.studyPlan?.exists ?? false;

  const studyPlanTopic =
    dashboardData?.studyPlan?.topic ?? null;

  const studyPlanDays =
    dashboardData?.studyPlan?.days ?? 0;

  const studyPlanHours =
    dashboardData?.studyPlan?.hoursPerDay ?? 0;

  // =====================================================
  // STATUS
  // =====================================================

  const atsStatus =
    atsScore >= 80
      ? "Excellent"
      : atsScore >= 60
      ? "Good"
      : atsScore > 0
      ? "Needs Improvement"
      : "Not Analyzed";

  const interviewStatus =
    latestInterviewScore === null
      ? "Not Started"
      : latestInterviewScore >= 8
      ? "Strong"
      : latestInterviewScore >= 6
      ? "Good"
      : "Keep Practicing";

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
    },
    {
      name: "Companies",
      path: "/companies",
      icon: <FaBuilding />,
    },
    {
      name: "Roadmaps",
      path: "/study-planner",
      icon: <FaRoute />,
    },
    {
      name: "AI Mock Interview",
      path: "/mock-interview",
      icon: <FaMicrophone />,
    },
    {
      name: "AI Resume Analyzer",
      path: "/resume-analyzer",
      icon: <FaFileAlt />,
    },
    {
      name: "Coding Practice",
      path: "/coding-practice",
      icon: <FaCode />,
    },
    {
      name: "Role Explorer",
      path: "/role-explorer",
      icon: <FaBriefcase />,
    },
    {
      name: "Interview Community",
      path: "/interview-community",
      icon: <FaUsers />,
    },
    {
      name: "History",
      path: "/history",
      icon: <FaHistory />,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] flex">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          hidden md:flex
          fixed left-0 top-0 bottom-0 z-30
          bg-white
          border-r border-[var(--secondary)]
          flex-col
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
        `}
      >

        {/* LOGO */}

        <div className="h-20 px-5 border-b border-[var(--secondary)] flex items-center justify-between">

          {sidebarOpen ? (
            <Link
              to="/dashboard"
              className="text-xl font-bold text-[var(--primary)] whitespace-nowrap"
            >
              InterviewPath AI
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="text-xl font-bold text-[var(--primary)] mx-auto"
            >
              IP
            </Link>
          )}

          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="
                w-8 h-8
                flex items-center justify-center
                rounded-lg
                border border-[var(--secondary)]
                text-gray-500
                hover:text-[var(--primary)]
                hover:bg-[var(--background)]
                transition
              "
            >
              <FaChevronLeft />
            </button>
          )}

          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                absolute -right-4 top-6
                w-8 h-8
                bg-white
                border border-[var(--secondary)]
                rounded-full
                flex items-center justify-center
                text-gray-500
                hover:text-[var(--primary)]
                shadow-sm
              "
            >
              <FaChevronRight />
            </button>
          )}

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">

          {navItems.map((item) => {

            const isActive =
              item.path === "/dashboard";

            return (
              <Link
                key={item.name}
                to={item.path}
                title={!sidebarOpen ? item.name : ""}
                className={`
                  flex items-center
                  ${sidebarOpen
                    ? "gap-3 px-4"
                    : "justify-center px-2"
                  }
                  py-3
                  rounded-xl
                  transition
                  ${
                    isActive
                      ? "bg-[var(--background)] text-[var(--primary)] font-semibold"
                      : "text-[var(--text)] hover:bg-[var(--background)] hover:text-[var(--primary)]"
                  }
                `}
              >
                <span className="text-lg shrink-0">
                  {item.icon}
                </span>

                {sidebarOpen && (
                  <span className="text-sm whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}

        </nav>

        {/* LOGOUT */}

        <div className="p-3 border-t border-[var(--secondary)]">

          <button
            onClick={handleLogout}
            title={!sidebarOpen ? "Logout" : ""}
            className={`
              w-full flex items-center
              ${sidebarOpen
                ? "gap-3 px-4"
                : "justify-center px-2"
              }
              py-3
              rounded-xl
              text-gray-600
              hover:bg-[var(--background)]
              hover:text-[var(--primary)]
              transition
            `}
          >
            <FaSignOutAlt />

            {sidebarOpen && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className={`
          flex-1 min-w-0
          transition-all duration-300
          ${sidebarOpen ? "md:ml-64" : "md:ml-20"}
        `}
      >

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-[var(--secondary)]">

          <div className="px-5 md:px-8 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

  <Link
    to="/home"
    className="
      inline-flex
      items-center
      gap-2
      px-3
      py-2
      rounded-lg
      border
      border-[var(--secondary)]
      text-sm
      font-medium
      text-gray-600
      hover:text-[var(--primary)]
      hover:bg-[var(--background)]
      transition
    "
  >
    <FaHome className="text-xs" />
    Home
  </Link>

  <div className="h-8 w-px bg-[var(--secondary)]" />

  <div>
    <p className="text-xs font-semibold tracking-widest uppercase text-[var(--primary)]">
      InterviewPath AI
    </p>

    <h2 className="text-lg font-bold text-[var(--text)] mt-0.5">
      Dashboard
    </h2>
  </div>

</div>

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 hover:opacity-80 transition"
            >

              <div className="
                w-10 h-10
                rounded-full
                bg-[var(--primary)]
                text-white
                flex items-center justify-center
                font-semibold
                overflow-hidden
              ">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </div>

              <div className="hidden sm:block text-left">
                <p className="font-semibold text-sm text-[var(--text)]">
                  {userName}
                </p>

                <p className="text-xs text-gray-500">
                  {user?.role === "admin"
                    ? "Administrator"
                    : "Candidate"}
                </p>
              </div>

            </button>

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">

          {/* =================================================
              HERO
          ================================================= */}

          <section className="
            relative
            overflow-hidden
            rounded-3xl
            bg-white
            border border-[var(--secondary)]
            p-7 md:p-9
            mb-7
          ">

            {/* Decorative shape */}

            <div className="
              absolute
              -right-20
              -top-24
              w-64 h-64
              rounded-full
              bg-[var(--background)]
            " />

            <div className="
              absolute
              right-16
              -bottom-20
              w-40 h-40
              rounded-full
              bg-[var(--soft-pink)]
              opacity-40
            " />

            <div className="relative">

              <div className="
                inline-flex items-center gap-2
                px-3 py-1.5
                rounded-full
                bg-[var(--background)]
                border border-[var(--secondary)]
                text-[var(--primary)]
                text-xs font-semibold
              ">
                <FaBolt className="text-[10px]" />
                YOUR PREPARATION HUB
              </div>

              <h1 className="
                text-3xl md:text-4xl
                font-bold
                text-[var(--text)]
                mt-5
              ">
                Welcome back, {firstName} 👋
              </h1>

              <p className="
                text-gray-500
                mt-2
                max-w-xl
                text-base md:text-lg
              ">
                Everything you need to prepare, practice,
                and become interview-ready.
              </p>

            </div>

          </section>

          {/* =================================================
              OVERVIEW
          ================================================= */}

          <section className="mb-8">

            <SectionHeading
              title="Your Overview"
              description="A quick look at your preparation progress."
            />

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
            ">

              {/* ATS */}

              <OverviewCard
                icon={<FaFileAlt />}
                label="Resume ATS Score"
                value={loading ? "..." : `${atsScore}%`}
                status={atsStatus}
                progress={atsScore}
                description={
                  dashboardData?.resume
                    ? "Based on your latest resume analysis."
                    : "Analyze your resume to get your score."
                }
                primary
              />

              {/* INTERVIEWS */}

              <OverviewCard
                icon={<FaMicrophone />}
                label="Mock Interviews"
                value={loading ? "..." : interviewCount}
                status={interviewStatus}
                description={
                  latestInterviewScore !== null
                    ? `Latest score: ${latestInterviewScore}/10`
                    : "Start your first AI interview."
                }
              />

              {/* STUDY PLAN */}

              <OverviewCard
                icon={<FaRoute />}
                label="Study Plan"
                value={
                  loading
                    ? "..."
                    : studyPlanExists
                    ? studyPlanTopic
                    : "Not Created"
                }
                status={
                  studyPlanExists
                    ? `${studyPlanDays} days`
                    : "Get started"
                }
                description={
                  studyPlanExists
                    ? `${studyPlanHours} hrs/day`
                    : "Create your personalized study plan."
                }
              />

            </div>

          </section>

          {/* =================================================
              PREPARATION
          ================================================= */}

          <section className="mb-8">

            <SectionHeading
              title="Your Preparation"
              description="See where you currently stand."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* RESUME */}

              <div className="
                bg-white
                border border-[var(--secondary)]
                rounded-2xl
                p-6
              ">

                <div className="flex items-start justify-between">

                  <div className="
                    w-11 h-11
                    rounded-xl
                    bg-[var(--background)]
                    text-[var(--primary)]
                    flex items-center justify-center
                  ">
                    <FaFileAlt />
                  </div>

                  <span className="
                    text-xs font-semibold
                    px-3 py-1.5
                    rounded-full
                    bg-[var(--background)]
                    text-[var(--primary)]
                  ">
                    {atsStatus}
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-gray-500">
                    Resume Analysis
                  </p>

                  <div className="flex items-end gap-2 mt-1">
                    <span className="
                      text-3xl
                      font-bold
                      text-[var(--primary)]
                    ">
                      {loading ? "..." : `${atsScore}%`}
                    </span>

                    <span className="text-sm text-gray-400 mb-1">
                      ATS score
                    </span>
                  </div>

                  <div className="
                    h-2
                    bg-[var(--background)]
                    rounded-full
                    mt-4
                    overflow-hidden
                  ">
                    <div
                      className="
                        h-full
                        bg-[var(--primary)]
                        rounded-full
                        transition-all duration-700
                      "
                      style={{
                        width: `${Math.min(
                          Math.max(atsScore, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-3">
                    {dashboardData?.resume
                      ? dashboardData.resume.fileName
                      : "Upload and analyze your resume."}
                  </p>

                </div>

                <Link
                  to="/resume-analyzer"
                  className="
                    inline-flex items-center gap-2
                    mt-5
                    text-sm font-semibold
                    text-[var(--primary)]
                    hover:gap-3
                    transition-all
                  "
                >
                  {dashboardData?.resume
                    ? "View Analysis"
                    : "Analyze Resume"}
                  <FaArrowRight className="text-xs" />
                </Link>

              </div>

              {/* INTERVIEW */}

              <div className="
                bg-white
                border border-[var(--secondary)]
                rounded-2xl
                p-6
              ">

                <div className="flex items-start justify-between">

                  <div className="
                    w-11 h-11
                    rounded-xl
                    bg-[var(--background)]
                    text-[var(--primary)]
                    flex items-center justify-center
                  ">
                    <FaMicrophone />
                  </div>

                  <span className="
                    text-xs font-semibold
                    px-3 py-1.5
                    rounded-full
                    bg-[var(--background)]
                    text-[var(--primary)]
                  ">
                    {interviewStatus}
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-sm text-gray-500">
                    Latest Interview
                  </p>

                  <div className="flex items-end gap-2 mt-1">

                    <span className="
                      text-3xl
                      font-bold
                      text-[var(--text)]
                    ">
                      {latestInterviewScore !== null
                        ? `${latestInterviewScore}/10`
                        : "—"}
                    </span>

                    {latestInterviewRole && (
                      <span className="text-sm text-gray-400 mb-1">
                        {latestInterviewRole}
                      </span>
                    )}

                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    {latestInterviewScore !== null
                      ? `You've completed ${interviewCount} mock interview${
                          interviewCount !== 1 ? "s" : ""
                        }.`
                      : "Practice with an AI-powered mock interview."}
                  </p>

                </div>

                <Link
                  to="/mock-interview"
                  className="
                    inline-flex items-center gap-2
                    mt-5
                    text-sm font-semibold
                    text-[var(--primary)]
                    hover:gap-3
                    transition-all
                  "
                >
                  {latestInterviewScore !== null
                    ? "Practice Again"
                    : "Start Interview"}
                  <FaArrowRight className="text-xs" />
                </Link>

              </div>

            </div>

          </section>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <section className="
            bg-white
            border border-[var(--secondary)]
            rounded-2xl
            p-6 md:p-7
            mb-8
          ">

            <SectionHeading
              title="Your Progress"
              description="Complete these core preparation activities."
            />

            <div className="space-y-6">

              <ProgressItem
                title="Resume Analysis"
                description="Analyze your resume and improve your ATS score."
                current={dashboardData?.resume ? 1 : 0}
                total={1}
                icon={<FaFileAlt />}
              />

              <ProgressItem
                title="Mock Interview"
                description="Complete an AI-powered interview session."
                current={interviewCount > 0 ? 1 : 0}
                total={1}
                icon={<FaMicrophone />}
              />

              <ProgressItem
                title="Study Plan"
                description={
                  studyPlanExists
                    ? `Learning ${studyPlanTopic}`
                    : "Create a personalized study plan."
                }
                current={studyPlanExists ? 1 : 0}
                total={1}
                icon={<FaRoute />}
              />

            </div>

          </section>

          {/* =================================================
              STUDY PLAN
          ================================================= */}

          <section className="
            bg-[var(--primary)]
            rounded-2xl
            p-6 md:p-7
            text-white
            mb-8
            relative overflow-hidden
          ">

            <div className="
              absolute
              -right-12
              -top-16
              w-48 h-48
              rounded-full
              bg-white/5
            " />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
                  <FaRoute />
                  Study Roadmap
                </div>

                <h2 className="text-2xl font-bold mt-3">
                  {studyPlanExists
                    ? studyPlanTopic
                    : "Build your personalized roadmap"}
                </h2>

                <p className="text-white/70 text-sm mt-2">
                  {studyPlanExists
                    ? `${studyPlanDays} days • ${studyPlanHours} hours per day`
                    : "Plan what to learn and stay consistent."}
                </p>

              </div>

              <Link
                to="/study-planner"
                className="
                  shrink-0
                  inline-flex items-center justify-center gap-2
                  bg-white
                  text-[var(--primary)]
                  px-5 py-3
                  rounded-xl
                  text-sm font-semibold
                  hover:bg-[var(--background)]
                  transition
                "
              >
                {studyPlanExists
                  ? "Continue Plan"
                  : "Create Plan"}
                <FaArrowRight className="text-xs" />
              </Link>

            </div>

          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section>

            <SectionHeading
              title="Continue Preparing"
              description="Jump directly into your next activity."
            />

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
            ">

              <QuickAction
                to="/mock-interview"
                icon={<FaMicrophone />}
                title="AI Mock Interview"
                description="Practice with AI"
              />

              <QuickAction
                to="/resume-analyzer"
                icon={<FaFileAlt />}
                title="Resume Analyzer"
                description="Improve your ATS score"
              />

              <QuickAction
                to="/study-planner"
                icon={<FaRoute />}
                title="Study Planner"
                description="Build your roadmap"
              />

              <QuickAction
                to="/coding-practice"
                icon={<FaCode />}
                title="Coding Practice"
                description="Improve your DSA"
              />

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

// =====================================================
// SECTION HEADING
// =====================================================

function SectionHeading({ title, description }) {
  return (
    <div className="mb-5">

      <h2 className="
        text-xl
        font-bold
        text-[var(--text)]
      ">
        {title}
      </h2>

      <p className="
        text-sm
        text-gray-500
        mt-1
      ">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// OVERVIEW CARD
// =====================================================

function OverviewCard({
  icon,
  label,
  value,
  status,
  description,
  progress,
  primary = false,
}) {
  return (
    <div className="
      bg-white
      border border-[var(--secondary)]
      rounded-2xl
      p-5
      hover:shadow-md
      transition
    ">

      <div className="flex items-center justify-between">

        <div className="
          w-10 h-10
          rounded-xl
          bg-[var(--background)]
          text-[var(--primary)]
          flex items-center justify-center
        ">
          {icon}
        </div>

        <span className="
          text-xs
          font-semibold
          text-[var(--primary)]
        ">
          {status}
        </span>

      </div>

      <p className="
        text-sm
        text-gray-500
        mt-5
      ">
        {label}
      </p>

      <h3
        className={`
          font-bold
          mt-1
          ${
            primary
              ? "text-3xl text-[var(--primary)]"
              : "text-xl text-[var(--text)]"
          }
        `}
      >
        {value}
      </h3>

      {progress !== undefined && (
        <div className="
          h-1.5
          bg-[var(--background)]
          rounded-full
          mt-4
          overflow-hidden
        ">
          <div
            className="
              h-full
              bg-[var(--primary)]
              rounded-full
            "
            style={{
              width: `${Math.min(
                Math.max(progress, 0),
                100
              )}%`,
            }}
          />
        </div>
      )}

      <p className="
        text-xs
        text-gray-500
        mt-3
        line-clamp-2
      ">
        {description}
      </p>

    </div>
  );
}

// =====================================================
// PROGRESS ITEM
// =====================================================

function ProgressItem({
  title,
  description,
  current,
  total,
  icon,
}) {
  const percentage =
    total > 0
      ? (current / total) * 100
      : 0;

  const completed = current >= total;

  return (
    <div>

      <div className="
        flex
        justify-between
        items-center
        gap-4
        mb-2
      ">

        <div className="flex items-center gap-3 min-w-0">

          <div className="
            w-10 h-10
            shrink-0
            rounded-xl
            bg-[var(--background)]
            text-[var(--primary)]
            flex items-center justify-center
          ">
            {completed ? (
              <FaCheck className="text-sm" />
            ) : (
              icon
            )}
          </div>

          <div className="min-w-0">

            <p className="
              font-semibold
              text-[var(--text)]
              text-sm
            ">
              {title}
            </p>

            <p className="
              text-xs
              text-gray-500
              mt-0.5
              truncate
            ">
              {description}
            </p>

          </div>

        </div>

        <span className="
          shrink-0
          text-xs
          font-semibold
          text-gray-500
        ">
          {completed ? "Complete" : `${current}/${total}`}
        </span>

      </div>

      <div className="
        ml-13
        h-2
        bg-[var(--background)]
        rounded-full
        overflow-hidden
      ">

        <div
          className="
            h-full
            bg-[var(--primary)]
            rounded-full
            transition-all duration-500
          "
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

// =====================================================
// QUICK ACTION
// =====================================================

function QuickAction({
  to,
  icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="
        group
        bg-white
        border border-[var(--secondary)]
        rounded-2xl
        p-5
        hover:-translate-y-1
        hover:shadow-md
        transition-all
      "
    >

      <div className="
        w-11 h-11
        rounded-xl
        bg-[var(--background)]
        text-[var(--primary)]
        flex items-center justify-center
        text-lg
        group-hover:bg-[var(--primary)]
        group-hover:text-white
        transition
      ">
        {icon}
      </div>

      <h3 className="
        font-semibold
        text-[var(--text)]
        mt-4
      ">
        {title}
      </h3>

      <div className="
        flex items-center justify-between
        mt-2
      ">

        <p className="
          text-sm
          text-gray-500
        ">
          {description}
        </p>

        <FaArrowRight className="
          text-xs
          text-[var(--primary)]
          group-hover:translate-x-1
          transition
        " />

      </div>

    </Link>
  );
}

export default Dashboard;