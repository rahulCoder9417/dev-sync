"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { ProjectCard } from '../project/ProjectCard'

const ProjectSectionProfile = ({user}: {user: any}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  
  // Calculate pagination
  const totalPages = Math.ceil(user.projects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = user.projects.slice(startIndex, endIndex)
  
  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of the page smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Generate visible page numbers for pagination
  const getVisiblePages = () => {
    const delta = 1 // Number of pages to show on each side of current page
    const pages = []
    
    // Always show first page
    pages.push(1)
    
    // Calculate range around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i)
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    
    // Remove duplicates and sort
    return [...new Set(pages)].sort((a, b) => a - b)
  }
  
  const visiblePages = getVisiblePages()
  
  return (
    <div className="space-y-6 pb-4">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {currentProjects.map((project: any) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
          >
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-8 px-2">
          {/* Previous Button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 rounded-md border hover:text-black text-primary border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          <div className="flex flex-wrap gap-2 justify-center">
            {visiblePages.map((page, index) => {
              // Add ellipsis if there's a gap
              const prevPage = visiblePages[index - 1]
              const showEllipsis = prevPage && page - prevPage > 1
              
              return (
                <React.Fragment key={page}>
                  {showEllipsis && (
                    <span className="px-2 py-2 text-muted hidden sm:inline">...</span>
                  )}
                  <button
                    onClick={() => goToPage(page)}
                    className={`min-w-[40px] px-3 sm:px-4 py-2 rounded-md hover:text-black text-primary transition-colors ${
                      currentPage === page  
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              )
            })}
          </div>
          
          {/* Next Button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-4 py-2 rounded-md border hover:text-black text-primary border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectSectionProfile