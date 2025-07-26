import { EmployeeOrderData } from "../types";
import { formatDate, getDailyLimit } from "./dateUtils";

export const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
};

export const generateWhatsAppMessage = (
  orders: EmployeeOrderData[],
  sector: string,
  totalChangeForCoca: number = 0,
  possibleCocas: number = 0
): string => {
  const today = new Date();
  const formattedDate = formatDate(today);
  const isSaturday = today.getDay() === 6;

  let message = `🍽️ *PEDIDO DE LANCHE*\n`;
  message += `📅 Data: ${formattedDate}\n`;
  message += `🏢 Setor: ${sector}\n`;
  message += `👥 Total de colaboradores: ${orders.length}\n`;

  // Informações especiais para sábado
  if (isSaturday && totalChangeForCoca > 0) {
    message += `\n🥤 *SISTEMA DE TROCO - SÁBADO:*\n`;
    message += `💰 Troco disponível: R$ ${totalChangeForCoca
      .toFixed(2)
      .replace(".", ",")}\n`;
    message += `🥤 Cocas possíveis: ${possibleCocas} unidades\n`;
  }

  message += `\n📋 *RESUMO DOS ITENS:*\n`;

  // Agregar todos os itens sem mostrar nomes ou preços
  const itemSummary: Record<string, number> = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const itemName = item.product.name;
      if (itemSummary[itemName]) {
        itemSummary[itemName] += item.quantity;
      } else {
        itemSummary[itemName] = item.quantity;
      }
    });
  });

  message += `📋 *ITENS SOLICITADOS:*\n`;
  message += `${"=".repeat(30)}\n\n`;

  Object.entries(itemSummary).forEach(([itemName, quantity]) => {
    message += `• ${itemName} x${quantity}\n`;
  });

  const totalItems = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  message += `\n${"=".repeat(30)}\n`;
  message += `📊 *RESUMO:*\n`;
  message += `• Total de itens: ${totalItems}\n`;
  message += `• Total de pessoas: ${orders.length}\n\n`;

  message += `⏰ Pedido gerado em: ${today.toLocaleString("pt-BR")}\n`;
  message += `🤖 Sistema de Pedidos de Lanche`;

  return message;
};

export const generateOrderReport = (
  orders: EmployeeOrderData[],
  sector: string
): string => {
  if (orders.length === 0) return "Nenhum pedido para gerar relatório.";

  const today = new Date();
  const formattedDate = formatDate(today);
  const dailyLimit = getDailyLimit();

  let report = `RELATÓRIO DE PEDIDOS DE LANCHE\n`;
  report += `${"=".repeat(50)}\n\n`;
  report += `Data: ${formattedDate}\n`;
  report += `Setor: ${sector}\n`;
  report += `Horário de geração: ${today.toLocaleString("pt-BR")}\n`;
  report += `Total de pedidos: ${orders.length}\n\n`;

  // Summary by product
  const productSummary: Record<string, { quantity: number; total: number }> =
    {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSummary[item.product.name]) {
        productSummary[item.product.name] = { quantity: 0, total: 0 };
      }
      productSummary[item.product.name].quantity += item.quantity;
      productSummary[item.product.name].total +=
        item.product.price * item.quantity;
    });
  });

  report += `RESUMO POR PRODUTO:\n`;
  report += `${"-".repeat(50)}\n`;
  Object.entries(productSummary).forEach(([product, data]) => {
    report += `${product}: ${data.quantity} unidades - R$ ${data.total.toFixed(
      2
    )}\n`;
  });

  report += `\nDETALHE DOS PEDIDOS:\n`;
  report += `${"-".repeat(50)}\n\n`;

  orders.forEach((order, index) => {
    report += `${index + 1}. ${order.employeeName}\n`;
    report += `   Horário: ${order.timestamp.toLocaleTimeString("pt-BR")}\n`;

    order.items.forEach((item) => {
      const itemTotal = (item.product.price * item.quantity).toFixed(2);
      report += `   • ${item.product.name} x${item.quantity} - R$ ${itemTotal}\n`;
      if (item.notes) {
        report += `     Obs: ${item.notes}\n`;
      }
    });

    if (order.notes) {
      report += `   Observações gerais: ${order.notes}\n`;
    }

    const withinLimit = order.total <= dailyLimit;
    report += `   Total: R$ ${order.total.toFixed(2)} ${
      withinLimit ? "(Dentro do limite)" : "(Acima do limite)"
    }\n\n`;
  });

  const totalGeneral = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItems = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  report += `TOTAIS GERAIS:\n`;
  report += `${"-".repeat(50)}\n`;
  report += `Total de itens: ${totalItems}\n`;
  report += `Valor total: R$ ${totalGeneral.toFixed(2)}\n`;
  report += `Limite diário configurado: R$ ${dailyLimit.toFixed(2)}\n`;
  report += `Média por colaborador: R$ ${(totalGeneral / orders.length).toFixed(
    2
  )}\n`;

  return report;
};
