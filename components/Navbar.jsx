"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  // 🔥 Memoized auth checker
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  // 🔥 Check on mount + every route change
  useEffect(() => {
    checkAuth();
    setShowDropdown(false);
  }, [pathname, checkAuth]);

  // 🔥 Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setUser(null);
    setShowDropdown(false);

    // full navigation for clean auth state
    window.location.href = "/login";
  };

  return (
    <nav className="w-full px-8 py-5 bg-black text-white flex justify-between items-center border-b border-gray-800">

      {/* Logo */}
      <Link href="/">
        <h1 className="text-2xl font-bold hover:text-blue-400 transition">
          E-Store
        </h1>
      </Link>

      <div className="flex items-center gap-6">

        {/* Cart for customers */}
        {user?.role === "customer" && (
          <Link
            href="/cart"
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <ShoppingCart size={20} />
            Cart
          </Link>
        )}

        {/* Profile */}
        {user ? (
          <div className="relative" ref={dropdownRef}>

            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold cursor-pointer"
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-40 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-3">
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            )}

          </div>
        ) : (
          <Link
            href="/login"
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}
