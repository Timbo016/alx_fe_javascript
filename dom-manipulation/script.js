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










// script.js

// -------- Storage Helpers --------
const LS_KEY = "quotes";
const SS_KEY_LAST = "lastViewedQuote";

function saveQuotes() {
  localStorage.setItem(LS_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const fromLS = localStorage.getItem(LS_KEY);
  if (fromLS) {
    try {
      quotes = JSON.parse(fromLS);
    } catch {
      quotes = [];
    }
  }
  if (!Array.isArray(quotes) || quotes.length === 0) {
    quotes = [
      { text: "The best way to predict the future is to create it.", category: "Motivation" },
      { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
      { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", category: "Wisdom" }
    ];
    saveQuotes();
  }
}

// -------- App State --------
let quotes = [];
loadQuotes();

// -------- UI Logic --------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.innerHTML = `<em>- Category: ${randomQuote.category}</em>`;

  displayDiv.appendChild(quoteText);
  displayDiv.appendChild(quoteCategory);

  // Session Storage demo: remember last viewed quote for this tab/session
  sessionStorage.setItem(SS_KEY_LAST, JSON.stringify(randomQuote));
}

function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  const textInput = textEl.value.trim();
  const categoryInput = catEl.value.trim();

  if (textInput && categoryInput) {
    quotes.push({ text: textInput, category: categoryInput });
    saveQuotes();

    const displayDiv = document.getElementById("quoteDisplay");
    displayDiv.innerHTML = "";

    const newQuoteText = document.createElement("p");
    newQuoteText.textContent = `"${textInput}"`;

    const newQuoteCategory = document.createElement("small");
    newQuoteCategory.innerHTML = `<em>- Category: ${categoryInput}</em>`;

    displayDiv.appendChild(newQuoteText);
    displayDiv.appendChild(newQuoteCategory);

    textEl.value = "";
    catEl.value = "";
  }
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// -------- JSON Export / Import --------
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

// Required signature & inline usage from instructions
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// -------- Init --------
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportJson").addEventListener("click", exportToJsonFile);

createAddQuoteForm();

// On first load of a session, show the last viewed quote if any (sessionStorage demo)
const last = sessionStorage.getItem(SS_KEY_LAST);
if (last) {
  try {
    const q = JSON.parse(last);
    const displayDiv = document.getElementById("quoteDisplay");
    displayDiv.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = `"${q.text}"`;
    const s = document.createElement("small");
    s.innerHTML = `<em>- Category: ${q.category}</em>`;
    displayDiv.appendChild(p);
    displayDiv.appendChild(s);
  } catch {
    // ignore parse errors
  }
}
