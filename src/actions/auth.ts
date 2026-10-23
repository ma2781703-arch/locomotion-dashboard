"use server";

import { prisma } from "@/lib/prisma";
import {
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
  hashPassword,
  getCurrentUser,
} from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username and password are required." };
  }

  const cleanUsername = username.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
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
  return {
    success: true,
    role: user.role,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      position: user.position,
      department: user.department,
    },
  };
}

export async function registerAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const roleInput = (formData.get("role") as string) || "STAFF";
  const position = (formData.get("position") as string)?.trim() || "Digital Specialist";
  const department = (formData.get("department") as string)?.trim() || "Creative";

  if (!name || name.length < 2) {
    return { success: false, error: "Full Name must be at least 2 characters." };
  }

  if (!username || username.length < 3) {
    return { success: false, error: "Username must be at least 3 characters." };
  }

  // Username regex: alphanumeric, dots, hyphens, underscores
  const usernameRegex = /^[a-z0-9_.-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      success: false,
      error: "Username may only contain letters, numbers, dots, hyphens, and underscores.",
    };
  }

  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    return { success: false, error: "Username is already registered. Please choose another." };
  }

  const hashedPassword = await hashPassword(password);
  const role = roleInput === "MANAGEMENT" ? "MANAGEMENT" : "STAFF";

  const newUser = await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
      role,
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
  return {
    success: true,
    role: newUser.role,
    user: {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      role: newUser.role,
      position: newUser.position,
      department: newUser.department,
    },
  };
}

export async function logoutAction() {
  clearSessionCookie();
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateProfileAction(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "You must be signed in to update your profile." };
  }

  const name = (formData.get("name") as string)?.trim();
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const position = (formData.get("position") as string)?.trim();
  const department = (formData.get("department") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();
  const newPassword = formData.get("newPassword") as string;

  if (!name || name.length < 2) {
    return { success: false, error: "Full Name must be at least 2 characters." };
  }

  if (!username || username.length < 3) {
    return { success: false, error: "Username must be at least 3 characters." };
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
    bio: bio || undefined,
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
