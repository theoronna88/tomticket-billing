export interface Cliente {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  monthly_tickets_quota: number | null;
  allowed_create_tickets: boolean | null;
  email_validated: boolean | null;
  active: boolean | null;
  account_approved: boolean | null;
  organization: {
    id: string | undefined;
    name: string | undefined;
  };
  creation_date: string | undefined;
  custom_fields: Array<{
    field_id: string | undefined;
    field_name: string | undefined;
    value: string | undefined;
  }> | null;
}

export interface ClienteResponse {
  error: boolean;
  message: string | null;
  data: Cliente[] | null;
  success: boolean;
}
