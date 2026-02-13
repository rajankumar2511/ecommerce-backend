import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import "@/models/Product";

export async function getCart() {
  try {
    await connectDB();

    // ✅ FIX: await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const cart = await Cart.findOne({ user: decoded.userId })
      .populate({
        path: "items.product",
        select: "title price image",
      });

    return cart;
  } catch (error) {
    return null;
  }
}
