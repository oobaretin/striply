import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type MaxMedPriceRow = {
  categoryName: string;
  subCategoryName: string;
  productName: string;
  brand?: string;
  model?: string;
  ndcCode?: string;
  expirationRange1Label?: string;
  expirationRange1Price?: number | null;
  expirationRange2Label?: string;
  expirationRange2Price?: number | null;
  expirationRange3Label?: string;
  expirationRange3Price?: number | null;
  expirationRange4Label?: string;
  expirationRange4Price?: number | null;
  dingReductionPrice?: number | null;
  damagedPrice?: number | null;
  specialNotes?: string;
};

function extractBracketCode(name: string): { cleanName: string; ndcCode?: string } {
  const match = name.match(/\[([^\]]+)\]/);
  if (!match) return { cleanName: name.trim() };
  const ndcCode = match[1].trim();
  const cleanName = name.replace(match[0], '').replace(/\s{2,}/g, ' ').trim();
  return { cleanName, ndcCode };
}

async function upsertCategory(name: string) {
  const existing = await prisma.category.findFirst({ where: { name } });
  if (existing) {
    return prisma.category.update({ where: { id: existing.id }, data: { isActive: true } });
  }
  return prisma.category.create({ data: { name, isActive: true } });
}

async function upsertSubCategory(categoryId: string, name: string) {
  const existing = await prisma.subCategory.findFirst({ where: { categoryId, name } });
  if (existing) {
    return prisma.subCategory.update({ where: { id: existing.id }, data: { isActive: true } });
  }
  return prisma.subCategory.create({ data: { categoryId, name, isActive: true } });
}

async function upsertProduct(subCategoryId: string, row: MaxMedPriceRow) {
  // Try to find an existing product anywhere first (so we can avoid duplicates and/or move it).
  // Priority:
  // 1) ndcCode match (exact/contains because some stored values include extra text)
  // 2) exact name match (case-insensitive)
  const existing =
    (row.ndcCode
      ? await prisma.product.findFirst({
          where: {
            ndcCode: { contains: row.ndcCode },
          },
        })
      : null) ||
    (await prisma.product.findFirst({
      where: { name: { equals: row.productName, mode: 'insensitive' } },
    }));

  const data = {
    name: row.productName,
    subCategoryId,
    brand: row.brand,
    model: row.model,
    ndcCode: row.ndcCode,
    specialNotes: row.specialNotes,
    isActive: true,
  };

  if (existing) {
    return prisma.product.update({ where: { id: existing.id }, data });
  }
  return prisma.product.create({ data });
}

async function getMaxMedBuyer() {
  // Seeded as: firstName="Max", lastName="Med Distributors"
  const buyer = await prisma.buyer.findFirst({
    where: {
      firstName: { contains: 'Max' },
      lastName: { contains: 'Med Distributors' },
    },
  });
  if (!buyer) {
    throw new Error('Max Med Distributors buyer not found. Run /api/admin/seed first.');
  }
  return buyer;
}

/**
 * Add Max Med prices + ensure the required products exist.
 *
 * This is based on the pasted Max Med sheet sections (Dexcom G6/G7, Omnipod, Libre, Lancets, BD Needles, Vials).
 * As you paste more sections, we can extend the `rows` list.
 */
