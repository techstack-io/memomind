import MemoMindDashboard from "@/components/dashboard/MemoMindDashboard";

export default async function DashboardPage() {
  // Option to fetch dynamic server data (e.g. from Stack Auth / Database) here:
  // const user = await getCurrentUser();

  return <MemoMindDashboard userName="Dan" />;
}