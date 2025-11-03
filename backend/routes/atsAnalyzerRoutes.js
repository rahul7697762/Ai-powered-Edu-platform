import express from "express";
import { Client } from "@gradio/client";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'), false);
    }
  }
});

// Initialize Gradio client
let gradioClient = null;

const initializeClient = async () => {
  if (!gradioClient) {
    try {
      gradioClient = await Client.connect("girishwangikar/ResumeATS");
      console.log("✅ Connected to ATS Resume Analyzer API");
    } catch (error) {
      console.error("❌ Failed to connect to ATS API:", error);
      throw error;
    }
  }
  return gradioClient;
};

// Process resume file and extract text
router.post("/process-resume", upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    const client = await initializeClient();
    
    // Convert buffer to blob for Gradio client
    const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    
    const result = await client.predict("/process_resume", {
      file: fileBlob,
    });

    res.json({ 
      success: true, 
      resumeText: result.data[0],
      filename: req.file.originalname
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ 
      error: "Failed to process resume", 
      details: error.message 
    });
  }
});

// Analyze resume against job description
router.post("/analyze-resume", async (req, res) => {
  try {
    const { 
      resumeText, 
      jobDescription, 
      withJobDescription = true, 
      temperature = 0.5, 
      maxTokens = 1024 
    } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required" });
    }

    if (withJobDescription && !jobDescription) {
      return res.status(400).json({ error: "Job description is required when analyzing with job description" });
    }

    const client = await initializeClient();
    
    const result = await client.predict("/analyze_resume", {
      resume_text: resumeText,
      job_description: jobDescription || "",
      with_job_description: withJobDescription,
      temperature: temperature,
      max_tokens: maxTokens,
    });

    res.json({ 
      success: true, 
      analysis: result.data[0] 
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ 
      error: "Failed to analyze resume", 
      details: error.message 
    });
  }
});

// Rephrase text content
router.post("/rephrase-text", async (req, res) => {
  try {
    const { text, temperature = 0.5, maxTokens = 1024 } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text to rephrase is required" });
    }

    const client = await initializeClient();
    
    const result = await client.predict("/rephrase_text", {
      text: text,
      temperature: temperature,
      max_tokens: maxTokens,
    });

    res.json({ 
      success: true, 
      rephrasedText: result.data[0] 
    });
  } catch (error) {
    console.error("Error rephrasing text:", error);
    res.status(500).json({ 
      error: "Failed to rephrase text", 
      details: error.message 
    });
  }
});

// Generate cover letter
router.post("/generate-cover-letter", async (req, res) => {
  try {
    const { 
      resumeText, 
      jobDescription, 
      temperature = 0.5, 
      maxTokens = 1024 
    } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ 
        error: "Both resume text and job description are required" 
      });
    }

    const client = await initializeClient();
    
    const result = await client.predict("/generate_cover_letter", {
      resume_text: resumeText,
      job_description: jobDescription,
      temperature: temperature,
      max_tokens: maxTokens,
    });

    res.json({ 
      success: true, 
      coverLetter: result.data[0] 
    });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({ 
      error: "Failed to generate cover letter", 
      details: error.message 
    });
  }
});

// Generate interview questions
router.post("/generate-interview-questions", async (req, res) => {
  try {
    const { 
      jobDescription, 
      temperature = 0.5, 
      maxTokens = 1024 
    } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ 
        error: "Job description is required" 
      });
    }

    const client = await initializeClient();
    
    const result = await client.predict("/generate_interview_questions", {
      job_description: jobDescription,
      temperature: temperature,
      max_tokens: maxTokens,
    });

    res.json({ 
      success: true, 
      interviewQuestions: result.data[0] 
    });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ 
      error: "Failed to generate interview questions", 
      details: error.message 
    });
  }
});

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    await initializeClient();
    res.json({ status: "healthy", message: "ATS Analyzer API is connected" });
  } catch (error) {
    res.status(503).json({ 
      status: "unhealthy", 
      message: "Failed to connect to ATS API",
      error: error.message 
    });
  }
});

export default router;