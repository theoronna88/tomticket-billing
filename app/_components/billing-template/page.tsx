"use client";
import Image from "next/image";
import "./styles.css";
import { Cliente, Fatura, UserPublicMetadata } from "@/app/types";

const BillingTemplate = ({
  fatura,
  startDate,
  endDate,
  cliente,
  metadata,
}: {
  fatura: Fatura[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  cliente: Cliente | null;
  metadata: UserPublicMetadata;
}) => {
  console.log("Fatura recebida no BillingTemplate:", fatura);
  console.log("Cliente:", cliente);

  const formatTelefone = (telefone: string | undefined) => {
    if (!telefone) return "(61) 3000-0000";

    const cleaned = telefone.replace(/\D/g, "");

    if (cleaned.length === 10) {
      // Telefone fixo: 6130000000 -> (61) 3000-0000
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
        6
      )}`;
    } else if (cleaned.length === 11) {
      // Telefone celular: 61999999999 -> (61) 99999-9999
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7
      )}`;
    }

    return telefone;
  };

  const calculoValorTotal = () => {
    let total = 0;
    fatura.forEach((item: Fatura) => {
      const campoValorTotal = item.customFields.valorTotal;
      total += parseFloat(campoValorTotal.replace(",", "."));
    });
    return total;
  };
  console.log("Metadata:", metadata.imageLogoUrl);

  return (
    <div className="billing-template">
      <div>
        <header className="page-header">
          <div className="w-64 h-20 relative">
            <br />
            <Image
              src={
                metadata &&
                metadata.imageLogoUrl &&
                metadata.imageLogoUrl !== ""
                  ? (metadata.imageLogoUrl as string)
                  : "/assets/logo.png"
              }
              alt="Logo do Cabeçalho"
              fill={true}
              style={{
                objectFit: "fill",
              }}
              className="logo"
            />
          </div>
          <div className="header-empresa">
            <span className="titulo">
              {(metadata?.empresaNome as string) || "NOME EMPRESA"}
            </span>
            <div>{(metadata?.cnpj as string) || "10.000.000/0001-00"}</div>
            <div>
              {`${metadata?.endereco as string} - ${
                metadata?.cidade as string
              } - ${metadata?.estado as string} - CEP ${
                metadata?.cep as string
              }` ||
                "Linha do Endereço com número - Cidade - Estado - CEP 70000-000"}
            </div>
            <div>
              Telefone: {formatTelefone(metadata?.telefone as string)} | Email:{" "}
              {(metadata?.email as string) || "email@empresa.com.br"} |
              {" " + ((metadata?.site as string) || "site.com.br")}
            </div>
          </div>
        </header>

        <div className="page-main">
          <span className="titulo">
            Fechamento
            <span> {cliente?.name}</span>
          </span>

          <p>
            Referência:
            <span>{startDate?.toLocaleDateString()}</span> à{" "}
            <span>{endDate?.toLocaleDateString()}</span>
          </p>

          <div className="valoresTotais">
            <span>Valor Total dos Serviços: R$ </span>
            <span>{calculoValorTotal().toFixed(2)}</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Descrição</th>
                <th>Tipo de Chamado</th>
                <th>Uso de Material</th>
                <th>Horas</th>
                <th>Valor Visita</th>
              </tr>
            </thead>

            <tbody>
              {fatura
                .filter((item: Fatura) => item?.category?.name !== "Fechamento")
                .map((item: Fatura, index: number) => (
                  <tr key={index}>
                    <td>
                      {new Date(item.customFields.data).toLocaleDateString()}
                    </td>
                    <td>{item.customFields.horaInicio}</td>
                    <td>{item.customFields.horaFinalizada}</td>
                    <td>{item.customFields.servicoExecutado}</td>
                    <td>{item.department.name}</td>
                    <td>{item.customFields.utilizouMaterial}</td>
                    <td>{item.customFields.horasTrabalhadas}</td>
                    <td>{item.customFields.valorTotal}</td>
                  </tr>
                ))}
              {fatura.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    Nenhuma visita registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Quebra de página opcional antes da seção de produtos */}
          <div className="page-break"></div>

          <div>
            <br />
            <br />
            <div>
              <hr />
            </div>
          </div>
        </div>
      </div>
      <footer className="page-footer">
        <div>
          <br />
        </div>
      </footer>
    </div>
  );
};

export default BillingTemplate;
