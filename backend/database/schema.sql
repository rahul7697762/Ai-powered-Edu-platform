-- AI-Powered Education Platform Database Schema
-- Created for Supabase PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('student', 'recruiter', 'mentor', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
CREATE TYPE task_category AS ENUM ('study', 'interview', 'coding', 'networking', 'other');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes table
CREATE TABLE resumes (
    resume_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resume_name VARCHAR(255) NOT NULL,
    resume_file_path TEXT,
    resume_data JSONB, -- Store resume content as JSON
    ats_score DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATS Results table
CREATE TABLE ats_results (
    ats_id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
    job_description TEXT,
    matching_keywords TEXT[],
    missing_keywords TEXT[],
    overall_score DECIMAL(5,2) DEFAULT 0.00,
    suggestions TEXT,
    analysis_data JSONB, -- Store detailed analysis as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Placement Preparation table
CREATE TABLE placement_prep (
    prep_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    topic VARCHAR(255) NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    mentor_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mock Interviews table
CREATE TABLE mock_interviews (
    interview_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    mentor_id INTEGER REFERENCES users(user_id),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    feedback TEXT,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code IDE table
CREATE TABLE code_ide (
    ide_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    language VARCHAR(50),
    code_snippet TEXT,
    last_run_output TEXT,
    project_data JSONB, -- Store project files and configuration
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time Planner table
CREATE TABLE time_planner (
    planner_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    category task_category DEFAULT 'other',
    status task_status DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recruiter Jobs table
CREATE TABLE recruiter_jobs (
    job_id SERIAL PRIMARY KEY,
    recruiter_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    job_type VARCHAR(50), -- full-time, part-time, contract, internship
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Applications table
CREATE TABLE applications (
    app_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES recruiter_jobs(job_id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resume_id INTEGER REFERENCES resumes(resume_id),
    status application_status DEFAULT 'pending',
    cover_letter TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Mentor Logs table
CREATE TABLE ai_mentor_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    ai_response TEXT,
    context_type VARCHAR(50), -- 'resume_suggestions', 'interview_prep', 'coding_help', etc.
    metadata JSONB, -- Store additional context data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_ats_results_resume_id ON ats_results(resume_id);
CREATE INDEX idx_placement_prep_user_id ON placement_prep(user_id);
CREATE INDEX idx_mock_interviews_student_id ON mock_interviews(student_id);
CREATE INDEX idx_mock_interviews_mentor_id ON mock_interviews(mentor_id);
CREATE INDEX idx_code_ide_user_id ON code_ide(user_id);
CREATE INDEX idx_time_planner_user_id ON time_planner(user_id);
CREATE INDEX idx_recruiter_jobs_recruiter_id ON recruiter_jobs(recruiter_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_ai_mentor_logs_user_id ON ai_mentor_logs(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_placement_prep_updated_at BEFORE UPDATE ON placement_prep
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mock_interviews_updated_at BEFORE UPDATE ON mock_interviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_ide_updated_at BEFORE UPDATE ON code_ide
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_planner_updated_at BEFORE UPDATE ON time_planner
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_prep ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_ide ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_planner ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_mentor_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own resumes" ON resumes
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own ATS results" ON ats_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM resumes 
            WHERE resumes.resume_id = ats_results.resume_id 
            AND resumes.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can view own placement prep" ON placement_prep
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own mock interviews" ON mock_interviews
    FOR ALL USING (
        auth.uid()::text = student_id::text OR 
        auth.uid()::text = mentor_id::text
    );

CREATE POLICY "Users can view own code projects" ON code_ide
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own time planner" ON time_planner
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Recruiters can manage own jobs" ON recruiter_jobs
    FOR ALL USING (auth.uid()::text = recruiter_id::text);

CREATE POLICY "Users can view applications" ON applications
    FOR SELECT USING (
        auth.uid()::text = student_id::text OR 
        EXISTS (
            SELECT 1 FROM recruiter_jobs 
            WHERE recruiter_jobs.job_id = applications.job_id 
            AND recruiter_jobs.recruiter_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Students can create applications" ON applications
    FOR INSERT WITH CHECK (auth.uid()::text = student_id::text);

CREATE POLICY "Users can view own AI logs" ON ai_mentor_logs
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Insert some sample data for testing
INSERT INTO users (name, email, password_hash, role) VALUES
('John Doe', 'john@example.com', '$2b$10$example_hash', 'student'),
('Jane Smith', 'jane@example.com', '$2b$10$example_hash', 'recruiter'),
('Dr. Wilson', 'wilson@example.com', '$2b$10$example_hash', 'mentor'),
('Admin User', 'admin@example.com', '$2b$10$example_hash', 'admin');

-- Create a view for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.user_id,
    u.name,
    u.email,
    u.role,
    COUNT(DISTINCT r.resume_id) as total_resumes,
    COUNT(DISTINCT a.app_id) as total_applications,
    AVG(ar.overall_score) as avg_ats_score
FROM users u
LEFT JOIN resumes r ON u.user_id = r.user_id
LEFT JOIN applications a ON u.user_id = a.student_id
LEFT JOIN ats_results ar ON r.resume_id = ar.resume_id
GROUP BY u.user_id, u.name, u.email, u.role;