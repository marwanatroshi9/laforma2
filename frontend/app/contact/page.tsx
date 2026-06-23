import { api } from "@/lib/api";
import { pick } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";
import ContactTabs from "./ContactTabs";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await api.settings();
  return (
    <div className="pb-32">
      <PageHeader label="Contact" title="Let's create something timeless." />
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-3">
          <aside className="space-y-8 text-ink/70">
            {s?.email && (
              <div>
                <span className="label text-accent">Email</span>
                <p className="mt-2">{s.email}</p>
              </div>
            )}
            {s?.phone && (
              <div>
                <span className="label text-accent">Phone</span>
                <p className="mt-2" dir="ltr">{s.phone}</p>
              </div>
            )}
            {s?.address && (
              <div>
                <span className="label text-accent">Studio</span>
                <p className="mt-2">{pick(s.address, s.default_locale || "en")}</p>
              </div>
            )}
          </aside>
          <div className="lg:col-span-2">
            <ContactTabs />
          </div>
        </div>
      </section>
    </div>
  );
}
