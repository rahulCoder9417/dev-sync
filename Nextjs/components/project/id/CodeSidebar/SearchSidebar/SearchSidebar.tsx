import React, { useCallback, useEffect, useState } from 'react'
import SearchHeader from './SearchHeader'
import SearchNodeTable from './SearchNodeTable'
import { useAppSelector } from '@/lib/redux/hooks'
import { SearchData } from './SearchNode'
import { FileNode, FileNodeWithChildren } from '@/lib/types/types'

const SearchSidebar = ({handleFileSelect}: {handleFileSelect: (file: FileNode) => void}) => {
  const [searchValue, setSearchValue] = useState<string>("")
  const [searchData, setSearchData] = useState<SearchData[]>([])
  let map: Record<string, FileNodeWithChildren>|undefined = useAppSelector((state) => state.projectFile.map)
  let fileRoot = useAppSelector((state)=>state.projectFile.fileRoot)
  let folderRoot = useAppSelector((state)=>state.projectFile.folderRoot)

  const fileSearch = (file:FileNodeWithChildren,searchVal:string,parentPath:string)=>{
    const contentToLower =file.content?.toLowerCase()
    if(!contentToLower || !contentToLower.includes(searchVal))return
    const lines = contentToLower.split("\n");
    const mastchedLines = lines?.filter(line =>
      line.includes(searchVal)
    );
    setSearchData((p: SearchData[]) => [...p, { fileName: file.name,parentId:file.parentId,id:file.id, path: parentPath + file.name,content:file.content, line: mastchedLines }])
  }

  const folderRecSearch = (file: FileNodeWithChildren, searchVal: string, parentPath: string) => {
       if(file.folderChildren.length>0){
        file.folderChildren.forEach((i)=>{
          let fileNode = map?.[i]
          if(!fileNode)return
          folderRecSearch(fileNode,searchVal,parentPath+file.name)
        })
       }
       file.fileChildren.forEach((i)=>{
        let fileNode = map?.[i]
        if(!fileNode)return
        fileSearch(fileNode,searchVal,parentPath+file.name)
       })
    }

  const searchFile = useCallback((fileRoot: FileNodeWithChildren[] | undefined,folderRoot:FileNodeWithChildren[] | undefined) => {
    if (searchValue === "") return
    let newS = searchValue.toLowerCase()
    fileRoot?.forEach((i)=>{
      fileSearch(i,newS,"")
    })
    folderRoot?.forEach(i => {
      folderRecSearch(i,newS,"")
    });
  },[searchValue])

  useEffect(() => {
    setSearchData([])
    searchFile(fileRoot,folderRoot)
  }, [searchValue])

  return (

    <div className="bg-secondary border-r  border-primary h-full flex flex-col">
      <SearchHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <SearchNodeTable handleFileSelect={handleFileSelect} searchData={searchData} searchValue={searchValue} />
    </div>
  )
}

export default SearchSidebar
