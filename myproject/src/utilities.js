export function formatMoney(number) {
  return Number(number) // TODO: or the local currency, get it from the user's browser? No, must ask api.
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function roundCeil(number) {
  return Math.ceil(number * 100) / 100;
}
