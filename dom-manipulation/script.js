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

// -------- Local/Session Storage Keys --------
const LS_KEY = "quotes";
const SS_LAST = "lastQuote";

// -------- State --------
let quotes = [];

// -------- Storage Helpers --------
function saveQuotes() {
  localStorage.setItem(LS_KEY, JSON.stringify(quotes));
}

(function loadQuotes() {
  const raw = localStorage.getItem(LS_KEY);
  quotes = raw ? JSON.parse(raw) : [];
})();

// -------- UI Actions --------
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  if (!quotes.length) {
    display.textContent = "No quotes available!";
    return;
  }
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  display.textContent = `"${q.text}" - ${q.category}`;
  sessionStorage.setItem(SS_LAST, JSON.stringify(q));
}

function addQuote() {
  const t = document.getElementById("newQuoteText").value.trim();
  const c = document.getElementById("newQuoteCategory").value.trim();
  if (!t || !c) return;

  quotes.push({ text: t, category: c });
  saveQuotes();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Optional immediate feedback
  document.getElementById("quoteDisplay").textContent = `"${t}" - ${c}`;
  sessionStorage.setItem(SS_LAST, JSON.stringify({ text: t, category: c }));
}

// -------- Export / Import --------
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

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
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);

// Show last viewed quote if present (session storage demo)
const last = sessionStorage.getItem(SS_LAST);
if (last) {
  const q = JSON.parse(last);
  document.getElementById("quoteDisplay").textContent = `"${q.text}" - ${q.category}`;
}
