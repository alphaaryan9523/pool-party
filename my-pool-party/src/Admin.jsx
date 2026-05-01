import React, { useState } from "react";
import "./App.css";

const POOL_PARTY_LINK = "PASTE_500_RUPEE_RAZORPAY_LINK_HERE";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Nitrro%20Gym%20Swimming%20Pool%2C%20Kanhaiyya%20Nagar%2C%20Thane%20East%2C%20Thane%2C%20Maharashtra%20400603";

const MAP_EMBED_LINK =
  "https://maps.google.com/maps?q=Nitrro%20Gym%20Swimming%20Pool%2C%20Kanhaiyya%20Nagar%2C%20Thane%20East%2C%20Thane%2C%20Maharashtra%20400603&t=k&z=17&ie=UTF8&iwloc=&output=embed";

const perks = [
  {
    icon: "🎧",
    title: "DJ Booth",
    text: "EDM & house music with sundowner poolside energy.",
  },
  {
    icon: "🏊",
    title: "Pool Access",
    text: "Swimming pool access for the ultimate summer vibe.",
  },
  {
    icon: "🍹",
    title: "Free Mocktails",
    text: "Refreshing mocktails included for all registered guests.",
  },
  {
    icon: "☀️",
    title: "Sunscreen",
    text: "Sunscreen arranged so everyone stays pool-ready.",
  },
  {
    icon: "🏓",
    title: "Pickleball",
    text: "Two pickleball courts for fun games and challenges.",
  },
  {
    icon: "🧊",
    title: "Ice Bath Add-on",
    text: "Optional ₹500 ice bath experience. Registration link will be sent on WhatsApp.",
  },
];

