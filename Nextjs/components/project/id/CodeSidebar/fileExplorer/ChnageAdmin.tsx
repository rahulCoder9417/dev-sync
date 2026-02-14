import React from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { shallowEqual } from 'react-redux'
import { changeAdmin } from '@/lib/redux/features/collabCodeUserState';
const ChnageAdmin = ({ projectId, fileId, setAdminMenu,setAction,sendMessage }: any) => {
  const users = useAppSelector((state) => state.collabCodeUser.projects[projectId][fileId], shallowEqual)
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return parts[0][0]?.toUpperCase() + parts[1][0]?.toUpperCase();
  };

  const dispatch = useAppDispatch()
  const handleAdminChange = (userId: string) => {
    dispatch(changeAdmin({ projectId, fileId, userId }))
    sendMessage("changeAdmin",projectId,fileId,{userId})
    setAction(null)
    setAdminMenu(false)
  }
  return (
    <div className='flex items-center gap-2 bg-indigo-700 border-primary/15 border-[1px] rounded-full p-2 cursor-pointer'  >
      {users?.filter((user: any) => user.userId !== users?.[0].userId)?.map ((user: any) => (
        <span key={user.userId}>
          {user.avatar ? (
            <div
              className="w-6 h-6 rounded-full border-2 flex bg-cover bg-center items-center justify-center text-xs font-medium text-white hover:z-10 transition-all hover:scale-110"
              style={{ backgroundImage: `url(${user.avatar})` }}
              onClick={() => handleAdminChange(user.userId)}
            />
          ) : (
            <div
              className="w-6 h-6 rounded-full border-2 border-[#171616] flex items-center justify-center text-xs font-medium bg-gradient-to-r from-blue-400 to-purple-500 text-primary hover:z-10 transition-all hover:scale-110"
              onClick={() => handleAdminChange(user.userId)}
            >
              {getInitials(user.fullName)}
            </div>
          )}
        </span>
      )
      )}
    </div>
  )
}

export default ChnageAdmin
