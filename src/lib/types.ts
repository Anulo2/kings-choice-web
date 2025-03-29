export interface Knight {
    nome: string
    andamento: KnightProgress[]
  }
  
  export interface KnightProgress {
    livello: number
    rango: number
    attributi_base: {
      forza: number | null
      intelletto: number | null
      comando: number | null
      carisma: number | null
    }
    attributi_totale: {
      forza: number
      intelletto: number
      comando: number
      carisma: number
    }
    attributi: {
      forza: number
      intelletto: number
      comando: number
      carisma: number
    }
    buff_negoziazione: {
      forza: number
      intelletto: number
      comando: number
      carisma: number
    }
    bonus_libro: {
      forza: number
      intelletto: number
      comando: number
      carisma: number
    }
    bonus_amante: {
      forza: number
      intelletto: number
      comando: number
      carisma: number
    }
    buff_cavalcatura: number
    attributi_totali: number
    potenza: number
    talenti_totali: number
    talenti: Talent[]
  }
  
  export interface Talent {
    nome: string
    genere: string
    buff: number
    livello: number
    stelle: number
  }
