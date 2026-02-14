import { OneOrNone } from '@/lib/types/types'
import { Box, BoxesIcon, Bug, File, GitBranch, Search } from 'lucide-react'
import React, { useCallback } from 'react'


type Params = {
    sideBarOptions: OneOrNone<{
        "explorer":boolean,
        "search":boolean,
        "git":boolean,
        "debug":boolean,
        "extension":boolean
    }>,
    setSideBarOptions: React.Dispatch<React.SetStateAction<OneOrNone<{
        "explorer":boolean,
        "search":boolean,
        "git":boolean,
        "debug":boolean,
        "extension":boolean
    }>>>
}
type SidebarKey =
  | "explorer"
  | "search"
  | "git"
  | "debug"
  | "extension";

const CodeSidebar = ({sideBarOptions,setSideBarOptions}: Params) => {
    const options: {
  label: string;
  value: SidebarKey;
  icon: React.ElementType;
}[] = [
  { label: 'Explorer', value: 'explorer', icon: File },
  { label: 'Search', value: 'search', icon: Search },
  { label: 'Git', value: 'git', icon: GitBranch },
  { label: 'Debug', value: 'debug', icon: Bug },
  { label: 'Extensions', value: 'extension', icon: BoxesIcon },
];
const handleClick = useCallback(
    (key: SidebarKey)=>{
  setSideBarOptions((prev) => {
    const isActive = prev[key];

    return {
      explorer: false,
      search: false,
      git: false,
      debug: false,
      extension: false,
      ...(isActive ? {} : { [key]: true }),
    } as Params['sideBarOptions'];
  });
    },
    [setSideBarOptions]
)

  return (
    <div className="bg-secondary border-r-2 border-primary h-full flex gap-6  flex-col">
      {options.map((option) => (
        <div
        onClick={()=>handleClick(option.value)}
        className={` mt-4 ${sideBarOptions[option.value] ? 'bg-primary w-full py-3 rounded-lg  ' : ''}`} key={option.value}>
              <option.icon className={`size-5 text-secondary mx-auto  hover:text-white cursor-pointer ${sideBarOptions?.[option.value] ? 'text-white!' : ''}`} />
        </div>
      ))}
    </div>
  )
}

export default CodeSidebar
