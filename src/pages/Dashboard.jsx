import { Package, Coins, AlertTriangle, Clock } from "lucide-react";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import StockPieChart from "../components/StockPieChart";
import StatusBadge from "../components/StatusBadge";

// Dummy Data

const salesData = [
    { month: "Jan", value: 1200000 },
    { month: "Feb", value: 1800000 },
    { month: "Mar", value: 2200000 },
    { month: "Apr", value: 1100000 },
];

const categoryData = [
    { name: "Beverages", value: 40, color: "#0ea5e9" },
    { name: "Snacks", value: 25, color: "#14b8a6" },
    { name: "Dairy", value: 20, color: "#f97316" },
    { name: "Other", value: 15, color: "#6366f1" },
];

const recentSales = [
    {
        id: 1,
        product: "Milk 1L",
        customer: "Jean Pierre",
        location: "Kigali",
        date: "2025-01-11",
        amount: 85000,
        status: "paid",
    },
    {
        id: 2,
        product: "Rice 25kg",
        customer: "Aline Uwase",
        location: "Huye",
        date: "2025-01-10",
        amount: 54000,
        status: "pending",
    },
    {
        id: 3,
        product: "Sugar 5kg",
        customer: "Eric N.",
        location: "Musanze",
        date: "2025-01-10",
        amount: 32000,
        status: "failed",
    },
];

const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value="1,317"
                    subtitle="Stock value: RWf 19.6M"
                    icon={Package}
                    trend="up"
                    trendValue="12%"
                    color="text-blue-600"
                    bgColor="bg-white"
                    borderColor="border-sky-500"
                />
                <StatCard
                    title="Total Revenue"
                    value="RWf 54.8M"
                    subtitle="This month: 2,847 sales"
                    icon={Coins}
                    trend="up"
                    trendValue="23%"
                    color="text-emerald-600"
                    bgColor="bg-white"
                    borderColor="border-green-400"
                />
                <StatCard
                    title="Low Stock Alerts"
                    value="8"
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
                    value="12"
                    subtitle="Products < 30 days"
                    icon={Clock}
                    trend="up"
                    trendValue="4"
                    color="text-red-600"
                    bgColor="bg-white"
                    borderColor="border-red-500"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SalesChart data={salesData} />
                <StockPieChart data={categoryData} />
            </div>

            {/* Recent Sales Table */}
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
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                                <th className="text-center py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {recentSales.map((sale, index) => (
                                <tr 
                                    key={sale.id} 
                                    className={`hover:bg-blue-50 transition-colors ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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

                                    <td className="py-4 px-6 text-sm font-bold text-right">
                                        <span className="text-emerald-600">
                                            RWf {(sale.amount / 1000).toLocaleString()}K
                                        </span>
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