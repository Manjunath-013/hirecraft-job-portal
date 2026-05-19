import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"], default: "Full-time" },
    salary: { type: String, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    questions: [
      {
        question: { type: String, required: true, trim: true },
        type: { type: String, enum: ["text", "yes-no"], default: "text" },
        required: { type: Boolean, default: true }
      }
    ],
    status: { type: String, enum: ["open", "closed"], default: "open" },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", company: "text", location: "text", skills: "text" });

export default mongoose.model("Job", jobSchema);
