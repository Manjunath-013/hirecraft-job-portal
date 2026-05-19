import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, requireRole("candidate"), async (req, res) => {
  try {
    const { job, resume, coverLetter, answers = [] } = req.body;
    const exists = await Job.findOne({ _id: job, status: "open" });
    if (!exists) return res.status(404).json({ message: "Open job not found" });

    if (resume) {
      const ownedResume = await Resume.exists({ _id: resume, owner: req.user._id });
      if (!ownedResume) return res.status(403).json({ message: "Choose one of your own resumes" });
    }

    const normalizedAnswers = answers.filter((answer) => answer.question?.trim() && answer.answer?.trim());

    const missingRequired = exists.questions?.some((item) => {
      if (!item.required) return false;
      const matched = normalizedAnswers.find((answer) => answer.question === item.question);
      return !matched?.answer?.trim();
    });

    if (missingRequired) {
      return res.status(400).json({ message: "Please answer all required job questions" });
    }

    const application = await Application.create({
      job,
      resume,
      coverLetter,
      answers: normalizedAnswers,
      candidate: req.user._id
    });
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "You already applied to this job" });
    res.status(400).json({ message: error.message });
  }
});

router.get("/mine", protect, requireRole("candidate"), async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate("job")
    .populate("resume", "name")
    .sort({ createdAt: -1 });
  res.json(applications);
});

router.get("/recruiter", protect, requireRole("recruiter"), async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).select("_id");
  const jobIds = jobs.map((job) => job._id);
  const applications = await Application.find({ job: { $in: jobIds } })
    .populate("job", "title company")
    .populate("candidate", "name email location title")
    .populate("resume")
    .sort({ createdAt: -1 });
  res.json(applications);
});

router.patch("/:id/status", protect, requireRole("recruiter"), async (req, res) => {
  const application = await Application.findById(req.params.id).populate("job");
  if (!application) return res.status(404).json({ message: "Application not found" });

  if (String(application.job.recruiter) !== String(req.user._id)) {
    return res.status(403).json({ message: "You can update only your own job applications" });
  }

  application.status = req.body.status;
  await application.save();
  res.json(application);
});

export default router;
