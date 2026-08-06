export const formatKSh = (amount = 0) => {
  const numericAmount = Number(amount) || 0;

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(numericAmount);
};
