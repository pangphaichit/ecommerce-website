import Image from "next/image";
import React from "react";

interface FavoriteProduct {
  product_id: string;
  name: string;
  image_url: string;
  added_at?: string;
}

interface Props {
  products: FavoriteProduct[];
  removeFavorite: (id: string) => void;
}

export default function FavoriteProductsList({
  products,
  removeFavorite,
}: Props) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((item) => (
        <li
          key={item.product_id}
          className="border rounded-lg p-4 flex flex-col justify-between"
        >
          <div>
            <div className="relative h-full w-full object-cover">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-sm text-gray-500">
                Added at:{" "}
                {item.added_at ? new Date(item.added_at).toLocaleString() : "-"}
              </p>
            </div>
          </div>
          <button
            className="mt-4 text-red-500 hover:underline"
            onClick={() => removeFavorite(item.product_id)}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
