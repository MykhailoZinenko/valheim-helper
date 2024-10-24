import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StarFilledIcon } from "@radix-ui/react-icons"
import React from "react"
import { Link, useParams } from "react-router-dom"

const difficultyScaleMaxPlayers = 5
const damageScalePerPlayer = 0.04
const healthScalePerPlayer = 0.3

const healthPointsScale = (players: number = 1, stars: number = 0) => {
  console.log(
    (1 +
      (Math.min(difficultyScaleMaxPlayers, players) - 1) *
        healthScalePerPlayer) *
      (1 + stars)
  )
  return (
    (1 +
      (Math.min(difficultyScaleMaxPlayers, players) - 1) *
        healthScalePerPlayer) *
    (1 + stars)
  )
}

const damageScale = (players: number = 1, stars: number = 0) => {
  return (
    (1 +
      (Math.min(difficultyScaleMaxPlayers, 1) - players) *
        damageScalePerPlayer) *
    (1 + stars * 0.5)
  )
}

const Creature = ({ data }: { data: any }) => {
  const maxLevel =
    data.spawners.length > 0
      ? data.spawners.reduce((m, s) => Math.max(m, s.levels[1]), 0)
      : 1

  const { level: currentLevel } = useParams()
  const level = currentLevel ? parseInt(currentLevel) : 0

  const hpScale = healthPointsScale(1, level)
  const dmgScale = damageScale(1, level)
  const dropScale = 2 ** (level - 1)

  return (
    <div>
      <Tabs defaultValue={level.toString()}>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <img src={data.icon} className="aspect-square w-[65px]" />
            <div>
              <h1 className="text-5xl font-norse font-bold text-color-text-primary">
                {data.name}
              </h1>
              <h2 className="text-2xl font-norse text-color-text-secondary">
                {data.type}
              </h2>
            </div>
          </div>

          {data.spawners.length > 0 ? (
            <TabsList>
              {Array.from({
                length: maxLevel,
              }).map((_, i) => (
                <Link key={i} to={`/item/${data.id}/${i}`}>
                  <TabsTrigger value={`${i}`}>
                    <span>{i}</span>
                    <StarFilledIcon className="ml-1" />
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          ) : null}
        </div>
        {data.spawners.length > 0 ? (
          <>
            {Array.from({
              length: maxLevel,
            }).map((_, i) => (
              <TabsContent key={i} value={`${i}`}>
                <ul>
                  <li>{data.hp * hpScale}</li>
                  <li>
                    {(data.attacks[0]?.attacks[0]?.dmg?.slash ?? 0) * dmgScale}
                  </li>
                </ul>
              </TabsContent>
            ))}
          </>
        ) : null}
      </Tabs>
    </div>
  )
}

export default Creature
