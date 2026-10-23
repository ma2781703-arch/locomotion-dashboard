import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Briefcase, Building2 } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Profile & Account Settings</h1>
        <p className="text-xs text-muted-foreground">
          Update your agency position, department, username, and authentication password.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="h-fit border-border/80 bg-card/60">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback className="text-xl">{user.name[0]}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <CardDescription className="text-xs">@{user.username}</CardDescription>
            <div className="flex justify-center gap-1.5 pt-2">
              <Badge variant={user.role === "MANAGEMENT" ? "purple" : "cyan"}>
                {user.role}
              </Badge>
              <Badge variant="outline">{user.department}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs border-t border-border/40 pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
              <span>{user.position}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>{user.department} Department</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Role: {user.role === "MANAGEMENT" ? "Executive Management" : "Agency Staff"}</span>
            </div>
            {user.bio && (
              <p className="pt-2 text-muted-foreground italic border-t border-border/30">
                &ldquo;{user.bio}&rdquo;
              </p>
            )}
          </CardContent>
        </Card>

        {/* Profile Edit Form */}
        <div className="md:col-span-2">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-lg">Edit Profile Information</CardTitle>
              <CardDescription className="text-xs">
                Your profile information is visible in the agency directory and project PIC rosters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
