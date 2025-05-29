function hitungSelisihBulan(periode: string) {
  const cleaned = periode.replace(/\s+/g, "")
  const parts = cleaned.split("-")

  if (parts.length === 1) {
    return 1
  }

  const [start, end] = parts.map((str: any) => {
    const year = parseInt(str.slice(0, 4), 10)
    const month = parseInt(str.slice(4, 6), 10)
    return { year, month }
  })

  const totalStart = start.year * 12 + start.month
  const totalEnd = end.year * 12 + end.month

  return totalEnd - totalStart + 1
}

export default hitungSelisihBulan
