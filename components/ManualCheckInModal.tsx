'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Loader2, UserPlus, LogIn, LogOut, ScanLine, User } from "lucide-react"
import { searchUsersForEvent } from '@/app/actions/manualCheckIn'
import { logAttendance } from '@/app/actions/scan'
import { toast } from 'sonner'

type Event = { id: string; title: string }
type UserResult = { 
    id: string
    full_name: string
    email: string
    avatar_url?: string
    role: string
    status: string | null 
}

export default function ManualCheckInModal({ events }: { events: Event[] }) {
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

  const handleToggle = async (userId: string, currentStatus: string | null) => {
    const response = await logAttendance(userId, selectedEventId)
    
    if (response.success) {
        toast.success(response.message)
        setResults(prev => prev.map(u => 
            u.id === userId 
            ? { ...u, status: response.status || 'checked-in' }
            : u
        ))
    } else {
        toast.error(response.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-white dark:bg-[#111] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 shadow-sm transition-all active:scale-95 h-11 px-4">
          <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" /> 
          <span className="hidden sm:inline">Manual Check-in</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-[#0a0a0a] p-6 border-b border-gray-100 dark:border-gray-800">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                    <ScanLine className="w-5 h-5 text-purple-600" />
                    Manual Check-in
                </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Search for a participant to manually update their status.
            </p>
        </div>

        <div className="p-6 space-y-6">
            
            {/* 1. Event Selector */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Target Event</label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger className="h-11 bg-gray-50 dark:bg-gray-900 border-0 focus:ring-1 focus:ring-purple-500 rounded-xl">
                        <SelectValue placeholder="Select Event" />
                    </SelectTrigger>
                    <SelectContent>
                        {events.map(e => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* 2. Search Bar */}
            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute left-3 top-3 p-0.5 bg-white dark:bg-black rounded-md shadow-sm">
                    <Search className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <Input 
                    placeholder="Search name or email..." 
                    className="pl-12 h-11 border-gray-200 dark:border-gray-800 focus:border-purple-500 rounded-xl transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button 
                    type="submit" 
                    size="sm" 
                    className="absolute right-1.5 top-1.5 h-8 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 rounded-lg px-4"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Find"}
                </Button>
            </form>

            {/* 3. Results Area */}
            <div className="mt-2 min-h-[100px] max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {results.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        {query.length > 1 ? (
                            <>
                                <User className="w-10 h-10 mb-2 opacity-20" />
                                <p className="text-sm">No participants found.</p>
                            </>
                        ) : (
                            <p className="text-xs">Enter a name to begin searching.</p>
                        )}
                    </div>
                )}
                
                {results.map(user => (
                    <div key={user.id} className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-sm transition-all duration-200">
                        
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Avatar className="h-10 w-10 border border-gray-100 dark:border-gray-700 shadow-sm">
                                <AvatarImage src={user.avatar_url} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 text-indigo-600 dark:text-indigo-300 font-bold text-xs">
                                    {user.full_name.substring(0,2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                                    {user.full_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="flex items-center gap-3">
                            {user.status === 'checked-in' ? (
                                <>
                                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                        Present
                                    </span>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleToggle(user.id, user.status)}
                                        className="h-8 w-8 p-0 sm:w-auto sm:px-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20"
                                        title="Check Out"
                                    >
                                        <LogOut className="w-3.5 h-3.5 sm:mr-1.5" /> 
                                        <span className="hidden sm:inline">Check Out</span>
                                    </Button>
                                </>
                            ) : (
                                <Button 
                                    size="sm" 
                                    onClick={() => handleToggle(user.id, user.status)}
                                    className="h-8 gap-1.5 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 border-0 shadow-md shadow-purple-500/10"
                                >
                                    <LogIn className="w-3.5 h-3.5" /> 
                                    <span>Check In</span>
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