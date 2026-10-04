"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LocationPicker() {
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch(`/api/v1/locations/suggest?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (data.matches?.length) {
      router.push(`/home-food-delivery/bengaluru/${data.matches[0].slug}`);
    } else {
      setMsg("We could not find that area. Try a nearby locality name.");
    }
  }

  return (
    <form className="locator" onSubmit={submit} role="search" aria-label="Find food near you">
      <label htmlFor="loc" className="sr-only" style={{ position: "absolute", left: -9999 }}>Enter your area, PIN code or landmark</label>
      <input id="loc" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Enter your area, PIN code or landmark" autoComplete="off" />
      <button className="btn" type="submit">Find Food Near Me</button>
      {msg && <p role="alert" className="muted" style={{ width: "100%" }}>{msg}</p>}
    </form>
  );
}
