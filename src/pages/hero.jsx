// src/components/Hero.jsx
import React from "react";

import "../App.css";
import { Link } from "react-router-dom";
// import "../styles/hero.css";

const HeroSection = () => {
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#69B7FF" />
                <stop offset="1" stopColor="#3CE0FF" />
              </linearGradient>
            </defs>
            <rect
              x="1"
              y="1"
              rx="10"
              ry="10"
              width="42"
              height="42"
              fill="none"
              stroke="url(#g)"
              strokeWidth="2"
            />
            <rect
              x="5"
              y="5"
              rx="10"
              ry="10"
              width="34"
              height="34"
              fill="url(#g)"
              opacity="0.2"
            />
            <text
              x="22"
              y="27"
              textAnchor="middle"
              fontWeight="800"
              fontFamily="Poppins, Arial"
              fontSize="16"
              fill="#9AD7FF"
            >
              AI
            </text>
          </svg>
          <span style={{ fontWeight: 800, fontSize: "28px" }}>Dashboard</span>
        </div>
        <div>
          <Link className="pill" to="/dashboard">
            Open Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* Left Side */}
        <div className="left">
          <h1>
            Your AI Powered
            <br />
            Dashboard
          </h1>
          <p className="sub">Stay productive, focused, and balanced with AI</p>
          <Link to={"/dashboard"}>
            <button className="btn primary">Get Started</button>
          </Link>
        </div>

        {/* Right Side */}
        <div className="right">
          <div className="ring"></div>

          {/* Main SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 520" width="440">
            <defs>
              <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F7FAFF" />
                <stop offset="1" stopColor="#DDE7F7" />
              </linearGradient>
              <linearGradient id="shadowMetal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#D5E1F5" />
                <stop offset="1" stopColor="#BBD0EE" />
              </linearGradient>
              <radialGradient id="screenGlow" cx="50%" cy="45%" r="60%">
                <stop offset="0" stopColor="#1ED4FF" />
                <stop offset="1" stopColor="#0B2D66" />
              </radialGradient>
              <radialGradient id="blueGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0" stopColor="#55D6FF" stopOpacity="1" />
                <stop offset="1" stopColor="#2C5BFF" stopOpacity="0.2" />
              </radialGradient>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Ellipses */}
            <ellipse
              cx="260"
              cy="470"
              rx="180"
              ry="38"
              fill="url(#blueGlow)"
              opacity="0.9"
            />
            <ellipse cx="260" cy="460" rx="120" ry="24" fill="#000" opacity="0.25" />

            {/* Legs */}
            <g filter="url(#softGlow)">
              <rect
                x="200"
                y="360"
                width="36"
                height="70"
                rx="18"
                fill="url(#shadowMetal)"
              />
              <ellipse cx="218" cy="440" rx="34" ry="16" fill="url(#metal)" />
              <rect
                x="284"
                y="360"
                width="36"
                height="70"
                rx="18"
                fill="url(#shadowMetal)"
              />
              <ellipse cx="302" cy="440" rx="34" ry="16" fill="url(#metal)" />
            </g>

            {/* Body */}
            <g filter="url(#softGlow)">
              <rect
                x="190"
                y="250"
                width="140"
                height="120"
                rx="60"
                fill="url(#metal)"
              />
              <rect
                x="230"
                y="300"
                width="60"
                height="40"
                rx="12"
                fill="#E6EEFF"
                opacity="0.6"
              />
            </g>

            {/* Arms */}
            <g filter="url(#softGlow)">
              <rect
                x="150"
                y="290"
                width="40"
                height="28"
                rx="14"
                fill="url(#shadowMetal)"
              />
              <rect
                x="138"
                y="310"
                width="28"
                height="28"
                rx="14"
                fill="url(#metal)"
              />
              <rect
                x="330"
                y="290"
                width="40"
                height="28"
                rx="14"
                fill="url(#shadowMetal)"
              />
              <rect
                x="354"
                y="310"
                width="28"
                height="28"
                rx="14"
                fill="url(#metal)"
              />
            </g>

            {/* Head */}
            <g filter="url(#softGlow)">
              <rect
                x="190"
                y="160"
                width="140"
                height="110"
                rx="40"
                fill="url(#metal)"
              />
              <rect
                x="206"
                y="176"
                width="108"
                height="78"
                rx="26"
                fill="url(#screenGlow)"
              />
              <circle cx="240" cy="215" r="10" fill="#B6F3FF" />
              <circle cx="280" cy="215" r="10" fill="#B6F3FF" />
            </g>
          </svg>

          {/* Decorative Elements */}
          <div className="beams">
            <div className="beam b1"></div>
            <div className="beam b2"></div>
            <div className="beam b3"></div>
            <div className="beam b4"></div>
          </div>
          <div className="podium"></div>
        </div>
      </section>

      {/* Footer */}
      <div className="footer"></div>
    </div>
  );
};

export default HeroSection;
