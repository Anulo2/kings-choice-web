// Definizioni dei tipi
export interface AttributeBonus {
  strength: number;
  intelligence: number;
  command: number;
  charisma: number;
}

export type AttributeType = 'Forza' | 'Intelligenza' | 'Comando' | 'Carisma';

export interface Talent {
  name: string;
  upgradeCost: number;
  level: number;
  stars: number;
  type: AttributeType;
}

export interface Ability {
  name: string;
  upgradeCost: number;
  level: number;
}

export interface CharacterPoint {
  level: number;
  upgradeCost: number;
  baseAttributes: AttributeBonus;
  bookBonus: AttributeBonus;
  loverBonus: AttributeBonus;
  talents: Talent[];
  abilities: Ability[];
  totalAttributes: number;
  power: number;
}

export interface CharacterData {
  name: string;
  stars: number;
  proficiency: string[];
  points: CharacterPoint[];
}

export interface UpgradeCosts {
  levelUpgrade: number;
  totalSilver: number;
  talentUpgrades: {
    name: string;
    type: string;
    stars: number;
    currentLevel: number;
    targetLevel: number;
    cost: number;
  }[];
  abilityUpgrades: {
    name: string;
    currentLevel: number;
    targetLevel: number;
    cost: number;
  }[];
  totalExp: number;
  totalAbilityPoints: number;
}

export interface PowerCalculation {
  baseValue: number;
  fromStrengthAttribute: number;
  fromStrengthTalents: number;
  total: number;
}

export interface ProjectedStats {
  level: number;
  upgradeCost: number;
  attributes: AttributeBonus;
  totalAttributes: number;
  power: number;
}

/**
 * Calcola il costo di aggiornamento del livello
 */
export function calculateLevelUpgradeCostGrowthRate(points: CharacterPoint[]): number {
  if (points.length < 2) {
    return 1.5; // Tasso di crescita predefinito se non ci sono abbastanza dati
  }

  // Calcola il tasso di crescita medio
  let totalGrowth = 0;
  for (let i = 1; i < points.length; i++) {
    const currentCost = points[i].upgradeCost;
    const previousCost = points[i-1].upgradeCost;
    totalGrowth += currentCost / previousCost;
  }
  
  return totalGrowth / (points.length - 1);
}

/**
 * Predice il costo di aggiornamento per un livello specifico
 */
export function predictLevelUpgradeCost(
  level: number, 
  growthRate: number, 
  points: CharacterPoint[]
): number {
  // Trova il livello più alto nei nostri dati
  const highestDataPoint = points.reduce(
    (max, point) => point.level > max.level ? point : max,
    points[0]
  );

  // Predizione basata sul costo del livello più alto
  return Math.round(highestDataPoint.upgradeCost * growthRate ** (level - highestDataPoint.level));
}

/**
 * Calcola i costi dettagliati di aggiornamento per raggiungere un livello target
 */
