import React from 'react'

const FriendshipStatus = ({acceptedCount, pendingCount}: {acceptedCount: number, pendingCount: number}) => {
  return (
    <div className="mb-8 p-6 rounded-xl border bg-[#413e4b]  border-primary">
              <h2 className="text-lg font-semibold mb-4 text-primary"  >
                Friendship Status
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-hover">
                  <div className="text-3xl font-bold text-[#4759f5]">
                    {acceptedCount}
                  </div>
                  <div className="text-sm text-muted">
                    Accepted Friends
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-hover">
                  <div className="text-3xl font-bold text-yellow-500">
                    {pendingCount}
                  </div>
                  <div className="text-sm text-muted">
                    Pending Requests
                  </div>
                </div>
              </div>
            </div>
  )
}

export default FriendshipStatus
