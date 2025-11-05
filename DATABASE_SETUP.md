# Database Setup Guide

## Supabase Database Configuration

Your Supabase database is configured with the following credentials:

- **Project URL**: https://hrlncrvcwhvymwsfmyxi.supabase.co
- **Database Host**: db.hrlncrvcwhvymwsfmyxi.supabase.co
- **Database Name**: postgres

## Setup Instructions

### 1. Manual Schema Setup (Recommended)

Since Supabase requires manual SQL execution for DDL statements, follow these steps:

1. **Go to Supabase SQL Editor**:
   - Visit: https://supabase.com/dashboard/project/hrlncrvcwhvymwsfmyxi/sql
   - Login with your Supabase account

2. **Execute the Schema**:
   - Copy the contents of `backend/database/schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**:
   - Go to Table Editor: https://supabase.com/dashboard/project/hrlncrvcwhvymwsfmyxi/editor
   - You should see all the tables listed

### 2. Environment Variables

The following environment variables are already configured in your `.env.local`:

```bash
# Supabase Configuration
SUPABASE_URL="https://hrlncrvcwhvymwsfmyxi.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# PostgreSQL Configuration
POSTGRES_URL="postgres://postgres.hrlncrvcwhvymwsfmyxi:qjPwhJHiB77AF6It@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
```

### 3. Database Schema Overview

The database includes the following tables:

#### Core Tables:
- **users**: User accounts (students, recruiters, mentors, admins)
- **resumes**: Resume storage with JSON data and ATS scores
- **ats_results**: ATS analysis results with keyword matching
- **ai_mentor_logs**: AI interaction history

#### Feature Tables:
- **placement_prep**: Placement preparation tracking
- **mock_interviews**: Interview scheduling and feedback
- **code_ide**: Code project storage
- **time_planner**: Task and schedule management
- **recruiter_jobs**: Job postings
- **applications**: Job applications

### 4. Testing the Setup

After setting up the schema, test the database connection:

```bash
# Test database health
curl http://localhost:5000/api/database/health

# Create test data
curl -X POST http://localhost:5000/api/database/test-data
```

### 5. API Endpoints

Once the database is set up, you can use these endpoints:

#### Users:
- `POST /api/database/users` - Create user
- `GET /api/database/users/:id` - Get user
- `PUT /api/database/users/:id` - Update user
- `GET /api/database/users/:id/stats` - Get user statistics

#### Resumes:
- `POST /api/database/resumes` - Create resume
- `GET /api/database/users/:userId/resumes` - Get user resumes
- `GET /api/database/resumes/:id` - Get resume
- `PUT /api/database/resumes/:id` - Update resume
- `DELETE /api/database/resumes/:id` - Delete resume

#### ATS Results:
- `POST /api/database/ats-results` - Create ATS result
- `GET /api/database/resumes/:resumeId/ats-results` - Get ATS results
- `GET /api/database/users/:userId/ats-results/stats` - Get ATS statistics

### 6. Row Level Security (RLS)

The database includes Row Level Security policies to ensure:
- Users can only access their own data
- Recruiters can only manage their own job postings
- Students can only see their own applications
- Mentors can access interviews they're involved in

### 7. Sample Data

The schema includes sample users for testing:
- Student: john@example.com
- Recruiter: jane@example.com  
- Mentor: wilson@example.com
- Admin: admin@example.com

### 8. Integration with Resume Builder

To integrate the database with your existing resume builder:

1. **Save Resume Data**: When users create resumes, save them to the database
2. **Store ATS Results**: Save ATS analysis results for tracking
3. **User Profiles**: Create user accounts for personalized experience
4. **Resume History**: Track multiple resume versions and improvements

### 9. Troubleshooting

**Connection Issues**:
- Verify environment variables are loaded correctly
- Check Supabase project status
- Ensure IP is whitelisted (if applicable)

**Permission Issues**:
- Verify RLS policies are set correctly
- Check user authentication
- Ensure proper role assignments

**Schema Issues**:
- Re-run the schema SQL in Supabase SQL Editor
- Check for any SQL syntax errors
- Verify all tables were created successfully

### 10. Next Steps

1. Execute the schema in Supabase SQL Editor
2. Test the database connection
3. Create test data using the API
4. Integrate with your resume builder frontend
5. Add user authentication
6. Implement data persistence for resumes and ATS results

For any issues, check the server logs or contact support.