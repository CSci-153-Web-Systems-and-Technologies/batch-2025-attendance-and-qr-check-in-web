'use client'

import { QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';

// Define the shape of the user data we expect
type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function Dashboard({ profile }: { profile: UserProfile }) {
  const qrRef = useRef<HTMLDivElement>(null);

  // Function to download the QR Code
  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `vscan-qr-${profile.full_name}.png`;
      a.click();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* SIDEBAR - Desktop Only */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 h-screen fixed top-0 left-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="grid grid-cols-2 gap-0.5 w-8 h-8">
               <div className="bg-cyan-600 rounded-sm"></div>
               <div className="border-2 border-cyan-600 rounded-sm"></div>
               <div className="bg-cyan-600 rounded-sm opacity-50"></div>
               <div className="bg-cyan-600 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-wider text-gray-900 dark:text-white">VSCAN</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Profile
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Events
          </a>
        </nav>

        {/* User Mini Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                    {profile.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{profile.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile.email}</p>
                </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-10">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My QR Code</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal attendance QR code.</p>
            </div>
            {/* Search Bar (Optional) */}
            <div className="relative w-full md:w-64">
                <input type="text" placeholder="Search event..." className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"/>
                <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
        </header>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: The QR Card (Spans 2 columns on large screens) */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center text-center relative overflow-hidden">
                    {/* Decorative Background Blob */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10"></div>
                    
                    <div className="relative z-10 mt-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Scan to Check-in</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Show this code to the event organizer.</p>
                        
                        {/* THE QR CODE */}
                        <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 inline-block mb-8">
                            <QRCodeCanvas 
                                value={profile.id} // We encode the User ID
                                size={220}
                                level={"H"} // High error correction
                                includeMargin={true}
                            />
                            <div className="mt-2 text-xs font-mono text-gray-400 uppercase tracking-widest">ID: {profile.id.slice(0, 8)}...</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
                            <button onClick={downloadQR} className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Info Cards */}
            <div className="space-y-6">
                
                {/* Profile Card */}
                <div className="bg-white dark:bg-[#111] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Profile Info
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{profile.full_name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{profile.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Account Role</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-1 capitalize">
                                {profile.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Instructions Card - Improved Design */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            How it works
                        </h3>
                        <ul className="space-y-3 text-sm text-indigo-100">
                            <li className="flex gap-2">
                                <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                                Arrive at the event venue.
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                                Show this QR code to the scanner.
                            </li>
                            <li className="flex gap-2">
                                <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                                Wait for the "Success" beep!
                            </li>
                        </ul>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}