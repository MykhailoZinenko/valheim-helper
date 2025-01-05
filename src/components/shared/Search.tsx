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
import { Link, useNavigate } from "react-router-dom"
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
import { IItem, IItemCompact } from "@/types"
import { IBasePage, getSearchablePages } from "@/types/pages"
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

      <ScrollArea className="whitespace-nowrap w-full overflow-auto">
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

interface SearchProps {
  variant: string
}

interface ISearchResult {
  kind: "item" | "page"
  data: IItem<IItemCompact> | IBasePage
}

const Search: React.FC<SearchProps> = ({ variant }) => {
  const [open, setOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<ISearchResult[]>([])
  const [pending, setPending] = useState(false)
  const [filteredItems, setFilteredItems] = useState<ISearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [shouldLoadData, setShouldLoadData] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    type: [],
    biome: [],
    group: [],
    station: [],
  })

  const navigate = useNavigate()

  const { data, isLoading } = useGetItems(shouldLoadData)
  const listRef = useRef<List>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const totalFiltersApplied = Object.values(selectedFilters).flat().length

  const combinedFuse = React.useMemo(() => {
    if (!data) return null

    const searchablePages = getSearchablePages()

    // Transform items to include type
    const transformedItems = data.items.map((item) => ({
      kind: "item" as const,
      data: item,
      // Include searchable fields
      id: item.id,
    }))

    // Transform pages to include type
    const transformedPages = searchablePages.map((page) => ({
      kind: "page" as const,
      data: page,
      // Include searchable fields
      title: page.title,
      description: page.description,
      type: page.type,
    }))

    // Combine all items
    const searchableItems = [...transformedItems, ...transformedPages]

    console.log(searchableItems)

    return new Fuse<ISearchResult>(searchableItems, {
      keys: ["id", "title", "description", "type"],
      threshold: 0.4,
    })
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

  useEffect(() => {
    if (variant === "inline") {
      setShouldLoadData(showResults)
    } else {
      setShouldLoadData(open)
    }
  }, [variant, showResults, open])

  // Apply filters to items
  const applyFilters = useCallback(
    (items: ISearchResult[]) => {
      return items.filter((item) => {
        if (item.kind === "page" || "path" in item.data)
          return !totalFiltersApplied
        if (
          selectedFilters.type.length > 0 &&
          !selectedFilters.type.includes(item.data.type)
        ) {
          return false
        }
        if (selectedFilters.biome.length > 0) {
          const hasMatchingBiome = item.data.biomes?.some((biome) =>
            selectedFilters.biome.includes(biome)
          )
          if (!hasMatchingBiome) return false
        }
        if (
          selectedFilters.group.length > 0 &&
          !selectedFilters.group.includes(item.data.group)
        ) {
          return false
        }
        if (
          selectedFilters.station.length > 0 &&
          !selectedFilters.station.includes(item.data.station)
        ) {
          return false
        }
        return true
      })
    },
    [selectedFilters]
  )

  // Fixed useEffect
  useEffect(() => {
    if (data) {
      // Transform items to ISearchResult format before sorting and filtering
      const transformedItems: ISearchResult[] = data.items.map((item) => ({
        kind: "item",
        data: item,
      }))

      // Sort by id using the nested data structure
      const sorted = [...transformedItems].sort((a, b) =>
        (a.data as IItem<IItemCompact>).id.localeCompare(
          (b.data as IItem<IItemCompact>).id
        )
      )

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value) {
        // Search items
        const itemSearchResults = combinedFuse
          ? combinedFuse.search(value).map((result) => result.item)
          : []

        const filteredItemResults = applyFilters(itemSearchResults)
        setResults(filteredItemResults)
      } else {
        setResults([])
      }
      setPending(false)
    }, 300),
    [combinedFuse, applyFilters]
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    setPending(true)
    debouncedSearch(value)
    setShowResults(true)
  }

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0)
    }
    if (selectedIndex >= 0) {
      setSelectedIndex(-1)
    }
  }, [searchTerm])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!open)
      }

      if (event.key === "Escape" && variant === "inline") {
        event.preventDefault()
        if (variant === "inline") {
          setShowResults(false)
        } else {
          setOpen(false)
        }
        setSelectedIndex(-1)
      }

      if (showResults || open) {
        const itemsLength = searchTerm ? results.length : filteredItems.length

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault()
            setSelectedIndex((prev) => Math.min(prev + 1, itemsLength - 1))
            break
          case "ArrowUp":
            event.preventDefault()
            setSelectedIndex((prev) => Math.max(prev - 1, -1))
            break
          case "Enter":
            console.log("here")
            event.preventDefault()
            if (selectedIndex >= 0) {
              const selectedItem = searchTerm
                ? results[selectedIndex]
                : filteredItems[selectedIndex]
              if (selectedItem) {
                navigate(
                  selectedItem.kind === "page" && "path" in selectedItem.data
                    ? selectedItem.data.path
                    : `/item/${selectedItem.data.id}`
                )
                setOpen(false)
                setShowResults(false)
              }
            } else if (open) {
              console.log("No item found")
              navigate(
                `/item/${searchTerm ? (results[0].kind === "page" && "path" in results[0].data ? results[0].data.path : results[0].data.id) : filteredItems[0].kind === "page" && "path" in filteredItems[0].data ? filteredItems[0].data.path : filteredItems[0].data.id}`
              )
              setOpen(false)
            }
            break
          case "Tab":
            if (event.shiftKey) {
              event.preventDefault()
              setShowFilters((prev) => !prev)
            }
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, results, filteredItems, selectedIndex, searchTerm, navigate])

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
    const totalResults = searchTerm ? results : filteredItems
    const item = totalResults[index]
    const selected = selectedIndex === index

    if ("path" in item.data && item.kind === "page") {
      // It's a page

      console.log(item.data)
      return (
        <Link
          to={item.data.isDynamic ? "#" : item.data.path} // For dynamic paths, you might want to show a different UI
          key={item.data.id}
          className={`px-4 py-2 border-b flex items-center w-full gap-2 transition-colors ${
            selected ? "bg-color-secondary-bg" : "hover:bg-color-secondary-bg"
          }`}
          style={style}
          onClick={() => {
            if (variant === "inline") {
              setShowResults(false)
            } else {
              setOpen(false)
            }
          }}
        >
          {item.data.icon && (
            <img src={item.data.icon} loading="lazy" height={32} width={32} />
          )}
          <div className="flex flex-col items-start overflow-hidden">
            <div className="font-medium">{item.data.title}</div>
            <div className="text-sm text-muted-foreground truncate text-ellipsis">
              <span className="capitalize">{item.data.type}</span>
              {item.data.description && ` • ${item.data.description}`}
            </div>
          </div>
        </Link>
      )
    }

    return (
      <Link
        to={`/item/${item.data.id}`}
        key={item.data.id}
        className={`px-4 py-2 border-b flex items-center w-full gap-2 transition-colors ${
          selected ? "bg-color-secondary-bg" : "hover:bg-color-secondary-bg"
        }`}
        style={style}
        onClick={() =>
          variant === "inline" ? setShowResults(false) : setOpen(false)
        }
      >
        <img src={item.data.icon} loading="lazy" height={32} width={32} />{" "}
        {(item.data as IItem<IItemCompact>).readableName}
      </Link>
    )
  }

  return (
    <>
      {variant === "inline" ? (
        <div ref={wrapperRef} className="relative w-full">
          <Input
            ref={inputRef}
            placeholder="Search items..."
            className="w-full text-[16px] h-10"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => {
              setShowResults(true)
              setShouldLoadData(true)
            }}
          />

          {showResults && searchTerm && (
            <div className="absolute top-full left-0 w-full bg-background border rounded-md mt-1 shadow-lg z-50">
              <div className="max-h-[300px] overflow-auto">
                {isLoading || pending ? (
                  <div className="w-full h-[100px] flex items-center justify-center">
                    <Loader size="md" />
                  </div>
                ) : results.length === 0 ? (
                  <div className="w-full h-[100px] flex items-center justify-center text-muted-foreground">
                    No results found
                  </div>
                ) : (
                  <List
                    ref={listRef}
                    height={Math.min(results.length * 40, 300)}
                    itemCount={results.length}
                    itemSize={40}
                    width="100%"
                  >
                    {renderRow}
                  </List>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
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
              className={`${showFilters ? "block w-full md:w-[240px]" : "hidden md:block md:w-[240px]"} flex-none flex flex-col border-r`}
            >
              <div className="flex items-center gap-2 px-3 border-b w-full py-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden"
                >
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
            <div
              className={`flex-1 ${showFilters ? "hidden md:block md:w-full" : "block"}`}
            >
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
                    itemCount={
                      searchTerm ? results.length : filteredItems.length
                    }
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
      )}
    </>
  )
}

export default Search
