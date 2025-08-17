/***** ========== CORE: QUOTES + STORAGE ========== *****/

// Safe load from localStorage (fallback to defaults)
function loadQuotes() {
  try {
    const raw = localStorage.getItem("quotes");
    if (!raw) return [
      { text: "The best way to predict the future is to create it.", category: "Motivation" },
      { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
      { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", category: "Wisdom" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
    ];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
let quotes = loadQuotes();

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/***** ========== UI HELPERS ========== *****/

function getEl(id) { return document.getElementById(id) || null; }

function displayQuote(quote) {
  const displayDiv = getEl("quoteDisplay");
  if (!displayDiv || !quote) return;
  displayDiv.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>- Category: ${quote.category}</em></small>
  `;
}

function displayQuotes(list) {
  const displayDiv = getEl("quoteDisplay");
  if (!displayDiv) return;
  displayDiv.innerHTML = "";
  if (!list || list.length === 0) {
    displayDiv.innerHTML = "<p>No quotes to show.</p>";
    return;
  }
  list.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}"`;
    const s = document.createElement("small");
    s.innerHTML = `<em>- Category: ${q.category}</em>`;
    displayDiv.appendChild(p);
    displayDiv.appendChild(s);
  });
}

function notify(message, visibleMs = 3000) {
  const n = getEl("syncNotification");
  if (!n) return;
  n.textContent = message;
  n.style.display = "block";
  if (visibleMs > 0) {
    setTimeout(() => { n.style.display = "none"; }, visibleMs);
  }
}

/***** ========== EXISTING FEATURES (kept) ========== *****/

function showRandomQuote() {
  if (!quotes.length) return;
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];
  displayQuote(q);
  try { sessionStorage.setItem("lastQuote", JSON.stringify(q)); } catch {}
}

function addQuote() {
  const textInput = getEl("newQuoteText");
  const categoryInput = getEl("newQuoteCategory");
  if (!textInput || !categoryInput) return;

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  if (!text || !category) return;

  quotes.push({ text, category });
  saveQuotes();
  displayQuote({ text, category });

  textInput.value = "";
  categoryInput.value = "";

  // If category filter exists, refresh it
  if (typeof populateCategories === "function") populateCategories();
}

/***** ========== OPTIONAL: IMPORT / EXPORT (kept to avoid missing refs) ========== *****/

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

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON");
      // Normalize to {text, category}
      const normalized = imported
        .filter(item => item && item.text)
        .map(item => ({
          text: String(item.text),
          category: item.category ? String(item.category) : "Imported"
        }));
      // Merge (local wins only if text not on imported)
      const importedSet = new Set(normalized.map(q => q.text.trim().toLowerCase()));
      const localOnly = quotes.filter(q => !importedSet.has(q.text.trim().toLowerCase()));
      quotes = [...normalized, ...localOnly]; // imported takes precedence
      saveQuotes();
      displayQuotes(quotes);
      if (typeof populateCategories === "function") populateCategories();
      notify("Quotes imported successfully!");
    } catch {
      alert("Error reading JSON file");
    }
  };
  if (event?.target?.files?.[0]) fileReader.readAsText(event.target.files[0]);
}

/***** ========== FILTERING SUPPORT (safe if dropdown exists) ========== *****/

function populateCategories() {
  const sel = getEl("categoryFilter");
  if (!sel) return; // not present on this page
  sel.innerHTML = '<option value="all">All Categories</option>';
  const cats = [...new Set(quotes.map(q => q.category))].sort();
  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    sel.appendChild(opt);
  });
  const saved = localStorage.getItem("selectedCategory");
  if (saved) {
    sel.value = saved;
    filterQuotes();
  }
}

function filterQuotes() {
  const sel = getEl("categoryFilter");
  if (!sel) return;
  const value = sel.value;
  localStorage.setItem("selectedCategory", value);
  if (value === "all") displayQuotes(quotes);
  else displayQuotes(quotes.filter(q => q.category === value));
}

/***** ========== SERVER SYNC + CONFLICT HANDLING ========== *****/

/* 
  We try to fetch from JSONPlaceholder to simulate a server.
  We map posts -> { text, category: "Server" } to match your schema.
  If fetch fails (offline, CORS, etc.), we fall back to a local simulation.
*/

// Local simulated server data (schema matches app: {text, category})
const serverQuotesSim = [
  { text: "Server: Progress is impossible without change.", category: "Wisdom" },
  { text: "Server: Small steps every day.", category: "Motivation" },
  { text: "Server: Quality over quantity.", category: "Life" }
];

async function fetchServerQuotes() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5", { cache: "no-store" });
    if (!res.ok) throw new Error("Bad response");
    const posts = await res.json();
    // Map to our schema
    return posts.map(p => ({
      text: String(p.title || `Post ${p.id}`),
      category: "Server"
    }));
  } catch {
    // Fallback to local simulation if network fails
    return serverQuotesSim;
  }
}

// Detect conflicts by text (case-insensitive, trimmed)
function findConflicts(localArr, serverArr) {
  const localSet = new Set(localArr.map(q => q.text.trim().toLowerCase()));
  const serverSet = new Set(serverArr.map(q => q.text.trim().toLowerCase()));
  const conflicts = [];
  serverSet.forEach(t => { if (localSet.has(t)) conflicts.push(t); });
  return conflicts;
}

