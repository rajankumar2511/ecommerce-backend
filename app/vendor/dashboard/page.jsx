import Link from "next/link";

export default function VendorDashboard() {
    return (
        <div className="min-h-screen bg-black text-white p-10">

            <h1 className="text-4xl font-bold mb-8">
                Vendor Dashboard
            </h1>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Add Product Card */}
                <Link
                    href="/vendor/add-product"
                    className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition"
                >
                    <h2 className="text-2xl font-semibold mb-2">
                        Add New Product
                    </h2>
                    <p className="text-gray-400">
                        Create and list a new product in your store.
                    </p>
                </Link>

                {/* View Products Card */}
                <Link href="/vendor/products"

                    className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition"
                >
                    <h2 className="text-2xl font-semibold mb-2">
                        My Products
                    </h2>
                    <p className="text-gray-400">
                        Manage and edit your listed products.
                    </p>
                </Link>


            </div>

        </div>
    );
}
