const fs = require ('fs');
const FILE = 'books.json';

//data persistence
function loadBooks() {
  if (fs.existsSync(FILE)) {
    const data = fs.readFileSync(FILE, 'utf8');
    //data comes back as strings from JSON, so we reconstruct
    const books = JSON.parse(data);
    books.forEach(b => {
      if (b.dateAdded) b.dateAdded = new Date(b.dateAdded);
      if (b.dateFinished) b.dateFinished = new Date(b.dateFinished);
    });
    return books;
  }
  return [];
}

function saveBooks(books) {
  fs.writeSyncFile(FILE, JSON, stringify(books, null, 2));
}

// constructor
function Book(title, author, genre, pages) {
  this.id = Date.now();
  this.title = title;
  this.author = author;
  this.genre = genre;
  this.pages = Number(pages) || 0;
  this.status = 'unread';
  this.dateAdded = new Date();
  this.dateFinished = null;
}

// State
let books = loadBooks();

// COMMANDS
function addBook(title, author, genre, pages) {
  if (!title || !author) {
    console.log('Error: Title and Author are required.');
    return;
  }
  if (!genre) {
    console.log('Error: Genre is required.');
    return;
  }
  if (isNaN(pages) || pages <= 0) {
    console.log('Error: Pages must be a positive number.')
    return;
  }
  
  const book = new book(title, author, genre.toLowerCase(), pages);
  books.push(book);
  console.log(`Added: "${book.title}" By: ${book.author} [${book.genre}] (${book.id})`);
}

function deleteBook(id) {
  const before = books.length;
  books = books.filter(b => b.id !== id);
  if(books.length < before) {
    console.log(`Deleted book ${id}`);
  } else {
    console.log(`No book found with id ${id}`);
  }
}

function updateStatus(id, newStatus) {
  const valid = ['unread','reading','finished'];
  if(!valid.includes(newStatus)) {
    console.log(`Error: Status must be one of ${valid.join(', ')}`);
    return;
  }
  const book = books.find(b => b.id === id);
  if(!book) {
    console.log(`No book found with id ${id}`);
    return;
  }
  
  book.status = newStatus;
  if(newStatus === 'finished') {
    book.dateFinished = new Date();
    console.log(`"${book.title}" is now ${newStatus}`);
  }
}

function listBooks(filterStatus, filterGenre) {
  let result = [...books];
  
  if(filterStatus) {
    result = result.filter(b => b.status === filterStatus.toLowerCase());
  }
  if(filterGenre) {
    result = result.filter(b => b.genre === filterGenre.toLowerCase());
  }

// Sort by status(finished last),then by genre, then by title
const statusRank={ reading: 0, unread: 1, finished: 2};
result.sort((a, b) => {
  const statusDiff = (statusRank[a.status] ?? 99) - (statusRank[b.status] ?? 99);
  if (statusDiff !== 0) return statusDiff;
  if (a.genre !== b.genre) return a.genre.localeCompare(b.genre);
  return a.title.localeCompare(b.title);
});
if(result.length === 0) {
  console.log('No books found.');
  return;
}

console.log(`\n${'ID'.padEnd(14)} ${'Title'.padEnd(28)} ${'Author'.padEnd(18)} ${'Genre'.padEnd(12)} ${'Status'.padEnd(10)} Pages`);
console.log('-'.repeat(90));
result.forEach(b => {
  const icon = b.status === 'finished' ? '✓' : b.status === 'reading' ? '∆' : '°';
  console.log(
    `${String(b.id).padEnd(14)} ` + 
    `${b.title.slice(0, 26).padEnd(28)} ` +
    `${b.author.slice(0, 16).padEnd(18)} ` +
    `${b.genre.padEnd(12)} ` +
    `${icon} ${b.status.padEnd(8)} ` +
    `${b.pages}`
    );
});
}

function showStats() {
  const total = books.length;
  const finished = books.filter(b => b.status === 'finished').length;
  const reading = books.filter(b => b.status === 'reading').length;
  const unread = books.filter(b => b.status === 'unread').length;
  const totalPages = books.reduce((sum, b) => sum + (b.status === 'finished' ? b.pages :0), 0);
  
  //Genre breakdown
  const genre = {};
  books.forEach(b => {
    genres[b.genre] = (genres[b.genre] || 0) + 1;
  });
  
  console.log(`\nReading stats`);
  console.log(`Total books:         ${total}`);
  console.log(`Finished:            ${finished}`);
  console.log(`Reading now:         ${reading}`);
  console.log(`Unread:              ${unread}`);
  console.log(`Pages read:          ${pages}`);
  console.log(`\nBy genre:`);
  
  Object.entries(genres)
  .sort((a, b) => b[1] - a[1])
  .forEach(([genre, count]) => {
    console.log(` ${genre.padEnd(14)} ${count}`);
  });
  }
  
  function showHelp(){
    console.log(`
    Book Reading Tracker
    
    Usage:
      node app.js add "<title>" "<author>" <genre> <pages>
      node app.js delete <id>
      node app.js status <id> <unread|reading|finished>
      node app.js list [status] [genre]
      node app.js stats 
      node app.js help
    `);
  }