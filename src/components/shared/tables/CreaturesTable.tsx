import { Button } from "@/components/ui/button"
import {
  CreatureRow,
  ItemColumn,
  itemNameFilter,
  TableRow,
} from "@/types/tables"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import DataTable from "../DataTable"
import { Creature, IItemFull, NormalAttackProfile } from "@/types"
import { FC } from "react"
import ItemLink from "../ItemLink"
import { caluclateAvgDamage, maxLevel } from "@/utils"
import { StarFilledIcon } from "@radix-ui/react-icons"
import { parse } from "path"

const creatureColumns: ColumnDef<TableRow<CreatureRow>>[] = [
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
    cell: ({ row }: { row: Row<TableRow<CreatureRow>> }) => {
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
    accessorKey: "damage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Damage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dmg = parseFloat(row.getValue("damage"))
      return (
        <div className="px-4">
          {!isNaN(dmg)
            ? dmg % 1 !== 0
              ? dmg.toFixed(2)
              : dmg
            : row.getValue("damage")}
        </div>
      )
    },
  },
  {
    accessorKey: "maxLevel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Max Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const maxLevel = parseInt(row.getValue("maxLevel"))

      return (
        <div className="px-4  flex flex-nowrap items-center gap-1">
          <span>{maxLevel}</span>
          <span className="flex items-center text-nowrap gap-0.5">
            {maxLevel > 1 ? (
              <>
                ({maxLevel - 1}
                <StarFilledIcon />)
              </>
            ) : null}
          </span>
        </div>
      )
    },
  },
]

interface CreaturesTableProps {
  data: IItemFull<Creature>[]
}

const CreaturesTable: FC<CreaturesTableProps> = ({ data }) => {
  return (
    <DataTable
      columns={creatureColumns}
      data={data
        .sort((a, b) => a.item.readableName.localeCompare(b.item.readableName))
        .map((c) => {
          console.log(c)
          return {
            item: {
              readableName: c.item.readableName,
              icon: c.item.icon,
              id: c.item.id,
            },
            health: c.item.hp,
            damage: caluclateAvgDamage(c) || "-",
            maxLevel: maxLevel(c),
          }
        })}
    />
  )
}

export default CreaturesTable
