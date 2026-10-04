"use client";
import { useEffect, useRef, useState } from "react";
import { DISHES, type Cuisine } from "@/data/dishes";
import { AREAS, areaBySlug } from "@/data/areas";
import { occasionBySlug } from "@/data/occasions";
import { HAS_PHONE, HAS_WHATSAPP, SITE, telLink, waLink } from "@/data/site";

const GROUPS: { id: Cuisine; label: string }[] = [
  { id: "biryani", label: "Biryani" },
  { id: "north", label: "North Indian" },
  { id: "south", label: "South Indian" },
  { id: "sweets", label: "Sweets" },
];
const QTY = ["1 kg", "2 kg", "5 kg", "10 kg", "25 kg+"];

type Field = "dishes" | "quantity" | "date" | "area" | "name";
type Errors = Partial<Record<Field, string>>;

function localToday() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
function prettyDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function prettyTime(t: string) {
  const d = new Date(`1970-01-01T${t}:00`);
  return isNaN(d.getTime()) ? t : d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

// Builds a WhatsApp message from the enquiry. Nothing is sent to or stored by this website.
export function EnquiryForm() {
  const [dishes, setDishes] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [people, setPeople] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [minDate, setMinDate] = useState<string | undefined>();
  const summaryRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMinDate(localToday());
    const p = new URLSearchParams(window.location.search);
    const a = areaBySlug(p.get("area") ?? "");
    if (a) setArea(a.name);
    const d = DISHES.find((x) => x.slug === p.get("dish"));
    if (d) setDishes([d.name]);
    const occ = occasionBySlug(p.get("occasion") ?? "");
    if (occ) setNotes((n) => (n ? n : `Occasion: ${occ.name}`));
  }, []);

  useEffect(() => {
    if (message) readyRef.current?.focus();
  }, [message]);

  const toggle = (n: string) => setDishes((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
  const invalid = (f: Field) => (errors[f] ? { "aria-invalid": true as const, "aria-describedby": `e-${f}` } : {});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Errors = {};
    if (!dishes.length && !notes.trim()) errs.dishes = "Choose at least one dish, or describe what you need in the notes.";
    if (!quantity.trim()) errs.quantity = "Tell us how much you need, for example 2 kg or food for 50 people.";
    if (!date) errs.date = "Choose the date you need the food.";
    else if (minDate && date < minDate) errs.date = "Choose today or a later date.";
    if (!area.trim()) errs.area = "Tell us your area in Bengaluru.";
    if (!name.trim()) errs.name = "Tell us your name.";
    setErrors(errs);
    setCopied(false);
    if (Object.keys(errs).length) {
      setMessage(null);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const lines = ["Hi MAANE OOTA, I'd like a quote.", ""];
    lines.push(`Name: ${name.trim()}`);
    lines.push(`Dishes: ${dishes.length ? dishes.join(", ") : "See notes"}`);
    lines.push(`Quantity: ${quantity.trim()}`);
    if (people.trim()) lines.push(`Number of people: ${people.trim()}`);
    lines.push(`Date: ${prettyDate(date)}${time ? `, ${prettyTime(time)}` : ""}`);
    lines.push(`Area: ${area.trim()}, Bengaluru`);
    if (notes.trim()) lines.push(`Notes: ${notes.trim()}`);
    const text = lines.join("\n");
    setMessage(text);
    if (HAS_WHATSAPP) window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  async function copy() {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const errorList = Object.entries(errors) as [Field, string][];

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Quote enquiry">
      {errorList.length > 0 && (
        <div className="err-summary" ref={summaryRef} tabIndex={-1} role="alert">
          <strong>Please check {errorList.length === 1 ? "this" : "these"}:</strong>
          <ul>{errorList.map(([f, m]) => <li key={f}><a href={`#f-${f}`}>{m}</a></li>)}</ul>
        </div>
      )}

      <div className="field">
        <fieldset id="f-dishes" tabIndex={-1} aria-describedby={errors.dishes ? "e-dishes" : undefined}>
          <legend>What would you like? <span className="hint">Choose as many as you want.</span></legend>
          {GROUPS.map((g) => (
            <div key={g.id}>
              <p className="chip-label">{g.label}</p>
              <div className="chips">
                {DISHES.filter((d) => d.cuisine === g.id).map((d) => (
                  <button key={d.slug} type="button" className="chip" aria-pressed={dishes.includes(d.name)} onClick={() => toggle(d.name)}>
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </fieldset>
        {errors.dishes && <p className="err" id="e-dishes">{errors.dishes}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-quantity">How much do you need?</label>
        <input id="f-quantity" className="input" value={quantity} onChange={(e) => setQuantity(e.target.value)}
          placeholder="For example: 3 kg chicken biryani, 2 kg paneer butter masala" {...invalid("quantity")} />
        <div className="chips" style={{ marginTop: 10 }} role="group" aria-label="Quick quantities">
          {QTY.map((q) => (
            <button key={q} type="button" className="chip" aria-pressed={quantity === q} onClick={() => setQuantity(q)}>{q}</button>
          ))}
        </div>
        {errors.quantity && <p className="err" id="e-quantity">{errors.quantity}</p>}
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="f-people">Number of people <span className="hint">(optional)</span></label>
          <input id="f-people" className="input" type="number" inputMode="numeric" min={1} value={people} onChange={(e) => setPeople(e.target.value)} placeholder="For example: 25" />
        </div>
        <div className="field">
          <label htmlFor="f-area">Your area in Bengaluru</label>
          <input id="f-area" className="input" list="area-list" autoComplete="off" value={area} onChange={(e) => setArea(e.target.value)} placeholder="For example: Koramangala" {...invalid("area")} />
          <datalist id="area-list">{AREAS.map((a) => <option key={a.slug} value={a.name} />)}</datalist>
          {errors.area && <p className="err" id="e-area">{errors.area}</p>}
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="f-date">Date needed</label>
          <input id="f-date" className="input" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} {...invalid("date")} />
          {errors.date && <p className="err" id="e-date">{errors.date}</p>}
        </div>
        <div className="field">
          <label htmlFor="f-time">Time <span className="hint">(optional)</span></label>
          <input id="f-time" className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-name">Your name</label>
        <input id="f-name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} {...invalid("name")} />
        {errors.name && <p className="err" id="e-name">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-notes">Anything else? <span className="hint">(optional)</span></label>
        <textarea id="f-notes" className="input" value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Occasion, spice level, veg-only, packing, or dishes not listed above" />
      </div>

      <div>
        <div className="form-actions">
          <button type="submit" className="pill">{HAS_WHATSAPP ? "Send on WhatsApp" : "Prepare my enquiry"}</button>
          {HAS_PHONE && <a className="link-more" href={telLink()}>Or call {SITE.phone}</a>}
        </div>
        <p className="fine" style={{ marginTop: 12 }}>
          {HAS_WHATSAPP ? "Your enquiry opens in WhatsApp, ready to send to us." : "Your enquiry is prepared as a message you can send us."} This website doesn’t store your details.
        </p>
      </div>

      {message && (
        <div className="ready" ref={readyRef} tabIndex={-1} aria-live="polite">
          <strong>Your enquiry is ready.</strong>
          <pre>{message}</pre>
          <div className="form-actions" style={{ marginTop: 16 }}>
            {HAS_WHATSAPP && <a className="pill" href={waLink(message)} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>}
            <button type="button" className="pill ghost" onClick={copy}>{copied ? "Copied" : "Copy message"}</button>
            {HAS_PHONE && <a className="link-more" href={telLink()}>Call {SITE.phone}</a>}
          </div>
          {!HAS_WHATSAPP && (
            <p className="notice">
              Setup needed: the business WhatsApp number hasn’t been added to the site yet, so this message can’t be sent automatically.
              Add it in <code>src/data/site.ts</code>.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
