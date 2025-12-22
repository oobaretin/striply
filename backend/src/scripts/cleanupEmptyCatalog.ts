import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type CleanupEmptyCatalogResult = {
  deactivatedSubCategories: number;
  deactivatedCategories: number;
  mergedDuplicateSubCategories: number;
  movedProducts: number;
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
  let mergedDuplicateSubCategories = 0;
  let movedProducts = 0;

  const activeSubCategories = await prisma.subCategory.findMany({
    where: { isActive: true },
    select: { id: true, categoryId: true, name: true },
  });

  // 1) Merge duplicate subcategories by name within the same category.
  // Keep the one with the most ACTIVE products; move products from duplicates; deactivate duplicates.
  const groups = new Map<string, Array<{ id: string; categoryId: string; name: string }>>();
  for (const sc of activeSubCategories) {
    const key = `${sc.categoryId}::${sc.name.trim().toLowerCase()}`;
    const list = groups.get(key) || [];
    list.push(sc);
    groups.set(key, list);
  }

  for (const [, list] of groups) {
    if (list.length <= 1) continue;

    const counts = await Promise.all(
      list.map(async (sc) => {
        const activeCount = await prisma.product.count({
          where: { isActive: true, subCategoryId: sc.id },
        });
        return { sc, activeCount };
      })
    );

    counts.sort((a, b) => b.activeCount - a.activeCount);
    const keep = counts[0].sc;
    const toDeactivate = counts.slice(1).map((c) => c.sc);

    for (const dup of toDeactivate) {
      const moved = await prisma.product.updateMany({
        where: { subCategoryId: dup.id },
        data: { subCategoryId: keep.id },
      });
      movedProducts += moved.count;

      await prisma.subCategory.update({
        where: { id: dup.id },
        data: { isActive: false },
      });
      mergedDuplicateSubCategories += 1;
    }
  }

  // 2) Deactivate any active subcategory that still has 0 active products (post-merge).
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

  return { deactivatedSubCategories, deactivatedCategories, mergedDuplicateSubCategories, movedProducts };
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


