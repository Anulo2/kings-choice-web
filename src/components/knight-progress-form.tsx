"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Knight, KnightProgress, Talent } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"

const formSchema = z.object({
  livello: z.coerce.number().min(1, { message: "Level must be at least 1" }),
  rango: z.coerce.number().min(1).max(5, { message: "Rank must be between 1 and 5" }),
  forza: z.coerce.number().min(0, { message: "Strength must be a positive number" }),
  intelletto: z.coerce.number().min(0, { message: "Intellect must be a positive number" }),
  comando: z.coerce.number().min(0, { message: "Command must be a positive number" }),
  carisma: z.coerce.number().min(0, { message: "Charisma must be a positive number" }),
  potenza: z.coerce.number().min(0, { message: "Power must be a positive number" }),
})

interface KnightProgressFormProps {
  knight: Knight
  onSave: (progress: KnightProgress) => void
  onCancel: () => void
}

export function KnightProgressForm({ knight, onSave, onCancel }: KnightProgressFormProps) {
  const latestProgress = knight.andamento[knight.andamento.length - 1]
  const [talents, setTalents] = useState<Talent[]>([...latestProgress.talenti])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      livello: latestProgress.livello + 1,
      rango: latestProgress.rango,
      forza: latestProgress.attributi_totale.forza,
      intelletto: latestProgress.attributi_totale.intelletto,
      comando: latestProgress.attributi_totale.comando,
      carisma: latestProgress.attributi_totale.carisma,
      potenza: latestProgress.potenza,
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

    const newProgress: KnightProgress = {
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
        forza: latestProgress.bonus_libro.forza,
        intelletto: latestProgress.bonus_libro.intelletto,
        comando: latestProgress.bonus_libro.comando,
        carisma: latestProgress.bonus_libro.carisma,
      },
      attributi_totali,
      potenza: values.potenza,
      talenti_totali: talents.length,
      talenti: talents,
      bonus_amante: {
        forza: 0,
        intelletto: 0,
        comando: 0,
        carisma: 0
      },
      buff_cavalcatura: 0
    }

    onSave(newProgress)
  }

  const [showTalentForm, setShowTalentForm] = useState(false)
  const [newTalent, setNewTalent] = useState<Partial<Talent>>({
    nome: "",
    genere: "forza",
    buff: 0,
    livello: 1,
    stelle: 1,
  })

  const addTalent = () => {
    if (
      newTalent.nome &&
      newTalent.genere &&
      typeof newTalent.buff === "number" &&
      typeof newTalent.livello === "number" &&
      typeof newTalent.stelle === "number"
    ) {
      setTalents([...talents, newTalent as Talent])
      setNewTalent({
        nome: "",
        genere: "forza",
        buff: 0,
        livello: 1,
        stelle: 1,
      })
      setShowTalentForm(false)
    }
  }

  const removeTalent = (index: number) => {
    setTalents(talents.filter((_, i) => i !== index))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Talents</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTalentForm(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Talent</span>
            </Button>
          </div>

          {showTalentForm && (
            <Card className="p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={newTalent.nome}
                    onChange={(e) => setNewTalent({ ...newTalent, nome: e.target.value })}
                    placeholder="Talent name"
                  />
                </div>

                <div>
                  <FormLabel>Type</FormLabel>
                  <Select
                    value={newTalent.genere}
                    onValueChange={(value) => setNewTalent({ ...newTalent, genere: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forza">Strength</SelectItem>
                      <SelectItem value="intelletto">Intellect</SelectItem>
                      <SelectItem value="comando">Command</SelectItem>
                      <SelectItem value="carisma">Charisma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <FormLabel>Buff (%)</FormLabel>
                  <Input
                    type="number"
                    value={newTalent.buff}
                    onChange={(e) => setNewTalent({ ...newTalent, buff: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <FormLabel>Level</FormLabel>
                  <Input
                    type="number"
                    value={newTalent.livello}
                    onChange={(e) => setNewTalent({ ...newTalent, livello: Number.parseInt(e.target.value) || 1 })}
                    min={1}
                    max={10}
                  />
                </div>

                <div>
                  <FormLabel>Stars</FormLabel>
                  <Select
                    value={newTalent.stelle?.toString()}
                    onValueChange={(value) => setNewTalent({ ...newTalent, stelle: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stars" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <SelectItem key={stars} value={stars.toString()}>
                          {stars} {stars === 1 ? "Star" : "Stars"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowTalentForm(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={addTalent}>
                  Add
                </Button>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            {talents.map((talent, index) => (
              <div key={talent.nome} className="flex items-center justify-between p-3 bg-slate-800 rounded-md">
                <div>
                  <span className="font-medium">{talent.nome}</span>
                  <div className="text-xs text-slate-400">
                    <span className="capitalize">{talent.genere}</span> \u2022<span> +{talent.buff}% \u2022 </span>
                    <span>Level {talent.livello} \u2022 </span>
                    <span>
                      {talent.stelle} {talent.stelle === 1 ? "Star" : "Stars"}
                    </span>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeTalent(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}

            {talents.length === 0 && (
              <div className="text-center py-4 text-slate-400">
                <p>No talents added yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Progress</Button>
        </div>
      </form>
    </Form>
  )
}

