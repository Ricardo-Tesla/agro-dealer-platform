import { Package, Coins, AlertTriangle, Clock } from "lucide-react";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import StockPieChart from "../components/StockPieChart";
import StatusBadge from "../components/StatusBadge";
import { salesData, recentSales, productsData, categoryData } from "../components/mockData";

const Dashboard = () => {
  const totalProducts = productsData.length;

  const stockValue = productsData.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  const totalRevenue = salesData.reduce((sum, item) => sum + item.value, 0);

  const totalSalesCount = recentSales.length;

  const lowStockCount = productsData.filter(
    (p) => p.quantity < p.minStock
  ).length;

  const expiringSoon = productsData.filter((p) => {
    const now = new Date();
    const expiry = new Date(p.expiryDate);
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays < 30;
  }).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts.toLocaleString()}
          subtitle={`Stock value: RWf ${stockValue.toLocaleString()}`}
          icon={Package}
          trend="up"
          trendValue="12%"
          color="text-blue-600"
          bgColor="bg-white"
          borderColor="border-sky-500"
        />

        <StatCard
          title="Total Revenue"
          value={`RWf ${totalRevenue.toLocaleString()}`}
          subtitle={`This month: ${totalSalesCount} sales`}
          icon={Coins}
          trend="up"
          trendValue="23%"
          color="text-emerald-600"
          bgColor="bg-white"
          borderColor="border-green-400"
        />

        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Items need restocking"
          icon={AlertTriangle}
          trend="down"
          trendValue="3"
          color="text-orange-600"
          bgColor="bg-white"
          borderColor="border-amber-500"
        />

        <StatCard
          title="Expiring Soon"
          value={expiringSoon}
          subtitle="Products < 30 days"
          icon={Clock}
          trend="up"
          trendValue="4"
          color="text-red-600"
          bgColor="bg-white"
          borderColor="border-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChart data={salesData} />
        <StockPieChart data={categoryData} />
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900">Recent Sales</h3>
          <p className="text-sm text-gray-600 mt-1">Latest transactions from your store</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-100 to-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Product</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {recentSales.map((sale, index) => (
                <tr
                  key={sale.id}
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">{sale.product}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{sale.customer}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {sale.location}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{sale.date}</td>

                  <td className="py-4 px-6 text-center text-sm font-semibold text-gray-900">
                    {sale.quantity}
                  </td>

                  <td className="py-4 px-6 text-sm font-bold text-right">
                    <span className="text-emerald-600">RWf {sale.amount.toLocaleString()}</span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <StatusBadge status={sale.status} type="payment" />
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

export default Dashboard;
