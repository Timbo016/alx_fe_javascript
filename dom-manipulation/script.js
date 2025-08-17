// Step 2: JavaScript Implementation

// 1. Quotes array (each quote has text + category)
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", category: "Wisdom" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// 2. Function to show a random quote
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length); // pick random index
  let randomQuote = quotes[randomIndex]; // get the quote

  // Get the display div
  let displayDiv = document.getElementById("quoteDisplay");

  // Clear old content and insert new one
  displayDiv.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small><em>- Category: ${randomQuote.category}</em></small>
  `;
}

// 3. Attach event listener to button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// 4. Function placeholder for Step 3 (will build later)
function createAddQuoteForm() {
  // Later: this will dynamically generate a form
  console.log("Form creation function will be implemented in Step 3");
}
