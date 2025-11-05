import express from "express";
import { UserService } from "../services/userService.js";
import { ResumeService } from "../services/resumeService.js";
import { ATSService } from "../services/atsService.js";
import { testConnection, supabaseAdmin } from "../config/database.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({ 
      status: isConnected ? "healthy" : "unhealthy", 
      message: isConnected ? "Database connection successful" : "Database connection failed",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
});

// User routes
router.post("/users", authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/users/:id", authenticateToken, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/users/:id", authenticateToken, async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/users/:id/stats", authenticateToken, async (req, res) => {
  try {
    const stats = await UserService.getUserStats(req.params.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Resume routes
router.post("/resumes", authenticateToken, async (req, res) => {
  try {
    const resume = await ResumeService.createResume(req.body);
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/users/:userId/resumes", authenticateToken, async (req, res) => {
  try {
    const resumes = await ResumeService.getUserResumes(req.params.userId);
    res.json({ success: true, data: resumes });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/resumes/:id", authenticateToken, async (req, res) => {
  try {
    const resume = await ResumeService.getResumeById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, error: "Resume not found" });
    }
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/resumes/:id", authenticateToken, async (req, res) => {
  try {
    const resume = await ResumeService.updateResume(req.params.id, req.body);
    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/resumes/:id", authenticateToken, async (req, res) => {
  try {
    await ResumeService.deleteResume(req.params.id);
    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/users/:userId/resumes/stats", authenticateToken, async (req, res) => {
  try {
    const stats = await ResumeService.getResumeStats(req.params.userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ATS routes
router.post("/ats-results", authenticateToken, async (req, res) => {
  try {
    const atsResult = await ATSService.createATSResult(req.body);
    res.status(201).json({ success: true, data: atsResult });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/resumes/:resumeId/ats-results", authenticateToken, async (req, res) => {
  try {
    const atsResults = await ATSService.getATSResultsByResumeId(req.params.resumeId);
    res.json({ success: true, data: atsResults });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/resumes/:resumeId/ats-results/latest", authenticateToken, async (req, res) => {
  try {
    const atsResult = await ATSService.getLatestATSResult(req.params.resumeId);
    if (!atsResult) {
      return res.status(404).json({ success: false, error: "No ATS results found" });
    }
    res.json({ success: true, data: atsResult });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/ats-results/:id", authenticateToken, async (req, res) => {
  try {
    const atsResult = await ATSService.getATSResultById(req.params.id);
    if (!atsResult) {
      return res.status(404).json({ success: false, error: "ATS result not found" });
    }
    res.json({ success: true, data: atsResult });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/ats-results/:id", authenticateToken, async (req, res) => {
  try {
    const atsResult = await ATSService.updateATSResult(req.params.id, req.body);
    res.json({ success: true, data: atsResult });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/users/:userId/ats-results/stats", authenticateToken, async (req, res) => {
  try {
    const stats = await ATSService.getATSStats(req.params.userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/users/:userId/ats-results/keywords", authenticateToken, async (req, res) => {
  try {
    const analysis = await ATSService.getKeywordAnalysis(req.params.userId);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Test data creation endpoint (for development)
router.post("/test-data", authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Use admin client to bypass RLS for testing
    const testEmail = `test${Date.now()}@example.com`;
    
    // Create a test user using admin client
    const { data: testUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        name: "Test Student",
        email: testEmail,
        password_hash: "$2b$10$example_hash_for_testing",
        role: "student"
      }])
      .select()
      .single();

    if (userError) throw new Error(`User creation failed: ${userError.message}`);

    // Create a test resume using admin client
    const { data: testResume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .insert([{
        user_id: testUser.user_id,
        resume_name: "My Test Resume",
        resume_data: {
          fullName: "Test Student",
          email: testUser.email,
          phone: "123-456-7890",
          address: "Test City, TC",
          summary: "Experienced professional seeking new opportunities",
          experience: "Software Developer at Tech Company (2020-2023)",
          education: "Bachelor's in Computer Science",
          skills: "JavaScript, React, Node.js, Python"
        },
        ats_score: 75.5
      }])
      .select()
      .single();

    if (resumeError) throw new Error(`Resume creation failed: ${resumeError.message}`);

    // Create a test ATS result using admin client
    const { data: testATSResult, error: atsError } = await supabaseAdmin
      .from('ats_results')
      .insert([{
        resume_id: testResume.resume_id,
        job_description: "Looking for a skilled software developer with React experience",
        matching_keywords: ["JavaScript", "React", "Software Developer"],
        missing_keywords: ["AWS", "Docker", "Kubernetes"],
        overall_score: 75.5,
        suggestions: "Consider adding cloud technologies like AWS to improve your score",
        analysis_data: {
          keyword_density: 0.15,
          readability_score: 8.5,
          format_score: 9.0
        }
      }])
      .select()
      .single();

    if (atsError) throw new Error(`ATS result creation failed: ${atsError.message}`);

    res.status(201).json({
      success: true,
      message: "Test data created successfully",
      data: {
        user: testUser,
        resume: testResume,
        ats_result: testATSResult
      }
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;