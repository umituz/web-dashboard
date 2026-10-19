import { resolveIconByName } from '../predicates/icon-name-resolves';

export function renderBundledIcon(name: string | undefined, className?: string) {
  const Icon = resolveIconByName(name);
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}
