import { redirect } from "next/navigation";

export default function AgentDashboardPage() {
  // Redirect to overview tab by default
  redirect("/agent-dashboard/overview");
}
