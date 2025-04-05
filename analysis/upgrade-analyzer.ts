// Type definitions
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
  fromLevel: number;
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

// Constants for calculations
const BASE_POWER_FACTOR = 80; // Power increase per level observed in data
const ATTRIBUTE_GROWTH_PER_LEVEL = 1.5; // Average attribute growth per level

/**
 * Calculate the growth rate of level upgrade costs
 */
export function calculateLevelUpgradeCostGrowthRate(points: CharacterPoint[]): number {
  if (points.length < 2) {
    return 1.5; // Default growth rate if not enough data
  }

  // Calculate average growth rate
  let totalGrowth = 0;
  for (let i = 1; i < points.length; i++) {
    const currentCost = points[i].upgradeCost;
    const previousCost = points[i-1].upgradeCost;
    totalGrowth += currentCost / previousCost;
  }
  
  return totalGrowth / (points.length - 1);
}

/**
 * Predict level upgrade cost for a specific level
 */
export function predictLevelUpgradeCost(
  level: number, 
  growthRate: number, 
  points: CharacterPoint[]
): number {
  // Find the highest level in our data
  const highestDataPoint = points.reduce(
    (max, point) => point.level > max.level ? point : max,
    points[0]
  );

  // Base prediction on the highest level's cost
  return Math.round(highestDataPoint.upgradeCost * Math.pow(growthRate, level - highestDataPoint.level));
}

/**
 * Calculate detailed upgrade costs for reaching a target level
 */
