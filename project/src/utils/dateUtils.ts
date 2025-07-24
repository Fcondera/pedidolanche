export const getDailyLimit = (): number => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Saturday = 6, limit is R$ 25.00
  // Other days = R$ 15.00
  return dayOfWeek === 6 ? 25.00 : 15.00;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};