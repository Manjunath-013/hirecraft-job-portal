# HireCraft Job Portal

HireCraft is a MERN job portal with candidate and recruiter roles, JWT authentication, recruiter job management, candidate job applications, and a resume builder with full CRUD-style editing.

## Tech Stack

- MongoDB + Mongoose
- Express + Node.js
- React + Vite
- JWT auth with role guards
- Plain CSS with a clean, hand-crafted product UI

## Run Locally

```bash
npm run install:all
copy server\.env.example server\.env
npm run seed --prefix server
npm run dev
```

For quick local previews, the server starts an in-memory MongoDB automatically when `MONGO_URI` is not set. For real persistence, update `server/.env` with your MongoDB URI and JWT secret.

The seed command creates a demo recruiter and sample jobs in Bengaluru, Hyderabad, Pune, Mumbai, Gurgaon, Chennai, and Remote India. These locations were chosen from current public job-market signals where LinkedIn and Naukri-style listings repeatedly surface Indian tech/data/product roles in those cities.

Demo recruiter:

```text
recruiter@hirecraft.test
password123
```

Demo candidate:

```text
candidate@hirecraft.test
password123
```

## Deploy

### Frontend on Vercel

This repository includes `vercel.json`, configured to deploy the React client from `client/dist`.

1. Push this repository to GitHub.
2. Import the GitHub repository in Vercel.
3. Use the default Vercel settings from `vercel.json`.
4. Set `VITE_API_URL` in Vercel to your deployed backend URL, for example:

```text
https://your-api-service.onrender.com/api
```

### Backend

Deploy `server` to Render, Railway, Fly.io, or another Node host. Add the variables from `server/.env.example`, especially:

```text
MONGO_URI=your MongoDB Atlas connection string
JWT_SECRET=your long production secret
CLIENT_URL=your Vercel frontend URL
```

The backend also serves the built React app when `client/dist` exists, so one-service deployment is supported.

## Resume Description

Built a full-stack MERN job portal with separate recruiter and candidate workflows. Implemented JWT authentication, role-based dashboards, recruiter job CRUD, candidate resume builder, job applications with screening questions, and application review with timestamps/status tracking. Designed a responsive, human-centered React UI and prepared the project for deployment with environment-based configuration.
