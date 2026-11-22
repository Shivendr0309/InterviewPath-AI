import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  fileName: { type: String, required: true },
  atsScore: { type: Number, default: 0, min: 0, max: 100 },
  skillsFound: { type: [String], default: [] },
  strengths: { type: [String], default: [] },
  missingKeywords: { type: [String], default: [] },
  improvements: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  scoreBreakdown: {
    keywords: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    sections: { type: Number, default: 0 },
  },
  skills: {
    matched: { type: [String], default: [] },
    missing: { type: [String], default: [] },
    partial: { type: [String], default: [] },
  },
  sections: [{
    name: String,
    status: { type: String, enum: ["Strong", "Needs improvement", "Missing"] },
    score: { type: Number, min: 0, max: 100 },
    feedback: String,
    recommendations: [String],
  }],
  rewrittenBulletPoints: [{ original: String, improved: String, reason: String }],
  actionPlan: { type: [String], default: [] },
  jobMatch: {
    score: { type: Number, min: 0, max: 100 },
    matchedKeywords: [String],
    missingKeywords: [String],
    summary: String,
  },
  hasJobDescription: { type: Boolean, default: false },
}, { timestamps: true });

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
export default ResumeAnalysis;
