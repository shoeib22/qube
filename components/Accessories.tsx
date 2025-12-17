"use client";

export default function Accessories() {
  const items: string[] = [
    "Motion Sensors",
    "Smart Plugs",
    "Curtain Motors",
    "IR Blasters",
  ];

  return (
    <section className="py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {items.map((name, i) => (
          <div
            key={i}
            className="bg-[#121212] p-6 rounded-xl border border-gray-800 text-center hover:border-gray-500 transition"
          >
            <h3 className="font-bold mb-2">{name}</h3>
            <p className="text-gray-400 text-sm">Shop Now →</p>
          </div>
        ))}
      </div>
    </section>
  );
}
