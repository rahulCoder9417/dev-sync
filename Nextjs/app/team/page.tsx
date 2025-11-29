import Chat from "@/components/team/Chat";
import getDMAndTeam from "@/lib/actions/chat/dmAndTeam";
import Link from "next/link";
import { Button } from "@/components/ui/button"
export interface dmAndTeam {
  teams: {name:string,memberCount:number,id:string,projectId:string,lastMessage:boolean  ,lastMessageAt:Date}[],
  friends: {id:string,userId:string,fullName:string,username:string,avatar?:string | null,lastMessage:boolean,lastMessageAt:Date}[]
}
const  Page = async() => {
  
let data:dmAndTeam | null;
try {
    data = await getDMAndTeam()
    data?.teams.sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime; // most recent first
    });
    data?.friends.sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime; // most recent first
    });
} catch (error) {
    return(<div className="min-h-screen w-full bg-primary flex flex-col items-center justify-center text-white space-y-4">
      <h1 className="text-2xl font-bold">Cant get chat ry again</h1>
      <Link href="/dashboard" prefetch={true}>
        <Button>Go Home</Button>
      </Link>
    </div>)
}
  return (
    <Chat dmAndTeam={data} />
  );
};

export default Page;