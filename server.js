const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Task = require("./models/Task");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");
const Project = require("./models/Project");
const app = express();

const PORT = 3000;

app.use(express.json());



// DATABASE

console.log("Mongo URI exists:", !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });


// AUTH ROUTES

// Register
app.post("/api/auth/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        next(error);
    }
});


// Login
app.post("/api/auth/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        next(error);
    }
});


// GENERAL ROUTE
app.get("/", (req, res) => {
    res.send("THIS IS THE NEW SERVER");
});


// TASK ROUTES

// Get all user's tasks
app.get("/api/tasks", authMiddleware, async (req, res, next) => {
    try {
        const tasks = await Task.find({
            user: req.user.userId
        });

        res.json(tasks);

    } catch (error) {
        next(error);
    }
});


// Get one user's task
app.get("/api/tasks/:id", authMiddleware, async (req, res, next) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {
        next(error);
    }
});


// Create task
app.post("/api/tasks", authMiddleware, async (req, res, next) => {
    try {
        const task = new Task({
            title: req.body.title,
            completed: req.body.completed || false,
            user: req.user.userId
        });

        const savedTask = await task.save();

        res.status(201).json(savedTask);

    } catch (error) {
        next(error);
    }
});


// Update task
app.put("/api/tasks/:id", authMiddleware, async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            {
                title: req.body.title,
                completed: req.body.completed
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {
        next(error);
    }
});


// Delete task
app.delete("/api/tasks/:id", authMiddleware, async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully",
            task
        });

    } catch (error) {
        next(error);
    }
});

// PROJECT ROUTES

// Get all projects
app.get("/api/projects", authMiddleware, async (req, res, next) => {
    try {
        const projects = await Project.find({
            user: req.user.userId
        });

        res.json(projects);
    } catch (error) {
        next(error);
    }
});


// Get one project
app.get("/api/projects/:id", authMiddleware, async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
});


// Create project
app.post("/api/projects", authMiddleware, async (req, res, next) => {
    try {
        const project = new Project({
            name: req.body.name,
            description: req.body.description,
            user: req.user.userId
        });

        const savedProject = await project.save();

        res.status(201).json(savedProject);
    } catch (error) {
        next(error);
    }
});


// Update project
app.put("/api/projects/:id", authMiddleware, async (req, res, next) => {
    try {
        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            {
                name: req.body.name,
                description: req.body.description
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
});


// Delete project
app.delete("/api/projects/:id", authMiddleware, async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Project deleted successfully",
            project
        });
    } catch (error) {
        next(error);
    }
});


// ERROR HANDLING

app.use(errorMiddleware);


// START SERVER

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});