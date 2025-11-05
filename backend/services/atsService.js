import { supabase } from '../config/database.js';

export class ATSService {
  
  // Create ATS analysis result
  static async createATSResult(atsData) {
    try {
      const { 
        resume_id,
        job_description,
        matching_keywords = [],
        missing_keywords = [],
        overall_score = 0,
        suggestions = '',
        analysis_data = {}
      } = atsData;
      
      const { data, error } = await supabase
        .from('ats_results')
        .insert([{
          resume_id,
          job_description,
          matching_keywords,
          missing_keywords,
          overall_score,
          suggestions,
          analysis_data
        }])
        .select()
        .single();

      if (error) throw error;

      // Update the resume's ATS score
      await supabase
        .from('resumes')
        .update({ ats_score: overall_score })
        .eq('resume_id', resume_id);

      return data;
      
    } catch (error) {
      throw new Error(`Failed to create ATS result: ${error.message}`);
    }
  }

  // Get ATS results for a resume
  static async getATSResultsByResumeId(resumeId) {
    try {
      const { data, error } = await supabase
        .from('ats_results')
        .select('*')
        .eq('resume_id', resumeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
      
    } catch (error) {
      throw new Error(`Failed to get ATS results: ${error.message}`);
    }
  }

  // Get latest ATS result for a resume
  static async getLatestATSResult(resumeId) {
    try {
      const { data, error } = await supabase
        .from('ats_results')
        .select('*')
        .eq('resume_id', resumeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // No ATS results found
      }
      throw new Error(`Failed to get latest ATS result: ${error.message}`);
    }
  }

  // Get ATS result by ID
  static async getATSResultById(atsId) {
    try {
      const { data, error } = await supabase
        .from('ats_results')
        .select(`
          *,
          resumes (
            resume_id,
            resume_name,
            user_id,
            users (
              user_id,
              name,
              email
            )
          )
        `)
        .eq('ats_id', atsId)
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // ATS result not found
      }
      throw new Error(`Failed to get ATS result: ${error.message}`);
    }
  }

  // Update ATS result
  static async updateATSResult(atsId, updateData) {
    try {
      const { data, error } = await supabase
        .from('ats_results')
        .update(updateData)
        .eq('ats_id', atsId)
        .select()
        .single();

      if (error) throw error;

      // If overall_score is updated, update the resume's ATS score too
      if (updateData.overall_score !== undefined) {
        await supabase
          .from('resumes')
          .update({ ats_score: updateData.overall_score })
          .eq('resume_id', data.resume_id);
      }

      return data;
      
    } catch (error) {
      throw new Error(`Failed to update ATS result: ${error.message}`);
    }
  }

  // Delete ATS result
  static async deleteATSResult(atsId) {
    try {
      const { error } = await supabase
        .from('ats_results')
        .delete()
        .eq('ats_id', atsId);

      if (error) throw error;
      return true;
      
    } catch (error) {
      throw new Error(`Failed to delete ATS result: ${error.message}`);
    }
  }

  // Get ATS statistics for a user
  static async getATSStats(userId) {
    try {
      const { data, error } = await supabase
        .from('ats_results')
        .select(`
          ats_id,
          overall_score,
          created_at,
          resumes!inner (
            resume_id,
            user_id
          )
        `)
        .eq('resumes.user_id', userId);

      if (error) throw error;

      const results = data || [];
      const totalAnalyses = results.length;
      const avgScore = totalAnalyses > 0 
        ? results.reduce((sum, result) => sum + (result.overall_score || 0), 0) / totalAnalyses 
        : 0;
      const highestScore = totalAnalyses > 0 
        ? Math.max(...results.map(r => r.overall_score || 0)) 
        : 0;
      const lowestScore = totalAnalyses > 0 
        ? Math.min(...results.map(r => r.overall_score || 0)) 
        : 0;

      return {
        total_analyses: totalAnalyses,
        average_score: Math.round(avgScore * 100) / 100,
        highest_score: highestScore,
        lowest_score: lowestScore,
        recent_analyses: results.slice(0, 5)
      };
      
    } catch (error) {
      throw new Error(`Failed to get ATS statistics: ${error.message}`);
    }
  }

  // Search ATS results by job description keywords
  static async searchATSResults(userId, searchTerm) {
    try {
      const { data, error } = await supabase
        .from('ats_results')
        .select(`
          *,
          resumes!inner (
            resume_id,
            resume_name,
            user_id
          )
        `)
        .eq('resumes.user_id', userId)
        .ilike('job_description', `%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
      
    } catch (error) {
      throw new Error(`Failed to search ATS results: ${error.message}`);
    }
  }

  // Get keyword analysis across all ATS results for a user
  static async getKeywordAnalysis(userId) {
    try {
      const { data, error } = await supabase
        .from('ats_results')
        .select(`
          matching_keywords,
          missing_keywords,
          resumes!inner (
            user_id
          )
        `)
        .eq('resumes.user_id', userId);

      if (error) throw error;

      const results = data || [];
      const allMatchingKeywords = [];
      const allMissingKeywords = [];

      results.forEach(result => {
        if (result.matching_keywords) {
          allMatchingKeywords.push(...result.matching_keywords);
        }
        if (result.missing_keywords) {
          allMissingKeywords.push(...result.missing_keywords);
        }
      });

      // Count keyword frequencies
      const matchingFreq = {};
      const missingFreq = {};

      allMatchingKeywords.forEach(keyword => {
        matchingFreq[keyword] = (matchingFreq[keyword] || 0) + 1;
      });

      allMissingKeywords.forEach(keyword => {
        missingFreq[keyword] = (missingFreq[keyword] || 0) + 1;
      });

      // Sort by frequency
      const topMatching = Object.entries(matchingFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

      const topMissing = Object.entries(missingFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

      return {
        top_matching_keywords: topMatching.map(([keyword, count]) => ({ keyword, count })),
        top_missing_keywords: topMissing.map(([keyword, count]) => ({ keyword, count })),
        total_analyses: results.length
      };
      
    } catch (error) {
      throw new Error(`Failed to get keyword analysis: ${error.message}`);
    }
  }
}

export default ATSService;