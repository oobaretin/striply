import { useEffect, useState } from 'react';
import { categoriesApi, buyersApi } from '../lib/api';
import { ChevronDown, ChevronRight, ExternalLink, Image as ImageIcon, AlertCircle, TrendingUp, DollarSign, Settings } from 'lucide-react';

export default function Products() {
  const [categories, setCategories] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<string>>(new Set());
  const [profitMarginPercent, setProfitMarginPercent] = useState<number>(() => {
    const saved = localStorage.getItem('striply_profit_margin');
    return saved ? parseFloat(saved) : 20; // Default 20% profit margin
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Load categories and buyers in parallel
      const [categoriesResponse, buyersResponse] = await Promise.all([
        categoriesApi.getAll(),
        buyersApi.getAll({ isActive: true }),
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
        // Auto-expand first category
        if (categoriesResponse.data && categoriesResponse.data.length > 0) {
          setExpandedCategories(new Set([categoriesResponse.data[0].id]));
        }
      } else {
        setError('Failed to load categories');
      }

      if (buyersResponse.success) {
        setBuyers(buyersResponse.data || []);
      }
    } catch (error: any) {
      console.error('Failed to load data:', error);
      setError(error.response?.data?.error?.message || 'Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (subCategoryId: string) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategoryId)) {
      newExpanded.delete(subCategoryId);
    } else {
      newExpanded.add(subCategoryId);
    }
    setExpandedSubCategories(newExpanded);
  };

  const getBuyerPrice = (product: any, buyerName: string) => {
    const price = product.buyerPrices?.find(
      (bp: any) => `${bp.buyer.firstName} ${bp.buyer.lastName}` === buyerName
    );
    return price;
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return '-';
    return `$${price.toFixed(2)}`;
  };

  // Profit optimization utilities
  const getBestBuyerPrice = (product: any, expirationRange: 'range1' | 'range2' = 'range1') => {
    if (!product.buyerPrices || product.buyerPrices.length === 0) return null;

    let bestPrice = 0;
    let bestBuyerPriceObj = null;

    product.buyerPrices.forEach((bp: any) => {
      const price = expirationRange === 'range1' 
        ? bp.expirationRange1Price 
        : bp.expirationRange2Price;
      
      if (price && price > bestPrice) {
        bestPrice = price;
        bestBuyerPriceObj = bp;
      }
    });

    return bestPrice > 0 && bestBuyerPriceObj 
      ? { price: bestPrice, buyer: bestBuyerPriceObj.buyer, buyerPriceObj: bestBuyerPriceObj } 
      : null;
  };

  const calculateRecommendedPurchasePrice = (salePrice: number, profitMargin: number) => {
    // Recommended purchase price = Sale price / (1 + profit margin / 100)
    // This ensures you get the desired profit margin when selling
    return salePrice / (1 + profitMargin / 100);
  };

  const calculateProfitMargin = (purchasePrice: number, salePrice: number) => {
    if (!purchasePrice || !salePrice) return null;
    return ((salePrice - purchasePrice) / purchasePrice) * 100;
  };

  const getRecommendedPurchasePrice = (product: any) => {
    const bestPriceRange1 = getBestBuyerPrice(product, 'range1');
    const bestPriceRange2 = getBestBuyerPrice(product, 'range2');

    const recommendations = [];

    if (bestPriceRange1) {
      recommendations.push({
        expirationRange: 'range1',
        label: bestPriceRange1.buyerPriceObj?.expirationRange1Label || 'Range 1',
        buyerPrice: bestPriceRange1.price,
        buyerName: `${bestPriceRange1.buyer?.firstName} ${bestPriceRange1.buyer?.lastName}`,
        recommendedPurchasePrice: calculateRecommendedPurchasePrice(bestPriceRange1.price, profitMarginPercent),
        profitMargin: profitMarginPercent,
        isPreferred: bestPriceRange1.buyer?.isPreferred || false,
      });
    }

    if (bestPriceRange2 && bestPriceRange2.price !== bestPriceRange1?.price) {
      recommendations.push({
        expirationRange: 'range2',
        label: bestPriceRange2.buyerPriceObj?.expirationRange2Label || 'Range 2',
        buyerPrice: bestPriceRange2.price,
        buyerName: `${bestPriceRange2.buyer?.firstName} ${bestPriceRange2.buyer?.lastName}`,
        recommendedPurchasePrice: calculateRecommendedPurchasePrice(bestPriceRange2.price, profitMarginPercent),
        profitMargin: profitMarginPercent,
        isPreferred: bestPriceRange2.buyer?.isPreferred || false,
      });
    }

    return recommendations;
  };

  const handleProfitMarginChange = (value: number) => {
    setProfitMarginPercent(value);
    localStorage.setItem('striply_profit_margin', value.toString());
  };

  // Get all buyers for comparison - show all active buyers, not just those with prices
  const getAllBuyersForComparison = () => {
    // Sort buyers: Preferred first, then Northeast Medical Exchange, then others alphabetically
    return [...buyers].sort((a, b) => {
      const aName = `${a.firstName} ${a.lastName}`;
      const bName = `${b.firstName} ${b.lastName}`;
      
      // Preferred buyers first
      if (a.isPreferred && !b.isPreferred) return -1;
      if (!a.isPreferred && b.isPreferred) return 1;
      
      // Northeast Medical Exchange next
      if (aName === 'Northeast Medical Exchange') return -1;
      if (bName === 'Northeast Medical Exchange') return 1;
      
      // Then alphabetically
      return aName.localeCompare(bName);
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading products</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-600">Browse products by category and sub-category with expiration-based pricing</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Profit Settings</span>
          </button>
        </div>
        
        {/* Profit Margin Settings Panel */}
        {showSettings && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Profit Margin: {profitMarginPercent}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={profitMarginPercent}
                  onChange={(e) => handleProfitMarginChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>50%</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  This determines the recommended purchase price from sellers. Higher margin = lower purchase price recommendations.
                </p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No categories found.</p>
            <p className="text-sm text-gray-400">
              Run the seed script: <code className="bg-gray-100 px-2 py-1 rounded">npm run seed:northeast</code>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => {
              // Get expiration range labels from first product's buyer price (Northeast Medical)
              const firstProduct = category.subCategories?.[0]?.products?.[0];
              const firstPrice = firstProduct?.buyerPrices?.find(
                (bp: any) => `${bp.buyer.firstName} ${bp.buyer.lastName}` === 'Northeast Medical Exchange'
              );
              const range1Label = firstPrice?.expirationRange1Label || category.expirationRange1Label || '';
              const range2Label = firstPrice?.expirationRange2Label || category.expirationRange2Label || '';

              return (
                <div key={category.id} className="border-b border-gray-200">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-400 mr-2" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400 mr-2" />
                      )}
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                        {category.description && (
                          <p className="text-xs text-gray-600 mt-1 max-w-2xl">{category.description}</p>
                        )}
                        {(range1Label || range2Label) && (
                          <div className="flex gap-4 mt-1 text-xs text-gray-600">
                            {range1Label && <span>Range 1: {range1Label}</span>}
                            {range2Label && <span>Range 2: {range2Label}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Sub-Categories */}
                  {expandedCategories.has(category.id) && category.subCategories && (
                    <div className="bg-gray-50">
                      {category.subCategories.map((subCategory: any) => (
                        <div key={subCategory.id} className="border-t border-gray-200">
                          {/* Sub-Category Header */}
                          <button
                            onClick={() => toggleSubCategory(subCategory.id)}
                            className="w-full px-8 py-3 text-left hover:bg-gray-100 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              {expandedSubCategories.has(subCategory.id) ? (
                                <ChevronDown className="h-4 w-4 text-gray-400 mr-2" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                              )}
                              <h3 className="text-md font-medium text-gray-800">{subCategory.name}</h3>
                              {subCategory.description && (
                                <span className="ml-3 text-xs text-gray-500">({subCategory.description})</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {subCategory.products?.length || 0} products
                            </span>
                          </button>

                          {/* Products */}
                          {expandedSubCategories.has(subCategory.id) && subCategory.products && (() => {
                            const allBuyers = getAllBuyersForComparison();
                            
                            return (
                            <div className="bg-white border-t border-gray-200">
                              <div className="px-8 py-4">
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                                          Product Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          NDC Code
                                        </th>
                                        {allBuyers.map((buyer) => (
                                          <th key={buyer.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            <div className="flex flex-col">
                                              <div className="flex items-center gap-1">
                                                <span className="font-semibold">{buyer.firstName} {buyer.lastName}</span>
                                                {buyer.isPreferred && (
                                                  <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded" title="Preferred Buyer">★</span>
                                                )}
                                              </div>
                                              {range1Label && <span className="text-[10px] font-normal text-gray-400 mt-0.5">{range1Label}</span>}
                                              {range2Label && <span className="text-[10px] font-normal text-gray-400">{range2Label}</span>}
                                            </div>
                                          </th>
                                        ))}
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 min-w-[180px]">
                                          <div className="flex flex-col">
                                            <div className="flex items-center gap-1">
                                              <DollarSign className="h-3.5 w-3.5 text-green-600" />
                                              <span className="font-semibold">Recommended Purchase Price</span>
                                            </div>
                                            <span className="text-[10px] font-normal text-gray-400 mt-0.5">
                                              Target: {profitMarginPercent}% profit
                                            </span>
                                          </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Notes
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Image
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {subCategory.products.map((product: any) => {

                                        return (
                                          <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                              {product.imageUrl ? (
                                                <a
                                                  href={product.imageUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="group flex items-center text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors cursor-pointer"
                                                  title="Click to view product image"
                                                >
                                                  <ImageIcon className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                                                  <span>{product.name}</span>
                                                  <ExternalLink className="h-3 w-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary-500" />
                                                </a>
                                              ) : (
                                                <div className="text-sm font-medium text-gray-900">
                                                  {product.name}
                                                </div>
                                              )}
                                              {product.brand && (
                                                <div className="text-xs text-gray-500 mt-0.5">Brand: {product.brand}</div>
                                              )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                              <span className="text-sm text-gray-900 font-mono">
                                                {product.ndcCode || '-'}
                                              </span>
                                            </td>
                                            {allBuyers.map((buyer) => {
                                              const buyerPrice = getBuyerPrice(product, `${buyer.firstName} ${buyer.lastName}`);
                                              return (
                                                <td key={buyer.id} className="px-4 py-3">
                                                  {buyerPrice ? (
                                                    <div className="flex flex-col space-y-1">
                                                      {buyerPrice.expirationRange1Price !== null && buyerPrice.expirationRange1Price !== undefined && (
                                                        <div>
                                                          <span className="text-sm font-semibold text-green-600">
                                                            {formatPrice(buyerPrice.expirationRange1Price)}
                                                          </span>
                                                        </div>
                                                      )}
                                                      {buyerPrice.expirationRange2Price !== null && buyerPrice.expirationRange2Price !== undefined && (
                                                        <div>
                                                          <span className="text-sm font-semibold text-blue-600">
                                                            {formatPrice(buyerPrice.expirationRange2Price)}
                                                          </span>
                                                        </div>
                                                      )}
                                                      {buyerPrice.dingReductionPrice !== null && buyerPrice.dingReductionPrice !== undefined && (
                                                        <div className="relative inline-block group">
                                                          <div className="flex items-center gap-1 cursor-help">
                                                            <span className="text-xs text-gray-500">Ding: </span>
                                                            <span className="text-xs text-gray-700">
                                                              {formatPrice(buyerPrice.dingReductionPrice)}
                                                            </span>
                                                            <span className="text-xs text-gray-400">ℹ️</span>
                                                          </div>
                                                          {/* Tooltip */}
                                                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] pointer-events-none">
                                                            <div className="bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 w-64">
                                                              <div className="font-semibold mb-1">Ding Reduction Price</div>
                                                              <div className="text-gray-300 text-[11px] leading-relaxed">
                                                                This is the discount amount applied when selling products with minor cosmetic damage (scratches, dents, scuffs) instead of perfect "mint" condition.
                                                              </div>
                                                              <div className="mt-2 pt-2 border-t border-gray-700">
                                                                <div className="text-gray-400 text-[10px] leading-relaxed">
                                                                  <strong>Example:</strong> If mint price is $62.00 and ding reduction is $4.00, the dinged price would be $58.00.
                                                                </div>
                                                              </div>
                                                              {/* Tooltip arrow */}
                                                              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )}
                                                      {/* Fallback to single price if no expiration ranges */}
                                                      {!buyerPrice.expirationRange1Price && !buyerPrice.expirationRange2Price && buyerPrice.price && (
                                                        <span className="text-sm font-semibold text-gray-900">
                                                          {formatPrice(buyerPrice.price)}
                                                        </span>
                                                      )}
                                                      {!buyerPrice.expirationRange1Price && !buyerPrice.expirationRange2Price && !buyerPrice.price && (
                                                        <span className="text-xs text-gray-400">-</span>
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                  )}
                                                </td>
                                              );
                                            })}
                                            <td className="px-4 py-3 bg-green-50">
                                              {(() => {
                                                const recommendations = getRecommendedPurchasePrice(product);
                                                if (recommendations.length === 0) {
                                                  return <span className="text-xs text-gray-400">No buyer prices</span>;
                                                }
                                                
                                                return (
                                                  <div className="flex flex-col space-y-2">
                                                    {recommendations.map((rec, idx) => {
                                                      const bestPrice = getBestBuyerPrice(product, rec.expirationRange as 'range1' | 'range2');
                                                      const isBest = idx === 0; // First recommendation is usually the best
                                                      
                                                      return (
                                                        <div
                                                          key={idx}
                                                          className={`relative p-2 rounded border ${
                                                            isBest
                                                              ? 'bg-green-100 border-green-300'
                                                              : 'bg-white border-gray-200'
                                                          }`}
                                                        >
                                                          <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-semibold text-gray-700">
                                                              {rec.label}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                              {isBest && (
                                                                <TrendingUp className="h-3 w-3 text-green-600" />
                                                              )}
                                                              <div className="relative inline-block group">
                                                                <span className="text-xs text-gray-400 cursor-help hover:text-gray-600 transition-colors">ℹ️</span>
                                                                {/* Tooltip - positioned to the right to avoid overlap */}
                                                                <div className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] pointer-events-none">
                                                                  <div className="bg-gray-900 text-white text-xs rounded-lg shadow-xl p-3 w-72">
                                                                    <div className="font-semibold mb-1">Recommended Purchase Price</div>
                                                                    <div className="text-gray-300 text-[11px] leading-relaxed mb-2">
                                                                      This is the maximum price you should pay sellers to achieve your target profit margin ({rec.profitMargin}%) when selling to buyers.
                                                                    </div>
                                                                    <div className="mt-2 pt-2 border-t border-gray-700">
                                                                      <div className="text-gray-400 text-[10px] leading-relaxed mb-1">
                                                                        <strong>Calculation:</strong>
                                                                      </div>
                                                                      <div className="text-gray-400 text-[10px] leading-relaxed">
                                                                        Recommended = {formatPrice(rec.buyerPrice)} ÷ (1 + {rec.profitMargin}% / 100) = {formatPrice(rec.recommendedPurchasePrice)}
                                                                      </div>
                                                                    </div>
                                                                    <div className="mt-2 pt-2 border-t border-gray-700">
                                                                      <div className="text-gray-400 text-[10px] leading-relaxed">
                                                                        <strong>Result:</strong> Buy at {formatPrice(rec.recommendedPurchasePrice)}, sell at {formatPrice(rec.buyerPrice)} to {rec.buyerName} for {rec.profitMargin}% profit ({formatPrice(rec.buyerPrice - rec.recommendedPurchasePrice)} per unit).
                                                                      </div>
                                                                    </div>
                                                                    {/* Tooltip arrow pointing left */}
                                                                    <div className="absolute right-full top-3 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-gray-900"></div>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                          <div className="text-sm font-bold text-green-700 mb-0.5">
                                                            {formatPrice(rec.recommendedPurchasePrice)}
                                                          </div>
                                                          <div className="text-xs text-gray-600">
                                                            Best buyer: {rec.buyerName}
                                                            {rec.isPreferred && (
                                                              <span className="ml-1 text-yellow-600">★</span>
                                                            )}
                                                          </div>
                                                          <div className="text-xs text-gray-500 mt-0.5">
                                                            Sell at: {formatPrice(rec.buyerPrice)} → Profit: {rec.profitMargin}% ({formatPrice(rec.buyerPrice - rec.recommendedPurchasePrice)})
                                                          </div>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                );
                                              })()}
                                            </td>
                                            <td className="px-4 py-3">
                                              {product.specialNotes ? (
                                                <div className="flex items-center">
                                                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                                                  <span className="text-xs font-medium text-amber-700">
                                                    {product.specialNotes}
                                                  </span>
                                                </div>
                                              ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                              )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                              {product.imageUrl ? (
                                                <a
                                                  href={product.imageUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 hover:border-primary-400 transition-colors"
                                                  title="Click to view product image"
                                                >
                                                  <ImageIcon className="h-4 w-4 mr-1.5" />
                                                  View Image
                                                </a>
                                              ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
