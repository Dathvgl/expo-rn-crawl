export const numberFormat = (num: number) => {
  const format = Intl.NumberFormat("en", { notation: "compact" });
  return format.format(num);
};
