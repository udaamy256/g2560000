"use client";
import React from "react";
import Image from "next/image";

export const ServiceCard = ({ service, image }) => {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full h-60">
        <Image
          src={image}
          alt={service}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{service}</h3>
        <button
          onClick={() => (window.location.href = "https://www.galaxyeducation.org/courses")}
          className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};