export function calculateUpgradeCosts(
  currentLevel: number,
  targetLevel: number,
  character: CharacterData
): UpgradeCosts {
  if (targetLevel <= currentLevel) {
    throw new Error("Il livello target deve essere maggiore del livello attuale");
  }

  // Trova i dati del punto attuale
  const currentPoint = character.points.find(p => p.level === currentLevel);
  if (!currentPoint) {
    throw new Error(`Dati per il livello attuale ${currentLevel} non trovati`);
  }

  // Predici i costi per i livelli futuri in base al modello di crescita
  let totalSilver = 0;
  const levelCosts: number[] = [];

  // Calcola il tasso di crescita per i costi di aggiornamento
  const growthRate = calculateLevelUpgradeCostGrowthRate(character.points);

  // Calcola i costi di aggiornamento del livello
  for (let level = currentLevel; level < targetLevel; level++) {
    const pointData = character.points.find(p => p.level === level);
    
    if (pointData) {
      // Usa il costo effettivo se disponibile
      levelCosts.push(pointData.upgradeCost);
      totalSilver += pointData.upgradeCost;
    } else {
      // Predice il costo in base al modello di crescita
      const predictedCost = predictLevelUpgradeCost(level, growthRate, character.points);
      levelCosts.push(predictedCost);
      totalSilver += predictedCost;
    }
  }

  // Calcola i costi di aggiornamento del talento
  const talentUpgrades = currentPoint.talents.map(talent => {
    const currentTalentLevel = talent.level;
    const targetTalentLevel = currentTalentLevel + 1; // Ipotizzando un aggiornamento di livello per talento
    
    // Il costo del talento aumenta con le stelle e il livello
    const costMultiplier = 1 + (currentTalentLevel * 0.2); // Aumento del 20% per livello
    const talentCost = Math.round(talent.upgradeCost * costMultiplier);
    
    return {
      name: talent.name,
      type: talent.type,
      stars: talent.stars,
      currentLevel: currentTalentLevel,
      targetLevel: targetTalentLevel,
      cost: talentCost
    };
  });

  // Calcola i costi di aggiornamento delle abilità
  const abilityUpgrades = currentPoint.abilities.map(ability => {
    const currentAbilityLevel = ability.level;
    const targetAbilityLevel = currentAbilityLevel + 1; // Ipotizzando un aggiornamento di livello per abilità
    
    // Il costo dell'abilità aumenta con il livello
    const costMultiplier = 1 + (currentAbilityLevel * 0.1); // Aumento del 10% per livello
    const abilityCost = Math.round(ability.upgradeCost * costMultiplier);
    
    return {
      name: ability.name,
      currentLevel: currentAbilityLevel,
      targetLevel: targetAbilityLevel,
      cost: abilityCost
    };
  });

  const totalExp = talentUpgrades.reduce((sum, upgrade) => sum + upgrade.cost, 0);
  const totalAbilityPoints = abilityUpgrades.reduce((sum, upgrade) => sum + upgrade.cost, 0);

  return {
    levelUpgrade: targetLevel - currentLevel,
    totalSilver,
    talentUpgrades,
    abilityUpgrades,
    totalExp,
    totalAbilityPoints
  };
}

/**
 * Calcola gli attributi totali di un personaggio
 * Attributi totali = Somma di tutti gli attributi base + bonus libro + bonus amante
 */
export function calculateTotalAttributes(point: CharacterPoint): number {
  // Somma attributi base
  const baseTotal = 
    point.baseAttributes.strength +
    point.baseAttributes.intelligence +
    point.baseAttributes.command +
    point.baseAttributes.charisma;
  
  // Somma bonus libro
  const bookTotal = 
    point.bookBonus.strength +
    point.bookBonus.intelligence +
    point.bookBonus.command +
    point.bookBonus.charisma;
  
  // Somma bonus amante
  const loverTotal = 
    point.loverBonus.strength +
    point.loverBonus.intelligence +
    point.loverBonus.command +
    point.loverBonus.charisma;
  
  // Ritorna la somma di tutti gli attributi
  return baseTotal + bookTotal + loverTotal;
}

/**
 * Calcola la potenza del cavaliere con dettaglio
 * Secondo la formula:
 * Potenza = 0
 * Per talento in talenti di tipo forza:
 *     potenza += Stelle talento * livello talento * 10
 * potenza += attributo base di forza
 */
export function calculatePower(
  strengthAttribute: number, 
  talents: Talent[]
): PowerCalculation {
  // Filtra i talenti di tipo "Forza"
  const strengthTalents = talents.filter(talent => talent.type === "Forza");

  // Calcola il contributo dei talenti: somma(stelle * livello * 10)
  const fromStrengthTalents = strengthTalents.reduce(
    (sum, talent) => sum + (talent.stars * talent.level * 10), 
    0
  );

  // Contributo dall'attributo forza
  const fromStrengthAttribute = strengthAttribute;
  
  // Calcolo totale della potenza
  const total = fromStrengthTalents + fromStrengthAttribute;

  return {
    baseValue: 0,
    fromStrengthAttribute,
    fromStrengthTalents,
    total: Math.round(total)
  };
}

