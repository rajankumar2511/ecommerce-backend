"use client";

import { useEffect, useState, useMemo } from "react";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?mine=true", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔥 Get unique categories
  const categories = useMemo(() => {
    const unique = [...new Set(products.map(p => p.category))];
    return unique.filter(Boolean);
  }, [products]);

  // 🔥 Filtered Products
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(p => p.category === selectedCategory);

  if (loading) return <p className="p-8 text-gray-400">Loading...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;

  return (
    <div className="p-8 min-h-screen bg-black text-white">

      {/* Header Row */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>

        {/* 🔥 Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600"
        >
          <option value="all">All Categories</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-400">No products found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {product.title}
              </h2>

              <p className="text-gray-400 mb-2">
                ₹{product.price}
              </p>

              <p className="text-gray-500 text-sm mb-2">
                Stock: {product.stock}
              </p>

              <p className="text-blue-400 text-sm">
                {product.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
