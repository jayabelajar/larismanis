import { CalculatorForm, CalculationResult, RecommendationResult } from "@/lib/types";

function roundUpToHundreds(value: number) {
  return Math.ceil(value / 100) * 100;
}

function buildPsychologicalPrice(minimum: number, safe: number) {
  const candidate = Math.floor(safe / 1000) * 1000 - 100;
  if (candidate >= minimum) {
    return candidate;
  }

  return roundUpToHundreds(minimum);
}

function getSimulationStatus(margin: number) {
  if (margin <= 0) {
    return "rugi" as const;
  }

  if (margin < 10) {
    return "tipis" as const;
  }

  return "aman" as const;
}

export function getRecommendations(minimumPrice: number): RecommendationResult {
  const minimum = roundUpToHundreds(minimumPrice);
  const safe = roundUpToHundreds(minimum * 1.025);
  const psychological = buildPsychologicalPrice(minimum, safe);

  return { minimum, safe, psychological };
}

export function calculateSellingPrice(form: CalculatorForm): CalculationResult {
  const totalBaseCost = form.productCost + form.packingCost + form.operationalCost;
  const totalPercentageFee =
    form.adminFee +
    form.serviceFee +
    form.paymentFee +
    form.shippingProgramFee +
    form.campaignFee +
    form.affiliateFee +
    form.adsFee +
    form.taxFee;
  const percentageRate = totalPercentageFee / 100;
  const totalFixedCost = form.fixedFee + form.sellerVoucher;
  const minimumPrice =
    (totalBaseCost + form.targetProfit + totalFixedCost) /
    Math.max(1 - percentageRate, 0.01);
  const recommendations = getRecommendations(minimumPrice);
  const totalMarketplaceCut = recommendations.safe * percentageRate + totalFixedCost;
  const payoutAfterFees = recommendations.safe - totalMarketplaceCut;
  const netProfitAtRecommended = payoutAfterFees - totalBaseCost;
  const marginAtRecommended = (netProfitAtRecommended / recommendations.safe) * 100;
  const desiredPriceCut = form.desiredPrice * percentageRate + totalFixedCost;
  const desiredPriceProfit = form.desiredPrice - desiredPriceCut - totalBaseCost;
  const desiredPriceMargin =
    form.desiredPrice > 0 ? (desiredPriceProfit / form.desiredPrice) * 100 : 0;

  return {
    totalBaseCost,
    totalFixedCost,
    totalPercentageFee,
    totalMarketplaceCut,
    payoutAfterFees,
    minimumPrice: recommendations.minimum,
    recommendedPrice: recommendations.safe,
    psychologicalPrice: recommendations.psychological,
    netProfitAtRecommended,
    marginAtRecommended,
    desiredPriceProfit,
    desiredPriceMargin,
    profitabilityStatus: netProfitAtRecommended >= 0 ? "untung" : "rugi",
    simulationStatus: getSimulationStatus(desiredPriceMargin),
  };
}
