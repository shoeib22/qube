"use client";

import { useState } from "react";

export default function SelectorForm() {
  const [type, setType] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [stage, setStage] = useState<string>("Under Construction");

  return (
    <section className="py-20 border-t border-gray-800 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold mb-10">
          Let Us Help You Choose
        </h2>

        <div className="bg-[#121212] border border-gray-800 p-8 rounded-3xl grid gap-6">
          
          {/* Type */}
          <div>
            <label className="text-gray-400 font-bold">Type of Home</label>
            <div className="flex gap-4 mt-3">
              {["Villa", "Apartment"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-xl border ${
                    type === t
                      ? "bg-white text-black"
                      : "border-gray-700 text-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="text-gray-400 font-bold">Size of Home</label>
            <div className="flex gap-4 mt-3">
              {["< 2000 Sqft", "2000+ Sqft"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-xl border ${
                    size === s
                      ? "bg-white text-black"
                      : "border-gray-700 text-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Stage */}
          <div>
            <label className="text-gray-400 font-bold">Stage</label>
            <select
              className="mt-3 w-full p-3 bg-black border border-gray-700 rounded-xl text-gray-300"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <option>Under Construction</option>
              <option>Interior Work Ongoing</option>
              <option>Fully Constructed</option>
            </select>
          </div>

          <button className="mt-6 px-6 py-3 bg-white text-black rounded-xl w-full font-bold">
            Get Custom Quote
          </button>

        </div>
      </div>
    </section>
  );
}
