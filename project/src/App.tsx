import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { EmployeeOrder } from "./components/EmployeeOrder";
import { OrderSummary } from "./components/OrderSummary";
import { Statistics } from "./components/Statistics";
import { EmployeeOrderData, DailyOrderData } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { formatDate } from "./utils/dateUtils";

function App() {
  const [dailyOrderData, setDailyOrderData] = useLocalStorage<DailyOrderData>(
    "lunch-orders",
    { sector: "", orders: [] }
  );
  const [showStats, setShowStats] = useState(false);

  // Clear orders from previous days
  useEffect(() => {
    const today = new Date().toDateString();
    const hasOrdersFromToday = dailyOrderData.orders.some(
      (order) => new Date(order.timestamp).toDateString() === today
    );

    if (dailyOrderData.orders.length > 0 && !hasOrdersFromToday) {
      setDailyOrderData({ sector: "", orders: [] });
    }
  }, [dailyOrderData.orders, setDailyOrderData]);

  const handleOrderComplete = (order: EmployeeOrderData) => {
    setDailyOrderData((prev) => ({
      ...prev,
      orders: [...prev.orders, order],
    }));
  };

  const handleSectorSet = (sector: string) => {
    setDailyOrderData((prev) => ({
      ...prev,
      sector,
    }));
  };

  const handleRemoveOrder = (index: number) => {
    setDailyOrderData((prev) => ({
      ...prev,
      orders: prev.orders.filter((_, i) => i !== index),
    }));
  };

  const handleClearAllOrders = () => {
    setDailyOrderData({ sector: "", orders: [] });
  };

  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <div className="text-center sm:text-left w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                    Hennings
                  </span>
                  <span className="mx-1 sm:mx-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    pedido de lanche
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mt-1 sm:mt-2">
                  Sistema de Pedidos • {formattedDate}
                </p>
              </div>
            </div>

            {dailyOrderData.orders.length > 0 && (
              <button
                onClick={() => setShowStats(!showStats)}
                className={`flex items-center px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center ${
                  showStats
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <BarChart3 className="mr-2" size={16} />
                {showStats ? "Ocultar Stats" : "Ver Stats"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Statistics Panel */}
        {showStats && dailyOrderData.orders.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <Statistics orders={dailyOrderData.orders} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - New Order */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-1">
            <EmployeeOrder
              onOrderComplete={handleOrderComplete}
              onSectorSet={handleSectorSet}
              existingOrders={dailyOrderData.orders}
              currentSector={dailyOrderData.sector}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-2 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <OrderSummary
                orders={dailyOrderData.orders}
                sector={dailyOrderData.sector}
                onRemoveOrder={handleRemoveOrder}
                onClearAllOrders={handleClearAllOrders}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2 text-sm sm:text-base">
              Sistema de Pedidos de Lanche
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Desenvolvido por CONDERTECH
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
