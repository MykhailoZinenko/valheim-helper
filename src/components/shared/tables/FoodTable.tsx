import { FC } from "react"
import DataTable from "../DataTable"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CopyIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import { Row, ColumnDef } from "@tanstack/react-table"
import { Food, IItemCompact, IItemFull } from "@/types"

type Item = {
  icon: string
  name: string
  id: string
}

type FoodRow = {
  item: Item
  health: number
  stamina: number
  eitr?: number
  duration: number
  regen: number
}

const itemNameFilter = (
  row: Row<FoodRow>,
  columnId: string,
  filterValue: string
) => {
  const item: Item = row.getValue(columnId)
  return item.name.toLowerCase().includes(filterValue.toLowerCase())
}

const columns: ColumnDef<FoodRow>[] = [
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
    cell: ({ row }: { row: Row<FoodRow> }) => {
      console.log(row.getValue("item"))
      return (
        <div className="flex items-center gap-2 text-nowrap min-w-max">
          <img
            src={(row.getValue("item") as Item).icon}
            height={32}
            width={32}
          />
          <Link
            to={`/item/${(row.getValue("item") as Item).id}`}
            className="text-color-link hover:underline"
          >
            {(row.getValue("item") as Item).name}
          </Link>
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

interface FoodTableProps {
  data: IItemFull<IItemCompact & { Food: Food }>[]
}

const FoodTable: FC<FoodTableProps> = ({ data }) => {
  return (
    <DataTable
      columns={columns}
      data={data
        .sort((a, b) => a.item.readableName.localeCompare(b.item.readableName))
        .map((f) => ({
          item: {
            name: f.item.readableName,
            icon: f.item.icon,
            id: f.item.id,
          },
          ...f.item.Food!,
          duration: f.item.Food!.duration / 60,
          eitr: f.item.Food!.eitr ?? 0,
        }))}
    />
  )
}

export default FoodTable
