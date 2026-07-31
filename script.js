function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
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