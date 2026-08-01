// Clock and Date Updater
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const clockEl = document.getElementById("clock");
  if (clockEl) clockEl.textContent = timeStr;
 
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const dateEl = document.getElementById("date");
  if (dateEl) dateEl.textContent = dateStr;
}

updateClock();
setInterval(updateClock, 1000);

// Personalized Greeting Controller
function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  if (hour < 5) greeting = "Good night, Karthik";
  else if (hour < 12) greeting = "Good morning, Karthik";
  else if (hour < 18) greeting = "Good afternoon, Karthik";
  else greeting = "Good evening, Karthik";

  const greetingEl = document.getElementById("greeting");
  if (greetingEl) greetingEl.textContent = greeting;
}

// Fetch NASA APOD (Astronomy Picture of the Day) for real cosmic data & quotes
async function fetchNasaStardustData() {
  const focusEl = document.getElementById("focus");
  const bgOverlay = document.getElementById("bg-overlay");

  try {
    // Using NASA's public DEMO_KEY. (Can be swapped with a custom key later)
    const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
    const data = await response.json();

    if (data && data.url) {
      // Set NASA background image dynamically
      if (bgOverlay && data.media_type === "image") {
        bgOverlay.style.backgroundImage = `url('${data.url}')`;
      }

      // Display NASA title/explanation as custom stardust motivation for Stardance
      if (focusEl) {
        focusEl.innerHTML = `<strong>NASA APOD:</strong> "${data.title}" — <em>Time to code and ship stardust for Stardance!</em>`;
      }
    }
  } catch (error) {
    // Fallback fallback quote if offline or API limit hits
    if (focusEl) {
      focusEl.textContent = "“Time to code and earn stardust for Stardance. Keep building!”";
    }
  }
}
const LINKS_STORAGE_KEY = "cosmotab-links";

function loadLinks() {
  const raw = localStorage.getItem(LINKS_STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
}

function renderLinks(links) {
  const container = document.getElementById("links");
  if (!container) return;
  container.innerHTML = "";

  links.forEach((link, index) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.className = "link-chip";

    const span = document.createElement("span");
    span.textContent = link.name;

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "✎";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "✕";

    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openLinkModal("edit", links, index);
    });

    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      links.splice(index, 1);
      saveLinks(links);
      renderLinks(links);
    });

    a.appendChild(span);
    a.appendChild(editBtn);
    a.appendChild(deleteBtn);
    container.appendChild(a);
  });
}

let currentLinkMode = "add";
let currentLinkIndex = null;

function openLinkModal(mode, links, index = null) {
  currentLinkMode = mode;
  currentLinkIndex = index;

  const modal = document.getElementById("link-modal");
  const titleEl = document.getElementById("link-modal-title");
  const nameInput = document.getElementById("link-name");
  const urlInput = document.getElementById("link-url");

  if (!modal || !titleEl || !nameInput || !urlInput) return;

  if (mode === "edit" && index != null) {
    titleEl.textContent = "Edit Quick Link";
    nameInput.value = links[index].name;
    urlInput.value = links[index].url;
  } else {
    titleEl.textContent = "Add Quick Link";
    nameInput.value = "";
    urlInput.value = "";
  }

  modal.classList.remove("hidden");
  nameInput.focus();
}

function closeLinkModal() {
  const modal = document.getElementById("link-modal");
  if (modal) modal.classList.add("hidden");
}

function setupLinks() {
  let links = loadLinks();
  if (links.length === 0) {
    // Default useful links
    links = [
      { name: "Stardance", url: "https://stardance.hackclub.com" },
      { name: "GitHub", url: "https://github.com" },
      { name: "Hackatime", url: "https://hackatime.hackclub.com" },
    ];
    saveLinks(links);
  }

  renderLinks(links);

  const addBtn = document.getElementById("add-link-button");
  const modal = document.getElementById("link-modal");
  const form = document.getElementById("link-form");
  const cancelBtn = document.getElementById("link-cancel");
  const nameInput = document.getElementById("link-name");
  const urlInput = document.getElementById("link-url");

  if (!addBtn || !modal || !form || !cancelBtn || !nameInput || !urlInput) return;

  addBtn.addEventListener("click", () => {
    openLinkModal("add", links);
  });

  cancelBtn.addEventListener("click", () => {
    closeLinkModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLinkModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    if (!name || !url) return;

    if (currentLinkMode === "edit" && currentLinkIndex != null) {
      links[currentLinkIndex] = { name, url };
    } else {
      links.push({ name, url });
    }

    saveLinks(links);
    renderLinks(links);
    closeLinkModal();
  });
}
// Initialize Sequence
updateGreeting();
fetchNasaStardustData();

// Refresh clock/greetings every minute, NASA fetch once per session load
setInterval(updateGreeting, 60000);
setupTodo();
setupLinks();
updateClockAndGreeting(); // or whatever you named it
const TODO_STORAGE_KEY = "cosmotab-todos";

function loadTodos() {
  const raw = localStorage.getItem(TODO_STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos(todos) {
  const grid = document.getElementById("todo-grid");
  if (!grid) return;
  grid.innerHTML = "";

  todos.forEach((todo, index) => {
    const card = document.createElement("div");
    card.className = "sticky-note";
    if (todo.done) card.classList.add("done");

    const textEl = document.createElement("div");
    textEl.className = "sticky-note-text";
    textEl.textContent = todo.text;

    const footer = document.createElement("div");
    footer.className = "sticky-note-footer";

    const timeEl = document.createElement("span");
    timeEl.textContent = todo.createdAt || "";

    const btns = document.createElement("div");
    btns.className = "sticky-note-buttons";

    const doneBtn = document.createElement("button");
    doneBtn.type = "button";
    doneBtn.textContent = todo.done ? "Undo" : "Done";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";

    doneBtn.addEventListener("click", () => {
      todos[index].done = !todos[index].done;
      saveTodos(todos);
      renderTodos(todos);
    });

    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit note:", todo.text);
      if (newText != null) {
        todos[index].text = newText.trim();
        saveTodos(todos);
        renderTodos(todos);
      }
    });

    deleteBtn.addEventListener("click", () => {
      if (confirm("Delete this note?")) {
        todos.splice(index, 1);
        saveTodos(todos);
        renderTodos(todos);
      }
    });

    btns.appendChild(doneBtn);
    btns.appendChild(editBtn);
    btns.appendChild(deleteBtn);

    footer.appendChild(timeEl);
    footer.appendChild(btns);

    card.appendChild(textEl);
    card.appendChild(footer);
    grid.appendChild(card);
  });
}

function setupTodo() {
  let todos = loadTodos();
  renderTodos(todos);

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    const stamp = now.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    todos.push({
      text,
      done: false,
      createdAt: stamp,
    });
    saveTodos(todos);
    renderTodos(todos);
    input.value = "";
  });
}