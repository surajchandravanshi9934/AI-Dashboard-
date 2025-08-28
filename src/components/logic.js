// src/logic.js
import { askGemini } from "./Gemini";
import { marked } from "marked"; // ✅ import marked

// Create a utility function for localStorage with error handling
const LS = {
  get: (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch (_) {
      return d;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  },
};

// Quotes data
const QUOTES = [
  "Small steps every day lead to big results.",
  "Discipline beats motivation.",
  "Focus on one task. Finish it.",
  "You don't need more time, you need more focus.",
  "Consistency compounds like interest.",
];

// Helper function to get a random quote
const randomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

// Timer variables
let timer = 25 * 60;
let interval = null;

// Format time for display
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

// -------- Speech Function --------
function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel(); // stop old speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    speechSynthesis.speak(utterance);

    LS.set("lastAI", text);
  } else {
    console.warn("Speech Synthesis not supported in this browser.");
  }
}

// Initialize the dashboard functionality
export function initDashboard() {
  const $ = (selector) => document.querySelector(selector);

  // ---------------- Quotes ----------------
  const qEl = $("#quote");
  if (qEl) {
    qEl.textContent = LS.get("quote", randomQuote());
    $("#quote-refresh")?.addEventListener("click", () => {
      const q = randomQuote();
      qEl.textContent = q;
      LS.set("quote", q);
    });
  }

  // ---------------- Mood Tracker ----------------
  const moodTodayEl = $("#mood-today");
  let todayMood = LS.get("mood", "None");

  if (moodTodayEl) {
    moodTodayEl.textContent = todayMood;

    document.querySelectorAll(".moods button").forEach((btn) => {
      btn.addEventListener("click", () => {
        todayMood = btn.dataset.mood;
        moodTodayEl.textContent = todayMood;
        LS.set("mood", todayMood);
      });
    });

    $("#mood-advice")?.addEventListener("click", async () => {
      const out = $("#mood-ai-out");
      if (!todayMood || todayMood === "None") {
        out.textContent = "Select a mood first.";
        return;
      }
      out.innerHTML = "Thinking…";
      try {
        const text = await askGemini(
          `User mood: ${todayMood}. Short, practical tips (3-5 bullets) for productivity + wellbeing today.`,
          220
        );
        out.innerHTML = `<div class="ai-output">${marked.parse(text)}</div>`;
        speak(text);
      } catch (e) {
        out.textContent = "Error: " + e.message;
      }
    });
  }

  // ---------------- To-Do ----------------
  const todoList = $("#todo-list");
  let todos = LS.get("todos", []);

  const renderTodos = () => {
    if (!todoList) return;
    todoList.innerHTML = "";
    todos.forEach((t, i) => {
      const el = document.createElement("div");
      el.className = "list-item";
      el.innerHTML = `
        <span>${t.text} <small>[${t.priority}]</small></span>
        <button data-i="${i}" class="btn small">✕</button>
      `;
      el.querySelector("button").onclick = () => {
        todos.splice(i, 1);
        LS.set("todos", todos);
        renderTodos();
      };
      todoList.appendChild(el);
    });
  };

  if (todoList) {
    renderTodos();

    $("#todo-add")?.addEventListener("click", () => {
      const txt = $("#todo-input").value.trim();
      const pr = $("#todo-priority").value;
      if (!txt) return;
      todos.push({ text: txt, priority: pr });
      LS.set("todos", todos);
      renderTodos();
      $("#todo-input").value = "";
    });

    $("#todo-ai-prio")?.addEventListener("click", async () => {
      if (todos.length === 0) return;
      todoList.innerHTML = "AI reordering...";
      try {
        const text = await askGemini(
          `Here are my tasks: ${todos
            .map((t) => t.text + " (" + t.priority + ")")
            .join(", ")}. 
          Reorder them from highest to lowest priority with reasons.`,
          250
        );
        todoList.innerHTML = `<div class="ai-output">${marked.parse(text)}</div>`;
        speak(text);
      } catch (e) {
        todoList.innerHTML = "Error: " + e.message;
      }
    });
  }

  // ---------------- Pomodoro ----------------
  const timerEl = $("#timer");
  if (timerEl) {
    timerEl.textContent = formatTime(timer);

    $("#start")?.addEventListener("click", () => {
      if (interval) return;
      interval = setInterval(() => {
        timer--;
        timerEl.textContent = formatTime(timer);
        if (timer <= 0) {
          clearInterval(interval);
          interval = null;
          alert("Pomodoro complete! Take a break.");
        }
      }, 1000);
    });

    $("#pause")?.addEventListener("click", () => {
      clearInterval(interval);
      interval = null;
    });

    $("#reset")?.addEventListener("click", () => {
      clearInterval(interval);
      interval = null;
      timer = 25 * 60;
      timerEl.textContent = formatTime(timer);
    });
  }

  // ---------------- Habits ----------------
  const habitList = $("#habit-list");
  let habits = LS.get("habits", []);

  const renderHabits = () => {
    if (!habitList) return;
    habitList.innerHTML = "";
    habits.forEach((h, i) => {
      const el = document.createElement("div");
      el.className = "list-item";
      el.innerHTML = `<span>${h}</span> <button data-i="${i}" class="btn small">✕</button>`;
      el.querySelector("button").onclick = () => {
        habits.splice(i, 1);
        LS.set("habits", habits);
        renderHabits();
      };
      habitList.appendChild(el);
    });
  };

  if (habitList) {
    renderHabits();

    $("#habit-add")?.addEventListener("click", () => {
      const txt = $("#habit-input").value.trim();
      if (!txt) return;
      habits.push(txt);
      LS.set("habits", habits);
      renderHabits();
      $("#habit-input").value = "";
    });

    $("#habit-ai")?.addEventListener("click", async () => {
      habitList.innerHTML = "AI suggesting habits…";
      try {
        const text = await askGemini(
          `Suggest 5 simple daily habits for productivity, health, and learning.`,
          180
        );
        habitList.innerHTML = `<div class="ai-output">${marked.parse(text)}</div>`;
        speak(text);
      } catch (e) {
        habitList.innerHTML = "Error: " + e.message;
      }
    });
  }

  // ---------------- Notes + AI Plan ----------------
  const notesEl = $("#notes");
  if (notesEl) {
    notesEl.value = LS.get("notes", "");
    notesEl.addEventListener("input", () => LS.set("notes", notesEl.value));

    $("#plan-ai")?.addEventListener("click", async () => {
      const txt = notesEl.value;
      const out = $("#chat-out");
      out.innerHTML = "AI generating plan…";
      try {
        const plan = await askGemini(
          `Here are my notes/goals: ${txt}. Create a structured action plan for today.`,
          250
        );
        out.innerHTML = `<div class="ai-output">${marked.parse(plan)}</div>`;
        speak(plan);
      } catch (e) {
        out.innerHTML = "Error: " + e.message;
      }
    });
  }

  // ---------------- AI Chat ----------------
  $("#ask")?.addEventListener("click", async () => {
    const q = $("#q").value.trim();
    if (!q) return;
    const out = $("#chat-out");
    out.innerHTML = "AI thinking…";
    try {
      const ans = await askGemini(q, 280);
      out.innerHTML = `
        <div class="ai-output">
          <b>You:</b> ${q}<br><br>
          <b>AI:</b> ${marked.parse(ans)}
        </div>`;
      speak(ans);
    } catch (e) {
      out.innerHTML = "Error: " + e.message;
    }
  });

  // -------- Speak last AI output once on refresh --------
  const lastAI = LS.get("lastAI", "");
  if (lastAI) {
    setTimeout(() => {
      speak(lastAI);
    }, 500);
  }
}

export default initDashboard;
