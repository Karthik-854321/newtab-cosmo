// ===== Storage keys =====

const USER_PROFILE_KEY = "cosmotab-user-profile";
const LINKS_STORAGE_KEY = "cosmotab-links";
const TODO_STORAGE_KEY = "cosmotab-todos";

// ===== Helpers =====

function loadJSON(key) {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ===== User profile and avatar =====

function loadUserProfile() {
  return loadJSON(USER_PROFILE_KEY);
}

function saveUserProfile(profile) {
  saveJSON(USER_PROFILE_KEY, profile);
}

function applyAvatar(profile) {
  const avatarEl = document.getElementById("avatar");
  if (!avatarEl || !profile) return;

  avatarEl.className = "avatar"; // reset
  avatarEl.classList.remove("avatar-hidden");

  // Map simple avatar choice to sprite class
  let spriteClass = "dino-idle";
  switch (profile.avatar) {
    case "dino":
      spriteClass = "dino-walk";
      break;
    case "astronaut-m":
      spriteClass = "astronaut-m-idle";
      break;
    case "astronaut-f":
      spriteClass = "astronaut-f-idle";
      break;
    case "rocket":
      spriteClass = "rocket-fly";
      break;
    case "ufo":
      spriteClass = "ufo-float";
      break;
    default:
      spriteClass = "dino-idle";
  }

  avatarEl.classList.add(spriteClass);
}

function maybeShowUserSetup() {
  const profile = loadUserProfile();
  const modal = document.getElementById("user-setup-modal");
  const form = document.getElementById("user-setup-form");
  const nameInput = document.getElementById("user-name-input");
  const avatarSelect = document.getElementById("user-avatar-select");

  if (!modal || !form || !nameInput || !avatarSelect) return;

  if (!profile) {
    // First time: show modal
    modal.classList.remove("hidden");
    nameInput.focus();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const avatar = avatarSelect.value;

      if (!name || !avatar) return;

      const newProfile = { name, avatar };
      saveUserProfile(newProfile);
      modal.classList.add("hidden");
      updateGreetingAndFocus();
      applyAvatar(newProfile);
    });
  } else {
    // Already have profile
    applyAvatar(profile);
  }
}

// ===== Clock, date, greeting =====

function updateClockAndDate() {
  const now = new Date();

  const clockEl = document.getElementById("clock");
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString();
  }

  const dateEl = document.getElementById("date");
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

function updateGreetingAndFocus() {
  const now = new Date();
  const hour = now.getHours();
  let baseGreeting;

  if (hour < 5) baseGreeting = "Good night";
  else if (hour < 12) baseGreeting = "Good morning";
  else if (hour < 18) baseGreeting = "Good afternoon";
  else baseGreeting = "Good evening";

  const profile = loadUserProfile();
  const name = profile?.name || "traveler";

  const greetingEl = document.getElementById("greeting");
  if (greetingEl) {
    greetingEl.textContent = `${baseGreeting}, ${name}`;
  }

  const focusEl = document.getElementById("focus");
  if (focusEl) {
    focusEl.textContent = "Time to build CosmoTab and earn stardust.";
  }
}

function setupClockGreeting() {
  updateClockAndDate();
  updateGreetingAndFocus();
  setInterval(updateClockAndDate, 1000);
  setInterval(updateGreetingAndFocus, 60000);
}

// ===== Quick links with "+" and modal =====

function loadLinks() {
  return loadJSON(LINKS_STORAGE_KEY) || [];
}

function saveLinks(links) {
  saveJSON(LINKS_STORAGE_KEY, links);
}

function renderLinks(links) {
  const container = document.getElementById("links");
  if (!container) return;
  container.innerHTML = "";

  links.forEach((link, index) => {
    const chip = document.createElement("a");
    chip.href = link.url;
    chip.target = "_blank";
    chip.className = "link-chip";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = link.name;

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

    chip.appendChild(nameSpan);
    chip.appendChild(editBtn);
    chip.appendChild(deleteBtn);
    container.appendChild(chip);
  });
}

let currentLinkMode = "add";
let currentLinkIndex = null;
let linksCache = [];

function openLinkModal(mode, links, index = null) {
  currentLinkMode = mode;
  currentLinkIndex = index;
  linksCache = links;

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
    if (e.target === modal) {
      closeLinkModal();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    if (!name || !url) return;

    const links = linksCache.length ? linksCache : loadLinks();

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

// ===== Sticky notes =====

function loadTodos() {
  return loadJSON(TODO_STORAGE_KEY) || [];
}

function saveTodos(todos) {
  saveJSON(TODO_STORAGE_KEY, todos);
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
    doneBtn.textContent = todo.done ? "✔" : "✓";
    doneBtn.title = todo.done ? "Mark as not done" : "Mark as done";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "✎";
    editBtn.title = "Edit note";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "🗑";
    deleteBtn.title = "Delete note";

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

// ===== Init =====

document.addEventListener("DOMContentLoaded", () => {
  maybeShowUserSetup();
  setupClockGreeting();
  setupLinks();
  setupTodo();
});