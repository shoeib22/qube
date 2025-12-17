export default function Features() {
  const items: { name: string; desc: string }[] = [
    { name: "Smart Hub", desc: "Central Control" },
    { name: "Smart Locks", desc: "Secure Access" },
    { name: "Sensors", desc: "Motion Tracking" },
    { name: "Lighting", desc: "Ambient Control" },
  ];

  return (
    <section id="features" className="py-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10">Product Ecosystem</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-[#121212] border border-gray-800 p-6 rounded-2xl hover:border-gray-400 transition"
            >
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
