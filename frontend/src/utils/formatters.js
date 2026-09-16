// Shared formatting helpers used when adapting real backend responses
// (raw numbers/ISO dates) into the display strings the existing UI expects.

export function formatINR(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
}

export function formatDate(dateInput, options = {}) {
  if (!dateInput) return 'Date TBA';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return 'Date TBA';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatTime(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function firstOrFallback(arr, fallback) {
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : fallback;
}
