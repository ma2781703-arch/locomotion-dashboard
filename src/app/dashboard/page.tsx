import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getStaffDashboardData } from "@/actions/tasks";
import { StaffDashboardClient } from "./StaffDashboardClient";

export default async function StaffDashboardPage({
  searchParams,
}: {
  searchParams?: { userId?: string };
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Privacy Constraint Enforcement:
  // If user is STAFF, they can NEVER view another staff member's dashboard.
  // Only MANAGEMENT can view a drilldown of a specific staff member.
  let targetUserId = currentUser.id;
  if (currentUser.role === "MANAGEMENT" && searchParams?.userId) {
    targetUserId = searchParams.userId;
  }

  const data = await getStaffDashboardData(targetUserId);

  if (!data || !data.user) {
    redirect("/login");
  }

  return (
    <div className="py-4">
      <StaffDashboardClient
        user={data.user}
        activeTasks={data.activeTasks as any}
        archivedTasks={data.archivedTasks as any}
        projects={data.projects}
        stats={data.stats}
      />
    </div>
  );
}
