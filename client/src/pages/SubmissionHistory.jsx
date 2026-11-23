import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaCode, FaChartLine, FaHistory } from "react-icons/fa";
import DashboardLayout from "../components/DashboardLayout";
import { getSubmissionHistory } from "../services/problemService";

const dateLabel = (value) => new Date(value).toLocaleString(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function Metric({ label, value, detail }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--secondary)] p-5 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-[var(--text)] mt-1">{value}</p>
      {detail && <p className="text-xs text-gray-500 mt-1">{detail}</p>}
    </div>
  );
}

export default function SubmissionHistory() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");
  const [language, setLanguage] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCode, setExpandedCode] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await getSubmissionHistory({ page, limit: 10, status, language });
        if (active) setData(result);
      } catch (err) {
        if (active) setError(err.response?.data?.message || "Unable to load submission history.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [page, status, language]);

  const summary = data?.summary;
  const topicRows = useMemo(() => Object.entries(summary?.topics || {})
    .sort((a, b) => b[1].attempts - a[1].attempts), [summary]);

  const changeFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  return (
    <DashboardLayout
      active="coding"
      title="Submission History"
      subtitle="Review your attempts, accepted solutions and coding progress."
    >
      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/coding-practice" className="rounded-xl bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-semibold">
          Browse Problems
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Metric label="Total submissions" value={summary?.totalSubmissions ?? "—"} />
        <Metric label="Accepted" value={summary?.accepted ?? "—"} />
        <Metric label="Rejected" value={summary?.rejected ?? "—"} />
        <Metric label="Acceptance rate" value={summary ? `${summary.acceptanceRate}%` : "—"} detail="Across all recorded submissions" />
      </div>

      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-2xl border border-[var(--secondary)] p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[var(--text)] mb-4"><FaChartLine className="text-[var(--primary)]" /> Topic performance</div>
            {topicRows.length === 0 ? <p className="text-sm text-gray-500">No topic activity yet.</p> : (
              <div className="space-y-3">
                {topicRows.map(([topic, counts]) => (
                  <div key={topic}>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium">{topic}</span><span className="text-gray-500">{counts.accepted}/{counts.attempts} accepted</span></div>
                    <div className="h-2 rounded-full bg-[#FCE5ED] overflow-hidden"><div className="h-full bg-[#670D2F]" style={{ width: `${counts.attempts ? (counts.accepted / counts.attempts) * 100 : 0}%` }} /></div>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="bg-white rounded-2xl border border-[var(--secondary)] p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[var(--text)] mb-4"><FaCode className="text-[var(--primary)]" /> Language usage</div>
            {Object.keys(summary.languages || {}).length === 0 ? <p className="text-sm text-gray-500">No language activity yet.</p> : (
              <div className="space-y-3">
                {Object.entries(summary.languages).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
                  <div key={name} className="flex justify-between text-sm"><span>{name}</span><span className="font-semibold">{count} submissions</span></div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <section className="bg-white rounded-2xl border border-[var(--secondary)] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 font-semibold text-[var(--text)]"><FaHistory className="text-[var(--primary)]" /> All submissions</div>
          <div className="flex flex-wrap gap-2">
            <select value={status} onChange={changeFilter(setStatus)} className="border border-[var(--secondary)] rounded-lg px-3 py-2 text-sm bg-white">
              <option>All</option><option>Accepted</option><option>Rejected</option>
            </select>
            <select value={language} onChange={changeFilter(setLanguage)} className="border border-[var(--secondary)] rounded-lg px-3 py-2 text-sm bg-white">
              <option>All</option><option>JavaScript</option><option>Python</option><option>C++</option><option>Java</option>
            </select>
          </div>
        </div>

        {loading && <div className="py-12 text-center text-gray-500">Loading submissions…</div>}
        {!loading && error && <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
        {!loading && !error && data?.items?.length === 0 && (
          <div className="py-12 text-center">
            <FaHistory className="mx-auto text-3xl text-gray-300 mb-3" />
            <p className="font-semibold text-[var(--text)]">No submissions found</p>
            <p className="text-sm text-gray-500 mt-1">Submit a solution to a problem and it will appear here.</p>
          </div>
        )}
        {!loading && !error && data?.items?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="text-xs uppercase text-gray-500 border-b border-[var(--secondary)]"><th className="py-3 pr-4">Problem</th><th className="py-3 pr-4">Language</th><th className="py-3 pr-4">Result</th><th className="py-3 pr-4">Tests</th><th className="py-3">Submitted</th><th className="py-3 text-right">Code</th><th className="py-3 text-right">Code</th></tr></thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item._id} className="border-b border-[var(--secondary)] last:border-0">
                    <td className="py-4 pr-4 min-w-44">
                      {item.problemId ? <Link className="font-semibold text-[var(--primary)] hover:underline" to={`/coding-practice/${item.problemId._id}`}>{item.problemId.title}</Link> : <span className="text-gray-500">Problem unavailable</span>}
                      <p className="text-xs text-gray-500 mt-1">{item.problemId?.topic || "—"} · {item.problemId?.difficulty || "—"}</p>
                    </td>
                    <td className="py-4 pr-4">{item.language}</td>
                    <td className="py-4 pr-4"><span className={`inline-flex items-center gap-1 font-semibold ${item.passed ? "text-green-700" : "text-red-600"}`}>{item.passed ? <FaCheckCircle /> : <FaTimesCircle />}{item.passed ? "Accepted" : "Rejected"}</span></td>
                    <td className="py-4 pr-4">{item.testResults?.passed ?? 0}/{item.testResults?.total ?? 0}</td>
                    <td className="py-4 whitespace-nowrap text-gray-500">{dateLabel(item.createdAt)}</td>
                    <td className="py-4 text-right"><button onClick={() => setExpandedCode((current) => current === item._id ? null : item._id)} className="text-[var(--primary)] font-semibold hover:underline">{expandedCode === item._id ? "Hide code" : "View code"}</button></td>
                  </tr>
                  {expandedCode === item._id && (
                    <tr key={item._id + "-code"} className="bg-[var(--background)]">
                      <td colSpan={6} className="p-3">
                        <p className="text-xs font-semibold text-gray-500 mb-2">{item.language} · Submitted code</p>
                        <pre className="max-h-72 overflow-auto rounded-xl bg-[#240713] text-[#FCE5ED] p-4 text-xs leading-5 whitespace-pre-wrap"><code>{item.code}</code></pre>
                        {item.output && <><p className="text-xs font-semibold text-gray-500 mt-3 mb-1">Last output</p><pre className="max-h-32 overflow-auto rounded-lg bg-white border border-[var(--secondary)] p-3 text-xs whitespace-pre-wrap">{item.output}</pre></>}
                      </td>
                    </tr>
                  )}
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && data?.pagination?.pages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--secondary)]">
            <p className="text-xs text-gray-500">Page {data.pagination.page} of {data.pagination.pages} · {data.pagination.total} submissions</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="px-3 py-2 rounded-lg border border-[var(--secondary)] text-sm disabled:opacity-40">Previous</button>
              <button disabled={page >= data.pagination.pages} onClick={() => setPage((value) => value + 1)} className="px-3 py-2 rounded-lg border border-[var(--secondary)] text-sm disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
