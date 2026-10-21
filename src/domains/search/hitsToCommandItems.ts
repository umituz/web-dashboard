import type { CommandItem } from '@umituz/web-design-system/organisms';
import type { SearchHit } from './searchItems';

export type NavigateFn = (to: string) => void;

export function hitsToCommandItems(hits: readonly SearchHit[], navigate: NavigateFn): CommandItem[] {
  return hits.map((hit) => ({
    id: hit.id,
    label: hit.title,
    hint: hit.category || undefined,
    keywords: `${hit.subtitle} ${hit.category}`.trim(),
    onSelect: () => navigate(hit.to),
  }));
}
