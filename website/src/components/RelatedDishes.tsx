import { DISHES, type Dish } from "@/data/dishes";
import { DishCard } from "./DishCard";

// Picks at least `min` related dishes: same cuisine first, then same diet.
export function RelatedDishes({ dish, min = 3 }: { dish: Dish; min?: number }) {
  const others = DISHES.filter((d) => d.slug !== dish.slug);
  const sameCuisine = others.filter((d) => d.cuisine === dish.cuisine);
  const sameDiet = others.filter((d) => d.cuisine !== dish.cuisine && d.diet === dish.diet);
  const withImage = (list: Dish[]) => [...list].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)));
  const picked = [...withImage(sameCuisine), ...withImage(sameDiet)].slice(0, Math.max(min, 3));
  if (picked.length < 2) return null;
  return (
    <div className={`grid ${picked.length === 3 ? "three" : ""}`} style={{ textAlign: "left" }}>
      {picked.map((d) => <DishCard key={d.slug} dish={d} />)}
    </div>
  );
}
