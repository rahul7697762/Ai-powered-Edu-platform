import { supabase, supabaseAdmin } from '../config/database.js';
import bcrypt from 'bcrypt';

export class UserService {
  
  // Create a new user
  static async createUser(userData) {
    try {
      const { name, email, password, role = 'student' } = userData;
      
      // Hash the password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      // Use admin client to bypass RLS for user creation
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([{
          name,
          email,
          password_hash,
          role
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Remove password hash from response
      const { password_hash: _, ...userWithoutPassword } = data;
      return userWithoutPassword;
      
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      // Use admin client to bypass RLS for authentication
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      // Use admin client to bypass RLS for user lookup during authentication
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('user_id, name, email, role, created_at')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Update user profile
  static async updateUser(userId, updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('user_id', userId)
        .select('user_id, name, email, role, created_at')
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Password verification failed: ${error.message}`);
    }
  }

  // Get all users (admin only)
  static async getAllUsers(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('user_id, name, email, role, created_at')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
      
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Delete user
  static async deleteUser(userId) {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
      
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Get user statistics
  static async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
      
    } catch (error) {
      // If view doesn't exist, return basic stats
      const user = await this.getUserById(userId);
      return {
        user_id: userId,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        total_resumes: 0,
        total_applications: 0,
        avg_ats_score: 0
      };
    }
  }
}

export default UserService;