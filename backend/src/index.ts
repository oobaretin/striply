import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { customerRoutes } from './routes/customers';
import { buyerRoutes } from './routes/buyers';
import { productRoutes } from './routes/products';
import { purchaseRoutes } from './routes/purchases';
import { saleRoutes } from './routes/sales';
import { dashboardRoutes } from './routes/dashboard';
import { categoryRoutes } from './routes/categories';
import { adminRoutes } from './routes/admin';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// CORS configuration - allow Railway domains and localhost for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
  process.env.FRONTEND_URL, // Railway frontend URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? allowedOrigins.length > 0 ? allowedOrigins : true // Allow Railway domains or all in production
    : true, // Allow all in development
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'TestStrip API Server',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      customers: '/api/customers',
      buyers: '/api/buyers',
      products: '/api/products',
      purchases: '/api/purchases',
      sales: '/api/sales',
      dashboard: '/api/dashboard',
      categories: '/api/categories',
      admin: '/api/admin',
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Test database connection on startup (non-blocking for Railway)
async function testDatabaseConnection() {
  try {
    const { prisma } = await import('./lib/prisma');
    await prisma.$connect();
    console.log('✅ Database connection successful');
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('💡 Make sure your DATABASE_URL is correct in .env file');
      console.error('💡 Run "npm run db:push" to initialize the database');
      process.exit(1);
    } else {
      // In production (Railway), log but don't exit - Railway will handle health checks
      console.error('⚠️  Database connection failed, but continuing startup (Railway will handle health checks)');
      return false;
    }
  }
}

// Start server
async function startServer() {
  // Test DB connection but don't block startup in production
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected && process.env.NODE_ENV === 'development') {
    return; // Already exited in testDatabaseConnection
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
      console.log(`🌐 Public URL: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
    }
    console.log(`🔗 Health check: /health`);
  });
}

startServer();

