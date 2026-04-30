import React from "react";
import "./App.css";

const perks = [
  { icon: "🎧", title: "DJ Booth", text: "EDM & house music with sundowner poolside energy." },
  { icon: "🏊", title: "Pool Access", text: "Jump in, chill out, and enjoy Thane’s first pool party." },
  { icon: "🍹", title: "Free Mocktails", text: "Refreshing mocktails served through the evening." },
  { icon: "☀️", title: "Sunscreen", text: "We’ve got sunscreen for everyone before the pool session." },
  { icon: "🏓", title: "Pickleball", text: "Two courts available for quick games and challenges." },
  { icon: "🧊", title: "Ice Bath", text: "A cool recovery zone for a fresh post-swim reset." },
];

export default function App() {
  return (
    <div className="app">
      <div className="liquid-bg"></div>
      <div className="liquid-blob blob-one"></div>
      <div className="liquid-blob blob-two"></div>
      <div className="jelly-orb"></div>

      <section className="hero" id="home">
        <nav className="navbar glass">
          <h2>
            RHM <span>SUNDOWNER</span>
          </h2>

          <div className="liquid-search">
            <span>Search pool, DJ, games...</span>
            <div className="divider"></div>
            <b>⌕</b>
          </div>

          <p>THANE’S FIRST EVER POOL PARTY</p>
        </nav>

        <div className="hero-inner">
          <div className="hero-content glass">
            <p className="tag">10 MAY • 5:00 PM - 8:30 PM • NITRRO THANE EAST</p>

            <h1>
              POOL PARTY
              <br />
              UNDER THE SUNSET
            </h1>

            <p className="subtitle">
              Dive into a premium sundowner with DJ, pool games, mocktails,
              pickleball, ice bath recovery, snacks and full summer energy.
            </p>

            <div className="hero-actions">
              <a href="#register">
                <button>Register Now</button>
              </a>
              <span>Limited entries only</span>
            </div>
          </div>

          <form className="form-box glass" id="register">
            <h3>REGISTER NOW</h3>
            <p>Book your spot for Thane’s first pool party.</p>

            <input placeholder="Full Name" />
            <input placeholder="Phone Number" />
            <input placeholder="Email Address" />
            <input placeholder="Instagram Handle" />

            <select defaultValue="">
              <option value="" disabled>
                Are you 18+?
              </option>
              <option>Yes</option>
              <option>No</option>
            </select>

            <button type="button">Submit Registration</button>
          </form>
        </div>
      </section>

      <section className="perks">
        <h2>
          <span>WHAT’S</span> INCLUDED
        </h2>

        <p className="section-subtitle">
          Everything planned to make your Sunday evening feel like a mini vacation.
        </p>

        <div className="perk-grid">
          {perks.map((item, index) => (
            <div className="perk-card glass" key={index}>
              <div className="mini-water"></div>
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about">
        <div className="about-visual">
          <div className="big-orb"></div>
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
            alt="Water party"
          />
        </div>

        <div className="about-content glass">
          <h2>
            <span>ABOUT</span> THE EVENT
          </h2>

          <p>
            Thane is hosting its first ever premium sundowner pool party.
            Expect clean pool access, EDM and house music, free mocktails,
            sunscreen, snacks, pool games, pickleball courts and an ice bath zone.
          </p>

          <ul>
            <li>Venue: Nitrro Wellness & Fitness Hub, Thane East</li>
            <li>Date: 10th May</li>
            <li>Time: 5:00 PM to 8:30 PM</li>
            <li>Music: EDM & House</li>
          </ul>

          <a href="#register">
            <button>Reserve Your Spot</button>
          </a>
        </div>
      </section>

      <footer>
        <p>RHM Sundowner × Nitrro Thane East</p>
      </footer>
    </div>
  );
}