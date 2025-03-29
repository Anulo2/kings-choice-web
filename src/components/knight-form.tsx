"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useKnightsStore } from "@/lib/store"
import type { Knight, Talent } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"

const attributesSchema = z.object({
  forza: z.coerce.number().min(0, { message: "Must be a positive number" }),
  intelletto: z.coerce.number().min(0, { message: "Must be a positive number" }),
  comando: z.coerce.number().min(0, { message: "Must be a positive number" }),
  carisma: z.coerce.number().min(0, { message: "Must be a positive number" }),
})

const talentSchema = z.object({
  nome: z.string().min(1, { message: "Name is required" }),
  genere: z.string().min(1, { message: "Type is required" }),
  buff: z.coerce.number().min(0, { message: "Must be a positive number" }),
  livello: z.coerce.number().min(1, { message: "Level must be at least 1" }),
  stelle: z.coerce.number().min(1).max(5, { message: "Stars must be between 1 and 5" }),
})

const formSchema = z.object({
  nome: z.string().min(2, { message: "Name must be at least 2 characters" }),
  livello: z.coerce.number().min(1, { message: "Level must be at least 1" }),
  rango: z.coerce.number().min(1).max(5, { message: "Rank must be between 1 and 5" }),
  attributi_base: attributesSchema,
  attributi_totale: attributesSchema,
  buff_negoziazione: attributesSchema,
  bonus_libro: attributesSchema,
  bonus_amante: attributesSchema,
  buff_cavalcatura: z.coerce.number().min(0, { message: "Must be a positive number" }),
  potenza: z.coerce.number().min(0, { message: "Power must be a positive number" }),
})

interface KnightFormProps {
  onCancel: () => void
  onComplete: () => void
}

export function KnightForm({ onCancel, onComplete }: KnightFormProps) {
  const { addKnight } = useKnightsStore()
  const [talents, setTalents] = useState<Talent[]>([])
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      livello: 1,
      rango: 1,
      attributi_base: {
        forza: 0,
        intelletto: 0,
        comando: 0,
        carisma: 0,
      },
      attributi_totale: {
        forza: 0,
        intelletto: 0,
        comando: 0,
        carisma: 0,
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
      bonus_amante: {
        forza: 0,
        intelletto: 0,
        comando: 0,
        carisma: 0,
      },
      buff_cavalcatura: 0,
      potenza: 0,
    },
  })

  const talentForm = useForm<z.infer<typeof talentSchema>>({
    resolver: zodResolver(talentSchema),
    defaultValues: {
      nome: "",
      genere: "",
      buff: 0,
      livello: 1,
      stelle: 1,
    },
  })

  const addTalent = () => {
    const talentData = talentForm.getValues();
    
    if (!talentForm.formState.isValid) {
      talentForm.trigger();
      return;
    }
    
    setTalents([...talents, talentData]);
    talentForm.reset();
  }

  const removeTalent = (index: number) => {
    const newTalents = [...talents]
    newTalents.splice(index, 1)
    setTalents(newTalents)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate attributes based on the form data
    const attributi = {
      forza: Math.floor(values.attributi_totale.forza * 0.9),
      intelletto: Math.floor(values.attributi_totale.intelletto * 0.9),
      comando: Math.floor(values.attributi_totale.comando * 0.9),
      carisma: Math.floor(values.attributi_totale.carisma * 0.9),
    }

    const attributi_totali = Object.values(values.attributi_totale).reduce((sum, val) => sum + val, 0)
    const talenti_totali = talents.reduce((sum, talent) => sum + talent.buff, 0)

    const newKnight: Knight = {
      nome: values.nome,
      andamento: [
        {
          livello: values.livello,
          rango: values.rango,
          attributi_base: values.attributi_base,
          attributi_totale: values.attributi_totale,
          attributi,
          buff_negoziazione: values.buff_negoziazione,
          bonus_libro: values.bonus_libro,
          bonus_amante: values.bonus_amante,
          buff_cavalcatura: values.buff_cavalcatura,
          attributi_totali,
          potenza: values.potenza,
          talenti_totali,
          talenti: talents,
        },
      ],
    }

    addKnight(newKnight)
    onComplete()
  }

  const AttributesFields = ({ basePath }: { basePath: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <FormField
        control={form.control}
        name={`${basePath}.forza` as any}
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
        name={`${basePath}.intelletto` as any}
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

      <FormField
        control={form.control}
        name={`${basePath}.comando` as any}
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
        name={`${basePath}.carisma` as any}
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
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="talents">Talents</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <FormField
                    control={form.control}
                    name="buff_cavalcatura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mount Buff</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab("attributes")}>
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="attributes">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Base Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AttributesFields basePath="attributi_base" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Total Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AttributesFields basePath="attributi_totale" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Negotiation Buff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AttributesFields basePath="buff_negoziazione" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Book Bonus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AttributesFields basePath="bonus_libro" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lover Bonus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AttributesFields basePath="bonus_amante" />
                  </CardContent>
                </Card>

                <div className="flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Previous
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("talents")}>
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="talents">
              <Card>
                <CardHeader>
                  <CardTitle>Talents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Form {...talentForm}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={talentForm.control}
                            name="nome"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={talentForm.control}
                            name="genere"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="strength">Strength</SelectItem>
                                      <SelectItem value="intellect">Intellect</SelectItem>
                                      <SelectItem value="command">Command</SelectItem>
                                      <SelectItem value="charisma">Charisma</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={talentForm.control}
                            name="buff"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Buff Value</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={talentForm.control}
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
                            control={talentForm.control}
                            name="stelle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stars</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                    value={field.value.toString()}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Stars" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5].map((stars) => (
                                        <SelectItem key={stars} value={stars.toString()}>
                                          {stars} ⭐
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

                        <Button 
                          type="button" 
                          onClick={addTalent} 
                          className="flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span>Add Talent</span>
                        </Button>
                      </div>
                    </Form>
                  </div>

                  {talents.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-accent/50">
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Type</th>
                            <th className="p-2 text-left">Level</th>
                            <th className="p-2 text-left">Stars</th>
                            <th className="p-2 text-left">Buff</th>
                            <th className="p-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {talents.map((talent, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2">{talent.nome}</td>
                              <td className="p-2">{talent.genere}</td>
                              <td className="p-2">{talent.livello}</td>
                              <td className="p-2">{"⭐".repeat(talent.stelle)}</td>
                              <td className="p-2">{talent.buff}</td>
                              <td className="p-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTalent(index)}
                                  className="h-8 w-8 p-0 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No talents added yet</p>
                    </div>
                  )}

                  <div className="flex justify-between gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("attributes")}>
                      Previous
                    </Button>
                    <Button type="submit">Create Knight</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

