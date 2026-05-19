export const demoLocations = [
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Mumbai, Maharashtra",
  "Gurgaon, Haryana",
  "Chennai, Tamil Nadu",
  "Remote - India"
];

export const demoJobs = [
  {
    _id: "demo-frontend",
    title: "Frontend Engineer",
    company: "Northstar Labs",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    salary: "₹12L - ₹22L",
    description: "Build polished React interfaces for hiring teams with attention to accessibility and reusable components.",
    skills: ["React", "JavaScript", "CSS", "REST"],
    questions: [
      { question: "Share a React project you are proud of.", type: "text", required: true },
      { question: "Can you work from the Bengaluru office twice a week?", type: "yes-no", required: true }
    ]
  },
  {
    _id: "demo-backend",
    title: "Backend Developer",
    company: "CivicByte",
    location: "Hyderabad, Telangana",
    type: "Full-time",
    salary: "₹14L - ₹26L",
    description: "Design secure Node.js services, MongoDB data models, and integrations for a workflow platform.",
    skills: ["Node.js", "Express", "MongoDB", "JWT"],
    questions: [
      { question: "Describe an API you designed end to end.", type: "text", required: true },
      { question: "Have you handled authentication in production?", type: "yes-no", required: true }
    ]
  },
  {
    _id: "demo-mern",
    title: "Remote MERN Stack Developer",
    company: "Papertrail Apps",
    location: "Remote - India",
    type: "Remote",
    salary: "₹11L - ₹21L",
    description: "Work across React, Express, and MongoDB to ship maintainable product features for lean teams.",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    questions: [
      { question: "What is your strongest part of the MERN stack?", type: "text", required: true },
      { question: "Have you worked in a fully remote team before?", type: "yes-no", required: true }
    ]
  }
];
