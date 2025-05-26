import axios from "axios"

//make a fetcher with axios for swr
export default async function fetcher(url: string) {
  const res = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (res.status !== 200) {
    throw new Error(`Error fetching data: ${res.statusText}`)
  }
  return res.data
}
