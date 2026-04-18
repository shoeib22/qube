import Image from "next/image";

export default function FeatureGrid() {
  const cards = [
    {
      title: "End-to-End Smart Home Solutions",
      desc: "From basic setups to fully integrated home automation.",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Advanced Tech & Local Control",
      desc: "Lightning-fast response times that don't rely on the cloud.",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Built for Indian Homes",
      desc: "Designed to handle local power standards and aesthetics.",
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    }
  ];

  return (
    <section className="py-24 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500 font-semibold mb-8">Why Xerovolt</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer border border-white/10"
            >
              {/* Background Image with Hover Zoom */}
              <img 
                src={card.img} 
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent"></div>
              
              {/* Card Content */}
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-medium text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}