async function addMaxMedPrices() {
  console.log('💰 Adding Max Med Distributors prices...\n');
  const buyer = await getMaxMedBuyer();

  // Use the existing Northeast catalog category names so Max Med pricing appears
  // inside the same category tree on the Products page.
  const CATS = {
    DEXCOM: 'MEDICAL DEVICES (CGM) Dexcoms',
    LIBRE: 'MEDICAL DEVICES (CGM) Freestyle Libres',
    OMNIPOD: 'MEDICAL DEVICES (CGM) Insulet',
    LANCETS: 'LANCETS',
    INSULIN: 'INSULIN',
  } as const;

  const rows: MaxMedPriceRow[] = [
    // Dexcom G6
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM SENSOR 3 PACK',
      brand: 'Dexcom',
      model: 'G6 (OE)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 250,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 240,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 200,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 150,
      dingReductionPrice: 10,
      damagedPrice: 150,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM SENSOR 3 PACK',
      brand: 'Dexcom',
      model: 'G6 (OR)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 240,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 220,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 200,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 150,
      damagedPrice: 150,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM SENSOR 3 PACK',
      brand: 'Dexcom',
      model: 'G6 (OM)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 190,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 150,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 120,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 100,
      damagedPrice: 150,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM SENSOR 3 PACK',
      brand: 'Dexcom',
      model: 'G6 (GS)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 150,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 120,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 100,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 100,
      damagedPrice: 150,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM SENSOR 1 PACK (BOX)',
      brand: 'Dexcom',
      model: 'G6 (OR & OM)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 50,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 30,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 25,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 25,
      damagedPrice: 25,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM SENSOR 1 PACK (NO BOX) (LOOSE)',
      brand: 'Dexcom',
      model: 'G6 (OR & OM)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 40,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM RECEIVER 1 PACK',
      brand: 'Dexcom',
      model: 'G6 (OE)',
      expirationRange1Label: 'No expiry (manufacture date only)',
      expirationRange1Price: 140,
      dingReductionPrice: 10,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM RECEIVER 1 PACK',
      brand: 'Dexcom',
      model: 'G6 (FR)',
      expirationRange1Label: 'No expiry (manufacture date only)',
      expirationRange1Price: 120,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM RECEIVER 1 PACK',
      brand: 'Dexcom',
      model: 'G6 (FK)',
      expirationRange1Label: 'No expiry (manufacture date only)',
      expirationRange1Price: 100,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM RECEIVER 1 PACK',
      brand: 'Dexcom',
      model: 'G6 (OM)',
      expirationRange1Label: 'No expiry (manufacture date only)',
      expirationRange1Price: 100,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM TRANSMITTER KIT',
      brand: 'Dexcom',
      model: 'G6 (OE)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 150,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 150,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 130,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 75,
      dingReductionPrice: 10,
      damagedPrice: 85,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM TRANSMITTER SMALL BOX',
      brand: 'Dexcom',
      model: 'G6 (OR)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 100,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 50,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 40,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 30,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G6',
      productName: 'DEXCOM TRANSMITTER SMALL BOX',
      brand: 'Dexcom',
      model: 'G6 (OM)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 100,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 50,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 40,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 30,
    },

    // Dexcom G7
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G7',
      productName: 'DEXCOM SENSOR 1 PACK',
      brand: 'Dexcom',
      model: 'G7 (O12)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 90,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 70,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 50,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 50,
      dingReductionPrice: 5,
      damagedPrice: 50,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G7',
      productName: 'DEXCOM SENSOR 1 PACK',
      brand: 'Dexcom',
      model: 'G7 (O11)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 80,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 70,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 50,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 50,
      damagedPrice: 50,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G7',
      productName: 'DEXCOM SENSOR 1 PACK',
      brand: 'Dexcom',
      model: 'G7 (O13)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 75,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 50,
      expirationRange3Label: '4/2026',
      expirationRange3Price: 50,
      expirationRange4Label: '3/2026',
      expirationRange4Price: 50,
      damagedPrice: 50,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G7',
      productName: 'DEXCOM SENSOR 1 PACK',
      brand: 'Dexcom',
      model: 'G7 (O30)',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 40,
      damagedPrice: 20,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G7',
      productName: 'DEXCOM RECEIVER 1 PACK',
      brand: 'Dexcom',
      model: 'G7 (O12)',
      expirationRange1Label: 'No expiry (manufacture date only)',
      expirationRange1Price: 150,
      dingReductionPrice: 10,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G7',
      productName: 'DEXCOM RECEIVER 1 PACK',
      brand: 'Dexcom',
      model: 'G7 (O11)',
      expirationRange1Label: 'No expiry (manufacture date only)',
      expirationRange1Price: 140,
    },
    {
      categoryName: CATS.DEXCOM,
      subCategoryName: 'Dexcom G7',
      productName: 'DEXCOM RECEIVER 1 PACK',
      brand: 'Dexcom',
      model: 'G7 (O13)',
      expirationRange1Label: 'No expiry (manufacture date only)',
      expirationRange1Price: 130,
    },

    // Libre
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'FREESTYLE LIBRE 3',
      brand: 'Abbott',
      model: 'Libre 3',
      expirationRange1Label: '3/2026+',
      expirationRange1Price: 55,
      expirationRange2Label: '2/2026',
      expirationRange2Price: 30,
      expirationRange3Label: '1/2026',
      expirationRange3Price: 30,
      expirationRange4Label: '12/2025',
      expirationRange4Price: 5,
      dingReductionPrice: 3,
      damagedPrice: 30,
    },
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'FREESTYLE LIBRE 3 PLUS',
      brand: 'Abbott',
      model: 'Libre 3 Plus',
      expirationRange1Label: '3/2026+',
      expirationRange1Price: 65,
      expirationRange2Label: '2/2026',
      expirationRange2Price: 35,
      expirationRange3Label: '1/2026',
      expirationRange3Price: 35,
      expirationRange4Label: '12/2025',
      expirationRange4Price: 10,
      damagedPrice: 35,
    },
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'FREESTYLE LIBRE 2 & LIBRE 2 PLUS',
      brand: 'Abbott',
      model: 'Libre 2 / Libre 2 Plus',
      expirationRange1Label: '3/2026+',
      expirationRange1Price: 50,
      expirationRange2Label: '2/2026',
      expirationRange2Price: 35,
      expirationRange3Label: '1/2026',
      expirationRange3Price: 35,
      expirationRange4Label: '12/2025',
      expirationRange4Price: 10,
      damagedPrice: 25,
    },
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'LIBRE 2 PLUS (NFR)',
      brand: 'Abbott',
      model: 'Libre 2 Plus',
      expirationRange1Label: '3/2026+',
      expirationRange1Price: 45,
      specialNotes: 'NFR',
    },
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'FREESTYLE LIBRE 14 DAY',
      brand: 'Abbott',
      model: 'Libre 14 Day',
      expirationRange1Label: '3/2026+',
      expirationRange1Price: 50,
      expirationRange2Label: '2/2026',
      expirationRange2Price: 35,
      expirationRange3Label: '1/2026',
      expirationRange3Price: 35,
      expirationRange4Label: '12/2025',
      expirationRange4Price: 10,
      damagedPrice: 25,
    },
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'FREESTYLE LIBRE 3 READER',
      brand: 'Abbott',
      model: 'Libre 3 Reader',
      expirationRange1Label: "No expiry (reader's don't expire)",
      expirationRange1Price: 50,
      damagedPrice: 25,
    },
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'FREESTYLE LIBRE 2 READER',
      brand: 'Abbott',
      model: 'Libre 2 Reader',
      expirationRange1Label: "No expiry (reader's don't expire)",
      expirationRange1Price: 50,
      damagedPrice: 25,
    },
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'FREESTYLE LIBRE 14 DAY READER',
      brand: 'Abbott',
      model: 'Libre 14 Day Reader',
      expirationRange1Label: "No expiry (reader's don't expire)",
      expirationRange1Price: 50,
      damagedPrice: 25,
    },
    // (No dedicated "Meters" category in the Northeast seed tree; keep this within Libres)
    {
      categoryName: CATS.LIBRE,
      subCategoryName: 'Freestyle Libre',
      productName: 'FREESTYLE METER',
      brand: 'Abbott',
      model: 'FreeStyle Meter',
      expirationRange1Label: 'N/A',
      expirationRange1Price: 10,
    },

    // Lancets
    {
      categoryName: CATS.LANCETS,
      subCategoryName: 'Lancets',
      productName: 'FreeStyle Lancet',
      brand: 'Abbott',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 4,
      dingReductionPrice: 1,
      damagedPrice: 1,
    },
    {
      categoryName: CATS.LANCETS,
      subCategoryName: 'Lancets',
      productName: 'One Touch Delica Lancet 30g',
      brand: 'OneTouch',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 5,
      damagedPrice: 1,
    },
    {
      categoryName: CATS.LANCETS,
      subCategoryName: 'Lancets',
      productName: 'One Touch Delica Lancet 33g',
      brand: 'OneTouch',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 5,
      damagedPrice: 1,
    },
    {
      categoryName: CATS.LANCETS,
      subCategoryName: 'Lancets',
      productName: 'Accu-chek FastClix',
      brand: 'Accu-Chek',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 5,
      damagedPrice: 1,
    },
    {
      categoryName: CATS.LANCETS,
      subCategoryName: 'Lancets',
      productName: 'Accu-chek SoftClix',
      brand: 'Accu-Chek',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 3,
      damagedPrice: 1,
    },
    {
      categoryName: CATS.LANCETS,
      subCategoryName: 'Lancets',
      productName: 'Microlets',
      brand: 'Microlet',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 3,
      damagedPrice: 1,
    },

    // BD Needles
    {
      // Northeast seed doesn't have a dedicated "Needles" category;
      // keep these under the existing LANCETS category tree.
      categoryName: CATS.LANCETS,
      subCategoryName: 'Needles',
      productName: 'BD Needles (Retail)',
      brand: 'BD',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 18,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 10,
      expirationRange3Label: '4/2026',
      expirationRange3Price: null,
      expirationRange4Label: '3/2026',
      expirationRange4Price: null,
      dingReductionPrice: 3,
      damagedPrice: 9,
    },
    {
      categoryName: CATS.LANCETS,
      subCategoryName: 'Needles',
      productName: 'BD Needles (DME/MO)',
      brand: 'BD',
      expirationRange1Label: '6/2026+',
      expirationRange1Price: 15,
      expirationRange2Label: '5/2026',
      expirationRange2Price: 8,
      dingReductionPrice: null,
      damagedPrice: 7.5,
    },

    // Vials
    {
      categoryName: CATS.INSULIN,
      subCategoryName: 'Humulin',
      productName: 'Humulin vials N',
      brand: 'Humulin',
      expirationRange1Label: '7/2026+',
      expirationRange1Price: 25,
      dingReductionPrice: 5,
      damagedPrice: 5,
    },
    {
      categoryName: CATS.INSULIN,
      subCategoryName: 'Humulin',
      productName: 'Humulin vials R',
      brand: 'Humulin',
      expirationRange1Label: '7/2026+',
      expirationRange1Price: 25,
      dingReductionPrice: 5,
      damagedPrice: 5,
    },
    {
      categoryName: CATS.INSULIN,
      subCategoryName: 'Humulin',
      productName: 'Humulin vials 70/30',
      brand: 'Humulin',
      expirationRange1Label: '7/2026+',
      expirationRange1Price: 25,
      dingReductionPrice: 5,
      damagedPrice: 5,
    },
    {
      categoryName: CATS.INSULIN,
      subCategoryName: 'Novolin',
      productName: 'Novolins (All Kinds)',
      brand: 'NovoLin',
      expirationRange1Label: '7/2026+',
      expirationRange1Price: 20,
      dingReductionPrice: 5,
      damagedPrice: 5,
    },
  ];

  let createdProducts = 0;
  let upsertedPrices = 0;

  // Group by category/subcategory for fewer queries
  const categoryCache = new Map<string, { id: string }>();
  const subCategoryCache = new Map<string, { id: string }>();

  for (const row of rows) {
    const { cleanName, ndcCode } = extractBracketCode(row.productName);
    const rowNormalized: MaxMedPriceRow = {
      ...row,
      productName: cleanName,
      ndcCode: row.ndcCode || ndcCode,
    };

    const catKey = rowNormalized.categoryName;
    const subKey = `${rowNormalized.categoryName}::${rowNormalized.subCategoryName}`;

    const category = categoryCache.get(catKey) || (await upsertCategory(rowNormalized.categoryName));
    categoryCache.set(catKey, category);

    const subCategory =
      subCategoryCache.get(subKey) || (await upsertSubCategory(category.id, rowNormalized.subCategoryName));
    subCategoryCache.set(subKey, subCategory);

    const product = await upsertProduct(subCategory.id, rowNormalized);
    if (product.createdAt.getTime() === product.updatedAt.getTime()) {
      createdProducts += 1;
    }

    await prisma.buyerProductPrice.upsert({
      where: {
        buyerId_productId: {
          buyerId: buyer.id,
          productId: product.id,
        },
      },
      update: {
        expirationRange1Label: rowNormalized.expirationRange1Label,
        expirationRange1Price: rowNormalized.expirationRange1Price ?? undefined,
        expirationRange2Label: rowNormalized.expirationRange2Label,
        expirationRange2Price: rowNormalized.expirationRange2Price ?? undefined,
        expirationRange3Label: rowNormalized.expirationRange3Label,
        expirationRange3Price: rowNormalized.expirationRange3Price ?? undefined,
        expirationRange4Label: rowNormalized.expirationRange4Label,
        expirationRange4Price: rowNormalized.expirationRange4Price ?? undefined,
        dingReductionPrice: rowNormalized.dingReductionPrice ?? undefined,
        damagedPrice: rowNormalized.damagedPrice ?? undefined,
      },
      create: {
        buyerId: buyer.id,
        productId: product.id,
        expirationRange1Label: rowNormalized.expirationRange1Label,
        expirationRange1Price: rowNormalized.expirationRange1Price ?? undefined,
        expirationRange2Label: rowNormalized.expirationRange2Label,
        expirationRange2Price: rowNormalized.expirationRange2Price ?? undefined,
        expirationRange3Label: rowNormalized.expirationRange3Label,
        expirationRange3Price: rowNormalized.expirationRange3Price ?? undefined,
        expirationRange4Label: rowNormalized.expirationRange4Label,
        expirationRange4Price: rowNormalized.expirationRange4Price ?? undefined,
        dingReductionPrice: rowNormalized.dingReductionPrice ?? undefined,
        damagedPrice: rowNormalized.damagedPrice ?? undefined,
      },
    });

    upsertedPrices += 1;
  }

  console.log(`✅ Max Med import complete: ${upsertedPrices} prices upserted, ${createdProducts} products created.`);
}

// Export for API usage (CommonJS + ESM)
module.exports = { addMaxMedPrices };
export { addMaxMedPrices };

// Run if called directly
if (require.main === module) {
  addMaxMedPrices()
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}


