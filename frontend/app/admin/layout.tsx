"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Palette,
  Building2,
  Users,
  Wrench,
  Trophy,
  Handshake,
  Image as ImageIcon,
  Inbox,
  LogOut,
  ExternalLink,
  FileText,
  Briefcase,
  KeyRound,
} from "lucide-react";
import { admin, clearToken, getToken } from "@/lib/admin";
import { ToastProvider } from "@/components/admin/ui";

const NAV = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/branding", "Branding & Theme", Palette],
  ["/admin/projects", "Projects", Building2],
  ["/admin/team", "Team", Users],
  ["/admin/services", "Services", Wrench],
  ["/admin/awards", "Awards", Trophy],
  ["/admin/clients", "Clients", Handshake],
  ["/admin/blog", "Journal", FileText],
  ["/admin/careers", "Careers", Briefcase],
  ["/admin/media", "Media Library", ImageIcon],
  ["/admin/inbox", "Inbox", Inbox],
  ["/admin/account", "Account", KeyRound],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    admin
      .me()
      .then(() => setReady(true))
      .catch(() => router.replace("/admin/login"));
  }, [isLogin, pathname, router]);

  if (isLogin) return <ToastProvider>{children}</ToastProvider>;

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-ink/50">
        <span className="label animate-pulse">Loading dashboard…</span>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-surface text-ink">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 flex-col border-e border-line bg-surface-2 p-5 md:flex">
          <Link href="/admin" className="mb-8 font-heading text-2xl uppercase tracking-luxe">
            Studio<span className="text-accent">.</span>
          </Link>
          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map(([href, label, Icon]) => {
              const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                    active ? "bg-accent/15 text-accent" : "text-ink/60 hover:bg-surface hover:text-ink"
                  }`}
                >
                  <Icon size={17} /> {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex flex-col gap-1 border-t border-line pt-4">
            <a href="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink/60 hover:text-ink">
              <ExternalLink size={17} /> View site
            </a>
            <button
              onClick={() => {
                clearToken();
                router.replace("/admin/login");
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink/60 hover:text-red-400"
            >
              <LogOut size={17} /> Sign out
            </button>
          </div>
        </aside>

        {/* Mobile top nav */}
        <div className="fixed inset-x-0 top-0 z-30 flex gap-2 overflow-x-auto border-b border-line bg-surface-2 px-4 py-3 md:hidden">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="whitespace-nowrap text-xs text-ink/60">
              {label}
            </Link>
          ))}
        </div>

        <main className="flex-1 px-6 py-8 pt-20 md:px-10 md:pt-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
