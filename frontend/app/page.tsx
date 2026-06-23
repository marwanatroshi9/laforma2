import { api } from "@/lib/api";
import Hero from "@/components/Hero";
import Marquee from "@/components/home/Marquee";
import StudioIntro from "@/components/home/StudioIntro";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Services from "@/components/home/Services";
import Awards from "@/components/home/Awards";
import Clients from "@/components/home/Clients";
import ContactCTA from "@/components/home/ContactCTA";

export default async function HomePage() {
  const [featured, services, awards, clients] = await Promise.all([
    api.projects({ featured: true }),
    api.services(),
    api.awards(),
    api.clients(),
  ]);

  return (
    <>
      <Hero />
      <Marquee />
      <StudioIntro />
      <FeaturedProjects projects={featured} />
      <Services services={services} />
      <Awards awards={awards} />
      <Clients clients={clients} />
      <ContactCTA />
    </>
  );
}
