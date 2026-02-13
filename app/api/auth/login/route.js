import connectDB from "@/lib/mongodb";
import Account from "@/models/Account";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    let { email, password } = await req.json();

    email = email.toLowerCase().trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // 🔥 Changed from User to Account
    const account = await Account.findOne({ email });

   if (!account) {
  return NextResponse.json(
    { error: "Invalid credentials" },
    { status: 400 }
  );
}

// 🚫 If account is banned
if (account.status === "banned") {
  return NextResponse.json(
    { error: "Account has been banned." },
    { status: 403 }
  );
}




    // Compare password
    // 🚨 Check if account is locked
    if (account.lockUntil && account.lockUntil > Date.now()) {
      return NextResponse.json(
        { error: "Account temporarily locked. Try again later." },
        { status: 403 }
      );
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      account.loginAttempts += 1;


      // Lock account after 5 failed attempts
      if (account.loginAttempts >= 5) {
        account.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      }

      await account.save();

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    account.loginAttempts = 0;
    account.lockUntil = undefined;
    await account.save();
    // Generate JWT
    const token = jwt.sign(
      {
        userId: account._id,
        role: account.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
    });

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });


    return response;

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
