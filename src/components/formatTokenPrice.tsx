export const formatTokenPrice = (price: number): string => {
  if (price === 0) return '0';

  const absPrice = Math.abs(price);
  if (absPrice >= 1) {
    return price.toFixed(2);
  } else {
    const e = parseInt(absPrice.toExponential().split('e-')[1]);
    const significantDigits = 4; // You can adjust this value
    return price.toFixed(e + significantDigits - 1);
  }
};
