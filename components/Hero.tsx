"use client";

import PointCloudFromImage from "./3d/PointCloudFromImage";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-end text-white overflow-hidden">

      {/* FULLSCREEN 3D BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <PointCloudFromImage />
      </div>

      {/* TEXT — Bottom Left */}
      <div className="relative z-10 pb-24 pl-10 md:pb-32 md:pl-20 max-w-xl">
        <h1 className="text-5xl font-extrabold leading-tight">
          The Future is <span className="text-orange-300">Forming Now.</span>
        </h1>

        <p className="text-gray-300 mt-4 text-lg">
          Smart automation built around your lifestyle.
        </p>
      </div>

    </section>
  );
}
