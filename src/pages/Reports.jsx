import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { topProducts } from '../components/mockData';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-500 mt-1">Comprehensive business insights and performance metrics</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90 mb-2">Sales Performance</h3>
          <div className="text-3xl font-bold mb-1">RWf 54.8M</div>
          <div className="text-sm opacity-75">+23% from last month</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90 mb-2">Stock Value</h3>
          <div className="text-3xl font-bold mb-1">RWf 19.6M</div>
          <div className="text-sm opacity-75">1,317 total products</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90 mb-2">Top Selling</h3>
          <div className="text-3xl font-bold mb-1">NPK Fertilizer</div>
          <div className="text-sm opacity-75">245 units sold</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <h3 className="text-sm font-medium opacity-90 mb-2">Low Stock Alert</h3>
          <div className="text-3xl font-bold mb-1">8 Products</div>
          <div className="text-sm opacity-75">Need restocking</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{product.sales} units sold</div>
                </div>
                <div className="text-right mr-4">
                  <div className="font-bold text-gray-900">RWf {(product.revenue / 1000000).toFixed(1)}M</div>
                  <div className={`text-sm flex items-center justify-end gap-1 ${
                    product.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {product.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {product.trend === 'up' ? '+12%' : '-8%'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Inventory Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Total Products</div>
              <div className="text-3xl font-bold text-gray-900">1,317</div>
              <div className="text-xs text-gray-500 mt-1">Across 3 categories</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
              <div className="text-sm text-gray-600 mb-1">Stock Value</div>
              <div className="text-3xl font-bold text-gray-900">RWf 19.6M</div>
              <div className="text-xs text-gray-500 mt-1">Total inventory worth</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-sm text-gray-600 mb-1">Total Sales</div>
              <div className="text-3xl font-bold text-gray-900">2,847</div>
              <div className="text-xs text-gray-500 mt-1">This month</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
              <div className="text-sm text-gray-600 mb-1">Revenue</div>
              <div className="text-3xl font-bold text-gray-900">RWf 54.8M</div>
              <div className="text-xs text-gray-500 mt-1">Monthly earnings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">In Stock</span>
              <span className="text-sm font-bold text-emerald-600">1,197 items</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '91%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Low Stock</span>
              <span className="text-sm font-bold text-orange-600">108 items</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '8%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Out of Stock</span>
              <span className="text-sm font-bold text-red-600">12 items</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '1%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;