'use client'

import { useState, useMemo } from "react"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, ArrowRight, Clock, CalendarDays, FilterX, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import ManualCheckInModal from "./ManualCheckInModal"

type AttendeeRecord = {
  id: string
  check_in_time: string        
  check_out_time: string | null 
  status: string
  profiles: {
    full_name: string
    email: string
    avatar_url?: string 
  } | null
  events: {
    id: string
    title: string
    location?: string
  } | null
}

export default function AttendeesList({ 
  initialData, 
  events 
}: { 
  initialData: AttendeeRecord[], 
  events: { id: string, title: string }[] 
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")

  const filterOptions = useMemo(() => {
    if (events && events.length > 0) return events;
    
    const eventsMap = new Map();
    initialData.forEach(item => {
      if (item.events) {
        eventsMap.set(item.events.id, item.events.title);
      }
    });
    return Array.from(eventsMap.entries()).map(([id, title]) => ({ id, title }));
  }, [initialData, events]);

  const filteredAttendees = initialData.filter(record => {
    const searchLower = searchTerm.toLowerCase()
    const nameMatch = record.profiles?.full_name.toLowerCase().includes(searchLower)
    const emailMatch = record.profiles?.email.toLowerCase().includes(searchLower)
    
    const matchesStatus = statusFilter === "all" ? true : record.status === statusFilter
    const matchesEvent = eventFilter === "all" ? true : record.events?.id === eventFilter

    return (nameMatch || emailMatch) && matchesStatus && matchesEvent
  })

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setEventFilter("all")
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return <span className="text-gray-300 dark:text-gray-700 text-xs">--:--</span>;
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "??";

  return (
    <div className="space-y-6">
      
      {/* --- FILTER BAR --- */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white dark:bg-[#111] p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-96 group">
            <div className="absolute left-3 top-3 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-md transition-colors group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30">
                <Search className="h-3.5 w-3.5 text-gray-500 group-hover:text-purple-600" />
            </div>
            <Input 
                placeholder="Search name or email..." 
                className="pl-12 h-11 border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            
            <ManualCheckInModal events={events} />

            {/* Event Filter */}
            <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 border-0 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-0 rounded-xl transition-colors">
                    <div className="flex items-center gap-2 truncate">
                        <CalendarDays className="w-4 h-4 text-gray-500" />
                        <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                            {eventFilter === 'all' ? 'All Events' : filterOptions.find(e => e.id === eventFilter)?.title}
                        </span>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {filterOptions.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-11 border-0 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-0 rounded-xl transition-colors">
                    <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="checked-in">🟢 Present</SelectItem>
                    <SelectItem value="checked-out">⚪ Checked Out</SelectItem>
                </SelectContent>
            </Select>

            {/* Reset Button (Conditional) */}
            {(searchTerm || statusFilter !== 'all' || eventFilter !== 'all') && (
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={clearFilters}
                    className="h-11 w-11 rounded-xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 text-gray-400 transition-colors"
                    title="Clear filters"
                >
                    <FilterX className="w-5 h-5" />
                </Button>
            )}
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[350px] pl-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Participant</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Event</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">In</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Out</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right pr-8">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                        <Search className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">No attendees found</p>
                    <p className="text-sm opacity-60 max-w-xs mx-auto mt-1">
                        We couldn't find any participants matching your current filters.
                    </p>
                    <Button variant="link" onClick={clearFilters} className="mt-2 text-indigo-500">
                        Clear all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendees.map((record) => (
                <TableRow key={record.id} className="group border-b border-gray-50 dark:border-gray-800/50 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors">
                  
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800 shadow-sm ring-2 ring-transparent group-hover:ring-purple-100 dark:group-hover:ring-purple-900 transition-all">
                        <AvatarImage src={record.profiles?.avatar_url} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-600 dark:text-indigo-300 font-bold">
                            {getInitials(record.profiles?.full_name || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100 text-base group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                            {record.profiles?.full_name || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {record.profiles?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* EVENT */}
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                            {record.events?.title}
                        </span>
                        {record.events?.location && (
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {record.events.location}
                            </span>
                        )}
                    </div>
                  </TableCell>

                  {/* CHECK IN TIME */}
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                        <LogIn className="w-3 h-3 text-green-600 mr-1.5" />
                        <span className="font-mono text-xs font-semibold text-green-700 dark:text-green-400">
                            {formatTime(record.check_in_time)}
                        </span>
                    </div>
                  </TableCell>

                  {/* CHECK OUT TIME */}
                  <TableCell className="text-center">
                    {record.check_out_time ? (
                        <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <LogOut className="w-3 h-3 text-gray-400 mr-1.5" />
                            <span className="font-mono text-xs font-semibold text-gray-600 dark:text-gray-400">
                                {formatTime(record.check_out_time)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-300 dark:text-gray-700 text-xs font-mono">-</span>
                    )}
                  </TableCell>

                  {/* STATUS BADGE */}
                  <TableCell className="text-right pr-8">
                    {record.status === 'checked-in' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-500/30 uppercase tracking-wide shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5 animate-pulse" />
                            Active
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 uppercase tracking-wide">
                            Done
                        </span>
                    )}
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}