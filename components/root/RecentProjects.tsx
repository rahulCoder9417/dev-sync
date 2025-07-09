
import { ProjectCard } from "../project/ProjectCard";
import { getProjects } from '@/lib/actions/projects/getProject';



export const RecentProjects = async() => {

  const op = await getProjects({limit:3,type:"recent"})
  if(op.length ===0)return
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Recent Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {op.map((project,index) => (
          <ProjectCard key={index} project={project} /> 
        ))}
      </div>
    </div>
  );
};