import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

function handleAuthError(error) {
  if (error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  if (error.message === "SECRET_MISSING") {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Invalid or expired token" },
    { status: 401 }
  );
}

/* ===================== ADD TO CART ===================== */

export async function POST(req) {
  try {
    await connectDB();

    let decoded;
    try {
      decoded = verifyAuth(req);
    } catch (error) {
      return handleAuthError(error);
    }

    if (decoded.role !== "customer") {
      return NextResponse.json(
        { error: "Only customers can add to cart" },
        { status: 403 }
      );
    }

let body;

try {
  body = await req.json();
} catch {
  return NextResponse.json(
    { error: "Invalid JSON body" },
    { status: 400 }
  );
}

const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ user: decoded.userId });

    if (!cart) {
      cart = await Cart.create({
        user: decoded.userId,
        items: [{ product: productId, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }

      await cart.save();
    }

    return NextResponse.json({ message: "Added to cart" });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/* ===================== GET CART ===================== */

export async function GET(req) {
  try {
    await connectDB();

    let decoded;
    try {
      decoded = verifyAuth(req);
    } catch (error) {
      return handleAuthError(error);
    }

    if (decoded.role !== "customer") {
      return NextResponse.json(
        { error: "Only customers can view cart" },
        { status: 403 }
      );
    }

    const cart = await Cart.findOne({ user: decoded.userId })
      .populate({
        path: "items.product",
        select: "title price image",
      });

    return NextResponse.json(cart || { items: [] });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

/* ===================== UPDATE QUANTITY ===================== */

export async function PATCH(req) {
  try {
    await connectDB();

    let decoded;
    try {
      decoded = verifyAuth(req);
    } catch (error) {
      return handleAuthError(error);
    }

    if (decoded.role !== "customer") {
      return NextResponse.json(
        { error: "Only customers can update cart" },
        { status: 403 }
      );
    }

    const { productId, quantity } = await req.json();

    if (!productId || typeof quantity !== "number") {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: decoded.userId });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return NextResponse.json({ message: "Cart updated" });

  } catch (error) {
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

/* ===================== REMOVE ITEM ===================== */

export async function DELETE(req) {
  try {
    await connectDB();

    let decoded;
    try {
      decoded = verifyAuth(req);
    } catch (error) {
      return handleAuthError(error);
    }

    if (decoded.role !== "customer") {
      return NextResponse.json(
        { error: "Only customers can modify cart" },
        { status: 403 }
      );
    }

    const { productId } = await req.json();

    const cart = await Cart.findOne({ user: decoded.userId });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return NextResponse.json({ message: "Item removed" });

  } catch (error) {
    return NextResponse.json(
      { error: "Remove failed" },
      { status: 500 }
    );
  }
}
