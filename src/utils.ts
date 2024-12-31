import { playerDamageModifiers } from "./consts"
import {
  Creature,
  DamageModifiers,
  damageModifiersValues,
  DamageProfile,
  DamageType,
  Food,
  GameObject,
  IItem,
  IItemFull,
} from "./types"

export function mapValues<K extends string | number, T, R = T>(
  obj: Record<K, T>,
  fn: (arg: T, key: K) => R
): Record<K, R>
export function mapValues<K extends string | number, T, R = T>(
  obj: Partial<Record<K, T>>,
  fn: (arg: T, key: K) => R
): Partial<Record<K, R>>
export function mapValues<K extends string | number, T, R = T>(
  obj: Partial<Record<K, T>>,
  fn: (arg: T, key: K) => R
): Partial<Record<K, R>> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, fn(val as T, key as K)])
  ) as Record<K, R>
}

export const caclType = (item: IItem<GameObject>) => {
  if (
    ["piece", "creature", "object", "spawner", "effect", "fish"].includes(
      item.type
    )
  )
    return null

  return "Food" in item ? "food" : "resource"
}

export const maxLevel = (data: IItemFull<any> | undefined) => {
  return data &&
    data.item &&
    (data.item as Creature).spawners &&
    (data.item as Creature).spawners.length > 0
    ? (data.item as Creature).spawners.reduce(
        (m, s) => Math.max(m, s.levels[1]),
        0
      )
    : 1
}

export function getTotalDamage(damage: Partial<DamageProfile>): number {
  return Object.values(damage).reduce<number>((a, b) => a + (b ?? 0), 0)
}

export function applyDamageModifiers(
  damage: DamageProfile,
  modifiers: DamageModifiers
): DamageProfile {
  return mapValues(damage, (val, type: DamageType) =>
    val == null ? val : val * damageModifiersValues[modifiers[type]]
  )
}

export const caluclateAvgDamage = (data: IItemFull<Creature> | undefined) => {
  if (!data || !data.item) return

  const attacks = data.item.attacks.flatMap((a) => a.attacks)

  if (!attacks) return "-"

  let nr = 0
  let total = 0
  for (const attack of attacks) {
    if ("dmg" in attack) {
      nr++
      total += getTotalDamage(
        applyDamageModifiers(attack.dmg, playerDamageModifiers)
      )
    }
  }
  const avg = total / nr
  return avg
}
