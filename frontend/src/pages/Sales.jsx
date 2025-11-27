import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, DollarSign, Box, X } from 'lucide-react';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    itemsSold: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    product: '',
    customer: '',
    quantity: '',
    unitPrice: '',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');


  const API_BASE_URL = 'http://localhost:5000/api';

  // Calculate statistics from sales data
  const calculateStats = (sales) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });

    const totalSales = monthlySales.length;
    const totalRevenue = monthlySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const itemsSold = monthlySales.reduce((sum, sale) => sum + sale.quantity, 0);

    setStats({
      totalSales,
      totalRevenue,
      itemsSold
    });
  };

  // Fetch sales transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/sales`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSalesTransactions(data);
      calculateStats(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      // Calculate total amount
      const quantity = parseFloat(formData.quantity);
      const unitPrice = parseFloat(formData.unitPrice);
      const totalAmount = quantity * unitPrice;

      // Prepare sale data
      const saleData = {
        date: formData.date,
        product: formData.product,
        customer: formData.customer,
        quantity: quantity,
        unitPrice: unitPrice,
        totalAmount: totalAmount,
        paymentStatus: formData.paymentStatus,
        paymentMethod: formData.paymentMethod
      };

      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create sale');
      }

      // Success - refresh data and close modal
      await fetchTransactions();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error creating sale:', err);
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      product: '',
      customer: '',
      quantity: '',
      unitPrice: '',
      paymentStatus: 'Pending',
      paymentMethod: 'Cash'
    });
    setFormError('');
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter transactions based on search term
  const filteredTransactions = salesTransactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    const transactionDate = formatDate(transaction.date).toLowerCase();
    
    return (
      transaction.product?.toLowerCase().includes(searchLower) ||
      transaction.customer?.toLowerCase().includes(searchLower) ||
      transactionDate.includes(searchLower)
    );
  });

  // Calculate total amount in real-time
  const calculatedTotal = formData.quantity && formData.unitPrice 
    ? (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
          <p className="text-gray-500 mt-1">Track and manage all sales transactions</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
          Record New Sale
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Sales"
          value={stats.totalSales.toLocaleString()}
          subtitle="Total transactions this month"
          icon={ShoppingCart}
          trend="up"
          trendValue="18%"
          color="text-blue-600"
          bgColor="bg-white"
        />
        <StatCard
          title="Total Revenue"
          value={`RWf ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          subtitle="Total earnings this month"
          icon={DollarSign}
          trend="up"
          trendValue="23%"
          color="text-emerald-600"
          bgColor="bg-white"
        />
        <StatCard
          title="Items Sold"
          value={stats.itemsSold.toLocaleString()}
          subtitle="Total quantity sold"
          icon={Box}
          trend="up"
          trendValue="15%"
          color="text-purple-600"
          bgColor="bg-white"
        />
      </div>

      <SearchBar
        placeholder="Search sales by product, customer, or date..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showExport={false}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Sales Transactions</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading transactions...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 font-medium">Error: {error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  fetchTransactions();
                }}
                className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No transactions found matching your search' : 'No transactions found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Product</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Total Amount</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {transaction.product}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {transaction.customer}
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-semibold text-gray-900">
                      {transaction.quantity}
                    </td>
                    <td className="py-4 px-6 text-right text-sm font-bold text-gray-900">
                      RWf {(transaction.totalAmount / 1000).toLocaleString()}K
                    </td>
                    <td className="py-4 px-6 text-center">
                      <StatusBadge status={transaction.paymentStatus} type="payment" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for adding new sale */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Record New Sale</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Product */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Customer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter customer name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    step="1"
                    placeholder="Enter quantity"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unit Price (RWf) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter unit price"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Total Amount (Auto-calculated) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Amount (RWf)
                  </label>
                  <input
                    type="text"
                    value={`RWf ${parseFloat(calculatedTotal).toLocaleString()}`}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Record Sale
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;