const fs = require('fs');
const FILE = 'workouts.js';

//____Persistance_____
function loadData() {
  if (fs.existsSync(FILE)) {
    const data = fs.readFileSync(FILE, 'utf8');
    const parsed = JSON.parse(data);
    
    parsed.forEach(ex => {
      ex.logs.forEach(l => {
        if (l.date) l.date = new Date(l.date);
      });
    });
    return parsed;
  }
  return[];
}

function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

//------Constructor------
function Exercise(name, category) {
  this.id = Date.now();
  this.name = name;
  this.category = category.toLowerCase();
  this.logs = [];
}

function logEntry(weight, reps, sets) {
  this.date = new Date();
  this.weight = Number(weight);
  this.reps = Number(reps);
  this.sets = Number(sets);
  this.volume = this.weight * this.reps * this.sets;
}

//State
let exercises = loadData();

// Helpers
function isValidPositive(num) {
  const n = Number(num);
  return !isNaN(n) && n > 0;
}

function formatDate(date) {
  return date.toISOString.split('T')[0];
}

//______Commands______
function addExercise(name, category) {
  if (!name || !category) {
    console.log('Error: Name and Category are required. ');
    return;
  }
  const ex = new Exercise (name, category);
  exercises.push(ex);
  console.log(`Added exercise: "${ex.name}" [${ex.category}] (${ex.id})`);
}

function logWorkOut(id, weight, reps, sets) {
  const ex = findExercise(id);
  if(!ex) {
    console.log(`No exercise found with id: ${id}`);
  }
  if(!isValidPositive(weight) || !isValidPositive(reps)) {
    console.log('Error: Weight and Reps must be positive. ');
    return;
  }
  const entry = new logEntry(weight, reps, sets);
  ex.log.push(entry);
  const totalSets = entry.sets > 1 ? `${entry.sets} sets of ` : '';
  console.log(`Logged: ${ex.name} - ${totalSets}${entry.reps} reps @ ${entry.weight}Kg (Vol: ${entry.volume}Kg)`);
  }
  
  function showHistory(id) {
    const ex = findExercise();
    
    if(!ex) {
      console.log(`No exercise found with the id: ${id}`);
    }
    return;
    if(ex.logs.length === 0) {
      console.log(`No logs yet for "${ex.name}".`);
      return;
    }
    
  console.log(`\nHistory: ${ex.name}`);
  console.log(`${'Date'.padEnd(12)} ${'Weight'.padEnd(8)} ${'Reps'.padEnd(6)} ${'Sets'.padEnd(6)} ${'Volume'.padEnd(10)}`);
  console.log('-'.repeat(45));
  ex.logs.slice().reverse().forEach(l => {
    console.log(
      `${formatDate(l.date).padEnd(12)}` +
      `${String(l.weight).padEnd(8)}` +
      `${String(l.reps).padEnd(6)}` +
      `${String(l.sets).padEnd(6)}` +
      `${String(l.volume).padEnd(10)}`
    );
  });
  }
  
  function showPR(id) {
    const ex = findExercise(id);
    if (!ex) {
      console.log(`No exercise found with the id: ${id}`);
      return;
    }
    if(ex.logs.length === 0) {
      console.log(`No data yet for "${ex.name}`);
      return;
    }
    
    const maxWeight = Math.max(...ex.logs.map(l => l.weight));
    const maxVolume = Math.max(...ex.logs.map(l => l.volume));
    const maxWeightEntry = ex.logs.find(l => l.weight === maxWeight);
    const maxVolumeEntry = ex.logs.find(l => l.volume === maxVolume);
    
    console.log(`\nPersonal Records: ${ex.name}`);
    console.log(`Heaviest lift: ${maxWeight}Kg ${maxVolumeEntry.reps}reps ${formatDate(maxWeightEntry.date)}`);
    console.log(`Max Volume: ${maxVolume}Kg ${maxVolumeEntry.sets}sets x ${maxVolumeEntry.reps}reps @ ${maxVolumeEntry.weight}Kg`);
  }
  
  function showVolume(dateStr) {
    const target = dateStr ? new Date(dateStr) : new Date();
    target.setHours(0,0,0,0);
    
    let totalVolume = 0;
    let totalSets = 0;
    let exerciseCount = 0;
    
    exercises.forEach(ex => {
      const dayLogs = ex.logs.filter(l => {
        const d = new Date(l.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === target.getTime();
      });
      
      if(dayLogs.length > 0) {
        exerciseCount++;
        dayLogs.forEach(l => {
          totalVolume += l.volume;
          totalSets += l.sets;
        });
      }
    });
    
    const dateLabel = formatDate(target);
    console.log(`\nVolume Summary: ${dateLabel}`);
    console.log(`Exercises: ${exerciseCount}`);
    console.log(`Total sets: ${totalSets}`);
    console.log(`Total Volume: ${totalVolume}Kg`);
  }
  
  function listExercises() {
    if (exercises.length === 0) {
      console.log('No exercises added yet.');
      return;
    }
    
    console.log(`\n${'ID'.padEnd(14)} ${'Name'.padEnd(22)} ${'Category'.padEnd(12)} ${'Logs'.padEnd(6)} ${'PR (kg)'.padEnd(10)}`);
  console.log('-'.repeat(65));
  
  exercises.forEach(ex => {
    const pr = ex.logs.length > 0 ? Math.max(...ex.logs.map(l => l.weight)) : '-';
    console.log(
      `${String(ex.id).padEnd(14)} ` +
      `${ex.name.slice(0, 20).padEnd(22)} ` +
      `${ex.category.padEnd(12)} ` +
      `${String(ex.logs.length).padEnd(6)} ` +
      `${String(pr).padEnd(10)}`
    );
  });
}

  function deleteExercise(id) {
    const before = exercise.length;
    exercises = exercise.filter(e => e.id !== id);
    if (exercise.length < before) {
      console.log(`Deleted exercise ${id}`);
    } else {
      console.log(`No exercise found with id: ${id}`);
    }
  }
  
  function showHelp() {
    console.log(`
    Work out Tracker 
    
    Usage:
    node app.js add "<name>" <category>
    node app.js log <exercise-id> <weight> <reps> [sets]
    node app.js history <exercise-id>
    node app.js pr <exercise-id>
    node app.js volume [YYYY-MM-DD]
    node app.js list
    node app.js delete <exercise-id>
    node app.js help
    `);
  }
  
  // ─── ARGUMENT PARSING ───
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'add':
    addExercise(args[1], args[2]);
    break;
  case 'log':
    logWorkout(Number(args[1]), args[2], args[3], args[4]);
    break;
  case 'history':
    showHistory(Number(args[1]));
    break;
  case 'pr':
    showPR(Number(args[1]));
    break;
  case 'volume':
    showVolume(args[1]);
    break;
  case 'list':
    listExercises();
    break;
  case 'delete':
    deleteExercise(Number(args[1]));
    break;
  case 'help':
    showHelp();
    break;
  default:
    console.log(`Unknown command: ${command || '(none)'}`);
    showHelp();
}

saveData(exercises);

  
