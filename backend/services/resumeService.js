import { supabase } from '../config/database.js';

export class ResumeService {
  
  // Create a new resume
  static async createResume(resumeData) {
    try {
      const { 
        user_id, 
        resume_name, 
        resume_file_path, 
        resume_data,
        ats_score = 0 
      } = resumeData;
      
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id,
          resume_name,
          resume_file_path,
          resume_data,
          ats_score
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      throw new Error(`Failed to create resume: ${error.message}`);
    }
  }

  // Get all resumes for a user
  static async getUserResumes(userId) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data || [];
      
    } catch (error) {
      throw new Error(`Failed to get user resumes: ${error.message}`);
    }
  }

  // Get resume by ID
  static async getResumeById(resumeId, userId = null) {
    try {
      let query = supabase
        .from('resumes')
        .select('*')
        .eq('resume_id', resumeId);

      // If userId is provided, ensure user owns the resume
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // Resume not found
      }
      throw new Error(`Failed to get resume: ${error.message}`);
    }
  }

  // Update resume
  static async updateResume(resumeId, updateData, userId = null) {
    try {
      let query = supabase
        .from('resumes')
        .update({
          ...updateData,
          last_updated: new Date().toISOString()
        })
        .eq('resume_id', resumeId);

      // If userId is provided, ensure user owns the resume
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query
        .select()
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      throw new Error(`Failed to update resume: ${error.message}`);
    }
  }

  // Delete resume
  static async deleteResume(resumeId, userId = null) {
    try {
      let query = supabase
        .from('resumes')
        .delete()
        .eq('resume_id', resumeId);

      // If userId is provided, ensure user owns the resume
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (error) throw error;
      return true;
      
    } catch (error) {
      throw new Error(`Failed to delete resume: ${error.message}`);
    }
  }

  // Update ATS score
  static async updateATSScore(resumeId, atsScore, userId = null) {
    try {
      return await this.updateResume(resumeId, { ats_score: atsScore }, userId);
    } catch (error) {
      throw new Error(`Failed to update ATS score: ${error.message}`);
    }
  }

  // Search resumes by name
  static async searchResumes(userId, searchTerm) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .ilike('resume_name', `%${searchTerm}%`)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data || [];
      
    } catch (error) {
      throw new Error(`Failed to search resumes: ${error.message}`);
    }
  }

  // Get resume with ATS results
  static async getResumeWithATSResults(resumeId, userId = null) {
    try {
      let query = supabase
        .from('resumes')
        .select(`
          *,
          ats_results (*)
        `)
        .eq('resume_id', resumeId);

      // If userId is provided, ensure user owns the resume
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // Resume not found
      }
      throw new Error(`Failed to get resume with ATS results: ${error.message}`);
    }
  }

  // Get resume statistics for a user
  static async getResumeStats(userId) {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('resume_id, ats_score, created_at')
        .eq('user_id', userId);

      if (error) throw error;

      const resumes = data || [];
      const totalResumes = resumes.length;
      const avgScore = totalResumes > 0 
        ? resumes.reduce((sum, resume) => sum + (resume.ats_score || 0), 0) / totalResumes 
        : 0;
      const highestScore = totalResumes > 0 
        ? Math.max(...resumes.map(r => r.ats_score || 0)) 
        : 0;

      return {
        total_resumes: totalResumes,
        average_ats_score: Math.round(avgScore * 100) / 100,
        highest_ats_score: highestScore,
        recent_resumes: resumes.slice(0, 5)
      };
      
    } catch (error) {
      throw new Error(`Failed to get resume statistics: ${error.message}`);
    }
  }
}

export default ResumeService;