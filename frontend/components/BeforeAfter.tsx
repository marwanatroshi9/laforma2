"use client";

import { useRef, useState } from "react";

/** Draggable before/after comparison slider. */
export default function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden"
      onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
      onClick={(e) => move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="after" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="before" className="absolute inset-0 h-full w-full object-cover" style={{ width: ref.current?.offsetWidth }} draggable={false} />
      </div>
      <div className="absolute inset-y-0 w-0.5 bg-accent" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-surface p-2 text-accent">
          ⇆
        </div>
      </div>
      <span className="absolute bottom-3 start-3 label bg-black/50 px-2 py-1 text-white">Before</span>
      <span className="absolute bottom-3 end-3 label bg-black/50 px-2 py-1 text-white">After</span>
    </div>
  );
}
