'use client'

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Added import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/updateProfile";
import { toast } from "sonner";
import { Loader2, Camera, User, Mail, Shield, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileData = {
  full_name: string;
  email: string;
  role: string;
  avatar_url?: string;
};

export default function SettingsForm({ profile }: { profile: ProfileData }) {
  const router = useRouter(); // Initialize router
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(profile.avatar_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    setLoading(false);
    if (result.success) {
      toast.success("Profile updated successfully");
      router.refresh(); // REFRESH THE PAGE DATA
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      {/* 1. HERO SECTION (Banner style) */}
      <div className="relative h-32 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className="px-8 pb-8">
        {/* AVATAR - Floating over the banner */}
        <div className="relative -mt-12 mb-8 flex items-end justify-between">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white dark:border-[#111] shadow-2xl ring-2 ring-purple-100 dark:ring-purple-900/30">
                    <AvatarImage src={preview || ""} className="object-cover" />
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                        {profile.full_name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-[2px]">
                    <Camera className="w-8 h-8 text-white/90" />
                </div>
                
                <input 
                    ref={fileInputRef} 
                    type="file" 
                    name="avatar" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                />
            </div>

            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="hidden sm:flex gap-2 rounded-xl border-gray-200 dark:border-gray-800 shadow-sm"
            >
                <Upload className="w-4 h-4" />
                Change Photo
            </Button>
        </div>

        {/* 2. FORM FIELDS */}
        <div className="space-y-6 max-w-2xl">
            
            <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                    Full Name
                </Label>
                <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                        name="full_name" 
                        defaultValue={profile.full_name} 
                        className="pl-10 h-11 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-800 focus-visible:ring-purple-500 transition-all"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                        Email Address
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input 
                            defaultValue={profile.email} 
                            disabled 
                            className="pl-10 h-11 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed" 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                        Account Role
                    </Label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input 
                            defaultValue={profile.role} 
                            disabled 
                            className="pl-10 h-11 rounded-xl bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-800 opacity-60 capitalize cursor-not-allowed" 
                        />
                    </div>
                </div>
            </div>

            {/* 3. FOOTER ACTIONS */}
            <div className="pt-6 flex justify-end">
                <Button 
                    type="submit" 
                    disabled={loading}
                    className="h-11 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Changes
                </Button>
            </div>
        </div>
      </div>
    </form>
  );
}