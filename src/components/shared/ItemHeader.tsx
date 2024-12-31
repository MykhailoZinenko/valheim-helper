import { StarFilledIcon } from "@radix-ui/react-icons"
import { Link, useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ReactNode } from "react"
import { Creature, GameObject, IItem } from "@/types"
import { Button } from "../ui/button"
import { BookmarkIcon, PlusIcon, XIcon } from "lucide-react"
import { useCalculator } from "@/context/CalculatorContext"
import { caclType } from "@/utils"

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

  const { itemNames, setItemNames } = useCalculator(caclType(data) ?? "")

  const inCalc =
    itemNames.findIndex((item) => item.name === data.readableName) !== -1

  return (
    <>
      {" "}
      <Tabs defaultValue={level.toString()}>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between relative">
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
            <TabsList className="sm:ml-auto">
              {Array.from({
                length: maxLevel,
              }).map((_, i) => (
                <Link
                  key={i}
                  to={`/item/${data.id}/${i}`}
                  className="cursor-pointer w-full sm:w-auto"
                >
                  <TabsTrigger value={`${i}`} className="w-full sm:w-auto">
                    <span>{i}</span>
                    <StarFilledIcon className="ml-1" />
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          ) : null}

          <div className="absolute right-0 top-0 sm:relative">
            {caclType(data) && (
              <Button
                size="icon"
                className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover"
                onClick={() =>
                  inCalc
                    ? setItemNames((prev) =>
                        prev.filter((item) => item.name !== data.readableName)
                      )
                    : setItemNames((prev) => [
                        ...prev,
                        { name: data.readableName, quantity: 1 },
                      ])
                }
              >
                {inCalc ? <XIcon /> : <PlusIcon />}
              </Button>
            )}
            <Button
              size="icon"
              className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover ml-2"
            >
              <BookmarkIcon />
            </Button>
          </div>
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
