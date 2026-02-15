import React, { useState } from 'react'
import SearchHeader from './SearchHeader'
import SearchNodeTable from './SearchNodeTable'

const SearchSidebar = () => {
  const [searchValue, setSearchValue] = useState<string>("")
  return (

    <div className="bg-secondary border-r  border-primary h-full flex flex-col">
      <SearchHeader/>
      <SearchNodeTable/>
    </div>
  )
}

export default SearchSidebar