export default function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    instagram: "",
    packageType: "Pool Party",
    iceBathOptIn: false,
    agreeTerms: false,
    fitForPool: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };

  const validateForm = () => {
    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.phone ||
      !form.email ||
      !form.instagram
    ) {
      setError("Please fill all required fields.");
      return false;
    }

    if (Number(form.age) < 16) {
      setError("Age must be 16+ to register for this event.");
      return false;
    }

    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid contact number.");
      return false;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!form.agreeTerms || !form.fitForPool) {
      setError("Please accept the mandatory declarations.");
      return false;
    }

    return true;
  };

  const saveUserDetails = () => {
    const ticketUser = {
      ...form,
      amount: "₹500",
      event: "Rukna Mana Hai Pool Party",
      date: "10 May 2026",
      time: "5:00 PM - 8:30 PM",
      venue:
        "Nitrro Gym Swimming Pool, Kanhaiyya Nagar, Thane East, Thane, Maharashtra 400603",
      locationLink: GOOGLE_MAPS_LINK,
      status: "payment_pending",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("poolPartyUser", JSON.stringify(ticketUser));

    localStorage.removeItem("poolPartyTicketId");
    localStorage.removeItem("poolPartyBookingId");
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    saveUserDetails();

    if (POOL_PARTY_LINK.includes("PASTE_") || POOL_PARTY_LINK.trim() === "") {
      setError("Payment link is not added yet. Please add Razorpay link.");
      return;
    }

    window.location.href = POOL_PARTY_LINK;
  };

  return (
    <div className="app">
      <div className="liquid-bg"></div>
      <div className="liquid-blob blob-one"></div>
      <div className="liquid-blob blob-two"></div>
      <div className="jelly-orb"></div>

      <section className="hero" id="home">
        <nav className="navbar glass navbar-no-search">
          <h2>
            Rukna Mana Hai <span>Pool Party</span>
          </h2>

          <p>THANE’S ULTIMATE SUNDOWNER POOL PARTY</p>
        </nav>

        <div className="hero-inner">
          <div className="hero-content glass">
            <p className="tag">10 MAY • 5:00 PM - 8:30 PM • THANE EAST</p>

            <h1>
              THANE’S ULTIMATE
              <br />
              SUNDOWNER POOL PARTY
            </h1>

            <p className="subtitle">
              Dive into a premium sundowner with EDM and house music, pool
              games, free mocktails, sunscreen, snacks, pickleball courts and
              complete summer energy.
            </p>

            <div className="hero-info">
              <div>
                <strong>Pool Party</strong>
                <span>₹500</span>
              </div>

              <div>
                <strong>Time</strong>
                <span>5 PM - 8:30 PM</span>
              </div>

              <div>
                <strong>Venue</strong>
                <span>Nitrro Gym Swimming Pool</span>
              </div>
            </div>

            <div className="venue-box">
              <strong>Location</strong>

              <p>
                Nitrro Gym Swimming Pool, Kanhaiyya Nagar, Thane East, Thane,
                Maharashtra 400603
              </p>

              <div className="satellite-map-card">
                <iframe
                  title="Nitrro Gym Swimming Pool Satellite Map"
                  src={MAP_EMBED_LINK}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer">
                <button type="button">Open Google Maps</button>
              </a>
            </div>

            <div className="hero-actions">
              <a href="#register">
                <button type="button">Register Now</button>
              </a>
              <span>Limited curated entries only</span>
            </div>
          </div>

          <form className="form-box glass" id="register" onSubmit={handlePayment}>
            <div className="form-badge">ENTRY REGISTRATION</div>

            <h3>Register Now</h3>

            <p>
              Fill your details, accept the safety declaration, and continue to
              secure payment.
            </p>

            {error && <div className="error">{error}</div>}

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name *"
            />

            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age *"
              type="number"
            />

            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Contact Number *"
              type="tel"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address *"
              type="email"
            />

            <input
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="Instagram Handle *"
            />

            <select
              name="packageType"
              value={form.packageType}
              onChange={handleChange}
            >
              <option value="Pool Party">Pool Party - ₹500</option>
            </select>

            <div className="icebath-option">
              <label>
                <input
                  type="checkbox"
                  name="iceBathOptIn"
                  checked={form.iceBathOptIn}
                  onChange={handleChange}
                />
                <span>
                  Would you like to opt for the ice bath experience?
                  <b> ₹500 add-on.</b> Registration link will be sent on
                  WhatsApp.
                </span>
              </label>
            </div>

            <div className="terms-box">
              <h4>Terms & Conditions</h4>

              <ul>
                <li>
                  Entry is allowed only with confirmed registration. No spot
                  entries.
                </li>
                <li>
                  This is a curated event. Organizers reserve the right to
                  approve or deny entry.
                </li>
                <li>Age 16+ only.</li>
                <li>
                  Pool access is at your own risk. Participants should be
                  comfortable in water.
                </li>
                <li>
                  No running, pushing, or unsafe behavior in or around the pool.
                </li>
                <li>
                  No entry into the pool if you have skin infections, allergies,
                  open wounds, or communicable conditions.
                </li>
                <li>
                  Proper swimwear or quick-dry athleisure is mandatory for pool
                  use.
                </li>
                <li>
                  Allowed: swimwear, nylon, polyester, spandex, dry-fit,
                  non-cotton athleisure.
                </li>
                <li>No food or beverages allowed in or around the pool area.</li>
                <li>
                  Strictly no alcohol, smoking, or illegal substances inside the
                  premises.
                </li>
                <li>
                  Any misconduct, nuisance, or harassment will result in removal
                  without refund.
                </li>
                <li>
                  Participants must follow all instructions from organizers and
                  venue staff.
                </li>
                <li>
                  Any damage to property, pool area, or pickleball equipment
                  will be charged.
                </li>
                <li>
                  Photos and videos will be captured. By attending, you consent
                  to promotional use without compensation.
                </li>
                <li>
                  Participation is entirely at your own risk. Organizers and
                  venue are not responsible for injury, loss, theft, or health
                  issues.
                </li>
                <li>
                  Organizers may modify, pause, or cancel the event due to
                  safety, weather, or unforeseen issues.
                </li>
                <li>
                  All ticket purchases are non-refundable. No refunds for
                  cancellation, no-show, or late arrival.
                </li>
              </ul>
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                />
                <span>
                  I have read and agree to all terms and conditions. I
                  understand the risks involved and agree to follow organizer and
                  venue rules.
                </span>
              </label>

              <label>
                <input
                  type="checkbox"
                  name="fitForPool"
                  checked={form.fitForPool}
                  onChange={handleChange}
                />
                <span>
                  I confirm I am physically fit and have no medical conditions
                  restricting pool activity.
                </span>
              </label>
            </div>

            <button type="submit">Pay ₹500</button>

            <small>
              After successful payment, your Booking ID and QR entry pass will
              be generated and sent to your email.
            </small>
          </form>
        </div>
      </section>

      <section className="perks">
        <h2>
          <span>WHAT’S</span> INCLUDED
        </h2>

        <p className="section-subtitle">
          Everything planned to make your Sunday evening feel like a mini
          vacation.
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
            Thane’s ultimate sundowner pool party brings together clean pool
            access, EDM and house music, free mocktails, sunscreen, snacks, pool
            games, pickleball courts and an optional ice bath experience.
          </p>

          <ul>
            <li>
              Venue: Nitrro Gym Swimming Pool, Kanhaiyya Nagar, Thane East
            </li>
            <li>Date: 10th May 2026</li>
            <li>Time: 5:00 PM to 8:30 PM</li>
            <li>Music: EDM & House</li>
            <li>Includes: Pool access, mocktails, snacks and games</li>
            <li>Optional add-on: Ice bath experience at ₹500</li>
          </ul>

          <div className="about-map-card">
            <iframe
              title="Nitrro Gym Swimming Pool Satellite Map About"
              src={MAP_EMBED_LINK}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer">
            <button type="button">View Location</button>
          </a>
        </div>
      </section>

      <footer>
        <p>Rukna Mana Hai Pool Party × Nitrro Thane East</p>
      </footer>
    </div>
  );
}