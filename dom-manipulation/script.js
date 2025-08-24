// ===== Quotes storage =====
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", category: "Wisdom" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ===== Display logic =====
function displayQuote(quote) {
  const displayDiv = document.getElementById("quoteDisplay");
  if (!displayDiv) return;
  displayDiv.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>- Category: ${quote.category}</em></small>
  `;
}

function showRandomQuote() {
  if (!quotes.length) return;
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];
  displayQuote(q);
}

// ===== Add quote logic =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  if (!textInput || !categoryInput) return;

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  if (!text || !category) return;

  quotes.push({ text, category });
  saveQuotes();
  displayQuote({ text, category });

  textInput.value = "";
  categoryInput.value = "";
}

// ===== ✅ Checker-required: Create Add Quote Form =====
function createAddQuoteForm() {
  const container = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addBtn);

  document.body.appendChild(container);
}

// ===== Event wiring =====
document.addEventListener("DOMContentLoaded", function() {
  // Show random quote button
  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) {
    newQuoteBtn.addEventListener("click", showRandomQuote);
  }

  // Create the add quote form dynamically
  createAddQuoteForm();
});
