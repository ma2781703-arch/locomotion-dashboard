"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export interface StaffCapacitySummary {
  id: string;
  name: string;
  username: string;
  position: string;
  department: string;
  avatarUrl: string | null;
  bio: string | null;
  activeTaskCount: number;
  todoCount: number;
  inProgressCount: number;
  archivedCount: number;
  capacityScore: number; // percentage (activeTasks / 5) * 100
  capacityStatus: "OVERLOADED" | "OPTIMAL" | "AVAILABLE";
  statusLabel: string;
  statusBadgeVariant: "destructive" | "default" | "success" | "warning";
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: Date | null;
    estimatedHours: number | null;
    project: {
      id: string;
      name: string;
      clientName: string;
      code: string;
    } | null;
  }[];
}

export async function getManagementOverviewData() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "MANAGEMENT") {
    return {
      authorized: false,
      error: "Access Denied: The Management Dashboard is restricted to users with the Management role.",
    };
  }

  // Fetch all staff users (role = "STAFF") and their tasks
  const staffMembers = await prisma.user.findMany({
    where: { role: "STAFF" },
    include: {
      tasks: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
              clientName: true,
              code: true,
            },
          },
        },
        orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      },
    },
    orderBy: { name: "asc" },
  });

  const capacitySummaries: StaffCapacitySummary[] = staffMembers.map((staff) => {
    const activeTasks = staff.tasks.filter((t) => t.status !== "Done");
    const archivedTasks = staff.tasks.filter((t) => t.status === "Done");
    const todoTasks = activeTasks.filter((t) => t.status === "To Do");
    const inProgressTasks = activeTasks.filter((t) => t.status === "On Progress");

    const activeCount = activeTasks.length;
    // Standard baseline capacity threshold is 5 active concurrent client tasks
    const capacityScore = Math.min(Math.round((activeCount / 5) * 100), 150);

    let capacityStatus: "OVERLOADED" | "OPTIMAL" | "AVAILABLE" = "OPTIMAL";
    let statusLabel = "Optimal / In Flow";
    let statusBadgeVariant: "destructive" | "default" | "success" | "warning" = "default";

    if (activeCount >= 5) {
      capacityStatus = "OVERLOADED";
      statusLabel = "Overloaded";
      statusBadgeVariant = "destructive";
    } else if (activeCount <= 1) {
      capacityStatus = "AVAILABLE";
      statusLabel = "Available / Idle";
      statusBadgeVariant = "success";
    }

    return {
      id: staff.id,
      name: staff.name,
      username: staff.username,
      position: staff.position,
      department: staff.department,
      avatarUrl: staff.avatarUrl,
      bio: staff.bio,
      activeTaskCount: activeCount,
      todoCount: todoTasks.length,
      inProgressCount: inProgressTasks.length,
      archivedCount: archivedTasks.length,
      capacityScore,
      capacityStatus,
      statusLabel,
      statusBadgeVariant,
      tasks: activeTasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        estimatedHours: t.estimatedHours,
        project: t.project,
      })),
    };
  });

  // Calculate high-level stats
  const totalStaff = capacitySummaries.length;
  const overloadedCount = capacitySummaries.filter(
    (s) => s.capacityStatus === "OVERLOADED"
  ).length;
  const availableCount = capacitySummaries.filter(
    (s) => s.capacityStatus === "AVAILABLE"
  ).length;
  const optimalCount = capacitySummaries.filter(
    (s) => s.capacityStatus === "OPTIMAL"
  ).length;

  const totalActiveTasks = capacitySummaries.reduce(
    (acc, s) => acc + s.activeTaskCount,
    0
  );
  const avgTasksPerStaff = totalStaff > 0 ? (totalActiveTasks / totalStaff).toFixed(1) : "0";

  // Active projects count
  const activeProjectsCount = await prisma.project.count({
    where: { status: { in: ["ACTIVE", "PITCH", "IN_REVIEW"] } },
  });

  return {
    authorized: true,
    staffSummaries: capacitySummaries,
    metrics: {
      totalStaff,
      overloadedCount,
      availableCount,
      optimalCount,
      totalActiveTasks,
      avgTasksPerStaff,
      activeProjectsCount,
    },
  };
}
