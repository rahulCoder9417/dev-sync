
export default function Loading() {
  return (
    <div className="flex h-screen w-screen bg-[#1E1F26] text-white">
      {/* Sidebar */}
      <div className="w-72 bg-[#23242B] flex flex-col border-r border-gray-700">
        {/* Search */}
        <div className="p-3">
          <div className="h-10 bg-[#2B2C33] rounded-md animate-pulse" />
        </div>

        {/* Teams */}
        <div className="px-3 mt-4">
          <div className="h-4 w-16 bg-gray-600 rounded animate-pulse mb-3" />
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 mb-3 cursor-pointer"
              >
                <div className="h-10 w-10 rounded-full bg-[#2B2C33] animate-pulse" />
                <div>
                  <div className="h-3 w-20 bg-gray-600 rounded animate-pulse mb-1" />
                  <div className="h-2 w-10 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
        </div>

        {/* Direct Messages */}
        <div className="px-3 mt-8">
          <div className="h-4 w-28 bg-gray-600 rounded animate-pulse mb-3" />
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 mb-3 cursor-pointer"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-[#2B2C33] animate-pulse" />
                  <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="h-3 w-24 bg-gray-600 rounded animate-pulse" />
              </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 bg-[#2B2C33] border-b border-gray-700 flex items-center px-4">
          <div className="h-4 w-24 bg-gray-600 rounded animate-pulse" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-[#1E1F26] p-6 overflow-hidden">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="mb-5">
                <div className="h-3 w-24 bg-gray-600 rounded animate-pulse mb-2" />
                <div className="h-4 w-64 bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
        </div>

        {/* Input Area */}
        <div className="h-16 bg-[#2B2C33] border-t border-gray-700 flex items-center px-6">
          <div className="h-10 flex-1 bg-[#1E1F26] rounded-md animate-pulse" />
          <div className="ml-3 h-10 w-10 bg-[#1E1F26] rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
