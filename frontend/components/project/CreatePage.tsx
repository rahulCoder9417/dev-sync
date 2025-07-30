"use client"
import { useEffect, useState } from "react";
import { ArrowLeft, Users, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/main/Toast";
import Avatar from "@/components/main/Avatar";
import { FriendsGet } from "@/types";
import { CreateProjectInput } from "@/lib/actions/projects/makeProject";
interface props{
  friends : FriendsGet | []
  action:(data: CreateProjectInput) => Promise<any>
}
const CreateProject = ({friends,action}:props) => {
  const navigate = useRouter();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    packages: "",
    type: "PUBLIC",
    members: [{}]
  });

  
  const toggleFriendSelection = (id: string) => {
    setSelectedFriends(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };


  const handleSubmit = async(e: React.FormEvent) => {

    e.preventDefault();
    
    setIsSubmitting(true)
    if (formData.name.length===0 || formData.packages.length===0) {
      showToast(false,"Missing Info","Give more Details,mention name and language",);
      setIsSubmitting(false)
      return;
    }
    
const members = selectedFriends.map(id => ({ userId: id }));
const finalData = {
  ...formData,
  members,
};
    try {
      const res = await action(finalData as CreateProjectInput);
      showToast(true, "Project Created!", `${formData.name} created successfully.`);
      navigate.push(`/projects/${res.projectId}`);
    } catch (err) {
      showToast(false, "Error", "Failed to create project."+ String(err));
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
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
                <Select onValueChange={(value) => handleInputChange("packages", value)}>
                  <SelectTrigger 
                    className="bg-transparent cursor-pointer"
                    style={{ 
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <SelectValue placeholder="Select main language" />
                  </SelectTrigger>
                  <SelectContent className=" bg-secondary text-primary cursor-pointer border-primary" 
                  
                  >
                    <SelectItem value="Ts">TypeScript</SelectItem>
                    <SelectItem value="Js">JavaScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="C#">C#</SelectItem>
                    <SelectItem value="PHP">PHP</SelectItem>
                    <SelectItem value="Go">Go</SelectItem>
                    <SelectItem value="Rust">Rust</SelectItem>
                    
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="Vue">Vue.js</SelectItem>
                    <SelectItem value="Angular">Angular</SelectItem>
                    <SelectItem value="Nextjs">Next.js</SelectItem>
                    <SelectItem value="Node">Node.js</SelectItem>
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
                      formData.type === "PUBLIC" ? "border-blue-500 bg-[var(--bg-hover)] " : "bg-transparent border-[var(--border-primary)]"
                    }`}
                    onClick={() => handleInputChange("type", "PUBLIC")}
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
                      formData.type === "PRIVATE" ? "border-blue-500 bg-[var(--bg-hover)] " : "bg-transparent border-[var(--border-primary)]"
                    }`}
                    onClick={() => handleInputChange("type", "PRIVATE")}
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

              <div className="space-y-2">
                  <Label className="text-primary">Select Team Members</Label>
                  <div className="flex flex-wrap gap-4 pt-2  text-secondary">
                    {friends?.length !==0 ?friends.map(friend => (
                      <button
                      
                        type="button"
                        key={friend.id}
                        onClick={() => toggleFriendSelection(friend.id)}
                        className={`rounded-full cursor-pointer size-10 flex items-center justify-center transition ${selectedFriends.includes(friend.id) ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <Avatar className="!w-10 !text-lg h-10" fullName={friend.fullName} avatar={friend.avatar} />
                      </button>
                    )):"You got no friends to add nigga"}
                  </div>
                </div>
              

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className=" bg-transparent border-primary text-primary cursor-pointer "
                  onClick={() => navigate.push("/projects")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer px-8"
                >
                  {isSubmitting ? "...Creating" : "Create Project"}
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