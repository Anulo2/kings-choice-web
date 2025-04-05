import { readFileSync } from 'fs';
import {
  CharacterData,
  calculateUpgradeCosts,
  calculatePower,
  projectCharacterStats,
  analyzePowerGrowth,
  generateUpgradePlan
} from './upgrade-analyzer';

// Simple function to load character data from JSON file
function loadCharacterData(filePath: string): CharacterData {
  const fileContents = readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.character as CharacterData;
}

// Main function to analyze knight upgrades
function analyzeKnightUpgrades(dataFilePath: string, currentLevel: number, targetLevel: number): void {
  // Load character data
  const character = loadCharacterData(dataFilePath);
  
  console.log(`\n===== Knight Upgrade Analysis for ${character.name} =====\n`);
  console.log(`Current Level: ${currentLevel}`);
  console.log(`Target Level: ${targetLevel}`);
  
  // Generate upgrade plan
  try {
    const plan = generateUpgradePlan(character, currentLevel, targetLevel);
    
    // Display current stats
    console.log(`\n----- Current Stats (Level ${currentLevel}) -----`);
    console.log(`Power: ${plan.currentStats.power}`);
    console.log('Attributes:');
    console.log(`  Strength: ${plan.currentStats.attributes.strength}`);
    console.log(`  Intelligence: ${plan.currentStats.attributes.intelligence}`);
    console.log(`  Command: ${plan.currentStats.attributes.command}`);
    console.log(`  Charisma: ${plan.currentStats.attributes.charisma}`);
    
    // Display projected stats
    console.log(`\n----- Projected Stats (Level ${targetLevel}) -----`);
    console.log(`Power: ${plan.targetStats.power}`);
    console.log('Attributes:');
    console.log(`  Strength: ${plan.targetStats.attributes.strength}`);
    console.log(`  Intelligence: ${plan.targetStats.attributes.intelligence}`);
    console.log(`  Command: ${plan.targetStats.attributes.command}`);
    console.log(`  Charisma: ${plan.targetStats.attributes.charisma}`);
    
    // Display upgrade costs
    console.log('\n----- Upgrade Costs -----');
    console.log(`Silver needed: ${plan.upgradeCosts.totalSilver}`);
    console.log(`Talent EXP needed: ${plan.upgradeCosts.totalExp}`);
    console.log(`Ability points needed: ${plan.upgradeCosts.totalAbilityPoints}`);
    
    // Display level by level progression
    console.log('\n----- Level Progression -----');
    for (const projection of plan.projectedStats) {
      console.log(`Level ${projection.level}:`);
      console.log(`  Power: ${projection.power}`);
      console.log(`  Upgrade Cost: ${projection.upgradeCost} silver`);
      console.log(`  Total Attributes: ${projection.totalAttributes}`);
      console.log(`  Strength: ${projection.attributes.strength}, Intelligence: ${projection.attributes.intelligence}`);
      console.log(`  Command: ${projection.attributes.command}, Charisma: ${projection.attributes.charisma}`);
      console.log('-----------------------------------------');
    }
    
    // Display recommendations
    console.log('\n----- Recommendations -----');
    for (const recommendation of plan.recommendations) {
      console.log(`- ${recommendation}`);
    }
    
    // Display power growth analysis
    console.log('\n----- Power Growth Analysis -----');
    const analysis = analyzePowerGrowth(character);
    for (const observation of analysis.observations) {
      console.log(`- ${observation}`);
    }
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

// Run the analysis with command line arguments
// Usage: ts-node demo.ts ./data.json 3 5
if (require.main === module) {
  const args = process.argv.slice(2);
  const dataFilePath = args[0] || './data.json';
  const currentLevel = parseInt(args[1] || '3', 10);
  const targetLevel = parseInt(args[2] || '5', 10);
  
  analyzeKnightUpgrades(dataFilePath, currentLevel, targetLevel);
}

// Export the analysis function for potential reuse
export { analyzeKnightUpgrades };