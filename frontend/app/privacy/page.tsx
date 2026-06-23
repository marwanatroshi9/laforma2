import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="pb-32">
      <PageHeader label="Legal" title="Privacy Policy" />
      <article className="mx-auto max-w-3xl space-y-6 px-6 py-16 leading-relaxed text-ink/70 md:px-12">
        <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit this website. Studios may edit this content from the admin dashboard.</p>
        <p>We collect information you provide via contact and quote forms, and standard analytics data. We do not sell personal information.</p>
      </article>
    </div>
  );
}
