"use client";
import Image from "next/image";
import "./styles.css";
import { Cliente, Fatura } from "@/app/types";

const BillingTemplate = ({
  fatura,
  startDate,
  endDate,
  cliente,
}: {
  fatura: Fatura[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  cliente: Cliente | null;
}) => {
  console.log("Fatura recebida no BillingTemplate:", fatura);
  console.log("Cliente:", cliente);

  const calculoValorTotal = () => {
    let total = 0;
    fatura.forEach((item: Fatura) => {
      const campoValorTotal = item.customFields.valorTotal;
      total += parseFloat(campoValorTotal.replace(",", "."));
    });
    return total;
  };

  return (
    <div className="billing-template">
      <div>
        <header className="page-header">
          <div className="w-64 h-20 relative">
            <br />
            <Image
              src="/assets/logo.png"
              alt="Logo do Cabeçalho"
              fill={true}
              style={{
                objectFit: "fill", // 'cover', 'contain', 'fill', etc.
              }}
              className="logo"
            />
          </div>
          <div className="header-empresa">
            <span className="titulo">KAST SOLUÇÕES</span>
            <div>29.401.446/0001-00</div>
            <div>
              ST SCN Quadra 4 Bloco B Sala 702, Parte 1668 - Brasília - DF - CEP
              70714-020
            </div>
            <div>
              Telefone: (61) 4102-9696 | Email: willian@kastsolucoes.com.br |
              kastsolucoes.com.br
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
