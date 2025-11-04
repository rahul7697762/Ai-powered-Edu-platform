# AI-Powered Education Platform - Backend API

This is the backend API for the AI-Powered Education Platform, providing resume building and ATS analysis functionality.

## Features

- **Resume Builder API**: Generate professional PDF resumes with multiple templates
- **ATS Analyzer API**: Analyze resumes against job descriptions using AI
- **Multiple Templates**: Support for 10+ professional resume templates
- **PDF Generation**: High-quality PDF output with proper formatting
- **Bullet Point Support**: Automatic formatting of bullet points in resumes

## Tech Stack

- **Node.js** with Express.js
- **PDFKit** for PDF generation
- **Multer** for file uploads
- **@gradio/client** for AI integration
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

## File Structure

```
backend/
├── routes/
│   ├── resumeBuilderRoutes.js
│   └── atsAnalyzerRoutes.js
├── server.js
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

## Support

For issues or questions, please check the main project documentation or create an issue in the repository.