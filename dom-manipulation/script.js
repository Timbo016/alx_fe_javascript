// Quotes array
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", category: "Wisdom" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// Function to show a random quote
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];

  let displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = "";

  let quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;

  let quoteCategory = document.createElement("small");
  quoteCategory.innerHTML = `<em>- Category: ${randomQuote.category}</em>`;

  displayDiv.appendChild(quoteText);
  displayDiv.appendChild(quoteCategory);
}

// Event listener for Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to add a new quote
function addQuote() {
  let textInput = document.getElementById("newQuoteText").value;
  let categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput && categoryInput) {
    // Add new quote to array
    quotes.push({ text: textInput, category: categoryInput });

    // Update DOM dynamically
    let displayDiv = document.getElementById("quoteDisplay");
    displayDiv.innerHTML = "";

    let newQuoteText = document.createElement("p");
    newQuoteText.textContent = `"${textInput}"`;

    let newQuoteCategory = document.createElement("small");
    newQuoteCategory.innerHTML = `<em>- Category: ${categoryInput}</em>`;

    displayDiv.appendChild(newQuoteText);
    displayDiv.appendChild(newQuoteCategory);

    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Function to dynamically create the Add Quote form
function createAddQuoteForm() {
  let formContainer = document.getElementById("formContainer");

  // Create text input
  let textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  // Create category input
  let categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Create Add button
  let addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  // Append to form container
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Call to generate form on page load
createAddQuoteForm();










// Quote array with required structure
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

// Required function: Display random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>${quote.category}</small>
  `;
}

// Required function: Add quote form handler
function createAddQuoteForm() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  
  if (text && category) {
    quotes.push({ text, category });
    showRandomQuote();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

// Web Storage Integration
function saveToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadFromLocalStorage() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// JSON Handling
function exportQuotes() {
  const data = JSON.stringify(quotes);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importQuotes(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveToLocalStorage();
      showRandomQuote();
    } catch (error) {
      alert('Error importing quotes: Invalid JSON format');
    }
  };
  
  reader.readAsText(file);
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', createAddQuoteForm);
exportBtn.addEventListener('click', exportQuotes);
importFile.addEventListener('change', importQuotes);

// Initialize
loadFromLocalStorage();
showRandomQuote();
