"use server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export const GET = async (request: Request) => {
  // Vai buscar o token API do TomTicket na metadata privada do usuário no Clerk
  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get("clerkId");
  const client = await clerkClient();

  //Buscar os metadados privados do usuário no Clerk
  if (!clerkId) {
    return NextResponse.error();
  }
  const clerkUser = await client.users.getUser(clerkId);
  const tomTicketApiToken = clerkUser.privateMetadata.tomTicketApiToken;
  return NextResponse.json({ tomTicketApiToken });
};
