import React from 'react'
import SearchNode from './SearchNode'

const SearchNodeTable = () => {
  return (
    <div className='h-full w-full mt-3 flex flex-col gap-2'>
     <p className='text-md mx-auto text-secondary'>2 result in 2 file</p>
     <SearchNode/>
    </div>
  )
}

export default SearchNodeTable
