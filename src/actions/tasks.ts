"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTaskAction(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Authentication required to create tasks." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = (formData.get("projectId") as string) || null;
  const priority = (formData.get("priority") as string) || "MEDIUM";
  const status = (formData.get("status") as string) || "To Do";
  const dueDateStr = formData.get("dueDate") as string;
  const estimatedHours = parseFloat((formData.get("estimatedHours") as string) || "4");

  if (!title || title.trim().length === 0) {
    return { success: false, error: "Task title is required." };
  }

  // Quick Action / Self-input: assign to the current user
  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      priority,
      status,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      estimatedHours: isNaN(estimatedHours) ? 4.0 : estimatedHours,
      userId: currentUser.id,
      projectId: projectId === "NONE" || !projectId ? null : projectId,
      completedAt: status === "Done" ? new Date() : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  if (projectId) {
    revalidatePath(`/projects/${projectId}`);
  }

  return { success: true, task };
}

export async function updateTaskStatusAction(taskId: string, newStatus: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Authentication required." };
  }

  // Ensure user owns task or is management
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return { success: false, error: "Task not found." };
  }

  if (currentUser.role !== "MANAGEMENT" && task.userId !== currentUser.id) {
    return { success: false, error: "Privacy constraint: You cannot modify other staff's tasks." };
  }

  const isDone = newStatus === "Done";

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: newStatus,
      completedAt: isDone ? new Date() : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/management");
  if (task.projectId) {
    revalidatePath(`/projects/${task.projectId}`);
  }

  return { success: true };
}

export async function updateTaskAction(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, error: "Unauthorized" };

  const taskId = formData.get("taskId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const projectId = (formData.get("projectId") as string) || null;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dueDateStr = formData.get("dueDate") as string;
  const estimatedHours = parseFloat((formData.get("estimatedHours") as string) || "4");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return { success: false, error: "Task not found" };

  if (currentUser.role !== "MANAGEMENT" && task.userId !== currentUser.id) {
    return { success: false, error: "Privacy violation: You cannot edit other staff's tasks." };
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      projectId: projectId === "NONE" || !projectId ? null : projectId,
      priority: priority || task.priority,
      status: status || task.status,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      estimatedHours: isNaN(estimatedHours) ? task.estimatedHours : estimatedHours,
      completedAt: status === "Done" ? new Date() : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/management");
  if (task.projectId) revalidatePath(`/projects/${task.projectId}`);
  if (projectId && projectId !== task.projectId) revalidatePath(`/projects/${projectId}`);

  return { success: true };
}

export async function deleteTaskAction(taskId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, error: "Unauthorized" };

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return { success: false, error: "Task not found" };

  if (currentUser.role !== "MANAGEMENT" && task.userId !== currentUser.id) {
    return { success: false, error: "Privacy violation: You cannot delete another staff's task." };
  }

  await prisma.task.delete({ where: { id: taskId } });

  revalidatePath("/dashboard");
  revalidatePath("/management");
  if (task.projectId) revalidatePath(`/projects/${task.projectId}`);

  return { success: true };
}

export async function getStaffDashboardData(targetUserId?: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  // Privacy Constraint: Staff can only see their own dashboard and tasks
  let userId = currentUser.id;
  if (currentUser.role === "MANAGEMENT" && targetUserId) {
    userId = targetUserId;
  }

  // Active tasks ("To Do", "On Progress")
  const activeTasks = await prisma.task.findMany({
    where: {
      userId,
      status: { in: ["To Do", "On Progress"] },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          clientName: true,
          code: true,
          status: true,
        },
      },
    },
    orderBy: [
      { priority: "desc" },
      { dueDate: "asc" },
      { updatedAt: "desc" },
    ],
  });

  // Archived tasks ("Done")
  const archivedTasks = await prisma.task.findMany({
    where: {
      userId,
      status: "Done",
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          clientName: true,
          code: true,
          status: true,
        },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  // Projects list for "Related Project" dropdown
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      clientName: true,
      code: true,
      status: true,
    },
    orderBy: { name: "asc" },
  });

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      position: true,
      department: true,
      avatarUrl: true,
      bio: true,
    },
  });

  return {
    user: targetUser,
    activeTasks,
    archivedTasks,
    projects,
    stats: {
      activeCount: activeTasks.length,
      todoCount: activeTasks.filter((t) => t.status === "To Do").length,
      inProgressCount: activeTasks.filter((t) => t.status === "On Progress").length,
      archivedCount: archivedTasks.length,
      urgentCount: activeTasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH").length,
      totalHours: activeTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0),
    },
  };
}
