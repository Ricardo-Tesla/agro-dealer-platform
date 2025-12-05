import { useState, useEffect } from "react";
import { Plus, Trash2, X, ShoppingCart, DollarSign } from 'lucide-react';

const API_URL_PRODUCTS = 'http://localhost:5000/api/products';
const API_URL_SALES = 'http://localhost:5000/api/sales';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Cart items for multiple products in one sale
  const [cartItems, setCartItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1
  });
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    paymentMethod: 'cash',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL_SALES);
      if (!response.ok) throw new Error('Failed to fetch sales');
      const data = await response.json();
      setSales(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL_PRODUCTS);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const addItemToCart = () => {
    if (!currentItem.productId || currentItem.quantity < 1) {
      alert('Please select a product and enter valid quantity');
      return;
    }

    const product = products.find(p => p._id === currentItem.productId);
    if (!product) return;

    // Check if product already in cart
    const existingIndex = cartItems.findIndex(item => item.productId === currentItem.productId);
    
    if (existingIndex >= 0) {
      // Update existing item
      const updated = [...cartItems];
      updated[existingIndex].quantity += Number(currentItem.quantity);
      setCartItems(updated);
    } else {
      // Add new item
      setCartItems([...cartItems, {
        productId: product._id,
        productName: product.name,
        quantity: Number(currentItem.quantity),
        price: product.sellingPrice || 0,
        availableStock: product.quantity
      }]);
    }

    // Reset current item
    setCurrentItem({ productId: '', quantity: 1 });
  };

  const removeItemFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const validateForm = () => {
    const newErrors = {};
    if (cartItems.length === 0) newErrors.items = 'Please add at least one item to the sale';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        customerName: formData.customerName,
        customerContact: formData.customerContact,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await fetch(API_URL_SALES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add sale');
      }
      
      await fetchSales();
      await fetchProducts(); // Refresh to see updated stock
      handleCloseModal();
      alert('Sale created successfully!');
    } catch (err) {
      console.error('Error submitting sale:', err);
      setFormErrors({ submit: err.message || 'Failed to save sale. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSale = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this sale? Stock will be restored.')) return;
    try {
      const response = await fetch(`${API_URL_SALES}/${id}/cancel`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to cancel sale');
      await fetchSales();
      await fetchProducts();
      alert('Sale cancelled successfully. Stock has been restored.');
    } catch (err) {
      alert('Error cancelling sale: ' + err.message);
      console.error('Error cancelling sale:', err);
    }
  };

  const handleDelete = async (id) => {
    const sale = sales.find(s => s._id === id);
    if (sale?.status !== 'cancelled') {
      alert('You can only delete cancelled sales. Please cancel the sale first.');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this cancelled sale?')) return;
    
    try {
      const response = await fetch(`${API_URL_SALES}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete sale');
      setSales(sales.filter(s => s._id !== id));
      alert('Sale deleted successfully');
    } catch (err) {
      alert('Error deleting sale: ' + err.message);
      console.error('Error deleting sale:', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCartItems([]);
    setCurrentItem({ productId: '', quantity: 1 });
    setFormData({
      customerName: '',
      customerContact: '',
      paymentMethod: 'cash',
      notes: ''
    });
    setFormErrors({});
  };

  const filteredSales = sales.filter(sale =>
    sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.saleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.items?.some(item => item.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading sales...</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Records</h2>
          <p className="text-gray-500 mt-1">Track all sales of your products</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Sale
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by customer, sale number, or product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Sale #</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Items</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Payment</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">No sales found</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-mono text-sm">{sale.saleNumber}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{sale.customerName}</div>
                      {sale.customerContact && (
                        <div className="text-sm text-gray-500">{sale.customerContact}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        {sale.items?.map((item, idx) => (
                          <div key={idx}>
                            {item.productName} ({item.quantity}x)
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-gray-900">
                      ${sale.totalAmount?.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        sale.status === 'completed' ? 'bg-green-100 text-green-700' :
                        sale.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {sale.status === 'completed' && (
                          <button 
                            className="p-2 hover:bg-yellow-50 rounded-lg transition-colors text-yellow-600"
                            onClick={() => handleCancelSale(sale._id)}
                            title="Cancel Sale"
                          >
                            <X size={16} />
                          </button>
                        )}
                        {sale.status === 'cancelled' && (
                          <button 
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            onClick={() => handleDelete(sale._id)}
                            title="Delete Sale"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">New Sale</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
              {/* Add Items Section */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Add Items
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <select 
                    name="productId" 
                    value={currentItem.productId} 
                    onChange={handleItemChange}
                    className="col-span-2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select product</option>
                    {products.filter(p => p.quantity > 0).map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Stock: {p.quantity} {p.unit})
                      </option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    name="quantity" 
                    value={currentItem.quantity} 
                    onChange={handleItemChange}
                    min="1"
                    placeholder="Qty"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={addItemToCart}
                  className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>

              {/* Cart Items */}
              {cartItems.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Cart Items</h4>
                  <div className="space-y-2">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                        <div className="flex-1">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">
                            Qty: {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItemFromCart(index)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="font-semibold text-gray-900 flex items-center gap-2">
                      <DollarSign size={18} />
                      Total:
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {formErrors.items && (
                <p className="text-red-500 text-sm">{formErrors.items}</p>
              )}

              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Customer Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input 
                    type="text" 
                    name="customerName" 
                    value={formData.customerName} 
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      formErrors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.customerName && <p className="text-red-500 text-xs mt-1">{formErrors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                  <input 
                    type="text" 
                    name="customerContact" 
                    value={formData.customerContact} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select 
                    name="paymentMethod" 
                    value={formData.paymentMethod} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {formErrors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{formErrors.submit}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || cartItems.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Complete Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;