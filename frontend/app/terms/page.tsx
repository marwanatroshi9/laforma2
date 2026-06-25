import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="pb-32">
      <PageHeader label="page.legal.label" title="page.terms.title" />
      <article className="mx-auto max-w-3xl space-y-6 px-6 py-16 leading-relaxed text-ink/70 md:px-12">
        <p>By accessing this website you agree to these terms. All content, including project imagery, is the property of the studio. Studios may edit this content from the admin dashboard.</p>
      </article>
    </div>
  );
}
