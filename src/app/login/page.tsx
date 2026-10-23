"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction, switchUserAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

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

  const handleQuickLogin = async (username: string) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", "password123");

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
          <h1 className="text-2xl font-bold tracking-tight">Locomotion Portal</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access agency projects, workloads, and task management.
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/80 shadow-xl bg-card/90 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">Staff & Management Sign In</CardTitle>
              <CardDescription className="text-xs">
                Enter your credentials or use a quick 1-click demo role below.
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
                  placeholder="e.g. sarah.director or elena.design"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-[11px] text-muted-foreground">
                    Default demo password: <code className="text-indigo-400">password123</code>
                  </span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  required
                />
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

          {/* Quick Demo Personas */}
          <div className="px-6 pb-6 pt-2 border-t border-border/50 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
              Instant 1-Click Role Logins
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2 border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/40 text-left"
                onClick={() => handleQuickLogin("sarah.director")}
                disabled={loading}
              >
                <Shield className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold text-indigo-300">Sarah (Management)</p>
                  <p className="text-[10px] text-muted-foreground truncate">Head of Agency</p>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2 border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-left"
                onClick={() => handleQuickLogin("elena.design")}
                disabled={loading}
              >
                <User className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold text-rose-300">Elena (Staff)</p>
                  <p className="text-[10px] text-muted-foreground truncate">Overloaded (6 tasks)</p>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2 border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-left"
                onClick={() => handleQuickLogin("sofia.media")}
                disabled={loading}
              >
                <User className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold text-emerald-300">Sofia (Staff)</p>
                  <p className="text-[10px] text-muted-foreground truncate">Available (0 tasks)</p>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-auto py-2 border-blue-500/30 bg-blue-950/20 hover:bg-blue-950/40 text-left"
                onClick={() => handleQuickLogin("david.dev")}
                disabled={loading}
              >
                <User className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold text-blue-300">David (Staff)</p>
                  <p className="text-[10px] text-muted-foreground truncate">Optimal (3 tasks)</p>
                </div>
              </Button>
            </div>
          </div>

          <CardFooter className="flex justify-center border-t border-border/40 py-3 text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="ml-1 text-primary underline-offset-4 hover:underline">
              Register here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
