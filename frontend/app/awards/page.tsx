import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import Awards from "@/components/home/Awards";

export const metadata = { title: "Awards" };

export default async function AwardsPage() {
  const awards = await api.awards();
  return (
    <div className="pb-20">
      <PageHeader label="page.awards.label" title="page.awards.title" />
      <Awards awards={awards} />
    </div>
  );
}
