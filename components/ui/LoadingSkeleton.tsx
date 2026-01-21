export default function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="bg-[#121212] border border-gray-800 p-6 rounded-2xl animate-pulse"
                >
                    {/* Image skeleton */}
                    <div className="w-full h-52 bg-gray-800 rounded-xl mb-4 animate-shimmer" />

                    {/* Title skeleton */}
                    <div className="h-6 bg-gray-800 rounded w-3/4 mb-3 animate-shimmer" />

                    {/* Price skeleton */}
                    <div className="h-4 bg-gray-800 rounded w-1/2 mb-4 animate-shimmer" />

                    {/* Button skeleton */}
                    <div className="h-10 bg-gray-800 rounded-lg animate-shimmer" />
                </div>
            ))}
        </div>
    );
}
