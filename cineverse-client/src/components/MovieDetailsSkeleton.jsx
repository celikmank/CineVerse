export default function MovieDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 text-white animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="w-full h-96 bg-gray-800 rounded-lg"></div>
          </div>
          
          <div className="md:w-2/3">
            <div className="h-8 bg-gray-800 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-800 rounded mb-2 w-1/4"></div>
            <div className="flex gap-2 mb-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-6 w-16 bg-gray-800 rounded-full"></div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}