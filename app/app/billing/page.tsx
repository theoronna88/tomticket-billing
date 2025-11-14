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
import { Cliente } from "@/app/types";

const Billing = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [openEnd, setOpenEnd] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCliente, setSelectedCliente] = useState<string | undefined>(
    undefined
  );

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
      console.log("Gerar fatura para o cliente:", selectedCliente);
      console.log("Período:", startDate, "a", endDate);

      // Chama action para gerar fatura
      const { gerarFatura } = await import("@/app/_actions/actions");
      const resultado = await gerarFatura({
        cliente: selectedCliente,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      console.log("Fatura gerada:", resultado);
    } catch (error) {
      console.error("Erro ao gerar fatura:", error);
    }
  };

  return (
    <>
      <Card>
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
              onValueChange={(value) => setSelectedCliente(value)}
              value={selectedCliente}
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
    </>
  );
};

export default Billing;
