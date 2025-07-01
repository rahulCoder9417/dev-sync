import React from 'react'
import { Button } from '../ui/button'
import { Bell } from 'lucide-react'

const LaptopNotify = () => {
    return (
        <div className='bg-inherit flex gap-10 mr-5'>
            {/* Bell icon */}
            <Button variant="ghost" size="icon" className="relative cursor-pointer mt-2">
                <Bell className="w-5 h-5 md:w-10 md:h-6 " />
                <span className={`absolute -top-1 -right-1 w-3 h-3 p-2 rounded-full text-xs flex items-center justify-center text-white`} style={{ background: 'var(--error)' }}>
                    3
                </span>
            </Button>
            {/* User avatar */}
            <div className="flex items-center  space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    AC
                </div>
            </div>
        </div>
  )
}

export default LaptopNotify