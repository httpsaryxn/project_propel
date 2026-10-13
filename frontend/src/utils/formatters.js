export const formatLPA = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00 LPA';
  return `₹${Number(amount).toFixed(2)} LPA`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
