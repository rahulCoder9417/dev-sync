
import Link from "next/link";
import { ProjectCard } from "../project/ProjectCard";
import { getProjects } from '@/lib/actions/projects/getProject';



export const RecentProjects = async() => {

  const op = await getProjects({limit:3,type:"recent"})
  if(op.length ===0)return
  return (
    
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* @ts-ignore */}
        {op.map((project,index) => (
          
          <Link  key={index} href={`/projects/${project.id}`} prefetch={true}>
          <ProjectCard project={project} /> 
          </Link>
        ))}
      </div>
  );
};