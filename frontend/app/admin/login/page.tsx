"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { admin } from "@/lib/admin";
import { Button, Field, Input } from "@/components/admin/ui";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@studio.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await admin.login(email, password);
      router.replace("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-6 text-ink">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 font-heading text-4xl uppercase tracking-luxe">
          Studio<span className="text-accent">.</span>
        </h1>
        <p className="mb-8 text-sm text-ink/50">Sign in to the admin dashboard</p>
        <form onSubmit={submit} className="space-y-5">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-xs text-ink/40">Demo: admin@studio.com / admin1234</p>
      </div>
    </div>
  );
}
