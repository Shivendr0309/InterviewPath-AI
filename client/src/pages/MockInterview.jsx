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
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                      Your Answer
                    </p>

                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>

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

  return (
    <div className="min-h-screen bg-[#FFFBFC] px-4 py-8 md:py-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#A53860] transition"
          >
            <FaArrowLeft />
            Back
          </button>

          <div className="inline-flex items-center gap-2 bg-white border border-[#F1D5E0] text-[#670D2F] px-4 py-2 rounded-full shadow-sm font-semibold text-sm">
            <FaRobot />
            AI Powered
          </div>

        </div>

        {/* HERO */}
        <div className="text-center mb-10">

          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#A53860] mb-3">
            Practice & Improve
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            <span className="text-[#A53860]">AI</span>{" "}
            Mock Interview
          </h1>

          <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto">
            Customize your interview and practice exactly
            what you need.
          </p>

        </div>

        {/* MAIN SETUP */}
        <div className="bg-white border border-[#F1D5E0] rounded-3xl shadow-sm overflow-hidden">

          {/* SECTION HEADER */}
          <div className="p-6 md:p-9 border-b border-[#FCE5ED]">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-xl bg-[#FFF7FA] text-[#670D2F] flex items-center justify-center text-xl shrink-0">
                <FaBriefcase />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Configure Your Interview
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Choose the interview settings that match your target.
                </p>
              </div>

            </div>

          </div>

          <div className="p-6 md:p-9">

            {/* ROLE + COMPANY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InputField
                icon={<FaBriefcase />}
                label="Target Role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setError("");
                }}
                placeholder="e.g. MERN Stack Developer"
              />

              <InputField
                icon={<FaBuilding />}
                label="Target Company"
                optional
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                placeholder="e.g. Amazon"
              />

            </div>

            {/* INTERVIEW TYPE */}
            <div className="mt-8">

              <SectionLabel
                icon={<FaCode />}
                title="Interview Type"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                {[
                  "Technical",
                  "Coding",
                  "Behavioral",
                  "System Design",
                ].map((type) => (

                  <button
                    key={type}
                    type="button"
                    onClick={() => {

                      setInterviewType(type);

                      if (type === "Coding") {
                        setQuestionType("Coding");
                      }

                      if (
                        type === "Behavioral" ||
                        type === "System Design"
                      ) {
                        setQuestionType("Descriptive");
                      }
                    }}
                    className={`py-3.5 rounded-xl border font-semibold transition ${
                      interviewType === type
                        ? "bg-[#670D2F] text-white border-[#670D2F]"
                        : "bg-white text-gray-700 border-[#F1D5E0] hover:border-[#A53860]"
                    }`}
                  >
                    {type}
                  </button>

                ))}

              </div>

            </div>

            {/* QUESTION FORMAT */}
            <div className="mt-8">

              <SectionLabel
                icon={<FaListAlt />}
                title="Question Format"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                {[
                  "MCQ",
                  "Descriptive",
                  "Coding",
                ].map((type) => {

                  const disabled =
                    interviewType === "Coding" &&
                    type !== "Coding";

                  const disabledByType =
                    (
                      interviewType === "Behavioral" ||
                      interviewType === "System Design"
                    ) &&
                    type !== "Descriptive";

                  const isDisabled =
                    disabled || disabledByType;

                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={isDisabled}
                      onClick={() =>
                        setQuestionType(type)
                      }
                      className={`py-3.5 rounded-xl border font-semibold transition ${
                        questionType === type
                          ? "bg-[#670D2F] text-white border-[#670D2F]"
                          : isDisabled
                          ? "bg-[#FFF7FA] text-gray-400 border-[#F1D5E0] cursor-not-allowed"
                          : "bg-white text-gray-700 border-[#F1D5E0] hover:border-[#A53860]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}

              </div>

            </div>

            {/* SELECT OPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              <SelectField
                icon={<FaChartLine />}
                label="Difficulty"
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                options={[
                  "Easy",
                  "Medium",
                  "Hard",
                ]}
              />

              <SelectField
                icon={<FaGraduationCap />}
                label="Experience Level"
                value={experienceLevel}
                onChange={(e) =>
                  setExperienceLevel(
                    e.target.value
                  )
                }
                options={[
                  "Fresher",
                  "0–2 Years",
                  "2–5 Years",
                  "5+ Years",
                ]}
              />

              <SelectField
                icon={<FaLayerGroup />}
                label="Number of Questions"
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(
                    Number(e.target.value)
                  )
                }
                options={[
                  5,
                  10,
                  15,
                ]}
                formatOption={(value) =>
                  `${value} Questions`
                }
              />

            </div>

            {/* FOCUS AREAS */}
            <div className="mt-8">

              <SectionLabel
                icon={<FaLayerGroup />}
                title="Focus Areas"
              />

              <div className="flex flex-wrap gap-3">

                {availableFocusAreas.map(
                  (area) => {

                    const selected =
                      focusAreas.includes(area);

                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() =>
                          toggleFocusArea(area)
                        }
                        className={`px-4 py-2.5 rounded-full border text-sm font-semibold transition ${
                          selected
                            ? "bg-[#FCE5ED] text-[#670D2F] border-[#EF88AD]"
                            : "bg-white text-gray-600 border-[#F1D5E0] hover:border-[#A53860]"
                        }`}
                      >
                        {selected && (
                          <FaCheck className="inline mr-2 text-xs" />
                        )}

                        {area}
                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {error && (
              <p className="text-center text-red-500 font-medium mt-6">
                {error}
              </p>
            )}

            {/* START */}
            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full mt-9 bg-[#670D2F] hover:bg-[#3A0519] text-white py-4 rounded-2xl font-bold text-lg shadow-md transition disabled:opacity-50"
            >
              {loading
                ? "Generating Question..."
                : "✨ Start AI Interview"}
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              Your configuration is used to personalize the interview.
            </p>

          </div>
        </div>

        {/* WHAT YOU'LL PRACTICE */}
        <div className="mt-12">

          <div className="flex items-center justify-center gap-4 mb-7">

            <div className="h-px bg-[#F1D5E0] w-16" />

            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              What you'll practice
            </h2>

            <div className="h-px bg-[#F1D5E0] w-16" />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <PracticeCard
              icon={<FaBriefcase />}
              title="Role-Specific"
              description="Questions tailored to your target role and interview type."
            />

            <PracticeCard
              icon={<FaChartLine />}
              title="Adaptive Difficulty"
              description="Choose the difficulty and experience level that fits you."
            />

            <PracticeCard
              icon={<FaRobot />}
              title="Detailed Feedback"
              description="Get AI-powered evaluation after completing your interview."
            />

          </div>

        </div>

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