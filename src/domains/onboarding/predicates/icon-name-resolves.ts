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

export function getRegisteredIconNames(): ReadonlyArray<string> {
  return Object.keys(ICON_REGISTRY);
}

export function doesIconNameResolve(name: string | undefined): boolean {
  return typeof name === 'string' && name in ICON_REGISTRY;
}

export function resolveIconByName(name: string | undefined): LucideIcon | null {
  if (!doesIconNameResolve(name)) return null;
  return ICON_REGISTRY[name as string];
}
