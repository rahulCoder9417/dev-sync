
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

interface FilterDropdownProps {
  onFilterChange: (filter: string) => void;
}

export const FilterDropdown = ({ onFilterChange }: FilterDropdownProps) => {
  const [activeFilter, setActiveFilter] = useState("all");

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
        
        <DropdownMenuItem onClick={() => handleFilterSelect("recent", "Recent")}>
          Recent Projects
        </DropdownMenuItem>
        
        <DropdownMenuSeparator style={{ backgroundColor: 'var(--border-primary)' }} />
        
        <DropdownMenuItem onClick={() => handleFilterSelect("public", "Public")}>
          Public Projects
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleFilterSelect("private", "Private")}>
          Private Projects
        </DropdownMenuItem>
        
        <DropdownMenuSeparator style={{ backgroundColor: 'var(--border-primary)' }} />
        
        <DropdownMenuItem onClick={() => handleFilterSelect("typescript", "TypeScript")}>
          TypeScript
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleFilterSelect("javascript", "JavaScript")}>
          JavaScript
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleFilterSelect("python", "Python")}>
          Python
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};