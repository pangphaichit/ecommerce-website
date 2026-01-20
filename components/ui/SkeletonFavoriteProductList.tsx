export default function SkeletonFavoriteProductList({
  count = 8,
}: {
  count?: number;
}) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 my-2 lg:my-4">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="border border-gray-200 rounded-xl overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="h-25 lg:h-52 bg-gray-200" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between gap-2">
              <div className="h-4 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/4 bg-gray-200 rounded" />
            </div>

            <div className="flex gap-2 mt-3">
              <div className="h-8 flex-1 bg-gray-200 rounded-full" />
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
