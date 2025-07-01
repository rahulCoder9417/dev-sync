
import { Calendar, Users, GitBranch, MoreVertical, Settings, Trash2, UserPlus, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import CardOptions from "./CardOptions";

interface Collaborator {
  name: string;
  avatar: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  language: string;
  framework: string;
  lastUpdated: string;
  isPrivate: boolean;
  collaborators: Collaborator[];
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isPrivate, setIsPrivate] = useState(project.isPrivate);
 // const { toast } = useToast();



  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: 'var(--brand-primary)',
      JavaScript: '#f7df1e',
      Python: '#3776ab',
      PHP: '#777bb4',
    };
    return colors[language] || 'var(--brand-primary)';
  };

  return (
    <div
      className="p-6 rounded-xl border transition-all hover:shadow-lg cursor-pointer card-gradient group"
      style={{ borderColor: 'var(--border-primary)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors" 
            style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h3>
        
        <div className="flex items-center gap-2">
          {isPrivate && (
            <span className="text-xs px-2 py-1 rounded flex items-center gap-1" 
                  style={{ 
                    background: 'var(--bg-hover)', 
                    color: 'var(--text-secondary)' 
                  }}>
              <Lock className="w-3 h-3" />
              Private
            </span>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
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
              <CardOptions action="rename" icon={Settings} name="Reaname"  />
              <CardOptions action="manage-team" icon={UserPlus} name="Manage team"  />
              <CardOptions action="delete" icon={Trash2} name="Delete Project"  />
             
              
              <DropdownMenuSeparator style={{ backgroundColor: 'var(--border-primary)' }} />

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
        {project.description}
      </p>

      <div className="flex items-center space-x-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ background: getLanguageColor(project.language) }}
          ></div>
          <span style={{ color: 'var(--text-secondary)' }}>{project.language}</span>
        </div>
        
        <span style={{ color: 'var(--text-secondary)' }}>{project.framework}</span>
        
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {project.lastUpdated}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.collaborators.map((collaborator, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-full border-2 ${collaborator.avatar} flex items-center justify-center text-xs font-medium text-white hover:z-10 transition-all hover:scale-110`}
              style={{ borderColor: 'var(--bg-card)' }}
              title={collaborator.name}
            >
              {collaborator.name[0]}
            </div>
          ))}
          {project.collaborators.length > 3 && (
            <div
              className="w-6 h-6 rounded-full border-2 bg-gray-600 flex items-center justify-center text-xs font-medium text-white"
              style={{ borderColor: 'var(--bg-card)' }}
            >
              +{project.collaborators.length - 3}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
      </div>
    </div>
  );
};