export function formatUsd(amount: number): string {
  return `USD ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** @deprecated use formatUsd */
export const formatGhs = formatUsd;

export function parseStakeAmount(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
