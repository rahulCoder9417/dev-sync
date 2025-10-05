export default function Loading() {
    return (
      <div className="bg-primary min-h-screen w-full text-primary p-6 flex flex-col items-center justify-center gap-6">
        {/* Page Header Placeholder */}
        <div className="bg-card rounded-lg w-full max-w-6xl h-32 animate-pulse border border-primary"></div>
  
        {/* Action Buttons Placeholder */}
        <div className="flex gap-3 w-full max-w-6xl justify-start">
          <div className="bg-secondary rounded-md h-10 w-32 animate-pulse"></div>
          <div className="bg-secondary rounded-md h-10 w-32 animate-pulse"></div>
          <div className="bg-secondary rounded-md h-10 w-32 animate-pulse"></div>
        </div>
  
        {/* Project Details Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-card h-20 rounded-md animate-pulse border border-primary"
            ></div>
          ))}
        </div>
  
        {/* Team Section Placeholder */}
        <div className="bg-card rounded-lg w-full max-w-6xl p-6 border border-primary animate-pulse">
          <div className="h-8 bg-secondary rounded-md w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 bg-secondary rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>
  
        {/* Footer or extra placeholders */}
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-secondary rounded-md animate-pulse"></div>
          <div className="h-10 w-32 bg-secondary rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }
  