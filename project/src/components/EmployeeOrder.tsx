import React, { useState } from "react";
import {
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { ProductCatalog } from "./ProductCatalog";
import { Product, OrderItem, EmployeeOrderData } from "../types";
import { PRODUCTS } from "../data/products";
import { getDailyLimit } from "../utils/dateUtils";

interface EmployeeOrderProps {
  onOrderComplete: (order: EmployeeOrderData) => void;
  onSectorSet: (sector: string) => void;
  existingOrders: EmployeeOrderData[];
  currentSector: string;
}

export const EmployeeOrder: React.FC<EmployeeOrderProps> = ({
  onOrderComplete,
  onSectorSet,
  existingOrders,
  currentSector,
}) => {
  const [employeeName, setEmployeeName] = useState("");
  const [sector, setSector] = useState(currentSector);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [orderNotes, setOrderNotes] = useState("");
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});

  // Sincronizar setor com estado global
  React.useEffect(() => {
    setSector(currentSector);
  }, [currentSector]);

  // Atualizar setor global quando mudado localmente
  React.useEffect(() => {
    if (sector.trim() && sector !== currentSector) {
      onSectorSet(sector.trim());
    }
  }, [sector, currentSector, onSectorSet]);

  const dailyLimit = getDailyLimit();
  const total = Object.entries(quantities).reduce(
    (sum, [productId, quantity]) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      return sum + (product ? product.price * quantity : 0);
    },
    0
  );

  const isOverLimit = total > dailyLimit;
  const hasItems = Object.values(quantities).some((q) => q > 0);
  const employeeExists = existingOrders.some(
    (order) =>
      order.employeeName.toLowerCase() === employeeName.toLowerCase().trim()
  );

  const handleAddProduct = (product: Product, notes?: string) => {
    setQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1,
    }));

    if (notes) {
      setItemNotes((prev) => ({
        ...prev,
        [product.id]: notes,
      }));
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      if (newQuantities[productId] <= 1) {
        delete newQuantities[productId];
        // Remove notes when quantity reaches 0
        setItemNotes((prevNotes) => {
          const newNotes = { ...prevNotes };
          delete newNotes[productId];
          return newNotes;
        });
      } else {
        newQuantities[productId] = newQuantities[productId] - 1;
      }
      return newQuantities;
    });
  };

  const handleSubmitOrder = () => {
    if (
      !employeeName.trim() ||
      !sector.trim() ||
      !hasItems ||
      isOverLimit ||
      employeeExists
    )
      return;

    const items: OrderItem[] = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = PRODUCTS.find((p) => p.id === productId)!;
        return {
          product,
          quantity,
          notes: itemNotes[productId],
        };
      });

    const order: EmployeeOrderData = {
      id: Date.now().toString(),
      employeeName: employeeName.trim(),
      items,
      total,
      timestamp: new Date(),
      status: "pending",
      notes: orderNotes.trim() || undefined,
    };

    onOrderComplete(order);

    // Reset form (mas mantém o setor)
    setEmployeeName("");
    setQuantities({});
    setOrderNotes("");
    setItemNotes({});
  };

  const getOrderSummary = () => {
    return Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = PRODUCTS.find((p) => p.id === productId)!;
        return { product, quantity, notes: itemNotes[productId] };
      });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Employee Name Input */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center mb-4 sm:mb-6">
          <User className="mr-2 sm:mr-3 text-blue-600" size={20} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Novo Pedido
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label
              htmlFor="employeeName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nome do Colaborador *
            </label>
            <input
              type="text"
              id="employeeName"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base ${
                employeeExists ? "border-red-300 bg-red-50" : "border-gray-300"
              }`}
              placeholder="Digite o nome do colaborador"
            />
            {employeeExists && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertTriangle size={16} className="mr-1" />
                Este colaborador já possui um pedido
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="sector"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Setor do Pedido *
              <span className="text-xs text-blue-600 font-normal ml-1">
                (Aplicado a todos os pedidos)
              </span>
            </label>
            <input
              type="text"
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              placeholder="Digite o setor..."
              required
            />
            {sector && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✓ Setor definido para todos os novos pedidos
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="orderNotes"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Observações do Pedido
            </label>
            <textarea
              id="orderNotes"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows={2}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
              placeholder="Observações gerais do pedido (opcional)"
            />
          </div>
        </div>
      </div>

      {/* Product Catalog */}
      <ProductCatalog
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
        quantities={quantities}
      />

      {/* Order Preview */}
      {hasItems && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <Clock className="mr-2" size={18} />
            Resumo do Pedido
          </h3>

          {/* Daily limit info */}
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-xs sm:text-sm font-medium text-blue-800">
              💰 Limite diário: R$ {dailyLimit.toFixed(2)}
              {new Date().getDay() === 6 ? " (Sábado)" : " (Segunda à Sexta)"}
            </p>
          </div>

          {/* Items list */}
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            {getOrderSummary().map(({ product, quantity, notes }) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm sm:text-base">
                      {product.name}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      x{quantity}
                    </span>
                  </div>
                  {notes && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                      <MessageSquare size={12} className="mr-1" />
                      {notes}
                    </p>
                  )}
                </div>
                <span className="font-bold text-blue-600 text-sm sm:text-base sm:self-start">
                  R$ {(product.price * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-100 rounded-lg">
            <span className="text-lg sm:text-xl font-bold">Total:</span>
            <span
              className={`text-xl sm:text-2xl font-bold ${
                isOverLimit ? "text-red-600" : "text-green-600"
              }`}
            >
              R$ {total.toFixed(2)}
            </span>
          </div>

          {/* Limit warning */}
          {isOverLimit && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertTriangle
                className="text-red-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div>
                <p className="font-semibold text-red-800 text-sm sm:text-base">
                  Limite excedido!
                </p>
                <p className="text-red-700 text-xs sm:text-sm mt-1">
                  O pedido excedeu o limite diário de R$ {dailyLimit.toFixed(2)}
                  . Remova alguns itens para continuar.
                </p>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmitOrder}
            disabled={
              !employeeName.trim() ||
              !sector.trim() ||
              !hasItems ||
              isOverLimit ||
              employeeExists
            }
            className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center ${
              !employeeName.trim() ||
              !sector.trim() ||
              !hasItems ||
              isOverLimit ||
              employeeExists
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105"
            }`}
          >
            <CheckCircle className="mr-2" size={20} />
            Confirmar Pedido
          </button>
        </div>
      )}
    </div>
  );
};
