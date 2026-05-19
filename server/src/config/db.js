import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export async function connectDB() {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log("Using in-memory MongoDB for local development");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_TIMEOUT_MS) || 10000
  });
  console.log("MongoDB connected");
}
