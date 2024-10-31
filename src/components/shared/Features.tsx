import React from "react"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Button } from "../ui/button"

const Features = ({ itemsLength }: { itemsLength: number }) => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-4xl font-norse font-bold">
            About Valheim Helper
          </h2>
          <div className="grid grid-cols-2 mt-4">
            <div>
              <h3>Key features</h3>
              <ul>
                <li>{Math.floor(itemsLength / 100) * 100}+ items</li>
                <li>Continuously updated data</li>
                <li>Advanced resource calculations</li>
                <li>Fully customizable</li>
              </ul>
            </div>
            <div>
              <h3>Quick Start</h3>
              <ol>
                <li>Create an account</li>
                <li>Set your preferences</li>
                <li>Explore</li>
              </ol>
              <Button>Get Started</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div></div>
    </div>
  )
}

export default Features
