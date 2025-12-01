import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "../components/Button.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Products from "./Products.jsx";

const API_URL = "http://localhost:5000/api/suppliers";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch suppliers");
      const data = await response.json();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageProducts = (supplierName) => {
    setSelectedSupplier(supplierName);
    setIsProductsModalOpen(true);
  };


  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading suppliers...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
          <p className="text-gray-500 mt-1">Manage suppliers and their products</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsProductsModalOpen(true)}>
          Add Supplier
        </Button>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search suppliers..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Supplier
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Contact
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Address
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No suppliers found
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{supplier.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{supplier.contact}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{supplier.address}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          onClick={() => handleManageProducts(supplier.name)}
                        >
                          Manage Products
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default Suppliers;
