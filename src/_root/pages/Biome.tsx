import DataTable from "@/components/shared/DataTable"
import Loader from "@/components/shared/Loader"
import FoodTable from "@/components/shared/tables/FoodTable"
import VignetteImage from "@/components/shared/VignetteImage"
import { Button } from "@/components/ui/button"
import { useGetBiomeById } from "@/lib/react-query/queriesAndMutations"
import { type Biome } from "@/types"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useParams } from "react-router-dom"

type Item = {
  icon: string
  name: string
}

const itemNameFilter = (
  row: Row<any>,
  columnId: string,
  filterValue: string
) => {
  const item: Item = row.getValue(columnId)
  return item.name.toLowerCase().includes(filterValue.toLowerCase())
}

const creatureColumns: ColumnDef<any>[] = [
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
    cell: ({ row }: { row: Row<any> }) => {
      return (
        <div className="flex items-center gap-2 text-nowrap">
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
]

const resourceColumns: ColumnDef<any>[] = [
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
    cell: ({ row }: { row: Row<any> }) => {
      return (
        <div className="flex items-center gap-2 text-nowrap">
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
]

const Biome = () => {
  const { id } = useParams()

  const {
    data: biome,
    isPending,
    isError,
  } = useGetBiomeById((id as Biome) || "Meadows")

  return (
    <>
      {isPending || isError ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div>
          <div className="flex flex-col-reverse gap-8 my-4 md:flex-row md:items-center md:gap-4">
            <div className="w-full md:w-4/5 md:mt-5">
              <h1 className="text-5xl font-norse font-bold text-color-text-primary">
                {biome.name}
              </h1>
              <h3 className="text-xl text-color-text-secondary">
                {biome.description}
              </h3>
            </div>
            <div className="w-full h-[250px] relative z-0 transition-transform duration-700 ease-out transform">
              <VignetteImage
                src={biome.imageUrl}
                fromColor="from-color-primary-bg"
                fromPercent="from-[0%]"
              />
            </div>
          </div>
          <DataTable
            columns={creatureColumns}
            data={biome.creatures
              .sort((a, b) => a.item.name.localeCompare(b.item.name))
              .map((c) => {
                console.log(c)
                return { item: { name: c.item.name, icon: c.item.icon } }
              })}
          />
          <DataTable
            columns={resourceColumns}
            data={biome.resources
              .sort((a, b) => a.item.name.localeCompare(b.item.name))
              .map((c) => {
                console.log(c)
                return { item: { name: c.item.name, icon: c.item.icon } }
              })}
          />
          <FoodTable data={biome.food.items} />
        </div>
      )}
    </>
  )
}

export default Biome
