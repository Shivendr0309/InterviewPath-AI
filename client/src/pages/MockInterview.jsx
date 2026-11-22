import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRobot,
  FaBriefcase,
  FaBuilding,
  FaCode,
  FaListAlt,
  FaLayerGroup,
  FaGraduationCap,
  FaChartLine,
  FaCheck,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";
import api from "../api/axios";

function MockInterview() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [candidateContext, setCandidateContext] = useState("");

  const [interviewType, setInterviewType] =
    useState("Technical");

  const [questionType, setQuestionType] =
    useState("Descriptive");

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [experienceLevel, setExperienceLevel] =
    useState("Fresher");

  const [questionCount, setQuestionCount] =
    useState(5);

  const [focusAreas, setFocusAreas] = useState([]);

  const availableFocusAreas = [
    "DSA",
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "System Design",
  ];

  const [questionId, setQuestionId] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");

  const [previousQuestions, setPreviousQuestions] =
    useState([]);

  const [questionNumber, setQuestionNumber] =
    useState(0);

  const [history, setHistory] = useState([]);

  const [evaluation, setEvaluation] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [finished, setFinished] =
    useState(false);

  const toggleFocusArea = (area) => {
    setFocusAreas((prev) =>
      prev.includes(area)
        ? prev.filter((item) => item !== area)
        : [...prev, area]
    );
  };

  // ============================================================
  // START INTERVIEW
  // ============================================================

  const startInterview = async () => {
    if (!role.trim()) {
      setError("Please enter your target role.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/interview/start",
        {
          role,
          company,
          jobDescription,
          candidateContext,
          interviewType,
          questionType,
          difficulty,
          experienceLevel,
          questionCount,
          focusAreas,
          previousQuestions: [],
        }
      );

      const newQuestion = response.data.question;

      setQuestionId(response.data.questionId);
      setQuestion(newQuestion);

      setOptions(response.data.options || []);

      setPreviousQuestions([newQuestion]);

      setQuestionNumber(1);
      setAnswer("");
      setHistory([]);
      setEvaluation(null);
      setFinished(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to start the interview."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const getNextQuestion = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/interview/start",
        {
          role,
          company,
          jobDescription,
          candidateContext,
          interviewType,
          questionType,
          difficulty,
          experienceLevel,
          questionCount,
          focusAreas,
          previousQuestions,
        }
      );

      const newQuestion = response.data.question;

      setQuestionId(response.data.questionId);
      setQuestion(newQuestion);

      setOptions(response.data.options || []);

      setPreviousQuestions((prev) => [
        ...prev,
        newQuestion,
      ]);

      setQuestionNumber((prev) => prev + 1);
      setAnswer("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate the next question."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FINAL EVALUATION
  // ============================================================

  const generateFinalEvaluation = async (responses) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/interview/final-evaluation",
        {
          role,
          company,
          jobDescription,
          candidateContext,
          interviewType,
          questionType,
          difficulty,
          experienceLevel,
          focusAreas,
          responses,
        }
      );

      setEvaluation(response.data.evaluation);

      setFinished(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate final interview evaluation."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SUBMIT ANSWER
  // ============================================================

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError(
        questionType === "MCQ"
          ? "Please select an option."
          : "Please provide an answer."
      );
      return;
    }

    if (!questionId) {
      setError(
        "Question information is missing. Please restart the interview."
      );
      return;
    }

    setError("");

    const currentResponse = {
      questionId,
      question,
      answer,
    };

    const updatedHistory = [
      ...history,
      currentResponse,
    ];

    setHistory(updatedHistory);
    setAnswer("");

    if (
      questionNumber >= Number(questionCount)
    ) {
      await generateFinalEvaluation(
        updatedHistory
      );
      return;
    }

    await getNextQuestion();
  };

  // ============================================================
  // FINISH EARLY
  // ============================================================

  const finishInterviewEarly = async () => {
    if (history.length === 0) {
      setError(
        "Please answer at least one question first."
      );
      return;
    }

    await generateFinalEvaluation(history);
  };

  // ============================================================
  // RESET
  // ============================================================

  const startNewInterview = () => {
    setRole("");
    setCompany("");
    setJobDescription("");
    setCandidateContext("");

    setInterviewType("Technical");
    setQuestionType("Descriptive");
    setDifficulty("Medium");
    setExperienceLevel("Fresher");
    setQuestionCount(5);
    setFocusAreas([]);

    setQuestionId(null);
    setQuestion("");
    setOptions([]);
    setAnswer("");
    setPreviousQuestions([]);
    setQuestionNumber(0);
    setHistory([]);
    setEvaluation(null);
    setLoading(false);
    setError("");
    setFinished(false);
  };

  // ============================================================
  // RESULT SCREEN
  // ============================================================

  if (finished && evaluation) {
    return (
      <div className="min-h-screen bg-[#FFFBFC] px-4 py-8 md:py-10">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#A53860] transition"
            >
              <FaArrowLeft />
              Back
            </button>

            <span className="inline-flex items-center gap-2 bg-white border border-[#F1D5E0] text-[#670D2F] px-4 py-2 rounded-full text-sm font-semibold">
              <FaRobot />
              AI Interview
            </span>
          </div>

          {/* RESULT HERO */}
          <div className="text-center mb-12">

            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FCE5ED] text-[#670D2F] rounded-full text-sm font-semibold">
              <FaCheck />
              Interview Completed
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-5">
              Interview Summary
            </h1>

            <p className="text-gray-500 mt-3">
              {role}
              {company && ` • ${company}`}
            </p>

          </div>

          {/* SCORE */}
          <div className="bg-white border border-[#F1D5E0] rounded-3xl p-8 md:p-10 text-center shadow-sm mb-6">

            <p className="text-sm uppercase tracking-widest text-gray-400 font-semibold">
              Overall Score
            </p>

            <p className="text-6xl md:text-7xl font-bold text-[#A53860] mt-4">
              {evaluation.overallScore}/10
            </p>

            <p className="text-gray-500 mt-3">
              {history.length} question
              {history.length !== 1 ? "s" : ""} answered
            </p>

          </div>

          {/* SCORE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

            <ScoreCard
              title="Technical Knowledge"
              score={evaluation.technicalScore}
            />

            <ScoreCard
              title="Problem Solving"
              score={evaluation.problemSolvingScore}
            />

            <ScoreCard
              title="Communication"
              score={evaluation.communicationScore}
            />

          </div>

          {/* CONFIGURATION */}
          <div className="bg-white border border-[#F1D5E0] rounded-2xl p-6 md:p-7 mb-6">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center">
                <FaChartLine />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Interview Configuration
                </h2>

                <p className="text-sm text-gray-400">
                  Your selected interview preferences
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <Info
                label="Interview Type"
                value={interviewType}
              />

              <Info
                label="Question Format"
                value={questionType}
              />

              <Info
                label="Difficulty"
                value={difficulty}
              />

              <Info
                label="Experience"
                value={experienceLevel}
              />

              <Info
                label="Question Count"
                value={questionCount}
              />

              <Info
                label="Focus Areas"
                value={
                  focusAreas.length
                    ? focusAreas.join(", ")
                    : "General"
                }
              />

            </div>
          </div>

          {/* STRENGTHS */}
          <ResultSection
            title="Strengths"
            subtitle="What you did well"
            items={evaluation.strengths}
          />

          {/* WEAK AREAS */}
          <ResultSection
            title="Areas to Improve"
            subtitle="Where you can improve"
            items={evaluation.weakAreas}
          />

          {/* RECOMMENDATIONS */}
          <ResultSection
            title="Recommendations"
            subtitle="What to focus on next"
            items={evaluation.recommendations}
          />

          {/* OVERALL FEEDBACK */}
          <div className="bg-white border border-[#F1D5E0] rounded-2xl p-6 md:p-7 mt-6">

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7FA] text-[#A53860] flex items-center justify-center">
                <FaRobot />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Overall Feedback
                </h2>

                <p className="text-sm text-gray-400">
                  AI-generated interview assessment
                </p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {evaluation.overallFeedback}
            </p>

          </div>

          {/* RESPONSES */}
          <div className="bg-white border border-[#F1D5E0] rounded-2xl p-6 md:p-7 mt-6">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Interview Responses
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Review the answers you gave during the interview.
              </p>
            </div>

            <div className="space-y-4">

              {history.map((item, index) => (
                <div
                  key={index}
                  className="border border-[#F1D5E0] rounded-xl p-5 bg-[#FFFBFC]"
                >

                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-[#670D2F] text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>

                    <p className="font-semibold text-gray-900">
                      Question {index + 1}
                    </p>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {item.question}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#F1D5E0]">
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Your Answer</p>
                    <p className="text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                  </div>
                  {evaluation.questionFeedback?.[index] && (
                    <div className="mt-4 rounded-xl border border-[#F1D5E0] bg-white p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3"><p className="font-semibold text-[#670D2F]">AI feedback</p><span className="rounded-full bg-[#FCE5ED] px-3 py-1 text-sm font-bold text-[#670D2F]">{evaluation.questionFeedback[index].score ?? 0}/10</span></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{evaluation.questionFeedback[index].feedback}</p>
                      {evaluation.questionFeedback[index].strengths?.length > 0 && <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">What went well</p><ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">{evaluation.questionFeedback[index].strengths.map((entry, i) => <li key={i}>{entry}</li>)}</ul></div>}
                      {evaluation.questionFeedback[index].improvements?.length > 0 && <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Improve next time</p><ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">{evaluation.questionFeedback[index].improvements.map((entry, i) => <li key={i}>{entry}</li>)}</ul></div>}
                      {evaluation.questionFeedback[index].idealAnswer && <div><p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Stronger answer approach</p><p className="text-sm text-gray-700 leading-relaxed">{evaluation.questionFeedback[index].idealAnswer}</p></div>}
                    </div>
                  )}

                </div>
              ))}

            </div>
          </div>

          {/* NEW INTERVIEW */}
          <button
            onClick={startNewInterview}
            className="w-full mt-6 bg-[#670D2F] hover:bg-[#3A0519] text-white py-4 rounded-2xl font-bold transition shadow-md"
          >
            Start New Interview
          </button>

        </div>
      </div>
    );
  }

  // ============================================================
  // INTERVIEW SCREEN
  // ============================================================

  if (question) {
    const progress =
      (questionNumber / Number(questionCount)) * 100;

    return (
      <div className="min-h-screen bg-[#FFFBFC] px-4 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#A53860] transition"
            >
              <FaArrowLeft />
              Exit Interview
            </button>

            <span className="text-sm font-semibold text-gray-500">
              QUESTION{" "}
              {String(questionNumber).padStart(2, "0")}
              {" / "}
              {String(questionCount).padStart(2, "0")}
            </span>

          </div>

          {/* PROGRESS */}
          <div className="mb-10">

            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Interview Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="w-full h-2 bg-[#F1D5E0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A53860] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                }}
              />
            </div>

          </div>

          {/* INTERVIEW CONTEXT */}
          <div className="flex flex-wrap gap-2 mb-5">

            <span className="px-3 py-1.5 rounded-full bg-[#FCE5ED] text-[#670D2F] text-xs font-semibold">
              {interviewType}
            </span>

            <span className="px-3 py-1.5 rounded-full bg-[#FFF0F5] text-[#A53860] text-xs font-semibold">
              {questionType}
            </span>

            <span className="px-3 py-1.5 rounded-full bg-[#FCE5ED] text-[#670D2F] text-xs font-semibold">
              {difficulty}
            </span>

          </div>

          {/* QUESTION */}
          <div className="bg-white border border-[#F1D5E0] rounded-3xl shadow-sm p-6 md:p-10">

            <p className="text-sm uppercase tracking-wider text-[#A53860] font-bold mb-4">
              Interview Question
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
              {question}
            </h1>

            {/* MCQ */}
            {questionType === "MCQ" && (
              <div className="mt-8 space-y-3">

                {options.length > 0 ? (
                  options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setAnswer(option);
                        setError("");
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition ${
                        answer === option
                          ? "border-[#A53860] bg-[#FFF7FA] text-[#670D2F]"
                          : "border-[#F1D5E0] hover:border-[#A53860] bg-white"
                      }`}
                    >

                      <div className="flex items-center gap-4">

                        <span
                          className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold text-sm ${
                            answer === option
                              ? "bg-[#670D2F] text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        <span>
                          {option}
                        </span>

                      </div>

                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No MCQ options were returned.
                  </p>
                )}

              </div>
            )}

            {/* DESCRIPTIVE */}
            {questionType !== "MCQ" &&
              questionType !== "Coding" && (
                <textarea
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setError("");
                  }}
                  rows={9}
                  placeholder="Type your answer here..."
                  className="w-full mt-8 border border-[#F1D5E0] rounded-2xl p-5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A53860] resize-none"
                />
              )}

            {/* CODING */}
            {questionType === "Coding" && (
              <textarea
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError("");
                }}
                rows={16}
                placeholder="// Write your code here..."
                className="w-full mt-8 bg-gray-900 text-green-300 border border-gray-700 rounded-2xl p-5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#A53860] resize-none"
              />
            )}

            {error && (
              <p className="text-red-500 text-sm mt-4">
                {error}
              </p>
            )}

            {/* ACTION */}
            <button
              onClick={submitAnswer}
              disabled={
                loading || !answer.trim()
              }
              className="w-full mt-6 bg-[#670D2F] hover:bg-[#3A0519] text-white py-4 rounded-2xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving Answer..."
                : questionNumber >= Number(questionCount)
                ? "Finish Interview"
                : "Submit Answer →"}
            </button>

            {history.length > 0 &&
              questionNumber <
                Number(questionCount) && (
                <button
                  onClick={finishInterviewEarly}
                  disabled={loading}
                  className="w-full mt-3 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-semibold transition disabled:opacity-50"
                >
                  {loading
                    ? "Generating Final Report..."
                    : "Finish Interview Early"}
                </button>
              )}

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // SETUP SCREEN
  // ============================================================

  const questionFormats =
    interviewType === "Coding"
      ? ["Coding"]
      : interviewType === "Behavioral" || interviewType === "System Design"
      ? ["Descriptive"]
      : ["Descriptive", "MCQ"];

  const applyPreset = (preset) => {
    setRole(preset.role);
    setInterviewType(preset.type);
    setQuestionType(preset.format);
    setDifficulty(preset.difficulty || "Medium");
    setExperienceLevel("Fresher");
    setQuestionCount(preset.count || 10);
    setFocusAreas(preset.focus);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FFFBFC] px-4 py-7 md:px-6 md:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#A53860] transition font-medium">
            <FaArrowLeft /> Back
          </button>
          <span className="inline-flex items-center gap-2 bg-white border border-[#F1D5E0] text-[#670D2F] px-4 py-2 rounded-full shadow-sm font-semibold text-sm">
            <FaRobot /> AI Powered
          </span>
        </div>

        <section className="relative overflow-hidden rounded-3xl bg-white border border-[#F1D5E0] p-6 md:p-9 mb-8">
          <div className="absolute -right-16 -top-24 w-72 h-72 rounded-full bg-[#FFF0F5]" />
          <div className="relative max-w-3xl">
            <p className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#A53860] mb-3">Practice · Improve · Succeed</p>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              Your next interview starts <span className="text-[#A53860]">here.</span>
            </h1>
            <p className="text-gray-600 mt-4 text-base md:text-lg max-w-2xl">
              Build a realistic practice session tailored to your target role, job description and experience.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF7FA] text-[#670D2F] px-3 py-2 font-semibold"><FaCheck /> Resume-aware questions</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF7FA] text-[#670D2F] px-3 py-2 font-semibold"><FaChartLine /> Detailed AI feedback</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#A53860]">Quick start</p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Choose an interview template</h2>
            </div>
            <p className="text-sm text-gray-500">You can customize every setting below.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { title: "MERN Stack Developer", subtitle: "JavaScript · React · Node · MongoDB", icon: <FaCode />, role: "MERN Stack Developer", type: "Technical", format: "Descriptive", focus: ["JavaScript", "React", "Node.js", "MongoDB"] },
              { title: "DSA Interview", subtitle: "Algorithms · Data structures", icon: <FaLayerGroup />, role: "Software Developer", type: "Coding", format: "Coding", focus: ["DSA"] },
              { title: "HR Interview", subtitle: "Behavioral · Communication", icon: <FaGraduationCap />, role: "Software Engineer", type: "Behavioral", format: "Descriptive", focus: [] },
              { title: "System Design", subtitle: "Architecture · Scalability", icon: <FaChartLine />, role: "Software Engineer", type: "System Design", format: "Descriptive", focus: ["System Design"] },
            ].map((preset) => (
              <button key={preset.title} type="button" onClick={() => applyPreset(preset)} className="group text-left bg-white border border-[#F1D5E0] hover:border-[#A53860] hover:shadow-md rounded-2xl p-4 transition">
                <span className="w-10 h-10 rounded-xl bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center text-lg mb-3">{preset.icon}</span>
                <span className="block font-bold text-gray-900 group-hover:text-[#670D2F]">{preset.title}</span>
                <span className="block text-xs text-gray-500 mt-1">{preset.subtitle}</span>
                <span className="inline-flex items-center gap-1 text-xs text-[#A53860] font-semibold mt-3">Use template <FaChevronRight /></span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <main className="bg-white border border-[#F1D5E0] rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-[#FCE5ED]">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center text-lg"><FaBriefcase /></span>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-[#A53860]">Build your session</p>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Interview configuration</h2>
                  <p className="text-sm text-gray-500 mt-1">Add your target role and choose how you want to practice.</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <section>
                <SectionLabel icon={<FaBriefcase />} title="01 · Job & candidate profile" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField icon={<FaBriefcase />} label="Target Role" value={role} onChange={(e) => { setRole(e.target.value); setError(""); }} placeholder="e.g. MERN Stack Developer" />
                  <InputField icon={<FaBuilding />} label="Target Company" optional value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Amazon" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">Job Description <span className="text-gray-400 text-xs font-normal">Optional</span></label>
                    <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value.slice(0, 10000))} maxLength={10000} rows={5} placeholder="Paste the job description to generate role-specific questions..." className="w-full border border-[#F1D5E0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A53860] focus:border-[#A53860] resize-y" />
                    <p className="text-xs text-gray-400 mt-1 text-right">{jobDescription.length.toLocaleString()}/10,000</p>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-900 mb-2">Resume / Project Context <span className="text-gray-400 text-xs font-normal">Optional</span></label>
                    <textarea value={candidateContext} onChange={(e) => setCandidateContext(e.target.value.slice(0, 8000))} maxLength={8000} rows={5} placeholder="Add your skills, projects or resume summary for personalized questions..." className="w-full border border-[#F1D5E0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#A53860] focus:border-[#A53860] resize-y" />
                    <p className="text-xs text-gray-400 mt-1 text-right">{candidateContext.length.toLocaleString()}/8,000</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Your pasted context helps personalize questions and is not stored in the saved interview session.</p>
              </section>

              <section className="border-t border-[#FCE5ED] pt-7">
                <SectionLabel icon={<FaListAlt />} title="02 · Interview preferences" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SelectField icon={<FaCode />} label="Interview Type" value={interviewType} onChange={(e) => { const next = e.target.value; setInterviewType(next); setQuestionType(next === "Coding" ? "Coding" : next === "Behavioral" || next === "System Design" ? "Descriptive" : "Descriptive"); }} options={["Technical", "Coding", "Behavioral", "System Design"]} />
                  <SelectField icon={<FaListAlt />} label="Question Format" value={questionType} onChange={(e) => setQuestionType(e.target.value)} options={questionFormats} />
                  <SelectField icon={<FaChartLine />} label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} options={["Easy", "Medium", "Hard"]} />
                  <SelectField icon={<FaGraduationCap />} label="Experience Level" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} options={["Fresher", "0–2 Years", "2–5 Years", "5+ Years"]} />
                  <SelectField icon={<FaLayerGroup />} label="Number of Questions" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} options={[5, 10, 15]} formatOption={(value) => `${value} Questions`} />
                </div>
              </section>

              <section className="border-t border-[#FCE5ED] pt-7">
                <SectionLabel icon={<FaLayerGroup />} title="03 · Focus areas" />
                <p className="text-sm text-gray-500 mb-4">Select the skills you want the AI to emphasize. Leave all unselected for a general interview.</p>
                <div className="flex flex-wrap gap-2.5">
                  {availableFocusAreas.map((area) => {
                    const selected = focusAreas.includes(area);
                    return <button key={area} type="button" onClick={() => toggleFocusArea(area)} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition ${selected ? "bg-[#FCE5ED] text-[#670D2F] border-[#EF88AD]" : "bg-white text-gray-600 border-[#F1D5E0] hover:border-[#A53860]"}`}>
                      {selected && <FaCheck className="text-xs" />}{area}
                    </button>;
                  })}
                </div>
              </section>

              {error && <p role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">{error}</p>}
              <button onClick={startInterview} disabled={loading || !role.trim()} className="w-full inline-flex items-center justify-center gap-2 mt-1 bg-[#670D2F] hover:bg-[#3A0519] text-white py-4 rounded-xl font-bold text-base shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Generating your first question..." : <><FaRobot /> Start AI Mock Interview <FaChevronRight /></>}
              </button>
              <p className="text-center text-xs text-gray-400">You can review your answers and AI feedback after completing the session.</p>
            </div>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="bg-white border border-[#F1D5E0] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-9 h-9 rounded-lg bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center"><FaChartLine /></span>
                <div><h3 className="font-bold text-gray-900">Session summary</h3><p className="text-xs text-gray-500">Updates as you configure</p></div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3"><span className="text-gray-500">Target role</span><span className="font-semibold text-gray-900 text-right">{role.trim() || "Not set"}</span></div>
                <div className="h-px bg-[#FCE5ED]" />
                <div className="flex justify-between gap-3"><span className="text-gray-500">Company</span><span className="font-semibold text-gray-900 text-right">{company.trim() || "Any company"}</span></div>
                <div className="flex justify-between gap-3"><span className="text-gray-500">Interview type</span><span className="font-semibold text-gray-900">{interviewType}</span></div>
                <div className="flex justify-between gap-3"><span className="text-gray-500">Format</span><span className="font-semibold text-gray-900">{questionType}</span></div>
                <div className="flex justify-between gap-3"><span className="text-gray-500">Difficulty</span><span className="font-semibold text-gray-900">{difficulty}</span></div>
                <div className="flex justify-between gap-3"><span className="text-gray-500">Experience</span><span className="font-semibold text-gray-900">{experienceLevel}</span></div>
                <div className="flex justify-between gap-3"><span className="text-gray-500">Questions</span><span className="font-semibold text-gray-900">{questionCount}</span></div>
                <div className="h-px bg-[#FCE5ED]" />
                <p className="text-xs font-semibold text-gray-500">Focus areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {focusAreas.length ? focusAreas.map((area) => <span key={area} className="bg-[#FFF7FA] text-[#670D2F] border border-[#F1D5E0] rounded-full px-2.5 py-1 text-xs font-medium">{area}</span>) : <span className="text-xs text-gray-400">General coverage</span>}
                </div>
                <div className="h-px bg-[#FCE5ED]" />
                <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Job description</span><span className={jobDescription.trim() ? "text-[#670D2F] font-semibold" : "text-gray-400"}>{jobDescription.trim() ? "Added" : "Not added"}</span></div>
                <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Resume context</span><span className={candidateContext.trim() ? "text-[#670D2F] font-semibold" : "text-gray-400"}>{candidateContext.trim() ? "Added" : "Not added"}</span></div>
              </div>
            </div>
            <div className="bg-[#FFF7FA] border border-[#F1D5E0] rounded-2xl p-5">
              <h3 className="font-bold text-[#670D2F] flex items-center gap-2"><FaRobot /> What you'll get</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><FaCheck className="text-[#A53860] mt-1 shrink-0" /> Questions tailored to your role and context</li>
                <li className="flex gap-2"><FaCheck className="text-[#A53860] mt-1 shrink-0" /> A final score and performance breakdown</li>
                <li className="flex gap-2"><FaCheck className="text-[#A53860] mt-1 shrink-0" /> Feedback for each submitted answer</li>
              </ul>
            </div>
          </aside>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-[#F1D5E0] w-16" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">What you'll practice</h2>
            <div className="h-px bg-[#F1D5E0] w-16" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PracticeCard icon={<FaBriefcase />} title="Role-specific questions" description="Practice questions aligned with your target job and interview type." />
            <PracticeCard icon={<FaChartLine />} title="Adaptive preparation" description="Choose a difficulty and experience level that fits your goals." />
            <PracticeCard icon={<FaRobot />} title="Detailed AI feedback" description="Review your strengths, improvement areas and stronger answer approaches." />
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// INPUT FIELD
// ============================================================

function InputField({
  icon,
  label,
  optional,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="flex items-center gap-2 font-semibold text-gray-900 mb-2">

        <span className="text-[#A53860]">
          {icon}
        </span>

        {label}

        {optional && (
          <span className="text-gray-400 text-xs font-normal">
            Optional
          </span>
        )}

      </label>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[#F1D5E0] rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#A53860] focus:border-[#A53860] transition"
      />

    </div>
  );
}

// ============================================================
// SELECT FIELD
// ============================================================

function SelectField({
  icon,
  label,
  value,
  onChange,
  options,
  formatOption,
}) {
  return (
    <div>

      <label className="flex items-center gap-2 font-semibold text-gray-900 mb-2">

        <span className="text-[#A53860]">
          {icon}
        </span>

        {label}

      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full border border-[#F1D5E0] rounded-xl px-4 py-3.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#A53860] focus:border-[#A53860] transition"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {formatOption
              ? formatOption(option)
              : option}
          </option>
        ))}
      </select>

    </div>
  );
}

// ============================================================
// SECTION LABEL
// ============================================================

function SectionLabel({
  icon,
  title,
}) {
  return (
    <div className="flex items-center gap-2 mb-3">

      <span className="text-[#A53860]">
        {icon}
      </span>

      <label className="font-semibold text-gray-900">
        {title}
      </label>

    </div>
  );
}

// ============================================================
// PRACTICE CARD
// ============================================================

function PracticeCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="bg-white border border-[#FCE5ED] rounded-2xl p-6 hover:shadow-md transition">

      <div className="w-11 h-11 rounded-xl bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center">
        {icon}
      </div>

      <h3 className="font-bold text-lg mt-4">
        {title}
      </h3>

      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
        {description}
      </p>

    </div>
  );
}

// ============================================================
// RESULT SECTION
// ============================================================

function ResultSection({
  title,
  subtitle,
  items,
}) {
  return (
    <div className="bg-white border border-[#F1D5E0] rounded-2xl p-6 md:p-7 mt-6">

      <div className="mb-5">

        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          {subtitle}
        </p>

      </div>

      <div className="space-y-3">

        {items?.length ? (
          items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-[#FFFBFC] border border-[#FCE5ED] rounded-xl p-4 text-gray-700"
            >

              <span className="w-6 h-6 rounded-full bg-[#FCE5ED] text-[#670D2F] flex items-center justify-center text-xs shrink-0 font-bold">
                {index + 1}
              </span>

              <span className="leading-relaxed">
                {item}
              </span>

            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No data available.
          </p>
        )}

      </div>

    </div>
  );
}

// ============================================================
// SCORE CARD
// ============================================================

function ScoreCard({
  title,
  score,
}) {
  return (
    <div className="bg-white border border-[#F1D5E0] rounded-2xl p-6 text-center">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <p className="text-4xl font-bold text-[#A53860] mt-3">
        {score ?? 0}/10
      </p>

    </div>
  );
}

// ============================================================
// INFO
// ============================================================

function Info({
  label,
  value,
}) {
  return (
    <div className="bg-[#FFFBFC] border border-[#FCE5ED] rounded-xl p-4">

      <p className="text-xs uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="font-semibold text-gray-800 mt-1">
        {value}
      </p>

    </div>
  );
}

export default MockInterview;