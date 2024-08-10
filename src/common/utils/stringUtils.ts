export const toCamelCase = (value: string): string => (
  value
    .split('_')
    .map((el, i) => i > 0 ? el[0].toUpperCase() + el.substring(1) : el)
    .join('')
);

const getTwoDigitString = (num: number): string | number => num < 10 ? `0${num}` : num;

export const getTimeString = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = getTwoDigitString(date.getHours());
  const minutes = getTwoDigitString(date.getMinutes());
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
