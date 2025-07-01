"use client"
import { useState } from "react";
import { ArrowLeft, Users, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
//import { useToast } from "@/hooks/use-toast";

const CreateProject = () => {
  const navigate = useRouter();
//  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "",
    framework: "",
    visibility: "public",
    teamMembers: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (!formData.name || !formData.language) {
    //   toast({
    //     title: "Missing Information",
    //     description: "Please fill in the required fields.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // toast({
    //   title: "Project Created!",
    //   description: `${formData.name} has been created successfully.`,
    // });
    
    navigate.push("/projects");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full mx-auto px-6 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate.push("/projects")}
            className="mb-4 p-0 h-auto font-normal"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Create New Project
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Set up your new development project with all the details
          </p>
        </div>

        {/* Form */}
        <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }}>
              Project Details
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name" style={{ color: 'var(--text-primary)' }}>
                  Project Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter project name"
                  className="bg-transparent border-gray-600"
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" style={{ color: 'var(--text-primary)' }}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your project"
                  className="bg-transparent border-gray-600 resize-none"
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                  rows={3}
                />
              </div>

              {/* Main Language */}
              <div className="space-y-2">
                <Label htmlFor="language" style={{ color: 'var(--text-primary)' }}>
                  Main Language *
                </Label>
                <Select onValueChange={(value) => handleInputChange("language", value)}>
                  <SelectTrigger 
                    className="bg-transparent"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <SelectValue placeholder="Select main language" />
                  </SelectTrigger>
                  <SelectContent 
                    style={{ 
                      background: 'var(--bg-card)', 
                      borderColor: 'var(--border-primary)' 
                    }}
                  >
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Framework */}
              <div className="space-y-2">
                <Label htmlFor="framework" style={{ color: 'var(--text-primary)' }}>
                  Framework/Library
                </Label>
                <Select onValueChange={(value) => handleInputChange("framework", value)}>
                  <SelectTrigger 
                    className="bg-transparent"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent 
                    style={{ 
                      background: 'var(--bg-card)', 
                      borderColor: 'var(--border-primary)' 
                    }}
                  >
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                    <SelectItem value="express">Express.js</SelectItem>
                    <SelectItem value="django">Django</SelectItem>
                    <SelectItem value="flask">Flask</SelectItem>
                    <SelectItem value="laravel">Laravel</SelectItem>
                    <SelectItem value="spring">Spring Boot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label style={{ color: 'var(--text-primary)' }}>
                  Project Visibility
                </Label>
                <div className="space-y-3">
                  <div 
                    className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.visibility === "public" ? "border-blue-500" : ""
                    }`}
                    style={{ 
                      borderColor: formData.visibility === "public" ? 'var(--brand-primary)' : 'var(--border-primary)',
                      background: formData.visibility === "public" ? 'var(--bg-hover)' : 'transparent'
                    }}
                    onClick={() => handleInputChange("visibility", "public")}
                  >
                    <Globe className="w-5 h-5 mt-0.5" style={{ color: 'var(--brand-primary)' }} />
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Public
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Anyone can see this project
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.visibility === "private" ? "border-blue-500" : ""
                    }`}
                    style={{ 
                      borderColor: formData.visibility === "private" ? 'var(--brand-primary)' : 'var(--border-primary)',
                      background: formData.visibility === "private" ? 'var(--bg-hover)' : 'transparent'
                    }}
                    onClick={() => handleInputChange("visibility", "private")}
                  >
                    <Lock className="w-5 h-5 mt-0.5" style={{ color: 'var(--warning)' }} />
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Private
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Only you and invited collaborators can see this project
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members (only for public projects) */}
              {formData.visibility === "public" && (
                <div className="space-y-2">
                  <Label htmlFor="team" style={{ color: 'var(--text-primary)' }}>
                    <Users className="w-4 h-4 inline mr-2" />
                    Team Members (Optional)
                  </Label>
                  <Input
                    id="team"
                    value={formData.teamMembers}
                    onChange={(e) => handleInputChange("teamMembers", e.target.value)}
                    placeholder="Enter email addresses separated by commas"
                    className="bg-transparent border-gray-600"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Invite team members to collaborate on this project
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate.push("/projects")}
                  style={{ 
                    borderColor: 'var(--border-primary)', 
                    color: 'var(--text-primary)',
                    background: 'transparent'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary px-8"
                >
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProject;