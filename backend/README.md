# AI-Powered Education Platform - Backend API

This is the backend API for the AI-Powered Education Platform, providing resume building and ATS analysis functionality.

## Features

- **Resume Builder API**: Generate professional PDF resumes with multiple templates
- **ATS Analyzer API**: Analyze resumes against job descriptions using AI
- **AI Suggestions API**: Get AI-powered suggestions for resume improvement
- **Database Integration**: Full Supabase PostgreSQL database with user management
- **Multiple Templates**: Support for 10+ professional resume templates
- **PDF Generation**: High-quality PDF output with proper formatting
- **Bullet Point Support**: Automatic formatting of bullet points in resumes
- **Keyword Optimization**: AI-driven keyword recommendations for better ATS compatibility
- **Data Persistence**: Store resumes, ATS results, and user profiles

## Tech Stack

- **Node.js** with Express.js
- **PDFKit** for PDF generation
- **Multer** for file uploads
- **@gradio/client** for AI integration
- **@google/generative-ai** for Google Gemini AI integration
- **@supabase/supabase-js** for database operations
- **PostgreSQL** with Supabase for data storage
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Resume Builder
- `POST /api/resume-builder/generate-pdf` - Generate PDF resume
- `GET /api/resume-builder/health` - Health check

### ATS Analyzer
- `POST /api/ats-analyzer/process-resume` - Upload and process resume
- `POST /api/ats-analyzer/analyze-resume` - Analyze resume against job description
- `POST /api/ats-analyzer/generate-cover-letter` - Generate cover letter
- `POST /api/ats-analyzer/generate-interview-questions` - Generate interview questions
- `POST /api/ats-analyzer/rephrase-text` - Rephrase text content
- `GET /api/ats-analyzer/health` - Health check

### AI Suggestions
- `POST /api/ai-suggestions/generate-suggestions` - Generate AI-powered resume improvement suggestions
- `GET /api/ai-suggestions/health` - Health check

### Database
- `GET /api/database/health` - Database connection health check
- `POST /api/database/users` - Create user account
- `GET /api/database/users/:id` - Get user profile
- `POST /api/database/resumes` - Save resume to database
- `GET /api/database/users/:userId/resumes` - Get user's resumes
- `POST /api/database/ats-results` - Save ATS analysis results
- `GET /api/database/users/:userId/ats-results/stats` - Get ATS statistics

## Deployment on Vercel

### Prerequisites
- Vercel account
- Vercel CLI installed: `npm i -g vercel`

### Deploy Steps

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy from the backend directory**:
   ```bash
   cd backend
   vercel
   ```

3. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `ai-edu-platform-backend`
   - In which directory is your code located? `./`

4. **Set Environment Variables** (if needed):
   ```bash
   vercel env add NODE_ENV
   # Enter: production
   
   vercel env add ALLOWED_ORIGINS
   # Enter: https://your-frontend-domain.vercel.app
   ```

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

### Production URL
After deployment, you'll get a URL like:
`https://ai-edu-platform-backend.vercel.app`

### Update Frontend
Update your frontend API calls to use the production URL:
```javascript
const API_BASE_URL = 'https://ai-edu-platform-backend.vercel.app';
```

## Environment Variables

- `NODE_ENV`: Set to 'production' for production deployment
- `PORT`: Port number (automatically set by Vercel)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend domains
- `GOOGLE_AI_API_KEY`: Google Gemini AI API key for AI suggestions feature
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for admin operations
- `POSTGRES_URL`: PostgreSQL connection string

## File Structure

```
backend/
├── routes/
│   ├── resumeBuilderRoutes.js
│   ├── atsAnalyzerRoutes.js
│   ├── aiSuggestionsRoutes.js
│   └── databaseRoutes.js
├── services/
│   ├── userService.js
│   ├── resumeService.js
│   └── atsService.js
├── config/
│   └── database.js
├── database/
│   └── schema.sql
├── scripts/
│   └── initDatabase.js
├── server.js
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
├── README.md
└── DATABASE_SETUP.md
```

## Database Setup

The application uses Supabase PostgreSQL for data storage. To set up the database:

1. **Manual Setup (Required)**:
   - Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/hrlncrvcwhvymwsfmyxi/sql)
   - Copy and paste the contents of `backend/database/schema.sql`
   - Execute the SQL script to create all tables and relationships

2. **Test Connection**:
   ```bash
   npm run db:init-manual
   curl http://localhost:5000/api/database/health
   ```

3. **Create Test Data**:
   ```bash
   curl -X POST http://localhost:5000/api/database/test-data
   ```

For detailed setup instructions, see `DATABASE_SETUP.md`.

## Support

For issues or questions, please check the main project documentation or create an issue in the repository.