import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <span className="font-heading text-[18vw] leading-none text-accent/30">404</span>
      <p className="label mt-4 text-ink/60">This page could not be found</p>
      <Link href="/" className="label mt-8 border border-line px-8 py-4 text-ink hover:border-accent hover:text-accent">
        Return home
      </Link>
    </div>
  );
}
