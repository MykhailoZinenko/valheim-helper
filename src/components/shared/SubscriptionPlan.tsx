import { Star, Crown } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

const SubscriptionPlan = ({ plan = "basic" }) => {
  const isPro = plan.toLowerCase() === "pro"

  return (
    <div className="flex items-center gap-2 py-1.5">
      {isPro ? (
        <Crown className="h-4 w-4 text-yellow-500" />
      ) : (
        <Star className="h-4 w-4 text-accent" />
      )}
      <span
        className={`text-sm ${isPro ? "text-yellow-500" : "text-color-text-primary"}`}
      >
        {isPro ? "Pro Plan" : "Basic Plan"}
      </span>
      <Link to={"/settings"} className="ml-auto">
        <Button
          size="sm"
          className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover"
        >
          {isPro ? "Manage" : "Upgrade"}
        </Button>
      </Link>
    </div>
  )
}

export default SubscriptionPlan
