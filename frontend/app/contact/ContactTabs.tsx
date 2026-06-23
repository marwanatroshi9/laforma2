"use client";

import { useState } from "react";
import ContactForm from "./ContactForm";
import QuoteForm from "./QuoteForm";

export default function ContactTabs() {
  const [tab, setTab] = useState<"contact" | "quote">("contact");

  return (
    <div>
      <div className="mb-10 flex gap-8 border-b border-line">
        {([["contact", "Send a message"], ["quote", "Request a quote"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative pb-4 label transition-colors ${tab === key ? "text-accent" : "text-ink/50 hover:text-ink"}`}
          >
            {label}
            {tab === key && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
          </button>
        ))}
      </div>
      {tab === "contact" ? <ContactForm /> : <QuoteForm />}
    </div>
  );
}
