export type SalesMode = "online" | "offline";

export type SalesChannelKey =
  | "shopee"
  | "tokopedia"
  | "tiktok-shop"
  | "lazada"
  | "gofood"
  | "grabfood"
  | "shopeefood"
  | "offline-store"
  | "offline-reseller"
  | "custom";

export type SalesChannelPreset = {
  key: SalesChannelKey;
  mode: SalesMode;
  label: string;
  adminFee: number;
  serviceFee: number;
  paymentFee: number;
  shippingProgramFee: number;
  campaignFee: number;
  affiliateFee: number;
  adsFee: number;
  taxFee: number;
  fixedFee: number;
};

export type CalculatorForm = {
  productName: string;
  mode: SalesMode;
  channel: SalesChannelKey;
  productCost: number;
  packingCost: number;
  operationalCost: number;
  targetProfit: number;
  fixedFee: number;
  sellerVoucher: number;
  desiredPrice: number;
  adminFee: number;
  serviceFee: number;
  paymentFee: number;
  shippingProgramFee: number;
  campaignFee: number;
  affiliateFee: number;
  adsFee: number;
  taxFee: number;
};

export type RecommendationResult = {
  minimum: number;
  safe: number;
  psychological: number;
};

export type CalculationResult = {
  totalBaseCost: number;
  totalFixedCost: number;
  totalPercentageFee: number;
  totalMarketplaceCut: number;
  payoutAfterFees: number;
  minimumPrice: number;
  recommendedPrice: number;
  psychologicalPrice: number;
  netProfitAtRecommended: number;
  marginAtRecommended: number;
  desiredPriceProfit: number;
  desiredPriceMargin: number;
  profitabilityStatus: "untung" | "rugi";
  simulationStatus: "aman" | "tipis" | "rugi";
};

export type CalculationHistoryItem = {
  id: string;
  createdAt: string;
  productName: string;
  mode: SalesMode;
  channel: SalesChannelKey;
  recommendedPrice: number;
  minimumPrice: number;
  desiredPrice: number;
  netProfit: number;
  margin: number;
  totalPercentageFee: number;
};
