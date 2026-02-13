import ProductList from "@/components/ProductList";
import { getProducts } from "@/lib/getProducts";

export default async function Home() {
  const products = await getProducts();
  return <ProductList products={products} />;
}
