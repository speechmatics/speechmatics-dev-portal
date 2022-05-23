export const capitalizeFirstLetter = (str: string) =>
  `${str.charAt(0).toLocaleUpperCase()}${str.slice(1)}`;

export const pad = (n) => n.toString().padStart(2, '0');
