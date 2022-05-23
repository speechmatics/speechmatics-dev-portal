import { pad } from "./string-utils";

export function formatDate(date: Date) {
  if (!date || isNaN(date as any) || !(date instanceof Date)) return undefined;
  return <><span style={{ whiteSpace: 'nowrap' }}>{`${date.getUTCDate()} ${months[date.getUTCMonth()]}`}</span> {date.getUTCFullYear()}</>;
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


export function formatTimeDateFromString(str: string): string {
  const date = new Date(str);
  if (!date || isNaN(date as any) || !(date instanceof Date)) return undefined;
  return `${date.getUTCDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getUTCFullYear()} \
  ${date.getUTCHours()}:${pad(date.getUTCMinutes())}`
}