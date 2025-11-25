//src/components/SearchBar.jsx

import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

const SearchBar = ({ 
  placeholder = "Search...", 
  searchTerm = "", 
  onSearchChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        
      </div>
    </div>
  );
};

export default SearchBar;