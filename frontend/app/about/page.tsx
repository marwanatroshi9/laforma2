import { api } from "@/lib/api";
import { pick } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";
import StudioIntro from "@/components/home/StudioIntro";
import Clients from "@/components/home/Clients";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const [s, clients] = await Promise.all([api.settings(), api.clients()]);
  return (
    <div className="pb-20">
      <PageHeader
        label="The Studio"
        title="A practice devoted to enduring architecture."
        intro={pick(s?.tagline, s?.default_locale || "en", "")}
      />
      <StudioIntro />
      <Clients clients={clients} />
    </div>
  );
}
