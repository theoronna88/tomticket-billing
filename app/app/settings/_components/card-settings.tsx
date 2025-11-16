"use client";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  tomTicketApiToken: z.string().min(1, "O token API é obrigatório"),
});

const CardSettings = ({ userId }: { userId: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tomTicketApiToken: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Formulário: ", data);
    fetch("/api/tomticket/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tomTicketApiToken: data.tomTicketApiToken,
        clerkId: userId,
      }),
    })
      .then(() => {
        alert("Token API salvo com sucesso!");
      })
      .catch((error) => {
        alert("Erro ao salvar o token API. error: " + error.message);
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Aqui você pode ajustar suas preferências e configurações da aplicação.
        </p>

        <div className="p-2 gap-4 mt-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tomTicketApiToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token API do TomTicket</FormLabel>
                    <FormControl>
                      <Input
                        className="w-1/2"
                        placeholder="Insira seu token API do TomTicket"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Salvar Configurações</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardSettings;
