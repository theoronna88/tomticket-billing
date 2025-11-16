"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import CardSettings from "./_components/card-settings";

const Settings = async () => {
  const { userId } = await auth();
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId!);

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  console.log("User in settings page:", user);
  return (
    <>
      <CardSettings userId={userId} />
    </>
  );
};

export default Settings;
