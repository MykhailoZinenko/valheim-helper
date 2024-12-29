import { FC } from "react"
import DataTable from "../DataTable"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, CopyIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Row, ColumnDef } from "@tanstack/react-table"
import { Food, IItemCompact, IItemFull } from "@/types"
import ItemLink from "../ItemLink"
import { FoodRow, itemNameFilter, TableRow } from "@/types/tables"

const columns: ColumnDef<TableRow<FoodRow>>[] = [
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
    cell: ({ row }: { row: Row<TableRow<FoodRow>> }) => {
      console.log(row.getValue("item"))
      return <ItemLink item={row.getValue("item")} />
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
            navigator.clipboard.writeText(food.item.readableName)

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
            readableName: f.item.readableName,
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
