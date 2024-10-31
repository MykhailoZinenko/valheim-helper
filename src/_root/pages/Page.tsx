import React, { useState } from "react"
import {
  Search,
  Settings,
  Database,
  Apple,
  Code,
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const Homepage = () => {
  const [showResourceResults, setShowResourceResults] = useState(false)
  const [showFoodResults, setShowFoodResults] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState("dark")
  const [selectedColor, setSelectedColor] = useState("blue")

  const randomQuote = {
    text: "Where must we go... we who wander this Wasteland in search of our better selves?",
    author: "Odin",
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">VIKING SURVIVAL ASSISTANT</h1>
        <p className="text-xl mb-8">
          Master Valheim with our comprehensive tools and guides
        </p>
        <div className="max-w-xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Quick Tools - Enhanced with results areas */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Resource Calculator
              </div>
              <button
                onClick={() => setShowResourceResults(!showResourceResults)}
                className="text-gray-400 hover:text-white"
              >
                {showResourceResults ? <ChevronUp /> : <ChevronDown />}
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-24 p-2 rounded bg-gray-600"
                  />
                  <select className="flex-1 p-2 rounded bg-gray-600">
                    <option>Wood</option>
                    <option>Stone</option>
                    <option>Iron</option>
                  </select>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">
                  Calculate
                </button>
              </div>

              {showResourceResults && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Results:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base materials:</span>
                      <span>120 Wood</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time to gather:</span>
                      <span>~5 minutes</span>
                    </div>
                  </div>
                </div>
              )}

              <a
                href="/calculator"
                className="text-sm text-blue-400 hover:text-blue-300 block text-center"
              >
                Open full calculator →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Similar enhanced structure for Food Calculator */}
        <Card className="bg-gray-800 border-gray-700">
          {/* ... Food calculator implementation ... */}
        </Card>
      </section>

      {/* Biome Slider */}
      <section className="relative h-96 bg-gray-800 rounded-lg overflow-hidden">
        {/* Your existing biome slider implementation */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button className="bg-black/50 p-2 rounded-full">←</button>
          <button className="bg-black/50 p-2 rounded-full">→</button>
        </div>
      </section>

      {/* Features/Explore */}
      {/* Enhanced Features/Explore Section */}
      <section className="space-y-6">
        {/* About App */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>About Valheim Helper</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Advanced resource calculators</li>
                  <li>Food combination optimizer</li>
                  <li>Interactive maps and guides</li>
                  <li>Build planner</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Quick Start</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Create your profile</li>
                  <li>Set your preferences</li>
                  <li>Start planning your builds</li>
                </ol>
                <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">
                  Get Started
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Customization */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Customize Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Theme</label>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded ${selectedTheme === "dark" ? "bg-blue-600" : "bg-gray-600"}`}
                      onClick={() => setSelectedTheme("dark")}
                    >
                      Dark
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${selectedTheme === "light" ? "bg-blue-600" : "bg-gray-600"}`}
                      onClick={() => setSelectedTheme("light")}
                    >
                      Light
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    {["blue", "green", "purple"].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full bg-${color}-600 ${selectedColor === color ? "ring-2 ring-white" : ""}`}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Preview</h3>
                <div
                  className={`p-4 rounded ${selectedTheme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
                >
                  <div
                    className={`h-8 w-full rounded bg-${selectedColor}-600 mb-2`}
                  ></div>
                  <div className="h-4 w-3/4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Explorer */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>API Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Quick Start</h3>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-mono">
                      GET /api/resources
                    </span>
                    <button className="text-gray-400 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    {`fetch('https://api.valheim-helper.com/resources', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})`}
                  </pre>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Response Preview</h3>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {`{
  "resources": [
    {
      "id": "wood",
      "name": "Wood",
      "baseTime": 2.5,
      "toolRequired": "axe"
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quote Section */}
      <section className="bg-gray-800 p-8 rounded-lg text-center border border-gray-700">
        <div className="max-w-2xl mx-auto">
          <p className="text-xl italic mb-4">"{randomQuote.text}"</p>
          <p className="text-gray-400">- {randomQuote.author}</p>
        </div>
      </section>
    </div>
  )
}

export default Homepage
