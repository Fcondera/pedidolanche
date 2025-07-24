import React from "react";
import {
  MessageCircle,
  Trash2,
  Clock,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import jsPDF from "jspdf";
import { EmployeeOrderData } from "../types";
import { formatCurrency } from "../utils/whatsappUtils";

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
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);

  const formatCompleteOrderMessage = () => {
    const ordersList = orders
      .map((order, index) => {
        const itemsList = order.items
          .map(
            (item) =>
              `   • ${item.product.name} (${item.quantity}x) - ${formatCurrency(
                item.product.price * item.quantity
              )}`
          )
          .join("\n");

        return `*${index + 1}. ${
          order.employeeName
        }*\n${itemsList}\n   💰 Subtotal: ${formatCurrency(order.total)}`;
      })
      .join("\n\n");

    return `*🍽️ PEDIDO COMPLETO DE LANCHE - HENNINGS*\n\n*🏢 Setor:* ${sector}\n*📅 Data:* ${new Date().toLocaleDateString()}\n*⏰ Horário:* ${new Date().toLocaleTimeString()}\n*👥 Total de Funcionários:* ${
      orders.length
    }\n\n*📋 PEDIDOS:*\n${ordersList}\n\n*💰 VALOR TOTAL GERAL: ${formatCurrency(
      totalAmount
    )}*`;
  };

  const sendCompleteOrderWhatsApp = () => {
    const message = formatCompleteOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const generatePDFReport = () => {
    if (orders.length === 0) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let currentY = 20;

    // Função para adicionar quebra de página se necessário
    const checkPageBreak = (additionalHeight = 10) => {
      if (currentY + additionalHeight > pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
      }
    };

    // Cabeçalho
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("RELATÓRIO DE PEDIDOS DE LANCHE", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 10;

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("HENNINGS", pageWidth / 2, currentY, { align: "center" });
    currentY += 15;

    // Informações gerais
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Setor: ${sector}`, 20, currentY);
    currentY += 8;
    pdf.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 20, currentY);
    currentY += 8;
    pdf.text(
      `Horário: ${new Date().toLocaleTimeString("pt-BR")}`,
      20,
      currentY
    );
    currentY += 8;
    pdf.text(`Total de Funcionários: ${orders.length}`, 20, currentY);
    currentY += 15;

    // Linha separadora
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Pedidos individuais
    orders.forEach((order, index) => {
      checkPageBreak(30);

      // Nome do funcionário
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${index + 1}. ${order.employeeName}`, 20, currentY);
      currentY += 8;

      // Data e hora do pedido
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Data: ${new Date(order.timestamp).toLocaleDateString(
          "pt-BR"
        )} - ${new Date(order.timestamp).toLocaleTimeString("pt-BR")}`,
        25,
        currentY
      );
      currentY += 8;

      // Items do pedido
      pdf.setFontSize(11);
      order.items.forEach((item) => {
        checkPageBreak();
        const itemText = `• ${item.product.name} (${
          item.quantity
        }x) - ${formatCurrency(item.product.price * item.quantity)}`;
        pdf.text(itemText, 25, currentY);
        currentY += 6;
      });

      // Subtotal
      pdf.setFont("helvetica", "bold");
      pdf.text(`Subtotal: ${formatCurrency(order.total)}`, 25, currentY);
      currentY += 15;

      // Linha separadora entre pedidos
      if (index < orders.length - 1) {
        pdf.setDrawColor(230, 230, 230);
        pdf.line(20, currentY - 5, pageWidth - 20, currentY - 5);
      }
    });

    // Total geral
    checkPageBreak(20);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
    pdf.text(
      `TOTAL GERAL: ${formatCurrency(totalAmount)}`,
      pageWidth / 2,
      currentY,
      { align: "center" }
    );

    // Salvar o PDF
    const fileName = `relatorio-pedidos-${new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-")}.pdf`;
    pdf.save(fileName);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          📋 Resumo dos Pedidos
        </h2>
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm sm:text-base mb-2">
            Nenhum pedido realizado ainda
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            Os pedidos aparecerão aqui conforme forem feitos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
          📋 Resumo dos Pedidos ({orders.length})
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={generatePDFReport}
            className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
          >
            <FileText className="mr-1 sm:mr-2" size={14} />
            Relatório PDF
          </button>
          <button
            onClick={onClearAllOrders}
            className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium"
          >
            <Trash2 className="mr-1 sm:mr-2" size={14} />
            Limpar Tudo
          </button>
        </div>
      </div>

      {/* Informações Gerais do Pedido */}
      {sector && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Informações Gerais do Pedido
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="font-medium">Setor:</span>
              <span className="bg-blue-200 px-2 py-1 rounded font-semibold">
                {sector}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <span className="font-medium">Data:</span>
              <span>{new Date().toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-96 sm:max-h-[500px] overflow-y-auto">
        {orders.map((order, index) => {
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-gray-50"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {order.employeeName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{sector}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>{new Date(order.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold text-green-600 text-sm sm:text-base">
                    {formatCurrency(order.total)}
                  </span>
                  <button
                    onClick={() => onRemoveOrder(index)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover pedido"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-1.5 mb-3">
                {order.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex justify-between items-center py-1 px-2 rounded text-xs sm:text-sm border-l-4 ${
                      item.product.category === "drink"
                        ? "bg-red-50 border-l-red-400"
                        : "bg-green-50 border-l-green-400"
                    }`}
                  >
                    <span className="flex-1 min-w-0 mr-2 truncate">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span
                      className={`font-medium flex-shrink-0 ${
                        item.product.category === "drink"
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <p className="text-sm sm:text-base font-medium text-gray-700">
              Total de Pedidos:{" "}
              <span className="font-bold">{orders.length}</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Última atualização: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Valor Total Geral
            </p>
          </div>
        </div>

        {/* Finalizar Pedido Completo */}
        <button
          onClick={sendCompleteOrderWhatsApp}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium shadow-md"
        >
          <MessageCircle className="mr-2" size={18} />
          Finalizar Pedido via WhatsApp
        </button>
      </div>
    </div>
  );
};
