import { Card } from "@/components/ui/card"

const DataDisplay = ({ data }: { data: any }) => {
  const renderValue = (value: any, key = "") => {
    if (value === null || value === undefined) {
      return null
    }

    switch (typeof value) {
      case "object":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-col md:flex-row w-full gap-2">
              {value.map((item, index) => (
                <div
                  key={`${key}-${index}`}
                  className="flex w-full gap-4 p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-all duration-300"
                >
                  {typeof item === "object" ? (
                    renderValue(item)
                  ) : (
                    <span className="text-sm text-color-text-primary">
                      {item}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )
        }
        return (
          <div className="space-y-6 w-full">
            {Object.entries(value).map(([k, v]) => {
              return (
                <div key={k} className="rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 pb-4 border-b border-accent/10">
                      <h3 className="font-semibold text-lg text-color-text-primary">
                        {k}
                      </h3>
                    </div>
                    <div className="pl-2">{renderValue(v, k)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      case "string":
      case "number":
      case "boolean":
        if (key) {
          return (
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-all duration-300">
              <span className="text-sm font-medium text-color-text-secondary">
                {key}
              </span>
              <span className="text-sm text-color-text-primary">
                {String(value)}
              </span>
            </div>
          )
        }
        return (
          <span className="text-sm text-color-text-primary">
            {String(value)}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <Card className="bg-color-primary-bg border border-accent/10 hover:border-accent/20 transition-all duration-300">
      <div className="p-6 space-y-6">{renderValue(data)}</div>
    </Card>
  )
}

export default DataDisplay
