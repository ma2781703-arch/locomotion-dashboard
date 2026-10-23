"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight, AlertCircle, Loader2, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (!result.success) {
      setError(result.error || "Login failed");
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
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 mb-1">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Locomotion Agency Portal</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access agency projects, staff workspaces, and capacity management.
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/80 shadow-xl bg-card/90 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">Agency Sign In</CardTitle>
              <CardDescription className="text-xs">
                Enter your agency username and password to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="e.g. admin or your username"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="rounded-lg bg-indigo-950/20 border border-indigo-500/20 p-3 text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Initial Management Account:</span>
                </div>
                <p>Username: <code className="text-foreground font-mono">admin</code> | Password: <code className="text-foreground font-mono">admin123</code></p>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Agency</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex justify-center border-t border-border/40 py-3 text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="ml-1 text-primary underline-offset-4 hover:underline">
              Register new Staff/Management
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
