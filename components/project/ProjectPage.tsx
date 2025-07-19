"use client"

import { useEffect, useState } from "react"
import {
  Star,
  Archive,
  GitBranch,
  Calendar,
  Clock,
  Users,
  Code,
  Settings,
  X,
  Check,
  Ban,
  UserMinus,
  MoreVertical,
} from "lucide-react"
import { ProjectPageMember, ProjectPageType, TeamType } from "@/types";
import { updateProjectStatus } from "@/lib/actions/projects/updateProjectStatus";
import { showToast } from "../main/Toast";
import { format } from "date-fns";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/hooks";
import { joinTeam, manageProjectTeamMember } from "@/lib/actions/projects/team";
import Avatar from "../main/Avatar";
import { capitalize } from "@/lib/mainUtils/capitals";

type ProjectType = "PUBLIC" | "PRIVATE" | "GENRATED"
type MemberStatus = "members" | "pendingRequests" | "bannedUsers" | "rejected"

interface TeamMember {
  id: string
  fullName: string
  avatar?: string | null
  status: string
}
interface Props {
  project: ProjectPageType;
  teamInfo: TeamType["team"]
}

export default function ProjectPage({ project, teamInfo }: Props) {

  const stateUser = useAppSelector((s) => s.user);

  
const [userStatus, setStatus] = useState<"idle" | "pending" |"rejected"| "banned" | "member">("idle");

useEffect(() => {
  
  console.log(teamData.pendingRequests.filter(i => i.userId === stateUser.id))
  console.log(teamInfo)
  if (!stateUser?.id) return;

  if (teamInfo.bannedUsers.some(b => b.userId === stateUser.id)) {
    setStatus("banned");
  }else if (teamInfo.members.some(m => m.userId === stateUser.id)) {
    setStatus("member");
  }  else if (teamInfo.pendingRequests.some(r => (r.userId === stateUser.id)&& r.status==="pending" )) {
    setStatus("pending");
  }  else if (teamInfo.pendingRequests.some(r => (r.userId === stateUser.id)&& r.status==="rejected" )) {
    setStatus("rejected");
  } else {
    setStatus("idle");
  }
}, [stateUser?.id, teamInfo]);
  // Team data state
  const [teamData, setTeamData] = useState<TeamType["team"]>(teamInfo)

  const [projectData, setProjectData] = useState<ProjectPageType>(project)

  // Modal states
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  // Form states
  const [editForm, setEditForm] = useState({
    name: projectData.title,
    description: projectData.description,
    type: projectData.type,
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "MEMBER":
        return "text-[var(--success)]"
      case "pending":
        return "text-[var(--warning)]"
      case "banned":
        return "text-[var(--error)]"
      case "rejected":
        return "text-[var(--text-muted)]"
      case "ADMIN":
        return "text-[#cf1e1e] font-bold"
      default:
        return "text-[var(--text-secondary)]"
    }
  }


  const handleStarToggle = async () => {
    const res = await updateProjectStatus({ projectId: projectData.id, action: "star" })
    if (!res) {
      showToast(false, "Cannot Star", "Try again later")
      return

    }
    if (projectData.isStarred) {
      setProjectData((prev) => ({ ...prev, isStarred: false, stars: prev.stars - 1 }))
      showToast(true, "Starr removed")
    } else {
      setProjectData((prev) => ({ ...prev, isStarred: true, stars: prev.stars + 1 }))

      showToast(true, "Starred")
    }
  }

  const handleArchiveToggle = async () => {
    const res = await updateProjectStatus({ projectId: projectData.id, action: "archive" })
    if (!res) {
      showToast(false, "Cannot Archieve", "Try again later")
      return

    }
    setProjectData((prev) => ({ ...prev, isArchived: !prev.isArchived }))

    showToast(true, "Archieved")
  }

  const handleSettingsSave = async (a: boolean) => {
    if (a) {
      const res1 = await updateProjectStatus({ projectId: projectData.id, action: "toggleType" })
      if (!res1) {
        showToast(false, "Error updating Type")
      }
    }
    const res = await updateProjectStatus({ projectId: projectData.id, action: "name", name: editForm.name, description: editForm.description })
    if (!res) {
      showToast(false, "Error updating name and Description", "Try again later")
      return

    }
    setProjectData((prev) => ({
      ...prev,
      name: editForm.name,
      description: editForm.description,
      type: editForm.type,
      updatedAt: format(new Date(), "yyyy-MM-dd"),
    }))
    setShowSettingsModal(false)
    showToast(true, "Setting Updated")
  }

  const handleMemberStatusChange = async (memberId: string, newStatus: MemberStatus, currentStat: Exclude<MemberStatus, "rejected">) => {
    let s;
    let data;
    console.log(newStatus,currentStat)
    let [{ user, userId }] = teamData[currentStat].filter(i => i.userId === memberId)
    switch (newStatus) {
      case newStatus = "rejected":
        s = "revoke"// "approve" | "revoke" | "ban"
        const status = "rejected"
        data = { ...teamData, pendingRequests: [...teamData["pendingRequests"].filter(i => i.userId !== userId),{ user, userId,status }] }
        break;
      case newStatus = "bannedUsers":
        s = "ban"
        const reason = ""
        data = { ...teamData, [currentStat]: teamData[currentStat].filter(i => i.userId !== userId), [newStatus]: [...teamData[newStatus],{ user, userId,reason }]  }
        break;
      case newStatus = "members":
        const role = "MEMBER"
        s = "approve"
        data = { ...teamData, [currentStat]: teamData[currentStat].filter(i => i.userId !== userId), [newStatus]: [...teamData[newStatus],{ user, userId,role }] }
        break;

      default:
        break;
    }
    const res = await manageProjectTeamMember({ projectId: projectData.id, targetUserId: memberId, action: s as "approve" | "revoke" | "ban" })
    if (!res) {
      showToast(false, "Cant perform the action at now")
      return
    }
    showToast(true, capitalize(s as string) + "d the user")

    setTeamData(data as TeamType["team"] );
    setShowTeamModal(false)
    setSelectedMember(null)
  }

  const openTeamModal = (member: TeamMember) => {
    setSelectedMember(member)
    setShowTeamModal(true)
  }

  const join = async () => {
    if (userStatus === "banned" || userStatus ==="pending") return
    const res = await joinTeam(projectData.id);
    
    if (!res) {
      showToast(false, "Failed At oprating team Operations")
      return
    }
    showToast(true, res.message)
    const a = res.message === "You Are removed" ? "idle" : "pending"
    let d;
    if (a==="idle") {
      d={...teamData,members:teamData["members"].filter(i=>i.userId !== stateUser.id)}
    }else{
      console.log(teamData.pendingRequests.filter(i => i.userId === stateUser.id))
    let [{ user, userId }] = teamData.pendingRequests.filter(i => i.userId === stateUser.id)
      if (userStatus==="rejected") {
        d={ ...teamData,pendingRequests: [...teamData.pendingRequests.filter(i => i.userId !== userId) ,{user,userId,status:"pending"}]}
      }else{
        d={ ...teamData,pendingRequests:[...teamData.pendingRequests,{user,userId,status:"pending"}]}
      }
    }
   setTeamData(d as TeamType["team"] )
    setStatus(a)
  }


  return (
    <div className="bg-primary min-h-screen w-full text-primary p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Project Header */}
        <div className="bg-card rounded-lg p-6 border border-primary">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl  font-bold text-primary">{projectData.title}</h1>
                <div className="flex items-center gap-2">
                  <button onClick={handleStarToggle}>
                    <Star
                      className={`w-5 h-5 cursor-pointer ${projectData.isStarred ? "text-[var(--warning)] fill-current" : "text-[var(--text-muted)]"} hover:text-[var(--warning)] transition-colors`}
                    />
                  </button>
                  <p className={`text-secondary text-md ${projectData.isStarred ? "text-[var(--warning)] fill-current" : "text-[var(--text-muted)]"}`}>{projectData.stars}</p>
                  {projectData.isArchived && <Archive className="w-5 h-5 text-[var(--text-muted)]" />}
                </div>
              </div>
              <p className="text-secondary text-sm leading-relaxed mb-4">{projectData.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            {(projectData.type !== "PRIVATE" || userStatus === "member" || projectData.isOwner) &&
              <Link href={`/projects/get/${projectData.id}`}>
                <button className="bg-brand text-white px-4 py-2 cursor-pointer rounded-md hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Show Code Now
                </button>
              </Link>}

            {projectData.isOwner &&
              <>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="bg-secondary text-primary px-4 py-2 cursor-pointer rounded-md hover:bg-hover transition-colors border border-primary flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleArchiveToggle}
                  className={`px-4 py-2 rounded-md transition-colors border cursor-pointer border-primary flex items-center gap-2 ${projectData.isArchived
                    ? "bg-[var(--warning)] text-white hover:opacity-90"
                    : "bg-secondary text-primary hover:bg-hover"
                    }`}
                >
                  <Archive className="w-4 h-4" />
                  {projectData.isArchived ? "Unarchive" : "Archive"}
                </button>
              </>
            }
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-primary">
            <div>
              <label className="text-muted text-xs uppercase tracking-wide">Package</label>
              <p className="text-primary font-medium">{projectData.framework}</p>
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wide">Type</label>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${projectData.type === "PUBLIC"
                    ? "bg-[var(--success)]"
                    : projectData.type === "PRIVATE"
                      ? "bg-[var(--warning)]"
                      : "bg-[var(--brand-primary)]"
                    }`}
                ></span>
                <p className="text-primary font-medium capitalize">{projectData.type}</p>
              </div>
            </div>
            {projectData.gitImport && (
              <div>
                <label className="text-muted text-xs uppercase tracking-wide">Repository</label>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-muted" />
                  <p className="text-primary font-medium">{projectData.gitRepo}</p>
                </div>
              </div>
            )}
            <div>
              <label className="text-muted text-xs uppercase tracking-wide">Updated</label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted" />
                <p className="text-primary font-medium text-sm">{projectData.updatedAt}</p>
              </div>
            </div>
            <div>
              <label className="text-muted text-xs uppercase tracking-wide">Created</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted" />
                <p className="text-primary font-medium text-sm">{formatDate(projectData.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-card rounded-lg p-6 border border-primary">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-brand" />
              <h2 className="text-xl font-semibold text-primary">Team</h2>
              <span className="bg-secondary text-secondary px-2 py-1 rounded-full text-xs">
                {teamData.members.length} members
              </span>
            </div>
            {!projectData.isOwner &&

              <button
                onClick={join}
                className={`px-4 py-2 rounded-md text-sm  font-medium cursor-pointer transition-colors ${userStatus === "idle"
                  ? "bg-brand text-white hover:opacity-90"
                  : userStatus === "member"
                    ? "bg-[var(--error)] text-white "
                    : (userStatus === "pending" || userStatus === "rejected")
                      ? "bg-[var(--warning)] text-white cursor-not-allowed"
                      : "bg-[var(--error)] text-white cursor-not-allowed"
                  }`}
                disabled={userStatus === "pending" || userStatus === "banned"}
              >
                {(userStatus === "idle" ||userStatus === "rejected") ? "Join Team" : userStatus === "member" ? "Leave Team" : userStatus === "pending" ? "Pending" : "Banned"}
              </button>}
          </div>

          {/* Team Members Grid */}
          <div className="space-y-4">
            {["members", "pendingRequests", "bannedUsers", "rejected"].map((status) => {
              let members: ProjectPageMember[] = [];
              switch (status) {
                case "members":
                  members = teamData["members"]
                  break;
                case "pendingRequests":
                  members = teamData["pendingRequests"].filter(i => i.status === "pending")
                  break;
                case "bannedUsers":
                  members = teamData["bannedUsers"]
                  break;
                case "rejected":
                  members = teamData["pendingRequests"].filter(i => i.status === "rejected")
                  break;

                default:
                  break;
              }
              if (members.length === 0) return null
              return (
                <div key={status} className="border-b border-secondary pb-4 last:border-b-0">
                  <h3 className="text-sm font-medium text-secondary mb-3 capitalize flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${status === "member"
                        ? "bg-[var(--success)]"
                        : status === "pending"
                          ? "bg-[var(--warning)]"
                          : status === "banned"
                            ? "bg-[var(--error)]"
                            : "bg-[var(--text-muted)]"
                        }`}
                    ></span>
                    {status} ({members.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {members.map((member) => (
                      <div
                        key={member.userId}
                        className={`flex items-center gap-3 p-3 bg-secondary rounded-md hover:bg-hover transition-colors group cursor-pointer ${member.role === "ADMIN" ? "pointer-events-none " : ""}`}
                        onClick={() => openTeamModal({ id: member.userId, status: status, fullName: member.user.fullName, avatar: member.user.avatar })}
                      >
                        <Avatar fullName={member.user.fullName} avatar={member.user.avatar} />
                        <div className="flex-1 min-w-0">
                          <p className="text-primary font-medium text-sm truncate">{member.user.fullName}</p>
                          <p className={`text-xs capitalize ${getStatusColor(member.role || member.status || "banned")}`}>{capitalize(member.role || member.status || "Banned")}</p>
                        </div>
                        <MoreVertical className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md border border-primary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Project Settings</h3>
              <button onClick={() => setShowSettingsModal(false)}>
                <X className="w-5 h-5 text-muted hover:text-primary" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Project Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-secondary border border-primary rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Description</label>
                <textarea
                  value={editForm.description || "No description"}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-secondary border border-primary rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Project Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value as ProjectType }))}
                  className="w-full bg-secondary border border-primary rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleSettingsSave(editForm.type !== projectData.type)}
                className="flex-1 bg-brand text-white py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 bg-secondary text-primary py-2 rounded-md hover:bg-hover transition-colors border border-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Management Modal */}
      {showTeamModal && projectData.isOwner && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-sm border border-primary">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Manage Member</h3>
              <button onClick={() => setShowTeamModal(false)}>
                <X className="w-5 h-5 cursor-pointer text-muted hover:text-primary" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6 p-3 bg-secondary rounded-md">
              <Avatar fullName={selectedMember.fullName} avatar={selectedMember.avatar} />
              <div>
                <p className="text-primary font-medium">{selectedMember.fullName}</p>
                <p className={`text-xs capitalize ${getStatusColor(selectedMember.status)}`}>
                  Current: {selectedMember.status}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {selectedMember.status === "pendingRequests" && (
                <>
                  <button
                    onClick={() => handleMemberStatusChange(selectedMember.id, "members", "pendingRequests")}
                    className="w-full flex items-center gap-3 p-3 cursor-pointer bg-secondary hover:bg-hover rounded-md transition-colors text-left"
                  >
                    <Check className="w-4 h-4 text-[var(--success)]" />
                    <span className="text-primary">Approve Member</span>
                  </button>
                  <button
                    onClick={() => handleMemberStatusChange(selectedMember.id, "rejected", "pendingRequests")}
                    className="w-full flex items-center gap-3 p-3 cursor-pointer bg-secondary hover:bg-hover rounded-md transition-colors text-left"
                  >
                    <UserMinus className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-primary">Revoke Access</span>
                  </button>
                </>
              )}

              {selectedMember.status === "members" && (
                <button
                  onClick={() => handleMemberStatusChange(selectedMember.id, "bannedUsers", "members")}
                  className="w-full flex items-center gap-3 cursor-pointer p-3 bg-secondary hover:bg-hover rounded-md transition-colors text-left"
                >
                  <Ban className="w-4 h-4 text-[var(--error)]" />
                  <span className="text-primary">Ban Member</span>
                </button>
              )}

              {selectedMember.status === "bannedUsers" && (
                <button
                  onClick={() => handleMemberStatusChange(selectedMember.id, "members", "bannedUsers")}
                  className="w-full flex items-center gap-3 p-3 cursor-pointer bg-secondary hover:bg-hover rounded-md transition-colors text-left"
                >
                  <Check className="w-4 h-4 text-[var(--success)]" />
                  <span className="text-primary">Unban Member</span>
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
