import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Button from '../components/Button';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
};

const SupplierModal = ({ isOpen, onClose, onSubmit, supplier, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    productsSupplied: 0,
    totalValue: 0,
    rating: 0,
    lastDelivery: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        location: supplier.location || '',
        productsSupplied: supplier.productsSupplied || 0,
        totalValue: supplier.totalValue || 0,
        rating: supplier.rating || 0,
        lastDelivery: formatDateForInput(supplier.lastDelivery) || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        productsSupplied: 0,
        totalValue: 0,
        rating: 0,
        lastDelivery: '',
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter supplier name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="supplier@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+250 XXX XXX XXX"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="City, Country"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Products Supplied
              </label>
              <input
                type="number"
                name="productsSupplied"
                value={formData.productsSupplied}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Value (RWf)
              </label>
              <input
                type="number"
                name="totalValue"
                value={formData.totalValue}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.rating ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.0"
              />
              {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Delivery
              </label>
              <input
                type="date"
                name="lastDelivery"
                value={formData.lastDelivery}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : supplier ? 'Update Supplier' : 'Add Supplier'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const API_BASE_URL = 'http://localhost:5000/api/suppliers';

  const calculateStats = () => {
    if (suppliers.length === 0) {
      return {
        totalSuppliers: 0,
        activeProducts: 0,
        totalValue: 0,
        avgRating: 0
      };
    }

    const totalProducts = suppliers.reduce((sum, s) => sum + (s.productsSupplied || 0), 0);
    const totalValue = suppliers.reduce((sum, s) => sum + (s.totalValue || 0), 0);
    const avgRating = suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / suppliers.length;

    return {
      totalSuppliers: suppliers.length,
      activeProducts: totalProducts,
      totalValue: totalValue,
      avgRating: avgRating
    };
  };

  const stats = calculateStats();

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Check if backend is running.');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch suppliers: ${response.status}`);
      }
      
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (supplierId) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${supplierId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete supplier');
      }

      setSuppliers(suppliers.filter(s => s._id !== supplierId));
    } catch (err) {
      alert('Error deleting supplier: ' + err.message);
      console.error('Error deleting supplier:', err);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const url = editingSupplier 
        ? `${API_BASE_URL}/${editingSupplier._id}`
        : API_BASE_URL;
      
      const method = editingSupplier ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save supplier');
      }

      const savedSupplier = await response.json();

      if (editingSupplier) {
        setSuppliers(suppliers.map(s => 
          s._id === savedSupplier._id ? savedSupplier : s
        ));
      } else {
        setSuppliers([...suppliers, savedSupplier]);
      }

      handleModalClose();
    } catch (err) {
      alert('Error saving supplier: ' + err.message);
      console.error('Error saving supplier:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading suppliers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-semibold">Error loading suppliers</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button 
          onClick={() => fetchSuppliers()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
          <p className="text-gray-500 mt-1">Manage relationships with your suppliers</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleAddNew}>
          Add New Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Suppliers</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalSuppliers}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Active Products</div>
          <div className="text-3xl font-bold text-gray-900">{stats.activeProducts}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Value</div>
          <div className="text-3xl font-bold text-gray-900">
            RWf {(stats.totalValue / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Avg Rating</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '0.0'} ⭐
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Supplier Directory</h3>
        </div>
        
        {suppliers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No suppliers found. Add your first supplier to get started.</p>
            <Button variant="primary" icon={Plus} onClick={handleAddNew}>
              Add Your First Supplier
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Supplier Name</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Location</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Products</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Total Value</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Rating</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Last delivery: {formatDate(supplier.lastDelivery)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{supplier.email}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{supplier.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{supplier.location}</td>
                    <td className="py-4 px-6 text-center font-semibold text-gray-900">
                      {supplier.productsSupplied || 0}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-gray-900">
                      RWf {((supplier.totalValue || 0) / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold text-gray-900">
                          {supplier.rating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(supplier)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="Edit supplier"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(supplier._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Delete supplier"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SupplierModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        supplier={editingSupplier}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Suppliers;