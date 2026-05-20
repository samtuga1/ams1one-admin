const ROUTE_MAP: { prefixes: string[]; href: string }[] = [
  { prefixes: ["sales."], href: "/sales?tab=tickets" },
  { prefixes: ["analysis."], href: "/analysis" },
  { prefixes: ["draw.", "autodraw."], href: "/draws" },
  { prefixes: ["reports."], href: "/reports" },
  { prefixes: ["supervisors."], href: "/supervisors" },
  { prefixes: ["writers."], href: "/writers" },
  { prefixes: ["players.dollar_rush."], href: "/dollar-rush-players" },
  { prefixes: ["players.five_ninety."], href: "/five-ninety-players" },
  { prefixes: ["events."], href: "/events" },
  { prefixes: ["admin."], href: "/settings" },
];

export function getFirstAccessibleHref(pages: string[] | "*"): string {
  if (pages === "*") return "/sales?tab=tickets";
  for (const { prefixes, href } of ROUTE_MAP) {
    if (pages.some((key) => prefixes.some((p) => key.startsWith(p)))) {
      return href;
    }
  }
  return "/settings";
}
