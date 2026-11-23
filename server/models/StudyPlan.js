import mongoose from "mongoose";

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic: { type: String, required: true, trim: true, maxlength: 100 },
    days: { type: Number, required: true, min: 1, max: 90 },
    hoursPerDay: { type: Number, required: true, min: 0.5, max: 12 },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    plan: {
      type: [
        {
          day: Number,
          topics: { type: [String], default: [] },
          tasks: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    completedTasks: {
      type: [{ key: { type: String, required: true } }],
      default: [],
    },
  },
  { timestamps: true }
);

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);
export default StudyPlan;
