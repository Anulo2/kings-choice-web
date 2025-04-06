import { readFileSync } from 'node:fs';
import {
  type CharacterData,
  calculatePower,
  generateUpgradePlan,
  projectCharacterStats
} from './index';

// Funzione per caricare i dati del cavaliere da un file JSON
function loadCharacterData(filePath: string): CharacterData[] {
  try {
    const fileContents = readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.characters;
  } catch (error) {
    console.error(`Errore nel caricamento dei dati: ${error}`);
    process.exit(1);
  }
}

// Funzione principale per l'analisi del cavaliere
function analyzeKnight(
  dataFilePath: string = './data.json', 
  knightIndex: number = 0,
  currentLevel: number = 1, 
  targetLevel: number = 5
): void {
  // Carica i dati del cavaliere
  const characters = loadCharacterData(dataFilePath);
  
  if (knightIndex >= characters.length) {
    console.error(`Indice cavaliere non valido. Ci sono solo ${characters.length} cavalieri disponibili.`);
    return;
  }
  
  const character = characters[knightIndex];
  
  console.log(`\n========== Analisi Cavaliere: ${character.name} ==========\n`);
  console.log(`Stelle: ${character.stars}★`);
  console.log(`Proficienza: ${character.proficiency.join(', ')}`);
  
  try {
    // Trova il punto dati per il livello attuale
    const currentPoint = character.points.find(p => p.level === currentLevel);
    if (!currentPoint) {
      console.error(`Dati per il livello ${currentLevel} non trovati.`);
      return;
    }
    
    // Calcola la potenza con la nuova formula
    const powerCalc = calculatePower(
      currentPoint.baseAttributes.strength, 
      currentPoint.talents
    );
    
    console.log(`\n----- Statistiche Attuali (Livello ${currentLevel}) -----`);
    console.log(`Potenza: ${powerCalc.total}`);
    console.log(`Dettaglio Potenza:`);
    console.log(`- Da Forza Base: ${powerCalc.fromStrengthAttribute}`);
    console.log(`- Da Talenti Forza: ${powerCalc.fromStrengthTalents}`);
    
    console.log('\nAttributi Base:');
    console.log(`- Forza: ${currentPoint.baseAttributes.strength}`);
    console.log(`- Intelligenza: ${currentPoint.baseAttributes.intelligence}`);
    console.log(`- Comando: ${currentPoint.baseAttributes.command}`);
    console.log(`- Carisma: ${currentPoint.baseAttributes.charisma}`);
    
    // Genera un piano di aggiornamento
    const plan = generateUpgradePlan(character, currentLevel, targetLevel);
    
    console.log(`\n----- Piano di Aggiornamento al Livello ${targetLevel} -----`);
    
    // Mostra statistiche proiettate
    console.log('\nProiezione Livelli:');
    for (const projection of plan.projectedStats) {
      console.log(`\nLivello ${projection.level}:`);
      console.log(`- Potenza: ${projection.power}`);
      console.log(`- Costo: ${projection.upgradeCost} argento`);
      console.log(`- Attributi Totali: ${projection.totalAttributes}`);
    }
    
    // Mostra consigli
    console.log('\nConsigli:');
    for (const recommendation of plan.recommendations) {
      console.log(`- ${recommendation}`);
    }
    
    // Mostra costi totali
    console.log('\nCosti di Aggiornamento:');
    console.log(`- Argento Necessario: ${plan.upgradeCosts.totalSilver}`);
    console.log(`- EXP Talento Necessaria: ${plan.upgradeCosts.totalExp}`);
    console.log(`- Punti Abilità Necessari: ${plan.upgradeCosts.totalAbilityPoints}`);
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Errore: ${error.message}`);
    } else {
      console.error('Si è verificato un errore sconosciuto');
    }
  }
}

// Permetti di eseguire lo script dalla linea di comando
if (require.main === module) {
  const args = process.argv.slice(2);
  const dataFilePath = args[0] || './data.json';
  const knightIndex = parseInt(args[1] || '0', 10);
  const currentLevel = parseInt(args[2] || '1', 10);
  const targetLevel = parseInt(args[3] || '5', 10);
  
  analyzeKnight(dataFilePath, knightIndex, currentLevel, targetLevel);
}

// Esporta la funzione per un potenziale riutilizzo
export { analyzeKnight };