import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  FaUpload,
  FaFilePdf,
  FaLock,
  FaBullseye,
  FaChartLine,
  FaLightbulb,
  FaExclamationTriangle,
  FaPen,
  FaRocket,
  FaArrowLeft,
  FaCheckCircle,
  FaSyncAlt,
  FaFileAlt,
  FaStar,
  FaTimes,
  FaCloudUploadAlt,
} from "react-icons/fa";

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // ==================================================
  // FILE VALIDATION
  // ==================================================

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    if (selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("Resume size must be less than 5 MB.");
      return false;
    }

    return true;
  };

  // ==================================================
  // HANDLE FILE
  // ==================================================

  const handleFile = (selectedFile) => {
    if (!validateFile(selectedFile)) {
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setAnalysis(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      handleFile(selectedFile);
    }

    // Allow selecting the same file again
    e.target.value = "";
  };

  // ==================================================
  // DRAG & DROP
  // ==================================================

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // ==================================================
  // REMOVE FILE
  // ==================================================

  const removeFile = (e) => {
    e.stopPropagation();

    setFile(null);
    setMessage("");
    setAnalysis(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==================================================
  // ANALYZE RESUME
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload your resume.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to analyze your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setMessage("");
      setAnalysis(null);

      const res = await api.post("/resume/analyze", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalysis(res.data.analysis);
      setMessage("Resume analyzed successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to analyze resume."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // ANALYZE ANOTHER
  // ==================================================

  const analyzeAnother = () => {
    setFile(null);
    setAnalysis(null);
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // SCORE
  // ==================================================

  const score = Math.min(
    Math.max(Number(analysis?.atsScore) || 0, 0),
    100
  );

  const getScoreLabel = (value) => {
    if (value >= 80) return "Good Score";
    if (value >= 60) return "Needs Improvement";
    return "Needs Attention";
  };

  const getScoreColor = (value) => {
    if (value >= 80) return "#A53860";
    if (value >= 60) return "#C06A85";
    return "#B42318";
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-[#FFFBFC] text-gray-900">

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-7 md:py-9">

        {/* ==================================================
            BACK
        ================================================== */}

        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[#670D2F] font-medium hover:text-[#A53860] transition mb-7"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />

          <span>Back</span>
        </button>

        {/* ==================================================
            HERO
        ================================================== */}

        <section className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-12 items-center mb-8">

          {/* LEFT */}
          <div>

            {/* AI BADGE */}

            <div className="inline-flex items-center gap-2 bg-[#FCE5ED] text-[#670D2F] border border-[#F1D5E0] px-4 py-2 rounded-full text-sm font-semibold mb-5">

              <span className="text-[#A53860]">
                ✦
              </span>

              AI Powered

            </div>

            {/* HEADING */}

            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold tracking-tight leading-[1.05]">

              <span className="text-[#A53860]">
                AI
              </span>{" "}

              Resume Analyzer

            </h1>

            {/* DESCRIPTION */}

            <p className="text-gray-600 text-lg md:text-xl mt-5 max-w-2xl leading-relaxed">

              Get detailed feedback on your resume and make it stand out.
              Upload your resume and let AI help you improve it.

            </p>

            {/* BENEFITS */}

            <div className="grid sm:grid-cols-3 gap-5 mt-7">

              <HeroBenefit
                icon={<FaBullseye />}
                title="ATS Optimization"
                description="Improve your ATS score"
              />

              <HeroBenefit
                icon={<FaChartLine />}
                title="Skill Gap Analysis"
                description="Find missing skills"
              />

              <HeroBenefit
                icon={<FaLightbulb />}
                title="Actionable Suggestions"
                description="Get personalized tips"
              />

            </div>

          </div>

          {/* ==================================================
              HERO ILLUSTRATION
          ================================================== */}

          <div className="hidden lg:flex justify-center">

            <div className="relative w-[300px] h-[310px]">

              {/* Glow */}

              <div className="absolute inset-8 bg-[#FCE5ED] rounded-full blur-3xl opacity-70" />

              {/* Back paper */}

              <div
                className="
                  absolute
                  top-8
                  left-4
                  w-52
                  h-64
                  bg-[#F7DDE6]
                  rounded-2xl
                  rotate-[-8deg]
                  shadow-sm
                "
              />

              {/* Main paper */}

              <div
                className="
                  absolute
                  top-1
                  left-12
                  w-56
                  h-72
                  bg-white
                  rounded-2xl
                  border
                  border-[#F1D5E0]
                  shadow-xl
                  rotate-[5deg]
                  p-6
                "
              >

                {/* Profile */}

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-10 h-10 rounded-full bg-[#FCE5ED] flex items-center justify-center text-[#A53860]">

                    <FaFileAlt />

                  </div>

                  <div className="space-y-2">

                    <div className="w-24 h-2 bg-[#F1D5E0] rounded" />

                    <div className="w-16 h-2 bg-[#F7E9EE] rounded" />

                  </div>

                </div>

                {/* Lines */}

                <div className="space-y-4">

                  <div className="h-2 bg-[#F7E9EE] rounded w-full" />

                  <div className="h-2 bg-[#F7E9EE] rounded w-5/6" />

                  <div className="h-2 bg-[#F7E9EE] rounded w-4/6" />

                  <div className="h-2 bg-[#F7E9EE] rounded w-full" />

                  <div className="h-2 bg-[#F7E9EE] rounded w-3/4" />

                </div>

                {/* Tags */}

                <div className="mt-8 flex gap-2 flex-wrap">

                  <div className="w-12 h-6 bg-[#FCE5ED] rounded-full" />

                  <div className="w-16 h-6 bg-[#FCE5ED] rounded-full" />

                  <div className="w-10 h-6 bg-[#FCE5ED] rounded-full" />

                </div>

              </div>

              {/* SCORE CARD */}

              <div
                className="
                  absolute
                  bottom-5
                  right-0
                  bg-white
                  border
                  border-[#F1D5E0]
                  rounded-2xl
                  shadow-lg
                  px-5
                  py-4
                "
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">

                    <FaChartLine />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Resume Score
                    </p>

                    <p className="font-bold text-[#670D2F]">
                      Stand Out
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================================================
            UPLOAD CARD
        ================================================== */}

        <section className="bg-white border border-[#F1D5E0] rounded-3xl shadow-sm p-4 sm:p-6 mb-7">

          <form onSubmit={handleSubmit}>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!file) {
                  fileInputRef.current?.click();
                }
              }}
              className={`
                border-2
                border-dashed
                rounded-2xl
                transition-all
                duration-300
                ${
                  isDragging
                    ? "border-[#A53860] bg-[#FFF7FA] scale-[1.005]"
                    : "border-[#EFB8CA] bg-[#FFFBFC]"
                }
                ${
                  !file
                    ? "cursor-pointer hover:bg-[#FFF7FA] hover:border-[#A53860]"
                    : ""
                }
              `}
            >

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* ==================================================
                  NO FILE
              ================================================== */}

              {!file ? (
                <div className="min-h-[260px] flex flex-col items-center justify-center text-center px-5 py-10">

                  {/* PDF */}

                  <div className="w-20 h-20 bg-[#FCE5ED] rounded-2xl flex items-center justify-center text-[#A53860] text-3xl mb-5">

                    <FaFilePdf />

                  </div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Upload Your Resume
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Drag & drop your PDF file here, or click to browse
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="
                      mt-6
                      bg-[#670D2F]
                      hover:bg-[#3A0519]
                      text-white
                      px-8
                      py-3
                      rounded-xl
                      font-semibold
                      transition
                      flex
                      items-center
                      gap-2
                      shadow-md
                    "
                  >

                    <FaUpload />

                    Choose File

                  </button>

                  <p className="text-sm text-gray-400 mt-4">
                    Only PDF files are allowed · Max 5 MB
                  </p>

                </div>
              ) : (

                /* ==================================================
                   FILE SELECTED
                ================================================== */

                <div className="p-6 sm:p-8">

                  <div className="max-w-3xl mx-auto">

                    <div className="flex flex-col sm:flex-row items-center gap-5 bg-white border border-[#F1D5E0] rounded-2xl p-5 shadow-sm">

                      {/* PDF ICON */}

                      <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center text-2xl">

                        <FaFilePdf />

                      </div>

                      {/* FILE INFO */}

                      <div className="flex-1 text-center sm:text-left min-w-0">

                        <p className="font-bold text-[#670D2F] text-lg truncate">

                          {file.name}

                        </p>

                        <p className="text-sm text-gray-500 mt-1">

                          PDF Document ·{" "}
                          {(file.size / (1024 * 1024)).toFixed(2)} MB

                        </p>

                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-green-600 text-sm font-medium">

                          <FaCheckCircle />

                          Ready to analyze

                        </div>

                      </div>

                      {/* CHANGE BUTTON */}

                      <div className="flex items-center gap-2 shrink-0">

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="
                            px-4
                            py-2
                            rounded-lg
                            border
                            border-[#EFB8CA]
                            text-[#A53860]
                            hover:bg-[#FFF7FA]
                            font-semibold
                            text-sm
                            transition
                          "
                        >
                          Change
                        </button>

                        <button
                          type="button"
                          onClick={removeFile}
                          className="
                            w-9
                            h-9
                            rounded-lg
                            border
                            border-gray-200
                            text-gray-400
                            hover:text-red-500
                            hover:bg-red-50
                            flex
                            items-center
                            justify-center
                            transition
                          "
                          aria-label="Remove resume"
                        >
                          <FaTimes />
                        </button>

                      </div>

                    </div>

                    <p className="text-center text-sm text-gray-400 mt-4">

                      Click "Change" if you want to select another resume.

                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* ==================================================
                MESSAGE
            ================================================== */}

            {message && (
              <div
                className={`
                  mt-4
                  text-center
                  text-sm
                  font-medium
                  ${
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-500"
                  }
                `}
              >
                {message}
              </div>
            )}

            {/* ==================================================
                ANALYZE
            ================================================== */}

            <button
              type="submit"
              disabled={loading || !file}
              className="
                w-full
                mt-5
                bg-[#670D2F]
                hover:bg-[#3A0519]
                text-white
                font-bold
                py-4
                rounded-xl
                text-lg
                shadow-lg
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
                flex
                items-center
                justify-center
                gap-3
              "
            >

              {loading ? (
                <>
                  <FaSyncAlt className="animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  ✦
                  Analyze My Resume
                </>
              )}

            </button>

            {/* SECURITY */}

            <p className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">

              <FaLock />

              Your resume is processed securely for analysis.

            </p>

          </form>

        </section>

        {/* ==================================================
            WHAT YOU GET
        ================================================== */}

        <section className="bg-white border border-[#F1D5E0] rounded-3xl shadow-sm p-6 sm:p-8 mb-7">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">

                <FaFileAlt />

              </div>

              <h2 className="text-2xl sm:text-3xl font-bold">
                What You'll Get
              </h2>

            </div>

            <p className="text-gray-500">
              A complete analysis of your resume
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <FeatureCard
              icon={<FaBullseye />}
              title="ATS Score"
              description="See how well your resume performs with ATS systems"
            />

            <FeatureCard
              icon={<FaChartLine />}
              title="Skills Analysis"
              description="Identify your key skills and missing keywords"
            />

            <FeatureCard
              icon={<FaLightbulb />}
              title="AI Suggestions"
              description="Get actionable tips to improve your resume"
            />

            <FeatureCard
              icon={<FaRocket />}
              title="Better Opportunities"
              description="Increase your chances of getting interviews"
            />

          </div>

        </section>

        {/* ==================================================
            TIP
        ================================================== */}

        {!analysis && (

          <div className="bg-white border border-[#F1D5E0] rounded-2xl p-5 flex items-center gap-4 shadow-sm mb-10">

            <div className="w-11 h-11 shrink-0 rounded-full bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">

              <FaLightbulb />

            </div>

            <p className="text-gray-600 leading-relaxed">

              <span className="font-bold text-gray-900">
                Tip:
              </span>{" "}

              For better results, make sure your resume includes relevant
              skills, experience, and achievements.

            </p>

          </div>

        )}

        {/* ==================================================
            ANALYSIS
        ================================================== */}

        {analysis && (

          <AnalysisResults
            analysis={analysis}
            score={score}
            getScoreLabel={getScoreLabel}
            getScoreColor={getScoreColor}
            onAnalyzeAnother={analyzeAnother}
          />

        )}

      </div>

    </div>
  );
}

// ==========================================================
// HERO BENEFIT
// ==========================================================

function HeroBenefit({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-10 h-10 shrink-0 rounded-full bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">

        {icon}

      </div>

      <div>

        <h3 className="font-bold text-gray-900 text-sm">
          {title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {description}
        </p>

      </div>

    </div>
  );
}

// ==========================================================
// FEATURE CARD
// ==========================================================

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        group
        border
        border-[#F1D5E0]
        rounded-2xl
        p-5
        bg-[#FFFBFC]
        hover:bg-[#FFF7FA]
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      <div className="w-12 h-12 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center text-lg group-hover:scale-105 transition">

        {icon}

      </div>

      <h3 className="font-bold text-gray-900 mt-4">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
        {description}
      </p>

    </div>
  );
}

// ==========================================================
// ANALYSIS RESULTS
// ==========================================================

function AnalysisResults({
  analysis,
  score,
  getScoreLabel,
  getScoreColor,
  onAnalyzeAnother,
}) {
  return (
    <section className="mb-10">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center text-lg">

            <FaFileAlt />

          </div>

          <div>

            <div className="flex items-center gap-3 flex-wrap">

              <h2 className="text-2xl sm:text-3xl font-bold">
                Analysis Results
              </h2>

              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">

                <FaCheckCircle />

                Completed

              </span>

            </div>

            <p className="text-gray-500 mt-1">
              Here's the AI-generated analysis of your resume.
            </p>

          </div>

        </div>

        <button
          onClick={onAnalyzeAnother}
          className="
            border
            border-[#A53860]
            text-[#A53860]
            hover:bg-[#FFF7FA]
            px-5
            py-2.5
            rounded-xl
            font-semibold
            transition
            flex
            items-center
            justify-center
            gap-2
          "
        >

          <FaSyncAlt />

          Analyze Another Resume

        </button>

      </div>

      {/* ==================================================
          ATS + OVERVIEW
      ================================================== */}

      <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-5">

        {/* ATS SCORE */}

        <div className="bg-white border border-[#F1D5E0] rounded-3xl p-7 shadow-sm flex flex-col items-center justify-center">

          <h3 className="text-xl font-bold mb-6">
            ATS Score
          </h3>

          <ScoreCircle
            score={score}
            color={getScoreColor(score)}
          />

          <div
            className="mt-5 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              backgroundColor:
                score >= 80
                  ? "#E8F7EE"
                  : "#FFF4E5",
              color:
                score >= 80
                  ? "#16803C"
                  : "#9A6700",
            }}
          >

            <span className="inline-flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-current" />

              {getScoreLabel(score)}

            </span>

          </div>

        </div>

        {/* OVERVIEW */}

        <div className="bg-white border border-[#F1D5E0] rounded-3xl p-7 shadow-sm">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">

              <FaFileAlt />

            </div>

            <h3 className="text-xl font-bold">
              Resume Overview
            </h3>

          </div>

          <p className="text-gray-600 leading-7">

            Your resume has been analyzed based on its skills,
            strengths, missing keywords, and improvement areas.
            Review the recommendations below to make your resume
            stronger and more ATS-friendly.

          </p>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">

            <MiniStat
              value={analysis.skillsFound?.length || 0}
              label="Skills Found"
            />

            <MiniStat
              value={analysis.missingKeywords?.length || 0}
              label="Missing Keywords"
            />

            <MiniStat
              value={analysis.suggestions?.length || 0}
              label="Suggestions"
            />

          </div>

        </div>

      </div>

      {/* ==================================================
          SKILLS + KEYWORDS
      ================================================== */}

      <div className="grid md:grid-cols-2 gap-5 mt-5">

        <TagSection
          title="Skills Found"
          icon={<FaCheckCircle />}
          items={analysis.skillsFound}
        />

        <TagSection
          title="Missing Keywords"
          icon={<FaExclamationTriangle />}
          items={analysis.missingKeywords}
        />

      </div>

      {/* ==================================================
          STRENGTHS + IMPROVEMENTS
      ================================================== */}

      <div className="grid md:grid-cols-2 gap-5 mt-5">

        <ListSection
          title="Strengths"
          icon={<FaStar />}
          items={analysis.strengths}
        />

        <ListSection
          title="Areas for Improvement"
          icon={<FaPen />}
          items={analysis.improvements}
        />

      </div>

      {/* ==================================================
          AI RECOMMENDATIONS
      ================================================== */}

      <div className="bg-white border border-[#F1D5E0] rounded-3xl p-6 sm:p-8 shadow-sm mt-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">

              <FaLightbulb />

            </div>

            <h3 className="text-2xl font-bold">
              AI Recommendations
            </h3>

          </div>

          <p className="text-sm text-gray-500">
            Follow these suggestions to improve your resume
          </p>

        </div>

        {analysis.suggestions?.length > 0 ? (

          <div className="space-y-4">

            {analysis.suggestions.map((item, index) => (

              <div
                key={index}
                className="flex items-start gap-4"
              >

                <div className="w-8 h-8 shrink-0 rounded-full bg-[#FCE5ED] text-[#A53860] flex items-center justify-center font-bold text-sm">

                  {index + 1}

                </div>

                <p className="text-gray-600 leading-7 pt-1">
                  {item}
                </p>

              </div>

            ))}

          </div>

        ) : (

          <p className="text-gray-500">
            No recommendations available.
          </p>

        )}

      </div>

    </section>
  );
}

// ==========================================================
// SCORE CIRCLE
// ==========================================================

function ScoreCircle({
  score,
  color,
}) {
  return (
    <div
      className="w-48 h-48 rounded-full flex items-center justify-center"
      style={{
        background: `conic-gradient(
          ${color} ${score * 3.6}deg,
          #FCE5ED ${score * 3.6}deg
        )`,
      }}
    >

      <div className="w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center">

        <span className="text-5xl font-extrabold text-gray-900">
          {score}
        </span>

        <span className="text-gray-500 text-sm">
          / 100
        </span>

      </div>

    </div>
  );
}

// ==========================================================
// MINI STAT
// ==========================================================

function MiniStat({
  value,
  label,
}) {
  return (
    <div className="bg-[#FFFBFC] border border-[#F1D5E0] rounded-xl p-4">

      <p className="text-2xl font-bold text-[#670D2F]">
        {value}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {label}
      </p>

    </div>
  );
}

// ==========================================================
// TAG SECTION
// ==========================================================

function TagSection({
  title,
  icon,
  items,
}) {
  return (
    <div className="bg-white border border-[#F1D5E0] rounded-3xl p-6 shadow-sm">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">

          {icon}

        </div>

        <h3 className="text-xl font-bold">
          {title}
        </h3>

      </div>

      {items && items.length > 0 ? (

        <div className="flex flex-wrap gap-2">

          {items.map((item, index) => (

            <span
              key={index}
              className="
                px-3
                py-2
                bg-[#FFF0F5]
                border
                border-[#F1D5E0]
                text-[#670D2F]
                rounded-full
                text-sm
                font-medium
              "
            >
              {item}
            </span>

          ))}

        </div>

      ) : (

        <p className="text-gray-500 text-sm">
          No data available.
        </p>

      )}

    </div>
  );
}

// ==========================================================
// LIST SECTION
// ==========================================================

function ListSection({
  title,
  icon,
  items,
}) {
  return (
    <div className="bg-white border border-[#F1D5E0] rounded-3xl p-6 shadow-sm">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">

          {icon}

        </div>

        <h3 className="text-xl font-bold">
          {title}
        </h3>

      </div>

      {items && items.length > 0 ? (

        <div className="space-y-3">

          {items.map((item, index) => (

            <div
              key={index}
              className="
                flex
                items-start
                gap-3
                bg-[#FFFBFC]
                border
                border-[#F1D5E0]
                rounded-xl
                p-4
              "
            >

              <span className="w-6 h-6 shrink-0 rounded-full bg-[#FCE5ED] text-[#A53860] flex items-center justify-center text-xs font-bold">

                {index + 1}

              </span>

              <p className="text-gray-600 text-sm leading-6">
                {item}
              </p>

            </div>

          ))}

        </div>

      ) : (

        <p className="text-gray-500 text-sm">
          No data available.
        </p>

      )}

    </div>
  );
}

export default ResumeAnalyzer;