"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function LoadingScreen() {
  const { settings, locale } = useSite();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  const name = pick(settings?.company_name, locale, "ARCHIPELAGO");

  useEffect(() => {
    const start = Date.now();
    const duration = 1900;
    let frame: number;
    const tick = () => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setCount(Math.floor(p));
      if (p < 100) frame = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-3xl md:text-5xl text-ink uppercase"
          >
            {name}
          </motion.div>

          <div className="mt-10 h-px w-56 overflow-hidden bg-line">
            <motion.div
              className="h-full bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: count / 100 }}
              style={{ transformOrigin: "left" }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="label mt-4 text-ink/50 tabular-nums">{count}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
