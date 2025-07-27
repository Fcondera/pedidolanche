import React, { useState } from "react";
import { EmployeeOrderData } from "../types";
import { Trash2, MessageCircle, Download, Mail, X } from "lucide-react";
import { generateWhatsAppMessage } from "../utils/whatsappUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "../utils/dateUtils";
import { sendEmail } from "../utils/emailConfig";

// Extend jsPDF with autoTable - corrigido
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface OrderSummaryProps {
  orders: EmployeeOrderData[];
  sector: string;
  onRemoveOrder: (index: number) => void;
  onClearAllOrders: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  orders,
  sector,
  onRemoveOrder,
  onClearAllOrders,
}) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("alexfj@hennings.com.br");
  const [isLoading, setIsLoading] = useState(false);

  // Configurações do sistema de troco
  const WEEKDAY_LIMIT = 15.0; // R$ 15 por colaborador nos dias de semana
  const SATURDAY_LIMIT = 25.0; // R$ 25 por colaborador no sábado
  const COCA_PRICE = 13.0; // Preço de uma coca

  // Função para verificar se é sábado
  const isSaturday = () => {
    const today = new Date();
    return today.getDay() === 6; // 6 = sábado
  };

  // Função para obter o limite do dia
  const getDailyLimit = () => {
    return isSaturday() ? SATURDAY_LIMIT : WEEKDAY_LIMIT;
  };

  // Função para calcular troco e status da coca
  const calculateEmployeeData = (order: EmployeeOrderData) => {
    const dailyLimit = getDailyLimit();

    const orderTotal = order.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const change = dailyLimit - orderTotal;
    const canBuyCoca = change >= COCA_PRICE;

    return {
      ...order,
      dailyLimit: dailyLimit,
      change: Math.max(0, change), // Não pode ser negativo
      canBuyCoca: canBuyCoca && change > 0,
    };
  };

  // Recalcular dados dos pedidos com troco
  const ordersWithChange = orders.map(calculateEmployeeData);

  // Calcular troco total de todos os pedidos
  const totalChange = ordersWithChange.reduce((sum, order) => {
    return sum + order.change;
  }, 0);

  // Quantas cocas podem ser compradas com o troco total
  const possibleCocas = Math.floor(totalChange / COCA_PRICE);

  // Quanto sobra após comprar as cocas
  const remainingChange = totalChange - possibleCocas * COCA_PRICE;

  const total = ordersWithChange.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (orderSum, item) => orderSum + item.product.price * item.quantity,
        0
      ),
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header simples
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("RELATÓRIO DE PEDIDOS - HENNINGS", pageWidth / 2, 20, {
      align: "center",
    });

    // Informações básicas
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${formatDate(new Date())}`, 20, 35);
    doc.text(`Setor: ${sector || "Não informado"}`, 20, 42);
    doc.text(`Total Geral: R$ ${total.toFixed(2)}`, 20, 49);

    // Tabela simples - uma linha por item
    const simpleTableData: string[][] = [];

    ordersWithChange.forEach((order) => {
      order.items.forEach((item) => {
        simpleTableData.push([
          order.employeeName,
          item.product.name,
          `R$ ${item.product.price.toFixed(2)}`,
          item.quantity.toString(),
          `R$ ${(item.product.price * item.quantity).toFixed(2)}`,
        ]);
      });
    });

    autoTable(doc, {
      head: [["Funcionário", "Produto", "Preço Unit.", "Qtd", "Total"]],
      body: simpleTableData,
      startY: 60,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [70, 130, 180],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Funcionário
        1: { cellWidth: 70 }, // Produto
        2: { cellWidth: 25, halign: "right" }, // Preço Unit.
        3: { cellWidth: 15, halign: "center" }, // Qtd
        4: { cellWidth: 25, halign: "right" }, // Total
      },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    // Resumo de Produtos Principais e Coca
    let currentY =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 20;

    // Calcular resumo dos produtos
    const productSummary: Record<string, number> = {};
    ordersWithChange.forEach((order) => {
      order.items.forEach((item) => {
        productSummary[item.product.name] =
          (productSummary[item.product.name] || 0) + item.quantity;
      });
    });

    // Título do resumo
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMO DE PRODUTOS", 20, currentY);
    currentY += 15;

    // SEÇÃO 1: Informações da Coca (se houver troco)
    if (totalChange > 0) {
      const cocaData = [
        ["Coca-Cola disponível", `${possibleCocas} unidades`],
        ["Troco total acumulado", `R$ ${totalChange.toFixed(2)}`],
        ["Restante após coca", `R$ ${remainingChange.toFixed(2)}`],
      ];

      autoTable(doc, {
        head: [["SISTEMA DE COCA-COLA", "VALORES"]],
        body: cocaData,
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [255, 87, 34],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 11,
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: "bold" },
          1: { cellWidth: 50, halign: "right", fontStyle: "bold" },
        },
        alternateRowStyles: { fillColor: [255, 245, 238] },
      });

      currentY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 15;
    }

    // SEÇÃO 2: Produtos Principais
    const produtosPrincipais = [
      "Pastel de frango",
      "Pastel de carne",
      "Pastel de pizza",
      "Pão de queijo",
      "Misto quente",
      "Misto quente com ovo",
      "Sanduíche natural",
      "Coxinha",
      "Nega maluca",
    ];

    const produtosPrincipaisData: string[][] = [];
    produtosPrincipais.forEach((produto) => {
      const quantidade = productSummary[produto];
      if (quantidade > 0) {
        produtosPrincipaisData.push([produto, `${quantidade} unidades`]);
      }
    });

    if (produtosPrincipaisData.length > 0) {
      autoTable(doc, {
        head: [["PRODUTOS PRINCIPAIS", "QUANTIDADE"]],
        body: produtosPrincipaisData,
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [76, 175, 80],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 11,
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: "bold" },
          1: { cellWidth: 50, halign: "right", fontStyle: "bold" },
        },
        alternateRowStyles: { fillColor: [245, 255, 245] },
      });

      currentY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 15;
    }

    // SEÇÃO 3: Outros Produtos (se houver)
    const outrosProdutos = Object.entries(productSummary)
      .filter(([nome]) => !produtosPrincipais.includes(nome))
      .filter(([, qtd]) => qtd > 0)
      .sort(([, a], [, b]) => b - a); // Ordenar por quantidade (maior primeiro)

    if (outrosProdutos.length > 0) {
      const outrosProdutosData = outrosProdutos.map(([nome, qtd]) => [
        nome,
        `${qtd} unidades`,
      ]);

      autoTable(doc, {
        head: [["OUTROS PRODUTOS", "QUANTIDADE"]],
        body: outrosProdutosData,
        startY: currentY,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [158, 158, 158],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 11,
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: "bold" },
          1: { cellWidth: 50, halign: "right", fontStyle: "bold" },
        },
        alternateRowStyles: { fillColor: [248, 248, 248] },
      });

      currentY =
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 15;
    }

    // Total final
    const finalY = currentY;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL GERAL: R$ ${total.toFixed(2)}`, pageWidth / 2, finalY, {
      align: "center",
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Relatório gerado em ${new Date().toLocaleString("pt-BR")}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );

    return doc;
  };

  const generatePDFAsBase64 = () => {
    const doc = generatePDF();
    return doc.output("datauristring").split(",")[1]; // Remove data:application/pdf;filename=generated.pdf;base64,
  };

  // Função para detectar se é iOS
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  };

  // Função para detectar Safari
  const isSafari = () => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  };

  const downloadPDF = () => {
    try {
      const doc = generatePDF();

      const fileName = `pedidos_hennings_${formatDate(new Date()).replace(
        /\//g,
        "-"
      )}.pdf`;
      console.log("💾 Salvando arquivo:", fileName);

      // Para iOS, usar uma abordagem específica
      if (isIOS()) {
        const pdfOutput = doc.output("blob");
        const blobUrl = URL.createObjectURL(pdfOutput);

        if (isSafari()) {
          // No Safari iOS, abrir em nova aba é mais confiável
          const newWindow = window.open("", "_blank");
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head>
                  <title>${fileName}</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      margin: 0; 
                      padding: 20px; 
                      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                      text-align: center;
                      background: #f5f5f5;
                    }
                    .container {
                      max-width: 400px;
                      margin: 0 auto;
                      background: white;
                      padding: 30px;
                      border-radius: 12px;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }
                    .icon { font-size: 48px; margin-bottom: 20px; }
                    h1 { color: #333; margin-bottom: 20px; font-size: 24px; }
                    p { color: #666; line-height: 1.5; margin-bottom: 15px; }
                    .steps { text-align: left; margin: 20px 0; }
                    .step { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 6px; }
                    .download-btn {
                      display: inline-block;
                      background: #007AFF;
                      color: white;
                      padding: 12px 24px;
                      text-decoration: none;
                      border-radius: 8px;
                      margin: 20px 0;
                      font-weight: 600;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="icon">📄</div>
                    <h1>PDF Pronto!</h1>
                    <p>Seu relatório foi gerado com sucesso.</p>
                    
                    <a href="${blobUrl}" download="${fileName}" class="download-btn">
                      📥 Baixar PDF
                    </a>
                    
                    <div class="steps">
                      <div class="step">
                        <strong>1.</strong> Toque no botão "Baixar PDF" acima
                      </div>
                      <div class="step">
                        <strong>2.</strong> Toque no ícone de compartilhar <span style="font-size: 18px;">⎋</span>
                      </div>
                      <div class="step">
                        <strong>3.</strong> Selecione "Salvar em Arquivos" ou "Adicionar ao Drive"
                      </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #888;">
                      O arquivo será salvo como: ${fileName}
                    </p>
                  </div>
                </body>
              </html>
            `);
            newWindow.document.close();
          } else {
            // Fallback se não conseguir abrir nova janela
            alert(
              "Para baixar o PDF:\n1. Toque no link que aparecerá\n2. Use o botão compartilhar para salvar"
            );
            window.location.href = blobUrl;
          }
        } else {
          // Para outros navegadores no iOS
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = fileName;
          link.style.display = "none";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            alert(
              'Para salvar no iPhone:\n1. Toque no ícone de compartilhar\n2. Selecione "Salvar em Arquivos"'
            );
          }, 500);
        }

        // Limpar o blob URL após um tempo
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 30000);
      } else {
        // Para outros dispositivos, usar o método padrão
        doc.save(fileName);
      }
    } catch (error) {
      alert("Erro ao gerar PDF: " + (error as Error).message);
    }
  };
  const sendEmailWithPDF = async () => {
    if (!email.trim()) {
      alert("Por favor, insira um email válido.");
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert(
        "Por favor, insira um email com formato válido (exemplo@dominio.com)."
      );
      return;
    }

    setIsLoading(true);
    try {
      console.log("📧 Preparando envio de email para:", email);
      console.log("� Dados dos pedidos para email:", orders.length, "pedidos");
      console.log("💰 Total para email:", total);

      console.log("�📄 Gerando PDF para email...");
      const pdfBase64 = generatePDFAsBase64();
      console.log("✅ PDF gerado! Tamanho base64:", pdfBase64?.length || 0);

      const fileName = `pedidos_hennings_${formatDate(new Date()).replace(
        /\//g,
        "-"
      )}.pdf`;

      const templateParams = {
        to_email: email.trim(),
        subject: "Relatório de Pedidos - Hennings",
        sector: sector,
        totalValue: `R$ ${total.toFixed(2)}`,
        orderCount: ordersWithChange.length,
        message: `Relatório de pedidos gerado em ${formatDate(
          new Date()
        )}.\n\nTotal geral: R$ ${total.toFixed(
          2
        )}\n\nTotal de itens: ${ordersWithChange.reduce(
          (sum, order) =>
            sum +
            order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
          0
        )}\n\nTotal de colaboradores: ${
          ordersWithChange.length
        }\n\nRelatório em anexo.`,
        attachment: pdfBase64,
        filename: fileName,
      };

      const response = await sendEmail(templateParams);

      // Check if response indicates fallback mode (without attachment)
      if (response && "fallback" in response && response.fallback) {
        alert(
          '✅ Email enviado com sucesso!\n\n⚠️ O PDF não pôde ser anexado devido ao tamanho, mas você pode baixá-lo pelo botão "PDF".'
        );
      } else {
        alert("✅ Email enviado com sucesso!");
      }

      setShowEmailModal(false);
    } catch (error) {
      let errorMessage = "Erro ao enviar email. ";

      if (error && typeof error === "object") {
        const errorObj = error as {
          status?: number;
          text?: string;
          message?: string;
        };

        if (errorObj.status === 400) {
          errorMessage += "Verifique se o email está correto.";
        } else if (errorObj.status === 403) {
          errorMessage += "Erro de autenticação no serviço de email.";
        } else if (errorObj.status === 413) {
          errorMessage += "Email muito grande para ser enviado.";
        } else if (errorObj.message && errorObj.message.includes("inválido")) {
          errorMessage += "Formato de email inválido.";
        } else {
          errorMessage += "Tente novamente em alguns minutos.";
        }
      } else {
        errorMessage += "Verifique sua conexão e tente novamente.";
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const sendWhatsAppMessage = () => {
    const message = generateWhatsAppMessage(
      ordersWithChange,
      sector,
      totalChange,
      possibleCocas
    );
    const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Nenhum pedido foi feito ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Resumo dos Pedidos
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors relative group"
            title={
              isIOS()
                ? "No iPhone: após abrir, toque em compartilhar → Salvar em Arquivos"
                : "Baixar PDF"
            }
          >
            <Download size={18} />
            PDF
            {isIOS() && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                No iPhone: toque para abrir → Compartilhar → Salvar
              </div>
            )}
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Mail size={18} />
            Email
          </button>
          <button
            onClick={onClearAllOrders}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} />
            Limpar
          </button>
        </div>
      </div>

      {/* Estatísticas do sistema de troco - todos os dias */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-6">
        <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3">
          🥤 Sistema de Troco - {isSaturday() ? "Sábado" : "Dia de Semana"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <span className="font-medium text-gray-700 block mb-1">
              Limite por pessoa:
            </span>
            <div className="text-lg sm:text-xl font-bold text-green-600">
              R$ {getDailyLimit().toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="font-medium text-gray-700 block mb-1">
              Troco total:
            </span>
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              R$ {totalChange.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg sm:col-span-2 lg:col-span-1">
            <span className="font-medium text-gray-700 block mb-1">
              Cocas possíveis:
            </span>
            <div className="text-lg sm:text-xl font-bold text-orange-600">
              {possibleCocas} unidades
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Sobra: R$ {remainingChange.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {ordersWithChange.map((order, orderIndex) => (
          <div
            key={order.id}
            className="border-l-4 border-l-blue-500 pl-3 sm:pl-4"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  {order.employeeName}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status === "pending"
                      ? "Pendente"
                      : order.status === "confirmed"
                      ? "Confirmado"
                      : "Cancelado"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemoveOrder(orderIndex)}
                className="text-red-600 hover:text-red-800 transition-colors self-start sm:self-center"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {order.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 rounded-lg gap-2"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                      {item.product.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      R$ {item.product.price.toFixed(2)} × {item.quantity}
                    </p>
                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end">
                    <span className="text-sm sm:hidden text-gray-600">
                      Total:
                    </span>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600 text-sm sm:text-base">
                  Subtotal:
                </span>
                <span className="font-bold text-gray-800 text-sm sm:text-base">
                  R${" "}
                  {order.items
                    .reduce(
                      (sum, item) => sum + item.product.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <span className="text-lg sm:text-xl font-bold text-gray-800">
            Total Geral:
          </span>
          <span className="text-xl sm:text-2xl font-bold text-green-600">
            R$ {total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={sendWhatsAppMessage}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-colors text-base sm:text-lg font-semibold"
        >
          <MessageCircle size={20} className="sm:w-6 sm:h-6" />
          Finalizar Pedido no WhatsApp
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">
                Enviar Relatório por Email
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email de destino:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="exemplo@email.com"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={sendEmailWithPDF}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
