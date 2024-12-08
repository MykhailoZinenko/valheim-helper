import { StarFilledIcon } from "@radix-ui/react-icons"
import { Link, useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ReactNode } from "react"
import { Creature, GameObject, IItem } from "@/types"

const ItemHeader = ({
  data,
  maxLevel,
  children,
}: {
  data: IItem<GameObject>
  maxLevel: number
  children?: ReactNode
}) => {
  const { level: currentLevel } = useParams()
  const level = currentLevel ? parseInt(currentLevel) : 0

  console.log(data, currentLevel, level)

  return (
    <>
      {" "}
      <Tabs defaultValue={level.toString()}>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <img
              src={data.icon}
              loading="lazy"
              className="aspect-square w-[65px]"
            />
            <div>
              <h1 className="text-5xl font-norse font-bold text-color-text-primary">
                {data.readableName}
              </h1>
              <h2 className="text-2xl font-norse text-color-text-secondary">
                {data.type}
              </h2>
            </div>
          </div>

          {(data as Creature).spawners &&
          (data as Creature).spawners.length > 0 ? (
            <TabsList>
              {Array.from({
                length: maxLevel,
              }).map((_, i) => (
                <Link
                  key={i}
                  to={`/item/${data.id}/${i}`}
                  className="cursor-pointer"
                >
                  <TabsTrigger value={`${i}`}>
                    <span>{i}</span>
                    <StarFilledIcon className="ml-1" />
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          ) : null}
        </div>
        {(data as Creature).spawners &&
        (data as Creature).spawners.length > 0 ? (
          <>
            {Array.from({
              length: maxLevel,
            }).map((_, i) => (
              <TabsContent key={i} value={`${i}`}>
                {children}
              </TabsContent>
            ))}
          </>
        ) : (
          children
        )}
      </Tabs>
    </>
  )
}

export default ItemHeader
