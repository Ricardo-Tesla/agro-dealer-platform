import React, { useState } from 'react';
import { Plus, ShoppingCart, DollarSign, Box } from 'lucide-react';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { salesTransactions } from '../components/mockData';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
          <p className="text-gray-500 mt-1">Track and manage all sales transactions</p>
        </div>
        <Button variant="primary" icon={Plus}>
          Record New Sale
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Sales"
          value="2,847"
          subtitle="Total transactions this month"
          icon={ShoppingCart}
          trend="up"
          trendValue="18%"
          color="text-blue-600"
          bgColor="bg-white"
        />
        <StatCard
          title="Total Revenue"
          value="RWf 54.8M"
          subtitle="Total earnings this month"
          icon={DollarSign}
          trend="up"
          trendValue="23%"
          color="text-emerald-600"
          bgColor="bg-white"
        />
        <StatCard
          title="Items Sold"
          value="6,845"
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
              {salesTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-600">{transaction.date}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{transaction.product}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{transaction.customer}</td>
                  <td className="py-4 px-6 text-center text-sm font-semibold text-gray-900">{transaction.quantity}</td>
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
      </div>
    </div>
  );
};

export default Sales;