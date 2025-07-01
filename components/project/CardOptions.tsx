'use client'

import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import React from 'react'

type CardOptionsProps = {
  icon: LucideIcon
  action: 'rename' | 'delete' | 'manage-team'
  name: string
}

const CardOptions = ({ icon: Icon, action, name }: CardOptionsProps) => {
    const handleAction = () => {
        switch (action) {
          case 'rename':
            toast(
              <div>
                <p className="font-medium">Rename Project</p>
                <p className="text-sm text-muted-foreground">Rename modal would open here.</p>
              </div>
            )
            break
          case 'delete':
            toast.error(
              <div className='bg-[var(--bg-secondary)]'>
                <p className="font-medium">Delete Project</p>
                <p className="text-sm text-muted-foreground">Are you sure you want to delete this project?</p>
              </div>
            )
            break
          case 'manage-team':
            toast(
              <div>
                <p className="font-medium">Manage Team</p>
                <p className="text-sm text-muted-foreground">Team management would open here.</p>
              </div>
            )
            break
          default:
            toast.error('Unknown action')
        }
      }

  return (
    <DropdownMenuItem onClick={handleAction} className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {name}
    </DropdownMenuItem>
  )
}

export default CardOptions
