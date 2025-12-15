import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

export const adminRoutes = Router();

// All routes require authentication
adminRoutes.use(authenticate);

/**
 * Admin endpoint to seed the database
 * WARNING: This should be protected in production!
 * For now, any authenticated user can trigger seeding
 */
adminRoutes.post('/seed', async (req: AuthRequest, res, next) => {
  try {
    // In production, you might want to add additional checks here
    // For example, check if user is admin, or add a secret token
    
    console.log('🌱 Starting database seeding via API...');
    
    // Import seed functions
    const { seedBuyers } = await import('../scripts/seedBuyers');
    const seedNortheastMedicalProducts = (await import('../scripts/seedNortheastMedicalProducts')).default;
    
    const results: any = {
      buyers: { success: false, message: '' },
      products: { success: false, message: '' },
    };
    
    try {
      // Step 1: Seed buyers
      console.log('📋 Seeding buyers...');
      await seedBuyers();
      results.buyers = { success: true, message: 'Buyers seeded successfully' };
      console.log('✅ Buyers seeded');
    } catch (error: any) {
      console.error('❌ Error seeding buyers:', error);
      results.buyers = { success: false, message: error.message || 'Failed to seed buyers' };
    }
    
    try {
      // Step 2: Seed product catalog + Northeast pricing (idempotent)
      console.log('📦 Seeding products and Northeast Medical Exchange pricing...');
      await seedNortheastMedicalProducts();
      results.products = { success: true, message: 'Products seeded successfully' };
      console.log('✅ Products seeded');
    } catch (error: any) {
      console.error('❌ Error seeding products:', error);
      results.products = { success: false, message: error.message || 'Failed to seed products' };
    }
    
    const [buyerCount, categoryCount, productCount] = await Promise.all([
      prisma.buyer.count(),
      prisma.category.count(),
      prisma.product.count(),
    ]);

    const allSuccess =
      results.buyers.success &&
      results.products.success &&
      categoryCount > 0 &&
      productCount > 0;
    
    res.json({
      success: allSuccess,
      message: allSuccess 
        ? 'Database seeded successfully!' 
        : 'Seeding completed with some errors. Check results for details.',
      results,
      counts: {
        buyers: buyerCount,
        categories: categoryCount,
        products: productCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Check seeding status
 */
adminRoutes.get('/seed/status', async (req: AuthRequest, res, next) => {
  try {
    const [buyerCount, categoryCount, productCount] = await Promise.all([
      prisma.buyer.count(),
      prisma.category.count(),
      prisma.product.count(),
    ]);
    
    res.json({
      success: true,
      data: {
        buyers: buyerCount,
        categories: categoryCount,
        products: productCount,
        isSeeded: buyerCount > 0 && categoryCount > 0 && productCount > 0,
      },
    });
  } catch (error) {
    next(error);
  }
});


