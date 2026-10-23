"use client";

import { useState } from "react";
import Link from "next/link";
import { StaffCapacitySummary } from "@/actions/management";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Search,
  AlertTriangle,
  Sparkles,
  Users,
  CheckCircle2,
  FolderKanban,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Flame,
  Check,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ManagementClientProps {
  staffSummaries: StaffCapacitySummary[];
  metrics: {
    totalStaff: number;
    overloadedCount: number;
    availableCount: number;
    optimalCount: number;
    totalActiveTasks: number;
    avgTasksPerStaff: string;
    activeProjectsCount: number;
  };
}

export function ManagementClient({ staffSummaries, metrics }: ManagementClientProps) {
  const [search, setSearch] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedStaffId((prev) => (prev === id ? null : id));
  };

  const departments = [
    "ALL",
    "Creative",
    "Media",
    "Strategy",
    "Tech",
    "Accounts",
  ];

  const filteredStaff = staffSummaries.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.position.toLowerCase().includes(search.toLowerCase()) ||
      staff.department.toLowerCase().includes(search.toLowerCase());

    const matchesCapacity =
      capacityFilter === "ALL" || staff.capacityStatus === capacityFilter;

    const matchesDepartment =
      departmentFilter === "ALL" || staff.department === departmentFilter;

    return matchesSearch && matchesCapacity && matchesDepartment;
  });

  const getCapacityBadge = (status: "OVERLOADED" | "OPTIMAL" | "AVAILABLE", count: number) => {
    switch (status) {
      case "OVERLOADED":
        return (
          <Badge variant="destructive" className="gap-1 px-2.5 py-1 text-xs">
            <Flame className="h-3.5 w-3.5" />
            <span>Overloaded ({count} tasks)</span>
          </Badge>
        );
      case "AVAILABLE":
        return (
          <Badge variant="success" className="gap-1 px-2.5 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Available / Idle ({count} tasks)</span>
          </Badge>
        );
      case "OPTIMAL":
      default:
        return (
          <Badge variant="cyan" className="px-2.5 py-1 text-xs">
            Optimal Flow ({count} tasks)
          </Badge>
        );
    }
  };

  const getProgressBarColor = (status: "OVERLOADED" | "OPTIMAL" | "AVAILABLE") => {
    switch (status) {
      case "OVERLOADED":
        return "bg-rose-500";
      case "AVAILABLE":
        return "bg-emerald-500";
      case "OPTIMAL":
      default:
        return "bg-indigo-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Management Workload & Capacity Radar
          </h1>
          <Badge variant="warning" className="text-xs uppercase">
            Management Access
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Master view tracking all staff workloads, capacity thresholds, and resource availability for new client pitches.
        </p>
      </div>

      {/* KPI Overview Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Staff */}
        <Card className="border-border/70 bg-card/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Specialists
            </span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-foreground mt-1">
            {metrics.totalStaff}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Across 5 agency disciplines
          </p>
        </Card>

        {/* Overloaded Alert */}
        <Card className="border-rose-500/30 bg-rose-950/15 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Overloaded Staff
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400 mt-1">
            {metrics.overloadedCount}
          </p>
          <p className="text-[11px] text-rose-300/80 mt-0.5">
            Active tasks &ge; 5 (Burnout risk)
          </p>
        </Card>

        {/* Available / Idle for Assignment */}
        <Card className="border-emerald-500/30 bg-emerald-950/15 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Available / Idle
            </span>
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-1">
            {metrics.availableCount}
          </p>
          <p className="text-[11px] text-emerald-300/80 mt-0.5">
            Ready for new client assignments!
          </p>
        </Card>

        {/* Agency Average Tasks */}
        <Card className="border-border/70 bg-card/70 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
              Avg Active Tasks
            </span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-300 mt-1">
            {metrics.avgTasksPerStaff}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {metrics.totalActiveTasks} active tasks agency-wide
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/60 border border-border/70 p-4 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff by name, title, or skill..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Capacity Status Filter Pills */}
          <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-lg border border-border/50 text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground px-2">
              Capacity:
            </span>
            {[
              { id: "ALL", label: "All" },
              { id: "OVERLOADED", label: "Overloaded" },
              { id: "OPTIMAL", label: "Optimal" },
              { id: "AVAILABLE", label: "Available" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setCapacityFilter(btn.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  capacityFilter === btn.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1 bg-secondary/40 p-1 rounded-lg border border-border/50 text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground px-2">
              Dept:
            </span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent border-none text-xs font-medium text-foreground focus:outline-none pr-2"
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-popover text-foreground">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Capacity Roster Cards */}
      <div className="space-y-4">
        {filteredStaff.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-12 text-center space-y-2">
            <Users className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-semibold">No staff specialists found</h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your capacity or department filter.
            </p>
          </div>
        ) : (
          filteredStaff.map((staff) => {
            const isExpanded = expandedStaffId === staff.id;
            const isOverloaded = staff.capacityStatus === "OVERLOADED";
            const isAvailable = staff.capacityStatus === "AVAILABLE";

            return (
              <Card
                key={staff.id}
                className={`border transition-all overflow-hidden ${
                  isOverloaded
                    ? "border-rose-500/50 bg-rose-950/10 hover:border-rose-500"
                    : isAvailable
                    ? "border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500"
                    : "border-border/80 bg-card/75 hover:border-indigo-500/40"
                }`}
              >
                {/* Staff Member Master Row */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-4 min-w-[260px]">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-border">
                        <AvatarImage src={staff.avatarUrl || ""} />
                        <AvatarFallback>{staff.name[0]}</AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background ${
                          isOverloaded
                            ? "bg-rose-500"
                            : isAvailable
                            ? "bg-emerald-500"
                            : "bg-indigo-500"
                        }`}
                        title={staff.statusLabel}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">
                          {staff.name}
                        </h3>
                        <Badge variant="outline" className="text-[10px]">
                          {staff.department}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {staff.position}
                      </p>
                      {staff.bio && (
                        <p className="text-[11px] text-muted-foreground/80 line-clamp-1 italic mt-0.5">
                          {staff.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Capacity Meter & Progress Bar */}
                  <div className="flex-1 max-w-md space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                        <span>Workload Capacity:</span>
                        <span className="text-foreground font-bold">
                          {staff.activeTaskCount} / 5 tasks
                        </span>
                      </span>
                      <span className="font-mono text-xs font-semibold">
                        {staff.capacityScore}%
                      </span>
                    </div>

                    <Progress
                      value={staff.capacityScore}
                      indicatorClassName={getProgressBarColor(staff.capacityStatus)}
                    />

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{staff.todoCount} To Do • {staff.inProgressCount} On Progress</span>
                      <span>{staff.archivedCount} Completed in Archive</span>
                    </div>
                  </div>

                  {/* Right: Status Pill & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/40">
                    <div>
                      {getCapacityBadge(staff.capacityStatus, staff.activeTaskCount)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 gap-1"
                        onClick={() => toggleExpand(staff.id)}
                      >
                        <span>{isExpanded ? "Hide Tasks" : "Inspect Tasks"}</span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </Button>

                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="text-xs h-8 text-indigo-400 hover:text-indigo-300"
                        title="View Staff Workspace"
                      >
                        <Link href={`/dashboard?userId=${staff.id}`}>
                          <span>Workspace</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expandable Drilldown: Current Active Tasks */}
                {isExpanded && (
                  <div className="border-t border-border/40 bg-secondary/30 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Active Tasks Breakdown for {staff.name} ({staff.tasks.length}):
                      </p>
                      {isAvailable && (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Candidate available for immediate client brief onboarding</span>
                        </span>
                      )}
                      {isOverloaded && (
                        <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Action needed: Reassign upcoming tasks or extend deadlines</span>
                        </span>
                      )}
                    </div>

                    {staff.tasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic bg-secondary/50 p-4 rounded-lg">
                        Currently has 0 active tasks. Fully idle and ready for new brand work.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {staff.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-3 rounded-lg bg-card/90 border border-border/50 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2">
                              {task.project ? (
                                <Link
                                  href={`/projects/${task.project.id}`}
                                  className="text-[11px] font-semibold text-indigo-400 hover:underline flex items-center gap-1 truncate"
                                >
                                  <FolderKanban className="h-3 w-3" />
                                  <span>{task.project.code} • {task.project.clientName}</span>
                                </Link>
                              ) : (
                                <span className="text-[11px] text-muted-foreground">
                                  Agency Internal
                                </span>
                              )}

                              <Badge
                                variant={
                                  task.priority === "URGENT"
                                    ? "destructive"
                                    : task.priority === "HIGH"
                                    ? "warning"
                                    : "secondary"
                                }
                                className="text-[9px]"
                              >
                                {task.priority}
                              </Badge>
                            </div>

                            <p className="font-semibold text-foreground">
                              {task.title}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                              <span className="font-medium text-foreground">
                                Status: {task.status}
                              </span>
                              {task.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Due {formatDate(task.dueDate)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
