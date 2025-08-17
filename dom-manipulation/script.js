// Initial quotes array with text and category properties
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "leadership" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "life" },
  { text: "Stay hungry, stay foolish.", category: "motivation" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "perseverance" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddFormBtn = document.getElementById('showAddForm');
const addQuoteForm = document.getElementById('addQuoteForm');
const categoryFilter = document.getElementById('categoryFilter');

// Initialize the application
function init() {
  // Set up event listeners
  newQuoteBtn.addEventListener('click', displayRandomQuote); // Changed to displayRandomQuote
  showAddFormBtn.addEventListener('click', showAddForm);
  
  // Populate category filter
  updateCategoryFilter();
  
  // Show initial random quote
  displayRandomQuote(); // Changed to displayRandomQuote
}

// Display a random quote (renamed from showRandomQuote to displayRandomQuote)
function displayRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;
  
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `
      <p class="quote-text">No quotes found in this category.</p>
      <p class="quote-category"></p>
    `;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <p class="quote-text">"${randomQuote.text}"</p>
    <p class="quote-category">— ${randomQuote.category}</p>
  `;
}

// Show the add quote form
function showAddForm() {
  addQuoteForm.style.display = 'block';
}

// Hide the add quote form
function hideAddForm() {
  addQuoteForm.style.display = 'none';
  // Clear the form fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Add a new quote to the array and update the display
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  
  if (text === '' || category === '') {
    alert('Please enter both a quote and a category');
    return;
  }
  
  // Add the new quote
  quotes.push({ text, category });
  
  // Update the category filter
  updateCategoryFilter();
  
  // Hide the form and clear fields
  hideAddForm();
  
  // Show the new quote
  displayRandomQuote(); // Changed to displayRandomQuote
}

// Update the category filter dropdown
function updateCategoryFilter() {
  // Get all unique categories
  const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
  
  // Clear existing options
  categoryFilter.innerHTML = '';
  
  // Add new options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category === 'all' ? 'All Categories' : category;
    categoryFilter.appendChild(option);
  });
}

// Set up event listener for category filter
categoryFilter.addEventListener('change', displayRandomQuote); // Changed to displayRandomQuote

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
