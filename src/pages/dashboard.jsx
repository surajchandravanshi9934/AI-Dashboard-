// src/components/Dashboard.jsx
import React, { useEffect } from "react";
import "../App.css";

import { initDashboard } from "../components/logic";
import { Link } from "react-router-dom";

const Dashboard = () => {
  useEffect(() => {
    initDashboard();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="container" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px 0" }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: "28px",
            background: "linear-gradient(90deg,#e9f0ff,#9bf1ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI Powered Personal Dashboard
        </div>
        <div style={{ marginLeft: "auto" }} className="pill">
          Provider:
          <select
            id="provider"
            style={{ background: "transparent", border: "none", color: "inherit" }}
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
      </header>

      {/* Main */}
      <main className="container">
        {/* Row 1 */}
        <div className="grid">
          {/* Mood Tracker */}
          <section className="card section col-6">
            <h2>😊 Mood Tracker</h2>
            <div className="moods">
              <button data-mood="😊">😊</button>
              <button data-mood="😐">😐</button>
              <button data-mood="😕">😕</button>
              <button data-mood="😞">😞</button>
              <button data-mood="😡">😡</button>
              <button data-mood="🔥">🔥</button>
            </div>
            <div className="kv">
              <span className="muted">Today:</span>
              <span id="mood-today" className="badge">
                None
              </span>
            </div>
            <div style={{ marginTop: "8px" }}>
              <button className="btn ghost" id="mood-advice">
                Get AI Advice
              </button>
            </div>
            <div id="mood-ai-out" style={{ marginTop: "8px" }}></div>
          </section>

          {/* To-Do */}
          <section className="card section col-6">
            <h2>📝 To-Do / Task Manager</h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input id="todo-input" className="input" placeholder="Add task…" />
              <select id="todo-priority" className="input">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
              <button className="btn primary" id="todo-add">
                Add
              </button>
              <button className="btn ghost" id="todo-ai-prio">
                AI Prioritize
              </button>
            </div>
            <div className="list" id="todo-list"></div>
          </section>
        </div>

        {/* Row 2 */}
        <div className="grid">
          {/* Pomodoro */}
          <section className="card section col-4">
            <h2>⏱️ Pomodoro Focus</h2>
            <div
              id="timer"
              style={{
                fontSize: "42px",
                fontWeight: 900,
                textAlign: "center",
                padding: "8px 0",
              }}
            >
              25:00
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn" id="start">
                Start
              </button>
              <button className="btn" id="pause">
                Pause
              </button>
              <button className="btn" id="reset">
                Reset
              </button>
            </div>
          </section>

          {/* Habit Tracker */}
          <section className="card section col-4">
            <h2>📈 Habit Tracker</h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                id="habit-input"
                className="input"
                placeholder="New habit (e.g., Read 20m)"
              />
              <button className="btn primary" id="habit-add">
                Add
              </button>
              <button className="btn ghost" id="habit-ai">
                AI Suggestions
              </button>
            </div>
            <div id="habit-list" className="list"></div>
          </section>

          {/* Notes / Goals */}
          <section className="card section col-4">
            <h2>🎯 Daily Goals / Notes</h2>
            <textarea
              id="notes"
              className="input"
              style={{ width: "100%", minHeight: "120px" }}
              placeholder="Write goals or notes for today…"
            ></textarea>
            <div style={{ marginTop: "8px" }}>
              <button className="btn ghost" id="plan-ai">
                Generate Today’s Plan (AI)
              </button>
            </div>
          </section>
        </div>

        {/* Row 3 */}
        <div className="grid">
          {/* AI Chat */}
          <section className="card section col-8">
            <h2>💬 AI Chat Assistant</h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                id="q"
                className="input"
                placeholder="Ask anything (study tips, ideas…)"
              />
              <button className="btn primary" id="ask">
                Ask
              </button>
            </div>
            <div id="chat-out" className="list" style={{ marginTop: "8px" }}></div>
          </section>

          {/* Quote */}
          <section className="card section col-4">
            <h2>💡 Motivational Quote</h2>
            <div id="quote" className="quote">
              “Action is the foundational key to all success.”
            </div>
            <div style={{ marginTop: "8px" }}>
              <button className="btn ghost" id="quote-refresh">
                New Quote
              </button>
            </div>
          </section>
        </div>

        {/* Row 4 */}
        <div className="home-container">
          <Link to="/" className="home-btn">
            🏠 Return to Home
          </Link>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
