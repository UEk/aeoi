export function normalizeTIN(tin: string): string {
  return tin.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
}

export function hashTIN(tin: string, salt: string = 'aeoi-mvp-salt'): string {
  const normalized = normalizeTIN(tin);
  return btoa(`${salt}:${normalized}`);
}

export function generateCorrelationId(): string {
  return crypto.randomUUID();
}

export function formatCurrency(amount: number | null, currency: string): string {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusBadgeColor(status: string): string {
  const statusColors: Record<string, string> = {
    RECEIVED: 'bg-blue-100 text-blue-800',
    VALIDATING: 'bg-yellow-100 text-yellow-800',
    TRANSFORMING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    OPEN: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-gray-100 text-gray-800',
    VALIDATED: 'bg-green-100 text-green-800',
    CONVERTED: 'bg-green-100 text-green-800',
    NOT_CONVERTED: 'bg-orange-100 text-orange-800',
    RATE_MISSING: 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export const CURRENCY_RATES: Record<number, number> = {
  2021: 11.22,
  2022: 11.00,
  2023: 10.55,
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  reportingPeriod: number
): { amountSEK: number | null; amountEUR: number | null; enrichStatus: string } {
  const rate = CURRENCY_RATES[reportingPeriod];

  if (!rate) {
    return { amountSEK: null, amountEUR: null, enrichStatus: 'RATE_MISSING' };
  }

  if (fromCurrency === 'EUR') {
    const amountSEK = Math.round(amount * rate * 100) / 100;
    return { amountSEK, amountEUR: amount, enrichStatus: 'CONVERTED' };
  } else if (fromCurrency === 'SEK') {
    const amountEUR = Math.round((amount / rate) * 100) / 100;
    return { amountSEK: amount, amountEUR, enrichStatus: 'CONVERTED' };
  } else {
    return { amountSEK: null, amountEUR: null, enrichStatus: 'NOT_CONVERTED' };
  }
}
