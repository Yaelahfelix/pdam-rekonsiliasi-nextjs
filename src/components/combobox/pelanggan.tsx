"use client"

import * as React from "react"
import axios from "axios"
import { useDebounce } from "use-debounce"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import type { Pelanggan } from "@/types/pelanggan"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const fetchData = async (query = "") => {
  try {
    const res = await axios.get(
      "/api/client/kediri/combobox/pelanggan?q=" + query
    )

    return res.data
  } catch (err) {
    console.log("Error combobox pelanggan: ", err)
  }
}

export function ComboboxPelanggan({
  onSelect,
}: {
  onSelect: (nosamb: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [data, setData] = React.useState<Pelanggan[]>([])
  const [loading, setLoading] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const [debouncedQuery] = useDebounce(query, 300)

  React.useEffect(() => {
    const loadFrameworks = async () => {
      setLoading(true)
      try {
        const data = await fetchData(debouncedQuery)
        console.log(data)
        setData(data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    loadFrameworks()
  }, [debouncedQuery])

  React.useEffect(() => {
    const initialLoad = async () => {
      setLoading(true)
      try {
        const data = await fetchData("")
        setData(data)
      } catch (error) {
        console.error("Error fetching initial data:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    initialLoad()
  }, [])

  const handleInputChange = (searchValue: string) => {
    setQuery(searchValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data?.find((data) => data.nosamb === value)?.nama
            : "Pilih pelanggan..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari pelanggan..."
            value={query}
            onValueChange={handleInputChange}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            ) : (
              <>
                <CommandEmpty>Tidak ada data.</CommandEmpty>
                <CommandGroup>
                  {data?.map((data) => (
                    <CommandItem
                      key={data.nosamb}
                      value={data.nosamb}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        onSelect(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === data.nosamb ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {data.nosamb} - {data.nama}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
