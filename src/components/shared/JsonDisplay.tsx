import { ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

const JsonDisplay = ({ data }: { data: any }) => {
  const renderValue = (value: any, key = "", depth = 0) => {
    if (value === null) return <span className="text-gray-500">null</span>
    if (value === undefined)
      return <span className="text-gray-500">undefined</span>

    switch (typeof value) {
      case "object":
        if (Array.isArray(value)) {
          return (
            <details className="group" open={depth < 2}>
              <summary className="flex items-center gap-2 cursor-pointer list-none">
                <ChevronRight className="w-4 h-4 text-accent/60 transition-transform group-open:rotate-90" />
                <span className="font-medium text-accent">
                  Array [{value.length}]
                </span>
              </summary>
              <div className="pl-4 ml-2 border-l border-accent/10">
                {value.map((item, index) => (
                  <div key={`${key}-${index}`} className="py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{index}:</span>
                      {renderValue(item, `${key}-${index}`, depth + 1)}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )
        }
        return (
          <details className="group" open={depth < 2}>
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <ChevronRight className="w-4 h-4 text-accent/60 transition-transform group-open:rotate-90" />
              <span className="font-medium text-accent">
                Object {key && `(${key})`}
              </span>
            </summary>
            <div className="pl-4 ml-2 border-l border-accent/10">
              {Object.entries(value).map(([k, v]) => (
                <div key={`${key}-${k}`} className="py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{k}:</span>
                    {renderValue(v, k, depth + 1)}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )
      case "string":
        return <span className="text-green-500">"{value}"</span>
      case "number":
        return <span className="text-blue-500">{value}</span>
      case "boolean":
        return <span className="text-purple-500">{value.toString()}</span>
      default:
        return <span>{String(value)}</span>
    }
  }

  return (
    <Card className="w-full p-4 bg-color-primary-bg border-accent/10 hover:border-accent/20 transition-all duration-300">
      <div className="font-mono text-sm space-y-2 overflow-auto">
        {renderValue(data)}
      </div>
    </Card>
  )
}

export default JsonDisplay
