import React from "react";
import Select from "@/components/ui/Select";

interface Option {
  label: string;
  value: string;
}

interface Props {
  isAuthenticated: boolean;
  sort: string;
  onSortChange: (value: string) => void;
  options: Option[];
}

export default function WishlistHeader({
  isAuthenticated,
  sort,
  onSortChange,
  options,
}: Props) {
  return (
    <div className="lg:my-4 lg:bg-gray-100 my-4 justify-between lg:p-4 lg:rounded-2xl flex flex-col lg:flex-row gap-3 items-start lg:items-center lg:mb-2">
      <div className="flex gap-3">
        <h2 className="text-xl lg:text-2xl font-semibold text-yellow-700">
          {isAuthenticated ? "Your wishlist" : "Wishlist"}
        </h2>
        <p className="text-base lg:text-lg lg:mt-1 text-gray-600">
          {isAuthenticated
            ? "Your curated favorites, all in one place"
            : "Sign in to save and view your favorites"}
        </p>
      </div>
      <div className="mt-4 lg:mt-0 lg:w-52 mb-2">
        <Select
          name="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          options={options}
          placeholder="Sort By"
          variant="user"
        />
      </div>
    </div>
  );
}
