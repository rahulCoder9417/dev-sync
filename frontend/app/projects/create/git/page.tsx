'use client'
import Avatar from '@/components/main/Avatar'
import { showToast } from '@/components/main/Toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import axios from "axios"
import { handleConnect } from '@/lib/mainUtils/gitLogin'
import { useAppSelector } from '@/lib/redux/hooks'
import { FriendsGet } from '@/types'
import { Globe, Lock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import StatusBox, { DataStat } from '@/components/project/StatusBox'
const Page = () => {
  const [submitting, setsubmitting] = useState(false)
  const [dataStat, setDataStat] = useState<DataStat>({
    status:"",message:"",step:1,project:""
  })
  const [friends, setFriends] = useState<FriendsGet | []>([])
  const [elapsedTime, setElapsedTime] = useState(0);
  const [ownRepo, setOwnRepo] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const toggleFriendSelection = (id: string) => {
    setSelectedFriends(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [project, setProject] = useState({
    description: '',
    type: '',
    packages: '',
    name: ''
  })
  const [formData, setFormData] = useState({
    repoName: "",
    ownerName: ""
  });
  const user = useAppSelector((state) => state.user)
  useEffect(() => {
    const op = async () => {
      try{
      const friends = await axios.get("/api/user/findFriend"); setFriends(friends.data)}
      catch(error){
console.log(error)
      }
    }
    if ((!user.githubUrl || user.githubUrl.length === 0) && user.isAuthenticated) {
      console.log("No GitHub connected, calling connect handler")
      showToast(true, "You are redirected to dashboard", "This happened because you were not authenticated via git ,if this is persisting try later")

      handleConnect()
    }
    op()
  }, [user.isAuthenticated])


  if (!user.isAuthenticated) return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center">
      <p className='text-3xl text-primary font-bold'>Wait git Hub verifaction is going on ......</p>
    </div>
  )
  const handleCloneRepo = async () => {
    setsubmitting(true);
    setElapsedTime(0); // reset timer
    let timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    const formDataSub = new FormData();

    const members = selectedFriends.map(id => ({ userId: id }));
    formDataSub.append('userAuth', user.githubUrl!);
    formDataSub.append('team', JSON.stringify(members));
    formDataSub.append('project', JSON.stringify(project));
    formDataSub.append('ownerName', formData.ownerName);
    formDataSub.append('repoName', formData.repoName);
    formDataSub.append('own', String(ownRepo));
    try {
      const res = await fetch('/api/git/clonePublicRepo', {
        method: 'POST',
        body: formDataSub,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        chunk
          .split('\n\n')
          .filter(line => line.startsWith('data: '))
          .forEach(line => {
            const json = line.replace('data: ', '');
            try {
              const parsed = JSON.parse(json);
              let p =parsed.project || ""
              setDataStat({status:parsed.status ,message:parsed.message,step:parsed.step,project: p })
            } catch (err) {
              console.warn('Failed to parse stream chunk:', json);
            }
          });
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unknown error';
      setDataStat({status:"error" ,message:message,step:6,project:""})
    }
    clearInterval(timer);
    setsubmitting(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setsubmitting(true)
   if(Object.values(project).some(i=>i==="")){
    showToast(false,"enter All project details")
    setsubmitting(false)
    return
   }
   if(formData.ownerName==="" || formData.repoName===""){
    showToast(false,"enter git details")
    setsubmitting(false)
    return
   }
await handleCloneRepo()
setsubmitting(false)
  };

  const handleInputChange = (field: string, value: string, type: string = "form") => {
    if (type === "form") {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {

      setProject(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className='min-h-screen w-full bg-primary flex items-center justify-center'>
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl text-white mb-4">CLone Repo</h2>
        <div>
          <div className='mt-1 mb-2'>
<Button className={`${ownRepo===true && "bg-accent text-accent-foreground"} cursor-pointer`} variant={"ghost"} onClick={() => {setOwnRepo(!ownRepo);setDataStat({   status:"",message:"",step:1,project:""})} }>Use your repo</Button>
        </div>
        </div>
       <StatusBox dataStat={dataStat} />
          <div>
            {/* Form */}
            <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--text-primary)' }}>
                  Project Details For Cloning
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
                      value={project.name}
                      onChange={(e) => handleInputChange("name", e.target.value, "project")}
                      placeholder="Enter project name"
                      className="bg-transparent border-gray-600"
                      style={{
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  {/* Owner Name */}
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" style={{ color: 'var(--text-primary)' }}>
                      Owner Name *
                    </Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value, "form")}
                      placeholder="Enter Owner name"
                      className="bg-transparent border-gray-600"
                      style={{
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  {/* Repo Name */}
                  <div className="space-y-2">
                    <Label htmlFor="repoName" style={{ color: 'var(--text-primary)' }}>
                    Repo Name *
                    </Label>
                    <Input
                      id="repoName"
                      value={formData.repoName}
                      onChange={(e) => handleInputChange("repoName", e.target.value, "form")}
                      placeholder="Enter repo name"
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
                      value={project.description}
                      onChange={(e) => handleInputChange("description", e.target.value, "project")}
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
                    <Select onValueChange={(value) => handleInputChange("packages", value, "project")}>
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
                        className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${project.type === "PUBLIC" ? "border-blue-500 bg-[var(--bg-hover)] " : "bg-transparent border-[var(--border-primary)]"
                          }`}
                        onClick={() => handleInputChange("type", "PUBLIC", "project")}
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
                        className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${project.type === "PRIVATE" ? "border-blue-500 bg-[var(--bg-hover)] " : "bg-transparent border-[var(--border-primary)]"
                          }`}
                        onClick={() => handleInputChange("type", "PRIVATE", "project")}
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
                      {friends?.length !== 0 ? friends.map(friend => (
                        <button

                          type="button"
                          key={friend.id}
                          onClick={() => toggleFriendSelection(friend.id)}
                          className={`rounded-full cursor-pointer size-10 flex items-center justify-center transition ${selectedFriends.includes(friend.id) ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <Avatar className="!w-10 !text-lg h-10" fullName={friend.fullName} avatar={friend.avatar} />
                        </button>
                      )) : "You got no friends to add nigga"}
                    </div>
                  </div>


                  {/* Submit Button */}
                  <div className="flex items-center justify-center pt-4">

                    <Button
                      type="submit"
                      className="cursor-pointer px-8"
                    >
                      {submitting ? `...Creating ⏱️ Elapsed Time: ${formatTime(elapsedTime)}`: "Create Project"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div> 
      </div>
    </div>
  )
}

export default Page
