import { Lightbulb, Shield, Wind, Lock, Speaker, Wifi } from "lucide-react";

const features = [
  { icon: Lightbulb, label: "Lighting" },
  { icon: Shield, label: "Security" },
  { icon: Wind, label: "Climate" },
  { icon: Lock, label: "Access" },
  { icon: Speaker, label: "Audio" },
  { icon: Wifi, label: "Network" },
];

export default function FeatureStrip() {
  return (
    <div className="w-full border-y border-border bg-[#050505] py-8 relative z-20">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center overflow-x-auto gap-8 no-scrollbar">
        {features.map((Feature, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center gap-3 min-w-[80px] text-faint hover:text-text transition-colors cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-white/5 group-hover:bg-brand-soft group-hover:text-brand transition-all duration-300">
              <Feature.icon strokeWidth={1.5} className="w-7 h-7" />
            </div>
            <span className="text-xs uppercase tracking-wider font-medium">{Feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
