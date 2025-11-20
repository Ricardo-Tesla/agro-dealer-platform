// src/components/StatCard.jsx

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color, bgColor, borderColor}) => {
  return (
    <div className={`${bgColor} border-2 ${borderColor} rounded-xl p-6 shadow-sm  hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${color} bg-opacity-10 rounded-lg`}>
          <Icon size={24} className={color} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
};

export default StatCard;