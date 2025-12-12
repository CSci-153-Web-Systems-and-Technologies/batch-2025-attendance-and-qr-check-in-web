'use client'

import { useState } from "react"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trash2, Edit, Loader2, MoreHorizontal, Search, FilterX, Clock, ArrowRight } from "lucide-react"
import { deleteEvent } from "@/app/actions/events"
import { toast } from "sonner"
import EditEventModal from "./EditEventModal"

type Event = {
  id: string
  title: string
  location: string
  start_time: string
  end_time?: string
  created_at: string
  description?: string
  cover_image_url?: string
}

export default function EventsList({ events }: { events: Event[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter Logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const now = new Date()
    const start = new Date(event.start_time)
    const end = event.end_time ? new Date(event.end_time) : new Date(start.getTime() + 3600000)
    
    let status = 'upcoming'
    if (now > end) status = 'completed'
    else if (now >= start && now <= end) status = 'live'

    const matchesStatus = statusFilter === 'all' ? true : status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white dark:bg-[#111] p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative w-full sm:w-96 group">
            <div className="absolute left-3 top-3 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-md transition-colors group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30">
                <Search className="h-3.5 w-3.5 text-gray-500 group-hover:text-purple-600" />
            </div>
            <Input 
                placeholder="Search events..." 
                className="pl-12 h-11 border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-11 border-0 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-0 rounded-xl transition-colors">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="live">🔴 Live Now</SelectItem>
                    <SelectItem value="upcoming">bx Upcoming</SelectItem>
                    <SelectItem value="completed">✓ Completed</SelectItem>
                </SelectContent>
            </Select>
            
            {(searchTerm || statusFilter !== 'all') && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                    className="h-11 w-11 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <FilterX className="w-5 h-5" />
                </Button>
            )}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/80 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[350px] pl-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Event</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Date</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Schedule</TableHead>
              <TableHead className="py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                        <Calendar className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">No events found</p>
                    <p className="text-sm opacity-60 max-w-xs mx-auto mt-1">
                        Try adjusting your search filters or create a new event.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function EventRow({ event }: { event: Event }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteEvent(event.id)
    
    if (result.success) {
      toast.success("Event deleted successfully")
    } else {
      toast.error(result.error)
    }
    setIsDeleting(false)
    setIsDeleteOpen(false)
  }

  const startDate = new Date(event.start_time)
  const endDate = event.end_time ? new Date(event.end_time) : null
  const now = new Date()
  
  // Status Logic
  let statusBadge;
  if (endDate && now > endDate) {
      statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">Completed</span>
  } else if (now >= startDate && (!endDate || now <= endDate)) {
      statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-900/50"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />Live Now</span>
  } else {
      statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">Upcoming</span>
  }

  return (
    <TableRow className="group border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
      
      {/* Event Details */}
      <TableCell className="pl-8 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0 shadow-sm relative">
             {event.cover_image_url ? (
                 <img src={event.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {event.title.charAt(0)}
                 </div>
             )}
          </div>
          <div>
            <span className="block text-gray-900 dark:text-gray-100 font-bold text-sm">{event.title}</span>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{event.location}</span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>{statusBadge}</TableCell>

      {/* Date */}
      <TableCell>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 text-gray-400" />
            {startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </TableCell>

      {/* Schedule */}
      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {startDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-300" />
                <span className="font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {endDate ? endDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '--:--'}
                </span>
            </div>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right pr-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsEditOpen(true)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Edit Modal */}
        <EditEventModal 
            event={{
                id: event.id,
                title: event.title,
                location: event.location,
                start_time: event.start_time,
                end_time: event.end_time,
                description: event.description || "",
                cover_image_url: event.cover_image_url
            }} 
            open={isEditOpen} 
            onOpenChange={setIsEditOpen} 
        />

        {/* Delete Alert */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{event.title}</strong> and all attendance records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </TableCell>
    </TableRow>
  )
}