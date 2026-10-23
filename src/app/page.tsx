import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  CheckSquare,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-10 py-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-card to-background p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Digital Agency Internal Workload & Deliverables Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Locomotion Agency Hub
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Centralized creative operations platform. Track global brand deliverables, monitor cross-department staff capacity, and empower talent with private self-directed task workspaces.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                <FolderKanban className="h-4 w-4" />
                <span>Explore Global Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/dashboard">
                <CheckSquare className="h-4 w-4" />
                <span>My Staff Workspace</span>
              </Link>
            </Button>

            {user?.role === "MANAGEMENT" ? (
              <Button asChild variant="secondary" size="lg" className="gap-2 text-indigo-300">
                <Link href="/management">
                  <BarChart3 className="h-4 w-4" />
                  <span>Management Overview</span>
                </Link>
              </Button>
            ) : (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 pl-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Signed in as <strong className="text-foreground">{user ? user.name : "Staff"}</strong> ({user ? user.role : "STAFF"})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards (3 Core Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Project & Brand Hub */}
        <Card className="flex flex-col justify-between border-border/80 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
          <CardHeader>
            <div className="flex items-center justify-between pb-2">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                <FolderKanban className="h-5 w-5" />
              </div>
              <Badge variant="cyan">Open to ALL</Badge>
            </div>
            <CardTitle className="text-xl">Project & Brand Hub</CardTitle>
            <CardDescription>
              Global roster of active agency engagements, client briefs, and centralized deliverable links.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Client briefs, strategic goals, and scope definitions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Centralized URLs: Preview links, Pitch Deck, Creative Deck, Final Assets.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Automated PIC display</strong> querying linked staff tasks in real-time.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Quick Action: <em>"Add My Task for this Project"</em> directly inside project view.</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/projects">
                <span>View Global Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pillar 2: Staff Dashboard */}
        <Card className="flex flex-col justify-between border-border/80 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/5">
          <CardHeader>
            <div className="flex items-center justify-between pb-2">
              <div className="h-10 w-10 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400">
                <CheckSquare className="h-5 w-5" />
              </div>
              <Badge variant="purple">Privacy Protected</Badge>
            </div>
            <CardTitle className="text-xl">Staff Dashboard</CardTitle>
            <CardDescription>
              Individual workspaces where talent self-inputs tasks and links them directly to projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Strict Privacy:</strong> Staff only view their own dashboard & tasks.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Relational dropdown to link tasks directly to <em>Related Project</em>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Editable status flow: <em>To Do</em>, <em>On Progress</em>, <em>Done</em>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Archive Tab:</strong> Completed tasks cleanly move out of active view.</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/dashboard">
                <span>Open My Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pillar 3: Management Overview */}
        <Card className="flex flex-col justify-between border-border/80 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/5">
          <CardHeader>
            <div className="flex items-center justify-between pb-2">
              <div className="h-10 w-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <Badge variant="warning">Role-Based Access</Badge>
            </div>
            <CardTitle className="text-xl">Management Overview</CardTitle>
            <CardDescription>
              Agency-wide workload telemetry, capacity monitoring, and resource load balancing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Master view tracking all staff workloads across departments.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Visual progress bars & capacity tags for every agency member.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Highlights who is <strong>Overloaded (5+ tasks)</strong> to prevent burnout.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Highlights who is <strong>Available / Idle</strong> for new client assignments.</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href="/management">
                <span>Access Management</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Agency Metrics Banner */}
      <div className="rounded-xl border border-border/60 bg-card/60 p-6 flex flex-wrap items-center justify-around gap-6 text-center">
        <div>
          <p className="text-2xl font-bold text-foreground">5</p>
          <p className="text-xs text-muted-foreground">Active Agency Projects</p>
        </div>
        <div className="h-8 w-px bg-border/60 hidden sm:block" />
        <div>
          <p className="text-2xl font-bold text-foreground">6</p>
          <p className="text-xs text-muted-foreground">Staff Creative Specialists</p>
        </div>
        <div className="h-8 w-px bg-border/60 hidden sm:block" />
        <div>
          <p className="text-2xl font-bold text-emerald-400">2 Available</p>
          <p className="text-xs text-muted-foreground">Ready for New Briefs</p>
        </div>
        <div className="h-8 w-px bg-border/60 hidden sm:block" />
        <div>
          <p className="text-2xl font-bold text-rose-400">1 Overloaded</p>
          <p className="text-xs text-muted-foreground">Requires Workload Rebalancing</p>
        </div>
      </div>
    </div>
  );
}
