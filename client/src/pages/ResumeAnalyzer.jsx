import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaUpload, FaFilePdf, FaBullseye, FaChartLine, FaLightbulb, FaPen, FaArrowLeft, FaCheckCircle, FaSyncAlt, FaFileAlt, FaStar, FaTimes, FaDownload } from "react-icons/fa";

const card = "bg-white border border-[#F1D5E0] rounded-3xl p-6 shadow-sm";
const iconBox = "w-10 h-10 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center shrink-0";

function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const selectFile = (selected) => {
    if (!selected) return;
    if (selected.type !== "application/pdf") { setMessage("Only PDF files are allowed."); return; }
    if (selected.size > 5 * 1024 * 1024) { setMessage("Resume size must be less than 5 MB."); return; }
    setFile(selected); setAnalysis(null); setMessage("");
  };

  const analyze = async (event) => {
    event.preventDefault();
    if (!file) { setMessage("Please upload your resume."); return; }
    const token = localStorage.getItem("token");
    if (!token) { setMessage("Please login to analyze your resume."); return; }
    const data = new FormData();
    data.append("resume", file);
    if (jobDescription.trim()) data.append("jobDescription", jobDescription.trim());
    try {
      setLoading(true); setMessage(""); setAnalysis(null);
      const response = await api.post("/resume/analyze", data, { headers: { Authorization: "Bearer " + token } });
      setAnalysis(response.data.analysis);
      setMessage("Resume analyzed successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to analyze resume.");
    } finally { setLoading(false); }
  };

  const reset = () => {
    setFile(null); setAnalysis(null); setMessage("");
    if (inputRef.current) inputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportReport = () => {
    if (!analysis) return;
    const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const list = (items) => items?.length ? "<ul>" + items.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>" : "<p>None reported.</p>";
    const rows = (analysis.sections || []).map((s) => "<tr><td>" + esc(s.name) + "</td><td>" + esc(s.status) + "</td><td>" + esc(s.score) + "/100</td><td>" + esc(s.feedback) + "</td></tr>").join("");
    const rewrites = (analysis.rewrittenBulletPoints || []).map((x) => "<article><p><b>Original:</b> " + esc(x.original) + "</p><p><b>Suggested:</b> " + esc(x.improved) + "</p><p>" + esc(x.reason) + "</p></article>").join("");
    const scores = Object.entries(analysis.scoreBreakdown || {}).map(([k, v]) => "<li><b>" + esc(k) + ":</b> " + esc(v) + "/100</li>").join("");
    const html = "<!doctype html><html><head><meta charset='utf-8'><title>Resume Analysis Report</title><style>body{font:14px Arial;color:#25212a;max-width:850px;margin:36px auto;padding:0 24px;line-height:1.55}h1,h2{color:#670D2F}h1{border-bottom:3px solid #F1D5E0;padding-bottom:12px}section{margin:24px 0}article{background:#FFFBFC;border:1px solid #F1D5E0;padding:12px;margin:10px 0;border-radius:8px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#FFF0F5}.score{font-size:34px;font-weight:bold;color:#A53860}.muted{color:#666;font-size:12px}@media print{body{margin:12mm auto}.no-print{display:none}}</style></head><body><h1>Resume Analysis Report</h1><p class='muted'>InterviewPath AI · " + esc(new Date().toLocaleString()) + "</p><p class='score'>" + esc(analysis.atsScore) + "/100 ATS readiness estimate</p><section><h2>Score breakdown</h2><ul>" + scores + "</ul></section><section><h2>Section review</h2><table><thead><tr><th>Section</th><th>Status</th><th>Score</th><th>Feedback</th></tr></thead><tbody>" + rows + "</tbody></table></section><section><h2>Matched skills</h2>" + list(analysis.skills?.matched || analysis.skillsFound) + "</section><section><h2>Missing skills</h2>" + list(analysis.skills?.missing || analysis.missingKeywords) + "</section><section><h2>Partial skills</h2>" + list(analysis.skills?.partial) + "</section><section><h2>Strengths</h2>" + list(analysis.strengths) + "</section><section><h2>Improvements</h2>" + list(analysis.improvements) + "</section><section><h2>AI bullet rewrites</h2>" + (rewrites || "<p>No safe rewrites identified.</p>") + "</section><section><h2>Action plan</h2>" + list(analysis.actionPlan?.length ? analysis.actionPlan : analysis.suggestions) + "</section><p class='muted'>" + esc(analysis.disclaimer || "AI-generated guidance is an estimate, not a guarantee of any ATS result.") + "</p><button class='no-print' onclick='window.print()'>Print / Save as PDF</button></body></html>";
    const report = window.open("", "_blank");
    if (!report) { setMessage("Allow pop-ups to generate your report, then try again."); return; }
    report.document.open(); report.document.write(html); report.document.close(); report.focus();
    setMessage("Report opened. Choose Save as PDF in the print dialog.");
    setTimeout(() => report.print(), 400);
  };

  const score = Math.max(0, Math.min(100, Number(analysis?.atsScore) || 0));
  const scoreColor = score >= 80 ? "#16803C" : score >= 60 ? "#C06A85" : "#B42318";

  return <div className="min-h-screen bg-[#FFFBFC] text-gray-900"><div className="max-w-7xl mx-auto px-5 sm:px-8 py-7 md:py-9">
    <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-[#670D2F] font-medium hover:text-[#A53860] mb-7"><FaArrowLeft /> Back</button>
    <section className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-center mb-8"><div>
      <div className="inline-flex gap-2 bg-[#FCE5ED] text-[#670D2F] border border-[#F1D5E0] px-4 py-2 rounded-full text-sm font-semibold mb-5">✦ AI Powered</div>
      <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold tracking-tight"><span className="text-[#A53860]">AI</span> Resume Analyzer</h1>
      <p className="text-gray-600 text-lg mt-5 max-w-2xl leading-relaxed">Get an ATS-readiness estimate, job-specific matching, section feedback and evidence-preserving rewrite suggestions.</p>
      <div className="grid sm:grid-cols-3 gap-5 mt-7"><HeroBenefit icon={<FaBullseye />} title="ATS Breakdown" description="Understand each score" /><HeroBenefit icon={<FaChartLine />} title="Job Matching" description="Compare against a role" /><HeroBenefit icon={<FaLightbulb />} title="Actionable AI" description="Get practical improvements" /></div>
    </div><div className="hidden lg:flex justify-center"><div className="relative w-[280px] h-[270px]"><div className="absolute inset-5 bg-[#FCE5ED] rounded-full blur-3xl" /><div className="absolute top-2 left-8 w-52 h-64 bg-white rounded-2xl border border-[#F1D5E0] shadow-xl rotate-3 p-6"><div className="w-12 h-12 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center"><FaFileAlt /></div><div className="space-y-3 mt-7"><div className="h-2 bg-[#F1D5E0] rounded" /><div className="h-2 bg-[#F7E9EE] rounded w-5/6" /><div className="h-2 bg-[#F7E9EE] rounded w-4/6" /><div className="h-2 bg-[#F7E9EE] rounded" /></div></div><div className="absolute bottom-0 right-0 bg-white border border-[#F1D5E0] rounded-2xl shadow-lg px-5 py-4 text-[#670D2F] font-bold"><FaChartLine className="inline mr-2" />Resume insights</div></div></div></section>

    <section className="bg-white border border-[#F1D5E0] rounded-3xl shadow-sm p-4 sm:p-6 mb-7"><form onSubmit={analyze}>
      <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setDragging(false); }} onDrop={(e) => { e.preventDefault(); setDragging(false); selectFile(e.dataTransfer.files[0]); }} onClick={() => { if (!file) inputRef.current?.click(); }} className={"border-2 border-dashed rounded-2xl p-7 sm:p-10 text-center " + (dragging ? "border-[#A53860] bg-[#FFF7FA]" : "border-[#EFB8CA] bg-[#FFFBFC]") + (!file ? " cursor-pointer hover:bg-[#FFF7FA]" : "")}>
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { selectFile(e.target.files[0]); e.target.value = ""; }} />
        {!file ? <><div className="w-16 h-16 mx-auto bg-[#FCE5ED] rounded-2xl flex items-center justify-center text-[#A53860] text-2xl mb-4"><FaFilePdf /></div><h2 className="text-2xl font-bold">Upload Your Resume</h2><p className="text-gray-500 mt-2">Drag & drop your PDF file here, or browse</p><button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="mt-5 bg-[#670D2F] hover:bg-[#3A0519] text-white px-7 py-3 rounded-xl font-semibold"><FaUpload className="inline mr-2" />Choose PDF</button><p className="text-sm text-gray-400 mt-3">PDF only · Maximum 5 MB</p></> : <div className="flex flex-col sm:flex-row items-center gap-4 text-left"><div className="w-14 h-14 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center text-2xl"><FaFilePdf /></div><div className="flex-1 min-w-0"><p className="font-bold text-[#670D2F] truncate">{file.name}</p><p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to analyze</p></div><button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setAnalysis(null); }} className="px-4 py-2 border border-[#EFB8CA] text-[#A53860] rounded-lg">Remove <FaTimes className="inline" /></button></div>}
      </div>
      <div className="mt-5"><label htmlFor="jobDescription" className="block font-bold mb-2">Job description <span className="text-gray-400 font-normal">(optional)</span></label><p className="text-sm text-gray-500 mb-3">Paste the target role's job description for a tailored match. Leave blank for general resume analysis.</p><textarea id="jobDescription" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} maxLength={12000} rows={5} placeholder="Paste responsibilities, required skills and qualifications..." className="w-full border border-[#EFB8CA] rounded-xl p-4 bg-[#FFFBFC] focus:outline-none focus:ring-2 focus:ring-[#A53860] resize-y" /><p className="text-xs text-gray-400 text-right">{jobDescription.length}/12,000 characters</p></div>
      {message && <p className={"mt-4 text-center text-sm font-medium " + (message.includes("successfully") || message.includes("opened") ? "text-green-600" : "text-red-500")}>{message}</p>}
      <button type="submit" disabled={loading || !file} className="w-full mt-5 bg-[#670D2F] hover:bg-[#3A0519] text-white font-bold py-4 rounded-xl text-lg shadow-lg disabled:opacity-50 flex items-center justify-center gap-3">{loading ? <><FaSyncAlt className="animate-spin" />Analyzing Resume...</> : <>✦ Analyze My Resume</>}</button>
    </form></section>

    {!analysis && <section className="grid md:grid-cols-3 gap-4 mb-8"><FeatureCard icon={<FaBullseye />} title="ATS score breakdown" description="Understand keyword, skill, experience, formatting and section readiness." /><FeatureCard icon={<FaPen />} title="Section review & rewrites" description="Review each section and improve bullets without inventing achievements." /><FeatureCard icon={<FaFilePdf />} title="Exportable report" description="Generate a print-ready report that can be saved as PDF." /></section>}
    {analysis && <AnalysisResults analysis={analysis} score={score} scoreColor={scoreColor} onExport={exportReport} onReset={reset} />}
  </div></div>;
}

