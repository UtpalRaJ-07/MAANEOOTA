import Link from "next/link";
import { type Dish, unitLabel } from "@/data/dishes";
import { cuisineSlug } from "@/data/cuisines";
import { DietMark } from "./DietMark";

function dishHref(d: Dish) {
  return `/${cuisineSlug(d.cuisine)}/${d.slug}/`;
}

export function DishCard({ dish, link = true }: { dish: Dish; link?: boolean }) {
  const body = (
    <article className="dish">
      {dish.image && (
        <div className="dish-media">
          <img src={dish.image} alt={dish.name} width={800} height={600} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="dish-body">
        <h3><DietMark diet={dish.diet} />{dish.name}</h3>
        <p>{dish.desc}</p>
        <p className="unit">{unitLabel(dish.unit)}</p>
      </div>
    </article>
  );
  return (
    <div className="reveal">
      {link ? <Link className="dish-link" href={dishHref(dish)}>{body}</Link> : body}
    </div>
  );
}

export function DishList({ dishes, link = true }: { dishes: Dish[]; link?: boolean }) {
  const by = (u: Dish["unit"]) => (u === "kg" ? "By kg" : u === "litres" ? "By litre" : "By piece");
  return (
    <ul className="menu-list">
      {dishes.map((d) => (
        <li key={d.slug}>
          <DietMark diet={d.diet} />
          <div>
            <h3>{link ? <Link href={dishHref(d)}>{d.name}</Link> : d.name}</h3>
            <p>{d.desc}</p>
          </div>
          <span className="by">{by(d.unit)}</span>
        </li>
      ))}
    </ul>
  );
}
