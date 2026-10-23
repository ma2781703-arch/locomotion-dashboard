"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionUser } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
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
} from "lucide-react";

interface NavbarProps {
  user: SessionUser | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
    },
    {
      label: "Staff Workspace",
      href: "/dashboard",
      icon: CheckSquare,
    },
    {
      label: "Management Overview",
      href: "/management",
      icon: BarChart3,
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
                      Restricted
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: User Profile or Sign In */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 rounded-full border border-border/80 bg-secondary/50 p-1 pl-2.5 text-left transition hover:bg-secondary focus:outline-none">
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