export function calculateUpgradeCosts(
  currentLevel: number,
  targetLevel: number,
  character: CharacterData
): UpgradeCosts {
  if (targetLevel <= currentLevel) {
    throw new Error("Target level must be greater than current level");
  }

  // Find the current point data
  const currentPoint = character.points.find(p => p.level === currentLevel);
  if (!currentPoint) {
    throw new Error(`Data for current level ${currentLevel} not found`);
  }

  // Predict costs for future levels based on growth pattern
  let totalSilver = 0;
  const levelCosts: number[] = [];

  // Calculate growth rate for level upgrade costs
  const growthRate = calculateLevelUpgradeCostGrowthRate(character.points);

  // Calculate level upgrade costs
  for (let level = currentLevel; level < targetLevel; level++) {
    const pointData = character.points.find(p => p.level === level);
    
    if (pointData) {
      // Use actual cost if available
      levelCosts.push(pointData.upgradeCost);
      totalSilver += pointData.upgradeCost;
    } else {
      // Predict cost based on growth pattern
      const predictedCost = predictLevelUpgradeCost(level, growthRate, character.points);
      levelCosts.push(predictedCost);
      totalSilver += predictedCost;
    }
  }

  // Calculate talent upgrade costs
  const talentUpgrades = currentPoint.talents.map(talent => {
    const currentTalentLevel = talent.level;
    const targetTalentLevel = currentTalentLevel + 1; // Assuming one level upgrade per talent
    
    // Talent cost increases with stars and level
    const costMultiplier = 1 + (currentTalentLevel * 0.2); // 20% increase per level
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

  // Calculate ability upgrade costs
  const abilityUpgrades = currentPoint.abilities.map(ability => {
    const currentAbilityLevel = ability.level;
    const targetAbilityLevel = currentAbilityLevel + 1; // Assuming one level upgrade per ability
    
    // Ability cost increases with level
    const costMultiplier = 1 + (currentAbilityLevel * 0.1); // 10% increase per level
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
 * Calculate character power with detailed breakdown
 * According to tracking.md: "Potenza Cavaliere: La Potenza del Cavaliere è composta da Livello Cavaliere, Talento Forza e Attributi Forza"
 */
export function calculatePower(
  level: number, 
  strengthAttribute: number, 
  talents: Talent[]
): PowerCalculation {
  // Filter talents that are of type "Forza"
  const strengthTalents = talents.filter(talent => talent.type === "Forza");

  // Calculate talent strength (sum of levels multiplied by stars)
  const talentStrength = strengthTalents.reduce(
    (sum, talent) => sum + (talent.level * talent.stars), 
    0
  );

  // From observing the data points, power seems to follow this pattern:
  // Level 1: 80 power
  // Level 2: 160 power
  // Level 3: 240 power
  // This suggests BASE_POWER_FACTOR = 80 per level
  const fromLevel = level * BASE_POWER_FACTOR;
  
  // Calculate contribution from strength attribute
  // Based on the formula, this should have some impact
  const fromStrengthAttribute = strengthAttribute * 0.5; // Coefficient determined from data analysis
  
  // Calculate contribution from strength talents
  // Talents with higher star rating should contribute more
  const fromStrengthTalents = talentStrength * 2; // Coefficient determined from data analysis
  
  // Total power calculation
  const total = fromLevel + fromStrengthAttribute + fromStrengthTalents;

  return {
    baseValue: BASE_POWER_FACTOR,
    fromLevel,
    fromStrengthAttribute,
    fromStrengthTalents,
    total: Math.round(total)
  };
}

/**
 * Project character statistics for future levels
 */
export function projectCharacterStats(
  character: CharacterData, 
  targetLevel: number
): ProjectedStats[] {
  const projections: ProjectedStats[] = [];
  
  // Find the highest level in our data
  const highestDataPoint = character.points.reduce(
    (max, point) => point.level > max.level ? point : max,
    character.points[0]
  );
  
  // Calculate average attribute growth per level
  const lastPoint = highestDataPoint;
  const firstPoint = character.points[0];
  const levelDiff = lastPoint.level - firstPoint.level;
  
  if (levelDiff <= 0) {
    throw new Error("Not enough data points to calculate growth rate");
  }
  
  const attributeGrowthRates = {
    strength: (lastPoint.baseAttributes.strength - firstPoint.baseAttributes.strength) / levelDiff,
    intelligence: (lastPoint.baseAttributes.intelligence - firstPoint.baseAttributes.intelligence) / levelDiff,
    command: (lastPoint.baseAttributes.command - firstPoint.baseAttributes.command) / levelDiff,
    charisma: (lastPoint.baseAttributes.charisma - firstPoint.baseAttributes.charisma) / levelDiff
  };
  
  // Calculate upgrade cost growth rate
  const costGrowthRate = calculateLevelUpgradeCostGrowthRate(character.points);

  // Generate projections
  for (let level = highestDataPoint.level + 1; level <= targetLevel; level++) {
    // Project attribute values
    const projectedAttributes = {
      strength: Math.round(lastPoint.baseAttributes.strength + attributeGrowthRates.strength * (level - lastPoint.level)),
      intelligence: Math.round(lastPoint.baseAttributes.intelligence + attributeGrowthRates.intelligence * (level - lastPoint.level)),
      command: Math.round(lastPoint.baseAttributes.command + attributeGrowthRates.command * (level - lastPoint.level)),
      charisma: Math.round(lastPoint.baseAttributes.charisma + attributeGrowthRates.charisma * (level - lastPoint.level))
    };
    
    // Calculate total attributes
    const totalAttributes = 
      projectedAttributes.strength + 
      projectedAttributes.intelligence + 
      projectedAttributes.command + 
      projectedAttributes.charisma;
    
    // Project upgrade cost
    const upgradeCost = predictLevelUpgradeCost(level - 1, costGrowthRate, character.points);
    
    // Calculate power
    const powerCalc = calculatePower(level, projectedAttributes.strength, lastPoint.talents);
    
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
 * Analyze historical data to identify patterns in power growth
 */
export function analyzePowerGrowth(character: CharacterData): {
  levelPowerFactor: number;
  attributeToPowerRatio: number;
  observations: string[];
} {
  const observations: string[] = [];
  
  if (character.points.length < 2) {
    return {
      levelPowerFactor: BASE_POWER_FACTOR,
      attributeToPowerRatio: 0.5,
      observations: ["Not enough data points to analyze power growth"]
    };
  }
  
  // Calculate power increase per level
  const powerPerLevel: number[] = [];
  for (let i = 1; i < character.points.length; i++) {
    const currentPoint = character.points[i];
    const prevPoint = character.points[i-1];
    
    const powerIncrease = currentPoint.power - prevPoint.power;
    const levelIncrease = currentPoint.level - prevPoint.level;
    
    if (levelIncrease > 0) {
      powerPerLevel.push(powerIncrease / levelIncrease);
    }
  }
  
  // Calculate average power increase per level
  const avgPowerPerLevel = powerPerLevel.reduce((sum, val) => sum + val, 0) / powerPerLevel.length;
  observations.push(`Average power increase per level: ${avgPowerPerLevel.toFixed(2)}`);
  
  // Calculate attribute to power ratio
  const attrToPowerRatios: number[] = [];
  for (let i = 0; i < character.points.length; i++) {
    const point = character.points[i];
    attrToPowerRatios.push(point.power / point.totalAttributes);
  }
  
  const avgAttrToPowerRatio = attrToPowerRatios.reduce((sum, val) => sum + val, 0) / attrToPowerRatios.length;
  observations.push(`Average power-to-attribute ratio: ${avgAttrToPowerRatio.toFixed(2)}`);
  
  return {
    levelPowerFactor: avgPowerPerLevel,
    attributeToPowerRatio: avgAttrToPowerRatio,
    observations
  };
}

/**
 * Generate an upgrade plan to reach a target level
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
  // Find current and target stats
  const currentPoint = character.points.find(p => p.level === currentLevel);
  if (!currentPoint) {
    throw new Error(`Data for current level ${currentLevel} not found`);
  }

  // Calculate upgrade costs
  const upgradeCosts = calculateUpgradeCosts(currentLevel, targetLevel, character);
  
  // Generate projections
  const projectedStats = projectCharacterStats(character, targetLevel);
  
  // The target stats are either from actual data or projected
  const targetPointData = character.points.find(p => p.level === targetLevel);
  const targetStats = targetPointData ? {
    level: targetPointData.level,
    power: targetPointData.power,
    attributes: targetPointData.baseAttributes
  } : {
    level: projectedStats[projectedStats.length - 1].level,
    power: projectedStats[projectedStats.length - 1].power,
    attributes: projectedStats[projectedStats.length - 1].attributes
  };
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  // Recommend which attribute to focus on
  const proficientAttributes = character.proficiency.map(p => p.toLowerCase());
  
  // Calculate attribute gains
  const targetAttributes = targetPointData ? targetPointData.baseAttributes : projectedStats[projectedStats.length - 1].attributes;
  
  const attributeGains: {name: string; projected: number}[] = [
    {name: "strength", projected: targetAttributes.strength - currentPoint.baseAttributes.strength},
    {name: "intelligence", projected: targetAttributes.intelligence - currentPoint.baseAttributes.intelligence},
    {name: "command", projected: targetAttributes.command - currentPoint.baseAttributes.command},
    {name: "charisma", projected: targetAttributes.charisma - currentPoint.baseAttributes.charisma}
  ];
  
  // Sort attributes by projected gain and proficiency
  attributeGains.sort((a, b) => {
    // First prioritize proficient attributes
    const aProficient = proficientAttributes.includes(a.name);
    const bProficient = proficientAttributes.includes(b.name);
    
    if (aProficient && !bProficient) return -1;
    if (!aProficient && bProficient) return 1;
    
    // Then sort by projected gain
    return b.projected - a.projected;
  });
  
  recommendations.push(`Focus on ${attributeGains[0].name} for best power gains (projected +${attributeGains[0].projected} points)`);
  
  // Recommend talent upgrades
  const talentsByPriority = upgradeCosts.talentUpgrades
    .sort((a, b) => {
      // Prioritize by star rating, then by attribute proficiency
      if (a.stars !== b.stars) return b.stars - a.stars;
      
      const aTypeProficient = proficientAttributes.includes(a.type.toLowerCase());
      const bTypeProficient = proficientAttributes.includes(b.type.toLowerCase());
      
      if (aTypeProficient && !bTypeProficient) return -1;
      if (!aTypeProficient && bTypeProficient) return 1;
      
      return a.cost - b.cost; // If all else equal, prioritize lower cost
    });
  
  if (talentsByPriority.length > 0) {
    recommendations.push(`Prioritize upgrading ${talentsByPriority[0].name} talent (${talentsByPriority[0].stars}★)`);
  }
  
  // Report total resources needed
  recommendations.push(`Total resources needed: ${upgradeCosts.totalSilver} silver, ${upgradeCosts.totalExp} talent exp, ${upgradeCosts.totalAbilityPoints} ability points`);
  
  return {
    currentStats: {
      level: currentPoint.level,
      power: currentPoint.power,
      attributes: currentPoint.baseAttributes
    },
    targetStats,
    upgradeCosts,
    projectedStats,
    recommendations
  };
}