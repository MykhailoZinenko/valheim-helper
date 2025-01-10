import { useGetItemById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"
import Loader from "@/components/shared/Loader"
import ItemHeader from "@/components/shared/ItemHeader"
import { maxLevel } from "@/utils"
import JsonDisplay from "@/components/shared/JsonDisplay"
import DataDisplay from "@/components/shared/DataDisplay"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileIcon, FileJsonIcon } from "lucide-react"

const ItemPage = () => {
  const { id } = useParams()
  const [dataDisplay, setDataDisplay] = useState(true)

  const { data, isPending, isError } = useGetItemById(id || "")

  return isPending || isError ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="lg" />
    </div>
  ) : (
    <div className="w-full">
      <ItemHeader data={data.item} maxLevel={maxLevel(data)}>
        <div className="flex flex-col gap-4">
          <Button
            size="icon"
            className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover ml-auto"
            onClick={() => setDataDisplay(!dataDisplay)}
          >
            {dataDisplay ? <FileJsonIcon /> : <FileIcon />}
          </Button>
          {dataDisplay ? (
            <DataDisplay data={data} />
          ) : (
            <JsonDisplay data={data} />
          )}
        </div>
      </ItemHeader>
    </div>
  )
}

export default ItemPage
