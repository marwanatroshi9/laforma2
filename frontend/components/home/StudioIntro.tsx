"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function StudioIntro() {
  const { settings, locale, t } = useSite();
  const statsRef = useRef<HTMLDivElement>(null);

  const about = pick(settings?.content?.about, locale, "");
  const stats: { value: string; label: any }[] = settings?.content?.stats || [];

  useEffect(() => {
    if (!statsRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = parseFloat(el.dataset.value || "0");
        if (!target) return;
        const suffix = el.dataset.suffix || "";
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            onUpdate() {
              el.innerText = Math.floor(Number(el.innerText)).toString() + suffix;
            },
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, statsRef);
    return () => ctx.revert();
  }, [stats.length]);

  return (
    <section className="px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <span className="label text-accent">{t("section.about")}</span>
          <p className="mt-8 font-heading text-3xl leading-snug text-ink md:text-5xl">
            {about}
          </p>
        </Reveal>

        <div ref={statsRef} className="grid grid-cols-2 gap-y-14 self-center">
          {stats.map((s, i) => {
            const num = parseFloat(s.value);
            const suffix = s.value.replace(/[0-9.]/g, "");
            return (
              <Reveal key={i} delay={i * 80}>
                <div>
                  <div
                    className="stat-num font-heading text-5xl text-accent md:text-7xl"
                    data-value={isNaN(num) ? 0 : num}
                    data-suffix={suffix}
                  >
                    {s.value}
                  </div>
                  <div className="label mt-3 text-ink/60">{pick(s.label, locale)}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
