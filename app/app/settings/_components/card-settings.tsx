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
  empresaNome: z.string().optional(),
  cnpj: z
    .string()
    .regex(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      "CNPJ inválido. Use o formato: 22.111.111/0001-00"
    )
    .or(z.literal("")),
  endereco: z.string().optional(),
  cidade: z.string(),
  estado: z.string().max(2, "Use a sigla do estado (ex: SP)"),
  cep: z
    .string()
    .regex(/^\d{5}-\d{3}$/, "CEP inválido. Use o formato: 70714-020")
    .or(z.literal("")),
  telefone: z
    .string()
    .regex(
      /^\d{2}\d{8,9}$/,
      "Telefone inválido. Use DDD + número (ex: 6133333333 ou 61999999999)"
    )
    .or(z.literal("")),
  email: z.email(),
  site: z.string().optional(),
  imageLogoUrl: z.string().url().or(z.literal("")),
});

interface UserPublicMetadata {
  tomTicketApiToken?: string;
  empresaNome?: string;
  cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  site?: string;
  imageLogoUrl?: string;
}

const CardSettings = ({
  userId,
  user,
}: {
  userId: string;
  user: UserPublicMetadata;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...user,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    fetch("/api/custom-settings/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        clerkId: userId,
      }),
    })
      .then(() => {
        alert("Configurações salvas com sucesso!");
      })
      .catch((error) => {
        alert("Erro ao salvar as configurações. error: " + error.message);
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

        <div className="p-2 mt-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="tomTicketApiToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token API do TomTicket</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insira seu token API do TomTicket"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="empresaNome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da sua empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="29.401.446/0001-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" maxLength={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="70714-020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="6133333333 ou 61999999999"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="empresa@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.seusite.com.br"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Logo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.exemplo.com/logo.png"
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
