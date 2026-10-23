"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionUser } from "@/lib/auth";
import { logoutAction, switchUserAction } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  CheckSquare,
  BarChart3,
  LogOut,
  User,
  ShieldCheck,
  Sparkles,
  Users,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  user: SessionUser | null;
  demoUsers: {
    id: string;
    name: string;
    username: string;
    role: string;
    position: string;
    department: string;
    avatarUrl: string | null;
    _count: { tasks: number };
  }[];
}

export function Navbar({ user, demoUsers }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);

  const handleSwitchUser = async (userId: string) => {
    setSwitching(true);
    await switchUserAction(userId);
    setSwitching(false);
    router.refresh();
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    {
      label: "Project & Brand Hub",
      href: "/projects",
      icon: FolderKanban,
      badge: "All Users",
    },
    {
      label: "Staff Workspace",
      href: "/dashboard",
      icon: CheckSquare,
      badge: "My Tasks",
    },
    {
      label: "Management Overview",
      href: "/management",
      icon: BarChart3,
      badge: "RBAC",
      managementOnly: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-card/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/projects" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-base sm:text-lg flex items-center gap-1.5">
                LOCOMOTION
                <span className="text-[10px] font-mono uppercase bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  AGENCY
                </span>
              </span>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Workload & Project Management Hub
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/15 text-indigo-300 border border-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.managementOnly && user?.role !== "MANAGEMENT" && (
                    <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-1 rounded border border-amber-500/20">
                      Locked
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Demo Switcher + User Profile */}
        <div className="flex items-center gap-3">
          {/* Quick RBAC Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-300"
                disabled={switching}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Switch Demo Persona</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="text-xs">
                Quick Role-Based Persona Switcher
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-[11px] text-muted-foreground">
                Management (Global Overview & Project Creator)
              </div>
              {demoUsers
                .filter((u) => u.role === "MANAGEMENT")
                .map((u) => (
                  <DropdownMenuItem
                    key={u.id}
                    onClick={() => handleSwitchUser(u.id)}
                    className={`flex items-center justify-between text-xs py-2 ${
                      user?.id === u.id ? "bg-primary/20 font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={u.avatarUrl || ""} />
                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{u.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {u.position}
                        </span>
                      </div>
                    </div>
                    <Badge variant="purple" className="text-[10px] h-4">
                      Management
                    </Badge>
                  </DropdownMenuItem>
                ))}

              <DropdownMenuSeparator />
              <div className="px-2 py-1 text-[11px] text-muted-foreground">
                Staff (Private Workspace & Self-Tasks)
              </div>
              {demoUsers
                .filter((u) => u.role === "STAFF")
                .slice(0, 4)
                .map((u) => (
                  <DropdownMenuItem
                    key={u.id}
                    onClick={() => handleSwitchUser(u.id)}
                    className={`flex items-center justify-between text-xs py-2 ${
                      user?.id === u.id ? "bg-primary/20 font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={u.avatarUrl || ""} />
                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{u.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {u.department} • {u._count.tasks} active tasks
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        u._count.tasks >= 5
                          ? "destructive"
                          : u._count.tasks <= 1
                          ? "success"
                          : "secondary"
                      }
                      className="text-[9px] h-4"
                    >
                      {u._count.tasks >= 5
                        ? "Overloaded"
                        : u._count.tasks <= 1
                        ? "Available"
                        : "Optimal"}
                    </Badge>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Current User Pill or Sign In */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 rounded-full border border-border/80 bg-secondary/50 p-1 pl-2 text-left transition hover:bg-secondary focus:outline-none">
                  <div className="hidden sm:flex flex-col items-end text-xs leading-tight">
                    <span className="font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {user.position}
                    </span>
                  </div>
                  <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                    <AvatarImage src={user.avatarUrl || ""} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user.username}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Badge
                        variant={user.role === "MANAGEMENT" ? "purple" : "cyan"}
                        className="text-[10px]"
                      >
                        {user.role}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {user.department}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <CheckSquare className="h-4 w-4" />
                    <span>Staff Workspace</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === "MANAGEMENT" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/management"
                      className="flex items-center gap-2 cursor-pointer text-indigo-400"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Management Overview</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-rose-400 focus:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav links */}
      <div className="flex md:hidden border-t border-border/50 px-4 py-2 gap-2 overflow-x-auto text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-md ${
                isActive
                  ? "bg-primary/20 text-indigo-300"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
