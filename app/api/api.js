"use server";

import { auth } from "@clerk/nextjs/server";

const baseUrl = process.env.TOMTICKET_API_URL;

const buscarToken = async () => {
  const { userId } = await auth();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/custom-settings/get-token?clerkId=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch token");
  }

  const data = await response.json();
  return data.tomTicketApiToken;
};

export const buscarClientes = async () => {
  const clientes = [];
  let page = 1;
  console.log(`Buscando clientes a partir da página ${page}...`);
  console.log(`Usando URL base: ${baseUrl}`);

  // Loop para buscar todas as páginas
  do {
    const response = await fetch(
      `${baseUrl}/customer/list?page=${page}&show_custom_fields=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await buscarToken()}`,
        },
      }
    );
    const data = await response.json();
    clientes.push(...data.data);
    page = data.next_page;
  } while (page);

  return clientes;
};

export const buscarChamadosPorClienteIdEStartDateEndDate = async (
  clienteId,
  startDate,
  endDate
) => {
  const chamados = [];
  let page = 1;
  console.log(
    `Buscando chamados para o cliente ${clienteId} a partir da página ${page}...`
  );
  console.log(`startDate: ${startDate}, endDate: ${endDate}`);

  // Loop para buscar todas as páginas
  do {
    const response = await fetch(
      `${baseUrl}/ticket/list?customer_id=${clienteId}&last_situation_ge=${startDate}&last_situation_le=${endDate}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await buscarToken()}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Erro na API: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Resposta: ${errorText}`);
      break;
    }

    const data = await response.json();

    if (data.error || !data.data) {
      console.error(`Erro retornado pela API:`, data.message || data);
      break;
    }

    chamados.push(...data.data);
    page = data.next_page;
  } while (page);

  return chamados;
};

export const buscarDetalhesChamadoPorId = async (chamadoId) => {
  const response = await fetch(
    `${baseUrl}/ticket/detail?ticket_id=${chamadoId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await buscarToken()}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      `Erro ao buscar detalhes do chamado ${chamadoId}: ${response.status} ${response.statusText}`
    );
    const errorText = await response.text();
    console.error(`Resposta: ${errorText}`);
    throw new Error(`Erro ao buscar detalhes: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