// Merge with server-wins: keep all server items; add only local items not present by text
function mergeServerWins(serverArr, localArr) {
  const serverSet = new Set(serverArr.map(q => q.text.trim().toLowerCase()));
  const localOnly = localArr.filter(q => !serverSet.has(q.text.trim().toLowerCase()));
  return [...serverArr, ...localOnly];
}

async function syncQuotes() {
  const fetched = await fetchServerQuotes();
  const currentLocal = loadQuotes(); // re-read to be safe if other tabs modified it
  const conflicts = findConflicts(currentLocal, fetched);
  const merged = mergeServerWins(fetched, currentLocal);

  // Persist + update in-memory
  quotes = merged;
  saveQuotes();

  // Refresh UI
  const sel = getEl("categoryFilter");
  if (sel) {
    // keep current filter
    filterQuotes();
    populateCategories(); // in case "Server" category was added
  } else {
    displayQuotes(quotes);
  }

  if (conflicts.length > 0) {
    notify(`Conflicts resolved: Server data has been synced (${conflicts.length} conflict${conflicts.length > 1 ? "s" : ""}).`);
  } else {
    notify("Data synced: No conflicts detected.");
  }
}

/***** ========== EVENT WIRING ========== *****/

// Show random quote button (if present)
const newQuoteBtn = getEl("newQuote");
if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);

// Manual sync button
const syncBtn = getEl("syncBtn");
if (syncBtn) syncBtn.addEventListener("click", syncQuotes);

// Auto sync every 10s
let syncTimer = null;
function startAutoSync() {
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(syncQuotes, 10000);
}
startAutoSync();

// Tweet milestone
const tweetLink = getEl("tweetMilestone");
if (tweetLink) {
  tweetLink.addEventListener("click", (e) => {
    e.preventDefault();
    const msg = "I just built a Dynamic Quote Generator with server sync & conflict resolution!";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

/***** ========== INITIAL RENDER ========== *****/

window.addEventListener("load", () => {
  // Restore last viewed quote (session) or show list
  try {
    const last = sessionStorage.getItem("lastQuote");
    if (last) displayQuote(JSON.parse(last));
    else displayQuotes(quotes);
  } catch {
    displayQuotes(quotes);
  }
  // Prepare filter dropdown if present
  populateCategories();
});



let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
const quotesList = document.getElementById("quotes-list");
const quoteInput = document.getElementById("quote-input");
const addQuoteBtn = document.getElementById("add-quote-btn");
const exportBtn = document.getElementById("export-btn");

// ✅ Step 1: Fetch quotes from "server"
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    // Take first 5 items and map to quotes
    return data.slice(0, 5).map(item => item.title);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
}

// ✅ Step 2: Sync local storage with server
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    if (!quotes.includes(serverQuote)) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    renderQuotes();
    showNotification("Quotes synced with server (server data takes precedence).");
  }
}

// ✅ Step 3: Show notification in UI
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.className = "notification";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ✅ Step 4: Render quotes
function renderQuotes() {
  quotesList.innerHTML = "";
  quotes.forEach(q => {
    const li = document.createElement("li");
    li.textContent = q;
    quotesList.appendChild(li);
  });
}

// ✅ Add new quote
addQuoteBtn.addEventListener("click", () => {
  const newQuote = quoteInput.value.trim();
  if (newQuote) {
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    renderQuotes();
    quoteInput.value = "";
  }
});

// ✅ Export quotes
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

// ✅ Run sync periodically (every 10s for demo)
setInterval(syncWithServer, 10000);


/***** ========== SERVER SYNC ========== *****/

// Mock server URL (using JSONPlaceholder)
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Simulate server data structure
function toServerFormat(localQuotes) {
  return {
    id: 1, // Fixed ID for our mock
    title: "Quote Data",
    body: JSON.stringify({
      quotes: localQuotes,
      timestamp: Date.now()
    }),
    userId: 1
  };
}

function fromServerFormat(serverData) {
  try {
    const parsed = JSON.parse(serverData.body);
    return {
      quotes: parsed.quotes || [],
      timestamp: parsed.timestamp || 0
    };
  } catch {
    return { quotes: [], timestamp: 0 };
  }
}

// Fetch quotes from server
async function fetchFromServer() {
  try {
    const response = await fetch(`${SERVER_URL}/1`);
    if (!response.ok) throw new Error('Server error');
    const data = await response.json();
    return fromServerFormat(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return { quotes: [], timestamp: 0 };
  }
}

// Post quotes to server - UPDATED WITH PROPER POST CONFIGURATION
async function postToServer(quotesToPost) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toServerFormat(quotesToPost))
    });
    
    if (!response.ok) throw new Error('Post failed');
    const data = await response.json();
    return fromServerFormat(data);
  } catch (error) {
    console.error('Post error:', error);
    return { quotes: [], timestamp: 0 };
  }
}

// Conflict resolution strategy
function resolveConflicts(localQuotes, serverQuotes) {
  // Simple strategy: server wins for conflicts
  const localMap = new Map(localQuotes.map(q => [q.text, q]));
  const serverMap = new Map(serverQuotes.map(q => [q.text, q]));
  
  // Merge with server taking precedence
  const merged = [];
  const allTexts = new Set([...localMap.keys(), ...serverMap.keys()]);
  
  for (const text of allTexts) {
    if (serverMap.has(text)) {
      merged.push(serverMap.get(text));
    } else if (localMap.has(text)) {
      merged.push(localMap.get(text));
    }
  }
  
  return merged;
}

// ✅ Initial load
renderQuotes();
syncWithServer();

