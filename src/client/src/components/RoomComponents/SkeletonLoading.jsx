function SkeletonBlock({ height = 'h-6', width = 'w-full', className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gray-700 rounded ${height} ${width} ${className}`}
    />
  );
}

export default function SkeletonRoom() {
  return (
    <section className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-6 py-12">
      {/* Skeleton for RoomId */}
      <div className="mb-12 text-center w-full max-w-sm">
        <SkeletonBlock height="h-8" width="w-1/2" className="mx-auto mb-4" />
        <SkeletonBlock height="h-10" width="w-3/4" className="mx-auto mb-3" />
        <SkeletonBlock height="h-4" width="w-2/3" className="mx-auto" />
      </div>

      {/* Skeleton for UploadDropBox */}
      <div className="w-full max-w-3xl mb-16">
        <div className="animate-pulse border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center h-64 flex flex-col items-center justify-center">
          <SkeletonBlock height="h-12" width="w-12" className="mb-4" />
          <SkeletonBlock height="h-6" width="w-1/2" className="mb-2" />
          <SkeletonBlock height="h-4" width="w-1/3" className="mb-4" />
          <SkeletonBlock height="h-10" width="w-32" />
        </div>
      </div>

      {/* Skeleton for SharedFiles */}
      <div className="w-full max-w-3xl mb-12">
        <SkeletonBlock height="h-8" width="w-1/3" className="mb-6" />
        <div className="space-y-4">
          {/* Simulate 3 file items */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-800 rounded-xl p-4 h-20"
            >
              <div className="w-2/3 space-y-2">
                <SkeletonBlock height="h-5" />
                <SkeletonBlock height="h-4" width="w-1/2" />
              </div>
              <SkeletonBlock height="h-10" width="w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton for ParticipantsList */}
      <div className="w-full max-w-3xl">
        <SkeletonBlock height="h-8" width="w-1/3" className="mb-4" />
        <div className="bg-gray-800 rounded-xl p-4 space-y-3">
          {/* Simulate 3 participant items */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-2 h-10">
              <SkeletonBlock
                height="h-8"
                width="w-8"
                className="rounded-full flex-shrink-0"
              />
              <SkeletonBlock height="h-5" width="w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
