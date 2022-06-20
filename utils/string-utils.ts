export const capitalizeFirstLetter = (str: string) =>
  `${str.trim().charAt(0).toLocaleUpperCase()}${str.trim().slice(1)}`;

export const pad = (n: number | string) => n.toString().padStart(2, '0');

export function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
}

export function pluralize(
  value: number,
  singleForm: string,
  pluralForm: string,
  returnIfZero = false
) {
  if (value == 1) return `${value} ${singleForm}`;
  if (value > 1) return `${value} ${pluralForm}`;
  if (value == 0) return returnIfZero;
}

export function lowerCaseNoSpace(
  value: string
) {
  return value.toLocaleLowerCase().replaceAll(' ','-')
}
