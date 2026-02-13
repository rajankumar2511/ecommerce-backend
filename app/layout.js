import "./globals.css";

import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Account from "@/models/Account";

export default async function RootLayout({ children }) {
  let user = null;

  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const dbUser = await Account.findById(decoded.userId).select(
        "name email role"
      );

      if (dbUser) {
        user = {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
        };
      }
    }
  } catch {
    user = null;
  }

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
