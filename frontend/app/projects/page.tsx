
import { Github, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import LaptopNotify from "@/components/main/AvatarNotify";
import Link from "next/link";
import ProjectSection from "@/components/project/ProjectSection";
import { getProjects } from "@/lib/actions/projects/getProject";
import { Project } from "@/components/project/ProjectCard";


const Index = async() => {
  let allProject :Project[] = await getProjects({type:"recent"})
  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--bg-primary)' }}>
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <span>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Your Projects
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Manage and organize your development projects
          </p>
          </span>
          <LaptopNotify/>
        </div>

        {/* Create Project Section */}
        <div className="mb-12">
          <div 
            className="rounded-xl border p-8 text-center card-gradient"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Start a New Project
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Create a new project from scratch or import from Git
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant={"default"}
                className="flex items-center gap-2 border-1 border-primary rounded-lg cursor-pointer px-6 py-3"
              >
                <FolderPlus className="w-5 h-5" />
                
                <Link href={"/projects/create"}>
                Create New Project
                </Link>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center gap-2 px-6 py-3"
                style={{ 
                  borderColor: 'var(--border-primary)', 
                  color: 'var(--text-primary)',
                  background: 'transparent'
                }}
              >
                <Github className="w-5 h-5" />
                <Link href={"/projects/create/git"}>
                Import from Git
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <ProjectSection allProjects={[...allProject]} />

      </div>
    </div>
  );
};

export default Index;