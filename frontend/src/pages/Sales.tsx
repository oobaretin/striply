import { useEffect, useState } from 'react';
import { salesApi, buyersApi, productsApi } from '../lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [formData, setFormData] = useState({
    buyerId: '',
    saleDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0 }],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesRes, buyersRes, productsRes] = await Promise.all([
        salesApi.getAll(),
        buyersApi.getAll({ isActive: true }),
        productsApi.getAll({ isActive: true }),
      ]);
      if (salesRes.success) setSales(salesRes.data);
      if (buyersRes.success) setBuyers(buyersRes.data);
      if (productsRes.success) setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saleData = {
        ...formData,
        items: formData.items.filter((item) => item.productId && item.quantity > 0),
      };
      if (editingSale) {
        await salesApi.update(editingSale.id, saleData);
      } else {
        await salesApi.create(saleData);
      }
      setShowModal(false);
      setEditingSale(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to save sale:', error);
    }
  };

  const handleEdit = (sale: any) => {
    setEditingSale(sale);
    setFormData({
      buyerId: sale.buyerId,
      saleDate: sale.saleDate.split('T')[0],
      notes: sale.notes || '',
      items: sale.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      try {
        await salesApi.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete sale:', error);
      }
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const resetForm = () => {
    setFormData({
      buyerId: '',
      saleDate: new Date().toISOString().split('T')[0],
      notes: '',
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
          <p className="mt-2 text-sm text-gray-600">Track sales to buyers</p>
        </div>
        <button
          onClick={() => {
            setEditingSale(null);
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <li key={sale.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {sale.buyer.firstName} {sale.buyer.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(sale.saleDate), 'MMM d, yyyy')} - ${sale.totalAmount.toFixed(2)}
                      </p>
                      {sale.profit !== null && sale.profit !== undefined && (
                        <p className={`text-xs font-medium ${sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Profit: ${sale.profit.toFixed(2)} ({sale.profitMargin?.toFixed(1) || '0'}%)
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEdit(sale)} className="text-primary-600 hover:text-primary-900">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(sale.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingSale ? 'Edit Sale' : 'Add Sale'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Buyer *</label>
                      <select
                        required
                        value={formData.buyerId}
                        onChange={(e) => setFormData({ ...formData, buyerId: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="">Select a buyer</option>
                        {buyers.map((buyer) => (
                          <option key={buyer.id} value={buyer.id}>
                            {buyer.firstName} {buyer.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sale Date</label>
                      <input
                        type="date"
                        value={formData.saleDate}
                        onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                      {formData.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Item {index + 1}</span>
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:text-red-900 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700">Product *</label>
                              <select
                                required
                                value={item.productId}
                                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              >
                                <option value="">Select product</option>
                                {products.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700">Quantity *</label>
                              <input
                                type="number"
                                required
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700">Unit Price *</label>
                              <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addItem}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        + Add Item
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingSale ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSale(null);
                      resetForm();
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

