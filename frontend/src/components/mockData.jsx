//src/components/mockData.jsx

export const salesData = [
  { month: 'Jan', value: 2850000, target: 3000000 },
  { month: 'Feb', value: 3200000, target: 3200000 },
  { month: 'Mar', value: 2950000, target: 3100000 },
  { month: 'Apr', value: 3800000, target: 3500000 },
  { month: 'May', value: 4200000, target: 4000000 },
  { month: 'Jun', value: 3900000, target: 4200000 },
  { month: 'Jul', value: 4500000, target: 4300000 },
  { month: 'Aug', value: 5100000, target: 4800000 },
  { month: 'Sep', value: 4800000, target: 5000000 },
  { month: 'Oct', value: 5500000, target: 5200000 },
  { month: 'Nov', value: 6200000, target: 5500000 },
  { month: 'Dec', value: 7800000, target: 6000000 },
];

export const recentSales = [
  { id: 1, product: 'NPK Fertilizer 50kg', customer: 'Kirehe Cooperative', location: 'Eastern Province', date: '2025-11-17', quantity: 50, amount: 1250000, status: 'Completed' },
  { id: 2, product: 'Maize Seeds (Hybrid)', customer: 'Musanze Farmers Ltd', location: 'Northern Province', date: '2025-11-17', quantity: 25, amount: 625000, status: 'Completed' },
  { id: 3, product: 'Pesticide - Roundup', customer: 'Nyagatare Agro Dealers', location: 'Eastern Province', date: '2025-11-16', quantity: 30, amount: 450000, status: 'Pending' },
  { id: 4, product: 'DAP Fertilizer 50kg', customer: 'Rwamagana Cooperative', location: 'Eastern Province', date: '2025-11-16', quantity: 40, amount: 1000000, status: 'Completed' },
  { id: 5, product: 'Irish Potato Seeds', customer: 'Musanze Farmers Union', location: 'Northern Province', date: '2025-11-15', quantity: 100, amount: 800000, status: 'Completed' },
];

export const productsData = [
  { id: 1, name: 'NPK Fertilizer 50kg', category: 'Fertilizers', quantity: 245, minStock: 100, price: 25000, expiryDate: '2026-03-15', supplier: 'Yara Rwanda Ltd', status: 'In Stock', location: 'Warehouse A', lastRestocked: '2025-10-20' },
  { id: 2, name: 'DAP Fertilizer 50kg', category: 'Fertilizers', quantity: 180, minStock: 100, price: 25000, expiryDate: '2026-04-20', supplier: 'Yara Rwanda Ltd', status: 'In Stock', location: 'Warehouse A', lastRestocked: '2025-10-25' },
  { id: 3, name: 'Urea Fertilizer 50kg', category: 'Fertilizers', quantity: 85, minStock: 100, price: 23000, expiryDate: '2026-02-10', supplier: 'Yara Rwanda Ltd', status: 'Low Stock', location: 'Warehouse A', lastRestocked: '2025-09-15' },
  { id: 4, name: 'Maize Seeds (Hybrid)', category: 'Seeds', quantity: 320, minStock: 50, price: 25000, expiryDate: '2025-12-30', supplier: 'SeedCo Rwanda', status: 'Expiring Soon', location: 'Warehouse B', lastRestocked: '2025-08-10' },
  { id: 5, name: 'Bean Seeds (Climbing)', category: 'Seeds', quantity: 150, minStock: 50, price: 18000, expiryDate: '2026-01-15', supplier: 'SeedCo Rwanda', status: 'In Stock', location: 'Warehouse B', lastRestocked: '2025-10-05' },
  { id: 6, name: 'Irish Potato Seeds', category: 'Seeds', quantity: 200, minStock: 80, price: 8000, expiryDate: '2025-11-30', supplier: 'RAB Seeds Unit', status: 'Expiring Soon', location: 'Cold Storage', lastRestocked: '2025-09-01' },
  { id: 7, name: 'Pesticide - Roundup 1L', category: 'Pesticides', quantity: 95, minStock: 50, price: 15000, expiryDate: '2026-06-30', supplier: 'Bayer EA Ltd', status: 'In Stock', location: 'Warehouse C', lastRestocked: '2025-11-01' },
  { id: 8, name: 'Fungicide - Mancozeb', category: 'Pesticides', quantity: 42, minStock: 50, price: 12000, expiryDate: '2026-05-15', supplier: 'Bayer EA Ltd', status: 'Low Stock', location: 'Warehouse C', lastRestocked: '2025-08-20' },
];

export const salesTransactions = [
  { id: 1, date: '2025-11-17', product: 'NPK Fertilizer 50kg', customer: 'Kirehe Cooperative', quantity: 50, unitPrice: 25000, totalAmount: 1250000, paymentStatus: 'Paid', paymentMethod: 'Mobile Money' },
  { id: 2, date: '2025-11-17', product: 'Maize Seeds', customer: 'Musanze Farmers', quantity: 25, unitPrice: 25000, totalAmount: 625000, paymentStatus: 'Paid', paymentMethod: 'Bank Transfer' },
  { id: 3, date: '2025-11-16', product: 'DAP Fertilizer 50kg', customer: 'Rwamagana Coop', quantity: 40, unitPrice: 25000, totalAmount: 1000000, paymentStatus: 'Pending', paymentMethod: 'Cash' },
  { id: 4, date: '2025-11-16', product: 'Pesticide - Roundup', customer: 'Nyagatare Dealers', quantity: 30, unitPrice: 15000, totalAmount: 450000, paymentStatus: 'Paid', paymentMethod: 'Mobile Money' },
  { id: 5, date: '2025-11-15', product: 'Bean Seeds', customer: 'Huye Farmers Union', quantity: 20, unitPrice: 18000, totalAmount: 360000, paymentStatus: 'Paid', paymentMethod: 'Bank Transfer' },
];

export const suppliersData = [
  { id: 1, name: 'Yara Rwanda Ltd', email: 'info@yara.rw', phone: '+250 788 123 456', location: 'Kigali', productsSupplied: 245, totalValue: 6125000, rating: 4.8, lastDelivery: '2025-11-10' },
  { id: 2, name: 'SeedCo Rwanda', email: 'sales@seedco.rw', phone: '+250 788 234 567', location: 'Kigali', productsSupplied: 470, totalValue: 9860000, rating: 4.9, lastDelivery: '2025-11-08' },
  { id: 3, name: 'Bayer East Africa Ltd', email: 'contact@bayer.ea', phone: '+250 788 345 678', location: 'Kigali', productsSupplied: 137, totalValue: 1956000, rating: 4.7, lastDelivery: '2025-11-12' },
  { id: 4, name: 'RAB Seeds Unit', email: 'seeds@rab.gov.rw', phone: '+250 788 456 789', location: 'Rubavu', productsSupplied: 200, totalValue: 1600000, rating: 4.5, lastDelivery: '2025-10-28' },
];

export const categoryData = [
  { name: 'Fertilizers', value: 510, color: '#10B981' },
  { name: 'Seeds', value: 670, color: '#3B82F6' },
  { name: 'Pesticides', value: 137, color: '#F59E0B' },
];

export const topProducts = [
  { name: 'NPK Fertilizer 50kg', sales: 245, revenue: 6125000, trend: 'up' },
  { name: 'Maize Seeds (Hybrid)', sales: 320, revenue: 8000000, trend: 'up' },
  { name: 'DAP Fertilizer 50kg', sales: 180, revenue: 4500000, trend: 'down' },
  { name: 'Bean Seeds', sales: 150, revenue: 2700000, trend: 'up' },
];