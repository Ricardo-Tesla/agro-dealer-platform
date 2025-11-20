//src/pages/Suppliers.jsx

import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import { suppliersData } from '../components/mockData';

const Suppliers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
          <p className="text-gray-500 mt-1">Manage relationships with your suppliers</p>
        </div>
        <Button variant="primary" icon={Plus}>
          Add New Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Suppliers</div>
          <div className="text-3xl font-bold text-gray-900">{suppliersData.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Active Products</div>
          <div className="text-3xl font-bold text-gray-900">1,052</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Total Value</div>
          <div className="text-3xl font-bold text-gray-900">RWf 19.5M</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-1">Avg Rating</div>
          <div className="text-3xl font-bold text-gray-900">4.7 ⭐</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Supplier Directory</h3>
        </div>
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
              {suppliersData.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{supplier.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Last delivery: {supplier.lastDelivery}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{supplier.email}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{supplier.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{supplier.location}</td>
                  <td className="py-4 px-6 text-center font-semibold text-gray-900">{supplier.productsSupplied}</td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    RWf {(supplier.totalValue / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-semibold text-gray-900">{supplier.rating}</span>
                      <span className="text-yellow-500">⭐</span>
                    </div>
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
};

export default Suppliers;