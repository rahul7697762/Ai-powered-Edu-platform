import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "healthy", message: "AI Suggestions API is ready" });
});

// Generate AI suggestions for resume improvement
router.post("/generate-suggestions", async (req, res) => {
  try {
    console.log("AI Suggestions request received");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const {
      fullName,
      email,
      phone,
      address,
      summary: rawSummary,
      experience,
      education,
      skills,
      resumeTone,
      targetJob = "",
      targetIndustry = ""
    } = req.body;

    // Sanitize summary field (handle array case)
    const summary = Array.isArray(rawSummary) ? rawSummary.join(' ') : rawSummary;

    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'your_google_ai_api_key_here') {
      console.error("Google AI API key is missing or not configured");
      return res.status(500).json({ 
        error: "AI service not configured", 
        message: "Google AI API key is missing or invalid. Please get a valid API key from https://makersuite.google.com/app/apikey" 
      });
    }

    console.log("Initializing Google AI model...");
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a comprehensive prompt for resume improvement
    const prompt = `As an expert resume writer and career coach, analyze the following resume and provide specific, actionable improvement suggestions.

Resume Details:
- Name: ${fullName || "Not provided"}
- Email: ${email || "Not provided"}
- Phone: ${phone || "Not provided"}
- Address: ${address || "Not provided"}
- Tone: ${resumeTone || "Professional"}
- Target Job: ${targetJob || "General"}
- Target Industry: ${targetIndustry || "General"}

SUMMARY: ${summary || "Not provided"}
EXPERIENCE: ${experience || "Not provided"}
EDUCATION: ${education || "Not provided"}
SKILLS: ${skills || "Not provided"}

Please provide suggestions in this exact JSON format (no extra text):
{
  "overallScore": 85,
  "suggestions": [
    {
      "id": "suggestion_1",
      "section": "summary",
      "type": "content",
      "priority": "high",
      "title": "Brief title",
      "description": "Detailed explanation",
      "currentText": "Current text",
      "suggestedText": "Improved text",
      "reasoning": "Why this helps"
    }
  ],
  "keywordRecommendations": [
    {
      "keyword": "specific keyword",
      "section": "where to add it",
      "importance": "high",
      "context": "how to use it"
    }
  ],
  "formattingTips": [
    {
      "tip": "specific advice",
      "section": "which section",
      "impact": "how it helps"
    }
  ]
}`;

    try {
      console.log("Calling Google AI API...");
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log("AI Response received:", text.substring(0, 200) + "...");

      // Try to parse the JSON response
      let suggestions;
      try {
        // Clean the response and extract JSON
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
          console.log("Successfully parsed AI response");
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        console.log("Raw AI response:", text);
        throw parseError;
      }

      res.json({
        success: true,
        suggestions,
        timestamp: new Date().toISOString()
      });

    } catch (aiError) {
      console.error("Google AI API Error:", aiError);
      
      // Check if it's an API key error
      if (aiError.message && aiError.message.includes('API key')) {
        return res.status(400).json({
          error: "Invalid API key",
          message: "The Google AI API key is invalid. Please get a valid key from https://makersuite.google.com/app/apikey",
          details: aiError.message
        });
      }

      // Provide fallback suggestions for other AI errors
      console.log("Providing fallback suggestions due to AI API error");
      const fallbackSuggestions = {
        overallScore: 75,
        suggestions: [
          {
            id: "fallback_1",
            section: "summary",
            type: "content",
            priority: "high",
            title: "Enhance Professional Summary",
            description: "Your professional summary could be more impactful with specific achievements and metrics.",
            currentText: summary || "Current summary",
            suggestedText: "Results-driven professional with proven track record of achieving measurable outcomes. Skilled in [relevant skills] with experience in [industry/field]. Demonstrated ability to [key achievement] and drive organizational success.",
            reasoning: "A strong summary with metrics and keywords improves ATS compatibility and recruiter engagement."
          },
          {
            id: "fallback_2",
            section: "experience",
            type: "formatting",
            priority: "medium",
            title: "Use Action Verbs and Metrics",
            description: "Start bullet points with strong action verbs and include quantifiable achievements.",
            currentText: experience || "Current experience section",
            suggestedText: "• Achieved [X%] improvement in [metric] by implementing [strategy]\n• Led team of [number] to deliver [outcome] resulting in [benefit]\n• Developed and executed [initiative] that generated [quantifiable result]",
            reasoning: "Action verbs and metrics make your accomplishments more compelling and ATS-friendly."
          },
          {
            id: "fallback_3",
            section: "skills",
            type: "keyword",
            priority: "high",
            title: "Add Industry-Relevant Keywords",
            description: "Include keywords that match your target job requirements.",
            currentText: skills || "Current skills section",
            suggestedText: skills ? `${skills}, Project Management, Data Analysis, Strategic Planning, Problem Solving, Team Leadership` : "Project Management, Data Analysis, Strategic Planning, Problem Solving, Team Leadership, Communication",
            reasoning: "Industry keywords help your resume pass through ATS filters and match job requirements."
          }
        ],
        keywordRecommendations: [
          {
            keyword: "Project Management",
            section: "skills",
            importance: "high",
            context: "Add if you have relevant experience managing projects or teams"
          },
          {
            keyword: "Data Analysis",
            section: "skills",
            importance: "medium",
            context: "Include if you work with data, metrics, or analytics"
          },
          {
            keyword: "Results-driven",
            section: "summary",
            importance: "high",
            context: "Use in professional summary to emphasize achievement orientation"
          }
        ],
        formattingTips: [
          {
            tip: "Use bullet points for experience entries",
            section: "experience",
            impact: "Improves ATS parsing and human readability"
          },
          {
            tip: "Include quantifiable achievements (numbers, percentages, dollar amounts)",
            section: "experience",
            impact: "Numbers make your accomplishments more credible and impactful"
          },
          {
            tip: "Start bullet points with strong action verbs",
            section: "experience",
            impact: "Action verbs create more dynamic and engaging descriptions"
          }
        ]
      };

      res.json({
        success: true,
        suggestions: fallbackSuggestions,
        timestamp: new Date().toISOString(),
        note: "AI service temporarily unavailable. Showing general recommendations."
      });
    }



  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    res.status(500).json({ 
      error: "Failed to generate suggestions", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;