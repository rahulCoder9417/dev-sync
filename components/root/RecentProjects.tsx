
import { Calendar, Users, GitBranch } from "lucide-react";

const projects = [
  {
    title: "E-commerce Platform",
    description: "Modern React-based e-commerce solution with real-time inventory",
    language: "TypeScript",
    framework: "React",
    lastUpdated: "530 days ago",
    collaborators: [
      { name: "Alex", avatar: "bg-blue-500" },
      { name: "Sarah", avatar: "bg-green-500" }, 
      { name: "Mike", avatar: "bg-purple-500" }
    ]
  },
  {
    title: "DevSync Mobile App", 
    description: "Cross-platform mobile app for DevSync collaboration",
    language: "TypeScript",
    framework: "React Native", 
    lastUpdated: "530 days ago",
    private: true,
    collaborators: [
      { name: "Alex", avatar: "bg-blue-500" },
      { name: "Emma", avatar: "bg-pink-500" }
    ]
  },
  {
    title: "AI Assistant Backend",
    description: "Microservices architecture for AI-powered code assistance", 
    language: "Python",
    framework: "FastAPI",
    lastUpdated: "532 days ago",
    collaborators: [
      { name: "David", avatar: "bg-orange-500" },
      { name: "Lisa", avatar: "bg-cyan-500" }
    ]
  }
];

export const RecentProjects = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Recent Projects
        </h2>
        <button className="text-sm font-medium hover:underline" style={{ color: 'var(--brand-primary)' }}>
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.title}
            className="p-6 rounded-xl border transition-all hover:shadow-lg hover:scale-105 cursor-pointer card-gradient"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {project.title}
              </h3>
              {project.private && (
                <span className="text-xs px-2 py-1 rounded text-gray-300 bg-gray-600">
                  Private
                </span>
              )}
            </div>
            
            <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
              {project.description}
            </p>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--brand-primary)' }}></div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{project.language}</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{project.framework}</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{project.lastUpdated}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.collaborators.map((collaborator, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full border-2 ${collaborator.avatar} flex items-center justify-center text-xs font-medium text-white`}
                    style={{ borderColor: 'var(--bg-card)' }}
                  >
                    {collaborator.name[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};