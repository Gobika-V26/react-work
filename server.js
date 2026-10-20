import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Web Development", "AI", "Mobile App"]
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed"],
      default: "Planning"
    },
    deadline: {
      type: Date
    }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

// Sample data for the first run
const sampleProjects = [
  {
    name: "Smart Campus Portal",
    description: "Manage campus events and student activities.",
    category: "Web Development",
    status: "In Progress",
    deadline: new Date("2026-12-15")
  },
  {
    name: "AI Chatbot",
    description: "Answer student questions using an AI chatbot.",
    category: "AI",
    status: "Planning",
    deadline: new Date("2026-12-20")
  },
  {
    name: "Mobile Attendance App",
    description: "Manage student attendance using a mobile application.",
    category: "Mobile App",
    status: "Completed",
    deadline: new Date("2026-11-30")
  }
];

app.get("/", (req, res) => {
  res.send("Project Management API is running");
});

// GET all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve projects" });
  }
});

// GET one project by MongoDB ID
app.get("/api/projects/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve project" });
  }
});

// CREATE a project
app.post("/api/projects", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a project
app.put("/api/projects/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a project
app.delete("/api/projects/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project" });
  }
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const count = await Project.countDocuments();

    if (count === 0) {
      await Project.insertMany(sampleProjects);
      console.log("Sample projects inserted");
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();