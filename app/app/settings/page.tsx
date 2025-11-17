"use server";
import { auth, clerkClient, User } from "@clerk/nextjs/server";
import CardSettings from "./_components/card-settings";
//TODO: refatorar buscando de actions.ts
const Settings = async () => {
  const { userId } = await auth();
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId!);

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  console.log("Clerk User na página de settings: ", user);
  const clerkUserHandler = async (user: User) => {
    // Verificar se os metadados públicos existem e retorná-los
    // Se não existirem, retornar valores padrão
    return {
      tomTicketApiToken: user.publicMetadata?.tomTicketApiToken || "",
      empresaNome: user.publicMetadata?.empresaNome || "",
      cnpj: user.publicMetadata?.cnpj || "",
      endereco: user.publicMetadata?.endereco || "",
      cidade: user.publicMetadata?.cidade || "",
      estado: user.publicMetadata?.estado || "",
      cep: user.publicMetadata?.cep || "",
      telefone: user.publicMetadata?.telefone || "",
      email: user.publicMetadata?.email || "",
      site: user.publicMetadata?.site || "",
      imageLogoUrl: user.publicMetadata?.imageLogoUrl || "",
    };
  };

  return (
    <>
      <CardSettings
        userId={userId}
        user={(await clerkUserHandler(user)) as UserPublicMetadata}
      />
    </>
  );
};

export default Settings;
