import { getFileIcon } from '@/lib/mainUtils/icons'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
export interface SearchData{
  fileName:string;
  path:string;
  line:string[];
  searchVal?:string
}
const SearchNode = ({fileName,path,line,searchVal}:SearchData) => {
  const [showFiles, setshowFiles] = useState<boolean>(true)
  const highlightText = (text: string) => {
    let highlight = searchVal!.toLowerCase()
    if (!highlight || !text) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-blue-300 text-black font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  const clickFile= ()=>{
    //pass
  }
  return (
    <div onClick={()=>clickFile()} className='flex flex-col px-2 py-1  cursor-pointer text-sm group'>
      <div className='flex relative hover:bg-primary rounded-md items-center space-x-2 group/item flex-1 min-w-0'>
        <button onClick={(e)=>{e.stopPropagation(); setshowFiles(!showFiles)}}>
          <ChevronDown className={`w-4 h-4 ${showFiles ? 'rotate-0' : '-rotate-90'}`} />
        </button>
        <span className='shrink-0'>{getFileIcon("a.tsx")}</span>
        <span className='truncate'>{fileName}  {path}</span>
        <span className="w-6 h-6 flex items-center justify-center text-xs bg-blue-300 rounded-full text-black">{line.length}</span>
        <div className="absolute top-5 left-[50%] ml-2 hidden group-hover/item:block bg-black z-10 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {path}
        </div>
      </div>
      <div className={`flex ${showFiles ? "":"hidden"} `}>
        <div className='w-2 shrink-0' />
        <div className='border-l-2 border-secondary '>
          {line.map((item, index) => (
            <div key={index}>
              <div className="relative py-1 group/item inline-block">
                <span className='ml-4 truncate hover:bg-primary w-full'>
                  {highlightText(item)}
                </span>

                <div className="absolute left-[50%] ml-2 hidden group-hover/item:block bg-black z-10 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {item}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchNode
