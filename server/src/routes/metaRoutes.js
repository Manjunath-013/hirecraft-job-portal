import express from "express";
import { locations, seededJobs } from "../data/jobSeedData.js";

const router = express.Router();

router.get("/locations", (req, res) => {
  res.json(locations);
});

router.get("/demo-jobs", (req, res) => {
  res.json(seededJobs);
});

export default router;
