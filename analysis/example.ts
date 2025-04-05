// Import functions and types from our analysis module
import type { CharacterData } from './index';
import {calculateUpgradeCosts, projectCharacterStats, analyzePowerGrowth} from './index';

// Load data for analysis
import data from './data.json';
const characterData = data.characters[0] as CharacterData;

// Sample execution function to demonstrate usage
function runAnalysis() {
  try {
    // Example parameters
    const currentLevel = 3;
    const targetLevel = 4;
    
    console.log(`\n== Upgrade Analysis for ${characterData.name} ==`);
    console.log(`Current Level: ${currentLevel}`);
    console.log(`Target Level: ${targetLevel}`);
    
    console.log('\n== Character Data ==');
    console.log(`Stars: ${characterData.stars}★`);
    console.log(`Proficiency: ${characterData.proficiency.join(', ')}`);
    
    console.log('\n== Current Stats ==');
    const currentPoint = characterData.points.find(p => p.level === currentLevel);
    if (currentPoint) {
      console.log(`Power: ${currentPoint.power}`);
      console.log(`Total Attributes: ${currentPoint.totalAttributes}`);
      console.log('Base Attributes:');
      console.log(`- Strength: ${currentPoint.baseAttributes.strength}`);
      console.log(`- Intelligence: ${currentPoint.baseAttributes.intelligence}`);
      console.log(`- Command: ${currentPoint.baseAttributes.command}`);
      console.log(`- Charisma: ${currentPoint.baseAttributes.charisma}`);
    }
    
    console.log('\n== Upgrade Calculation ==');
    // Import needed function dynamically to avoid Node.js specific imports
    const costs = calculateUpgradeCosts(currentLevel, targetLevel, characterData);
    
    console.log(`Total Silver Needed: ${costs.totalSilver}`);
    console.log(`Total Talent EXP Needed: ${costs.totalExp}`);
    console.log(`Total Ability Points Needed: ${costs.totalAbilityPoints}`);
    
    console.log('\n== Power Projection ==');
    const projections = projectCharacterStats(characterData, targetLevel);
    
    for (const projection of projections) {
      console.log(`Level ${projection.level}:`);
      console.log(`- Power: ${projection.power}`);
      console.log(`- Upgrade Cost: ${projection.upgradeCost} silver`);
      console.log(`- Total Attributes: ${projection.totalAttributes}`);
    }
    
    console.log('\n== Power Analysis ==');
    const analysis = analyzePowerGrowth(characterData);
    
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

// Run the analysis when this file is executed
runAnalysis();