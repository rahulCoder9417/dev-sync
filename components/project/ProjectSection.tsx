"use client"
import React, { useEffect } from 'react'
import { useState } from "react";
import { FilterDropdown } from "@/components/project/FilterDropdown";
import { Project, ProjectCard } from "@/components/project/ProjectCard";
import Link from 'next/link';
import { getProjects } from '@/lib/actions/projects/getProject';
import { useSearchParams } from 'next/navigation';
type Props = {
  allProjects: Project[];
};

const ProjectSection = ({ allProjects }: Props) => {
    
  const searchParams = useSearchParams();

  const filterParam = searchParams.get("filter"); 
  
  useEffect(() => {
    if(filterParam) 
      {
        setshowFiltered(true)
        handleFilterChange(filterParam)

      };
  }, [filterParam, allProjects]);
    const [starred, setStarred] = useState<Project[] | null>(null)
    const [showFiltered, setshowFiltered] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState(allProjects);
    const uniqueFrameworks:string[] = [...new Set(allProjects.map(i => i.framework))];


    const handleFilterChange = async (filter: string) => {
        let filtered = [...allProjects];
      
        if (filter === "private") {
          filtered = allProjects.filter(p => p.type === "PRIVATE");
      
        } else if (filter === "public") {
          filtered = allProjects.filter(p => p.type === "PUBLIC");
      
        } else if (filter === "genrated") {
          filtered = allProjects.filter(p => p.type === "GENRATED");
      
        } else if (filter === "archieve") {
          filtered = allProjects.filter(p => p.isArchived === true);
      
        } else if (filter === "gitImport") {
          filtered = allProjects.filter(p => p.isGitImport === true);
        } else if (filter === "starred") {
          if (!starred) {
            filtered = await getProjects({ type: "starred" });
            setStarred(filtered);
          } else {
            filtered = starred;
          }
      
        } else if (uniqueFrameworks.includes(filter)) {
          filtered = allProjects.filter(p => p.framework === filter);
      
        } else {
          filtered = allProjects;
        }
      
        setFilteredProjects(filtered);
      };
      

    const displayProjects = showFiltered ? filteredProjects : allProjects;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {showFiltered ? 'Filtered Projects' : 'All Projects'}
                </h2>

                <div className="flex items-center gap-4">
                    {showFiltered && (
                        <FilterDropdown filter={filterParam} framework={uniqueFrameworks} onFilterChange={handleFilterChange} />
                    )}

                    <button
                        onClick={() => setshowFiltered(!showFiltered)}
                        className="text-sm font-medium hover:underline transition-colors"
                        style={{ color: 'var(--brand-primary)' }}
                    >
                        {!showFiltered ? 'Show filtered' : 'View All'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {displayProjects.map((project) => (

                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <ProjectCard project={project} />
                    </Link>
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
    )
}

export default ProjectSection