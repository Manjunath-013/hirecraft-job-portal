import User from "../models/User.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import Application from "../models/Application.js";
import { seededJobs } from "../data/jobSeedData.js";

export async function seedDemoData({ force = false } = {}) {
  let recruiter = await User.findOne({ email: "recruiter@hirecraft.test" });

  if (!recruiter) {
    recruiter = await User.create({
      name: "Demo Recruiter",
      email: "recruiter@hirecraft.test",
      password: "password123",
      role: "recruiter",
      company: "HireCraft Demo",
      title: "Talent Partner",
      location: "Bengaluru, Karnataka"
    });
  }

  const existingJobs = await Job.countDocuments({ recruiter: recruiter._id });

  if (force) {
    const recruiterJobs = await Job.find({ recruiter: recruiter._id }).select("_id");
    await Application.deleteMany({ job: { $in: recruiterJobs.map((job) => job._id) } });
    await Job.deleteMany({ recruiter: recruiter._id });
  }

  if (force || existingJobs === 0) {
    await Job.insertMany(seededJobs.map((job) => ({ ...job, recruiter: recruiter._id })));
  }

  let candidate = await User.findOne({ email: "candidate@hirecraft.test" });

  if (!candidate) {
    candidate = await User.create({
      name: "Demo Candidate",
      email: "candidate@hirecraft.test",
      password: "password123",
      role: "candidate",
      title: "MERN Stack Developer",
      location: "Remote - India"
    });
  }

  let resume = await Resume.findOne({ owner: candidate._id, name: "Demo MERN Resume" });

  if (!resume) {
    resume = await Resume.create({
      owner: candidate._id,
      name: "Demo MERN Resume",
      summary: "MERN developer with practical experience building authenticated dashboards and CRUD workflows.",
      contact: {
        email: candidate.email,
        phone: "+91 90000 00000",
        location: candidate.location,
        website: "https://portfolio.example.com"
      },
      skills: ["React", "Node.js", "Express", "MongoDB", "JWT"],
      experience: [
        {
          title: "Full Stack Developer",
          organization: "Freelance",
          location: "Remote",
          startDate: "2024",
          endDate: "Present",
          description: "Built MERN applications with authentication, dashboards, and deployment-ready APIs."
        }
      ],
      projects: [
        {
          name: "Job Portal",
          link: "https://github.com/demo/job-portal",
          description: "Created a recruiter and candidate workflow with screening questions and applications."
        }
      ],
      isPrimary: true
    });
  }

  const applicationJob = await Job.findOne({ recruiter: recruiter._id, title: "Remote MERN Stack Developer" });

  if (applicationJob) {
    await Application.findOneAndUpdate(
      { job: applicationJob._id, candidate: candidate._id },
      {
        job: applicationJob._id,
        candidate: candidate._id,
        resume: resume._id,
        coverLetter: "I have built MERN projects with role-based auth, resume flows, and production-ready APIs.",
        answers: [
          { question: "What is your strongest part of the MERN stack?", answer: "React and Express API integration." },
          { question: "Have you worked in a fully remote team before?", answer: "Yes" }
        ],
        status: "submitted"
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return { recruiter, candidate, jobCount: seededJobs.length };
}
