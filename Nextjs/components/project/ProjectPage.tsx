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
import { ProjectPageMember, ProjectPageType, TeamType } from "@/lib/types/types"
import { updateProjectStatus } from "@/lib/actions/projects/updateProjectStatus"
import { showToast } from "../main/Toast"
import Link from "next/link"
import { useAppSelector } from "@/lib/redux/hooks"
import { joinTeam, manageProjectTeamMember } from "@/lib/actions/projects/team"
import Avatar from "../main/Avatar"
import { capitalize } from "@/lib/mainUtils/capitals"
import { format } from "date-fns"

// Types
type ProjectType = "PUBLIC" | "PRIVATE" | "GENRATED"
type MemberStatus = "members" | "pendingRequests" | "bannedUsers" | "rejected"
type UserStatus = "idle" | "pending" | "rejected" | "banned" | "member"

interface TeamMember {
  id: string
  fullName: string
  username: string
  avatar?: string | null
  status: string
}

interface Props {
  project: ProjectPageType
  teamInfo: TeamType["team"]
}

interface EditForm {
  name: string
  description: string
  type: ProjectType
}

// Utility Functions
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
  const statusColors: Record<string, string> = {
    MEMBER: "text-[var(--success)]",
    pending: "text-[var(--warning)]",
    banned: "text-[var(--error)]",
    rejected: "text-[var(--text-muted)]",
    ADMIN: "text-[#cf1e1e] font-bold",
  }
  return statusColors[status] || "text-[var(--text-secondary)]"
}

const getStatusIndicatorColor = (status: string) => {
  const colors: Record<string, string> = {
    member: "bg-[var(--success)]",
    pending: "bg-[var(--warning)]",
    banned: "bg-[var(--error)]",
  }
  return colors[status] || "bg-[var(--text-muted)]"
}

// Helper to determine user status from team info
const determineUserStatus = (userId: string, teamInfo: TeamType["team"]): UserStatus => {
  if (teamInfo.bannedUsers.some((b) => b.userId === userId)) {
    return "banned"
  }
  if (teamInfo.members.some((m) => m.userId === userId)) {
    return "member"
  }
  const pendingRequest = teamInfo.pendingRequests.find((r) => r.userId === userId)
  if (pendingRequest?.status === "pending") {
    return "pending"
  }
  if (pendingRequest?.status === "rejected") {
    return "rejected"
  }
  return "idle"
}

// Helper to get members by status
const getMembersByStatus = (status: string, teamData: TeamType["team"]): ProjectPageMember[] => {
  switch (status) {
    case "members":
      return teamData.members
    case "pendingRequests":
      return teamData.pendingRequests.filter((i) => i.status === "pending")
    case "bannedUsers":
      return teamData.bannedUsers
    case "rejected":
      return teamData.pendingRequests.filter((i) => i.status === "rejected")
    default:
      return []
  }
}

