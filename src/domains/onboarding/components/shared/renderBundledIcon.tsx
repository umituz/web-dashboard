import { resolveIconByName } from '../../predicates/icon-name-resolves';

/**
 * Render a bundled icon by registry name.
 *
 * Returns null when the name is not in the registry — callers combine it with
 * `doesIconNameResolve` when the surrounding markup must disappear with the icon.
 *
 * Why a helper instead of `const Icon = resolveIconByName(name)` inside the
 * component body? The registry lookup always yields a stable module-level
 * component (nothing is created per render), but assigning it to a variable
 * during render trips eslint-plugin-react-hooks' `static-components` rule at
 * the JSX usage site. A module-scope function returning the element keeps the
 * lint signal meaningful without suppression comments.
 */
export function renderBundledIcon(name: string | undefined, className?: string) {
  const Icon = resolveIconByName(name);
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}
