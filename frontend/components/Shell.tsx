"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteSettings } from "@/lib/types";
import { SiteProvider } from "@/providers/SiteProvider";
import SmoothScroll from "@/providers/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Shell({
  settings,
  children,
}: {
  settings: SiteSettings | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Admin dashboard supplies its own chrome — skip the public site shell,
  // but keep SiteProvider so branding/theme context is still available.
  if (pathname.startsWith("/admin")) {
    return <SiteProvider settings={settings}>{children}</SiteProvider>;
  }

  return (
    <SiteProvider settings={settings}>
      <SmoothScroll>
        <LoadingScreen />
        <Navbar />
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </SmoothScroll>
    </SiteProvider>
  );
}
