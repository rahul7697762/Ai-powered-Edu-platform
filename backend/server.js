import express from "express";
import cors from "cors";
import resumeBuilderRoutes from "./routes/resumeBuilderRoutes.js";
import atsAnalyzerRoutes from "./routes/atsAnalyzerRoutes.js";

const app = express();

// Configure CORS for production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000',
      'https://eduai-22rglg1cd-bitlanceais-projects.vercel.app',
      'https://eduai-n99spvjtv-bitlanceais-projects.vercel.app',
      'https://eduai-blond.vercel.app/',
      // Allow any Vercel deployment URL pattern
    ];
    
    // Check if origin is allowed or if it's a Vercel deployment
    if (allowedOrigins.includes(origin) || 
        origin.includes('vercel.app') || 
        origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // If not allowed, return error
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI-Powered Education Platform API', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/resume-builder", resumeBuilderRoutes);
app.use("/api/ats-analyzer", atsAnalyzerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`✅ Backend running on port ${port}`));
}

// Export for Vercel
export default app;
