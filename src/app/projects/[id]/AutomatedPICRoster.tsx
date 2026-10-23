"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CheckCircle2, Clock, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PICTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
}

interface PICMember {
  id: string;
  name: string;
  username: string;
  position: string;
  department: string;
  avatarUrl: string | null;
  totalTasks: number;
  activeTasks: number;
  doneTasks: number;
  tasks: PICTask[];
}

export function AutomatedPICRoster({ pics }: { pics: PICMember[] }) {
  const [expandedMember, setExpandedMember] = useState<string | null>(
    pics.length > 0 ? pics[0].id : null
  );

  const toggleExpand = (id: string) => {
    setExpandedMember((prev) => (prev === id ? null : id));
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "URGENT":
        return <Badge variant="destructive" className="text-[9px]">URGENT</Badge>;
      case "HIGH":
        return <Badge variant="warning" className="text-[9px]">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="default" className="text-[9px]">MEDIUM</Badge>;
      default:
        return <Badge variant="secondary" className="text-[9px]">LOW</Badge>;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Done":
        return <Badge variant="success" className="text-[9px]">Done</Badge>;
      case "On Progress":
        return <Badge variant="default" className="text-[9px]">On Progress</Badge>;
      default:
        return <Badge variant="secondary" className="text-[9px]">To Do</Badge>;
    }
  };

  return (
    <Card className="border-border/80 bg-card/70">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span>Automated PIC Roster</span>
                <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                  {pics.length} Staff Assigned
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Automatically queried from active & linked tasks assigned to this project.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {pics.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 p-6 text-center space-y-2">
            <Users className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-xs font-semibold text-foreground">
              No Staff currently assigned to this project
            </p>
            <p className="text-[11px] text-muted-foreground">
              Staff members can click &ldquo;Add My Task for this Project&rdquo; to join this project roster.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pics.map((pic) => {
              const isExpanded = expandedMember === pic.id;

              return (
                <div
                  key={pic.id}
                  className="rounded-lg border border-border/60 bg-secondary/30 transition-all hover:border-indigo-500/40 overflow-hidden"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleExpand(pic.id)}
                    className="p-3 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 ring-1 ring-border">
                        <AvatarImage src={pic.avatarUrl || ""} />
                        <AvatarFallback>{pic.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {pic.name}
                          </p>
                          <Badge variant="outline" className="text-[10px]">
                            {pic.department}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {pic.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-[11px] hidden sm:block">
                        <span className="font-semibold text-indigo-400">
                          {pic.activeTasks} active
                        </span>
                        <span className="text-muted-foreground">
                          {" "}• {pic.doneTasks} done
                        </span>
                      </div>

                      <button className="text-muted-foreground hover:text-foreground">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Task Breakdown */}
                  {isExpanded && (
                    <div className="border-t border-border/40 bg-card/40 p-3 space-y-2">
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                        Assigned Project Tasks ({pic.tasks.length}):
                      </p>
                      <div className="space-y-1.5">
                        {pic.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between gap-2 p-2 rounded-md bg-secondary/50 text-xs border border-border/30"
                          >
                            <div className="flex items-center gap-2 truncate">
                              {getStatusBadge(task.status)}
                              <span className="truncate text-foreground font-medium">
                                {task.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {getPriorityBadge(task.priority)}
                              {task.dueDate && (
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDate(task.dueDate)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
