import React from 'react'
import SearchNode, { SearchData } from './SearchNode'

const SearchNodeTable = ({searchData,searchValue}:{searchData:SearchData[],searchValue:string}) => {
  const totalFiles = searchData.length
  const totalLines = searchData.reduce((acc,i)=>(acc+=i.line.length),0)
  return (
    <div className='h-full w-full mt-3 flex flex-col gap-2'>
     <p className='text-md mx-auto text-secondary'>{totalLines} Lines in {totalFiles} file</p>
     {
      searchData.map((i)=><SearchNode searchVal={searchValue} fileName={i.fileName} line={i.line} path={i.path}  key={i.path}/>)
     }
    </div>
  )
}

export default SearchNodeTable
