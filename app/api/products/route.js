import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/* ===============================
   ➕ CREATE PRODUCT (Vendor Only)
================================= */
export async function POST(req) {
  try {
    await connectDB();

const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. No token provided." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "vendor") {
      return NextResponse.json(
        { error: "Only vendors can add products." },
        { status: 403 }
      );
    }

    const {
      title,
      description,
      price,
      image,
      stock,
      category,
    } = await req.json();

    if (!title || !description || !price || !image || !category) {
      return NextResponse.json(
        { error: "All fields including category are required." },
        { status: 400 }
      );
    }

    const product = await Product.create({
      title,
      description,
      price,
      image,
      stock: stock || 0,
      category,
      vendor: decoded.userId,
    });

    return NextResponse.json(
      {
        message: "Product added successfully",
        product,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}



export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const mine = searchParams.get("mine");

    if (mine === "true") {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if (!token) {
        console.log("No token found");
        return NextResponse.json({ error: "No token" }, { status: 401 });
      }

      console.log("Token exists");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded:", decoded);

      const products = await Product.find({
        vendor: decoded.userId,
      }).lean();

      return NextResponse.json(products);
    }

    const products = await Product.find().lean();
    return NextResponse.json(products);

  } catch (error) {
    console.error("REAL ERROR:", error); // 🔥 IMPORTANT
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
