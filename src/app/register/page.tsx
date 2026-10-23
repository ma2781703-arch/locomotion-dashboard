"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (!result.success) {
      setError(result.error || "Registration failed");
      setLoading(false);
    } else {
      if (result.role === "MANAGEMENT") {
        router.push("/management");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 mb-1">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Join Locomotion Agency</h1>
          <p className="text-xs text-muted-foreground">
            Create an agency profile as Staff or Management.
          </p>
        </div>

        <Card className="border-border/80 shadow-xl bg-card/90 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">Staff & Management Registration</CardTitle>
              <CardDescription className="text-xs">
                Fill in your professional details to set up your workspace profile.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Alex Morgan"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="e.g. alex.creative"
                    required
                  />
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="role">Agency Role</Label>
                  <select
                    id="role"
                    name="role"
                    className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    defaultValue="STAFF"
                  >
                    <option value="STAFF" className="bg-popover text-foreground">
                      Staff (Task Workspace & PIC)
                    </option>
                    <option value="MANAGEMENT" className="bg-popover text-foreground">
                      Management (Workloads & Projects)
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="department">Department</Label>
                  <select
                    id="department"
                    name="department"
                    className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    defaultValue="Creative"
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

              {/* Position / Job Title */}
              <div className="space-y-1.5">
                <Label htmlFor="position">Role / Position Title</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="e.g. Senior Brand Designer, Motion Artist, Full-Stack Dev"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex justify-center border-t border-border/40 py-3 text-xs text-muted-foreground">
            Already have an agency account?{" "}
            <Link href="/login" className="ml-1 text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
