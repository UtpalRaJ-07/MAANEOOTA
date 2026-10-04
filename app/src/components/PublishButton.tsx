"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PublishButton({ id, disabled }: { id: string; disabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function publish() {
    setBusy(true);
    await fetch(`/api/v1/admin/seo-pages/${id}/publish`, { method: "POST" });
    setBusy(false);
    router.refresh();
  }
  return <button className="btn" onClick={publish} disabled={disabled || busy} style={{ minHeight: 36, padding: "0 12px", fontSize: ".85rem" }}>{busy ? "..." : "Publish"}</button>;
}
