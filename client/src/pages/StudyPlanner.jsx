import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
  FaLayerGroup,
  FaTasks,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";
import api from "../api/axios";

function StudyPlanner() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [days, setDays] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");

  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generatePlan = async () => {
    if (!topic.trim() || !days || !hoursPerDay) {
      setMessage("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to generate a study plan.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setPlan([]);

      const res = await api.post(
        "/study-planner/generate",
        {
          topic,
          days: Number(days),
          hoursPerDay: Number(hoursPerDay),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlan(res.data.plan || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to generate study plan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBFC] px-4 py-8 md:py-10">
      <div className="max-w-6xl mx-auto">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#A53860] transition"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <div className="inline-flex items-center gap-2 bg-white border border-[#F1D5E0] text-[#670D2F] px-4 py-2 rounded-full shadow-sm font-semibold text-sm">
            <FaRobot />
            AI Powered
          </div>
        </div>

        {/* =====================================================
            HERO
        ====================================================== */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#A53860] mb-3">
            Personalized Learning
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            <span className="text-[#670D2F]">AI</span> Study Planner
          </h1>

          <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto">
            Your personal roadmap to learn anything, the smart way.
          </p>
        </div>

        {/* =====================================================
            MAIN PLANNER
        ====================================================== */}
        <div className="bg-white rounded-3xl border border-[#FCE5ED] shadow-sm overflow-hidden">

          {/* TOP SECTION */}
          <div className="p-6 md:p-9">

            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">
                Let's build your{" "}
                <span className="text-[#670D2F]">
                  personalized study plan
                </span>
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Tell us what you want to learn and how much time
                you can dedicate.
              </p>
            </div>

            {/* =================================================
                TOPIC
            ================================================== */}
            <div className="border border-[#FCE5ED] rounded-2xl p-5 bg-[#FFFEFF]">

              <div className="flex gap-4 items-start">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center text-xl">
                  <FaBookOpen />
                </div>

                <div className="flex-1">

                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-gray-900">
                      What do you want to study?
                    </label>

                    <span className="text-xs text-gray-400">
                      {topic.length}/100
                    </span>
                  </div>

                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      setMessage("");
                    }}
                    placeholder="e.g. Data Structures and Algorithms, System Design, Python"
                    maxLength={100}
                    className="w-full border border-[#F1D5E0] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#A53860] focus:border-[#A53860]"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                DAYS + HOURS
            ================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

              {/* DAYS */}
              <div className="border border-[#FCE5ED] rounded-2xl p-5 bg-[#FFFEFF]">

                <div className="flex gap-4 items-start">

                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#FFF7FA] text-[#A53860] flex items-center justify-center text-xl">
                    <FaCalendarAlt />
                  </div>

                  <div className="flex-1">

                    <label className="block font-bold text-gray-900 mb-2">
                      Number of Days
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={days}
                        onChange={(e) => {
                          setDays(e.target.value);
                          setMessage("");
                        }}
                        placeholder="e.g. 30"
                        className="w-full border border-[#F1D5E0] rounded-xl px-4 py-3 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A53860] focus:border-[#A53860]"
                      />

                      <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A53860]" />
                    </div>

                  </div>
                </div>
              </div>

              {/* HOURS */}
              <div className="border border-[#FCE5ED] rounded-2xl p-5 bg-[#FFFEFF]">

                <div className="flex gap-4 items-start">

                  <div className="w-12 h-12 shrink-0 rounded-xl bg-[#FFF7FA] text-[#A53860] flex items-center justify-center text-xl">
                    <FaClock />
                  </div>

                  <div className="flex-1">

                    <label className="block font-bold text-gray-900 mb-2">
                      Study Hours Per Day
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={hoursPerDay}
                        onChange={(e) => {
                          setHoursPerDay(e.target.value);
                          setMessage("");
                        }}
                        placeholder="e.g. 3"
                        className="w-full border border-[#F1D5E0] rounded-xl px-4 py-3 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A53860] focus:border-[#A53860]"
                      />

                      <FaClock className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A53860]" />
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* =================================================
                INFO + BUTTON
            ================================================== */}
            <div className="mt-5 flex flex-col md:flex-row gap-4 items-stretch">

              <div className="flex-1 bg-[#FFF7FA] border border-[#FCE5ED] rounded-2xl p-4 flex items-start gap-3">

                <FaInfoCircle className="text-[#670D2F] mt-1 shrink-0" />

                <p className="text-sm text-gray-600 leading-relaxed">
                  We'll create a day-by-day plan with topics,
                  resources and tasks tailored to your goal and
                  available study time.
                </p>

              </div>

              <button
                onClick={generatePlan}
                disabled={loading}
                className="md:w-64 bg-[#670D2F] hover:bg-[#3A0519] text-white font-bold px-6 py-4 rounded-2xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Generating Study Plan..."
                  : "Generate Study Plan"}
              </button>

            </div>

            {message && (
              <div className="mt-4 text-center font-medium text-red-500 text-sm">
                {message}
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-5">
              🔒 Your study plan is generated privately for your session.
            </p>

          </div>

          {/* =================================================
              WHAT YOU'LL GET
          ================================================== */}
          <div className="border-t border-[#FCE5ED] bg-[#FFFBFC] p-6 md:p-8">

            <div className="flex items-center justify-center gap-4 mb-7">

              <div className="h-px bg-[#F1D5E0] flex-1 max-w-20" />

              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                What you'll get
              </h2>

              <div className="h-px bg-[#F1D5E0] flex-1 max-w-20" />

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* CARD 1 */}
              <div className="bg-white border border-[#FCE5ED] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition">

                <div className="w-11 h-11 rounded-xl bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center">
                  <FaCalendarAlt />
                </div>

                <h3 className="font-bold mt-4">
                  Day-by-Day Plan
                </h3>

                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                  Structured roadmap for each day
                </p>

              </div>

              {/* CARD 2 */}
              <div className="bg-white border border-[#FCE5ED] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition">

                <div className="w-11 h-11 rounded-xl bg-[#FFF7FA] text-[#A53860] flex items-center justify-center">
                  <FaLayerGroup />
                </div>

                <h3 className="font-bold mt-4">
                  Topics & Subtopics
                </h3>

                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                  Organized learning with key concepts
                </p>

              </div>

              {/* CARD 3 */}
              <div className="bg-white border border-[#FCE5ED] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition">

                <div className="w-11 h-11 rounded-xl bg-[#FFF7FA] text-[#A53860] flex items-center justify-center">
                  <FaTasks />
                </div>

                <h3 className="font-bold mt-4">
                  Tasks & Practice
                </h3>

                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                  Daily tasks to help you stay consistent
                </p>

              </div>

              {/* CARD 4 */}
              <div className="bg-white border border-[#FCE5ED] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition">

                <div className="w-11 h-11 rounded-xl bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center">
                  <FaChartLine />
                </div>

                <h3 className="font-bold mt-4">
                  Smart & Balanced
                </h3>

                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                  AI balances theory, practice and revision
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            GENERATED PLAN
        ====================================================== */}
        {plan.length > 0 && (
          <div className="mt-14">

            {/* SECTION HEADER */}
            <div className="mb-8">

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#A53860] mb-2">
                    Your Roadmap
                  </p>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Your Study Plan
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Personalized plan generated for{" "}
                    <span className="font-semibold text-[#670D2F]">
                      {topic}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white border border-[#F1D5E0] rounded-full px-4 py-2 text-sm text-gray-600">
                  <FaClock className="text-[#A53860]" />
                  {hoursPerDay} hrs / day
                </div>

              </div>

            </div>

            {/* PLAN */}
            <div className="space-y-5">

              {plan.map((dayPlan) => (

                <div
                  key={dayPlan.day}
                  className="bg-white border border-[#FCE5ED] rounded-2xl shadow-sm overflow-hidden"
                >

                  {/* DAY HEADER */}
                  <div className="px-6 md:px-7 py-5 border-b border-[#FCE5ED] flex items-center justify-between bg-[#FFFDFE]">

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-[#670D2F] text-white flex items-center justify-center font-bold">
                        {dayPlan.day}
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                          Study Day
                        </p>

                        <h3 className="text-xl font-bold text-[#670D2F]">
                          Day {dayPlan.day}
                        </h3>
                      </div>

                    </div>

                    <span className="text-sm font-semibold bg-[#FFF7FA] text-[#670D2F] px-4 py-2 rounded-full">
                      {hoursPerDay} hrs
                    </span>

                  </div>

                  {/* CONTENT */}
                  <div className="p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* TOPICS */}
                    <div>

                      <div className="flex items-center gap-2 mb-4">

                        <div className="w-8 h-8 rounded-lg bg-[#FFF7FA] flex items-center justify-center">
                          <FaLayerGroup className="text-[#670D2F] text-sm" />
                        </div>

                        <h4 className="font-bold text-gray-900">
                          Topics
                        </h4>

                      </div>

                      <div className="space-y-2.5">

                        {dayPlan.topics?.map((item, index) => (

                          <div
                            key={index}
                            className="flex items-start gap-3 bg-[#FFF7FA] border border-[#FCE5ED] rounded-xl px-4 py-3 text-sm text-gray-700"
                          >
                            <span className="w-5 h-5 rounded-full bg-white border border-[#E9C8D6] text-[#A53860] flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {index + 1}
                            </span>

                            <span>{item}</span>
                          </div>

                        ))}

                      </div>

                    </div>

                    {/* TASKS */}
                    <div>

                      <div className="flex items-center gap-2 mb-4">

                        <div className="w-8 h-8 rounded-lg bg-[#FFF7FA] flex items-center justify-center">
                          <FaTasks className="text-[#A53860] text-sm" />
                        </div>

                        <h4 className="font-bold text-gray-900">
                          Tasks
                        </h4>

                      </div>

                      <div className="space-y-2.5">

                        {dayPlan.tasks?.map((item, index) => (

                          <div
                            key={index}
                            className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700"
                          >
                            <span className="w-5 h-5 rounded-full border border-[#D9B0C1] bg-white shrink-0 mt-0.5" />

                            <span>{item}</span>
                          </div>

                        ))}

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default StudyPlanner;