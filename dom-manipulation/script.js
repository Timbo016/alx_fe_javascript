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
  displayDiv.innerHTML = ""; // clear previous

  // Create elements dynamically
  let quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;

  let quoteCategory = document.createElement("small");
  quoteCategory.innerHTML = `<em>- Category: ${randomQuote.category}</em>`;

  // Append children
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
    // Add to quotes array
    quotes.push({ text: textInput, category: categoryInput });

    // Update DOM dynamically
    let displayDiv = document.getElementById("quoteDisplay");
    displayDiv.innerHTML = ""; // clear old content

    let newQuoteText = document.createElement("p");
    newQuoteText.textContent = `"${textInput}"`;

    let newQuoteCategory = document.createElement("small");
    newQuoteCategory.innerHTML = `<em>- Category: ${categoryInput}</em>`;

    displayDiv.appendChild(newQuoteText);
    displayDiv.appendChild(newQuoteCategory);

    // Clear inputs after adding
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}
