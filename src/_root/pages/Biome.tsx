import { useParams } from "react-router-dom"

const Biome = () => {
  const { id } = useParams()

  return <div>{id}</div>
}

export default Biome
