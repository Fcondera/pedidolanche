import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { EmployeeOrderData } from '../types';

interface StatisticsProps {
  orders: EmployeeOrderData[];
}

export const Statistics: React.FC<StatisticsProps> = ({ orders }) => {
  if (orders.length === 0) return null;

  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItems = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  const averageOrder = totalAmount / orders.length;

  // Most popular products
  const productCount: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productCount[item.product.name] = (productCount[item.product.name] || 0) + item.quantity;
    });
  });

  const topProducts = Object.entries(productCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const stats = [
    {
      icon: Users,
      label: 'Colaboradores',
      value: orders.length.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: BarChart3,
      label: 'Total de Itens',
      value: totalItems.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: DollarSign,
      label: 'Valor Total',
      value: `R$ ${totalAmount.toFixed(2)}`,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Média/Pessoa',
      value: `R$ ${averageOrder.toFixed(2)}`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <BarChart3 className="mr-2" size={24} />
        Estatísticas do Dia
      </h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-4 rounded-lg border border-gray-200">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-2`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Produtos Mais Pedidos</h4>
          <div className="space-y-2">
            {topProducts.map(([product, count], index) => (
              <div key={product} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mr-3 ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium">{product}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">{count} unidades</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};