/**
 * Proietta le statistiche del personaggio per i livelli futuri
 */
export function projectCharacterStats(
  character: CharacterData, 
  targetLevel: number
): ProjectedStats[] {
  const projections: ProjectedStats[] = [];
  
  // Trova il livello più alto nei nostri dati
  const highestDataPoint = character.points.reduce(
    (max, point) => point.level > max.level ? point : max,
    character.points[0]
  );
  
  // Calcola la crescita media degli attributi per livello
  const lastPoint = highestDataPoint;
  const firstPoint = character.points[0];
  const levelDiff = lastPoint.level - firstPoint.level;
  
  if (levelDiff <= 0) {
    throw new Error("Non ci sono abbastanza punti dati per calcolare il tasso di crescita");
  }
  
  const attributeGrowthRates = {
    strength: (lastPoint.baseAttributes.strength - firstPoint.baseAttributes.strength) / levelDiff,
    intelligence: (lastPoint.baseAttributes.intelligence - firstPoint.baseAttributes.intelligence) / levelDiff,
    command: (lastPoint.baseAttributes.command - firstPoint.baseAttributes.command) / levelDiff,
    charisma: (lastPoint.baseAttributes.charisma - firstPoint.baseAttributes.charisma) / levelDiff
  };
  
  // Calcola il tasso di crescita dei costi di aggiornamento
  const costGrowthRate = calculateLevelUpgradeCostGrowthRate(character.points);

  // Genera proiezioni
  for (let level = highestDataPoint.level + 1; level <= targetLevel; level++) {
    // Proietta i valori degli attributi
    const projectedAttributes = {
      strength: Math.round(lastPoint.baseAttributes.strength + attributeGrowthRates.strength * (level - lastPoint.level)),
      intelligence: Math.round(lastPoint.baseAttributes.intelligence + attributeGrowthRates.intelligence * (level - lastPoint.level)),
      command: Math.round(lastPoint.baseAttributes.command + attributeGrowthRates.command * (level - lastPoint.level)),
      charisma: Math.round(lastPoint.baseAttributes.charisma + attributeGrowthRates.charisma * (level - lastPoint.level))
    };
    
    // Supponi che i bonus del libro e dell'amante rimangano costanti
    const projectedPoint: CharacterPoint = {
      level,
      upgradeCost: 0, // Verrà impostato in seguito
      baseAttributes: projectedAttributes,
      bookBonus: lastPoint.bookBonus,
      loverBonus: lastPoint.loverBonus,
      talents: lastPoint.talents,
      abilities: lastPoint.abilities,
      totalAttributes: 0, // Verrà calcolato in seguito
      power: 0 // Verrà calcolato in seguito
    };
    
    // Calcola gli attributi totali usando la nostra nuova funzione
    const totalAttributes = calculateTotalAttributes(projectedPoint);
    
    // Proietta il costo di aggiornamento
    const upgradeCost = predictLevelUpgradeCost(level - 1, costGrowthRate, character.points);
    
    // Calcola la potenza usando la nuova formula
    const powerCalc = calculatePower(projectedAttributes.strength, lastPoint.talents);
    
    projections.push({
      level,
      upgradeCost,
      attributes: projectedAttributes,
      totalAttributes,
      power: powerCalc.total
    });
  }
  
  return projections;
}

/**
 * Genera un piano di aggiornamento per raggiungere un livello target
 */
