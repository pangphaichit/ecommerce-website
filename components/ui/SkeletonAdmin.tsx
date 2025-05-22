function SkeletonAdmin() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(2)].map((_, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-xl overflow-hidden animate-pulse"
        >
          <div className="h-[180px] bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="flex justify-between items-center mt-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="h-4 w-14 bg-gray-200 rounded" />
              <div className="h-4 w-10 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonAdmin;
