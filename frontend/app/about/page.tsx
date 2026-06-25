import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import StudioIntro from "@/components/home/StudioIntro";
import Clients from "@/components/home/Clients";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const clients = await api.clients();
  return (
    <div className="pb-20">
      <PageHeader label="page.about.label" title="page.about.title" />
      <StudioIntro />
      <Clients clients={clients} />
    </div>
  );
}
