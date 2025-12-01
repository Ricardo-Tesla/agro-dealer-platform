import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import SearchBar from "../components/SearchBar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const API_URL = "http://localhost:5000/api/products";

const Products = ({ supplierFilter = null }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [supplierFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = API_URL;

      // If supplierFilter is provided, fetch products for that supplier
      if (supplierFilter) {
        url = `${API_URL}/supplier/${supplierFilter}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Failed to delete product");
      }
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Error deleting product: " + err.message);
      console.error("Error deleting product:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {supplierFilter ? "Supplier Products" : "Product Inventory"}
          </h2>
          <p className="text-gray-500 mt-1">
            {supplierFilter
              ? "View and manage products from this supplier"
              : "View your agricultural products inventory"}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search products by name, category, or supplier..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Product
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Stock
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Purchase Price
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Selling Price
                </th>
                {!supplierFilter && (
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Supplier
                  </th>
                )}
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={supplierFilter ? "7" : "8"}
                    className="py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {product.description}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="font-semibold text-gray-900">
                        {product.stock} {product.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {product.minStockLevel}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">
                      RWf {product.purchasePrice?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-gray-900">
                      RWf {product.sellingPrice?.toLocaleString()}
                    </td>
                    {!supplierFilter && (
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {product.supplierName || product.supplier?.name}
                      </td>
                    )}
                    <td className="py-4 px-6 text-center">
                      <StatusBadge
                        status={
                          product.stock <= product.minStockLevel
                            ? "low"
                            : "in-stock"
                        }
                        type="stock"
                      />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          onClick={() => alert("Edit feature coming soon")}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          onClick={() => handleDelete(product._id)}
                        >
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

export default Products;

