"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "@/lib/auth";
import { updateProfileAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ProfileForm({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfileAction(formData);

    if (!res.success) {
      setError(res.error || "Failed to update profile.");
    } else {
      setSuccess("Profile and credentials updated successfully!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={user.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            defaultValue={user.username}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="position">Role / Position Title</Label>
          <Input
            id="position"
            name="position"
            defaultValue={user.position}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="department">Department</Label>
          <select
            id="department"
            name="department"
            defaultValue={user.department}
            className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
          >
            <option value="Creative" className="bg-popover text-foreground">
              Creative & Design
            </option>
            <option value="Media" className="bg-popover text-foreground">
              Media & Growth
            </option>
            <option value="Strategy" className="bg-popover text-foreground">
              Strategy & Planning
            </option>
            <option value="Tech" className="bg-popover text-foreground">
              Technology & Engineering
            </option>
            <option value="Accounts" className="bg-popover text-foreground">
              Accounts & Client Servicing
            </option>
            <option value="Operations" className="bg-popover text-foreground">
              Operations & Resourcing
            </option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio || ""}
          placeholder="Brief summary of skills, specialties, and agency background..."
          rows={3}
        />
      </div>

      <div className="border-t border-border/40 pt-4 space-y-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Security & Password Update
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Leave blank if you do not wish to change your password.
          </p>
        </div>
        <div className="space-y-1.5 max-w-sm">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter at least 6 characters"
            minLength={6}
          />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <span>Save Profile Changes</span>
          )}
        </Button>
      </div>
    </form>
  );
}
