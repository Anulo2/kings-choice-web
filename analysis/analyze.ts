import data from "./data.json";

/**
 *
 * @param attribute - The value of the attribute at a certain level
 * @param level - The level of the knight
 * @returns The initial value of the attribute for when the knight was at level 1
 */
function calculateInitialAttribute(attribute: number, level: number): number {
  return attribute - (level + Math.floor(level * ((2 * level + 1) / 5)));
}

/**
 *
 * @param level - The current level of the knight
 * @returns The cost of upgrading the knight's level by one level
 * https://oeis.org/search?q=50%2C+102%2C+162%2C+231%2C+314%2C+412%2C+530%2C+669%2C+834%2C+1026%2C+1250%2C+1507
 */
function calculateUpgradeCost(level: number): number {
  let order1 = -46
  let order2 = 47;
  

  const a_n = (n: number): number => {
    if (n === 1) return 2;
    const buff = a_n(n-1)
    order1 += order2
    order2 += buff
    return 6 * n - 7 - buff;
  }; 

  const number =  a_n(level + 2); 
  order1 += order2
  order2 += number

  return order1
}

for (const character of data.characters) {
  const point = character.points[character.points.length - 1];

  const initialStrength = Math.round(
    calculateInitialAttribute(point.baseAttributes.strength, point.level - 1),
  );

  let potenza = initialStrength * point.level;

  for (const talent of point.talents) {
    if (talent.type === "Forza") {
      potenza += talent.stars * talent.level * point.level * 10;
    }
  }

  const upgradeCost = calculateUpgradeCost(point.level);

  console.log(
    `Character: ${character.name}, Potenza: ${potenza}, Initial Strength: ${initialStrength}, Costo upgrade: ${upgradeCost}`,
  );
}
