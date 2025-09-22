export default function SkeletonProductSlugPage() {
  return (
    <div className="flex flex-col lg:w-[70%] mx-auto w-full gap-2 animate-pulse">
      <div className="flex flex-col lg:flex-row mb-4 gap-2">
        <ProductImagesSkeleton />
        <ProductInfoSkeleton />
      </div>
      <ProductTabsSkeleton />
    </div>
  );
}

// ----- Subcomponent skeletons -----
function ProductImagesSkeleton() {
  return (
    <div className="lg:w-[50%] w-full flex gap-2">
      {/* Thumbnails */}
      <div className="hidden lg:flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-10 h-10 bg-gray-300 "></div>
        ))}
      </div>
      {/* Main Image */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-300 h-[300px] lg:h-[450px] rounded-md"></div>

        {/* Mobile dots */}
        <div className="lg:hidden flex justify-center space-x-2 mt-4">
          <div className="w-6 h-2.5 bg-gray-300 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function ProductInfoSkeleton() {
  return (
    <div className="lg:w-[50%] flex flex-col gap-4 mx-4 lg:mx-0">
      {/* Badges */}
      <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
        <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
        <div className="w-24 h-6 bg-gray-300 rounded-full"></div>
      </div>
      {/* Title */}
      <div className="h-8 w-3/4 bg-gray-300 rounded-md"></div>
      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-300 rounded-md"></div>
        <div className="h-4 w-4/5 bg-gray-300 rounded-md"></div>
        <div className="h-4 w-3/5 bg-gray-300 rounded-md"></div>
      </div>
      {/* Quantity + Price */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="w-12 h-10 bg-gray-200 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>
        <div className="w-16 h-6 bg-gray-300 rounded-md"></div>
      </div>
      {/* Add to Cart Button */}
      <div className="h-12 w-full bg-gray-300 rounded-full"></div>
      {/* Delivery Info */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="h-4 w-3/4 bg-gray-300 rounded-md"></div>
        <div className="h-4 w-2/3 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
}

function ProductTabsSkeleton() {
  return (
    <div className="mt-6 mb-4">
      {/* Desktop Tabs */}
      <div className="hidden lg:flex gap-8 justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-28 h-6 bg-gray-300 rounded-md"></div>
        ))}
      </div>

      {/* Desktop Tab Content */}
      <div className="hidden lg:block max-w-3xl mx-auto py-12 space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-300 rounded-md"></div>
        ))}
      </div>

      {/* Mobile Accordion */}
      <div className="lg:hidden flex flex-col gap-2 mx-4 lg:mx-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-200 rounded-md h-16"></div>
        ))}
      </div>
    </div>
  );
}
