import { IItem, IItemCompact, IItemFull } from "@/types"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react"

interface Item {
  name: string
  quantity: number
}

interface Workbench {
  name: string
  level: number
}

interface CalculatorState {
  itemNames: Item[]
  materials: Item[]
  workbenches: Workbench[]
}

type CalculatorStateUpdate =
  | Partial<CalculatorState>
  | ((prev: CalculatorState) => Partial<CalculatorState>)

interface CalculatorContextType {
  states: Record<string, CalculatorState>
  setCalculatorState: (
    calculatorName: string,
    updates: CalculatorStateUpdate
  ) => void
  calculateMaterialsAndWorkbenches: (
    calculatorName: string,
    data: IItemFull<IItemCompact>[],
    items: { items: IItem<IItemCompact>[] }
  ) => void
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
  undefined
)

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [states, setStates] = useState<Record<string, CalculatorState>>({})

  // Initialize states from localStorage
  useEffect(() => {
    const storedStates: Record<string, CalculatorState> = {}
    const calculatorNames = Object.keys(localStorage)
      .filter((key) => key.endsWith("-calculator-item-names"))
      .map((key) => key.replace("-calculator-item-names", ""))

    calculatorNames.forEach((name) => {
      storedStates[name] = {
        itemNames: JSON.parse(
          localStorage.getItem(`${name}-calculator-item-names`) ?? "[]"
        ),
        materials: JSON.parse(
          localStorage.getItem(`${name}-calculator-materials`) ?? "[]"
        ),
        workbenches: JSON.parse(
          localStorage.getItem(`${name}-calculator-workbenches`) ?? "[]"
        ),
      }
    })

    setStates(storedStates)
  }, [])

  // Update localStorage whenever states change
  useEffect(() => {
    Object.entries(states).forEach(([name, state]) => {
      localStorage.setItem(
        `${name}-calculator-item-names`,
        JSON.stringify(state.itemNames)
      )
      localStorage.setItem(
        `${name}-calculator-materials`,
        JSON.stringify(state.materials)
      )
      localStorage.setItem(
        `${name}-calculator-workbenches`,
        JSON.stringify(state.workbenches)
      )
    })
  }, [states])

  const setCalculatorState = useCallback(
    (
      calculatorName: string,
      updates:
        | Partial<CalculatorState>
        | ((prev: CalculatorState) => Partial<CalculatorState>)
    ) => {
      setStates((prevStates) => {
        const currentState = prevStates[calculatorName] || {
          itemNames: [],
          materials: [],
          workbenches: [],
        }

        const newUpdates =
          typeof updates === "function" ? updates(currentState) : updates

        return {
          ...prevStates,
          [calculatorName]: {
            ...currentState,
            ...newUpdates,
          },
        }
      })
    },
    []
  )

  const calculateMaterialsAndWorkbenches = useCallback(
    (
      calculatorName: string,
      data: IItemFull<IItemCompact>[],
      items: { items: IItem<IItemCompact>[] }
    ) => {
      if (!data || !items) return

      setStates((prevStates) => {
        const currentState = prevStates[calculatorName] || {
          itemNames: [],
          materials: [],
          workbenches: [],
        }
        const { itemNames } = currentState

        // Calculate materials
        const materials: Item[] = []
        itemNames.forEach((item) => {
          const foundItem = data.find(
            (i: IItemFull<IItemCompact>) => i.item.readableName === item.name
          )

          if (foundItem && foundItem.recipe) {
            if (foundItem.recipe.type !== "craft") return

            Object.entries(foundItem.recipe.materials).forEach(
              ([key, value]) => {
                const materialItem = items.items.find((item) => item.id === key)
                const material = materials.find(
                  (material) =>
                    material.name === (materialItem?.readableName || key)
                )

                if (material) {
                  material.quantity += (value as number) * item.quantity
                } else {
                  materials.push({
                    name: materialItem?.readableName || key,
                    quantity: (value as number) * item.quantity,
                  })
                }
              }
            )
          } else {
            const existingItem = materials.find(
              (material) => material.name === item.name
            )

            if (existingItem) {
              materials.forEach((material) => {
                if (material.name === item.name) {
                  material.quantity += item.quantity
                }
              })
            } else {
              materials.push({
                name: item.name,
                quantity: item.quantity,
              })
            }
          }
        })

        // Calculate workbenches
        const workbenches: Workbench[] = []
        itemNames.forEach((item) => {
          const foundItem = data.find(
            (i: IItemFull<IItemCompact>) => i.item.readableName === item.name
          )

          if (foundItem && foundItem.recipe) {
            const recipe = foundItem.recipe

            if (recipe.type === "craft") {
              const workbenchItem = items.items.find(
                (item) => item.id === recipe.source.station
              )
              const workbench = workbenches.find(
                (workbench) =>
                  workbench.name ===
                  (workbenchItem?.readableName || recipe.source.station)
              )

              if (workbench) {
                workbench.level = Math.max(workbench.level, recipe.source.level)
              } else {
                workbenches.push({
                  name:
                    workbenchItem?.readableName ||
                    recipe.source.station ||
                    "Unknown",
                  level: recipe.source.level,
                })
              }
            }
          }
        })

        return {
          ...prevStates,
          [calculatorName]: {
            ...currentState,
            materials,
            workbenches,
          },
        }
      })
    },
    []
  )

  const value = React.useMemo(
    () => ({
      states,
      setCalculatorState,
      calculateMaterialsAndWorkbenches,
    }),
    [states, setCalculatorState, calculateMaterialsAndWorkbenches]
  )

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  )
}

// Custom hook to use the calculator context
export const useCalculator = (calculatorName: string) => {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error("useCalculator must be used within a CalculatorProvider")
  }

  const { states, setCalculatorState, calculateMaterialsAndWorkbenches } =
    context
  const state = states[calculatorName] ?? {
    itemNames: [],
    materials: [],
    workbenches: [],
  }

  const setItemNames: Dispatch<SetStateAction<Item[]>> = (value) => {
    if (typeof value === "function") {
      setCalculatorState(calculatorName, (prevState) => ({
        itemNames: value(prevState.itemNames),
      }))
    } else {
      setCalculatorState(calculatorName, { itemNames: value })
    }
  }

  return {
    itemNames: state.itemNames,
    materials: state.materials,
    workbenches: state.workbenches,
    setItemNames,
    calculateMaterialsAndWorkbenches: (
      data: IItemFull<IItemCompact>[],
      items: { items: IItem<IItemCompact>[] }
    ) => calculateMaterialsAndWorkbenches(calculatorName, data, items),
  }
}