// Main Component
export default function ProjectPage({ project, teamInfo }: Props) {
  const stateUser = useAppSelector((s) => s.user)

  // State
  const [userStatus, setUserStatus] = useState<UserStatus>("idle")
  const [teamData, setTeamData] = useState<TeamType["team"]>(teamInfo)
  const [projectData, setProjectData] = useState<ProjectPageType>(project)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({
    name: projectData.title,
    description: projectData.description || "",
    type: projectData.type,
  })

  // Determine user status on mount and when dependencies change
  useEffect(() => {
    if (!stateUser?.id) return
    setUserStatus(determineUserStatus(stateUser.id, teamInfo))
  }, [stateUser?.id, teamInfo])

  // Handlers
  const handleStarToggle = async () => {
    const res = await updateProjectStatus({ projectId: projectData.id, action: "star" })
    if (!res) {
      showToast(false, "Cannot Star", "Try again later")
      return
    }

    const isStarred = !projectData.isStarred
    setProjectData((prev) => ({
      ...prev,
      isStarred,
      stars: prev.stars + (isStarred ? 1 : -1),
    }))
    showToast(true, isStarred ? "Starred" : "Star removed")
  }

  const handleArchiveToggle = async () => {
    const res = await updateProjectStatus({ projectId: projectData.id, action: "archive" })
    if (!res) {
      showToast(false, "Cannot Archive", "Try again later")
      return
    }

    setProjectData((prev) => ({ ...prev, isArchived: !prev.isArchived }))
    showToast(true, projectData.isArchived ? "Unarchived" : "Archived")
  }

  const handleSettingsSave = async () => {
    const typeChanged = editForm.type !== projectData.type

    if (typeChanged) {
      const res = await updateProjectStatus({ projectId: projectData.id, action: "toggleType" })
      if (!res) {
        showToast(false, "Error updating Type")
        return
      }
    }

    const res = await updateProjectStatus({
      projectId: projectData.id,
      action: "name",
      name: editForm.name,
      description: editForm.description,
    })

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
    showToast(true, "Settings Updated")
  }

  const handleMemberStatusChange = async (
    memberId: string,
    newStatus: MemberStatus,
    currentStatus: Exclude<MemberStatus, "rejected">
  ) => {
    let action: "approve" | "revoke" | "ban"
    let updatedTeamData: TeamType["team"]

    const [member] = teamData[currentStatus].filter((i) => i.userId === memberId)
    const { user, userId } = member

    switch (newStatus) {
      case "rejected":
        action = "revoke"
        updatedTeamData = {
          ...teamData,
          pendingRequests: [
            ...teamData.pendingRequests.filter((i) => i.userId !== userId),
            { user, userId, status: "rejected" },
          ],
        }
        break

      case "bannedUsers":
        action = "ban"
        updatedTeamData = {
          ...teamData,
          [currentStatus]: teamData[currentStatus].filter((i) => i.userId !== userId),
          bannedUsers: [...teamData.bannedUsers, { user, userId, reason: "" }],
        }
        break

      case "members":
        action = "approve"
        updatedTeamData = {
          ...teamData,
          [currentStatus]: teamData[currentStatus].filter((i) => i.userId !== userId),
          members: [...teamData.members, { user, userId, role: "MEMBER" }],
        }
        break

      default:
        return
    }

    const res = await manageProjectTeamMember({
      projectId: projectData.id,
      targetUserId: memberId,
      action,
    })

    if (!res) {
      showToast(false, "Can't perform the action right now")
      return
    }

    showToast(true, `${capitalize(action)}d the user`)
    setTeamData(updatedTeamData)
    setShowTeamModal(false)
    setSelectedMember(null)
  }

  const handleJoinTeam = async () => {
    if (userStatus === "banned" || userStatus === "pending") return

    const res = await joinTeam(projectData.id)
    if (!res) {
      showToast(false, "Failed at operating team operations")
      return
    }

    showToast(true, res.message)
    const newStatus: UserStatus = res.message === "You Are removed" ? "idle" : "pending"

    let updatedTeamData: TeamType["team"]
    if (newStatus === "idle") {
      updatedTeamData = {
        ...teamData,
        members: teamData.members.filter((i) => i.userId !== stateUser.id),
      }
    } else {
      const existingRequest = teamData.pendingRequests.find((i) => i.userId === stateUser.id)
      const { user, userId } = existingRequest || {
        user: { fullName: stateUser.fullName, username: stateUser.username, avatar: stateUser.avatar },
        userId: stateUser.id,
      }

      if (userStatus === "rejected") {
        updatedTeamData = {
          ...teamData,
          pendingRequests: [
            ...teamData.pendingRequests.filter((i) => i.userId !== userId),
            { user, userId, status: "pending" },
          ],
        }
      } else {
        updatedTeamData = {
          ...teamData,
          pendingRequests: [...teamData.pendingRequests, { user, userId, status: "pending" }],
        }
      }
    }

    setTeamData(updatedTeamData)
    setUserStatus(newStatus)
  }

  const openTeamModal = (member: TeamMember) => {
    setSelectedMember(member)
    setShowTeamModal(true)
  }

  // Derived values
  const canViewCode = projectData.type !== "PRIVATE" || userStatus === "member" || projectData.isOwner
  const canJoinTeam = !projectData.isOwner

  return (
    <div className="bg-primary min-h-screen w-full text-primary p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Project Header */}
        <ProjectHeader
          projectData={projectData}
          userStatus={userStatus}
          canViewCode={canViewCode}
          onStarToggle={handleStarToggle}
          onArchiveToggle={handleArchiveToggle}
          onSettingsClick={() => setShowSettingsModal(true)}
        />

        {/* Team Section */}
        <TeamSection
          teamData={teamData}
          projectData={projectData}
          userStatus={userStatus}
          canJoinTeam={canJoinTeam}
          onJoinTeam={handleJoinTeam}
          onMemberClick={openTeamModal}
        />
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          editForm={editForm}
          onClose={() => setShowSettingsModal(false)}
          onSave={handleSettingsSave}
          onFormChange={setEditForm}
        />
      )}

      {/* Team Management Modal */}
      {showTeamModal && projectData.isOwner && selectedMember && (
        <TeamManagementModal
          member={selectedMember}
          onClose={() => setShowTeamModal(false)}
          onStatusChange={handleMemberStatusChange}
        />
      )}
    </div>
  )
}

