
import { Calendar,  GitBranch,FolderArchive, Star } from "lucide-react";
import  Avatar  from "@/components/main/Avatar";

interface Collaborator {
  fullName: string;
  avatar?: string |null;
}

export interface Project {
  id: string;
  title: string;
  description: string |null;
  framework: string;
  lastUpdated: string;
  type: "PUBLIC" | "PRIVATE" |"GENRATED";
  isStared?: boolean;
  isGitImport?: boolean;
  isArchived?: boolean;
  collaborators: Collaborator[];
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
 // const { toast } = useToast();

  const getClass = (type:"PUBLIC" | "PRIVATE" |"GENRATED")=>{
    switch (type) {
      case "PUBLIC":
        return "bg-green-500"
    
      case "PRIVATE":
        return "bg-blue-500";
    
      case "GENRATED":
        return "bg-red-400";
    
      default:
        break;
    }
  }

  const getFrameworkColor = (language: string) => {
    const colors: Record<string, string> = {
      React: 'var(--brand-primary)',
      Nextjs: '#f7df1e',
      Js: '#3776ab',
      Ts: '#777bb4',
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
        
            <span className={`text-xs px-2 py-1 rounded-xl border-2 border-slate-900 font-semibold flex items-center gap-1 ${getClass(project.type)} `}
                  >
              {project.type}
            </span>

        </div>
      </div>
      
      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
        {project.description}
      </p>

      <div className="flex items-center space-x-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ background: getFrameworkColor(project.framework) }}
          ></div>
        <span style={{ color: 'var(--text-secondary)' }}>{project.framework}</span>
        </div>
        
        
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
            <Avatar fullName={collaborator.fullName} key={index} avatar={collaborator.avatar} />
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
        
        <div className="flex items-center space-x-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          {project.isGitImport && <GitBranch className="w-6 h-6 text-blue-700" />}
          {project.isGitImport && <FolderArchive className="w-6 h-6 text-green-700"/>}
          {project.isGitImport && <Star className="w-6 h-6 text-yellow-700"/>}
        </div>
      </div>
    </div>
  );
};