# 🚀 Locomotion | Agency Workload & Project Management Hub

Modern internal operational dashboard built for digital agency **"Locomotion"**. Designed to centralize client brand deliverables, provide private self-directed staff workspaces, and provide executive management with a real-time capacity and workload radar.

![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?style=for-the-badge&logo=prisma)
![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-black?style=for-the-badge)

---

## ✨ Key Features

### 1. 🔐 Authentication & Role-Based Access Control (RBAC)
- **Two Roles**: `Staff` and `Management`.
- **Profile Management**: Full Name, Job Position, Department (`Creative`, `Media`, `Strategy`, `Tech`, `Accounts`), Username, and Password (updatable with bcrypt).
- **1-Click Persona Switcher**: Test both roles instantly with demo accounts directly from the UI header or login page.

### 2. 🌐 Global Project & Brand Hub (Accessible to All Users)
- **Centralized Agency Roster**: Track active brand engagements (e.g., *Nike Global*, *Spotify Studios*, *Red Bull*, *Apple Music*).
- **Structured Briefing**: Clear blocks for **Client Brief**, **Strategic Goals & KPIs**, and **Agency Scope**.
- **Deliverables Hub**: Dedicated master URLs for:
  - 🌐 **Preview Links** (Interactive WebGL / Staging)
  - 📊 **Pitch Deck** (Google Slides / Keynote)
  - 🎨 **Creative Deck** (Figma Master Tokens / Miro)
  - 📦 **Final Assets** (Google Drive / Frame.io)
  - Dynamic table to attach custom deliverable URLs.
- **Automated PIC Display**: Queries linked tasks in SQLite in real-time to automatically display every Staff member currently working on the project.
- **Quick Action**: *"Add My Task for this Project"* button creates a linked task directly in the logged-in staff member's personal dashboard.

### 3. 💼 Staff Dashboard (Individual Workspace)
- **Privacy Constraint**: Staff members can **only** view and manage their own tasks.
- **Self-Directed Tasks**: Create tasks with Title, Description, Priority (`URGENT`, `HIGH`, `MEDIUM`, `LOW`), Estimated Hours, Due Date, and relational dropdown **"Related Project"**.
- **Task Status Lifecycle**: Fast toggling between `To Do`, `On Progress`, and `Done`.
- **Task Archive**: Completed tasks automatically move to the **Archive** tab with completion timestamps.

### 4. 📊 Management Dashboard (Global Overview)
- **Workload Tracking**: Agency-wide view of all staff workloads across departments.
- **Capacity Monitoring Radar**: Color-coded capacity meter and progress bars based on a standard 5-task threshold:
  - 🔴 **Overloaded (&ge; 5 tasks)**: Immediate burnout risk alert.
  - 🔵 **Optimal (2–4 tasks)**: Healthy in-flow capacity.
  - 🟢 **Available / Idle (0–1 tasks)**: Highlighted as ready for new client pitches & assignments.
- **Interactive Drill-Down**: Expand any staff member to view their active project deliverables and client deadlines.
- **RBAC Enforcement**: Access restricted to Management users; unauthorized Staff receive an informative RBAC block screen.

---

## 👥 Demo Accounts

Default password for all accounts: **`password123`**

| Name | Role | Position | Department | Workload State |
| :--- | :--- | :--- | :--- | :--- |
| **Sarah Jenkins** (`sarah.director`) | `MANAGEMENT` | Head of Agency & Executive Creative Director | Management | Executive Lead |
| **Marcus Chen** (`marcus.ops`) | `MANAGEMENT` | Operations & Resource Director | Operations | Operations Lead |
| **Elena Rostova** (`elena.design`) | `STAFF` | Lead UI/UX & Visual Designer | Creative | **Overloaded** *(6 active)* |
| **David Kim** (`david.dev`) | `STAFF` | Senior Full-Stack Developer | Tech | **Optimal** *(3 active)* |
| **Maya Patel** (`maya.content`) | `STAFF` | Senior Copywriter & Strategist | Strategy | **Optimal** *(3 active)* |
| **Liam O'Connor** (`liam.motion`) | `STAFF` | 3D & Motion Specialist | Creative | **Available** *(1 active)* |
| **Sofia Rodriguez** (`sofia.media`) | `STAFF` | Performance Media Lead | Media | **Available** *(0 active)* |
| **Jordan Blake** (`jordan.acct`) | `STAFF` | Senior Account Director | Accounts | **Optimal** *(2 active)* |

---

## 🛠️ Local Development Setup

```bash
# 1. Clone repository
git clone <your-repo-url>
cd locomotion-dashboard

# 2. Install dependencies
npm install

# 3. Synchronize database & seed sample data
npx prisma db push
npx tsx prisma/seed.ts

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

1. Push this repository to **GitHub**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository `locomotion-dashboard`.
4. Keep the default settings (Framework Preset: **Next.js**).
5. Click **"Deploy"**.

*The included Prisma setup automatically handles generating client engines on Vercel (`postinstall`) and manages the SQLite storage in writable `/tmp`.*

---

## 📄 License

MIT License © 2026 Locomotion Agency.
