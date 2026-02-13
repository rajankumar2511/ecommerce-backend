"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CartToast({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-gray-900 border border-gray-700 shadow-2xl rounded-xl p-5 w-80 animate-fadeIn">

      <div className="flex items-start gap-3">
        <CheckCircle className="text-green-500 mt-1" size={22} />

        <div className="flex-1">
          <p className="text-white font-semibold">
            Product successfully added to cart
          </p>

          <Link
            href="/cart"
            className="text-blue-400 text-sm hover:underline mt-1 inline-block"
          >
            View Cart
          </Link>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-sm ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
