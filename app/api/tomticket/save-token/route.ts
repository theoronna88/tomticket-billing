"use server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export const POST = async (request: Request) => {
  // Vai receber o formulário com o token API do TomTicket
  const { tomTicketApiToken, clerkId } = await request.json();
  const client = await clerkClient();

  //Buscar os metadados privados do usuário no Clerk
  if (!clerkId) {
    return NextResponse.error();
  }
  const clerkUser = await client.users.getUser(clerkId);

  // Salvar ele na metadata do usuário no Clerk
  await client.users.updateUser(clerkId, {
    privateMetadata: {
      tomTicketApiToken: tomTicketApiToken,
      stripeCustomerId: clerkUser.privateMetadata.stripeCustomerId,
      stripeSubscriptionId: clerkUser.privateMetadata.stripeSubscriptionId,
    },
  });
  return NextResponse.json({ message: "Token API salvo com sucesso" });
};
