"use server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export const POST = async (request: Request) => {
  const {
    tomTicketApiToken,
    clerkId,
    empresaNome,
    cnpj,
    endereco,
    cidade,
    estado,
    cep,
    telefone,
    email,
    site,
    imageLogoUrl,
  } = await request.json();
  const client = await clerkClient();

  // Buscar o usuário no Clerk
  if (!clerkId) {
    return NextResponse.error();
  }
  const clerkUser = await client.users.getUser(clerkId);

  // Salvar ele na metadata do usuário no Clerk
  await client.users.updateUser(clerkId, {
    publicMetadata: {
      ...clerkUser.publicMetadata,
      tomTicketApiToken: tomTicketApiToken,
      empresaNome,
      cnpj,
      endereco,
      cidade,
      estado,
      cep,
      telefone,
      email,
      site,
      imageLogoUrl,
    },
  });
  return NextResponse.json({ message: "Token API salvo com sucesso" });
};
