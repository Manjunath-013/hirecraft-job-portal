export const locations = [
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Mumbai, Maharashtra",
  "Gurgaon, Haryana",
  "Chennai, Tamil Nadu",
  "Remote - India"
];

export const seededJobs = [
  {
    title: "Frontend Engineer",
    company: "Northstar Labs",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    salary: "₹12L - ₹22L",
    description:
      "Build polished React interfaces for hiring teams, with attention to accessibility, reusable components, and fast feedback loops.",
    requirements: ["2+ years with React", "Comfortable with REST APIs", "Strong CSS fundamentals"],
    skills: ["React", "JavaScript", "CSS", "REST"],
    questions: [
      { question: "Share a React project you are proud of.", type: "text", required: true },
      { question: "Can you work from the Bengaluru office twice a week?", type: "yes-no", required: true }
    ]
  },
  {
    title: "Backend Developer",
    company: "CivicByte",
    location: "Hyderabad, Telangana",
    type: "Full-time",
    salary: "₹14L - ₹26L",
    description:
      "Design secure Node.js services, MongoDB data models, and integrations for a high-volume workflow platform.",
    requirements: ["Node.js production experience", "MongoDB schema design", "JWT or OAuth knowledge"],
    skills: ["Node.js", "Express", "MongoDB", "JWT"],
    questions: [
      { question: "Describe an API you designed end to end.", type: "text", required: true },
      { question: "Have you handled authentication in production?", type: "yes-no", required: true }
    ]
  },
  {
    title: "Data Analyst",
    company: "Finmark Studio",
    location: "Mumbai, Maharashtra",
    type: "Contract",
    salary: "₹8L - ₹14L",
    description:
      "Turn hiring funnel and product usage data into practical reports for operations and leadership teams.",
    requirements: ["SQL fluency", "Dashboarding experience", "Clear written communication"],
    skills: ["SQL", "Power BI", "Excel", "Analytics"],
    questions: [
      { question: "Which BI tools have you used most recently?", type: "text", required: true },
      { question: "Are you available for a 6 month contract?", type: "yes-no", required: true }
    ]
  },
  {
    title: "Product Designer",
    company: "Kindred Systems",
    location: "Pune, Maharashtra",
    type: "Full-time",
    salary: "₹10L - ₹20L",
    description:
      "Shape practical workflows for recruiters and candidates, from research sketches through production-ready handoff.",
    requirements: ["Portfolio with shipped work", "Figma expertise", "UX writing awareness"],
    skills: ["Figma", "UX Research", "Design Systems", "Prototyping"],
    questions: [
      { question: "Paste a portfolio link or describe one case study.", type: "text", required: true },
      { question: "Have you designed dashboard or workflow software before?", type: "yes-no", required: false }
    ]
  },
  {
    title: "Customer Success Manager",
    company: "OrbitHire",
    location: "Gurgaon, Haryana",
    type: "Full-time",
    salary: "₹9L - ₹16L",
    description:
      "Own onboarding, adoption, and renewal conversations for mid-market hiring teams using a SaaS platform.",
    requirements: ["B2B SaaS experience", "Strong presentation skills", "CRM discipline"],
    skills: ["Customer Success", "SaaS", "CRM", "Communication"],
    questions: [
      { question: "Tell us about a customer save or renewal you influenced.", type: "text", required: true },
      { question: "Can you travel for customer meetings when needed?", type: "yes-no", required: true }
    ]
  },
  {
    title: "Remote MERN Stack Developer",
    company: "Papertrail Apps",
    location: "Remote - India",
    type: "Remote",
    salary: "₹11L - ₹21L",
    description:
      "Work across React, Express, and MongoDB to ship product features for lean teams that care about maintainable code.",
    requirements: ["MERN stack experience", "Git workflow comfort", "Good async communication"],
    skills: ["MongoDB", "Express", "React", "Node.js"],
    questions: [
      { question: "What is your strongest part of the MERN stack?", type: "text", required: true },
      { question: "Have you worked in a fully remote team before?", type: "yes-no", required: true }
    ]
  }
];
