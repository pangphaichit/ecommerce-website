import Image from "next/image";
import React from "react";

interface ReviewsCoursesProps {
  imageSrc: string;
  name: string;
  review: string;
  backgroundColor?: string;
}

export default function ReviewsCourses({
  imageSrc,
  name,
  review,
  backgroundColor,
}: ReviewsCoursesProps) {
  return (
    <div
      className={`relative ${
        backgroundColor || "bg-gray-50"
      } rounded-lg shadow-md p-6 flex flex-col justify-between w-[270px] h-[200px]`}
    >
      {/* Circular user image */}
      <div
        className="absolute left-1/2 -top-10 rounded-full border-4 border-white overflow-hidden w-[85px] h-[85px]"
        style={{ transform: "translateX(-50%)", backgroundColor: "#fff" }}
      >
        <Image
          src={imageSrc}
          alt={`${name} profile`}
          width={85}
          height={85}
          className="object-cover"
        />
      </div>

      {/* Padding to push content below image */}
      <div style={{ paddingTop: 125 * 0.3 }}></div>

      {/* Review text */}
      <p className="text-center text-sm text-gray-600 italic flex-grow">
        <span className="font-bold text-xl text-gray-500">“&nbsp;</span>
        {review}
        <span className="font-bold text-xl text-gray-500">&nbsp;”</span>
      </p>

      {/* User name */}
      <p className="mt-4 text-base text-end font-semibold text-yellow-700 break-words">
        - {name}
      </p>
    </div>
  );
}
