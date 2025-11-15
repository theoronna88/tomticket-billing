"use server";

import {
  buscarClientes as buscarClientesAPI,
  buscarChamadosPorClienteIdEStartDateEndDate,
  buscarDetalhesChamadoPorId,
} from "../api/api";
import { Cliente } from "../types";

export const buscarClientes = async () => {
  return await buscarClientesAPI();
};

export const converterData = async (date: Date | undefined) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 00:00:00-0300`;
};

export const gerarFatura = async ({
  cliente,
  startDate,
  endDate,
}: {
  cliente: Cliente;
  startDate: string;
  endDate: string;
}) => {
  try {
    // Valor das Visitas Presenciais Para Cada Cliente
    const campoPresencial = cliente.custom_fields?.find(
      (campo) => campo.name === "Valor Visita Presencial"
    );
    const valorPresencial = parseFloat(
      campoPresencial ? campoPresencial.value : "0"
    );

    // Valor das Visitas Remotas Para Cada Cliente
    const campoRemoto = cliente.custom_fields?.find(
      (campo) => campo.name === "Valor Visita Remota"
    );
    const valorRemoto = parseFloat(campoRemoto ? campoRemoto.value : "0");

    const calculoDeHoras = (horaInicio: string, horaFinalizada: string) => {
      const [inicioHoras, inicioMinutos] = horaInicio.split(":").map(Number);
      const [finalHoras, finalMinutos] = horaFinalizada.split(":").map(Number);
      const inicioTotalMinutos = inicioHoras * 60 + inicioMinutos;
      const finalTotalMinutos = finalHoras * 60 + finalMinutos;
      const diferencaMinutos = finalTotalMinutos - inicioTotalMinutos;

      // Converte minutos para horas decimais
      const horasDecimais = diferencaMinutos / 60;
      return horasDecimais.toFixed(2);
    };

    const valorTotalChamado = (valorVisita: number, horas: number) => {
      const total = valorVisita * horas;
      return total;
    };

    // Converter datas para o formato da API
    const dataInicio = await converterData(new Date(startDate));
    const dataFim = await converterData(new Date(endDate));

    // Chamar a API para pegar a lista de chamados
    const chamadosResponse = await buscarChamadosPorClienteIdEStartDateEndDate(
      cliente.id,
      dataInicio,
      dataFim
    );

    // Enriquecer os dados do chamado com os detalhes
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const BATCH_SIZE = 3; // máximo de 3 requisições por segundo

    // IDs dos campos customizados
    const FIELD_IDS = {
      DATA: "e8a8fa442be9cec32c5f27c9a83d20df",
      HORA_INICIO: "12d6257be6e2149050615a12beee4fdb",
      HORA_FINALIZADA: "0768e43a4cb163143531fbea62ba7d6e",
      UTILIZOU_MATERIAL: "312b613faf3f2540014239952d6e923b",
      SERVICO_EXECUTADO: "288aa4cb102bfa5ea571867de3ecd004",
    };

    for (let i = 0; i < chamadosResponse.length; i += BATCH_SIZE) {
      const batch = chamadosResponse.slice(i, i + BATCH_SIZE);
      const promises = batch.map((chamado) =>
        buscarDetalhesChamadoPorId(chamado.id)
      );
      const results = await Promise.all(promises);

      for (let j = 0; j < batch.length; j++) {
        const detalhes = results[j];
        const customFieldsClosed = detalhes?.data?.custom_fields?.closed || [];

        // Extrair apenas os campos específicos
        const horaInicio =
          customFieldsClosed.find(
            (f: { id: string; value: string }) => f.id === FIELD_IDS.HORA_INICIO
          )?.value || null;

        const horaFinalizada =
          customFieldsClosed.find(
            (f: { id: string; value: string }) =>
              f.id === FIELD_IDS.HORA_FINALIZADA
          )?.value || null;

        // Calcular horas trabalhadas
        const horasTrabalhadas =
          horaInicio && horaFinalizada
            ? calculoDeHoras(horaInicio, horaFinalizada)
            : "0.00";

        // TODO: Ajustar de acordo com a regra de négocio aplicada pelo cliente no TomTicket
        // TODO: Acrescentar à tela Settings essa configuração para o cliente escolher
        // Determinar valor da visita baseado no ticket_type
        // const ticketType = batch[j].ticket_type;
        // const valorVisita =
        // ticketType === "Externo" ? valorPresencial : valorRemoto;

        // Determinar valor da visita baseado no departamento do chamado
        const departament = batch[j].department.name;
        const valorVisita =
          departament === "Atendimento Remoto" ? valorRemoto : valorPresencial;

        // Calcular valor total do chamado
        const valorTotal = valorTotalChamado(
          valorVisita,
          parseFloat(horasTrabalhadas)
        );

        batch[j].customFields = {
          data:
            customFieldsClosed.find(
              (f: { id: string; value: string }) => f.id === FIELD_IDS.DATA
            )?.value || null,
          horaInicio,
          horaFinalizada,
          utilizouMaterial:
            customFieldsClosed.find(
              (f: { id: string; value: string }) =>
                f.id === FIELD_IDS.UTILIZOU_MATERIAL
            )?.value || null,
          servicoExecutado:
            customFieldsClosed.find(
              (f: { id: string; value: string }) =>
                f.id === FIELD_IDS.SERVICO_EXECUTADO
            )?.value || null,
          horasTrabalhadas,
          valorTotal: valorTotal.toFixed(2),
        };
      }

      // aguardar 1 segundo antes da próxima leva, se houver mais chamadas
      if (i + BATCH_SIZE < chamadosResponse.length) {
        await sleep(1000);
      }
    }

    return chamadosResponse;
  } catch (error) {
    console.error("Erro em gerarFatura:", error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    throw error;
  }
};
