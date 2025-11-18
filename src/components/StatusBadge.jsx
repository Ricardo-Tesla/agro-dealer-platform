// src/components/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusStyles = () => {
    if (type === 'stock') {
      switch (status) {
        case 'In Stock':
          return 'bg-emerald-100 text-emerald-700';
        case 'Low Stock':
          return 'bg-orange-100 text-orange-700';
        case 'Expiring Soon':
          return 'bg-red-100 text-red-700';
        case 'Out of Stock':
          return 'bg-gray-100 text-gray-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }
    
    if (type === 'payment') {
      switch (status) {
        case 'Paid':
        case 'Completed':
          return 'bg-emerald-100 text-emerald-700';
        case 'Pending':
          return 'bg-orange-100 text-orange-700';
        case 'Failed':
        case 'Overdue':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }

    // Default styling
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;