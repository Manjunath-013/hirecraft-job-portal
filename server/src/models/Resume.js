import mongoose from "mongoose";

const datedItem = {
  title: String,
  organization: String,
  location: String,
  startDate: String,
  endDate: String,
  description: String
};

const resumeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, default: "Untitled Resume" },
    summary: { type: String, default: "" },
    contact: {
      phone: String,
      email: String,
      website: String,
      location: String
    },
    skills: [{ type: String, trim: true }],
    experience: [datedItem],
    education: [datedItem],
    projects: [
      {
        name: String,
        link: String,
        description: String
      }
    ],
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
