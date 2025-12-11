'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Upload, Loader2, Edit, Image as ImageIcon, X } from "lucide-react"
import { updateEvent } from '@/app/actions/updateEvent'
import { toast } from 'sonner'

type EventData = {
  id: string
  title: string
  location: string
  description: string
  start_time: string
  end_time?: string
  cover_image_url?: string
}

interface EditEventModalProps {
  event: EventData
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function EditEventModal({ event, open: controlledOpen, onOpenChange: setControlledOpen }: EditEventModalProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? setControlledOpen : setInternalOpen

  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(event.cover_image_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync preview when event changes or modal opens
  useEffect(() => {
    if (open) {
        setPreview(event.cover_image_url || null)
    }
  }, [open, event.cover_image_url])

  // Helper to format date for datetime-local input
  const formatDateForInput = (isoString?: string) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    const offset = date.getTimezoneOffset() * 60000
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16)
    return localISOTime
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    formData.append('event_id', event.id)

    const result = await updateEvent(formData)

    setLoading(false)
    if (result?.success) {
      toast.success("Event updated successfully!")
      if (setOpen) setOpen(false)
      router.refresh()
    } else {
      toast.error(result?.error || "Failed to update event")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Edit className="w-4 h-4" />
            </Button>
        </DialogTrigger>
      )}
      
      {/* ADDED showCloseButton={false} TO REMOVE THE DUPLICATE X */}
      <DialogContent showCloseButton={false} className="sm:max-w-[550px] max-h-[90vh] flex flex-col p-0 border-0 shadow-2xl rounded-2xl bg-white dark:bg-[#0a0a0a] overflow-hidden">
        
        <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-8 shrink-0 text-white overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>

            <DialogHeader className="relative z-10 text-left">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Edit className="w-6 h-6 text-blue-100" />
                    Edit Event
                </DialogTitle>
                <p className="text-blue-50 text-sm mt-1 opacity-90">
                    Update details for <span className="font-semibold text-white">{event.title}</span>
                </p>
            </DialogHeader>

            {/* This Custom Close Button stays */}
            {setOpen && (
                <button 
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-black/20">
            <form id="edit-event-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            
                {/* UPLOAD SECTION */}
                <div className="bg-white dark:bg-[#111] p-1 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div 
                        className="relative group cursor-pointer h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 transition-all flex flex-col items-center justify-center overflow-hidden"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                                    <ImageIcon className="w-8 h-8 text-white mb-2" />
                                    <p className="text-white font-medium text-sm">Change Cover Image</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-6 transition-transform group-hover:scale-105 duration-300">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 shadow-sm">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                                    Upload Event Cover
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Drag & drop or click to browse</p>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" name="cover_image" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>
                </div>

                {/* FIELDS */}
                <div className="space-y-5">
                    
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Event Name</Label>
                        <Input 
                            name="title" 
                            defaultValue={event.title} 
                            required 
                            className="h-12 bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500 rounded-xl text-base shadow-sm" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Start</Label>
                            <div className="relative group">
                                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                <Input 
                                    name="start_time" 
                                    type="datetime-local" 
                                    defaultValue={formatDateForInput(event.start_time)}
                                    required 
                                    className="pl-10 h-12 bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500 rounded-xl shadow-sm text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">End</Label>
                            <div className="relative group">
                                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                <Input 
                                    name="end_time" 
                                    type="datetime-local" 
                                    defaultValue={formatDateForInput(event.end_time)}
                                    required 
                                    className="pl-10 h-12 bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500 rounded-xl shadow-sm text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Location</Label>
                        <div className="relative group">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                            <Input 
                                name="location" 
                                defaultValue={event.location}
                                required 
                                className="pl-10 h-12 bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500 rounded-xl shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Description</Label>
                        <Textarea 
                            name="description" 
                            defaultValue={event.description}
                            className="resize-none min-h-[100px] bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500 rounded-xl shadow-sm p-4" 
                        />
                    </div>
                </div>
            </form>
        </div>

        <div className="p-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shrink-0 flex items-center justify-end gap-3">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setOpen && setOpen(false)}
                className="h-11 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
            >
                Cancel
            </Button>
            <Button 
                form="edit-event-form" 
                type="submit" 
                disabled={loading} 
                className="h-11 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}