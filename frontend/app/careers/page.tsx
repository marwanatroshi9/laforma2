import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import CareersList from "./CareersList";

export const metadata = { title: "Careers" };

export default async function CareersPage() {
  const jobs = await api.jobs();
  return (
    <div className="min-h-[60vh] pb-32">
      <PageHeader label="Careers" title="Build the future with us." intro="Join an award-winning studio shaping spaces that endure." />
      <CareersList jobs={jobs} />
    </div>
  );
}
