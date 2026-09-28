/** Format currency/cost values for display with exactly 2 decimal places. */
export const formatCost = (
  value: number | string | null | undefined,
): string => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0.00";
  return num.toFixed(2);
};
