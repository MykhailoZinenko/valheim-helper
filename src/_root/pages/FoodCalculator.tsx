import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetFood } from "@/lib/react-query/queriesAndMutations"
import { ColumnDef, Row } from "@tanstack/react-table"
import DataTable from "@/components/shared/DataTable"
import Loader from "@/components/shared/Loader"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CopyIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Calculator from "../../components/shared/Calculator"

type Item = {
  icon: string
  name: string
}

type Food = {
  item: Item
  health: number
  stamina: number
  eitr?: number
  duration: number
  regen: number
}

const itemNameFilter = (
  row: Row<Food>,
  columnId: string,
  filterValue: string
) => {
  const item: Item = row.getValue(columnId)
  return item.name.toLowerCase().includes(filterValue.toLowerCase())
}

const columns: ColumnDef<Food>[] = [
  {
    accessorKey: "item",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }: { row: Row<Food> }) => {
      return (
        <div className="flex items-center gap-2 text-nowrap min-w-max">
          <img
            src={(row.getValue("item") as Item).icon}
            height={32}
            width={32}
          />
          {(row.getValue("item") as Item).name}
        </div>
      )
    },
    filterFn: itemNameFilter,
  },
  {
    accessorKey: "health",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Health
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="px-4">{row.getValue("health")}</div>
    },
  },
  {
    accessorKey: "stamina",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stamina
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="px-4">{row.getValue("stamina")}</div>
    },
  },
  {
    accessorKey: "eitr",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Eitr
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="px-4">{row.getValue("eitr")}</div>
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="px-4">{row.getValue("duration")} min</div>
    },
  },
  {
    accessorKey: "regen",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Regen
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="px-4">{row.getValue("regen")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const food = row.original

      return (
        <Button
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(food.item.name)

            toast({
              title: "Copied to clipboard",
              description: "Food name has been copied to clipboard",
            })
          }}
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
      )
    },
  },
]

const FoodCalculator = () => {
  const { data, isPending, isError } = useGetFood()

  return (
    <>
      {isPending || isError ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div>
          <Tabs defaultValue="0">
            <TabsList className="w-full">
              <TabsTrigger value="0" className="w-full">
                Food calculator
              </TabsTrigger>
              <TabsTrigger value="1" className="w-full">
                Food list
              </TabsTrigger>
            </TabsList>
            <TabsContent value="0">
              <Calculator name="food" data={data.items} />
            </TabsContent>
            <TabsContent value="1">
              <div className="mt-6">
                <DataTable
                  columns={columns}
                  data={data.items
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((f) => ({
                      item: {
                        name: f.name,
                        icon: f.icon,
                      },
                      ...f.stats,
                      duration: f.stats.duration / 60,
                      eitr: f.stats.eitr ?? 0,
                    }))}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  )
}

export default FoodCalculator
