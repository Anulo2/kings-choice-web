"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useKnightsStore } from "@/lib/store"
import type { Knight } from "@/lib/types"

const formSchema = z.object({
  nome: z.string().min(2, { message: "Name must be at least 2 characters" }),
  livello: z.coerce.number().min(1, { message: "Level must be at least 1" }),
  rango: z.coerce.number().min(1).max(5, { message: "Rank must be between 1 and 5" }),
  forza: z.coerce.number().min(0, { message: "Strength must be a positive number" }),
  intelletto: z.coerce.number().min(0, { message: "Intellect must be a positive number" }),
  comando: z.coerce.number().min(0, { message: "Command must be a positive number" }),
  carisma: z.coerce.number().min(0, { message: "Charisma must be a positive number" }),
  potenza: z.coerce.number().min(0, { message: "Power must be a positive number" }),
})

interface KnightFormProps {
  onCancel: () => void
  onComplete: () => void
}

export function KnightForm({ onCancel, onComplete }: KnightFormProps) {
  const { addKnight } = useKnightsStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      livello: 1,
      rango: 1,
      forza: 0,
      intelletto: 0,
      comando: 0,
      carisma: 0,
      potenza: 0,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const attributi_totale = {
      forza: values.forza,
      intelletto: values.intelletto,
      comando: values.comando,
      carisma: values.carisma,
    }

    const attributi_totali = Object.values(attributi_totale).reduce((sum, val) => sum + val, 0)

    const newKnight: Knight = {
      nome: values.nome,
      andamento: [
        {
          livello: values.livello,
          rango: values.rango,
          attributi_base: {
            forza: null,
            intelletto: null,
            comando: null,
            carisma: null,
          },
          attributi_totale,
          attributi: {
            forza: Math.floor(values.forza * 0.9),
            intelletto: Math.floor(values.intelletto * 0.9),
            comando: Math.floor(values.comando * 0.9),
            carisma: Math.floor(values.carisma * 0.9),
          },
          buff_negoziazione: {
            forza: 625,
            intelletto: 625,
            comando: 250,
            carisma: 250,
          },
          bonus_libro: {
            forza: 0,
            intelletto: 0,
            comando: 0,
            carisma: 0,
          },
          attributi_totali,
          potenza: values.potenza,
          talenti_totali: 0,
          talenti: [],
        },
      ],
    }

    addKnight(newKnight)
    onComplete()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Knight Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter knight name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="livello"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rango"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rank</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rank) => (
                        <SelectItem key={rank} value={rank.toString()}>
                          Rank {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="forza"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strength</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intelletto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intellect</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="comando"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Command</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carisma"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Charisma</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="potenza"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Power</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Knight</Button>
        </div>
      </form>
    </Form>
  )
}

