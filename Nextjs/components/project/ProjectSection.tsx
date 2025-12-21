"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { FilterDropdown } from "@/components/project/FilterDropdown";
import { ProjectCard } from "@/components/project/ProjectCard";
import Link from 'next/link';
import { getProjects } from '@/lib/actions/projects/getProject';
import { useSearchParams } from 'next/navigation';
import { Project } from '@/lib/types/projects';

const ITEMS_PER_PAGE = 12;

const ProjectSection = () => {
    const [allProjects, setAllProject] = useState<Project[]>([])
    const [starred, setStarred] = useState<Project[] | null>(null)
    const [message, setMessage] = useState("Getting projects")
    const [showFiltered, setshowFiltered] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const searchParams = useSearchParams();
    const filterParam = searchParams.get("filter");

    useEffect(() => {
        const fetchProjects = async () => {
            const projects = await getProjects({ type: "recent" });
            setAllProject(projects);
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        if (filterParam) {
            setshowFiltered(true)
            handleFilterChange(filterParam)
        }
    }, [filterParam, allProjects]);

    const uniqueFrameworks: string[] = useMemo(() => 
        [...new Set(allProjects.map(i => i.framework))], 
        [allProjects]
    );

    const handleFilterChange = async (filter: string) => {
        let filtered = [...allProjects];

        if (filter === "private") {
            filtered = allProjects.filter(p => p.type === "PRIVATE");
        } else if (filter === "public") {
            filtered = allProjects.filter(p => p.type === "PUBLIC");
        } else if (filter === "genrated") {
            filtered = allProjects.filter(p => p.type === "GENRATED");
        } else if (filter === "none") {
            filtered = [];
        } else if (filter === "archieve") {
            filtered = allProjects.filter(p => p.isArchived === true);
        } else if (filter === "gitImport") {
            filtered = allProjects.filter(p => p.isGitImport === true);
        } else if (filter === "starred") {
            setMessage("Getting Starred Projects")
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

        filtered.length === 0 && setMessage("No Projects Found")
        setFilteredProjects(filtered);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Search and filter logic
    const searchedAndFilteredProjects = useMemo(() => {
        const baseProjects = showFiltered ? filteredProjects : allProjects;
        
        if (!searchQuery.trim()) {
            return baseProjects;
        }

        const query = searchQuery.toLowerCase();
        return baseProjects.filter(project => 
            project.title?.toLowerCase().includes(query) ||
            project.description?.toLowerCase().includes(query) ||
            project.framework?.toLowerCase().includes(query)
        );
    }, [showFiltered, filteredProjects, allProjects, searchQuery]);

    // Pagination logic
    const totalPages = Math.ceil(searchedAndFilteredProjects.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayProjects = searchedAndFilteredProjects.slice(startIndex, endIndex);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getPaginationRange = () => {
        const range: (number | string)[] = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) range.push(i);
                range.push('...');
                range.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                range.push(1);
                range.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) range.push(i);
            } else {
                range.push(1);
                range.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) range.push(i);
                range.push('...');
                range.push(totalPages);
            }
        }

        return range;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {showFiltered ? 'Filtered Projects' : 'All Projects'}
                </h2>

                <div className="flex items-center gap-4">
                    {showFiltered && (
                        <FilterDropdown 
                            filter={filterParam} 
                            framework={uniqueFrameworks} 
                            onFilterChange={handleFilterChange} 
                        />
                    )}

                    <button
                        onClick={() => {
                            setshowFiltered(!showFiltered);
                            !showFiltered && setFilteredProjects(allProjects);
                            setCurrentPage(1);
                        }}
                        className="text-sm font-medium hover:underline transition-colors"
                        style={{ color: 'var(--brand-primary)' }}
                    >
                        {!showFiltered ? 'Show filtered' : 'View All'}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search projects by name, description, or framework..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 rounded-lg border transition-colors"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)'
                    }}
                />
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {displayProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <ProjectCard project={project} />
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {searchedAndFilteredProjects.length === 0 && (
                <div className="text-center py-12">
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {searchQuery ? `No projects found matching "${searchQuery}"` : message}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {searchedAndFilteredProjects.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Previous
                    </button>

                    {getPaginationRange().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className="px-3 py-2 rounded-md transition-colors"
                                style={{
                                    backgroundColor: currentPage === page ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                                    color: currentPage === page ? 'white' : 'var(--text-primary)'
                                }}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Results Counter */}
            {searchedAndFilteredProjects.length > 0 && (
                <div className="text-center mt-4">
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Showing {startIndex + 1}-{Math.min(endIndex, searchedAndFilteredProjects.length)} of {searchedAndFilteredProjects.length} projects
                    </p>
                </div>
            )}
        </div>
    )
}

export default React.memo(ProjectSection)