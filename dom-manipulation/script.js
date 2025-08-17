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





// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format');
      }
    } catch {
      alert('Error reading JSON file');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}









// Load quotes from localStorage or use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", category: "Wisdom" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];

  displayQuote(randomQuote);

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Display a single quote in the DOM
function displayQuote(quote) {
  let displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>- Category: ${quote.category}</em></small>
  `;
}

// Display multiple quotes (for filter)
function displayQuotes(quotesToDisplay) {
  let displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = "";

  if (quotesToDisplay.length === 0) {
    displayDiv.innerHTML = "<p>No quotes found in this category.</p>";
    return;
  }

  quotesToDisplay.forEach(q => {
    let quoteText = document.createElement("p");
    quoteText.textContent = `"${q.text}"`;

    let quoteCategory = document.createElement("small");
    quoteCategory.innerHTML = `<em>- Category: ${q.category}</em>`;

    displayDiv.appendChild(quoteText);
    displayDiv.appendChild(quoteCategory);
  });
}

// Add a new quote
function addQuote() {
  let textInput = document.getElementById("newQuoteText").value;
  let categoryInput = document.getElementById("newQuoteCategory").value;

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    saveQuotes();

    displayQuote({ text: textInput, category: categoryInput });

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    populateCategories(); // update dropdown if new category introduced
  }
}

// Populate category dropdown dynamically
function populateCategories() {
  let filter = document.getElementById("categoryFilter");

  // Clear previous categories except "All Categories"
  filter.innerHTML = '<option value="all">All Categories</option>';

  let categories = [...new Set(quotes.map(q => q.category))]; // unique categories

  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore last selected filter from localStorage
  let savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filter.value = savedFilter;
    filterQuotes(); // apply immediately
  }
}

// Filter quotes based on category
function filterQuotes() {
  let selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory); // persist filter

  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    let filtered = quotes.filter(q => q.category === selectedCategory);
    displayQuotes(filtered);
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// On page load
window.onload = function() {
  populateCategories();

  // Load last viewed quote if sessionStorage has it
  let lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    displayQuote(JSON.parse(lastQuote));
  } else {
    displayQuotes(quotes);
  }
};

