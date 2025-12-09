'use client'

import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Settings, User, ChevronsUpDown } from "lucide-react"

// Define the shape of the profile prop
type UserProfile = {
  full_name: string;
  email: string;
  role: string;
}

export default function SignOutButton({ profile }: { profile: UserProfile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      {/* THE TRIGGER: This replaces your old "Mini Profile" section */}
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group outline-none">
            {/* User Avatar */}
            <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
                <AvatarFallback className="bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-bold text-xs">
                    {profile.full_name.charAt(0)}
                </AvatarFallback>
            </Avatar>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {profile.full_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {profile.email}
                </p>
            </div>

            {/* Icon indicating it's a menu */}
            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      {/* THE MENU CONTENT: Appears ABOVE the button (side="top") */}
      <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">{profile.role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
            onClick={handleSignOut} 
            disabled={loading}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 gap-2"
        >
            <LogOut className="w-4 h-4" />
            <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}