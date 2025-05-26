import { format, parse } from "date-fns"
import { id } from "date-fns/locale"

export function formatPeriode(periode: string): string {
  if (periode.includes(" - ")) {
    const [awal, akhir] = periode.split(" - ")

    const tAwal = parse(awal, "yyyyMM", new Date())
    const tAkhir = parse(akhir, "yyyyMM", new Date())

    const fAwal = format(tAwal, "MMMM yyyy", { locale: id })
    const fAkhir = format(tAkhir, "MMMM yyyy", { locale: id })

    return `${fAwal} - ${fAkhir}`
  }

  const date = parse(periode, "yyyyMM", new Date())
  return format(date, "MMMM yyyy", { locale: id })
}
