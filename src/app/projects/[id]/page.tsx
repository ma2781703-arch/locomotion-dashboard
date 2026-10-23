import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/actions/projects";
import { getCurrentUser } from "@/lib/auth";
import { AddMyTaskDialog } from "./AddMyTaskDialog";
import { ProjectDeliverablesHub } from "./ProjectDeliverablesHub";
import { AutomatedPICRoster } from "./AutomatedPICRoster";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  Calendar,
  DollarSign,
  Layers,
  Target,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatDate, formatRelativeDays } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(params.id);
  const currentUser = await getCurrentUser();

  if (!project) {
    notFound();
  }

  const activeTasks = project.tasks.filter((t) => t.status !== "Done");
  const doneTasks = project.tasks.filter((t) => t.status === "Done");
  const totalTasks = project.tasks.length;
  const progress =
    totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">ACTIVE</Badge>;
      case "PITCH":
        return <Badge variant="purple">PITCH</Badge>;
      case "IN_REVIEW":
        return <Badge variant="warning">IN_REVIEW</Badge>;
      case "DELIVERED":
        return <Badge variant="cyan">DELIVERED</Badge>;
      case "ON_HOLD":
        return <Badge variant="secondary">ON_HOLD</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <Badge variant="destructive">URGENT PRIORITY</Badge>;
      case "HIGH":
        return <Badge variant="warning">HIGH PRIORITY</Badge>;
      case "MEDIUM":
        return <Badge variant="default">MEDIUM PRIORITY</Badge>;
      default:
        return <Badge variant="secondary">LOW PRIORITY</Badge>;
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          href="/projects"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Global Projects Board</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-indigo-400 font-semibold">
          {project.code}
        </span>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-secondary/30 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                {project.code}
              </span>
              {getStatusBadge(project.status)}
              {getPriorityBadge(project.priority)}
              <Badge variant="outline">{project.category}</Badge>
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pt-1">
              Client: {project.clientName}
            </p>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {project.name}
            </h1>
          </div>

          {/* Quick Action: "Add My Task for this Project" */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <AddMyTaskDialog
              projectId={project.id}
              projectName={project.name}
              clientName={project.clientName}
              currentUserId={currentUser?.id}
              currentUserName={currentUser?.name}
            />
          </div>
        </div>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">
              Target Deadline
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-indigo-400" />
              <span>{formatDate(project.deadline)}</span>
            </span>
            <span className="text-[10px] text-muted-foreground">
              ({formatRelativeDays(project.deadline)})
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">
              Campaign Budget
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
              <span>{project.budget || "Retainer Scope"}</span>
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">
              Team Engagement
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span>{project.pics.length} Staff on Roster</span>
            </span>
            <span className="text-[10px] text-muted-foreground">
              {activeTasks.length} active tasks in flight
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] uppercase tracking-wider">
              Deliverable Completion
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="font-semibold text-foreground text-[11px]">
                {progress}%
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {doneTasks.length} of {totalTasks} tasks complete
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Brief, Goals, Scope, Centralized URLs Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Brief Card */}
          <Card className="border-border/80 bg-card/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                <span>Client Brief</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Core mandate, client problem statement, and primary audience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {project.brief}
              </p>
            </CardContent>
          </Card>

          {/* Strategic Goals Card */}
          <Card className="border-border/80 bg-card/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span>Strategic Goals & Key Performance Metrics</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Milestones and benchmark metrics agreed with the client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {project.goals}
              </p>
            </CardContent>
          </Card>

          {/* Scope & Description Card */}
          <Card className="border-border/80 bg-card/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Agency Execution Scope & Description</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Locomotion technical architecture, creative vision, and craft standards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Centralized Deliverables Hub (URLs) */}
          <ProjectDeliverablesHub
            projectId={project.id}
            previewUrl={project.previewUrl}
            pitchDeckUrl={project.pitchDeckUrl}
            creativeDeckUrl={project.creativeDeckUrl}
            finalAssetsUrl={project.finalAssetsUrl}
            customDeliverables={project.deliverables as any}
          />
        </div>

        {/* Right Column: Automated PIC Roster */}
        <div className="space-y-6">
          <AutomatedPICRoster pics={project.pics} />

          {/* Quick Help Card */}
          <Card className="border-border/60 bg-secondary/30 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Agency Workflow Rule</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Management</strong> provisions the project, overarching timeline, and client brief.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Staff members</strong> independently assign themselves tasks within this project using the &ldquo;Add My Task for this Project&rdquo; button, automatically updating the PIC team roster.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
