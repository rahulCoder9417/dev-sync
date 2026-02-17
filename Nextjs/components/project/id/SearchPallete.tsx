import { Input } from "@/components/ui/input"
import { getFileIcon } from "@/lib/mainUtils/icons"
import { useAppSelector } from "@/lib/redux/hooks"
import React, { useEffect, useRef, useState } from "react"
import { highlightText, SearchData } from "./CodeSidebar/SearchSidebar/SearchNode"
import { FileNode } from "@/lib/types/types"
import { showToast } from "@/components/main/Toast"

type Props = {
  openSearchPalette: boolean
  setOpenSearchPalette: (value: boolean) => void
  handleFileSelect:(file:FileNode)=>void
}

const SearchPallete = ({
  openSearchPalette,
  handleFileSelect,
  setOpenSearchPalette,
}: Props) => {
  const paletteRef = useRef<HTMLDivElement | null>(null)
  const [searchVal, setSearchVal] = useState<string>("")
  const [searchData,setSearchData] = useState<Omit<SearchData, "line">[]>([])
  const files  = useAppSelector((state) => state.projectFile.files)
   const recursiveSearch = (file: FileNode, searchVal: string, parentPath: string) => {
      if (file.type === "folder" ) {
        file.children?.forEach(child => {
          recursiveSearch(child, searchVal, parentPath + file.name )
         
        })
      }
      if(file.type==="folder") return
      const pathToLower =(parentPath+file.name).toLowerCase()
      if(!pathToLower || !pathToLower.includes(searchVal))return
      setSearchData((p: Omit<SearchData, "line">[]) => [...p, { fileName: file.name,parentId:file.parentId,id:file.id, path: parentPath + file.name,content:file.content }])
    }
  
    const searchFile = (file: FileNode[]) => {
      if (searchVal === "") return
      for (const i of file) {
        recursiveSearch(i,searchVal.toLowerCase(),"")
      }
    }
  useEffect(() => {
    if (!openSearchPalette) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        paletteRef.current &&
        !paletteRef.current.contains(e.target as Node)
      ) {
        setOpenSearchPalette(false)
      }
    }

    window.addEventListener("click", handleClickOutside)

    return () => {
      window.removeEventListener("click", handleClickOutside)
      setSearchVal("")
    }
  }, [openSearchPalette, setOpenSearchPalette])
  useEffect(() => {
    if (searchVal==="")return
    setSearchData([])
    searchFile(files)
  }, [searchVal])
  if (!openSearchPalette) return null
  return (
    <div className="w-full h-full flex items-center justify-center bg-primary/30">
      <div
        ref={paletteRef}
        className="bg-primary  rounded-xl p-6 w-[50%] h-[60%] flex flex-col"
      >
        <Input 
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        
        className="border-primary bg-secondary "
        
        />
        <div className="flex gap-2 mt-4 flex-col w-full overflow-x-scroll overflow-y-scroll ">
            {searchData.map((item, index) => (
            <div
            onClick={()=>{
                handleFileSelect({
                    name:item.fileName,
                    content:item.content || "",
                    id:item.id,
                    parentId:item.parentId ?? null,
                    type:"file"
                })
                setOpenSearchPalette(false)
            }}
            key={item.id} className="flex w-full items-center hover:bg-secondary-foreground cursor-pointer rounded-lg p-1 space-x-2">
                  {getFileIcon(item.fileName)} 
                  <span className="text-lg">{item.fileName}</span>
                  <span className="text-muted text-sm">{highlightText(item.path,searchVal)}</span>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPallete
