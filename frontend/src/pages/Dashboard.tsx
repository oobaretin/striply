import { useEffect, useState } from 'react';
import { dashboardApi, authApi } from '../lib/api';
import { Users, Package, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<any>(null);

  useEffect(() => {
    loadStats();
    loadOwner();
  }, []);

  const loadOwner = async () => {
    try {
      // First try to get from localStorage (faster)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setOwner(JSON.parse(storedUser));
      }
      
      // Then fetch fresh data from API
      const response = await authApi.getMe();
      if (response.success) {
        setOwner(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to load owner:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await dashboardApi.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load dashboard data</div>;
  }

  const statCards = [
    {
      name: 'Total Customers',
      value: stats.counts.customers.total,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Buyers',
      value: stats.counts.buyers.total,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Active Products',
      value: stats.counts.products.active,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Revenue',
      value: `$${stats.financials.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Purchases',
      value: `$${stats.financials.totalPurchases.toFixed(2)}`,
      icon: TrendingDown,
      color: 'bg-red-500',
    },
    {
      name: 'Profit',
      value: `$${stats.financials.profit.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Profit Margin',
      value: `${stats.financials.profitMargin.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {owner ? `Welcome, ${owner.firstName} ${owner.lastName}` : 'Dashboard'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">Overview of your business</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${card.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                      <dd className="text-lg font-semibold text-gray-900">{card.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Purchases</h3>
            <div className="space-y-4">
              {stats.recentActivity.purchases.length === 0 ? (
                <p className="text-sm text-gray-500">No recent purchases</p>
              ) : (
                stats.recentActivity.purchases.map((purchase: any) => (
                  <div key={purchase.id} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {purchase.customer.firstName} {purchase.customer.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(purchase.purchaseDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">${purchase.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sales</h3>
            <div className="space-y-4">
              {stats.recentActivity.sales.length === 0 ? (
                <p className="text-sm text-gray-500">No recent sales</p>
              ) : (
                stats.recentActivity.sales.map((sale: any) => (
                  <div key={sale.id} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {sale.buyer.firstName} {sale.buyer.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(sale.saleDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">${sale.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

