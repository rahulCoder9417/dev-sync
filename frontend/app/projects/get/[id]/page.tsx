import { ProjectCodeComp } from "@/components/project/id/ProjectCodeComp"
import { Button } from "@/components/ui/button"
import { getProjectById } from "@/lib/actions/projects/getProject"
import { ProjectById } from "@/types"
import Link from "next/link"

const page = async({params}:{params:{id:string}}) => {
  const {id}= await params
  const data:ProjectById = await getProjectById(id)
  if(data.status !== 200){
    return <div className="min-h-screen w-full bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
      <p className='text-3xl text-primary font-bold'>{data.error}</p>
      <p className="text-primary font-bold">Status: {data.status}</p>
      <Link  href="/projects/">
      <Button variant="outline" className="cursor-pointer">Go to Projects</Button>
      </Link>
      </div>
    </div>
  }else if(data.responseData &&(data.responseData.isGitImport || data.responseData.type !=="PUBLIC")&& !(data.responseData.isOwner || data.responseData.isTeamMember)){
    return <div className="min-h-screen w-full bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-3xl text-primary font-bold">You are not the owner of this project</p>
        <Link  href="/projects/">
      <Button variant="outline" className="cursor-pointer">Go to Projects</Button>
      </Link>
      </div>
    </div>
  }
  return <ProjectCodeComp data={data.responseData} />
}

export default page