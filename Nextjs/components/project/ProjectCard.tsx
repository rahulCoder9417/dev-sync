import { Calendar, GitBranch, FolderArchive, Star } from 'lucide-react';
import Avatar from '@/components/main/Avatar';
import { Project, ProjectVisibility } from '@/lib/types/projects';

/* -------------------------------------------------------------------------- */
/*                                Utilities                                   */
/* -------------------------------------------------------------------------- */

function getVisibilityClass(type: ProjectVisibility): string {
  switch (type) {
    case 'PUBLIC':
      return 'bg-green-500';
    case 'PRIVATE':
      return 'bg-blue-500';
    case 'GENRATED':
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
}

function getFrameworkColor(framework: string): string {
  const COLORS: Record<string, string> = {
    React: 'var(--brand-primary)',
    Nextjs: '#000000',
    Js: '#f7df1e',
    Ts: '#3178c6',
  };

  return COLORS[framework] ?? 'var(--brand-primary)';
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const visibleCollaborators = project.collaborators.slice(0, 3);
  const remainingCount = project.collaborators.length - visibleCollaborators.length;

  return (
    <div
      className="p-6 rounded-xl border transition-all hover:shadow-lg cursor-pointer group"
      style={{ borderColor: 'var(--border-primary)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3
          className="text-lg font-semibold group-hover:text-blue-400 transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {project.title}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded-xl font-semibold ${getVisibilityClass(
            project.type
          )}`}
        >
          {project.type}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
        {project.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: getFrameworkColor(project.framework) }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>
            {project.framework}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Calendar className="w-3 text-primary h-3" />
          <span className="text-xs text-primary">{project.lastUpdated}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {visibleCollaborators.map((c, idx) => (
            <Avatar key={idx} fullName={c.fullName} username={c.username} avatar={c.avatar} getInfo={true} />
          ))}

          {remainingCount > 0 && (
            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
              +{remainingCount}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.isGitImport && <GitBranch className="w-5 text-blue-800 h-5" />}
          {project.isArchived && <FolderArchive className="w-5  text-green-800 h-5" />}
          {project.isStarred && <Star className="w-5  text-yellow-800 h-5" />}
        </div>
      </div>
    </div>
  );
}
