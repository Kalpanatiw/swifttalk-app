export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

export const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, '');
};

export const validateSeatFormat = (row, col) => {
  const rowValid = /^[A-Z]$/.test(row);
  const colValid = /^[0-9]+$/.test(col.toString()) && col > 0 && col < 100;
  return rowValid && colValid;
};

export const validatePaginationParams = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;

  if (pageNum < 1) return { page: 1, limit: limitNum };
  if (limitNum < 1 || limitNum > 100) return { page: pageNum, limit: Math.min(limitNum, 100) };

  return { page: pageNum, limit: limitNum };
};
