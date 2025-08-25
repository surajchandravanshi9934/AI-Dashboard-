// src/logic.js
import { askGemini } from "./Gemini";

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

// Initialize the dashboard functionality
export function initDashboard() {
  const $ = (selector) => document.querySelector(selector);
  
  // Initialize quotes
  const qEl = $("#quote");
  if (qEl) {
    qEl.textContent = LS.get("quote", randomQuote());
    
    // Add event listener for quote refresh
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
    
    // Add event listeners to mood buttons
    document.querySelectorAll(".moods button").forEach((btn) => {
      btn.addEventListener("click", () => {
        todayMood = btn.dataset.mood;
        moodTodayEl.textContent = todayMood;
        LS.set("mood", todayMood);
      });
    });
    
    // Mood AI Advice
    $("#mood-advice")?.addEventListener("click", async () => {
      const out = $("#mood-ai-out");
      if (!todayMood || todayMood === "None") {
        out.textContent = "Select a mood first.";
        return;
      }
      out.textContent = "Thinking…";
      try {
        const text = await askGemini(
          `User mood: ${todayMood}. Short, practical tips (3-5 bullets) for productivity + wellbeing today.`,
          220
        );
        out.innerHTML = text.replaceAll("\n", "<br>");
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

    // AI Prioritize
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
        todoList.innerHTML = text.replaceAll("\n", "<br>");
      } catch (e) {
        todoList.innerHTML = "Error: " + e.message;
      }
    });
  }

  // ---------------- Pomodoro Timer ----------------
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
        habitList.innerHTML = text.replaceAll("\n", "<br>");
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
        out.innerHTML = plan.replaceAll("\n", "<br>");
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
      out.innerHTML = `<b>You:</b> ${q}<br><b>AI:</b> ${ans.replaceAll(
        "\n",
        "<br>"
      )}`;
    } catch (e) {
      out.innerHTML = "Error: " + e.message;
    }
  });
}

// Remove the DOMContentLoaded event listener since we're calling initDashboard manually
export default initDashboard;