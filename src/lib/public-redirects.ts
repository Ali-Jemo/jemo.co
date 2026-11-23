/**
 * Permanent moves for routes the public site no longer serves.
 * Next.js `statusCode: 301` is what browsers and crawlers cache.
 */
export type PublicRedirect = {
  source: string;
  destination: string;
  statusCode: 301;
};

export const publicRedirects: PublicRedirect[] = [
  { source: "/transparency", destination: "/", statusCode: 301 },
  { source: "/login", destination: "/sign-in", statusCode: 301 },
  { source: "/signup", destination: "/sign-up", statusCode: 301 },

  { source: "/publications", destination: "/research", statusCode: 301 },
  { source: "/publications/:path*", destination: "/research", statusCode: 301 },
  { source: "/questions", destination: "/research?tab=questions", statusCode: 301 },
  { source: "/questions/:path*", destination: "/research?tab=questions", statusCode: 301 },

  { source: "/labs", destination: "/projects", statusCode: 301 },
  { source: "/labs/:path*", destination: "/projects", statusCode: 301 },

  { source: "/faq", destination: "/explain#faq", statusCode: 301 },
  { source: "/benchmarks", destination: "/explain#acceptance", statusCode: 301 },
  { source: "/benchmarks/:path*", destination: "/explain#acceptance", statusCode: 301 },

  { source: "/about/partners", destination: "/about#partners", statusCode: 301 },
  { source: "/partners", destination: "/about#partners", statusCode: 301 },
  { source: "/partners/:path*", destination: "/about#partners", statusCode: 301 },

  { source: "/news", destination: "/", statusCode: 301 },
  { source: "/news/:path*", destination: "/", statusCode: 301 },
  { source: "/newsletter", destination: "/#newsletter", statusCode: 301 },
  { source: "/newsletter/:path*", destination: "/#newsletter", statusCode: 301 },
  { source: "/gallery", destination: "/", statusCode: 301 },
  { source: "/gallery/:path*", destination: "/", statusCode: 301 },
  { source: "/media", destination: "/", statusCode: 301 },
  { source: "/applications", destination: "/publish", statusCode: 301 },
  { source: "/applications/:path*", destination: "/publish", statusCode: 301 },
  { source: "/apply", destination: "/publish", statusCode: 301 },
  { source: "/join", destination: "/publish", statusCode: 301 },

  { source: "/initiatives/iraq-plus-plus", destination: "https://ali.lxds.org/", statusCode: 301 },
  { source: "/initiatives", destination: "/projects", statusCode: 301 },
  { source: "/initiatives/:path*", destination: "/projects", statusCode: 301 },
  { source: "/projects/iraq-plus-plus", destination: "https://ali.lxds.org/", statusCode: 301 },
  { source: "/projects/labpoint-ashurix", destination: "https://ali.lxds.org/", statusCode: 301 },
  { source: "/research/ashurix-academic-currency-tokenomics", destination: "https://ali.lxds.org/", statusCode: 301 },

  { source: "/events", destination: "/", statusCode: 301 },
  { source: "/events/:path*", destination: "/", statusCode: 301 },
  { source: "/timeline", destination: "/", statusCode: 301 },
  { source: "/support", destination: "/contact", statusCode: 301 },
  { source: "/infrastructure", destination: "/projects", statusCode: 301 },
  { source: "/open-source", destination: "/projects", statusCode: 301 },
  { source: "/peer-review", destination: "/explain", statusCode: 301 },
  { source: "/summary", destination: "/explain#dialect", statusCode: 301 },

  { source: "/researchers", destination: "/researchers/ali-jemo", statusCode: 301 },
];
