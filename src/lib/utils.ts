export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatMonth(monthString: string): string {
  // Expects yyyy-MM format
  const [year, month] = monthString.split('-');
  const date = new Date(`${year}-${month}-01`);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(date);
}

export function getCurrentMonth(): string {
  const now = new Date();
  return now.toISOString().slice(0, 7); // yyyy-MM format
}

export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]; // yyyy-MM-dd format
}

export function calculateTotalHours(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 0;
  const checkInTime = new Date(`2024-01-01T${checkIn}`);
  const checkOutTime = new Date(`2024-01-01T${checkOut}`);
  return (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
}

export function calculateOvertimeHours(totalHours: number, standardHours: number = 8): number {
  return Math.max(0, totalHours - standardHours);
}
