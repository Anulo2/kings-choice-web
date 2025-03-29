"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sword, Brain, CommandIcon, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/ui/image-upload"
import { AttributeProficiencyIcon } from "@/components/attribute-proficiency-icon"
import { cn } from "@/lib/utils"
import type { Knight } from "@/lib/types"

const formSchema = z.object({
  foto: z.string().optional(),
  attributiProficienti: z.array(z.enum(["forza", "intelletto", "comando", "carisma"])).min(1, {
    message: "Select at least one proficient attribute"
  })
})

type KnightProfileFormValues = z.infer<typeof formSchema>

interface KnightProfileEditProps {
  knight: Knight
  onSave: (values: { foto?: string; attributiProficienti: string[] }) => void
  onCancel: () => void
}

export function KnightProfileEdit({ knight, onSave, onCancel }: KnightProfileEditProps) {
  const form = useForm<KnightProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foto: knight.foto || "",
      attributiProficienti: knight.attributiProficienti || ["forza"]
    }
  })
  
  const attributeIcons = {
    forza: <Sword className="h-5 w-5" />,
    intelletto: <Brain className="h-5 w-5" />,
    comando: <CommandIcon className="h-5 w-5" />,
    carisma: <Heart className="h-5 w-5" />,
  }
  
  const attributeColors = {
    forza: "text-chart-1 bg-chart-1/20 border-chart-1/50",
    intelletto: "text-chart-2 bg-chart-2/20 border-chart-2/50",
    comando: "text-chart-3 bg-chart-3/20 border-chart-3/50",
    carisma: "text-chart-4 bg-chart-4/20 border-chart-4/50",
  }

  const onSubmit = (values: KnightProfileFormValues) => {
    onSave({
      foto: values.foto,
      attributiProficienti: values.attributiProficienti
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormField
              control={form.control}
              name="foto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Knight Image</FormLabel>
                  <div className="flex items-center justify-center">
                    <FormControl>
                      <ImageUpload 
                        value={field.value} 
                        onChange={field.onChange} 
                        maxSizeMB={1}
                      />
                    </FormControl>
                  </div>
                  <FormDescription className="text-center text-xs">
                    Upload an image (max 1MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="attributiProficienti"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel>Proficient Attributes</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {(["forza", "intelletto", "comando", "carisma"] as const).map((attr) => {
                        const isSelected = field.value.includes(attr);
                        return (
                          <div key={attr} className="space-y-1">
                            <FormItem
                              key={attr}
                              className="flex flex-row items-start space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    const updatedAttributes = checked
                                      ? [...field.value, attr]
                                      : field.value.filter(a => a !== attr);
                                    
                                    // Ensure at least one attribute is selected
                                    if (updatedAttributes.length === 0) {
                                      return;
                                    }
                                    
                                    field.onChange(updatedAttributes);
                                  }}
                                  id={`attribute-${attr}`}
                                />
                              </FormControl>
                              <div
                                className={cn(
                                  "flex flex-col items-center justify-center p-2 rounded-md border-2 w-full cursor-pointer transition-all",
                                  isSelected ? attributeColors[attr] : "border-muted bg-transparent"
                                )}
                                onClick={() => {
                                  const updatedAttributes = field.value.includes(attr)
                                    ? field.value.filter(a => a !== attr)
                                    : [...field.value, attr];
                                    
                                  // Ensure at least one attribute is selected
                                  if (updatedAttributes.length === 0) {
                                    return;
                                  }
                                  
                                  field.onChange(updatedAttributes);
                                }}
                              >
                                <span className={isSelected ? "" : "text-muted-foreground"}>
                                  {attributeIcons[attr]}
                                </span>
                                <span className={cn(
                                  "capitalize text-xs mt-1",
                                  isSelected ? "" : "text-muted-foreground"
                                )}>
                                  {attr}
                                </span>
                              </div>
                            </FormItem>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <FormDescription>
                    Select attributes the knight is proficient in (minimum 1)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attributiProficienti"
              render={({ field }) => (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                  <span>Preview:</span>
                  <AttributeProficiencyIcon attributes={field.value} />
                  {field.value.length === 4 && (
                    <span className="italic text-xs">(Master of all attributes)</span>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  )
}