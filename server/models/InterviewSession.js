import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      default: "",
    },

    interviewType: {
      type: String,
      default: "Technical",
    },

    questionType: {
      type: String,
      default: "Descriptive",
    },

    difficulty: {
      type: String,
      default: "Medium",
    },

    experienceLevel: {
      type: String,
      default: "Fresher",
    },

    questionCount: {
      type: Number,
      default: 0,
    },

    focusAreas: {
      type: [String],
      default: [],
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    technicalScore: {
      type: Number,
      default: 0,
    },

    problemSolvingScore: {
      type: Number,
      default: 0,
    },

    communicationScore: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weakAreas: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },

    questionFeedback: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    overallFeedback: {
      type: String,
      default: "",
    },

    responses: {
      type: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewQuestion",
          },

          question: String,

          answer: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const InterviewSession = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);

export default InterviewSession;