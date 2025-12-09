'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Upload, X, Loader2, Plus, Sparkles, Image as ImageIcon } from "lucide-react"
import { createEvent } from '@/app/actions/createEvent'

export default function CreateEventModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createEvent(formData)

    setLoading(false)
    if (result?.success) {
      setOpen(false)
      setPreview(null) // Reset preview
    } else {
      alert(result?.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 shadow-md transition-transform active:scale-95">
          <Plus className="w-4 h-4" /> 
          <span className="hidden sm:inline">New Event</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl bg-white dark:bg-[#0a0a0a]">
        
        {/* HEADER WITH SUBTLE GRADIENT */}
        <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-[#0a0a0a] p-6 border-b border-gray-100 dark:border-gray-800">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Create New Event
                </DialogTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Set up your event details and generate a QR pass.
                </p>
            </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* IMAGE UPLOAD BANNER */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">Event Cover</Label>
            <div 
                className="relative group cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className={`
                    relative h-40 rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden flex flex-col items-center justify-center
                    ${preview 
                        ? 'border-purple-500/50' 
                        : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 hover:border-purple-300'}
                `}>
                    {preview ? (
                        <>
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white font-medium flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Change Image
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-4">
                            <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center mx-auto mb-3 text-purple-600 dark:text-purple-400">
                                <Upload className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Click or drag cover image
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
                        </div>
                    )}
                </div>
                <input 
                    ref={fileInputRef}
                    type="file" 
                    name="cover_image" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                />
            </div>
          </div>

          {/* EVENT DETAILS */}
          <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">Event Name</Label>
                <Input 
                    name="title" 
                    placeholder="e.g. Tech Summit 2025" 
                    required 
                    className="h-11 bg-white dark:bg-black/20 border-gray-200 dark:border-gray-800 focus:border-purple-500 transition-colors" 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">Date & Time</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        <Input 
                            name="start_time" 
                            type="datetime-local" 
                            required 
                            className="pl-10 h-11 bg-white dark:bg-black/20 border-gray-200 dark:border-gray-800 focus:border-purple-500"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">Location</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        <Input 
                            name="location" 
                            placeholder="Venue..." 
                            required 
                            className="pl-10 h-11 bg-white dark:bg-black/20 border-gray-200 dark:border-gray-800 focus:border-purple-500"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">Description</Label>
                <Textarea 
                    name="description" 
                    placeholder="What is this event about?" 
                    className="resize-none h-20 bg-white dark:bg-black/20 border-gray-200 dark:border-gray-800 focus:border-purple-500" 
                />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                Cancel
            </Button>
            <Button 
                type="submit" 
                disabled={loading} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 shadow-lg shadow-purple-500/20"
            >
                {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                ) : (
                    "Publish Event"
                )}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}