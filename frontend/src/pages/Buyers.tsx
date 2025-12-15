import { useEffect, useState } from 'react';
import { buyersApi } from '../lib/api';
import { Plus, Search, Edit, Trash2, Star, ExternalLink } from 'lucide-react';

export default function Buyers() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    paymentEmail: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    priceSheetUrl: '',
    bestFormOfContact: '',
    facebookLink: '',
    removeLabels: false,
    reachOutPriorToInvoicing: false,
    paymentMethods: '',
    isPreferred: false,
    notes: '',
  });

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    try {
      const response = await buyersApi.getAll({ search: searchTerm || undefined });
      if (response.success) {
        setBuyers(response.data);
      }
    } catch (error) {
      console.error('Failed to load buyers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadBuyers();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBuyer) {
        await buyersApi.update(editingBuyer.id, formData);
      } else {
        await buyersApi.create(formData);
      }
      setShowModal(false);
      setEditingBuyer(null);
      resetForm();
      loadBuyers();
    } catch (error) {
      console.error('Failed to save buyer:', error);
    }
  };

  const handleEdit = (buyer: any) => {
    setEditingBuyer(buyer);
    setFormData({
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      email: buyer.email || '',
      paymentEmail: buyer.paymentEmail || '',
      phone: buyer.phone,
      address: buyer.address || '',
      city: buyer.city || '',
      state: buyer.state || '',
      zipCode: buyer.zipCode || '',
      country: buyer.country || 'USA',
      priceSheetUrl: buyer.priceSheetUrl || '',
      bestFormOfContact: buyer.bestFormOfContact || '',
      facebookLink: buyer.facebookLink || '',
      removeLabels: buyer.removeLabels || false,
      reachOutPriorToInvoicing: buyer.reachOutPriorToInvoicing || false,
      paymentMethods: buyer.paymentMethods || '',
      isPreferred: buyer.isPreferred || false,
      notes: buyer.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this buyer?')) {
      try {
        await buyersApi.delete(id);
        loadBuyers();
      } catch (error) {
        console.error('Failed to delete buyer:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      paymentEmail: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      priceSheetUrl: '',
      bestFormOfContact: '',
      facebookLink: '',
      removeLabels: false,
      reachOutPriorToInvoicing: false,
      paymentMethods: '',
      isPreferred: false,
      notes: '',
    });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyers</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your resale customers</p>
        </div>
        <button
          onClick={() => {
            setEditingBuyer(null);
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Buyer
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search buyers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {buyers.map((buyer) => (
              <li key={buyer.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {buyer.firstName} {buyer.lastName}
                        </p>
                        {buyer.isPreferred && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{buyer.phone}</p>
                      {buyer.paymentEmail && (
                        <p className="text-sm text-gray-500">Payment: {buyer.paymentEmail}</p>
                      )}
                      {buyer.bestFormOfContact && (
                        <p className="text-xs text-gray-400">Contact: {buyer.bestFormOfContact}</p>
                      )}
                      {buyer.paymentMethods && (
                        <p className="text-xs text-gray-400">Payments: {buyer.paymentMethods}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {buyer.priceSheetUrl && buyer.priceSheetUrl.startsWith('http') && (
                        <a
                          href={buyer.priceSheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900"
                          title="Price Sheet"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                      <button onClick={() => handleEdit(buyer)} className="text-primary-600 hover:text-primary-900">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(buyer.id)} className="text-red-600 hover:text-red-900">
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingBuyer ? 'Edit Buyer' : 'Add Buyer'}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Email</label>
                      <input
                        type="email"
                        value={formData.paymentEmail}
                        onChange={(e) => setFormData({ ...formData, paymentEmail: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Email for payment invoices"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price Sheet URL</label>
                      <input
                        type="url"
                        value={formData.priceSheetUrl}
                        onChange={(e) => setFormData({ ...formData, priceSheetUrl: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Link to price sheet"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Best Form of Contact</label>
                      <input
                        type="text"
                        value={formData.bestFormOfContact}
                        onChange={(e) => setFormData({ ...formData, bestFormOfContact: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="e.g., Email, Text, Phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Facebook Link</label>
                      <input
                        type="url"
                        value={formData.facebookLink}
                        onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="Facebook profile or page URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Methods</label>
                      <input
                        type="text"
                        value={formData.paymentMethods}
                        onChange={(e) => setFormData({ ...formData, paymentMethods: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        placeholder="e.g., PayPal, Wire, ACH, Venmo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="removeLabels"
                          checked={formData.removeLabels}
                          onChange={(e) => setFormData({ ...formData, removeLabels: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="removeLabels" className="ml-2 block text-sm text-gray-700">
                          Remove Labels
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="reachOutPriorToInvoicing"
                          checked={formData.reachOutPriorToInvoicing}
                          onChange={(e) => setFormData({ ...formData, reachOutPriorToInvoicing: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="reachOutPriorToInvoicing" className="ml-2 block text-sm text-gray-700">
                          Reach Out Prior to Invoicing
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPreferred"
                        checked={formData.isPreferred}
                        onChange={(e) => setFormData({ ...formData, isPreferred: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPreferred" className="ml-2 block text-sm text-gray-700">
                        Preferred Buyer
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
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
                    {editingBuyer ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBuyer(null);
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

