export interface SearchHit {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  to: string;
}

/** Case-insensitive substring scoring across a haystack of fields.
 *  Title matches weigh 3×; every additional field hit adds 1. Empty
 *  queries return no hits. Results are sorted by descending score. */
export function searchItems<T extends object>(
  items: readonly T[],
  query: string,
  toHit: (item: T) => Omit<SearchHit, 'id'> & { id?: string } & Record<string, unknown>,
): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const hits: { hit: SearchHit; score: number }[] = [];
  for (const item of items) {
    const built = toHit(item);
    const haystack =
      `${built.title} ${built.subtitle} ${built.category} ${Object.values(item).filter((v) => typeof v === 'string').join(' ')}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (built.title.toLowerCase().includes(term)) score += 3;
      if (haystack.includes(term)) score += 1;
    }
    if (score > 0) {
      const { title, subtitle, category, to, ...rest } = built;
      hits.push({ hit: { id: (rest.id as string) ?? title, title, subtitle, category, to }, score });
    }
  }
  return hits.sort((a, b) => b.score - a.score).map((h) => h.hit);
}
