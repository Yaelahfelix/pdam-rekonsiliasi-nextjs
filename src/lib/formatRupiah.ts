//make functuon formatRUpiah intl
export function formatRupiah(value: number | string): string {
  const numberValue = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(numberValue)) {
    return ""
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numberValue)
}
