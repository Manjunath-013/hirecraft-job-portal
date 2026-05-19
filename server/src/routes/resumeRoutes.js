import express from "express";
import Resume from "../models/Resume.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, requireRole("candidate"));

router.get("/", async (req, res) => {
  const resumes = await Resume.find({ owner: req.user._id }).sort({ updatedAt: -1 });
  res.json(resumes);
});

router.post("/", async (req, res) => {
  const resume = await Resume.create({ ...req.body, owner: req.user._id });
  res.status(201).json(resume);
});

router.put("/:id", async (req, res) => {
  const resume = await Resume.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, {
    new: true,
    runValidators: true
  });
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json(resume);
});

router.delete("/:id", async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json({ message: "Resume deleted" });
});

export default router;
