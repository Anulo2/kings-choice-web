# Strumenti di Analisi Aggiornamento Cavalieri

Questo progetto contiene strumenti TypeScript per analizzare gli aggiornamenti dei cavalieri in King Choice. Gli strumenti consentono di predire i costi di aggiornamento e calcolare la potenza in base ai dati storici.

## File

- `index.ts`: Il modulo principale con tutte le funzioni di analisi e i tipi
- `demo.ts`: Script di esempio che mostra come utilizzare gli strumenti di analisi
- `data.json`: Dati di esempio dei cavalieri usati per l'analisi
- `tracking.md`: Informazioni di tracciamento manuale dei cavalieri
- `tsconfig.json`: Configurazione TypeScript per il progetto

## Funzionalità

- Calcolo dei costi di aggiornamento tra livelli
- Proiezione di potenza e attributi futuri basata sulle tendenze di crescita
- Calcolo dettagliato della potenza basato sugli attributi di forza e sui talenti di forza
- Generazione di consigli di aggiornamento basati sulla proficienza del cavaliere
- Analisi dei dati storici per identificare modelli di crescita della potenza

## Come Utilizzare

### Esecuzione dello Script Demo

```bash
# Installa TypeScript se non è già installato
npm install -g typescript ts-node

# Esegui lo script demo con parametri predefiniti
ts-node demo.ts

# Esegui con parametri personalizzati (percorso_file, indice_cavaliere, livello_attuale, livello_target)
ts-node demo.ts ./data.json 0 1 5
```

### Utilizzo dell'API nel Tuo Codice

```typescript
import { generateUpgradePlan, calculatePower, CharacterData } from './index';

// Carica i dati del cavaliere
const character: CharacterData = {
  name: 'Nome Cavaliere',
  stars: 3,
  proficiency: ['strength', 'intelligence'],
  points: [
    // Array di punti del cavaliere con dati di livello
  ]
};

// Calcola la potenza attuale
const currentPoint = character.points[0];
const power = calculatePower(currentPoint.baseAttributes.strength, currentPoint.talents);
console.log(`Potenza: ${power.total}`);

// Genera un piano di aggiornamento
const plan = generateUpgradePlan(character, 3, 5);

// Accedi ai risultati
console.log(`Incremento di potenza: ${plan.targetStats.power - plan.currentStats.power}`);
console.log(`Argento totale necessario: ${plan.upgradeCosts.totalSilver}`);

// Ottieni consigli
for (const recommendation of plan.recommendations) {
  console.log(`- ${recommendation}`);
}
```

## Formula di Calcolo della Potenza

Secondo la meccanica del gioco, la potenza di un cavaliere è calcolata con questa formula:

```
Potenza = 0
Per talento in talenti di tipo forza:
    potenza += Stelle talento * livello talento * 10
potenza += attributo base di forza
```

Ad esempio, un cavaliere con:
- Attributo forza base: 40
- Talento di forza 1: 3 stelle, livello 1
- Talento di forza 2: 1 stella, livello 1

Avrà una potenza di:
- Da talenti: (3 * 1 * 10) + (1 * 1 * 10) = 40
- Da attributo forza: 40
- Totale: 80

## Definizioni dei Tipi

Il modulo esporta interfacce TypeScript per tutte le strutture di dati:

- `CharacterData`: Informazioni di alto livello sul cavaliere
- `CharacterPoint`: Dati per un livello specifico del cavaliere
- `AttributeBonus`: Valori di forza, intelligenza, comando e carisma
- `Talent`: Informazioni sul talento del cavaliere
- `Ability`: Informazioni sull'abilità del cavaliere
- `ProjectedStats`: Statistiche proiettate per livelli futuri
- `PowerCalculation`: Dettaglio del calcolo della potenza
- `UpgradeCosts`: Informazioni dettagliate sui costi di aggiornamento