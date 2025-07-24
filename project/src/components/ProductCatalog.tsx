import React, { useState } from "react";
import { Plus, Minus, Coffee, Utensils, Info } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";

interface ProductCatalogProps {
  onAddProduct: (product: Product, notes?: string) => void;
  onRemoveProduct: (productId: string) => void;
  quantities: Record<string, number>;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onAddProduct,
  onRemoveProduct,
  quantities,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "food" | "drink"
  >("all");
  const [showNotes, setShowNotes] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const filteredProducts = PRODUCTS.filter(
    (product) =>
      product.available &&
      (selectedCategory === "all" || product.category === selectedCategory)
  );

  const handleAddWithNotes = (product: Product) => {
    const productNotes = notes[product.id] || "";
    onAddProduct(product, productNotes);
    if (productNotes) {
      setNotes((prev) => ({ ...prev, [product.id]: "" }));
      setShowNotes(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === "food" ? <Utensils size={16} /> : <Coffee size={16} />;
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Catálogo de Produtos
        </h2>

        {/* Category Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
          {[
            { key: "all", label: "Todos" },
            { key: "food", label: "Comidas" },
            { key: "drink", label: "Bebidas" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                setSelectedCategory(key as "all" | "food" | "drink")
              }
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === key
                  ? key === "drink"
                    ? "bg-red-600 text-white shadow-md"
                    : key === "food"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`border-2 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 ${
              product.category === "drink"
                ? "border-red-300 bg-red-50 hover:border-red-400"
                : "border-green-300 bg-green-50 hover:border-green-400"
            }`}
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {getCategoryIcon(product.category)}
                  <h3 className="font-semibold text-gray-800 ml-2 text-sm sm:text-base">
                    {product.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  {product.description}
                </p>
                <p
                  className={`text-lg sm:text-xl font-bold ${
                    product.category === "drink"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  R$ {product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => onRemoveProduct(product.id)}
                  disabled={!quantities[product.id]}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-red-600 flex items-center justify-center transition-all duration-200 active:scale-95 sm:hover:scale-105"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 sm:w-12 text-center font-bold text-base sm:text-lg">
                  {quantities[product.id] || 0}
                </span>
                <button
                  onClick={() => handleAddWithNotes(product)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 sm:hover:scale-105 ${
                    product.category === "drink"
                      ? "bg-red-100 hover:bg-red-200 text-red-600"
                      : "bg-green-100 hover:bg-green-200 text-green-600"
                  }`}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Notes Button */}
              <button
                onClick={() =>
                  setShowNotes(showNotes === product.id ? null : product.id)
                }
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                title="Adicionar observações"
              >
                <Info size={14} />
              </button>
            </div>

            {/* Notes Input */}
            {showNotes === product.id && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Observações:
                </label>
                <input
                  type="text"
                  value={notes[product.id] || ""}
                  onChange={(e) =>
                    setNotes((prev) => ({
                      ...prev,
                      [product.id]: e.target.value,
                    }))
                  }
                  placeholder="Ex: sem cebola, bem passado..."
                  className="w-full px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Current total for this product */}
            {quantities[product.id] > 0 && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-blue-800">
                  Subtotal: R${" "}
                  {(product.price * quantities[product.id]).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
