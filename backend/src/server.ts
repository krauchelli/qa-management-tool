import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testsRoutes from './routes/tests.routes';
import detailsRoutes from './routes/details.routes';
import statsRoutes from './routes/stats.routes';
import tagsRoutes from './routes/tags.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'QA Management Tool API is running' });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'QA Management Tool API v2.0',
    endpoints: {
      tests: '/api/tests',
      details: '/api/details',
      stats: '/api/stats',
      tags: '/api/tags',
    },
  });
});

app.use('/api/tests', testsRoutes);
app.use('/api/details', detailsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/tags', tagsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    path: req.path,
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET    /api/tests`);
  console.log(`   POST   /api/tests`);
  console.log(`   GET    /api/tests/:id`);
  console.log(`   PUT    /api/tests/:id`);
  console.log(`   DELETE /api/tests/:id`);
  console.log(`   GET    /api/details/:testId`);
  console.log(`   POST   /api/details`);
  console.log(`   GET    /api/stats`);
});

export default app;
