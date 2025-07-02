export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatTime = (time: string) => {
  return time;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

export const isToday = (date: string) => {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
};