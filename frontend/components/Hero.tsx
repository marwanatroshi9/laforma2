"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function Hero() {
  const { settings, locale, t } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const title = pick(settings?.hero_title, locale, "We shape spaces that outlive us");
  const subtitle = pick(settings?.hero_subtitle, locale, "");
  const poster = settings?.hero_poster_url || "";
  const video = settings?.hero_video_url || "";

  const words = title.split(" ");

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      {/* Cinematic background: video if provided, else poster image */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {video ? (
          <video
            className="h-full w-full object-cover"
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="label mb-6 text-white/70"
        >
          {pick(settings?.tagline, locale, "")}
        </motion.span>

        <h1 className="max-w-5xl font-heading text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.98] text-white">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pe-[0.25em]">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 2.3 + i * 0.07, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.9, duration: 1 }}
            className="mt-8 max-w-xl text-base text-white/75 md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <Link
            href="/projects"
            className="group relative overflow-hidden border border-white/40 px-8 py-4 label text-white"
          >
            <span className="relative z-10 transition-colors group-hover:text-black">
              {t("cta.explore")}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
          </Link>
          <Link href="/contact" className="label text-white/80 underline-offset-4 hover:text-accent hover:underline">
            {t("cta.contact")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="h-12 w-px bg-white/40">
          <motion.div
            className="h-1/2 w-full bg-accent"
            animate={{ y: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
