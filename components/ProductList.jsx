"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductList({ products }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean);
    return [...new Set(cats)];
  }, [products]);

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-10">

      {/* HEADER + CATEGORY DROPDOWN */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">
          All Products
        </h1>

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
        <p className="text-center text-gray-400">
          No products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product._id.toString()}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-6"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-48 w-full object-cover rounded-xl"
              />

              <h2 className="text-xl font-semibold mt-5">
                {product.title}
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Sold by: {product.vendor?.name}
              </p>

              <p className="text-2xl font-bold mt-3 text-blue-400">
                ₹{product.price}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {product.category}
              </p>

              <div className="flex gap-3 mt-6">
                <Link href={`/products/${product._id}`}>
                  <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                    View
                  </button>
                </Link>

                <AddToCartButton
                  productId={product._id.toString()}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
