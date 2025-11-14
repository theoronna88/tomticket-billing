"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useEffect, useState } from "react";
import { buscarClientes } from "@/app/_actions/actions";
import CalendarComponent from "@/app/_components/calendar-component";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";
import { Cliente, Fatura } from "@/app/types";
import { gerarFatura } from "@/app/_actions/actions";
import BillingTemplate from "@/app/_components/billing-template/page";

const Billing = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [openEnd, setOpenEnd] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedStringCliente, setSelectedStringCliente] = useState<
    string | null
  >(null);
  const [fatura, setFatura] = useState<Fatura[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response: Cliente[] = await buscarClientes();

      setClientes(
        response || [
          {
            id: "",
            name: "",
            email: "",
            phone: "",
            monthly_tickets_quota: 0,
            allowed_create_tickets: true,
            email_validated: true,
            active: true,
            account_approved: true,
            organization: { id: "", name: "" },
            creation_date: "",
            custom_fields: [],
          },
        ]
      );
    }
    fetchData();
  }, []);

  const handleGenerateInvoice = async () => {
    if (!selectedCliente || !startDate || !endDate) {
      console.error("Preencha todos os campos");
      return;
    }

    try {
      const resultado = await gerarFatura({
        cliente: selectedCliente,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setFatura(resultado);
    } catch (error) {
      console.error("Erro ao gerar fatura:", error);
    }
  };

  const handleSelectCliente = (value: string) => {
    const cliente = clientes.find((c) => c.id === value) || null;
    setSelectedCliente(cliente);
    setSelectedStringCliente(value);
  };

  return (
    <>
      <Card className="not-print">
        <CardHeader>
          <CardTitle>Gerar Nova Fatura</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic p-2">
            Selecionar cliente e período para gerar a fatura
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <Label>Cliente</Label>
            <Select
              onValueChange={handleSelectCliente}
              value={selectedStringCliente ?? undefined}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clientes</SelectLabel>
                  {clientes &&
                    clientes.map((cliente, idx) => (
                      <SelectItem
                        key={cliente.id ?? `cliente-${idx}`}
                        value={cliente.id ?? ""}
                      >
                        {cliente.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex gap-4">
              <CalendarComponent
                label="Data inicial"
                open={open}
                setOpen={setOpen}
                date={startDate}
                setDate={setStartDate}
              />

              <CalendarComponent
                label="Data final"
                open={openEnd}
                setOpen={setOpenEnd}
                date={endDate}
                setDate={setEndDate}
              />

              <div className="flex ml-8 mb-0 mt-auto">
                <Button onClick={handleGenerateInvoice}>Gerar Fatura</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {fatura && (
        <>
          <div className="mt-8 not-print flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">Fatura Gerada</h2>
            <Button onClick={() => window.print()} variant="default">
              Imprimir Fatura
            </Button>
          </div>
          <BillingTemplate
            fatura={fatura}
            startDate={startDate}
            endDate={endDate}
            cliente={selectedCliente}
          />
        </>
      )}
    </>
  );
};

export default Billing;
