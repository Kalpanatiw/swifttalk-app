export const validatePaymentData = (data) => {
  const { amount, bookingId, userId } = data;

  if (!amount || amount <= 0) return { valid: false, error: 'Invalid amount' };
  if (!bookingId) return { valid: false, error: 'Booking ID is required' };
  if (!userId) return { valid: false, error: 'User ID is required' };

  return { valid: true };
};

export const calculateFinalAmount = (baseAmount, taxRate = 0.1) => {
  return Math.round((baseAmount * (1 + taxRate)) * 100) / 100;
};

export const formatPaymentStatus = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'succeeded': 'Completed',
    'failed': 'Failed',
    'refunded': 'Refunded'
  };
  return statusMap[status] || status;
};

export const isRefundEligible = (paymentStatus, createdDate) => {
  if (paymentStatus !== 'succeeded') return false;
  
  const createdTime = new Date(createdDate);
  const now = new Date();
  const daysDiff = (now - createdTime) / (1000 * 60 * 60 * 24);

  return daysDiff < 7;
};
