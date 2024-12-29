import { IItem } from "@/types"
import { Link } from "react-router-dom"

type ItemLinkProps = {
  item: IItem<any>
  variant?: "default" | "hover" | "filled"
  className?: string
}

const ItemLink = ({ item, className, variant = "default" }: ItemLinkProps) => {
  if (variant === "filled") {
    return (
      <Link
        key={item.readableName}
        to={`/item/${item.id}`}
        className="text-color-link hover:underline flex items-center gap-3 p-2 px-4 bg-color-secondary-bg/50 rounded-lg border border-accent/10 transition-all duration-300 h-[54px]"
      >
        <img
          src={item.icon}
          loading="lazy"
          height={32}
          width={32}
          className="rounded-md"
        />
        <span className="font-medium">{item.readableName}</span>
      </Link>
    )
  }

  if (variant === "hover") {
    return (
      <Link
        key={item.readableName}
        to={`/item/${item.id}`}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors group"
      >
        <img
          src={item.icon}
          height={32}
          width={32}
          loading="lazy"
          className="transform transition-transform group-hover:scale-110"
        />
        <span className="group-hover:text-color-link transition-colors">
          {item.readableName}
        </span>
      </Link>
    )
  }

  return (
    <Link
      key={item.readableName}
      to={`/item/${item.id}`}
      className={`text-color-link hover:underline flex items-center gap-3 text-nowrap min-w-max ${className}`}
    >
      {" "}
      <img src={`${item.icon}`} height={32} width={32} loading="lazy" />
      <span>{item.readableName}</span>
    </Link>
  )
}

export default ItemLink
