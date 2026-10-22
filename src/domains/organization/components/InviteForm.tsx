import { useState } from "react";
import { Button, Input, NativeSelect } from "@umituz/web-design-system/atoms";
import type { RoleInfo } from "../../permissions/types";
import type { OrgInviteInput } from "../types";

export interface InviteFormLabels {
  name: string;
  email: string;
  role: string;
  submit: string;
  invalidEmail: string;
}

export interface InviteFormProps {
  roles: readonly RoleInfo[];
  defaultRole?: string;
  labels?: Partial<InviteFormLabels>;
  busy?: boolean;
  onInvite: (input: OrgInviteInput) => void;
  onCancel?: () => void;
  cancelLabel?: string;
}

const DEFAULT_LABELS: InviteFormLabels = {
  name: "Full name",
  email: "Email",
  role: "Role",
  submit: "Send invite",
  invalidEmail: "Enter a valid email address",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const InviteForm = ({
  roles,
  defaultRole,
  labels,
  busy = false,
  onInvite,
  onCancel,
  cancelLabel = "Cancel",
}: InviteFormProps) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(defaultRole ?? roles[0]?.key ?? "");

  const emailValid = EMAIL_PATTERN.test(email.trim());
  const touched = email.length > 0;
  const canSubmit = emailValid && role.length > 0 && !busy;

  const submit = () => {
    if (!canSubmit) return;
    onInvite({ email: email.trim(), ...(name.trim() ? { name: name.trim() } : {}), role });
    setName("");
    setEmail("");
  };

  return (
    <form
      className="udb-invite"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="udb-invite__grid">
        <Input
          label={text.name}
          value={name}
          autoComplete="off"
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label={text.email}
          type="email"
          value={email}
          error={touched && !emailValid ? text.invalidEmail : undefined}
          autoComplete="off"
          onChange={(event) => setEmail(event.target.value)}
        />
        <NativeSelect
          label={text.role}
          value={role}
          options={roles.map((entry) => ({ value: entry.key, label: entry.label }))}
          onValueChange={setRole}
        />
      </div>
      <div className="udb-invite__actions">
        <Button type="submit" disabled={!canSubmit} loading={busy}>
          {text.submit}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
};
