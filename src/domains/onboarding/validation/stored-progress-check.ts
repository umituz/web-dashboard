export interface StoredProgressShape {
  version: 1;
  currentStep: number;
  completedSteps: string[];
  collected: Record<string, unknown>;
  startedAt: string;   lastUpdated: string; }

export type StoredProgressOutcome =
  | { ok: true; data: StoredProgressShape }
  | { ok: false; reason: string };

const STORAGE_VERSION = 1;
const MIN_STEP_INDEX = 0;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function isIsoDateString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const ms = Date.parse(value);
  return Number.isFinite(ms);
}

export function checkStoredProgress(raw: string | null): StoredProgressOutcome {
  if (raw === null) return { ok: false, reason: 'no stored progress' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : 'invalid JSON',
    };
  }
  if (!isObject(parsed)) {
    return { ok: false, reason: 'stored payload must be an object' };
  }
  if (parsed.version !== STORAGE_VERSION) {
    return { ok: false, reason: `unsupported storage version: ${String(parsed.version)}` };
  }
  if (typeof parsed.currentStep !== 'number' || parsed.currentStep < MIN_STEP_INDEX) {
    return { ok: false, reason: 'currentStep must be a non-negative number' };
  }
  if (!isStringArray(parsed.completedSteps)) {
    return { ok: false, reason: 'completedSteps must be a string array' };
  }
  if (!isObject(parsed.collected)) {
    return { ok: false, reason: 'collected must be an object' };
  }
  if (!isIsoDateString(parsed.startedAt) || !isIsoDateString(parsed.lastUpdated)) {
    return { ok: false, reason: 'startedAt and lastUpdated must be ISO date strings' };
  }
  return { ok: true, data: parsed as unknown as StoredProgressShape };
}
