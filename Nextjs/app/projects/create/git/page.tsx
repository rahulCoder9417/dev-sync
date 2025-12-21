'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Globe, Lock } from 'lucide-react'

import Avatar from '@/components/main/Avatar'
import { showToast } from '@/components/main/Toast'
import StatusBox, { DataStat } from '@/components/project/StatusBox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { handleConnect } from '@/lib/mainUtils/gitLogin'
import { useAppSelector } from '@/lib/redux/hooks'
import { FriendsGet } from '@/lib/types/types'

interface ProjectData {
  description: string
  type: string
  packages: string
  name: string
}

interface FormData {
  repoName: string
  ownerName: string
}

const INITIAL_PROJECT_STATE: ProjectData = {
  description: '',
  type: '',
  packages: '',
  name: ''
}

const INITIAL_FORM_STATE: FormData = {
  repoName: '',
  ownerName: ''
}

const INITIAL_DATA_STAT: DataStat = {
  status: '',
  message: '',
  step: 1,
  project: ''
}

const LANGUAGE_OPTIONS = [
  { value: 'Ts', label: 'TypeScript' },
  { value: 'Js', label: 'JavaScript' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'C#', label: 'C#' },
  { value: 'PHP', label: 'PHP' },
  { value: 'Go', label: 'Go' },
  { value: 'Rust', label: 'Rust' },
  { value: 'React', label: 'React' },
  { value: 'Vue', label: 'Vue.js' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Nextjs', label: 'Next.js' },
  { value: 'Node', label: 'Node.js' },
  { value: 'django', label: 'Django' },
  { value: 'flask', label: 'Flask' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'spring', label: 'Spring Boot' }
]

const VISIBILITY_OPTIONS = [
  {
    type: 'PUBLIC',
    icon: Globe,
    title: 'Public',
    description: 'Anyone can see this project',
    iconColor: 'var(--brand-primary)'
  },
  {
    type: 'PRIVATE',
    icon: Lock,
    title: 'Private',
    description: 'Only you and invited collaborators can see this project',
    iconColor: 'var(--warning)'
  }
]

const Page = () => {
  const [submitting, setSubmitting] = useState(false)
  const [dataStat, setDataStat] = useState<DataStat>(INITIAL_DATA_STAT)
  const [friends, setFriends] = useState<FriendsGet | []>([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [ownRepo, setOwnRepo] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [project, setProject] = useState<ProjectData>(INITIAL_PROJECT_STATE)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE)

  const userId = useAppSelector((s) => s.user.id)
  const user = useAppSelector((state) => state.user)

  useEffect(() => {
    const controller = new AbortController()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('/api/user/findFriend')
        setFriends(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    if ((!user.githubUrl || user.githubUrl.length === 0) && user.isAuthenticated) {
      console.log('No GitHub connected, calling connect handler')
      showToast(
        true,
        'You are redirected to dashboard',
        'This happened because you were not authenticated via git, if this is persisting try later'
      )
      handleConnect()
    }

    fetchFriends()
  }, [user.isAuthenticated, user.githubUrl])

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const handleInputChange = (field: string, value: string, type: string = 'form') => {
    if (type === 'form') {
      setFormData((prev) => ({ ...prev, [field]: value }))
    } else {
      setProject((prev) => ({ ...prev, [field]: value }))
    }
  }

  const validateForm = () => {
    if (Object.values(project).some((i) => i === '')) {
      showToast(false, 'enter All project details')
      return false
    }
    if (formData.ownerName === '' || formData.repoName === '') {
      showToast(false, 'enter git details')
      return false
    }
    return true
  }

  const handleCloneRepo = async () => {
    setSubmitting(true)
    setElapsedTime(0)

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    const formDataSub = new FormData()
    const members = selectedFriends.map((id) => ({ userId: id }))

    formDataSub.append('userId', userId)
    formDataSub.append('userAuth', user.githubUrl!)
    formDataSub.append('team', JSON.stringify(members))
    formDataSub.append('project', JSON.stringify(project))
    formDataSub.append('ownerName', formData.ownerName)
    formDataSub.append('repoName', formData.repoName)
    formDataSub.append('own', String(ownRepo))

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_MAIN_BECKEND}/api/git/clonePublicRepo`, {
        method: 'POST',
        body: formDataSub
      })

      if (!res.body) {
        showToast(false, 'Something went wrong')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        chunk
          .split('\n\n')
          .filter((line) => line.startsWith('data: '))
          .forEach((line) => {
            const json = line.replace('data: ', '')
            try {
              const parsed = JSON.parse(json)
              const p = parsed.project || ''
              setDataStat({
                status: parsed.status,
                message: parsed.message,
                step: parsed.step,
                project: p
              })
            } catch (err) {
              console.warn('Failed to parse stream chunk:', json)
            }
          })
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unknown error'
      if (message === 'Invalid token') {
        showToast(false, 'Invalid token')
        handleConnect()
      }
      setDataStat({ status: 'error', message: message, step: 6, project: '' })
    }

    clearInterval(timer)
    setSubmitting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    if (!validateForm()) {
      setSubmitting(false)
      return
    }

    await handleCloneRepo()
  }

  const handleOwnRepoToggle = () => {
    setOwnRepo(!ownRepo)
    setDataStat(INITIAL_DATA_STAT)
  }

  if (!user.isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-primary flex items-center justify-center">
        <p className="text-3xl text-primary font-bold">
          Wait git Hub verifaction is going on ......
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl text-white mb-4">CLone Repo</h2>

        {/* <div className="mt-1 mb-2">
          <Button
            className={`${ownRepo === true && 'bg-accent text-accent-foreground'} cursor-pointer`}
            variant="ghost"
            onClick={handleOwnRepoToggle}
          >
            Use your repo
          </Button>
        </div> */}

        <StatusBox dataStat={dataStat} />

        <div>
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
                    onChange={(e) => handleInputChange('name', e.target.value, 'project')}
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
                    onChange={(e) => handleInputChange('ownerName', e.target.value, 'form')}
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
                    onChange={(e) => handleInputChange('repoName', e.target.value, 'form')}
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
                    onChange={(e) => handleInputChange('description', e.target.value, 'project')}
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
                  <Select onValueChange={(value) => handleInputChange('packages', value, 'project')}>
                    <SelectTrigger
                      className="bg-transparent cursor-pointer"
                      style={{
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <SelectValue placeholder="Select main language" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary text-primary cursor-pointer border-primary">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Visibility */}
                <div className="space-y-2">
                  <Label style={{ color: 'var(--text-primary)' }}>Project Visibility</Label>
                  <div className="space-y-3">
                    {VISIBILITY_OPTIONS.map((option) => {
                      const Icon = option.icon
                      const isSelected = project.type === option.type
                      return (
                        <div
                          key={option.type}
                          className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-[var(--bg-hover)]'
                              : 'bg-transparent border-[var(--border-primary)]'
                          }`}
                          onClick={() => handleInputChange('type', option.type, 'project')}
                        >
                          <Icon className="w-5 h-5 mt-0.5" style={{ color: option.iconColor }} />
                          <div>
                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {option.title}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {option.description}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-2">
                  <Label className="text-primary">Select Team Members</Label>
                  <div className="flex flex-wrap gap-4 pt-2 text-secondary">
                    {friends?.length !== 0 ? (
                      friends.map((friend) => (
                        <button
                          type="button"
                          key={friend.id}
                          onClick={() => toggleFriendSelection(friend.id)}
                          className={`rounded-full cursor-pointer size-10 flex items-center justify-center transition ${
                            selectedFriends.includes(friend.id) ? 'ring-2 ring-blue-500' : ''
                          }`}
                        >
                          <Avatar
                            className="!w-10 !text-lg h-10"
                            fullName={friend.fullName}
                            avatar={friend.avatar}
                          />
                        </button>
                      ))
                    ) : (
                      <span>You got no friends to add</span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-center pt-4">
                  <Button type="submit" className="cursor-pointer px-8">
                    {submitting
                      ? `...Creating ⏱️ Elapsed Time: ${formatTime(elapsedTime)}`
                      : 'Create Project'}
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