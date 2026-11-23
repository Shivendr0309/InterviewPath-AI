import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaBookOpen, FaCalendarAlt, FaClock, FaLayerGroup,
  FaTasks, FaChartLine, FaRobot, FaCheckCircle, FaHistory,
} from "react-icons/fa";
import api from "../api/axios";

const completionKey = (day, taskIndex) => `${day}:${taskIndex}`;

function StudyPlanner() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [days, setDays] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [activePlan, setActivePlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState("");
  const [message, setMessage] = useState("");

  const loadSavedPlans = useCallback(async () => {
    try {
      const response = await api.get("/study-planner");
      setSavedPlans(response.data.plans || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load your saved plans.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setHistoryLoading(false);
      setMessage("Please login to use your study planner.");
      return;
    }
    loadSavedPlans();
  }, [loadSavedPlans]);

  const totalTasks = useMemo(
    () => activePlan?.plan?.reduce((total, day) => total + (day.tasks?.length || 0), 0) || 0,
    [activePlan]
  );
  const completedCount = activePlan?.completedTasks?.length || 0;
  const progress = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

  const generatePlan = async () => {
    if (!topic.trim() || !days || !hoursPerDay) {
      setMessage("Please complete the topic, duration and daily study hours.");
      return;
    }
    if (!localStorage.getItem("token")) {
      setMessage("Please login to generate a study plan.");
      return;
    }
    const dayCount = Number(days);
    const dailyHours = Number(hoursPerDay);
    if (!Number.isInteger(dayCount) || dayCount < 1 || dayCount > 90) {
      setMessage("Choose a duration between 1 and 90 days.");
      return;
    }
    if (!Number.isFinite(dailyHours) || dailyHours < 0.5 || dailyHours > 12) {
      setMessage("Study time must be between 0.5 and 12 hours per day.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const response = await api.post("/study-planner/generate", {
        topic: topic.trim(),
        days: dayCount,
        hoursPerDay: dailyHours,
        skillLevel,
      });
      setActivePlan(response.data);
      setTopic(response.data.topic || topic.trim());
      await loadSavedPlans();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to generate study plan.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (day, taskIndex, checked) => {
    if (!activePlan?.planId) return;
    const key = completionKey(day, taskIndex);
    const previous = activePlan.completedTasks || [];
    const next = checked
      ? [...previous.filter((item) => item.key !== key), { key }]
      : previous.filter((item) => item.key !== key);
    setActivePlan((current) => ({ ...current, completedTasks: next }));
    setUpdatingTask(key);
    try {
      const response = await api.patch(`/study-planner/${activePlan.planId}/tasks`, {
        day, taskIndex, completed: checked,
      });
      setActivePlan((current) => ({ ...current, completedTasks: response.data.completedTasks || [] }));
      setSavedPlans((current) => current.map((item) =>
        item._id === activePlan.planId ? { ...item, completedTasks: response.data.completedTasks || [] } : item
      ));
    } catch (error) {
      setActivePlan((current) => ({ ...current, completedTasks: previous }));
      setMessage(error.response?.data?.message || "Could not save task progress. Please try again.");
    } finally {
      setUpdatingTask("");
    }
  };

  const openSavedPlan = (saved) => {
    setActivePlan({
      planId: saved._id,
      topic: saved.topic,
      days: saved.days,
      hoursPerDay: saved.hoursPerDay,
      skillLevel: saved.skillLevel || "Beginner",
      plan: saved.plan || [],
      completedTasks: saved.completedTasks || [],
    });
    setTopic(saved.topic);
    setDays(String(saved.days));
    setHoursPerDay(String(saved.hoursPerDay));
    setSkillLevel(saved.skillLevel || "Beginner");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FFFBFC] px-4 py-8 md:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#A53860] transition">
            <FaArrowLeft /><span>Back</span>
          </button>
          <div className="inline-flex items-center gap-2 bg-white border border-[#F1D5E0] text-[#670D2F] px-4 py-2 rounded-full shadow-sm font-semibold text-sm">
            <FaRobot /> AI Powered
          </div>
        </div>

        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#A53860] mb-3">Personalized Learning</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900"><span className="text-[#670D2F]">AI</span> Study Planner</h1>
          <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto">Build a realistic learning roadmap, track daily tasks and see your progress.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
          <section className="bg-white rounded-3xl border border-[#FCE5ED] shadow-sm p-6 md:p-9">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">Build your <span className="text-[#670D2F]">personalized study plan</span></h2>
              <p className="text-gray-500 text-sm mt-2">Set your goal, current level and available study time.</p>
            </div>

            <label className="block font-bold text-gray-900 mb-2">What do you want to study?</label>
            <div className="relative mb-5">
              <FaBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A53860]" />
              <input value={topic} onChange={(event) => { setTopic(event.target.value.slice(0, 100)); setMessage(""); }} maxLength={100}
                placeholder="e.g. Data Structures and Algorithms, React, SQL"
                className="w-full border border-[#F1D5E0] rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A53860]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-bold text-gray-900 mb-2">Duration (days)</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A53860]" />
                  <input type="number" min="1" max="90" value={days} onChange={(event) => setDays(event.target.value)}
                    placeholder="e.g. 30" className="w-full border border-[#F1D5E0] rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A53860]" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-900 mb-2">Study hours per day</label>
                <div className="relative">
                  <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A53860]" />
                  <input type="number" min="0.5" max="12" step="0.5" value={hoursPerDay} onChange={(event) => setHoursPerDay(event.target.value)}
                    placeholder="e.g. 3" className="w-full border border-[#F1D5E0] rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A53860]" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-900 mb-2">Your current skill level</label>
                <select value={skillLevel} onChange={(event) => setSkillLevel(event.target.value)}
                  className="w-full border border-[#F1D5E0] rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#A53860]">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
                <p className="text-xs text-gray-400 mt-2">The AI adjusts the pace and depth of the plan to this level.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex-1 bg-[#FFF7FA] border border-[#FCE5ED] rounded-2xl p-4 text-sm text-gray-600">
                Your plan will include daily topics and actionable tasks, with revision and practice built into the schedule.
              </div>
              <button onClick={generatePlan} disabled={loading}
                className="sm:w-64 bg-[#670D2F] hover:bg-[#3A0519] text-white font-bold px-6 py-4 rounded-2xl transition shadow-md disabled:opacity-50">
                {loading ? "Generating plan..." : "Generate Study Plan"}
              </button>
            </div>
            {message && <p role="alert" className="mt-4 text-sm text-red-600">{message}</p>}
            <p className="text-xs text-gray-400 mt-5">Plans are saved to your account so you can return and continue tracking progress.</p>
          </section>

          <aside className="bg-white rounded-3xl border border-[#FCE5ED] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <FaHistory className="text-[#670D2F]" /><h2 className="font-bold text-gray-900">Saved study plans</h2>
            </div>
            {historyLoading ? <p className="text-sm text-gray-400">Loading saved plans...</p> :
              savedPlans.length === 0 ? <p className="text-sm text-gray-500">Your generated plans will appear here.</p> :
                <div className="space-y-2">
                  {savedPlans.map((saved) => {
                    const count = saved.plan?.reduce((sum, item) => sum + (item.tasks?.length || 0), 0) || 0;
                    const done = saved.completedTasks?.length || 0;
                    const percent = count ? Math.round(done / count * 100) : 0;
                    return <button key={saved._id} onClick={() => openSavedPlan(saved)}
                      className={`w-full text-left border rounded-xl p-3 transition ${activePlan?.planId === saved._id ? "border-[#A53860] bg-[#FFF7FA]" : "border-[#F1D5E0] hover:border-[#A53860]"}`}>
                      <span className="block font-semibold text-sm text-gray-800 truncate">{saved.topic}</span>
                      <span className="block text-xs text-gray-500 mt-1">{saved.days} days · {saved.skillLevel || "Beginner"}</span>
                      <span className="block h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden"><span className="block h-full bg-[#A53860] rounded-full" style={{ width: `${percent}%` }} /></span>
                      <span className="block text-xs text-gray-400 mt-1">{percent}% complete</span>
                    </button>;
                  })}
                </div>
            }
          </aside>
        </div>

        {activePlan?.plan?.length > 0 && (
          <section className="mt-12">
            <div className="bg-white border border-[#FCE5ED] rounded-2xl p-6 md:p-7 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#A53860]">Your roadmap</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{activePlan.topic}</h2>
                  <p className="text-sm text-gray-500 mt-2">{activePlan.days} days · {activePlan.hoursPerDay} hours/day · {activePlan.skillLevel}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#670D2F]">{progress}%</p>
                  <p className="text-xs text-gray-500">{completedCount} of {totalTasks} tasks complete</p>
                </div>
              </div>
              <div className="h-2.5 bg-[#FCE5ED] rounded-full mt-5 overflow-hidden">
                <div className="h-full bg-[#A53860] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              {progress === 100 && <p className="text-sm text-green-700 font-semibold mt-3 flex items-center gap-2"><FaCheckCircle /> You completed this study plan. Great work!</p>}
            </div>

            <div className="space-y-5">
              {activePlan.plan.map((dayPlan) => (
                <article key={dayPlan.day} className="bg-white border border-[#FCE5ED] rounded-2xl shadow-sm overflow-hidden">
                  <header className="px-6 py-5 border-b border-[#FCE5ED] flex items-center justify-between bg-[#FFFDFE]">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#670D2F] text-white flex items-center justify-center font-bold">{dayPlan.day}</div>
                      <div><p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Study day</p><h3 className="text-xl font-bold text-[#670D2F]">Day {dayPlan.day}</h3></div>
                    </div>
                    <span className="text-sm font-semibold bg-[#FFF7FA] text-[#670D2F] px-4 py-2 rounded-full">{activePlan.hoursPerDay} hrs</span>
                  </header>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-7">
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><FaLayerGroup className="text-[#670D2F]" /> Topics</h4>
                      <div className="space-y-2">
                        {dayPlan.topics?.map((item, index) => <div key={index} className="bg-[#FFF7FA] border border-[#FCE5ED] rounded-xl px-4 py-3 text-sm text-gray-700">{item}</div>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><FaTasks className="text-[#A53860]" /> Tasks · {dayPlan.tasks?.filter((_, index) => (activePlan.completedTasks || []).some((entry) => entry.key === completionKey(dayPlan.day, index))).length || 0}/{dayPlan.tasks?.length || 0}</h4>
                      <div className="space-y-2">
                        {dayPlan.tasks?.map((item, index) => {
                          const key = completionKey(dayPlan.day, index);
                          const checked = (activePlan.completedTasks || []).some((entry) => entry.key === key);
                          return <label key={key} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition ${checked ? "bg-[#F3FAF5] border-green-200 text-gray-500" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                            <input type="checkbox" checked={checked} disabled={updatingTask === key} onChange={(event) => toggleTask(dayPlan.day, index, event.target.checked)}
                              className="mt-0.5 accent-[#670D2F]" />
                            <span className={checked ? "line-through" : ""}>{item}</span>
                          </label>;
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default StudyPlanner;
