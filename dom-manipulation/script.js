// Load quotes from local storage or use default
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

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
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
    saveQuotes(); // save to local storage

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

// Load last viewed quote from session storage (if available)
window.onload = function() {
  let lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    let quote = JSON.parse(lastQuote);
    let displayDiv = document.getElementById("quoteDisplay");
    displayDiv.innerHTML = `<p>"${quote.text}"</p><small><em>- Category: ${quote.category}</em></small>`;
  }
};
