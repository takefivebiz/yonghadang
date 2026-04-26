/**
 * PRD 9.6: 질문 번들 가격 계산
 * - 1개: 900원
 * - 2개: 1,600원 (200원 절약)
 * - 3개: 2,100원 (600원 절약)
 */

export const PRICE_PER_QUESTION = 900;

export const getPriceForQuantity = (quantity: number): number => {
  if (quantity <= 0) return 0;
  if (quantity === 1) return 900;
  if (quantity === 2) return 1600;
  if (quantity >= 3) return 2100;
  return PRICE_PER_QUESTION * quantity;
};

export const getSavingsAmount = (quantity: number): number => {
  if (quantity <= 1) return 0;
  const fullPrice = PRICE_PER_QUESTION * quantity;
  const bundlePrice = getPriceForQuantity(quantity);
  return fullPrice - bundlePrice;
};

export const isBestDeal = (quantity: number): boolean => {
  return quantity >= 3;
};
