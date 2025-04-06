import data from "./data.json";

for (const character of data.characters) {
  const point = character.points[character.points.length - 1]; // Last point of the character

  let potenza = character.initialAttributes.strength * point.level;

  for (const talent of point.talents) {
    if (talent.type === "Forza") {
      potenza += talent.stars * talent.level * point.level * 10;
    }
  }

  console.log("Potenza:", potenza);
}
