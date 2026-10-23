import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { getAllUsersForDemo } from "@/actions/auth";
import { Navbar } from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Locomotion | Digital Agency Workload & Project Hub",
  description:
    "Modern internal agency dashboard for capacity management, brand deliverables, and individual staff workspaces.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const demoUsers = await getAllUsersForDemo();

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased text-foreground flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        <Navbar user={currentUser} demoUsers={demoUsers} />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-card/40">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-medium text-foreground/80">
              Locomotion Digital Agency Platform © 2026
            </span>
            <span>
              Role-Based Access Control (RBAC) • SQLite & Prisma Engine
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
