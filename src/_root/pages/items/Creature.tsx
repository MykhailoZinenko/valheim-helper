import ItemHeader from "@/components/shared/ItemHeader"
import { useParams } from "react-router-dom"

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
      ? data.spawners.reduce((m: any, s: any) => Math.max(m, s.levels[1]), 0)
      : 1

  const { level: currentLevel } = useParams()
  const level = currentLevel ? parseInt(currentLevel) : 0

  const hpScale = healthPointsScale(1, level)
  const dmgScale = damageScale(1, level)
  // const dropScale = 2 ** (level - 1)

  return (
    <div>
      <ItemHeader data={data} maxLevel={maxLevel}>
        <ul>
          <li>{data.hp * hpScale}</li>
          <li>{(data.attacks[0]?.attacks[0]?.dmg?.slash ?? 0) * dmgScale}</li>
        </ul>
      </ItemHeader>
    </div>
  )
}

export default Creature
