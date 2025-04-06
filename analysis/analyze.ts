import data from "./data.json";

function calculateInitialAttribute(finalAttribute: number, level: number) {
  return finalAttribute - (level + Math.floor(level * ((2 * level + 1) / 5)));
}

for (const character of data.characters) {
  const point = character.points[character.points.length - 1]; // Last point of the character

  const initialStrength = Math.round(
    calculateInitialAttribute(point.baseAttributes.strength, point.level - 1),
  );

  let potenza = initialStrength * point.level;

  for (const talent of point.talents) {
    if (talent.type === "Forza") {
      potenza += talent.stars * talent.level * point.level * 10;
    }
  }

  console.log(
    `Character: ${character.name}, Potenza: ${potenza}, Initial Strength: ${initialStrength}`,
  );
}
