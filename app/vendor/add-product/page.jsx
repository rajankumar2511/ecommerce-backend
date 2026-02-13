"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "Electronics",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Books",
    "Sports",
    "Beauty",
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    setUploading(true);

    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "ecommerce_unsigned"); // your preset
    data.append("cloud_name", "YOUR_CLOUD_NAME"); // replace

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dnpfzljsw/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const file = await res.json();
    setUploading(false);

    return file.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = form.image;

      if (imageFile) {
        imageUrl = await handleImageUpload();
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      router.push("/vendor/dashboard");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex justify-center">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 p-8 rounded-2xl">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Add New Product
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="text"
            name="title"
            placeholder="Product Title"
            className="bg-white/10 p-3 rounded-lg outline-none"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            className="bg-white/10 p-3 rounded-lg outline-none"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            className="bg-white/10 p-3 rounded-lg outline-none"
            value={form.price}
            onChange={handleChange}
            required
          />

          {/* FILE INPUT FOR CLOUDINARY */}
          <input
            type="file"
            accept="image/*"
            className="bg-white/10 p-3 rounded-lg"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />

          <select
            name="category"
            className="bg-white/10 p-3 rounded-lg outline-none"
            value={form.category}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-black">
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            className="bg-white/10 p-3 rounded-lg outline-none"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading || uploading}
            className="bg-gradient-to-r from-green-600 to-blue-600 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {uploading
              ? "Uploading Image..."
              : loading
              ? "Adding..."
              : "Add Product"}
          </button>

        </form>
      </div>
    </div>
  );
}
