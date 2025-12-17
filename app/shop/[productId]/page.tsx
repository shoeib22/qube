import { notFound } from "next/navigation";

export const metadata = {
  title: "Product | CubeTech",
  description: "Explore detailed smart home accessories.",
};

const products: Record<
  string,
  { name: string; price: number; description?: string }
> = {
  "motion-sensor": {
    name: "Motion Sensor",
    price: 1299,
    description: "Advanced PIR sensor for smart automation.",
  },
  "smart-plug": {
    name: "Smart Plug",
    price: 999,
    description: "Remote control your appliances via the CubeTech app.",
  },
  "curtain-motor": {
    name: "Curtain Motor",
    price: 3499,
    description: "Automate your curtains with whisper-quiet performance.",
  },
  "ir-blaster": {
    name: "IR Blaster",
    price: 1499,
    description: "Control any IR-enabled device effortlessly.",
  },
};

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products[params.id];

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <p className="text-gray-400 mt-2 text-xl">₹ {product.price}</p>

      {product.description && (
        <p className="text-gray-500 mt-4 max-w-xl">{product.description}</p>
      )}

      <button className="mt-6 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition">
        Add to Cart
      </button>
    </div>
  );
}
