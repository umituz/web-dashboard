import { ScrollText } from "lucide-react";
import { useT } from "@umituz/web-localization/react";
import { SETTINGS_ADMIN_KEYS } from "../utils/i18nKeys";

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target?: string;
  at: string;
}

export interface AuditLogListProps {
  entries: AuditEntry[];
}

const formatAt = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toISOString().slice(0, 16).replace("T", " ");
};

export const AuditLogList = ({ entries }: AuditLogListProps) => {
  const t = useT();

  if (entries.length === 0) {
    return (
      <div className="udb-empty">
        <div className="udb-empty__icon">
          <ScrollText className="udb-empty__glyph" aria-hidden="true" />
        </div>
        <p className="udb-empty__text">{t(SETTINGS_ADMIN_KEYS.audit.empty)}</p>
      </div>
    );
  }

  return (
    <ul className="udb-audit">
      {entries.map((entry) => (
        <li key={entry.id} className="udb-audit__item">
          <span className="udb-audit__at">{formatAt(entry.at)}</span>
          <span className="udb-audit__actor">{entry.actor}</span>
          <span className="udb-audit__action">{entry.action}</span>
          {entry.target && <span className="udb-audit__target">{entry.target}</span>}
        </li>
      ))}
    </ul>
  );
};

export default AuditLogList;
