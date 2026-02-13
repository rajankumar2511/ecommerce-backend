import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Account";

export async function getProducts() {
  await connectDB();

  const products = await Product.find()
    .populate("vendor", "name")
    .sort({ createdAt: -1 })
    .lean(); // 🔥 THIS IS IMPORTANT

  // Convert ObjectId to string manually
  return products.map((product) => ({
    ...product,
    _id: product._id.toString(),
    vendor: product.vendor
      ? {
          id: product.vendor._id.toString(),
          name: product.vendor.name,
        }
      : null,
  }));
}
