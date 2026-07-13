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
  fs.writeFileSync(FILE, JSON.stringify(date, null, 2));
}

//------Constructor------
function Exercise(name, category) {
  this.id = Date.now();
  this.name = name;
  this.category = category.toLowerCase();
  this.logs = [];
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

function logWorkOut(id, weight, reps, set) {
  const ex = findExercise(id);
  if(!ex) {
    console.log(`No exercise found with id: ${id}`);
  }
  
}