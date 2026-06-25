import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import ContactTabs from "./ContactTabs";
import ContactInfo from "./ContactInfo";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await api.settings();
  return (
    <div className="pb-32">
      <PageHeader label="page.contact.label" title="page.contact.title" />
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-3">
          <ContactInfo settings={s} />
          <div className="lg:col-span-2">
            <ContactTabs />
          </div>
        </div>
      </section>
    </div>
  );
}
