const STEPS = [
  { t: "Tell us what you need", d: "The dishes, how much, the date and time, and your area. Use the quote form or call us." },
  { t: "Get your custom quote", d: "We price your exact order and confirm the menu, quantity and timing with you." },
  { t: "We cook and deliver", d: "Your food is prepared for your date and brought to your address." },
];

export function Steps() {
  return (
    <ol className="steps">
      {STEPS.map((s, i) => (
        <li className="step reveal" key={s.t}>
          <span className="n" aria-hidden="true">{i + 1}</span>
          <h3>{s.t}</h3>
          <p>{s.d}</p>
        </li>
      ))}
    </ol>
  );
}
