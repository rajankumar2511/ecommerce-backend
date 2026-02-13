"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
  };

  const updateQuantity = async (productId, newQty) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: newQty }),
    });

    fetchCart();
  };

  const removeItem = async (productId) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    fetchCart();
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-3xl mb-4">Your Cart is Empty</h2>
        <Link
          href="/"
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-10 text-center">
        Your Cart
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">

        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-6">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div>
                <h2 className="text-xl">{item.product.title}</h2>
                <p className="text-gray-400">
                  ₹{item.product.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product._id,
                        item.quantity - 1
                      )
                    }
                    className="px-3 py-1 bg-gray-700 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product._id,
                        item.quantity + 1
                      )
                    }
                    className="px-3 py-1 bg-gray-700 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-blue-400 font-semibold">
                ₹{item.product.price * item.quantity}
              </p>

              <button
                onClick={() => removeItem(item.product._id)}
                className="text-red-500 text-sm mt-3"
              >
                Remove
              </button>
            </div>

          </div>
        ))}

        <div className="text-right text-2xl font-bold mt-10">
          Total: <span className="text-purple-400">₹{total}</span>
        </div>

      </div>
    </div>
  );
}
