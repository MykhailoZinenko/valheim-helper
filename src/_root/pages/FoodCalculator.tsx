import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetFood } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/components/shared/Loader"
import Calculator from "../../components/shared/Calculator"
import FoodTable from "@/components/shared/tables/FoodTable"

const FoodCalculator = () => {
  const { data, isPending, isError } = useGetFood()

  console.log(data)

  return (
    <>
      {isPending || isError ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div>
          <Tabs defaultValue="0">
            <TabsList className="w-full">
              <TabsTrigger value="0" className="w-full">
                Food calculator
              </TabsTrigger>
              <TabsTrigger value="1" className="w-full">
                Food list
              </TabsTrigger>
            </TabsList>
            <TabsContent value="0">
              <Calculator name="food" data={data.items} />
            </TabsContent>
            <TabsContent value="1">
              <div className="mt-6">
                <FoodTable data={data.items} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  )
}

export default FoodCalculator
