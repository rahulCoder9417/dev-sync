import Avatar from '@/components/main/Avatar'
import { ProjectCard } from '@/components/project/ProjectCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, UserCheck, UserPlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { getUserDetails } from '@/lib/actions/user/userDetailes'
import FriendshipButton from '@/components/profile/FriendshipButton'

const page = async({params}: {params: {username: string}}) => {
    const {username} =await params
    const data  = await getUserDetails(username)
    const res = data.user
   
 if(!res){
    return <div>user not found</div>
 }
    
  
    return (
      <div className="min-h-screen flex-1 bg-primary" >
        {/* Profile Section */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div 
            className="rounded-2xl p-8 mb-8 border border-primary card-gradient"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
          <Avatar
          className='!w-20 !h-20 !text-3xl !font-bold'
          username={res.username}
          fullName={res.fullName}
          avatar={res.avatar}/>
              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 
                      className="text-3xl text-primary font-bold mb-1"
                    >
                      {res.fullName}
                    </h1>
                    <p 
                      className="text-lg text-muted"
                    >
                      @{username || res.username}
                    </p>
                  </div>
  
                  {/* Friendship Button */}
                 
                  <FriendshipButton status={res.isFriend} userId={res.id}/>
                </div>
  
                <p 
                  className="mb-6 max-w-2xl text-muted"
                >
                  {res.bio}
                </p>
  
                {/* Stats */}
                <div className="flex gap-20">
                  <div>
                    <div 
                      className="text-2xl font-bold text-primary"
                    >
                      {res.projects.length}
                    </div>
                    <div 
                      className=" text-muted"
                    >
                      Projects
                    </div>
                  </div>
                  <div>
                  <div 
                      className="text-2xl font-bold text-primary"
                    >
                      {res.totalFriends}
                    </div>
                    <div 
                      className=" text-muted"
                    >
                      Friends
                    </div>
                  </div>
                    
                </div>
              </div>
            </div>
          </div>
  
          {/* Projects Section */}
          <div>
            <h2 
              className="text-2xl font-bold mb-6 text-primary"
            >
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {res.projects.map((project :any) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
export default page
