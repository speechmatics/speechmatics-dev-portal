import { pad } from './string-utils';

export function formatDate(date: Date) {
  if (!date || isNaN(date as any) || !(date instanceof Date)) return undefined;
  return (
    <>
      <span style={{ whiteSpace: 'nowrap' }}>
        {`${date.getUTCDate()} ${date.toLocaleString('en-US', { month: 'long' })}`}
      </span>{' '}
      {date.getUTCFullYear()}
    </>
  );
}

export function formatTimeDateFromString(str: string): string {
  const date = new Date(str);
  return `${date.getUTCDate()} ${date.toLocaleString('default', {
    month: 'short',
  })} ${date.getUTCFullYear()} ${date.getUTCHours()}:${pad(date.getUTCMinutes())}`;
}
