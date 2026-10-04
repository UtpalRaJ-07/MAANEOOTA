"use client";
import { useState } from "react";

export function BulkForm() {
  const [state, setState] = useState({ headcount: 50, serviceDate: "", mealType: "lunch", contactPhone: "", notes: "", locationSlug: "" });
  const [ref, setRef] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setRef(null);
    const res = await fetch("/api/v1/bulk/requests", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...state, headcount: Number(state.headcount) }),
    });
    const data = await res.json();
    if (res.ok) setRef(data.publicRef); else setErr(data.error || "Could not submit");
  }

  const shortcuts = [10, 20, 50, 100, 250, 500, 1000];
  return (
    <form className="card" onSubmit={submit}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {shortcuts.map((n) => <button type="button" key={n} className="tag" onClick={() => setState({ ...state, headcount: n })} style={{ cursor: "pointer", border: "none" }}>{n}{n === 1000 ? "+" : ""}</button>)}
      </div>
      <p><label>Headcount <input type="number" min={1} value={state.headcount} onChange={(e) => setState({ ...state, headcount: Number(e.target.value) })} style={{ minHeight: 44 }} /></label></p>
      <p><label>Service date <input type="date" value={state.serviceDate} onChange={(e) => setState({ ...state, serviceDate: e.target.value })} style={{ minHeight: 44 }} required /></label></p>
      <p><label>Meal type{" "}
        <select value={state.mealType} onChange={(e) => setState({ ...state, mealType: e.target.value })} style={{ minHeight: 44 }}>
          <option>breakfast</option><option>lunch</option><option>dinner</option>
        </select></label></p>
      <p><label>Locality <input value={state.locationSlug} onChange={(e) => setState({ ...state, locationSlug: e.target.value })} placeholder="e.g. peenya" style={{ minHeight: 44 }} /></label></p>
      <p><label>Contact phone <input value={state.contactPhone} onChange={(e) => setState({ ...state, contactPhone: e.target.value })} required style={{ minHeight: 44 }} /></label></p>
      <p><label>Notes <textarea value={state.notes} onChange={(e) => setState({ ...state, notes: e.target.value })} rows={3} style={{ width: "100%" }} /></label></p>
      <button className="btn" type="submit">Submit enquiry</button>
      {ref && <p role="status" style={{ marginTop: 10 }}>Enquiry received. Reference <strong>{ref}</strong>. This records your requirement — it is not a confirmed price. Operations will follow up with an itemised quote.</p>}
      {err && <p role="alert" className="tag warn">{err}</p>}
    </form>
  );
}
