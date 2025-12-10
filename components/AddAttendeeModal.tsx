'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Loader2, UserPlus, UserCheck, X } from "lucide-react"
import { searchUsersForEvent } from '@/app/actions/manualCheckIn'
import { registerAttendee } from '@/app/actions/registerAttendee'
import { toast } from 'sonner'
import { cn } from "@/lib/utils"

type Event = { id: string; title: string }
type UserResult = { 
    id: string
    full_name: string
    email: string
    avatar_url?: string
    role: string
    status: string | null 
}

export default function AddAttendeeModal({ events }: { events: Event[] }) {
  const [open, setOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<UserResult[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEventId) {
        toast.error("Please select an event first")
        return
    }
    setLoading(true)
    const res = await searchUsersForEvent(query, selectedEventId)
    setResults(res.users)
    setLoading(false)
  }

  const handleRegister = async (userId: string) => {
    const res = await registerAttendee(userId, selectedEventId)
    
    if (res.success) {
        toast.success(res.message)
        // Update local state
        setResults(prev => prev.map(u => 
            u.id === userId ? { ...u, status: 'registered' } : u
        ))
    } else {
        toast.error(res.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* UPDATED: Matches Organizer "New Event" Button Style (Purple Gradient) */}
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20 border-0 transition-all active:scale-95">
          <UserPlus className="w-4 h-4" /> 
          <span className="hidden sm:inline">Register Attendee</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent showCloseButton={false} className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white dark:bg-[#0a0a0a] border-0 shadow-2xl rounded-2xl">
        
        {/* HEADER: Updated to Purple/Indigo Theme */}
        <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 p-6 shrink-0 text-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-24 h-24 bg-purple-400/20 rounded-full blur-xl pointer-events-none"></div>

            <DialogHeader className="relative z-10">
                <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
                    <UserPlus className="w-6 h-6 text-purple-100" />
                    Register Attendee
                </DialogTitle>
                <p className="text-purple-50 text-sm mt-1 opacity-90">
                    Search and manually add guests to your event list.
                </p>
            </DialogHeader>

            {/* Custom Close Button */}
            <button 
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors outline-none focus:ring-2 focus:ring-white/50"
            >
                <X className="w-4 h-4" />
            </button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Event Selector */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Target Event</label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger className="h-11 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:ring-purple-500 rounded-xl">
                        <SelectValue placeholder="Select Event" />
                    </SelectTrigger>
                    <SelectContent>
                        {events.map(e => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Search Bar */}
            <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Find User</label>
                <form onSubmit={handleSearch} className="relative group">
                    <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <Input 
                        placeholder="Search by name or email..." 
                        className="pl-10 pr-24 h-12 rounded-xl bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 focus-visible:ring-purple-500 shadow-sm text-base"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button 
                        type="submit" 
                        size="sm" 
                        className="absolute right-1.5 top-1.5 h-9 px-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 rounded-lg transition-all"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Search"}
                    </Button>
                </form>
            </div>

            {/* Results Area */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 -mr-2">
                {results.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-white/5">
                        {query ? (
                            <>
                                <p className="text-gray-900 dark:text-white font-medium text-sm">No users found</p>
                                <p className="text-xs text-gray-500">Try a different name or email address.</p>
                            </>
                        ) : (
                            <>
                                <Search className="w-8 h-8 text-gray-300 mb-2" />
                                <p className="text-xs text-gray-500">Enter a keyword to begin searching.</p>
                            </>
                        )}
                    </div>
                )}

                {results.map(user => (
                    <div key={user.id} className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-200">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Avatar className="h-10 w-10 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <AvatarImage src={user.avatar_url} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 text-purple-600 dark:text-purple-300 font-bold text-xs">
                                    {user.full_name.substring(0,2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {user.full_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>

                        <div className="shrink-0 ml-2">
                            {user.status ? (
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1.5 border",
                                    user.status === 'registered' 
                                        ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-900/50"
                                        : "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50"
                                )}>
                                    <UserCheck className="w-3 h-3" />
                                    {user.status === 'registered' ? 'Listed' : 'Checked In'}
                                </span>
                            ) : (
                                <Button 
                                    size="sm" 
                                    onClick={() => handleRegister(user.id)} 
                                    className="h-8 bg-white dark:bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 border border-purple-200 dark:border-purple-800 shadow-sm"
                                >
                                    <UserPlus className="w-3.5 h-3.5 mr-1.5" /> 
                                    Register
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}