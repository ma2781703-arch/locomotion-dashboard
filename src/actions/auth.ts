"use server";

import { prisma } from "@/lib/prisma";
import {
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
  hashPassword,
  getCurrentUser,
  SessionUser,
} from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Please enter both username and password." };
  }

  const user = await prisma.user.findUnique({
    where: { username: username.trim().toLowerCase() },
  });

  if (!user) {
    return { success: false, error: "Invalid username or password." };
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return { success: false, error: "Invalid username or password." };
  }

  setSessionCookie({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  revalidatePath("/", "layout");
  return { success: true, role: user.role };
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "STAFF";
  const position = formData.get("position") as string || "Digital Specialist";
  const department = formData.get("department") as string || "Creative";

  if (!name || !username || !password) {
    return { success: false, error: "Name, username, and password are required." };
  }

  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    return { success: false, error: "Username is already taken." };
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
      role: role === "MANAGEMENT" ? "MANAGEMENT" : "STAFF",
      position,
      department,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`,
    },
  });

  setSessionCookie({
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
  });

  revalidatePath("/", "layout");
  return { success: true, role: newUser.role };
}

export async function logoutAction() {
  clearSessionCookie();
  revalidatePath("/", "layout");
  return { success: true };
}

export async function switchUserAction(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  setSessionCookie({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  revalidatePath("/", "layout");
  return { success: true, user: { id: user.id, name: user.name, role: user.role } };
}

export async function updateProfileAction(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "You must be signed in to update your profile." };
  }

  const name = formData.get("name") as string;
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const position = formData.get("position") as string;
  const department = formData.get("department") as string;
  const bio = formData.get("bio") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!name || !username) {
    return { success: false, error: "Name and username cannot be empty." };
  }

  // Check username uniqueness if changed
  if (username !== currentUser.username) {
    const existing = await prisma.user.findUnique({
      where: { username },
    });
    if (existing) {
      return { success: false, error: "This username is already taken." };
    }
  }

  const updateData: {
    name: string;
    username: string;
    position: string;
    department: string;
    bio?: string;
    password?: string;
  } = {
    name,
    username,
    position: position || currentUser.position,
    department: department || currentUser.department,
    bio: bio ?? undefined,
  };

  if (newPassword && newPassword.trim().length >= 6) {
    updateData.password = await hashPassword(newPassword.trim());
  }

  const updated = await prisma.user.update({
    where: { id: currentUser.id },
    data: updateData,
  });

  // Refresh cookie in case username or role changed
  setSessionCookie({
    id: updated.id,
    username: updated.username,
    role: updated.role,
  });

  revalidatePath("/", "layout");
  return { success: true, message: "Profile updated successfully." };
}

export async function getAllUsersForDemo() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      position: true,
      department: true,
      avatarUrl: true,
      _count: {
        select: {
          tasks: {
            where: {
              status: { in: ["To Do", "On Progress"] },
            },
          },
        },
      },
    },
    orderBy: [{ role: "desc" }, { name: "asc" }],
  });

  return users;
}
