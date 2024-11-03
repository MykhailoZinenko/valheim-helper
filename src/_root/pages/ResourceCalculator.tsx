import Calculator from "@/components/shared/Calculator"
import Loader from "@/components/shared/Loader"
import { useGetCalculatorItems } from "@/lib/react-query/queriesAndMutations"

const ResourceCalculator = () => {
  const { data, isPending, isError } = useGetCalculatorItems()

  return (
    <>
      {isPending || isError ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <Calculator name="resource" data={data} />
      )}
    </>
  )
}

export default ResourceCalculator