export function generateUpgradePlan(
  character: CharacterData,
  currentLevel: number,
  targetLevel: number
): {
  currentStats: {
    level: number;
    power: number;
    attributes: AttributeBonus;
  };
  targetStats: {
    level: number;
    power: number;
    attributes: AttributeBonus;
  };
  upgradeCosts: UpgradeCosts;
  projectedStats: ProjectedStats[];
  recommendations: string[];
} {
  // Trova le statistiche attuali e target
  const currentPoint = character.points.find(p => p.level === currentLevel);
  if (!currentPoint) {
    throw new Error(`Dati per il livello attuale ${currentLevel} non trovati`);
  }

  // Calcola i costi di aggiornamento
  const upgradeCosts = calculateUpgradeCosts(currentLevel, targetLevel, character);
  
  // Genera proiezioni
  const projectedStats = projectCharacterStats(character, targetLevel);
  
  // Le statistiche target sono tratte dai dati effettivi o dalle proiezioni
  const targetPointData = character.points.find(p => p.level === targetLevel);
  const targetPoint = targetPointData || projectedStats[projectedStats.length - 1];
  
  // Genera consigli
  const recommendations: string[] = [];
  
  // Consiglia su quale attributo concentrarsi
  const proficientAttributes = character.proficiency.map(p => p.toLowerCase());
  
  // Gestisci il calcolo degli attributi in base all'utilizzo di dati effettivi o di proiezione
  const targetAttributes = targetPointData ? targetPointData.baseAttributes : (projectedStats[projectedStats.length - 1].attributes);
  
  const attributeGains: {name: string; projected: number}[] = [
    {name: "strength", projected: targetAttributes.strength - currentPoint.baseAttributes.strength},
    {name: "intelligence", projected: targetAttributes.intelligence - currentPoint.baseAttributes.intelligence},
    {name: "command", projected: targetAttributes.command - currentPoint.baseAttributes.command},
    {name: "charisma", projected: targetAttributes.charisma - currentPoint.baseAttributes.charisma}
  ];
  
  // Ordina gli attributi per guadagno proiettato e proficienza
  attributeGains.sort((a, b) => {
    // Prima dai priorità agli attributi proficienti
    const aProficient = proficientAttributes.includes(a.name);
    const bProficient = proficientAttributes.includes(b.name);
    
    if (aProficient && !bProficient) return -1;
    if (!aProficient && bProficient) return 1;
    
    // Poi ordina per guadagno proiettato
    return b.projected - a.projected;
  });
  
  recommendations.push(`Concentrati su ${attributeGains[0].name} per i migliori incrementi di potenza (previsto +${attributeGains[0].projected} punti)`);
  
  // Consiglia aggiornamenti dei talenti
  const talentsByPriority = upgradeCosts.talentUpgrades
    .sort((a, b) => {
      // Dai priorità in base alle stelle, poi alla proficienza dell'attributo
      if (a.stars !== b.stars) return b.stars - a.stars;
      
      const aTypeProficient = proficientAttributes.includes(a.type.toLowerCase());
      const bTypeProficient = proficientAttributes.includes(b.type.toLowerCase());
      
      if (aTypeProficient && !bTypeProficient) return -1;
      if (!aTypeProficient && bTypeProficient) return 1;
      
      return a.cost - b.cost; // Se tutto è uguale, dai priorità al costo inferiore
    });
  
  if (talentsByPriority.length > 0) {
    recommendations.push(`Dai priorità all'aggiornamento del talento ${talentsByPriority[0].name} (${talentsByPriority[0].stars}★)`);
  }
  
  // Riporta le risorse totali necessarie
  recommendations.push(`Risorse totali necessarie: ${upgradeCosts.totalSilver} argento, ${upgradeCosts.totalExp} exp talento, ${upgradeCosts.totalAbilityPoints} punti abilità`);
  
  return {
    currentStats: {
      level: currentPoint.level,
      power: currentPoint.power,
      attributes: currentPoint.baseAttributes
    },
    targetStats: {
      level: targetPoint.level,
      power: targetPoint.power,
      attributes: targetPointData ? (targetPoint as CharacterPoint).baseAttributes : (targetPoint as ProjectedStats).attributes
    },
    upgradeCosts,
    projectedStats,
    recommendations
  };
}