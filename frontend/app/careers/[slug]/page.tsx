import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { pick } from "@/lib/i18n";
import JobDetail from "./JobDetail";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await api.job(slug);
  if (!job) return { title: "Position" };
  return { title: pick(job.title, "en"), description: pick(job.description, "en") };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await api.job(slug);
  if (!job) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: pick(job.title, "en"),
    description: pick(job.description, "en"),
    employmentType: job.employment_type,
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JobDetail job={job} />
    </>
  );
}
