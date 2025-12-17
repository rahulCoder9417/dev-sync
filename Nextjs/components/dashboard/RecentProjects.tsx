import Link from 'next/link';
import { ProjectCard } from '../project/ProjectCard';
import { getProjects } from '@/lib/actions/projects/getProject';
import { Project } from '@/lib/types/projects';

export async function RecentProjects() {
  const projects: Project[] = await getProjects({
    limit: 3,
    type: 'recent',
  });

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`} prefetch>
          <ProjectCard project={project} />
        </Link>
      ))}
    </div>
  );
}
