import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useGetItemByIdMutation } from "@/lib/react-query/queriesAndMutations"

import { AddResourceValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

const ResourceCalculator = () => {
  const [items, setItems] = useState([])
  const [resources, setResources] = useState({})

  const { mutateAsync: getItemById } = useGetItemByIdMutation()

  // 1. Define your form.
  const form = useForm<z.infer<typeof AddResourceValidation>>({
    resolver: zodResolver(AddResourceValidation),
    defaultValues: {
      id: "",
    },
  })

  // 2. Define a submit handler.
  // Submit handler.
  async function onSubmit(values: z.infer<typeof AddResourceValidation>) {
    const item = await getItemById(values.id)

    console.log("before", items, item)
    const existingItem = items.find(
      (resource) => resource.item.id === item.item.id
    )

    setItems((prevResources) => {
      if (existingItem) {
        return prevResources.map((resource) => {
          console.log("ids", resource.item.id, item.id)
          if (resource.item.id === item.item.id) {
            console.log("match", resource)
            return { ...resource, amount: resource.amount + 1 }
          }

          return resource
        })
      } else {
        return [...prevResources, { item: { ...item.item }, amount: 1 }]
      }
    })

    setResources((prevResources) => {
      console.log(item.recipe)

      for (let key in item.recipe.materials) {
        console.log(prevResources[key], item.recipe.materials[key])
        prevResources[key] =
          (prevResources[key] ?? 0) + item.recipe.materials[key]
      }

      console.log(prevResources)

      return prevResources
    })

    console.log(items)
  }

  return (
    <div className="h-full grid grid-cols-3">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button size="icon" type="submit">
              <PlusIcon />
            </Button>
          </form>
        </Form>
      </div>
      <div>
        {items.map((resource: any) => (
          <li key={resource.item.id}>
            <img src={resource.item.icon} />{" "}
            <Link to={`/item/${resource.item.id}`}>{resource.item.id}</Link>{" "}
            {" " + resource.amount}
          </li>
        ))}
      </div>
      <div></div>
    </div>
  )
}

export default ResourceCalculator
