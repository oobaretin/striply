import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type CleanupEmptyCatalogResult = {
  deactivatedSubCategories: number;
  deactivatedCategories: number;
};

/**
 * Deactivate empty catalog nodes so the UI doesn't show duplicate/empty sections.
 *
 * - Deactivates any active SubCategory with 0 active Products.
 * - Then deactivates any active Category with 0 active Products (across active subcategories).
 */
async function cleanupEmptyCatalog(): Promise<CleanupEmptyCatalogResult> {
  let deactivatedSubCategories = 0;
  let deactivatedCategories = 0;

  const activeSubCategories = await prisma.subCategory.findMany({
    where: { isActive: true },
    select: { id: true, categoryId: true, name: true },
  });

  for (const sc of activeSubCategories) {
    const productCount = await prisma.product.count({
      where: { isActive: true, subCategoryId: sc.id },
    });
    if (productCount === 0) {
      await prisma.subCategory.update({ where: { id: sc.id }, data: { isActive: false } });
      deactivatedSubCategories += 1;
    }
  }

  const activeCategories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
  });

  for (const cat of activeCategories) {
    const activeProductCount = await prisma.product.count({
      where: {
        isActive: true,
        subCategory: { isActive: true, categoryId: cat.id },
      },
    });

    if (activeProductCount === 0) {
      await prisma.category.update({ where: { id: cat.id }, data: { isActive: false } });
      deactivatedCategories += 1;
    }
  }

  return { deactivatedSubCategories, deactivatedCategories };
}

// Export for API usage (CommonJS + ESM)
module.exports = { cleanupEmptyCatalog };
export { cleanupEmptyCatalog };

if (require.main === module) {
  cleanupEmptyCatalog()
    .then((r) => console.log('✅ Cleanup complete:', r))
    .catch((e) => {
      console.error('❌ Cleanup failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}


