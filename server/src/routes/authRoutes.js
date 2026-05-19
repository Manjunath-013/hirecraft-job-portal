import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, company, title, location } = req.body;

    if (!["candidate", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Choose candidate or recruiter role" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email is already registered" });

    const user = await User.create({ name, email, password, role, company, title, location });
    res.status(201).json({ token: signToken(user), user: user.toSafeJSON() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ message: `Use the ${user.role} login for this account` });
  }

  res.json({ token: signToken(user), user: user.toSafeJSON() });
});

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
