"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/admin";
import { Card, PageTitle } from "@/components/admin/ui";

export default function Inbox() {
  const [tab, setTab] = useState<"messages" | "quotes" | "applications">("messages");
  const [messages, setMessages] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    admin.get<any[]>("/contact/messages").then(setMessages).catch(() => {});
    admin.get<any[]>("/quote/requests").then(setQuotes).catch(() => {});
    admin.get<any[]>("/careers/applications").then(setApplications).catch(() => {});
  }, []);

  const list = tab === "messages" ? messages : tab === "quotes" ? quotes : applications;
  const counts = { messages: messages.length, quotes: quotes.length, applications: applications.length };

  return (
    <div className="max-w-3xl">
      <PageTitle title="Inbox" subtitle="Contact messages & quote requests" />

      <div className="mb-6 flex gap-2">
        {(["messages", "quotes", "applications"] as const).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`rounded-md px-4 py-2 text-sm capitalize ${
              tab === tabKey ? "bg-accent text-black" : "border border-line text-ink/60"
            }`}
          >
            {tabKey} ({counts[tabKey]})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((m) => (
          <Card key={m.id}>
            <div className="flex items-center justify-between">
              <div className="font-medium text-ink">{m.full_name}</div>
              <div className="text-xs text-ink/40">{new Date(m.created_at).toLocaleDateString()}</div>
            </div>
            <div className="mt-1 text-sm text-accent">{m.email}{m.phone ? ` · ${m.phone}` : ""}</div>
            {tab === "messages" && (
              <>
                {m.subject && <div className="mt-2 text-sm font-medium text-ink/80">{m.subject}</div>}
                <p className="mt-1 text-sm text-ink/60">{m.message}</p>
              </>
            )}
            {tab === "quotes" && (
              <p className="mt-2 text-sm text-ink/60">
                {m.project_type && <span className="text-ink/80">{m.project_type}</span>}
                {m.budget && ` · Budget: ${m.budget}`}
                <br />
                {m.details}
              </p>
            )}
            {tab === "applications" && (
              <p className="mt-2 text-sm text-ink/60">
                {m.cv_url && (
                  <a href={m.cv_url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    View CV / portfolio
                  </a>
                )}
                {m.message && <><br />{m.message}</>}
              </p>
            )}
          </Card>
        ))}
        {list.length === 0 && <p className="text-sm text-ink/40">No {tab} yet.</p>}
      </div>
    </div>
  );
}
