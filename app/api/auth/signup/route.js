import connectDB from "@/lib/mongodb";
import Account from "@/models/Account";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

let { name, email, password, role } = await req.json();
    email = email.toLowerCase().trim();

    if (!name || !email || !password) {
      return NextResponse.json
        (
          { error: "All fields are required" },
          { status: 400 }
        );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    const allowedRoles = ["customer", "vendor"];

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      );
    }

    // Check if account exists
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return NextResponse.json
        (
          { error: "User already exists" },
          { status: 400 }
        );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await Account.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return NextResponse.json
      ({
        message: "User created successfully",
        user: {
          id: account._id,
          name: account.name,
          email: account.email,
          role: account.role,
        },
      });
  } catch (error) {
    return NextResponse.json
      (
        { error: "Something went wrong" },
        { status: 500 }
      );
  }
}
