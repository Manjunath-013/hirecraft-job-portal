import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

function normalizeJobInput(body) {
  return {
    ...body,
    skills: (body.skills || []).map((skill) => skill.trim()).filter(Boolean),
    requirements: (body.requirements || []).map((item) => item.trim()).filter(Boolean),
    questions: (body.questions || [])
      .filter((item) => item.question?.trim())
      .map((item) => ({
        question: item.question.trim(),
        type: item.type === "yes-no" ? "yes-no" : "text",
        required: Boolean(item.required)
      }))
  };
}

router.get("/", async (req, res) => {
  const { q, location, type } = req.query;
  const filter = { status: "open" };

  if (q) filter.$text = { $search: q };
  if (location) filter.location = new RegExp(location, "i");
  if (type) filter.type = type;

  const jobs = await Job.find(filter).populate("recruiter", "name company").sort({ createdAt: -1 });
  res.json(jobs);
});

router.get("/mine", protect, requireRole("recruiter"), async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
});

router.post("/", protect, requireRole("recruiter"), async (req, res) => {
  const job = await Job.create({ ...normalizeJobInput(req.body), recruiter: req.user._id });
  res.status(201).json(job);
});

router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id).populate("recruiter", "name company location");
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

router.put("/:id", protect, requireRole("recruiter"), async (req, res) => {
  const job = await Job.findOneAndUpdate({ _id: req.params.id, recruiter: req.user._id }, normalizeJobInput(req.body), {
    new: true,
    runValidators: true
  });
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

router.delete("/:id", protect, requireRole("recruiter"), async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
  if (!job) return res.status(404).json({ message: "Job not found" });
  await Application.deleteMany({ job: req.params.id });
  res.json({ message: "Job deleted" });
});

export default router;
