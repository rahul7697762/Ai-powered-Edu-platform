# AI-Powered Education Platform

A comprehensive platform for resume building, ATS analysis, and career development with AI-powered features and authentication.

## 🚀 Features

### Authentication System
- **JWT-based Authentication** with role-based access control
- **User Roles**: Student, Recruiter, Mentor, Admin
- **Protected Routes** with automatic redirects
- **User Dashboard** with role-specific quick actions

### Resume Builders
- **Basic Resume Builder** with multiple professional templates
- **Professional Resume Builder** with advanced form and structured sections
- **Live Preview** with real-time updates
- **Template Selection** with 10+ professional designs

### Download Options
- **PDF Generation** (both server and client-side)
- **DOC Export** (editable Microsoft Word documents)
- **Print Functionality** with optimized layouts
- **Smart Filenames** based on user data

### AI-Powered Features
- **ATS Analysis** with keyword matching and scoring
- **AI Suggestions** for resume improvement
- **Google AI Integration** for content enhancement
- **Resume Optimization** recommendations

### User Experience
- **Responsive Design** for all devices
- **Dark Mode Support** with theme persistence
- **Dropdown Navigation** for organized access
- **Loading States** and error handling
- **Accessibility** features throughout

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **html2canvas + jsPDF** for PDF generation
- **docx** for Word document generation

### Backend
- **Node.js** with Express
- **JWT** for authentication
- **bcrypt** for password hashing
- **Supabase** for database and real-time features
- **Google AI** for content generation
- **Multer** for file uploads

### Database
- **PostgreSQL** via Supabase
- **Row Level Security** for data protection
- **Structured Schema** with proper relationships
- **Automated Backups** and scaling

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI API key

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

### Environment Variables

#### Backend (.env.local)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

## 🚀 Deployment

### Vercel Deployment
1. **Backend**: Deploy to Vercel with environment variables
2. **Frontend**: Deploy to Vercel with API URL pointing to backend
3. **Database**: Supabase handles hosting and scaling

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📖 Documentation

- [Authentication Setup](AUTHENTICATION_SETUP.md) - Complete authentication system guide
- [Professional Resume Template](PROFESSIONAL_RESUME_TEMPLATE.md) - Advanced template features
- [Download Options](DOWNLOAD_OPTIONS.md) - PDF, DOC, and print functionality
- [Resume Builder Dropdown](RESUME_BUILDER_DROPDOWN.md) - Navigation enhancements
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment steps

## 🎯 Usage

### For Students
1. **Register** with student role
2. **Build Resume** using basic or professional builder
3. **Download** in PDF or DOC format
4. **Analyze** with ATS tools for optimization
5. **Apply** AI suggestions for improvement

### For Recruiters
1. **Register** with recruiter role
2. **Post Jobs** and requirements
3. **Review Applications** from students
4. **Search Talent** with filtering options

### For Mentors
1. **Register** with mentor role
2. **Conduct Mock Interviews** with students
3. **Provide Guidance** and feedback
4. **Review Resumes** and suggest improvements

## 🔧 Development

### Project Structure
```
├── backend/                 # Node.js API server
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   ├── middleware/         # Authentication & validation
│   └── database/           # Schema and migrations
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript definitions
└── docs/                   # Documentation files
```

### Key Components
- **AuthContext**: Global authentication state
- **ResumeBuilder**: Basic resume creation
- **ProfessionalResumeBuilder**: Advanced resume creation
- **DownloadDropdown**: Multi-format export options
- **ProtectedRoute**: Authentication wrapper
- **Dashboard**: Role-based user interface

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get user profile
- `POST /api/resume-builder/generate-pdf` - Generate PDF
- `POST /api/ats-analyzer/analyze` - ATS analysis
- `GET /api/database/health` - Database status

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**: Registration, login, logout
2. **Resume Creation**: Both basic and professional builders
3. **Download Options**: PDF, DOC, and print functionality
4. **ATS Analysis**: Upload resume and get feedback
5. **Role-Based Access**: Test different user roles

### Browser Testing
- Chrome, Firefox, Safari, Edge
- Mobile responsive design
- Dark mode functionality
- Print layouts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for database and authentication infrastructure
- **Google AI** for content generation capabilities
- **Vercel** for hosting and deployment
- **Tailwind CSS** for beautiful, responsive design
- **React Community** for excellent tooling and libraries

## 📞 Support

For support, email support@eduai-platform.com or create an issue in this repository.

---

Built with ❤️ for students, recruiters, and mentors worldwide.