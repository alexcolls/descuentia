import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Descuentia API is running',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Import middleware
import { authenticateUser, requireMerchant } from './middleware/auth.middleware';

// API routes
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Descuentia API',
    version: '0.2.0',
    endpoints: {
      health: '/health',
      api: '/api',
      profile: '/api/profile (protected)',
      merchantDashboard: '/api/merchant/dashboard (merchant only)',
    },
  });
});

// Protected route example - requires authentication
app.get('/api/profile', authenticateUser, (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Profile data',
    user: req.user,
  });
});

// Merchant-only route example
app.get('/api/merchant/dashboard', authenticateUser, requireMerchant, (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Merchant dashboard data',
    merchantId: req.user?.id,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Descuentia API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
