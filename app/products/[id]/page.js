import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Account";

async function getProduct(id) {
  await connectDB();

  const product = await Product.findById(id)
    .populate("vendor", "name email")
    .lean();

  if (!product) return null;

  return {
    ...product,
    _id: product._id.toString(),
    vendor: product.vendor
      ? {
          id: product.vendor._id.toString(),
          name: product.vendor.name,
          email: product.vendor.email,
        }
      : null,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;   // 🔥 FIX
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-10">

      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

        <div className="grid md:grid-cols-2 gap-10">

          {/* PRODUCT IMAGE */}
          <div>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>

          {/* PRODUCT DETAILS */}
          <div className="flex flex-col justify-between">

            <div>
              <h1 className="text-3xl font-bold mb-4">
                {product.title}
              </h1>

              <p className="text-gray-400 mb-6">
                {product.description}
              </p>

              <p className="text-lg mb-2">
                <span className="text-gray-500">Category:</span>{" "}
                {product.category}
              </p>

              <p className="text-lg mb-2">
                <span className="text-gray-500">Stock:</span>{" "}
                {product.stock}
              </p>

              <p className="text-lg mb-4">
                <span className="text-gray-500">Sold by:</span>{" "}
                {product.vendor?.name}
              </p>

              <p className="text-4xl font-bold text-blue-400 mb-6">
                ₹{product.price}
              </p>
            </div>

            {/* ADD TO CART */}
            <AddToCartButton productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
