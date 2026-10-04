// ---------------------------------------------------------------------------
// Business details. Fill these in before going live. Empty values are hidden
// on the site (the enquiry form shows a setup notice until WhatsApp is set).
// ---------------------------------------------------------------------------
export const SITE = {
  name: "MAANE OOTA",
  // Your real domain. Used for canonical URLs, the sitemap and link previews.
  url: "https://www.yourdomain.in",
  // WhatsApp number, digits only with country code, e.g. "91XXXXXXXXXX".
  whatsapp: "",
  // Phone number as customers should see it, e.g. "+91 XXXXX XXXXX".
  phone: "",
  email: "",
  // Full Instagram profile URL, optional.
  instagram: "",
};

const digits = (s: string) => s.replace(/\D/g, "");
export const HAS_WHATSAPP = digits(SITE.whatsapp).length >= 11;
export const HAS_PHONE = digits(SITE.phone).length >= 10;

export function waLink(text?: string) {
  return `https://wa.me/${digits(SITE.whatsapp)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
export function telLink() {
  return `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;
}
