import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import SearchBar from "../components/SearchBar.jsx";

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

      if (supplierFilter) {
        url = `http://localhost:5000/api/suppliers/${supplierFilter}/products`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      // Populate supplier from API (backend already populates supplier in Product routes)
      setProducts(supplierFilter ? data.products : data);
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
      if (!response.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Error deleting product: " + err.message);
      console.error("Error deleting product:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    const category = product.supplier?.category || "";
    return (
      product.name.toLowerCase().includes(search) ||
      category.toLowerCase().includes(search) ||
      product.supplier?.name?.toLowerCase().includes(search)
    );
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading products...
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {supplierFilter ? "Supplier Products" : "Product Inventory"}
          </h2>
          <p className="text-gray-500 mt-1">
            {supplierFilter
              ? "Products from this supplier"
              : "All products in inventory"}
          </p>
        </div>
      </div>

      <SearchBar
        placeholder="Search by product, category, or supplier..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

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
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Quantity
                </th>
                {!supplierFilter && (
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Supplier
                  </th>
                )}
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={supplierFilter ? 4 : 5}
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
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {product.supplier?.category || "-"}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      {product.quantity}
                    </td>
                    {!supplierFilter && (
                      <td className="py-4 px-6 text-gray-600">
                        {product.supplier?.name || "Unknown"}
                      </td>
                    )}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          onClick={() => alert("Edit name/category feature coming soon")}
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
