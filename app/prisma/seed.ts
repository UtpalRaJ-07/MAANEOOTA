// Seed script. Loads all 120 area candidates as DRAFT (no fabricated geography).
// A small labelled-fixture subset gets sourced geography + kitchens + meals so
// the publication gate and ordering flow are demonstrable end to end.
import { PrismaClient } from "@prisma/client";
import { AREA_CANDIDATES, CITY_SERVICES } from "../src/lib/areas";

const prisma = new PrismaClient();

function futureDate(days: number): string {
  const d = new Date(Date.now() + days * 86400000);
  return d.toISOString().slice(0, 10);
}

async function main() {
  console.log("Seeding MAANE OOTA (sandbox)...");

  // City
  const city = await prisma.city.upsert({
    where: { slug: "bengaluru" },
    update: {},
    create: { name: "Bengaluru", slug: "bengaluru", timezone: "Asia/Kolkata" },
  });

  // 120 draft locations. Geography left null/unverified.
  for (const a of AREA_CANDIDATES) {
    const loc = await prisma.location.upsert({
      where: { cityId_slug: { cityId: city.id, slug: a.slug } },
      update: {},
      create: {
        cityId: city.id, name: a.name, slug: a.slug, type: "area",
        acquisitionGroup: a.group,
        // provenance fields intentionally null — not yet sourced
      },
    });
    for (const alias of a.aliases ?? []) {
      const exists = await prisma.locationAlias.findFirst({ where: { locationId: loc.id, alias } });
      if (!exists) await prisma.locationAlias.create({ data: { locationId: loc.id, alias } });
    }
    // Every area gets a DRAFT SEO page (not indexable, not in sitemap).
    await prisma.seoPage.upsert({
      where: { route: `/home-food-delivery/bengaluru/${a.slug}` },
      update: {},
      create: {
        route: `/home-food-delivery/bengaluru/${a.slug}`,
        locationId: loc.id,
        title: `Homemade Food Delivery in ${a.name} | MAANE OOTA`,
        h1: `Homemade Food Delivery in ${a.name}`,
        intent: "area-home-food",
        state: "draft",
        sitemapIncluded: false,
      },
    });
  }

  // Users (one per role) — sandbox fixtures.
  const roles: [string, string, string][] = [
    ["+910000000001", "Demo Customer", "customer"],
    ["+910000000002", "Demo Partner", "partner"],
    ["+910000000003", "Demo Admin", "admin"],
    ["+910000000004", "Demo Content", "content"],
  ];
  const users: Record<string, any> = {};
  for (const [phone, name, role] of roles) {
    users[role] = await prisma.user.upsert({
      where: { phone }, update: {}, create: { phone, name, role, phoneVerified: true },
    });
  }

  // Demonstrable subset: give three areas real geography + kitchens + meals so
  // the publication gate can pass. These kitchens are FIXTURES (isFixture=true).
  const demoAreas = ["hsr-layout", "koramangala", "whitefield"];
  const cuisines = ["south-indian", "north-indian", "karnataka"];

  for (let ai = 0; ai < demoAreas.length; ai++) {
    const slug = demoAreas[ai];
    const loc = await prisma.location.findFirst({ where: { cityId: city.id, slug } });
    if (!loc) continue;
    // Mark geography as "sourced" in sandbox (documented as fixture provenance).
    await prisma.location.update({
      where: { id: loc.id },
      data: { geoSource: "sandbox-fixture", geoVerifiedAt: new Date(), confidence: "fixture" },
    });

    // Two kitchens per demo area for choice/resilience.
    for (let k = 0; k < 2; k++) {
      const kslug = `${slug}-fixture-kitchen-${k + 1}`;
      const kitchen = await prisma.kitchen.upsert({
        where: { slug: kslug },
        update: {},
        create: {
          ownerId: users.partner.id,
          name: `${loc.name} Home Kitchen ${k + 1} (Fixture)`,
          slug: kslug,
          kitchenType: k === 0 ? "home-kitchen" : "home-cook",
          state: "approved",
          verificationScope: "Sandbox fixture — documents reviewed in demo only",
          verifiedAt: new Date(),
          publicSummary: `Illustrative home kitchen serving ${loc.name}. Sandbox fixture, not a real business.`,
          isFixture: true,
        },
      });
      await prisma.kitchenCoverage.upsert({
        where: { kitchenId_locationId: { kitchenId: kitchen.id, locationId: loc.id } },
        update: {},
        create: { kitchenId: kitchen.id, locationId: loc.id, deliveryMode: "partner", deliveryFeePaise: 2500 },
      });

      // Meals (>=3 to pass the gate).
      const meals = [
        { name: "Veg Meals Box", pricePaise: 12000, diet: "veg", meal: "lunch" },
        { name: "Ragi Mudde Combo", pricePaise: 14000, diet: "veg", meal: "lunch" },
        { name: "Chapati Sabzi Dinner", pricePaise: 13000, diet: "veg", meal: "dinner" },
        { name: "Chicken Curry Meals", pricePaise: 18000, diet: "non-veg", meal: "lunch" },
      ];
      const created: any[] = [];
      for (const m of meals) {
        const mi = await prisma.menuItem.create({
          data: {
            kitchenId: kitchen.id, name: m.name, pricePaise: m.pricePaise, portion: "1 person",
            dietTags: m.diet, mealType: m.meal, cuisine: cuisines[ai], isListed: true,
            description: `${m.name} — sandbox fixture item for ${loc.name}.`,
          },
        });
        created.push(mi);
      }

      // Slots for the next 3 days, lunch + dinner, with capacity.
      for (let d = 1; d <= 3; d++) {
        for (const meal of ["lunch", "dinner"]) {
          const slot = await prisma.slot.create({
            data: {
              kitchenId: kitchen.id, serviceDate: futureDate(d), mealType: meal,
              cutoff: new Date(Date.now() + d * 86400000 - 3600000),
              capacity: 10, committed: 0,
            },
          });
          for (const mi of created.filter((c) => c.mealType === meal)) {
            await prisma.itemAvailability.create({ data: { slotId: slot.id, menuItemId: mi.id, capacity: 10 } });
          }
        }
      }
    }

    // Mark the SEO page reviewed so the editorial gate can pass in demo.
    await prisma.seoPage.update({
      where: { route: `/home-food-delivery/bengaluru/${slug}` },
      data: {
        state: "in_review",
        reviewer: "Demo Content",
        reviewedAt: new Date(),
        description: `Find homemade meals serving ${loc.name}. Check local kitchens, meal prices and delivery slots. Order lunch, dinner or request food in bulk.`,
      },
    });
  }

  // One meal pack fixture.
  const anyKitchen = await prisma.kitchen.findFirst({ where: { slug: "hsr-layout-fixture-kitchen-1" } });
  if (anyKitchen) {
    await prisma.mealPack.create({
      data: { kitchenId: anyKitchen.id, name: "5 Weekday Lunches (Fixture)", mealCount: 5, pricePaise: 55000, mealType: "lunch" },
    });
  }

  // Staging offer (explicitly NOT an approved live offer).
  await prisma.promotion.upsert({
    where: { code: "TRIAL30" },
    update: {},
    create: {
      code: "TRIAL30", kind: "trial", amountPaise: 3000, minSubtotalPaise: 19900,
      startAt: new Date(Date.now() - 86400000), endAt: new Date(Date.now() + 30 * 86400000),
      totalBudgetPaise: 500000, perUserLimit: 1, stackable: false, termsVersion: "staging-v1", active: true,
    },
  });

  // City service SEO pages (draft).
  for (const svc of CITY_SERVICES) {
    await prisma.seoPage.upsert({
      where: { route: `/bengaluru/${svc}` },
      update: {},
      create: {
        route: `/bengaluru/${svc}`,
        title: `${svc.replace(/-/g, " ")} in Bengaluru | MAANE OOTA`,
        h1: `${svc.replace(/-/g, " ")} in Bengaluru`,
        intent: `city-${svc}`, state: "draft", sitemapIncluded: false,
      },
    });
  }

  console.log("Seed complete.");
  const counts = {
    locations: await prisma.location.count(),
    kitchens: await prisma.kitchen.count(),
    meals: await prisma.menuItem.count(),
    slots: await prisma.slot.count(),
    seoPages: await prisma.seoPage.count(),
  };
  console.log(counts);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
