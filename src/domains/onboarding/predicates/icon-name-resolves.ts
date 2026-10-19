/**
 * Icon name registry.
 *
 * Consumers configure icons by string name (`iconName`, `heroIconName`).
 * The library resolves those names against a CURATED, STATICALLY-IMPORTED set
 * of lucide-react icons. A static registry is what keeps the published bundle
 * small: a namespace import (`import * as Icons`) with dynamic lookup would
 * force every one of lucide's ~1,500 icons into the consumer's bundle.
 *
 * Icons not in the registry simply do not render (callers fall back to a
 * default or hide the icon slot). See README "Icons" for the full list.
 */
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Apple,
  Award,
  Ban,
  Bell,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  Download,
  Dumbbell,
  GraduationCap,
  Headphones,
  HeartPulse,
  Image,
  Infinity as InfinityIcon,
  Lock,
  MapPin,
  MessageCircle,
  Mic,
  Moon,
  Palette,
  PenTool,
  Play,
  Rocket,
  Rewind,
  Share2,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Square,
  Star,
  Theater,
  Tv,
  Users,
  X,
  Zap,
} from 'lucide-react';

const ICON_REGISTRY: Readonly<Record<string, LucideIcon>> = {
  Activity,
  AlertTriangle,
  Apple,
  Award,
  Ban,
  Bell,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  Download,
  Dumbbell,
  GraduationCap,
  Headphones,
  HeartPulse,
  Image,
  // `Infinity` is a reserved word — the lucide export is aliased at import.
  Infinity: InfinityIcon,
  Lock,
  MapPin,
  MessageCircle,
  Mic,
  Moon,
  Palette,
  PenTool,
  Play,
  Rocket,
  Rewind,
  Share2,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Square,
  Star,
  Theater,
  Tv,
  Users,
  X,
  Zap,
};

/** The icon names this package can resolve without application help. */
export function getRegisteredIconNames(): ReadonlyArray<string> {
  return Object.keys(ICON_REGISTRY);
}

/** Does the given name resolve to an icon bundled with this package? */
export function doesIconNameResolve(name: string | undefined): boolean {
  return typeof name === 'string' && name in ICON_REGISTRY;
}

/** Resolve a bundled icon by name. Returns null when the name is unknown. */
export function resolveIconByName(name: string | undefined): LucideIcon | null {
  if (!doesIconNameResolve(name)) return null;
  return ICON_REGISTRY[name as string];
}