// Sub-components
function ProjectHeader({
  projectData,
  userStatus,
  canViewCode,
  onStarToggle,
  onArchiveToggle,
  onSettingsClick,
}: {
  projectData: ProjectPageType
  userStatus: UserStatus
  canViewCode: boolean
  onStarToggle: () => void
  onArchiveToggle: () => void
  onSettingsClick: () => void
}) {
  const userId = useAppSelector((s)=>s.user.id)
  return (
    <div className="bg-card rounded-lg p-6 border border-primary">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-primary">{projectData.title}</h1>
            <div className="flex items-center gap-2">
              <button onClick={onStarToggle}>
                <Star
                  className={`w-5 h-5 cursor-pointer ${
                    projectData.isStarred
                      ? "text-[var(--warning)] fill-current"
                      : "text-[var(--text-muted)]"
                  } hover:text-[var(--warning)] transition-colors`}
                />
              </button>
              <p
                className={`text-secondary text-md ${
                  projectData.isStarred ? "text-[var(--warning)]" : "text-[var(--text-muted)]"
                }`}
              >
                {projectData.stars}
              </p>
              {projectData.isArchived && <Archive className="w-5 h-5 text-[var(--text-muted)]" />}
            </div>
          </div>
          <p className="text-secondary text-sm leading-relaxed mb-4">{projectData.description}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        {canViewCode && (
          <Link prefetch={true} href={`/projects/get/${projectData.id}`}>
            <button className="bg-brand text-white px-4 py-2 cursor-pointer rounded-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <Code className="w-4 h-4" />
              Show Code Now
            </button>
          </Link>
        )}

        {projectData.isOwner && (
          <>
            <button
              onClick={onSettingsClick}
              className="bg-secondary text-primary px-4 py-2 cursor-pointer rounded-md hover:bg-hover transition-colors border border-primary flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button> </>
        )}
            {projectData.team?.find((i) => i.id === userId) && <button
              onClick={onArchiveToggle}
              className={`px-4 py-2 rounded-md transition-colors border cursor-pointer border-primary flex items-center gap-2 ${
                projectData.isArchived
                  ? "bg-[var(--warning)] text-white hover:opacity-90"
                  : "bg-secondary text-primary hover:bg-hover"
              }`}
            >
              <Archive className="w-4 h-4" />
              {projectData.isArchived ? "Unarchive" : "Archive"}
            </button>}
         
      </div>

      {/* Project Details */}
      <ProjectDetails projectData={projectData} />
    </div>
  )
}

