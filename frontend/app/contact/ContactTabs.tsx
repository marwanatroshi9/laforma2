"use client";

import { useState } from "react";
import { useSite } from "@/providers/SiteProvider";
import ContactForm from "./ContactForm";
import QuoteForm from "./QuoteForm";

export default function ContactTabs() {
  const { t } = useSite();
  const [tab, setTab] = useState<"contact" | "quote">("contact");

  return (
    <div>
      <div className="mb-10 flex gap-8 border-b border-line">
        {([["contact", "contact.sendMessage"], ["quote", "contact.requestQuote"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative pb-4 label transition-colors ${tab === key ? "text-accent" : "text-ink/50 hover:text-ink"}`}
          >
            {t(label)}
            {tab === key && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
          </button>
        ))}
      </div>
      {tab === "contact" ? <ContactForm /> : <QuoteForm />}
    </div>
  );
}
