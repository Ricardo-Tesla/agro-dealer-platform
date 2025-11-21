import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Button from '../components/Button.jsx';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';

const API_URL = 'http://localhost:5000/api/products'; // Update with your actual API URL

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minStock: '',
    price: '',
    expiryDate: '',
    supplier: '',
    location: '',
    status: 'in_stock'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset form when modal opens/closes or editing product changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || '',
        quantity: editingProduct.quantity || '',
        minStock: editingProduct.minStock || '',
        price: editingProduct.price || '',
        expiryDate: editingProduct.expiryDate || '',
        supplier: editingProduct.supplier || '',
        location: editingProduct.location || '',
        status: editingProduct.status || 'in_stock'
      });
    } else if (isModalOpen) {
      setFormData({
        name: '',
        category: '',
        quantity: '',
        minStock: '',
        price: '',
        expiryDate: '',
        supplier: '',
        location: '',
        status: 'in_stock'
      });
    }
    setFormErrors({});
  }, [editingProduct, isModalOpen]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.minStock || formData.minStock < 0) newErrors.minStock = 'Valid minimum stock is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        quantity: Number(formData.quantity),
        minStock: Number(formData.minStock),
        price: Number(formData.price)
      };

      if (editingProduct) {
        // Update existing product
        const response = await fetch(`${API_URL}/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSubmit),
        });
        
        if (!response.ok) throw new Error('Failed to update product');
        
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === editingProduct._id ? updatedProduct : p));
      } else {
        // Add new product
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSubmit),
        });
        
        if (!response.ok) throw new Error('Failed to add product');
        
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormErrors({ submit: 'Failed to save product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Error deleting product: ' + err.message);
      console.error('Error deleting product:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormErrors({});
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
          <p className="text-gray-500 mt-1">Manage and track your agricultural products</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add New Product
        </Button>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search products by name, category, or supplier..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Stock</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Expiry Date</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Supplier</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{product.location}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="font-semibold text-gray-900">{product.quantity}</div>
                      <div className="text-xs text-gray-500">Min: {product.minStock}</div>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-gray-900">
                      RWf {(product.price / 1000).toLocaleString()}K
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.expiryDate}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{product.supplier}</td>
                    <td className="py-4 px-6 text-center">
                      <StatusBadge status={product.status} type="stock" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal - Hidden until isModalOpen is true */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseModal}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Tools">Tools</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                </div>

                {/* Supplier */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.supplier ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter supplier name"
                  />
                  {formErrors.supplier && <p className="text-red-500 text-xs mt-1">{formErrors.supplier}</p>}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formErrors.quantity && <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>}
                </div>

                {/* Minimum Stock */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Stock *
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.minStock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formErrors.minStock && <p className="text-red-500 text-xs mt-1">{formErrors.minStock}</p>}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (RWf) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Warehouse A, Shelf 3"
                  />
                  {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {formErrors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{formErrors.submit}</p>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;