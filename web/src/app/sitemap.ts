import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ecotracegreen.com";
  const now = new Date();

  const routes = ["/", "/transparencia", "/metodologia", "/docs", "/legal/terms", "/legal/privacy", "/legal/carbon-claims"];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