function ProjectDetails({ projectData }: { projectData: ProjectPageType }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-primary">
      <div>
        <label className="text-muted text-xs uppercase tracking-wide">Package</label>
        <p className="text-primary font-medium">{projectData.framework}</p>
      </div>
      <div>
        <label className="text-muted text-xs uppercase tracking-wide">Type</label>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              projectData.type === "PUBLIC"
                ? "bg-[var(--success)]"
                : projectData.type === "PRIVATE"
                ? "bg-[var(--warning)]"
                : "bg-[var(--brand-primary)]"
            }`}
          />
          <p className="text-primary font-medium capitalize">{projectData.type}</p>
        </div>
      </div>
      {projectData.gitRepo && projectData.gitRepo.length > 0 && (
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
  )
}

function TeamSection({
  teamData,
  projectData,
  userStatus,
  canJoinTeam,
  onJoinTeam,
  onMemberClick,
}: {
  teamData: TeamType["team"]
  projectData: ProjectPageType
  userStatus: UserStatus
  canJoinTeam: boolean
  onJoinTeam: () => void
  onMemberClick: (member: TeamMember) => void
}) {
  const getJoinButtonConfig = () => {
    const configs = {
      idle: { text: "Join Team", className: "bg-brand text-white hover:opacity-90", disabled: false },
      rejected: {
        text: "Join Team",
        className: "bg-brand text-white hover:opacity-90",
        disabled: false,
      },
      member: { text: "Leave Team", className: "bg-[var(--error)] text-white", disabled: false },
      pending: {
        text: "Pending",
        className: "bg-[var(--warning)] text-white cursor-not-allowed",
        disabled: true,
      },
      banned: {
        text: "Banned",
        className: "bg-[var(--error)] text-white cursor-not-allowed",
        disabled: true,
      },
    }
    return configs[userStatus]
  }

  const buttonConfig = getJoinButtonConfig()

  return (
    <div className="bg-card rounded-lg p-6 border border-primary">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-brand" />
          <h2 className="text-xl font-semibold text-primary">Team</h2>
          <span className="bg-secondary text-secondary px-2 py-1 rounded-full text-xs">
            {teamData.members.length} members
          </span>
        </div>
        {canJoinTeam && (
          <button
            onClick={onJoinTeam}
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${buttonConfig.className}`}
            disabled={buttonConfig.disabled}
          >
            {buttonConfig.text}
          </button>
        )}
      </div>

      {/* Team Members Grid */}
      <div className="space-y-4">
        {["members", "pendingRequests", "bannedUsers", "rejected"].map((status) => {
          const members = getMembersByStatus(status, teamData)
          if (members.length === 0) return null

          return (
            <TeamStatusSection
              key={status}
              status={status}
              members={members}
              isOwner={projectData.isOwner}
              onMemberClick={onMemberClick}
            />
          )
        })}
      </div>
    </div>
  )
}

function TeamStatusSection({
  status,
  members,
  isOwner,
  onMemberClick,
}: {
  status: string
  members: ProjectPageMember[]
  isOwner: boolean
  onMemberClick: (member: TeamMember) => void
}) {
  return (
    <div className="border-b border-secondary pb-4 last:border-b-0">
      <h3 className="text-sm font-medium text-secondary mb-3 capitalize flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${getStatusIndicatorColor(status)}`} />
        {status} ({members.length})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {members.map((member) => (
          <MemberCard
            key={member.userId}
            member={member}
            status={status}
            isOwner={isOwner}
            onClick={onMemberClick}
          />
        ))}
      </div>
    </div>
  )
}

