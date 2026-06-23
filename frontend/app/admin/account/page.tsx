"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/admin";
import { Button, Card, Field, Input, PageTitle, useToast } from "@/components/admin/ui";

export default function AccountPage() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    admin.me().then((u) => setEmail(u.email)).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 6) return toast("New password must be at least 6 characters", "error");
    if (next !== confirm) return toast("New passwords do not match", "error");
    setSaving(true);
    try {
      await admin.post("/auth/change-password", { current_password: current, new_password: next });
      toast("Password updated successfully");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err: any) {
      toast(err.message || "Could not change password", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <PageTitle title="Account" subtitle="Manage your admin login" />

      <Card>
        <Field label="Signed in as">
          <Input value={email} disabled />
        </Field>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-5 font-heading text-xl text-ink">Change password</h2>
        <form onSubmit={submit} className="space-y-5">
          <Field label="Current password">
            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
          </Field>
          <Field label="New password">
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} required autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
          </Field>
          <Button type="submit" disabled={saving}>
            {saving ? "Updating…" : "Update password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
