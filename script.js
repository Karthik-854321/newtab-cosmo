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

// Initialize Sequence
updateGreeting();
fetchNasaStardustData();

// Refresh clock/greetings every minute, NASA fetch once per session load
setInterval(updateGreeting, 60000);