# Knight Upgrade Analysis Tools

This directory contains TypeScript tools for analyzing knight upgrades in King Choice. The tools predict upgrade costs and calculate power based on historical data.

## Files

- `upgrade-analyzer.ts`: The main module with all analysis functions and types
- `demo.ts`: Example script showing how to use the analysis tools
- `data.json`: Sample character data used by the analysis
- `tracking.md`: Manual tracking information for knights

## Features

- Calculate upgrade costs between levels
- Project future power and attributes based on growth trends
- Calculate detailed power breakdown based on knight level, strength attribute, and talents
- Generate upgrade recommendations based on knight proficiency
- Analyze historical data to identify power growth patterns

## How to Use

### Running the Demo Script

```bash
# Install TypeScript if not already installed
npm install -g typescript ts-node

# Run the demo script with default parameters
ts-node demo.ts

# Run with custom parameters
ts-node demo.ts ./data.json 3 5
```

### Using the API in Your Code

```typescript
import { generateUpgradePlan, CharacterData } from './upgrade-analyzer';

// Load your character data
const character: CharacterData = {
  name: 'Knight Name',
  stars: 3,
  proficiency: ['strength', 'intelligence'],
  points: [
    // Array of character points with level data
  ]
};

// Generate an upgrade plan
const plan = generateUpgradePlan(character, 3, 5);

// Access the results
console.log(`Power increase: ${plan.targetStats.power - plan.currentStats.power}`);
console.log(`Total silver needed: ${plan.upgradeCosts.totalSilver}`);

// Get recommendations
for (const recommendation of plan.recommendations) {
  console.log(`- ${recommendation}`);
}
```

## Power Calculation Formula

According to the game mechanics, a knight's power is composed of:
- Knight Level
- Strength Talents
- Strength Attributes

The formula implemented in the code is:
```
Power = (Level * BASE_FACTOR) + (Strength * STRENGTH_FACTOR) + (StrengthTalents * TALENT_FACTOR)
```

Where:
- BASE_FACTOR is 80 (observed from data)
- STRENGTH_FACTOR is 0.5 (estimated)
- TALENT_FACTOR is 2 (estimated)

These factors are calibrated based on the observed data in tracking.md.

## Type Definitions

The module exports TypeScript interfaces for all data structures:

- `CharacterData`: Top-level character information
- `CharacterPoint`: Data for a specific character level
- `AttributeBonus`: Strength, intelligence, command, and charisma values
- `Talent`: Character talent information
- `Ability`: Character ability information
- `ProjectedStats`: Projected statistics for future levels
- `PowerCalculation`: Detailed power calculation breakdown
- `UpgradeCosts`: Detailed upgrade cost information