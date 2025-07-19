
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { capitalize } from "@/lib/mainUtils/capitals";

interface FilterDropdownProps {
  onFilterChange: (filter: string) => void;
  framework:string[];
  filter?:string | null
}

export const FilterDropdown = ({ onFilterChange ,framework,filter}: FilterDropdownProps) => {
  const [activeFilter, setActiveFilter] = useState(filter || "all");

  const handleFilterSelect = (filter: string, label: string) => {
    setActiveFilter(label);
    onFilterChange(filter);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          style={{ 
            borderColor: 'var(--border-primary)', 
            color: 'var(--text-primary)',
            background: 'var(--bg-card)'
          }}
        >
          <Filter className="w-4 h-4" />
          Filter: {activeFilter}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48"
        style={{ 
          background: 'var(--bg-card)', 
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)'
        }}
      >
        <DropdownMenuItem onClick={() => handleFilterSelect("all", "All Projects")}>
          All Projects
        </DropdownMenuItem>
        <DropdownMenuSeparator style={{ backgroundColor: 'var(--border-primary)' }} />
        
        <DropdownMenuItem onClick={() => handleFilterSelect("archieve", "Archieved")}>
          Archieved Projects
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilterSelect("starred", "Starred")}>
          Starred Projects
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleFilterSelect("gitImport", "GitImported")}>
          GitImported Projects
        </DropdownMenuItem>
        <DropdownMenuSeparator style={{ backgroundColor: 'var(--border-primary)' }} />
        
        <DropdownMenuItem onClick={() => handleFilterSelect("public", "Public")}>
          Public Projects
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleFilterSelect("private", "Private")}>
          Private Projects
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleFilterSelect("genrated", "Generated")}>
          Generated Projects
        </DropdownMenuItem>
        
        <DropdownMenuSeparator style={{ backgroundColor: 'var(--border-primary)' }} />
        
        {
          framework.map((i,index)=>(
            <DropdownMenuItem key={index} onClick={() => handleFilterSelect(i,  capitalize(i))}>
            {capitalize(i)}
          </DropdownMenuItem>
          ))
        }

      </DropdownMenuContent>
    </DropdownMenu>
  );
};