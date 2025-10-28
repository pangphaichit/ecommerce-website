import React from "react";

interface Category {
  label: string;
  value: string;
  icon?: any;
}

interface BlogTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function BlogTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: BlogTabsProps) {
  return (
    <div className="w-full">
      <div className="w-full flex  flex-col lg:flex-row  gap-3 lg:p-3 lg:justify-around overflow-hidden cursor-pointer mt-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div className="flex items-center">
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={`flex-1 flex items-center justify-center  gap-2 px-4 py-2 text-sm lg:text-lg font-medium transition-all hover:text-yellow-600  ${
                  selectedCategory === category.value
                    ? " text-yellow-700 font-bold"
                    : " text-gray-600 cursor-pointer"
                }`}
              >
                <Icon size={16} />
                {category.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
