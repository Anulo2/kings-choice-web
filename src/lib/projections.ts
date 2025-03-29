import type { Knight } from "./types"

export interface Projection {
  name: string
  level: number
  power: number
  forza: number
  intelletto: number
  comando: number
  carisma: number
  totalAttributes: number
  isProjection: boolean
}

export function calculateProjections(knight: Knight, numProjections = 5): Projection[] {
  const progressHistory = knight.andamento

  if (progressHistory.length < 2) {
    // Not enough data for projections
    return []
  }

  // Calculate average growth rates
  const growthRates = {
    livello: 0,
    forza: 0,
    intelletto: 0,
    comando: 0,
    carisma: 0,
    potenza: 0,
  }

  let totalEntries = 0

  // Calculate growth rates from historical data
  for (let i = 1; i < progressHistory.length; i++) {
    const current = progressHistory[i]
    const previous = progressHistory[i - 1]

    growthRates.livello += current.livello - previous.livello
    growthRates.forza += current.attributi_totale.forza - previous.attributi_totale.forza
    growthRates.intelletto += current.attributi_totale.intelletto - previous.attributi_totale.intelletto
    growthRates.comando += current.attributi_totale.comando - previous.attributi_totale.comando
    growthRates.carisma += current.attributi_totale.carisma - previous.attributi_totale.carisma
    growthRates.potenza += current.potenza - previous.potenza

    totalEntries++
  }

  // Calculate average growth rates
  if (totalEntries > 0) {
    growthRates.livello /= totalEntries
    growthRates.forza /= totalEntries
    growthRates.intelletto /= totalEntries
    growthRates.comando /= totalEntries
    growthRates.carisma /= totalEntries
    growthRates.potenza /= totalEntries
  } else {
    // Default growth rates if we can't calculate from history
    growthRates.livello = 1
    growthRates.forza = progressHistory[0].attributi_totale.forza * 0.05
    growthRates.intelletto = progressHistory[0].attributi_totale.intelletto * 0.05
    growthRates.comando = progressHistory[0].attributi_totale.comando * 0.05
    growthRates.carisma = progressHistory[0].attributi_totale.carisma * 0.05
    growthRates.potenza = progressHistory[0].potenza * 0.05
  }

  // Generate projections
  const projections = []
  const latestProgress = progressHistory[progressHistory.length - 1]

  for (let i = 1; i <= numProjections; i++) {
    const projectedLevel = Math.round(latestProgress.livello + growthRates.livello * i)
    const projectedForza = Math.round(latestProgress.attributi_totale.forza + growthRates.forza * i)
    const projectedIntelletto = Math.round(latestProgress.attributi_totale.intelletto + growthRates.intelletto * i)
    const projectedComando = Math.round(latestProgress.attributi_totale.comando + growthRates.comando * i)
    const projectedCarisma = Math.round(latestProgress.attributi_totale.carisma + growthRates.carisma * i)
    const projectedPower = Math.round(latestProgress.potenza + growthRates.potenza * i)

    const totalAttributes = projectedForza + projectedIntelletto + projectedComando + projectedCarisma

    projections.push({
      name: `Projection ${i}`,
      level: projectedLevel,
      power: projectedPower,
      forza: projectedForza,
      intelletto: projectedIntelletto,
      comando: projectedComando,
      carisma: projectedCarisma,
      totalAttributes: totalAttributes,
      isProjection: true,
    })
  }

  return projections
}

