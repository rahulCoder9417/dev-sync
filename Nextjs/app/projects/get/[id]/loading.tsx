export default function Loading() {
    return (
      <div className="flex h-screen flex-col w-full gap-4 bg-[#1e1e2f] text-white overflow-hidden">
        {/* Top bar with tabs & collaborators */}
        <div className="h-12 bg-[#2b2b3d] flex items-center justify-between px-4 animate-pulse">
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 bg-[#3a3a4d] rounded w-20"></div>
              ))}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-8 bg-[#3a3a4d] rounded-full"></div>
              ))}
            </div>
          </div> 
        {/* Sidebar */}
        <div className="flex gap-2">
        <div className="w-64 bg-[#252536] p-4 flex flex-col gap-2 animate-pulse">
          <div className="h-6 bg-[#3a3a4d] rounded w-3/4"></div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-5 bg-[#3a3a4d]  px-3 rounded w-full"></div>
          ))}
        </div>
  
        {/* Main editor area */}
        <div className="flex-1 flex flex-col">
          
         
  
          {/* Editor */}
          <div className="flex-1 bg-[#1e1e2f] p-4 animate-pulse flex flex-col gap-2 overflow-auto">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={`h-4 bg-[#3a3a4d] px-1 rounded ${Math.random() > 0.5 ? "w-full" : "w-5/6"}`}></div>
            ))}
          </div>
        </div>
        </div>
      </div>
    );
  }
  