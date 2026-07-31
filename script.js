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

  const focusEl = document.getElementById("focus");
  if (focusEl) focusEl.textContent = "Time to code and earn stardust.";
}

function updateClockAndGreeting() {
  updateClock();
  updateGreeting();
}

updateClockAndGreeting();
setInterval(updateClockAndGreeting, 60000); // update every minute