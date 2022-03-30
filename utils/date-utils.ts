export function formatDate(date: Date) {
  if (!date || isNaN(date as any) || !(date instanceof Date)) return undefined;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
