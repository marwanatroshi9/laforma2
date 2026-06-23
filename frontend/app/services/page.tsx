import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/home/Services";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const services = await api.services();
  return (
    <div className="pb-20">
      <PageHeader label="Capabilities" title="What we do, end to end." />
      <Services services={services} />
    </div>
  );
}
