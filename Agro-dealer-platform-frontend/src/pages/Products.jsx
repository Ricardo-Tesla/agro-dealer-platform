//src/pages/Products.jsx
import { useState } from "react";
import {Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import SearchBar from '../components/SearchBar';
import StatusBadge from '../components/StatusBadge';
import { productsData } from '../components/mockData';

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
          <p className="text-gray-500 mt-1">Manage and track your agricultural products</p>
        </div>
        <Button variant="primary" icon={Plus}>
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
              {productsData.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
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
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    );
}

export default Products;