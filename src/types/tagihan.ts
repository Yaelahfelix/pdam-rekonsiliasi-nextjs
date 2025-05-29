export interface Tagihan {
  nosamb: string
  nama: string
  alamat: string
  status: string
  detail_tagihan: Detailtagihan[]
}

export interface Detailtagihan {
  periode: string
  periode_number: number
  kodegol: string
  stanlalu: number
  stanskrg: number
  stanangkat: number
  pakai: number
  biayapemakaian: number
  denda: number
  administrasi: number
  retribusi: number
  pemeliharaan: number
  pelayanan: number
  angsuran: number
  materai: number
  ppn: number
  total: number
}
