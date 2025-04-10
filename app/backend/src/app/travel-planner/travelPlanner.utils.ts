// Helper function to estimate activity hours based on the content
export function estimateActivityHours(
  item: string,
  providedHours?: number
): number {
  if (providedHours !== undefined) {
    return providedHours
  }

  const itemLower = item.toLowerCase()

  if (
    itemLower.includes("museum") ||
    itemLower.includes("gallery") ||
    itemLower.includes("exhibition")
  ) {
    return 2
  } else if (
    itemLower.includes("breakfast") ||
    itemLower.includes("lunch") ||
    itemLower.includes("dinner") ||
    itemLower.includes("brunch") ||
    itemLower.includes("coffee")
  ) {
    return 1.5
  } else if (
    itemLower.includes("tour") &&
    (itemLower.includes("half-day") || itemLower.includes("half day"))
  ) {
    return 4
  } else if (
    itemLower.includes("tour") &&
    (itemLower.includes("full-day") || itemLower.includes("full day"))
  ) {
    return 8
  } else if (
    itemLower.includes("hike") ||
    itemLower.includes("trek") ||
    itemLower.includes("trail")
  ) {
    return 3
  } else if (itemLower.includes("shopping") || itemLower.includes("market")) {
    return 2
  } else if (
    itemLower.includes("show") ||
    itemLower.includes("concert") ||
    itemLower.includes("performance") ||
    itemLower.includes("theater")
  ) {
    return 2.5
  } else if (
    itemLower.includes("spa") ||
    itemLower.includes("massage") ||
    itemLower.includes("wellness")
  ) {
    return 2
  } else if (itemLower.includes("beach") || itemLower.includes("pool")) {
    return 3
  } else if (
    itemLower.includes("check") ||
    itemLower.includes("flight") ||
    itemLower.includes("airport") ||
    itemLower.includes("transfer")
  ) {
    return 2
  } else {
    // Default duration for unclassified activities
    return 1.5
  }
}
