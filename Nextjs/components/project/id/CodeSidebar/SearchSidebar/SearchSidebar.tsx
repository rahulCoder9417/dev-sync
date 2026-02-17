import React, { useEffect, useState } from 'react'
import SearchHeader from './SearchHeader'
import SearchNodeTable from './SearchNodeTable'
import { useAppSelector } from '@/lib/redux/hooks'
import { SearchData } from './SearchNode'
import { FileNode } from '@/lib/types/types'

const SearchSidebar = ({handleFileSelect}: {handleFileSelect: (file: FileNode) => void}) => {
  const [searchValue, setSearchValue] = useState<string>("")
  const [searchData, setSearchData] = useState<SearchData[]>([])
  let files: FileNode[] = useAppSelector((state) => state.projectFile.files)

  const recursiveSearch = (file: FileNode, searchVal: string, parentPath: string) => {
    if (file.type === "folder" ) {
      file.children?.forEach(child => {
        recursiveSearch(child, searchVal, parentPath + file.name )
      })
    }
    
    if(file.type==="folder") return
    const contentToLower =file.content?.toLowerCase()
    if(!contentToLower || !contentToLower.includes(searchVal))return
    const lines = contentToLower.split("\n");
    const mastchedLines = lines?.filter(line =>
      line.includes(searchVal)
    );
    setSearchData((p: SearchData[]) => [...p, { fileName: file.name,parentId:file.parentId,id:file.id, path: parentPath + file.name,content:file.content, line: mastchedLines }])
  }

  const searchFile = (file: FileNode[]) => {
    if (searchValue === "") return
    for (const i of file) {
      recursiveSearch(i,searchValue.toLowerCase(),"")
    }
  }

  useEffect(() => {
    setSearchData([])
    searchFile(files)
   
  }, [searchValue])

  return (

    <div className="bg-secondary border-r  border-primary h-full flex flex-col">
      <SearchHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <SearchNodeTable handleFileSelect={handleFileSelect} searchData={searchData} searchValue={searchValue} />
    </div>
  )
}

export default SearchSidebar
