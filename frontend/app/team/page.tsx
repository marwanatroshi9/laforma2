import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import TeamGrid from "./TeamGrid";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const team = await api.team();
  return (
    <div className="pb-32">
      <PageHeader label="page.team.label" title="page.team.title" />
      <TeamGrid team={team} />
    </div>
  );
}
