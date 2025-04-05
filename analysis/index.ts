// Types definitions
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
 * Calculate detailed upgrade costs for reaching a target level
 */
function calculateUpgradeCosts(
  currentLevel: number,
  targetLevel: number,
  character: CharacterData
): UpgradeCosts {
  if (targetLevel <= currentLevel) {
    throw new Error("Target level must be greater than current level");
  }

  // Find the current and target level points
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
 * Calculate the growth rate of level upgrade costs
 */
function calculateLevelUpgradeCostGrowthRate(points: CharacterPoint[]): number {
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
function predictLevelUpgradeCost(
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
  return Math.round(highestDataPoint.upgradeCost * growthRate ** (level - highestDataPoint.level));
}

/**
 * Calculate character power with detailed breakdown
 * According to the formula:
 * Potenza = 0
 * For talento in talenti di tipo forza:
 *     potenza += Stelle talento * livello * 10
 * potenza += attributo base di forza
 */
function calculatePower(
  level: number, 
  strengthAttribute: number, 
  talents: Talent[]
): PowerCalculation {
  // Filter talents that are of type "Forza"
  const strengthTalents = talents.filter(talent => talent.type === "Forza");

  // Calculate talent power contribution: sum(stars * level * 10)
  const fromStrengthTalents = strengthTalents.reduce(
    (sum, talent) => sum + (talent.stars * talent.level * 10), 
    0
  );

  // Contribution from strength attribute
  const fromStrengthAttribute = strengthAttribute;
  
  // Total power calculation
  const total = fromStrengthTalents + fromStrengthAttribute;

  return {
    baseValue: 0, // Updated since we're not using a base factor anymore
    fromLevel: 0, // Not using level in the new formula
    fromStrengthAttribute,
    fromStrengthTalents,
    total: Math.round(total)
  };
}

/**
 * Project character statistics for future levels
 */
function projectCharacterStats(
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
    
    // Assume book and lover bonuses remain constant
    const projectedPoint: CharacterPoint = {
      level,
      upgradeCost: 0, // Will be set below
      baseAttributes: projectedAttributes,
      bookBonus: lastPoint.bookBonus,
      loverBonus: lastPoint.loverBonus,
      talents: lastPoint.talents,
      abilities: lastPoint.abilities,
      totalAttributes: 0, // Will be calculated below
      power: 0 // Will be calculated below
    };
    
    // Calculate total attributes using our new function
    const totalAttributes = calculateTotalAttributes(projectedPoint);
    
    // Project upgrade cost
    const upgradeCost = predictLevelUpgradeCost(level - 1, costGrowthRate, character.points);
    
    // Calculate power using the new formula
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
function analyzePowerGrowth(character: CharacterData): {
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
function generateUpgradePlan(
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
  const targetPoint = targetPointData || projectedStats[projectedStats.length - 1];
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  // Recommend which attribute to focus on
  const proficientAttributes = character.proficiency.map(p => p.toLowerCase());
  
  // Handle the attribute calculation based on whether we're using actual data or projection
  const targetAttributes = targetPointData ? targetPointData.baseAttributes : (projectedStats[projectedStats.length - 1].attributes);
  
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
  
  recommendations.push(`Prioritize upgrading ${talentsByPriority[0].name} talent (${talentsByPriority[0].stars}★)`);
  
  // Report total resources needed
  recommendations.push(`Total resources needed: ${upgradeCosts.totalSilver} silver, ${upgradeCosts.totalExp} talent exp, ${upgradeCosts.totalAbilityPoints} ability points`);
  
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

/**
 * Calculate total attributes for a character data point
 * Total Attributes = Sum of all base attributes + book bonus + lover bonus
 */
function calculateTotalAttributes(point: CharacterPoint): number {
  // Sum base attributes
  const baseTotal = 
    point.baseAttributes.strength +
    point.baseAttributes.intelligence +
    point.baseAttributes.command +
    point.baseAttributes.charisma;
  
  // Sum book bonus attributes
  const bookTotal = 
    point.bookBonus.strength +
    point.bookBonus.intelligence +
    point.bookBonus.command +
    point.bookBonus.charisma;
  
  // Sum lover bonus attributes
  const loverTotal = 
    point.loverBonus.strength +
    point.loverBonus.intelligence +
    point.loverBonus.command +
    point.loverBonus.charisma;
  
  // Return the sum of all attributes
  return baseTotal + bookTotal + loverTotal;
}

// Export functions for use in other modules
export {
  calculateUpgradeCosts,
  calculatePower,
  projectCharacterStats,
  analyzePowerGrowth,
  generateUpgradePlan,
  calculateTotalAttributes
};