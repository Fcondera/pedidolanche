import React from "react";
import {
  MessageCircle,
  Download,
  Trash2,
  Clock,
  User,
  MapPin,
} from "lucide-react";
import { EmployeeOrderData } from "../types";
import { formatCurrency, generateOrderReport } from "../utils/whatsappUtils";

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

  const formatWhatsAppMessage = (order: EmployeeOrderData) => {
    const itemsList = order.items
      .map(
        (item) =>
          `• ${item.product.name} (${item.quantity}x) - ${formatCurrency(
            item.product.price * item.quantity
          )}`
      )
      .join("\n");

    return `*🍽️ PEDIDO DE LANCHE*\n\n*👤 Funcionário:* ${
      order.employeeName
    }\n*🏢 Setor:* ${sector}\n*📅 Data:* ${new Date(
      order.timestamp
    ).toLocaleDateString()}\n*⏰ Horário:* ${new Date(
      order.timestamp
    ).toLocaleTimeString()}\n\n*📋 ITENS:*\n${itemsList}\n\n*💰 TOTAL: ${formatCurrency(
      order.total
    )}*`;
  };

  const sendWhatsAppMessage = (order: EmployeeOrderData) => {
    const message = formatWhatsAppMessage(order);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const generateReport = () => {
    if (orders.length === 0) return;

    const reportContent = generateOrderReport(orders, sector);
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-pedidos-${new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            onClick={generateReport}
            className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
          >
            <Download className="mr-1 sm:mr-2" size={14} />
            Relatório
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

              {/* WhatsApp Button */}
              <button
                onClick={() => sendWhatsAppMessage(order)}
                className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
              >
                <MessageCircle className="mr-2" size={14} />
                Enviar via WhatsApp
              </button>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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
      </div>
    </div>
  );
};
