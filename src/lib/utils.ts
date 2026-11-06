export function formatNPR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-NP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

export function generateOrderNumber(): string {
  const prefix = 'BCH';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
}

export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= 5;
}

export function isOutOfStock(stock: number): boolean {
  return stock <= 0;
}

export function getEffectivePrice(price: number, discountPrice: number | null): number {
  return discountPrice ?? price;
}

export function getDiscountPercentage(price: number, discountPrice: number): number {
  if (discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}