function HeroBenefit({ icon, title, description }) {
  return <div className="flex items-start gap-3"><div className="w-10 h-10 shrink-0 rounded-full bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">{icon}</div><div><h3 className="font-bold text-sm">{title}</h3><p className="text-xs text-gray-500 mt-1">{description}</p></div></div>;
}
function FeatureCard({ icon, title, description }) {
  return <div className="border border-[#F1D5E0] rounded-2xl p-5 bg-white"><div className="w-11 h-11 rounded-xl bg-[#FCE5ED] text-[#A53860] flex items-center justify-center">{icon}</div><h3 className="font-bold mt-4">{title}</h3><p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p></div>;
}
function TagSection({ title, items = [], tone = "default" }) {
  const tones = { green: "bg-green-50 border-green-200 text-green-800", red: "bg-red-50 border-red-200 text-red-800", amber: "bg-amber-50 border-amber-200 text-amber-800", default: "bg-[#FFF0F5] border-[#F1D5E0] text-[#670D2F]" };
  return <div className="border border-[#F1D5E0] rounded-2xl p-5 bg-white"><h4 className="font-bold mb-3">{title} <span className="text-xs text-gray-400">({items.length})</span></h4><div className="flex flex-wrap gap-2">{items.length ? items.map((item, i) => <span key={i} className={"px-3 py-1.5 border rounded-full text-xs font-medium " + tones[tone]}>{item}</span>) : <p className="text-sm text-gray-400">No items identified.</p>}</div></div>;
}
function ListSection({ title, icon, items = [] }) {
  return <div className={card}><div className="flex items-center gap-3 mb-4"><div className={iconBox}>{icon}</div><h3 className="text-xl font-bold">{title}</h3></div>{items.length ? <ul className="space-y-3">{items.map((item, i) => <li key={i} className="flex gap-3 text-sm text-gray-600 leading-6"><FaCheckCircle className="text-[#A53860] mt-1 shrink-0" />{item}</li>)}</ul> : <p className="text-sm text-gray-400">No items identified.</p>}</div>;
}
function AnalysisResults({ analysis, score, scoreColor, onExport, onReset }) {
  const breakdown = analysis.scoreBreakdown || {};
  const skills = analysis.skills || { matched: analysis.skillsFound || [], missing: analysis.missingKeywords || [], partial: [] };
  const sections = analysis.sections || [];
  const rewrites = analysis.rewrittenBulletPoints || [];
  const actions = analysis.actionPlan?.length ? analysis.actionPlan : analysis.suggestions || [];
  return <section className="mb-10">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"><div><div className="flex items-center gap-3"><div className={iconBox}><FaFileAlt /></div><h2 className="text-2xl sm:text-3xl font-bold">Analysis Results</h2></div><p className="text-gray-500 mt-2">Your AI-generated resume review is ready.</p></div><div className="flex flex-wrap gap-2"><button onClick={onExport} className="px-4 py-2.5 rounded-xl bg-[#670D2F] text-white font-semibold"><FaDownload className="inline mr-2" />Download PDF Report</button><button onClick={onReset} className="px-4 py-2.5 rounded-xl border border-[#A53860] text-[#A53860] font-semibold"><FaSyncAlt className="inline mr-2" />Analyze Another</button></div></div>
    <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-5"><div className={card + " flex flex-col items-center justify-center"}><h3 className="text-xl font-bold mb-5">ATS Readiness Estimate</h3><div className="w-44 h-44 rounded-full flex items-center justify-center" style={{ background: "conic-gradient(" + scoreColor + " " + score * 3.6 + "deg, #FCE5ED " + score * 3.6 + "deg)" }}><div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center"><span className="text-5xl font-extrabold">{score}</span><span className="text-sm text-gray-500">/ 100</span></div></div><p className="mt-4 font-semibold" style={{ color: scoreColor }}>{score >= 80 ? "Strong foundation" : score >= 60 ? "Room to improve" : "Needs attention"}</p><p className="text-xs text-gray-400 text-center mt-3">An AI estimate, not an actual ATS guarantee.</p></div>
      <div className={card}><h3 className="text-xl font-bold mb-5">Score Breakdown</h3><div className="space-y-4">{["keywords", "skills", "experience", "formatting", "sections"].map((key) => <div key={key}><div className="flex justify-between text-sm mb-1"><span className="capitalize font-medium">{key}</span><span className="font-bold text-[#670D2F]">{Number(breakdown[key]) || 0}/100</span></div><div className="h-2.5 bg-[#FCE5ED] rounded-full overflow-hidden"><div className="h-full bg-[#A53860] rounded-full" style={{ width: Math.max(0, Math.min(100, Number(breakdown[key]) || 0)) + "%" }} /></div></div>)}</div></div></div>
    {analysis.jobMatch && <div className={card + " mt-5"}><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-bold">Job Description Match</h3><span className="text-2xl font-extrabold text-[#A53860]">{analysis.jobMatch.score}/100</span></div><p className="text-gray-600 mt-3 leading-7">{analysis.jobMatch.summary}</p><div className="grid md:grid-cols-2 gap-5 mt-5"><TagSection title="Matched job keywords" items={analysis.jobMatch.matchedKeywords} tone="green" /><TagSection title="Missing job keywords" items={analysis.jobMatch.missingKeywords} tone="red" /></div></div>}
    <div className="grid md:grid-cols-3 gap-5 mt-5"><TagSection title="Matched skills" items={skills.matched} tone="green" /><TagSection title="Partially matched" items={skills.partial} tone="amber" /><TagSection title="Missing skills" items={skills.missing} tone="red" /></div>
    <div className={card + " mt-5"}><div className="flex items-center gap-3 mb-5"><div className={iconBox}><FaFileAlt /></div><h3 className="text-xl font-bold">Section-by-Section Review</h3></div>{sections.length ? <div className="grid md:grid-cols-2 gap-4">{sections.map((s, i) => <div key={s.name + i} className="border border-[#F1D5E0] rounded-2xl p-4 bg-[#FFFBFC]"><div className="flex justify-between gap-3 items-start"><h4 className="font-bold">{s.name}</h4><span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#FCE5ED] text-[#670D2F]">{s.status} · {s.score}/100</span></div><p className="text-sm text-gray-600 mt-3 leading-6">{s.feedback}</p>{s.recommendations?.length > 0 && <ul className="list-disc pl-5 mt-3 text-sm text-gray-600 space-y-1">{s.recommendations.map((r, j) => <li key={j}>{r}</li>)}</ul>}</div>)}</div> : <p className="text-sm text-gray-500">No section review returned.</p>}</div>
    <div className="grid md:grid-cols-2 gap-5 mt-5"><ListSection title="Resume Strengths" icon={<FaStar />} items={analysis.strengths} /><ListSection title="Areas for Improvement" icon={<FaPen />} items={analysis.improvements} /></div>
    <div className={card + " mt-5"}><div className="flex items-center gap-3 mb-5"><div className={iconBox}><FaPen /></div><h3 className="text-xl font-bold">AI Resume Rewriter</h3></div>{rewrites.length ? <div className="space-y-4">{rewrites.map((r, i) => <div key={i} className="border border-[#F1D5E0] rounded-2xl p-4"><p className="text-xs uppercase tracking-wide text-gray-400 font-bold">Original bullet</p><p className="text-sm text-gray-600 mt-1">{r.original}</p><p className="text-xs uppercase tracking-wide text-[#A53860] font-bold mt-4">Suggested rewrite</p><p className="text-sm text-gray-800 mt-1 font-medium">{r.improved}</p><p className="text-xs text-gray-500 mt-3">{r.reason}</p></div>)}</div> : <p className="text-sm text-gray-500">No safe bullet rewrites identified. Add detailed factual project or experience bullets to receive suggestions.</p>}<p className="text-xs text-gray-400 mt-4">Keep only statements that accurately reflect your work.</p></div>
    <div className={card + " mt-5"}><div className="flex items-center gap-3 mb-5"><div className={iconBox}><FaLightbulb /></div><h3 className="text-xl font-bold">Your Improvement Action Plan</h3></div><ol className="space-y-3">{actions.map((item, i) => <li key={i} className="flex gap-3 items-start"><span className="w-7 h-7 shrink-0 rounded-full bg-[#FCE5ED] text-[#A53860] flex items-center justify-center text-sm font-bold">{i + 1}</span><p className="text-sm text-gray-600 leading-6 pt-1">{item}</p></li>)}</ol></div>
    <p className="text-xs text-gray-400 mt-5 leading-5">{analysis.disclaimer || "AI-generated guidance is an estimate and does not guarantee an ATS result. Verify all suggested edits."}</p>
  </section>;
}
export default ResumeAnalyzer;
