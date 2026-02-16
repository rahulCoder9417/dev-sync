import React from 'react'
import SearchNode, { SearchData } from './SearchNode'
import { FileNode } from '@/lib/types/types'

const SearchNodeTable = ({searchData,searchValue,handleFileSelect}:{searchData:SearchData[],searchValue:string,handleFileSelect: (file: FileNode) => void}) => {
  const totalFiles = searchData.length
  const totalLines = searchData.reduce((acc,i)=>(acc+=i.line.length),0)
  return (
    <div className='h-full w-full mt-3 flex flex-col gap-2 overflow-y-auto'>
     <p className='text-md mx-auto text-secondary'>{totalLines} Lines in {totalFiles} file</p>
     {
      searchData.map((i)=><SearchNode content={i.content} handleFileSelect={handleFileSelect} parentId={i.parentId} id={i.id} searchVal={searchValue} fileName={i.fileName} line={i.line} path={i.path}  key={i.path}/>)
     }
    </div>
  )
}

export default SearchNodeTable
