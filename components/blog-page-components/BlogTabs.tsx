import React, { useState } from "react";
import { Sparkles, BookHeart, ChefHat, Clapperboard } from "lucide-react";

const categories = [
  { label: "All", value: "All", icon: Sparkles },
  { label: "Recipes", value: "recipes", icon: BookHeart },
  { label: "Tips & Tricks", value: "tips & tricks", icon: ChefHat },
  {
    label: "Behind the Scenes",
    value: "behind the scenes",
    icon: Clapperboard,
  },
];

export default function BlogTabs() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="w-full">
      <div className="w-full flex gap-3 bg-gray-100 p-3 overflow-hidden">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeTab === category.value;

          return (
            <button
              key={category.value}
              onClick={() => setActiveTab(category.value)}
              className={`flex-1 flex items-center justify-center  gap-2 px-4 py-2 text-sm lg:text-lg font-medium transition-all hover:text-yellow-600  ${
                isActive
                  ? " text-yellow-700 font-bold"
                  : " text-gray-600 cursor-pointer"
              }`}
            >
              <Icon size={16} />
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
