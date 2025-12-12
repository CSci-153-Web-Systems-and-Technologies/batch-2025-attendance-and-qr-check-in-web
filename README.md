# VSCAN 📱

> **Stop Herding Cats. Start Managing Events.**

VSCAN is a modern, web-based event management and attendance tracking platform designed to streamline the check-in process. It bridges the gap between organizers and attendees using secure digital passes, real-time QR scanning, and live analytics.

---

## 📑 Table of Contents

- [Features](#-features)
  - [Organizer Features](#organizer-features)
  - [Participant Features](#participant-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🚀 Features

### **Organizer Features**
* **Dashboard & Analytics:**
    * **Real-time Overview:** Live counters for total participants, active check-ins, and event distribution.
    * **Visual Charts:** Interactive Area and Pie charts to visualize attendance trends and event popularity.
    * **Data Export:** One-click CSV export of all attendance records for offline reporting.
* **Event Management:**
    * **Create & Edit:** Full control to publish events with cover images, locations, and detailed schedules.
    * **Asset Management:** Integrated file upload for event banners.
* **Smart Scanner Module:**
    * **In-App Camera:** Built-in high-speed QR code scanner (using `@yudiel/react-qr-scanner`).
    * **Duplicate Detection:** Prevents double check-ins and provides instant "Already Scanned" alerts.
    * **Check-in/Out Logic:** Automatically toggles status between "Checked In" and "Checked Out" based on previous scans.
* **Roster Control:**
    * **Manual Check-in:** Searchable user list to manually update status for attendees without phones.
    * **On-the-fly Registration:** Register new users to an event directly from the dashboard.

### **Participant Features**
* **Digital Pass:**
    * **Unique QR Code:** auto-generated, high-security QR code serves as a universal ticket.
    * **Downloadable Ticket:** Option to save the QR pass to the device gallery for offline access.
* **Event History:**
    * **Timeline View:** A visual history of all past and current events attended with timestamps.
    * **Live Status:** Status badges indicating if currently "Checked In" or event is "Completed".
* **Profile Management:**
    * **Personalization:** Update profile details and upload custom avatars.

---

## 🛠 Tech Stack

**Frontend:**
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (with `clsx` & `tailwind-merge`)
* **Components:** Shadcn UI / Radix UI primitives
* **Charts:** `recharts`
* **Icons:** `lucide-react`
* **QR Tools:** `qrcode.react` (Generation) & `@yudiel/react-qr-scanner` (Scanning)

**Backend & Services:**
* **BaaS:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Realtime)
* **Auth:** Supabase Auth (Email/Password)
* **Server Actions:** Native Next.js Server Actions for mutations and data fetching.

---

## 🗄 Database Schema

The application relies on the following Supabase tables:

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| **profiles** | User metadata and roles | `id`, `full_name`, `email`, `role` ('organizer'/'participant'), `avatar_url` |
| **events** | Event details created by organizers | `id`, `organizer_id`, `title`, `start_time`, `end_time`, `cover_image_url` |
| **attendance** | Links users to events with status | `id`, `user_id`, `event_id`, `status` ('registered'/'checked-in'), `check_in_time` |

> **Storage Buckets:**
> * `avatars`: Stores user profile pictures.
> * `event-covers`: Stores event banner images.

---

## 🏁 Getting Started

### Prerequisites
* Node.js 18+
* A Supabase Project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/vscan.git](https://github.com/yourusername/vscan.git)
    cd vscan
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Database Setup:**
    Ensure your Supabase project has the tables described above. You may need to configure Row Level Security (RLS) policies to ensure organizers can only edit their own events.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory. You must configure these keys for the app to function correctly.

| Variable Name | Description | Required? |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | **Yes** |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` | Your Supabase Anon Key | **Yes** |

> **⚠️ Security Note:** Never commit `.env.local` to version control.

---

## 🚀 Deployment

The project is optimized for deployment on **Vercel**.

### Deployment Checklist
1.  **Push code** to GitHub/GitLab.
2.  **Import project** into Vercel.
3.  **Configure Environment Variables** in the Vercel dashboard (copy values from `.env.local`).
4.  **Build Command:** `next build` (Default)
5.  **Output Directory:** `.next` (Default)

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

---

**Current Version:** 1.0.0