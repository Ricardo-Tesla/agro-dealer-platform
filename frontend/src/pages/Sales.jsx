import { useState, useEffect } from "react";
import { Plus, Trash2, X } from 'lucide-react';
import Button from '../components/Button.jsx';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';

const API_URL_PRODUCTS = 'http://localhost:5000/api/products';
const API_URL_SALES = 'http://localhost:5000/api/sales';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    price: 0,
    buyer: ''
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'quantity') newValue = Math.max(1, Number(value));
    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Update price if product changes
    if (name === 'productId') {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        setFormData(prev => ({ ...prev, price: selectedProduct.price }));
      } else {
        setFormData(prev => ({ ...prev, price: 0 }));
      }
    }

    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (!formData.buyer.trim()) newErrors.buyer = 'Buyer is required';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        productId: formData.productId,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        buyer: formData.buyer
      };

      const response = await fetch(API_URL_SALES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      if (!response.ok) throw new Error('Failed to add sale');
      const newSale = await response.json();
      setSales([...sales, newSale]);
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting sale:', err);
      setFormErrors({ submit: 'Failed to save sale. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    try {
      const response = await fetch(`${API_URL_SALES}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete sale');
      setSales(sales.filter(s => s._id !== id));
    } catch (err) {
      alert('Error deleting sale: ' + err.message);
      console.error('Error deleting sale:', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      productId: '',
      quantity: 1,
      price: 0,
      buyer: ''
    });
    setFormErrors({});
  };

  const filteredSales = sales.filter(sale =>
    sale.buyer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    products.find(p => p._id === sale.productId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading sales...</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Records</h2>
          <p className="text-gray-500 mt-1">Track all sales of your products</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Sale
        </Button>
      </div>

      {/* Search Bar */}
      <SearchBar placeholder="Search by buyer or product..." searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Buyer</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">No sales found</td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const product = products.find(p => p._id === sale.productId) || {};
                  return (
                    <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">{product.name || 'Unknown'}</td>
                      <td className="py-4 px-6">{sale.buyer}</td>
                      <td className="py-4 px-6 text-center">{sale.quantity}</td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">{sale.price.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">{(sale.price * sale.quantity).toLocaleString()}</td>
                      <td className="py-4 px-6 text-center">
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" onClick={() => handleDelete(sale._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Add Sale</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product *</label>
                <select name="productId" value={formData.productId} onChange={handleChange} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.productId ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select product</option>
                  {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                {formErrors.productId && <p className="text-red-500 text-xs mt-1">{formErrors.productId}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`} />
                {formErrors.quantity && <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                <input type="number" value={formData.price} disabled className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Buyer *</label>
                <input type="text" name="buyer" value={formData.buyer} onChange={handleChange} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formErrors.buyer ? 'border-red-500' : 'border-gray-300'}`} />
                {formErrors.buyer && <p className="text-red-500 text-xs mt-1">{formErrors.buyer}</p>}
              </div>

              {formErrors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{formErrors.submit}</p>
                </div>
              )}
            </form>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button type="button" variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Sale'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
