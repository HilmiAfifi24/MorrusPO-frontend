interface StorefrontLoaderProps {
  variant?: "fullscreen" | "skeleton-grid" | "skeleton-list";
  count?: number;
}

export function StorefrontLoader({
  variant = "fullscreen",
  count = 4,
}: StorefrontLoaderProps) {
  if (variant === "fullscreen") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white font-outfit">
        <div className="flex flex-col items-center space-y-4">
          {/* Custom Brand Spinner */}
          <div className="relative flex h-16 w-16">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-storefront-primary-400 opacity-20"></span>
            <div className="relative m-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-storefront-primary-500"></div>
          </div>
          
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
              Morrus Store
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Menyiapkan menu terlezat untuk Anda...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "skeleton-grid") {
    return (
      <div className="grid grid-cols-2 gap-4 p-4 font-outfit">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-3xl border border-gray-100 bg-white p-3 shadow-storefront-card"
          >
            {/* Image Placeholder */}
            <div className="aspect-square w-full rounded-2xl bg-gray-100"></div>
            
            {/* Content Placeholders */}
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 rounded-md bg-gray-100"></div>
              <div className="h-3 w-1/2 rounded-md bg-gray-100"></div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 w-1/3 rounded-md bg-gray-100"></div>
                <div className="h-8 w-8 rounded-full bg-gray-100"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // default to skeleton-list
  return (
    <div className="space-y-4 p-4 font-outfit">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center space-x-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-storefront-card"
        >
          {/* Thumb Placeholder */}
          <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-gray-100"></div>
          
          {/* Detail Placeholders */}
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-2/3 rounded-md bg-gray-100"></div>
            <div className="h-3 w-1/2 rounded-md bg-gray-100"></div>
            <div className="h-4 w-1/4 rounded-md bg-gray-100 mt-2"></div>
          </div>
          
          {/* CTA Placeholder */}
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
        </div>
      ))}
    </div>
  );
}

export default StorefrontLoader;
