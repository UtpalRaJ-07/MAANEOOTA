import type { Diet } from "@/data/dishes";

export function DietMark({ diet }: { diet: Diet }) {
  const label = diet === "veg" ? "Vegetarian" : "Non-vegetarian";
  return <span className={`diet ${diet}`} role="img" aria-label={label} title={label} />;
}

export function DietLegend() {
  return (
    <p className="legend reveal">
      <span><DietMark diet="veg" /> Vegetarian</span>
      <span><DietMark diet="nonveg" /> Non-vegetarian</span>
    </p>
  );
}
