import express from "express";
import { supabaseAdmin } from "../config/database.js";

const router = express.Router();

// Get database status and record counts
router.get("/", async (req, res) => {
  try {
    const status = {
      database: "connected",
      timestamp: new Date().toISOString(),
      tables: {}
    };

    // Check record counts for each table
    const tables = [
      'users', 'resumes', 'ats_results', 'placement_prep', 
      'mock_interviews', 'code_ide', 'time_planner', 
      'recruiter_jobs', 'applications', 'ai_mentor_logs'
    ];

    for (const table of tables) {
      try {
        const { count, error } = await supabaseAdmin
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          status.tables[table] = { status: 'error', error: error.message };
        } else {
          status.tables[table] = { status: 'ok', count: count || 0 };
        }
      } catch (error) {
        status.tables[table] = { status: 'error', error: error.message };
      }
    }

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get recent records from all tables
router.get("/recent", async (req, res) => {
  try {
    const recentData = {};

    // Get recent users
    const { data: users } = await supabaseAdmin
      .from('users')
      .select('user_id, name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    recentData.users = users || [];

    // Get recent resumes
    const { data: resumes } = await supabaseAdmin
      .from('resumes')
      .select('resume_id, user_id, resume_name, ats_score, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    recentData.resumes = resumes || [];

    // Get recent ATS results
    const { data: atsResults } = await supabaseAdmin
      .from('ats_results')
      .select('ats_id, resume_id, overall_score, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    recentData.ats_results = atsResults || [];

    res.json({
      success: true,
      data: recentData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;