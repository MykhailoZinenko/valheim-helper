import { ChevronsUpDown } from "lucide-react"
import React, { Dispatch, SetStateAction } from "react"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { IItem } from "@/types"

interface ItemsComboboxProps<T extends IItem> {
  data: T[]
  setItems: Dispatch<SetStateAction<{ name: string; quantity: number }[]>>
}
const ItemsCombobox = <T extends IItem>({
  data,
  setItems,
}: ItemsComboboxProps<T>) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

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
            ? data.find((item) => item.name === value)?.name
            : "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search by item name..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.name}
                  value={item.name}
                  onSelect={(currentValue) => {
                    setValue("")
                    setItems((prev) => [
                      ...new Set([
                        ...prev,
                        { name: currentValue, quantity: 1 },
                      ]),
                    ])
                    setOpen(false)
                  }}
                  className="h-[40px]"
                >
                  <div className="flex items-center gap-2 text-nowrap">
                    <img src={item.icon} height={32} width={32} />
                    {item.name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ItemsCombobox
