"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, Users, Wrench, Trophy, Inbox, Palette } from "lucide-react";
import { admin } from "@/lib/admin";
import { Card, PageTitle } from "@/components/admin/ui";

export default function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0, team: 0, services: 0, awards: 0, messages: 0 });

  useEffect(() => {
    (async () => {
      const [projects, team, services, awards, messages] = await Promise.all([
        admin.get<any[]>("/projects?include_unpublished=true").catch(() => []),
        admin.get<any[]>("/team?include_unpublished=true").catch(() => []),
        admin.get<any[]>("/services?include_unpublished=true").catch(() => []),
        admin.get<any[]>("/awards").catch(() => []),
        admin.get<any[]>("/contact/messages").catch(() => []),
      ]);
      setStats({
        projects: projects.length,
        team: team.length,
        services: services.length,
        awards: awards.length,
        messages: messages.length,
      });
    })();
  }, []);

  const cards = [
    ["Projects", stats.projects, Building2, "/admin/projects"],
    ["Team", stats.team, Users, "/admin/team"],
    ["Services", stats.services, Wrench, "/admin/services"],
    ["Awards", stats.awards, Trophy, "/admin/awards"],
    ["Messages", stats.messages, Inbox, "/admin/inbox"],
  ] as const;

  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Manage your studio website content & branding" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {cards.map(([label, value, Icon, href]) => (
          <Link key={label} href={href}>
            <Card className="transition hover:border-accent">
              <Icon className="text-accent" size={22} />
              <div className="mt-4 font-heading text-4xl text-ink">{value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-ink/50">{label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/admin/branding">
          <Card className="flex items-center gap-4 transition hover:border-accent">
            <Palette className="text-accent" size={28} />
            <div>
              <div className="font-medium text-ink">Branding & Theme</div>
              <div className="text-sm text-ink/50">Logo, colors, fonts, languages, hero video, SEO</div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/media">
          <Card className="flex items-center gap-4 transition hover:border-accent">
            <Building2 className="text-accent" size={28} />
            <div>
              <div className="font-medium text-ink">Media Library</div>
              <div className="text-sm text-ink/50">Drag-and-drop images & videos</div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
