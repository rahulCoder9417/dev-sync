import { Input } from '@/components/ui/input'
import React from 'react'

const SearchHeader = ({searchValue,setSearchValue}:{searchValue:string,  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className='w-full '>
      <Input className='mx-auto w-[90%] h-8 mt-2 border-2 border-primary text-primary'
      value={searchValue}
      onChange={(e)=>setSearchValue(e.target.value)} 
      placeholder='Search'/>
    </div>
  )
}

export default SearchHeader
