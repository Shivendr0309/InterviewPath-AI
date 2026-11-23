import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { executeCode, isJudge0Configured } from "../utils/judge0.js";

const runAgainstTestCases = async ({ code, language, testCases }) => {
  let passedCount = 0;
  let lastOutput = "";

  for (const test of testCases) {
    const result = await executeCode({ code, language, stdin: test.input });

    if (result.compileOutput) {
      return {
        passed: false,
        output: `Compilation Error:\n${result.compileOutput}`,
        testResults: { passed: passedCount, total: testCases.length },
      };
    }

    if (result.stderr) {
      lastOutput = `Runtime Error:\n${result.stderr}`;
      continue;
    }

    const actual = (result.stdout || "").trim();
    const expected = (test.expectedOutput || "").trim();
    lastOutput = result.stdout || "";

    if (actual === expected) {
      passedCount += 1;
    }
  }

  return {
    passed: passedCount === testCases.length && testCases.length > 0,
    output: lastOutput,
    testResults: { passed: passedCount, total: testCases.length },
  };
};

export const runCode = async (req, res) => {
  try {
    if (!isJudge0Configured()) {
      return res.status(503).json({
        success: false,
        message:
          "Code execution API is not configured yet. Add JUDGE0_API_URL to server/.env (see setup instructions).",
      });
    }

    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ success: false, message: "code and language are required" });
    }

    const problem = await Problem.findById(req.params.id).select("+testCases");
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const sampleTests = problem.testCases.filter((t) => t.isSample);
    const testsToRun = sampleTests.length > 0 ? sampleTests : problem.testCases.slice(0, 1);

    const result = await runAgainstTestCases({ code, language, testCases: testsToRun });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("runCode error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to run code" });
  }
};

export const submitCode = async (req, res) => {
  try {
    if (!isJudge0Configured()) {
      return res.status(503).json({
        success: false,
        message:
          "Code execution API is not configured yet. Add JUDGE0_API_URL to server/.env (see setup instructions).",
      });
    }

    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ success: false, message: "code and language are required" });
    }

    const problem = await Problem.findById(req.params.id).select("+testCases");
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({ success: false, message: "This problem has no test cases configured" });
    }

    const result = await runAgainstTestCases({ code, language, testCases: problem.testCases });

    const submission = await Submission.create({
      userId: req.user.id,
      problemId: problem._id,
      language,
      code,
      mode: "submit",
      passed: result.passed,
      output: result.output,
      testResults: result.testResults,
    });

    res.json({ success: true, data: { ...result, submissionId: submission._id } });
  } catch (error) {
    console.error("submitCode error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to submit code" });
  }
};

/**
 * Return only the authenticated user's submissions. Pagination and filters
 * are applied in MongoDB so history remains efficient as it grows.
 */
export const getSubmissionHistory = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    const { status, language } = req.query;
    const query = { userId: req.user.id };

    if (status === "Accepted") query.passed = true;
    if (status === "Rejected") query.passed = false;
    if (language && language !== "All") query.language = language;

    const [items, total, allSubmissions] = await Promise.all([
      Submission.find(query)
        .populate("problemId", "title difficulty topic")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("problemId language code passed output testResults createdAt"),
      Submission.countDocuments(query),
      Submission.find({ userId: req.user.id })
        .populate("problemId", "topic")
        .select("problemId language passed createdAt"),
    ]);

    const accepted = allSubmissions.filter((item) => item.passed).length;
    const languageCounts = {};
    const topicCounts = {};

    allSubmissions.forEach((item) => {
      languageCounts[item.language] = (languageCounts[item.language] || 0) + 1;
      const topic = item.problemId?.topic || "Uncategorized";
      if (!topicCounts[topic]) topicCounts[topic] = { attempts: 0, accepted: 0 };
      topicCounts[topic].attempts += 1;
      if (item.passed) topicCounts[topic].accepted += 1;
    });

    const recentActivity = {};
    allSubmissions.forEach((item) => {
      const day = new Date(item.createdAt).toISOString().slice(0, 10);
      recentActivity[day] = (recentActivity[day] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        summary: {
          totalSubmissions: allSubmissions.length,
          accepted,
          rejected: allSubmissions.length - accepted,
          acceptanceRate: allSubmissions.length
            ? Math.round((accepted / allSubmissions.length) * 100)
            : 0,
          languages: languageCounts,
          topics: topicCounts,
          recentActivity,
        },
      },
    });
  } catch (error) {
    console.error("getSubmissionHistory error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch submission history" });
  }
};
