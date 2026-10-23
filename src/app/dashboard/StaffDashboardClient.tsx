"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createTaskAction,
  updateTaskStatusAction,
  deleteTaskAction,
  updateTaskAction,
} from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Archive,
  RotateCcw,
  Trash2,
  FolderKanban,
  Edit,
  Sparkles,
  Loader2,
  AlertTriangle,
  Flame,
  Check,
} from "lucide-react";
import { formatDate, formatRelativeDays } from "@/lib/utils";

interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  estimatedHours: number | null;
  completedAt: Date | null;
  project: {
    id: string;
    name: string;
    clientName: string;
    code: string;
    status: string;
  } | null;
}

interface ProjectOption {
  id: string;
  name: string;
  clientName: string;
  code: string;
  status: string;
}

interface StaffDashboardClientProps {
  user: any;
  activeTasks: TaskItem[];
  archivedTasks: TaskItem[];
  projects: ProjectOption[];
  stats: {
    activeCount: number;
    todoCount: number;
    inProgressCount: number;
    archivedCount: number;
    urgentCount: number;
    totalHours: number;
  };
}

export function StaffDashboardClient({
  user,
  activeTasks,
  archivedTasks,
  projects,
  stats,
}: StaffDashboardClientProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await createTaskAction(formData);

    setLoading(false);
    if (res.success) {
      setCreateOpen(false);
      router.refresh();
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    setUpdatingTaskId(taskId);
    await updateTaskStatusAction(taskId, newStatus);
    setUpdatingTaskId(null);
    router.refresh();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTaskAction(taskId);
      router.refresh();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTask) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("taskId", editTask.id);

    await updateTaskAction(formData);
    setLoading(false);
    setEditTask(null);
    router.refresh();
  };

  const filteredActiveTasks = activeTasks.filter((t) => {
    if (statusFilter === "ALL") return true;
    return t.status === statusFilter;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "URGENT":
        return (
          <Badge variant="destructive" className="gap-1 text-[10px]">
            <Flame className="h-3 w-3" />
            <span>URGENT</span>
          </Badge>
        );
      case "HIGH":
        return <Badge variant="warning" className="text-[10px]">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="default" className="text-[10px]">MEDIUM</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">LOW</Badge>;
    }
  };

  // Capacity visual calculation for current staff member
  const isOverloaded = stats.activeCount >= 5;
  const isAvailable = stats.activeCount <= 1;

  return (
    <div className="space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user.name}&apos;s Workspace
            </h1>
            <Badge variant="purple" className="text-xs">
              Staff Space
            </Badge>
            {isOverloaded ? (
              <Badge variant="destructive" className="text-xs gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Overloaded ({stats.activeCount} tasks)</span>
              </Badge>
            ) : isAvailable ? (
              <Badge variant="success" className="text-xs gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Available for Assignment</span>
              </Badge>
            ) : (
              <Badge variant="cyan" className="text-xs">
                Optimal Workload ({stats.activeCount} tasks)
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {user.position} • {user.department} Department • Private Workspace (Self-Directed Tasks)
          </p>
        </div>

        {/* Create Task Dialog Trigger */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-indigo-500/20">
              <Plus className="h-4 w-4" />
              <span>Create New Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <form onSubmit={handleCreateTask}>
              <DialogHeader>
                <DialogTitle>Create Self-Input Task</DialogTitle>
                <DialogDescription className="text-xs">
                  Create a task in your personal workspace and link it to an agency project.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Design 3D Sneaker Exploded View"
                    required
                    autoFocus
                  />
                </div>

                {/* Relational Dropdown: "Related Project" */}
                <div className="space-y-1.5">
                  <Label htmlFor="projectId" className="text-indigo-400">
                    Related Project (Global Board) *
                  </Label>
                  <select
                    id="projectId"
                    name="projectId"
                    className="flex h-10 w-full rounded-md border border-indigo-500/40 bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground font-medium"
                    defaultValue=""
                  >
                    <option value="NONE" className="bg-popover text-foreground">
                      None (General Agency Internal Task)
                    </option>
                    {projects.map((proj) => (
                      <option
                        key={proj.id}
                        value={proj.id}
                        className="bg-popover text-foreground"
                      >
                        {proj.code} • {proj.name} ({proj.clientName})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground">
                    Linking to an agency project automatically adds you to that project&apos;s <strong>Automated PIC Roster</strong>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Task Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Key requirements, tools, notes, or deliverable checklists..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      name="priority"
                      defaultValue="MEDIUM"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    >
                      <option value="URGENT" className="bg-popover text-foreground">URGENT</option>
                      <option value="HIGH" className="bg-popover text-foreground">HIGH</option>
                      <option value="MEDIUM" className="bg-popover text-foreground">MEDIUM</option>
                      <option value="LOW" className="bg-popover text-foreground">LOW</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="status">Initial Status</Label>
                    <select
                      id="status"
                      name="status"
                      defaultValue="To Do"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    >
                      <option value="To Do" className="bg-popover text-foreground">To Do</option>
                      <option value="On Progress" className="bg-popover text-foreground">On Progress</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" name="dueDate" type="date" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="estimatedHours">Est. Hours</Label>
                    <Input
                      id="estimatedHours"
                      name="estimatedHours"
                      type="number"
                      step="0.5"
                      defaultValue="4.0"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Task</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="bg-card/70 border-border/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Active Tasks
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {stats.activeCount}
          </p>
        </Card>

        <Card className="bg-card/70 border-border/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            On Progress
          </p>
          <p className="text-2xl font-bold text-indigo-300 mt-1">
            {stats.inProgressCount}
          </p>
        </Card>

        <Card className="bg-card/70 border-border/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            To Do
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {stats.todoCount}
          </p>
        </Card>

        <Card className="bg-card/70 border-border/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Archive (Done)
          </p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {stats.archivedCount}
          </p>
        </Card>

        <Card className="bg-card/70 border-border/70 p-4 col-span-2 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
            Est. Workload
          </p>
          <p className="text-2xl font-bold text-purple-300 mt-1">
            {stats.totalHours} hrs
          </p>
        </Card>
      </div>

      {/* Task Management Tabs: Active Tasks vs Archive */}
      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
          <TabsList className="h-10">
            <TabsTrigger value="active" className="gap-2">
              <Layers className="h-4 w-4" />
              <span>Active Tasks</span>
              <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-indigo-300">
                {stats.activeCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="archive" className="gap-2">
              <Archive className="h-4 w-4" />
              <span>Task Archive</span>
              <span className="ml-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                {stats.archivedCount}
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground hidden sm:inline">Filter Status:</span>
            {["ALL", "To Do", "On Progress"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Active Tasks */}
        <TabsContent value="active" className="space-y-4">
          {filteredActiveTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 p-12 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-semibold">No active tasks</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                All tasks are completed or moved to the archive. Create a new task or grab a deliverable from the Project Hub!
              </p>
              <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Task</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActiveTasks.map((task) => (
                <Card
                  key={task.id}
                  className="flex flex-col justify-between border-border/70 hover:border-indigo-500/40 bg-card/75 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
                >
                  <CardHeader className="p-5 pb-3 space-y-2.5">
                    {/* Top Row: Related Project link + Priority */}
                    <div className="flex items-center justify-between gap-2">
                      {task.project ? (
                        <Link
                          href={`/projects/${task.project.id}`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/20 truncate transition-colors"
                          title="View related project hub"
                        >
                          <FolderKanban className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {task.project.code} • {task.project.clientName}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-[11px] text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded">
                          Internal Operations
                        </span>
                      )}

                      {getPriorityBadge(task.priority)}
                    </div>

                    <CardTitle className="text-base font-bold leading-snug text-foreground">
                      {task.title}
                    </CardTitle>

                    {task.description && (
                      <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-4">
                    {/* Deadline and Hours */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{formatDate(task.dueDate)}</span>
                        <span className="text-[10px] text-muted-foreground">
                          ({formatRelativeDays(task.dueDate)})
                        </span>
                      </div>
                      {task.estimatedHours && (
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3" />
                          <span>{task.estimatedHours}h est.</span>
                        </span>
                      )}
                    </div>

                    {/* Status Toggle & Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-muted-foreground mr-1">
                          Status:
                        </span>
                        <select
                          value={task.status}
                          disabled={updatingTaskId === task.id}
                          onChange={(e) =>
                            handleUpdateStatus(task.id, e.target.value)
                          }
                          className="h-8 rounded-md border border-input bg-secondary px-2.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                        >
                          <option value="To Do">To Do</option>
                          <option value="On Progress">On Progress</option>
                          <option value="Done">✓ Mark as Done</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Quick Done button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                          disabled={updatingTaskId === task.id}
                          onClick={() => handleUpdateStatus(task.id, "Done")}
                          title="Mark complete & move to Archive"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Done</span>
                        </Button>

                        {/* Edit task */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => setEditTask(task)}
                          title="Edit Task"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete task */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete Task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Task Archive (Completed Tasks) */}
        <TabsContent value="archive" className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-secondary/20 p-4 text-xs text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-emerald-400" />
              <span>
                Archived tasks represent completed work. They remain on record for client reviews and time tracking.
              </span>
            </div>
            <span className="font-semibold text-foreground">
              {archivedTasks.length} Archived Tasks
            </span>
          </div>

          {archivedTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 p-12 text-center space-y-2">
              <Archive className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-semibold">No tasks in Archive</h3>
              <p className="text-xs text-muted-foreground">
                When you mark tasks as &ldquo;Done&rdquo;, they will cleanly archive here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {archivedTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-border/60 bg-card/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-border transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="success" className="text-[10px] gap-1">
                        <Check className="h-3 w-3" />
                        <span>Done</span>
                      </Badge>
                      <h4 className="font-semibold text-foreground text-sm line-through text-muted-foreground">
                        {task.title}
                      </h4>
                      {task.project && (
                        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          {task.project.code}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-muted-foreground line-clamp-1 text-[11px]">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                      <span>
                        Completed: {formatDate(task.completedAt || task.dueDate)}
                      </span>
                      {task.project && (
                        <span>• Client: {task.project.clientName}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-8 gap-1.5"
                      onClick={() => handleUpdateStatus(task.id, "On Progress")}
                      title="Move back to Active Tasks"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Reopen Task</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete permanently"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      {editTask && (
        <Dialog open={Boolean(editTask)} onOpenChange={() => setEditTask(null)}>
          <DialogContent className="max-w-lg">
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Workspace Task</DialogTitle>
                <DialogDescription className="text-xs">
                  Update task requirements, priority, or re-link to another project.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title">Task Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={editTask.title}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-projectId" className="text-indigo-400">
                    Related Project
                  </Label>
                  <select
                    id="edit-projectId"
                    name="projectId"
                    defaultValue={editTask.project?.id || "NONE"}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  >
                    <option value="NONE">None (General Agency Internal Task)</option>
                    {projects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.code} • {proj.name} ({proj.clientName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editTask.description || ""}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <select
                      id="edit-priority"
                      name="priority"
                      defaultValue={editTask.priority}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    >
                      <option value="URGENT">URGENT</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-status">Status</Label>
                    <select
                      id="edit-status"
                      name="status"
                      defaultValue={editTask.status}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    >
                      <option value="To Do">To Do</option>
                      <option value="On Progress">On Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-dueDate">Due Date</Label>
                    <Input
                      id="edit-dueDate"
                      name="dueDate"
                      type="date"
                      defaultValue={
                        editTask.dueDate
                          ? new Date(editTask.dueDate).toISOString().split("T")[0]
                          : ""
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="edit-estimatedHours">Est. Hours</Label>
                    <Input
                      id="edit-estimatedHours"
                      name="estimatedHours"
                      type="number"
                      step="0.5"
                      defaultValue={editTask.estimatedHours || 4}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditTask(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Save Changes</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
