import { SearchIcon, X, Filter, ArrowLeft } from "lucide-react"
import React, { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { useGetItems } from "@/lib/react-query/queriesAndMutations"
import Fuse from "fuse.js"
import { FixedSizeList as List } from "react-window"
import { Link } from "react-router-dom"
import { debounce } from "lodash"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { filters } from "@/consts/searchFilters"
import { Badge } from "../ui/badge"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { IItem } from "@/types"
import Loader from "./Loader"

interface FilterGroupProps {
  label: keyof typeof filters
  options: string[]
  selectedValues: string[]
  onValueChange: (group: string, value: string) => void
  onRemove: (group: string, value: string) => void
}

interface SelectedFilters {
  [key: string]: string[]
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  options,
  selectedValues,
  onValueChange,
  onRemove,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <label className="text-[16px] text-muted-foreground capitalize w-16">
          {label}
        </label>
        <Select
          onValueChange={(value) => {
            onValueChange(label, value)
            return ""
          }}
          value={""}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="whitespace-nowrap">
        <div className="flex w-max space-x-2 py-2">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => (
              <Badge
                key={value}
                variant="secondary"
                className="flex-shrink-0 items-center gap-1 bg-color-secondary-bg text-color-text-secondary"
              >
                <button
                  onClick={() => onRemove(label, value)}
                  className="ml-1 hover:bg-color-button-hover rounded-full p-0.5 flex items-center gap-1"
                >
                  {value}
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-[12px] text-muted-foreground h-[26px]">
              No {label} filter applied
            </p>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

const Search: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<IItem[]>([])
  const [pending, setPending] = useState(false)
  const [filteredItems, setFilteredItems] = useState<IItem[]>([])

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    type: [],
    biome: [],
    group: [],
    station: [],
  })

  const { data, isLoading } = useGetItems()
  const listRef = useRef<List>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const totalFiltersApplied = Object.values(selectedFilters).flat().length

  const fuse = React.useMemo(() => {
    if (data) {
      return new Fuse<IItem>(data.items, {
        keys: ["id"],
        threshold: 0.4,
      })
    }
    return null
  }, [data])

  const resetState = useCallback(() => {
    setSearchTerm("")
    setResults([])
    setPending(false)
    setShowFilters(false)
    setSelectedFilters({
      type: [],
      biome: [],
      group: [],
      station: [],
    })
  }, [])

  // Apply filters to items
  const applyFilters = useCallback(
    (items: IItem[]) => {
      return items.filter((item) => {
        if (
          selectedFilters.type.length > 0 &&
          !selectedFilters.type.includes(item.type)
        ) {
          return false
        }
        if (selectedFilters.biome.length > 0) {
          const hasMatchingBiome = item.biomes?.some((biome) =>
            selectedFilters.biome.includes(biome)
          )
          if (!hasMatchingBiome) return false
        }
        if (
          selectedFilters.group.length > 0 &&
          !selectedFilters.group.includes(item.group)
        ) {
          return false
        }
        if (
          selectedFilters.station.length > 0 &&
          !selectedFilters.station.includes(item.station)
        ) {
          return false
        }
        return true
      })
    },
    [selectedFilters]
  )

  useEffect(() => {
    if (data) {
      const sorted = [...data.items].sort((a, b) => a.id.localeCompare(b.id))
      const filtered = applyFilters(sorted)
      setFilteredItems(filtered)
    }
  }, [data, selectedFilters, applyFilters])

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    } else {
      resetState()
    }
  }, [open, resetState])

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (fuse && value) {
        const searchResults = fuse.search(value)
        const filteredResults = applyFilters(
          searchResults.map((result) => result.item)
        )
        setResults(filteredResults)
      } else {
        setResults([])
      }
      setPending(false)
    }, 300),
    [fuse, applyFilters]
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    setPending(true)
    debouncedSearch(value)
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0)
    }
  }, [searchTerm])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!open)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter((item) => item !== value)
        : [...prev[group], value],
    }))
    setSearchTerm("")
  }

  const handleFilterRemove = (group: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [group]: prev[group].filter((item) => item !== value),
    }))
  }

  interface RowProps {
    index: number
    style: React.CSSProperties
  }

  const renderRow = ({ index, style }: RowProps) => {
    const item = searchTerm ? results[index] : filteredItems[index]

    return (
      <Link
        to={`/item/${item.id}`}
        key={item.id}
        className="px-4 py-2 border-b flex items-center w-full gap-2 hover:bg-color-secondary-bg"
        style={style}
        onClick={() => setOpen(false)}
      >
        <img src={item.icon} height={32} width={32} /> {item.name}
      </Link>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover ml-2 xl:ml-0"
        >
          <SearchIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 rounded-md max-w-[700px] w-11/12 h-[420px] flex gap-0">
        {/* Filters Section - Hidden on mobile when showing search */}
        <div
          className={`${showFilters ? "block w-full" : "hidden md:block md:w-[240px]"} flex-none flex flex-col border-r`}
        >
          <div className="flex items-center gap-2 px-3 border-b w-full py-2">
            <button onClick={() => setShowFilters(false)} className="md:hidden">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p>Filters</p>
            <span className="h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
              {totalFiltersApplied}
            </span>
          </div>

          <div className="px-3 pb-2 pt-4 space-y-2">
            {Object.keys(filters).map((filterKey) => (
              <FilterGroup
                key={filterKey}
                label={filterKey as keyof typeof filters}
                options={filters[filterKey as keyof typeof filters]}
                selectedValues={selectedFilters[filterKey]}
                onValueChange={handleFilterChange}
                onRemove={handleFilterRemove}
              />
            ))}
          </div>
        </div>

        {/* Search Section - Hidden on mobile when showing filters */}
        <div className={`flex-1 ${showFilters ? "hidden md:block" : "block"}`}>
          <DialogHeader className="border-b">
            <DialogTitle className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-10 ml-2"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4" />
                {totalFiltersApplied > 0 && (
                  <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                    {totalFiltersApplied}
                  </span>
                )}
              </Button>
              <Input
                ref={inputRef}
                placeholder="Search"
                className="border-none rounded-md h-10 text-[16px]"
                value={searchTerm}
                onChange={handleSearch}
              />

              <DialogClose className="absolute right-2 top-2">
                <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ESC
                </kbd>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>

          <div className="h-[370px] overflow-auto">
            {isLoading || pending ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader size={"lg"} />
              </div>
            ) : (searchTerm && results.length == 0) ||
              filteredItems.length == 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                No results found
              </div>
            ) : (
              <List
                ref={listRef}
                height={370}
                itemCount={searchTerm ? results.length : filteredItems.length}
                itemSize={40}
                width="100%"
              >
                {renderRow}
              </List>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Search
