"use client"
import { useState } from "react";
import { Calendar, Users, GitBranch, Plus, Github, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterDropdown } from "@/components/project/FilterDropdown";
import { ProjectCard } from "@/components/project/ProjectCard";
import LaptopNotify from "@/components/main/AvatarNotify";
import Link from "next/link";

const recentProjects = [
  {
    id: '1',
    title: "E-commerce Platform",
    description: "Modern React-based e-commerce solution with real-time inventory",
    language: "TypeScript",
    framework: "React",
    lastUpdated: "2 days ago",
    isPrivate: false,
    collaborators: [
      { fullName: "Alex", avatar: "bg-blue-500" },
      { fullName: "Sarah", avatar: "bg-green-500" }, 
      { fullName: "Mike", avatar: "bg-purple-500" }
    ]
  },
  {
    id: '2',
    title: "DevSync Mobile App", 
    description: "Cross-platform mobile app for DevSync collaboration",
    language: "TypeScript",
    framework: "React Native", 
    lastUpdated: "5 days ago",
    isPrivate: true,
    collaborators: [
      { fullName: "Alex", avatar: "bg-blue-500" },
      { fullName: "Emma", avatar: "bg-pink-500" }
    ]
  },
  {
    id: '3',
    title: "AI Assistant Backend",
    description: "Microservices architecture for AI-powered code assistance", 
    language: "Python",
    framework: "FastAPI",
    lastUpdated: "1 week ago",
    isPrivate: false,
    collaborators: [
      { fullName: "David", avatar: "bg-orange-500" },
      { fullName: "Lisa", avatar: "bg-cyan-500" }
    ]
  },
  {
    id: '4',
    title: "Portfolio Website",
    description: "Personal portfolio built with Next.js and Tailwind CSS",
    language: "JavaScript",
    framework: "Next.js",
    lastUpdated: "3 days ago",
    isPrivate: false,
    collaborators: [
      { fullName: "John", avatar: "bg-red-500" }
    ]
  }
];

const allProjects = [
  ...recentProjects,
  {
    id: '5',
    title: "Blog CMS",
    description: "Content management system for blogs",
    language: "PHP",
    framework: "Laravel",
    lastUpdated: "2 weeks ago",
    isPrivate: true,
    collaborators: [
      { fullName: "Kate", avatar: "bg-yellow-500" },
      { fullName: "Tom", avatar: "bg-indigo-500" }
    ]
  },
  {
    id: '6',
    title: "Weather App",
    description: "Real-time weather application",
    language: "JavaScript",
    framework: "Vue.js",
    lastUpdated: "1 month ago",
    isPrivate: false,
    collaborators: [
      { fullName: "Amy", avatar: "bg-pink-500" }
    ]
  }
];

const Index = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  const handleFilterChange = (filter: string) => {
    let filtered = [...allProjects];
    
    switch (filter) {
      case "private":
        filtered = allProjects.filter(p => p.isPrivate);
        break;
      case "public":
        filtered = allProjects.filter(p => !p.isPrivate);
        break;
      case "recent":
        filtered = allProjects.slice(0, 4);
        break;
      case "typescript":
        filtered = allProjects.filter(p => p.language === "TypeScript");
        break;
      case "javascript":
        filtered = allProjects.filter(p => p.language === "JavaScript");
        break;
      case "python":
        filtered = allProjects.filter(p => p.language === "Python");
        break;
      default:
        filtered = allProjects;
    }
    
    setFilteredProjects(filtered);
  };

  const displayProjects = showAllProjects ? filteredProjects : recentProjects;

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
                variant={"secondary"}
                className="flex items-center gap-2 cursor-pointer px-6 py-3"
              >
                <FolderPlus className="w-5 h-5" />
                
                <Link href={"/import-project"}>
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
                <Link href={"/import-project"}>
                Import from Git
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {showAllProjects ? 'All Projects' : 'Recent Projects'}
            </h2>
            
            <div className="flex items-center gap-4">
              {showAllProjects && (
                <FilterDropdown onFilterChange={handleFilterChange} />
              )}
              
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: 'var(--brand-primary)' }}
              >
                {showAllProjects ? 'Show Recent' : 'View All'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={{...project,type:"PUBLIC"}} />
            ))}
          </div>

          {displayProjects.length === 0 && (
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>
                No projects found matching your filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;