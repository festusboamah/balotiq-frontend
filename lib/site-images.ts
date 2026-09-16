import { API_URL } from "@/lib/api-client";
import type { SiteImageResponse } from "@/lib/types";

export type SiteImageSlug =
  | "homepage-governance-card"
  | "homepage-engage-card"
  | "homepage-carousel-governance"
  | "homepage-carousel-engage"
  | "homepage-carousel-organiser"
  | "homepage-devices-mockup";

export type SiteImageMap = Record<SiteImageSlug, { url: string; alt: string }>;

// Mirrors the backend's site_images seed data -- used as a fallback so the
// homepage still renders correctly if the API is unreachable, and as the
// shape the homepage falls back to before its own fetch resolves.
export const SITE_IMAGE_DEFAULTS: SiteImageMap = {
  "homepage-governance-card": { url: "/images/ghana/governance-campus.webp", alt: "Students checking in with an election organiser on a university campus" },
  "homepage-engage-card": { url: "/images/ghana/engage-awards.webp", alt: "Contestants and a host celebrating together on an awards stage" },
  "homepage-carousel-governance": { url: "/images/ghana/governance-campus.webp", alt: "Ghanaian university students checking in with an election official at a campus voting station" },
  "homepage-carousel-engage": { url: "/images/ghana/engage-awards.webp", alt: "Ghanaian contestants and a host on stage at an elegant awards event in Accra" },
  "homepage-carousel-organiser": { url: "/images/ghana/organiser-team.webp", alt: "Three Ghanaian event professionals collaborating around a laptop and tablet in a modern Accra office" },
  "homepage-devices-mockup": { url: "/images/balotiq-responsive-devices.webp", alt: "Balotiq Annual Elections dashboard displayed responsively on a MacBook, tablet, and smartphone" },
};

// An admin-uploaded replacement is a backend-served /uploads/... path and
// needs the API's own origin; a default is a path already bundled with the
// frontend build and stays relative. Same convention as photo_url elsewhere.
export function resolveSiteImageUrl(url: string): string {
  return url.startsWith("/uploads/") ? `${API_URL}${url}` : url;
}

export function buildSiteImageMap(rows: SiteImageResponse[]): SiteImageMap {
  const map = { ...SITE_IMAGE_DEFAULTS };
  for (const row of rows) {
    if (row.slug in map) map[row.slug as SiteImageSlug] = { url: row.image_url, alt: row.alt_text };
  }
  return map;
}
