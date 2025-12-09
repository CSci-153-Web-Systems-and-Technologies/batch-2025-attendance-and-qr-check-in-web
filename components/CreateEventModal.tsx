'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Upload, Image as ImageIcon, Loader2, Plus } from "lucide-react"
import { createEvent } from '@/app/actions/createEvent'

export default function CreateEventModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  // Handle file selection for preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
      setOpen(false) // Close modal on success
      setPreview(null) // Reset preview
    } else {
      alert(result?.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* This triggers the modal */}
        <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90">
          <Plus className="w-4 h-4" /> Create New Event
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          {/* Cover Image Upload (The "Big Purple Box" improved) */}
          <div className="space-y-2">
            <Label>Event Cover</Label>
            <div className="relative group cursor-pointer">
                <div className={`
                    border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center text-center transition-all overflow-hidden
                    ${preview ? 'border-purple-500' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'}
                `}>
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="space-y-2 p-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto text-purple-600">
                                <Upload className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Click to upload cover image</p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                    )}
                </div>
                {/* Hidden File Input */}
                <input 
                    type="file" 
                    name="cover_image" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                />
            </div>
          </div>

          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Name</Label>
            <Input id="title" name="title" placeholder="e.g. Tech Summit 2025" required className="bg-white dark:bg-gray-900" />
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <Label htmlFor="start_time">Date & Time</Label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                    id="start_time" 
                    name="start_time" 
                    type="datetime-local" 
                    required 
                    className="pl-10 bg-white dark:bg-gray-900 block"
                />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input id="location" name="location" placeholder="e.g. Convention Hall A" required className="pl-10 bg-white dark:bg-gray-900" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
                id="description" 
                name="description" 
                placeholder="What is this event about?" 
                className="resize-none h-24 bg-white dark:bg-gray-900" 
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6">
            {loading ? (
                <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Event...
                </>
            ) : "Publish Event"}
          </Button>

        </form>
      </DialogContent>
    </Dialog>
  )
}