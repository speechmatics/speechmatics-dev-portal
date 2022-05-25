export const capitalizeFirstLetter = (str: string) =>
  `${str.trim().charAt(0).toLocaleUpperCase()}${str.trim().slice(1)}`;

export const pad = (n) => n.toString().padStart(2, '0');
