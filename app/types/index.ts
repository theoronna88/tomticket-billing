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
    id: string;
    name: string;
    value: string;
  }> | null;
}

export interface ClienteResponse {
  error: boolean;
  message: string | null;
  data: Cliente[] | null;
  success: boolean;
}

export interface Fatura {
  id: string;
  category: {
    id: string | null;
    name: string | null;
  };
  customFields: {
    data: string;
    horaInicio: string;
    horaFinalizada: string;
    servicoExecutado: string;
    utilizouMaterial: string;
    horasTrabalhadas: string;
    valorTotal: string;
  };
  customer: Cliente;
  ticket_type: string;
}
