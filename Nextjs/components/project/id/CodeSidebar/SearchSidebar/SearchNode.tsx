import { getFileIcon } from '@/lib/mainUtils/icons'
import React from 'react'

const SearchNode = () => {
  return (
    <div className='flex items-center justify-between px-2 py-1 hover:bg-primary cursor-pointer text-sm group'>
      <div className='flex items-center space-x-2 flex-1 min-w-0'>
        <div className='w-4 flex-shrink-0'/>
        <span className='flex-shrink-0'>{getFileIcon("nmae")}</span>
      </div>
    </div>
  )
}

export default SearchNode
