import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  NativeSelect,
} from "@umituz/web-design-system/atoms";

export interface OrganizationProfile {
  name: string;
  legalName?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export type OrganizationFieldKey = keyof OrganizationProfile;

export type OrganizationSelectKey = "timezone" | "locale" | "currency";

export interface OrganizationSelectOption {
  value: string;
  label: string;
}

export interface OrganizationFormLabels {
  name: string;
  legalName: string;
  timezone: string;
  locale: string;
  currency: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  save: string;
  reset: string;
}

export interface OrganizationProfileFormProps {
  value: OrganizationProfile;
  fields?: readonly OrganizationFieldKey[];
  selects?: Partial<
    Record<OrganizationSelectKey, readonly OrganizationSelectOption[]>
  >;
  labels?: Partial<OrganizationFormLabels>;
  busy?: boolean;
  onSave: (next: OrganizationProfile) => void;
}

const FIELD_ORDER: readonly OrganizationFieldKey[] = [
  "name",
  "legalName",
  "timezone",
  "locale",
  "currency",
  "address",
  "city",
  "country",
  "phone",
  "email",
  "website",
];

const DEFAULT_LABELS: OrganizationFormLabels = {
  name: "Organization name",
  legalName: "Legal name",
  timezone: "Timezone",
  locale: "Language",
  currency: "Currency",
  address: "Address",
  city: "City",
  country: "Country",
  phone: "Phone",
  email: "Email",
  website: "Website",
  save: "Save changes",
  reset: "Reset",
};

export const OrganizationProfileForm = ({
  value,
  fields,
  selects,
  labels,
  busy = false,
  onSave,
}: OrganizationProfileFormProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [draft, setDraft] = useState<OrganizationProfile>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const rendered = useMemo(
    () =>
      fields ??
      FIELD_ORDER.filter((key) => key === "name" || value[key] !== undefined),
    [fields, value],
  );

  const dirty = rendered.some(
    (key) => (draft[key] ?? "") !== (value[key] ?? ""),
  );
  const nameEmpty = draft.name.trim().length === 0;

  const setField = (key: OrganizationFieldKey, next: string) =>
    setDraft((current) => ({ ...current, [key]: next }));

  return (
    <div className="udb-org-form">
      <div className="udb-org-form__grid">
        {rendered.map((key) => {
          const options = selects?.[key as OrganizationSelectKey];
          if (options) {
            return (
              <NativeSelect
                key={key}
                label={text[key]}
                value={draft[key] ?? ""}
                options={options}
                onValueChange={(next) => setField(key, next)}
              />
            );
          }
          return (
            <Input
              key={key}
              label={text[key]}
              value={draft[key] ?? ""}
              onChange={(event) => setField(key, event.target.value)}
            />
          );
        })}
      </div>
      <div className="udb-org-form__actions">
        <Button
          variant="secondary"
          disabled={!dirty || busy}
          onClick={() => setDraft(value)}
        >
          {text.reset}
        </Button>
        <Button
          loading={busy}
          disabled={!dirty || busy || nameEmpty}
          onClick={() => onSave(draft)}
        >
          {text.save}
        </Button>
      </div>
    </div>
  );
};

export default OrganizationProfileForm;
