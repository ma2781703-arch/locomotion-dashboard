"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Search,
  Users,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatDate, formatRelativeDays } from "@/lib/utils";

interface ProjectItem {
  id: string;
  code: string;
  name: string;
  clientName: string;
  status: string;
  priority: string;
  category: string;
  deadline: Date | null;
  budget: string | null;
  previewUrl: string | null;
  pitchDeckUrl: string | null;
  creativeDeckUrl: string | null;
  finalAssetsUrl: string | null;
  activeTasksCount: number;
  doneTasksCount: number;
  pics: {
    id: string;
    name: string;
    position: string;
    department: string;
    avatarUrl: string | null;
    taskCount: number;
    activeTaskCount: number;
  }[];
  _count: {
    tasks: number;
    deliverables: number;
  };
}

export function ProjectBoardClient({ projects }: { projects: ProjectItem[] }) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const statusOptions = [
    "ALL",
    "ACTIVE",
    "PITCH",
    "IN_REVIEW",
    "DELIVERED",
    "ON_HOLD",
  ];

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card/60 border border-border/70 p-4 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, project name, or code..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-12 text-center space-y-3">
          <FolderKanban className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-semibold">No agency projects found</h3>
          <p className="text-xs text-muted-foreground">
            No projects matched the search criteria or selected status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => {
            const totalTasks = project.activeTasksCount + project.doneTasksCount;
            const progress =
              totalTasks > 0
                ? Math.round((project.doneTasksCount / totalTasks) * 100)
                : 0;

            const deliverablesCount =
              (project.previewUrl ? 1 : 0) +
              (project.pitchDeckUrl ? 1 : 0) +
              (project.creativeDeckUrl ? 1 : 0) +
              (project.finalAssetsUrl ? 1 : 0) +
              project._count.deliverables;

            return (
              <Card
                key={project.id}
                className="group flex flex-col justify-between border-border/70 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all bg-card/70 backdrop-blur-sm"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {project.code}
                    </span>
                    {getStatusBadge(project.status)}
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {project.clientName}
                    </span>
                    <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {project.category}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  {/* Progress & Task Completion */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Task Completion</span>
                      <span className="font-semibold text-foreground">
                        {project.doneTasksCount}/{totalTasks} tasks ({progress}%)
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      indicatorClassName={
                        progress === 100
                          ? "bg-emerald-500"
                          : progress > 50
                          ? "bg-indigo-500"
                          : "bg-purple-500"
                      }
                    />
                  </div>

                  {/* Automated PIC Preview (Persons In Charge) */}
                  <div className="space-y-1.5 pt-1 border-t border-border/40">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                        <Users className="h-3 w-3 text-indigo-400" />
                        <span>Staff Assigned (PIC)</span>
                      </span>
                      <span>{project.pics.length} team members</span>
                    </div>

                    {project.pics.length > 0 ? (
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <div className="flex -space-x-2 overflow-hidden">
                          {project.pics.slice(0, 4).map((pic) => (
                            <Avatar
                              key={pic.id}
                              className="inline-block h-7 w-7 rounded-full ring-2 ring-background"
                              title={`${pic.name} (${pic.department}) - ${pic.activeTaskCount} active tasks`}
                            >
                              <AvatarImage src={pic.avatarUrl || ""} />
                              <AvatarFallback className="text-[10px]">
                                {pic.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {project.pics.length > 4 && (
                          <span className="text-[11px] text-muted-foreground pl-1">
                            +{project.pics.length - 4} more
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground ml-auto truncate max-w-[120px]">
                          {project.pics[0].name.split(" ")[0]}
                          {project.pics.length > 1
                            ? ` & ${project.pics.length - 1} others`
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic">
                        No staff tasks linked yet.
                      </p>
                    )}
                  </div>

                  {/* Metadata: Deliverables count & Deadline */}
                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-border/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{formatRelativeDays(project.deadline)}</span>
                    </span>
                    <span className="text-[11px] font-medium bg-secondary/80 px-2 py-0.5 rounded">
                      {deliverablesCount} Deliverables
                    </span>
                  </div>

                  {/* Action Link to Detail View */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                  >
                    <Link href={`/projects/${project.id}`}>
                      <span>View Project & Deliverables</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
