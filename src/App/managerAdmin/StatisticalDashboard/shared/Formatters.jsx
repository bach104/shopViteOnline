export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

export const calculateGrowthRate = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};