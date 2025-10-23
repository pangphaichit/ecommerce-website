import React from "react";
import Image from "next/image";

export default function BlogHeader() {
  return (
    <div className="relative w-full h-[450] lg:h-[350] ">
      <Image
        src="/blog/blog.jpg"
        alt="a pile of colorful books on a desk"
        fill
        className="object-cover lg:rounded-2xl"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/95 lg:rounded-2xl px-5 py-5 lg:px-10 lg:py-12 shadow-xl mx-8 lg:max-w-3xl  border border-gray-100">
          <h2 className="text-xl lg:text-4xl font-semibold text-yellow-700 text-center mb-3">
            Stories from Oven & Wheat
          </h2>
          <p className="text-yellow-700 text-center text-base lg:text-lg leading-relaxed">
            Insights, recipes, and inspiration from our bakers, chefs, and cake
            artists
          </p>
        </div>
      </div>
    </div>
  );
}
