"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CartToast from "@/components/CartToast";

export default function AddToCartButton({ productId }) {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = async () => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (res.ok) {
      setShowToast(true);
    }
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>

      <CartToast
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