function MemberCard({
  member,
  status,
  isOwner,
  onClick,
}: {
  member: ProjectPageMember
  status: string
  isOwner: boolean
  onClick: (member: TeamMember) => void
}) {
  const isAdmin = member.role === "ADMIN"
  const isClickable = isOwner && !isAdmin

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-secondary rounded-md transition-colors group ${
        isClickable ? "hover:bg-hover cursor-pointer" : "pointer-events-none"
      }`}
      onClick={() =>
        isClickable &&
        onClick({
          id: member.userId,
          status,
          fullName: member.user.fullName,
          avatar: member.user.avatar,
          username: member.user.username,
        })
      }
    >
      <Avatar
        fullName={member.user.fullName}
        avatar={member.user.avatar}
        username={member.user.username}
      />
      <div className="flex-1 min-w-0">
        <p className="text-primary font-medium text-sm truncate">{member.user.fullName}</p>
        <p className={`text-xs capitalize ${getStatusColor(member.role || member.status || "banned")}`}>
          {capitalize(member.role || member.status || "Banned")}
        </p>
      </div>
      {isClickable && (
        <MoreVertical className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  )
}

function SettingsModal({
  editForm,
  onClose,
  onSave,
  onFormChange,
}: {
  editForm: EditForm
  onClose: () => void
  onSave: () => void
  onFormChange: React.Dispatch<React.SetStateAction<EditForm>>
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md border border-primary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Project Settings</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-muted hover:text-primary" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Project Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => onFormChange((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full bg-secondary border border-primary rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Description</label>
            <textarea
              value={editForm.description || "No description"}
              onChange={(e) => onFormChange((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full bg-secondary border border-primary rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-brand resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Project Type</label>
            <select
              value={editForm.type}
              onChange={(e) =>
                onFormChange((prev) => ({ ...prev, type: e.target.value as ProjectType }))
              }
              className="w-full bg-secondary border border-primary rounded-md px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onSave}
            className="flex-1 bg-brand text-white py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-secondary text-primary py-2 rounded-md hover:bg-hover transition-colors border border-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function TeamManagementModal({
  member,
  onClose,
  onStatusChange,
}: {
  member: TeamMember
  onClose: () => void
  onStatusChange: (
    memberId: string,
    newStatus: MemberStatus,
    currentStatus: Exclude<MemberStatus, "rejected">
  ) => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-sm border border-primary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Manage Member</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 cursor-pointer text-muted hover:text-primary" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 p-3 bg-secondary rounded-md">
          <Avatar
            fullName={member.fullName}
            avatar={member.avatar}
            username={member.username}
            getInfo={true}
          />
          <div>
            <p className="text-primary font-medium">{member.fullName}</p>
            <p className={`text-xs capitalize ${getStatusColor(member.status)}`}>
              Current: {member.status}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {member.status === "pendingRequests" && (
            <>
              <button
                onClick={() => onStatusChange(member.id, "members", "pendingRequests")}
                className="w-full flex items-center gap-3 p-3 cursor-pointer bg-secondary hover:bg-hover rounded-md transition-colors text-left"
              >
                <Check className="w-4 h-4 text-[var(--success)]" />
                <span className="text-primary">Approve Member</span>
              </button>
              <button
                onClick={() => onStatusChange(member.id, "rejected", "pendingRequests")}
                className="w-full flex items-center gap-3 p-3 cursor-pointer bg-secondary hover:bg-hover rounded-md transition-colors text-left"
              >
                <UserMinus className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-primary">Revoke Access</span>
              </button>
            </>
          )}

          {member.status === "members" && (
            <button
              onClick={() => onStatusChange(member.id, "bannedUsers", "members")}
              className="w-full flex items-center gap-3 cursor-pointer p-3 bg-secondary hover:bg-hover rounded-md transition-colors text-left"
            >
              <Ban className="w-4 h-4 text-[var(--error)]" />
              <span className="text-primary">Ban Member</span>
            </button>
          )}

          {member.status === "bannedUsers" && (
            <button
              onClick={() => onStatusChange(member.id, "members", "bannedUsers")}
              className="w-full flex items-center gap-3 p-3 cursor-pointer bg-secondary hover:bg-hover rounded-md transition-colors text-left"
            >
              <Check className="w-4 h-4 text-[var(--success)]" />
              <span className="text-primary">Unban Member</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}