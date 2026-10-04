// Serviceability engine — master plan section 4. Returns one honest state.
// PIN matching alone never establishes eligibility.
import { prisma } from "@/lib/db";

export type ServiceState =
  | "available"        // available in selected slot
  | "available_later"  // schedule a later slot
  | "bulk_only"
  | "paused"
  | "not_served"
  | "location_unclear";

export interface ServiceabilityResult {
  state: ServiceState;
  message: string;
  kitchens: { id: string; name: string; slug: string }[];
  nextSlotDate?: string;
}

export async function checkServiceability(params: {
  locationSlug?: string;
  serviceDate?: string;
  mealType?: string;
}): Promise<ServiceabilityResult> {
  const { locationSlug, serviceDate, mealType } = params;

  if (!locationSlug) {
    return { state: "location_unclear", message: "Please select your locality so we can check delivery.", kitchens: [] };
  }

  const location = await prisma.location.findFirst({
    where: { slug: locationSlug },
    include: {
      kitchenCoverage: {
        include: { kitchen: { include: { slots: true, menuItems: true } } },
      },
    },
  });

  if (!location) {
    return { state: "location_unclear", message: "We could not identify that locality. Try another name.", kitchens: [] };
  }

  const approved = location.kitchenCoverage.filter((c) => c.kitchen.state === "approved");
  const suspended = location.kitchenCoverage.filter((c) => c.kitchen.state === "suspended");
  const bulkOnly = approved.filter((c) => c.kitchen.kitchenType === "bulk-supplier");
  const regular = approved.filter((c) => c.kitchen.kitchenType !== "bulk-supplier");

  if (approved.length === 0) {
    if (suspended.length > 0) {
      return { state: "paused", message: "Kitchens serving this area are temporarily paused. Try a later slot or join the waitlist.", kitchens: [] };
    }
    return { state: "not_served", message: "We do not serve this area yet. Join the waitlist or suggest a cook.", kitchens: [] };
  }

  if (regular.length === 0 && bulkOnly.length > 0) {
    return {
      state: "bulk_only",
      message: "Only bulk/function catering is available here right now. Submit a bulk enquiry.",
      kitchens: bulkOnly.map((c) => ({ id: c.kitchen.id, name: c.kitchen.name, slug: c.kitchen.slug })),
    };
  }

  // Look for a slot with remaining capacity matching date/meal.
  let hasNow = false;
  let nextSlotDate: string | undefined;
  for (const c of regular) {
    for (const s of c.kitchen.slots) {
      const capacityLeft = s.capacity - s.committed;
      if (capacityLeft <= 0) continue;
      const dateMatch = !serviceDate || s.serviceDate === serviceDate;
      const mealMatch = !mealType || s.mealType === mealType;
      if (dateMatch && mealMatch) hasNow = true;
      if (!nextSlotDate || s.serviceDate < nextSlotDate) nextSlotDate = s.serviceDate;
    }
  }

  const kitchens = regular.map((c) => ({ id: c.kitchen.id, name: c.kitchen.name, slug: c.kitchen.slug }));

  if (hasNow) {
    return { state: "available", message: "Available for your selected slot.", kitchens, nextSlotDate };
  }
  if (nextSlotDate) {
    return { state: "available_later", message: `Next available date is ${nextSlotDate}. You can schedule an order.`, kitchens, nextSlotDate };
  }
  return { state: "paused", message: "No upcoming slots open right now. Please check back or request notification.", kitchens };
}
