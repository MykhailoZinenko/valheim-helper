import { Row } from "@tanstack/react-table"

export type ItemColumn = {
  icon: string
  readableName: string
  id: string
}

export const itemNameFilter = (
  row: Row<TableRow<any>>,
  columnId: string,
  filterValue: string
) => {
  const item: ItemColumn = row.getValue(columnId)
  return item.readableName.toLowerCase().includes(filterValue.toLowerCase())
}

export type FoodRow = {
  health: number
  stamina: number
  eitr?: number
  duration: number
  regen: number
}

export type CreatureRow = {
  health: number
}

export type TableRow<T> = {
  item: ItemColumn
} & T
