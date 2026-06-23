"use client";

export default function PageHeader({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return (
    <header className="px-6 pt-36 md:px-12 md:pt-48">
      <div className="mx-auto max-w-[1600px]">
        <span className="label text-accent animate-fade-up">{label}</span>
        <h1 className="mt-4 max-w-4xl font-heading text-5xl leading-[1.02] text-ink animate-fade-up md:text-8xl">
          {title}
        </h1>
        {intro && <p className="mt-8 max-w-2xl text-lg text-ink/60 animate-fade-up">{intro}</p>}
      </div>
    </header>
  );
}
