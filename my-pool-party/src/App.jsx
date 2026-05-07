import React, { useState } from "react";
import "./App.css";

/*
  Replace these placeholder links with your actual Razorpay payment links.
  You need 10 links only because max count is 5.
*/
const PAYMENT_LINKS = {
  650: "https://rzp.io/rzp/C8kxES5",
  1300: "https://rzp.io/rzp/mB55y4D",
  1950: "https://rzp.io/rzp/koHUUxso",
  2600: "https://rzp.io/rzp/xLIadOhc",
  3250: "https://rzp.io/rzp/tc08cOd",

  1150: "https://rzp.io/rzp/zdTprxW",
  2300: "https://rzp.io/rzp/plbV6lX",
  3450: "https://rzp.io/rzp/nQCZVSG",
  4600: "https://rzp.io/rzp/1WW6skoe",
  5750: "https://rzp.io/rzp/sTvuVsTY",
};

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Nitrro%20Gym%20Swimming%20Pool%2C%20Kanhaiyya%20Nagar%2C%20Thane%20East%2C%20Thane%2C%20Maharashtra%20400603";

const MAP_EMBED_LINK =
  "https://maps.google.com/maps?q=Nitrro%20Gym%20Swimming%20Pool%2C%20Kanhaiyya%20Nagar%2C%20Thane%20East%2C%20Thane%2C%20Maharashtra%20400603&t=k&z=17&ie=UTF8&iwloc=&output=embed";

const TICKET_PRICE = 650;
const ICE_BATH_PRICE = 500;
const MAX_PEOPLE = 5;

const perks = [
  {
    icon: "🏊",
    title: "Pool Access",
    text: "Premium pool access for the perfect sundowner vibe.",
  },
  {
    icon: "🎵",
    title: "House Music",
    text: "Clean house music with poolside sundowner energy.",
  },
  {
    icon: "🍹",
    title: "Free Mocktails",
    text: "Refreshing mocktails included for registered guests.",
  },
  {
    icon: "☀️",
    title: "Sunscreen",
    text: "Sunscreen arranged so everyone stays pool-ready.",
  },
  {
    icon: "🏓",
    title: "Pickleball",
    text: "Pickleball access for fun games and challenges.",
  },
  {
    icon: "🧊",
    title: "Ice Bath Option",
    text: "Optional ice bath experience available during registration.",
  },
];

const ticketOptions = Array.from({ length: MAX_PEOPLE }, (_, index) => {
  const count = index + 1;

  return {
    count,
    label: `${count} ${count === 1 ? "Person" : "People"} - ₹${
      count * TICKET_PRICE
    }`,
  };
});

export default function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    instagram: "",
    ticketCount: 1,
    iceBathOptIn: false,
    pickleballOptIn: false,
    agreeTerms: false,
    fitForPool: false,
  });

  const [error, setError] = useState("");

  const ticketCount = Number(form.ticketCount || 1);
  const ticketTotal = ticketCount * TICKET_PRICE;
  const iceBathTotal = form.iceBathOptIn ? ticketCount * ICE_BATH_PRICE : 0;
  const totalAmount = ticketTotal + iceBathTotal;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };

  const validateForm = () => {
    if (!form.name || !form.age || !form.gender || !form.phone || !form.email) {
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

    if (ticketCount < 1 || ticketCount > MAX_PEOPLE) {
      setError(`You can book minimum 1 and maximum ${MAX_PEOPLE} people at a time.`);
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
      ticketCount,
      ticketPrice: TICKET_PRICE,
      ticketTotal: `₹${ticketTotal}`,
      iceBathSelected: form.iceBathOptIn,
      iceBathPricePerPerson: form.iceBathOptIn ? `₹${ICE_BATH_PRICE}` : "₹0",
      iceBathTotal: `₹${iceBathTotal}`,
      amount: `₹${totalAmount}`,
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

    const selectedPaymentLink = PAYMENT_LINKS[totalAmount];

    if (!selectedPaymentLink || selectedPaymentLink.includes("YOUR_")) {
      setError(`Payment link for ₹${totalAmount} is not added yet.`);
      return;
    }

    window.location.href = selectedPaymentLink;
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

        <div className="hero-main-card glass">
          <div className="hero-top-content">
            <p className="tag">10 MAY • 5:00 PM - 8:30 PM • THANE EAST</p>

            <h1>
              THANE’S ULTIMATE
              <br />
              SUNDOWNER
              <br />
              POOL PARTY
            </h1>

            <p className="subtitle">
               pool access, house music, mocktails, pickleball, ice bath
              option and complete summer energy at Nitrro Gym Swimming Pool.
            </p>

            

            <div className="hero-actions">
              <a href="#register">
                <button type="button">Register Now</button>
              </a>

              
            </div>
          </div>

          <div className="hero-includes">
            <div className="includes-heading">
              <p>WHAT’S INCLUDED</p>
              <h2>Everything for a perfect sundowner</h2>
            </div>

            <div className="hero-includes-grid">
              {perks.map((item, index) => (
                <div className="hero-include-card" key={index}>
                  <div className="include-icon">{item.icon}</div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="registration-section" id="register">
        <form className="form-box glass" onSubmit={handlePayment}>
          <div className="form-badge">ENTRY REGISTRATION</div>

          <h3>Register Now</h3>

          <p>
            Fill your details, select number of people, choose add-ons, accept
            the safety declaration, and continue to payment.
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
            placeholder="Instagram Handle Optional"
          />

          <div className="ticket-count-box">
            <label>Number of People</label>

            <select
              name="ticketCount"
              value={form.ticketCount}
              onChange={handleChange}
            >
              {ticketOptions.map((option) => (
                <option key={option.count} value={option.count}>
                  {option.label}
                </option>
              ))}
            </select>

            <small>Maximum 5 people can be booked at a time.</small>
          </div>

          <div className="amount-box">
            <span>Pool Party Ticket</span>
            <strong>
              ₹{TICKET_PRICE} × {ticketCount} = ₹{ticketTotal}
            </strong>
          </div>

          <div className="option-card">
            <label>
              <input
                type="checkbox"
                name="iceBathOptIn"
                checked={form.iceBathOptIn}
                onChange={handleChange}
              />

              <span>Add ice bath experience ₹{ICE_BATH_PRICE} per person</span>
            </label>
          </div>

          {form.iceBathOptIn && (
            <div className="amount-box">
              <span>Ice Bath Add-on</span>
              <strong>
                ₹{ICE_BATH_PRICE} × {ticketCount} = ₹{iceBathTotal}
              </strong>
            </div>
          )}

          <div className="amount-box total">
            <span>Total Amount</span>
            <strong>₹{totalAmount}</strong>
          </div>

          <div className="option-card">
            <label>
              <input
                type="checkbox"
                name="pickleballOptIn"
                checked={form.pickleballOptIn}
                onChange={handleChange}
              />

              <span>I am interested in playing pickleball.</span>
            </label>
          </div>

          <div className="terms-box">
            <h4>Terms & Conditions</h4>

            <ul>
              <li>Entry is allowed only with confirmed registration.</li>
              <li>No spot entries.</li>
              <li>Age 16+ only.</li>
              <li>Pool access is at your own risk.</li>
              <li>No running, pushing, or unsafe behavior near the pool.</li>
              <li>Proper swimwear or quick-dry athleisure is mandatory.</li>
              <li>No alcohol, smoking, or illegal substances allowed.</li>
              <li>Misconduct may result in removal without refund.</li>
              <li>Photos and videos may be used for promotional content.</li>
              <li>All ticket purchases are non-refundable.</li>
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

              <span>I have read and agree to all terms and conditions.</span>
            </label>

            <label>
              <input
                type="checkbox"
                name="fitForPool"
                checked={form.fitForPool}
                onChange={handleChange}
              />

              <span>I confirm I am physically fit for pool activity.</span>
            </label>
          </div>

          <button type="submit">Pay ₹{totalAmount}</button>

          <small>
            After successful payment, your Booking ID entry pass will be
            generated.
          </small>
        </form>
      </section>

      <section className="venue-final-section">
        <div className="venue-final-card glass">
          <div className="venue-content">
            <p className="tag">LOCATION DETAILS</p>

            <h2>
              <span>TIME &</span> VENUE
            </h2>

            <ul>
              <li>Date: 10th May 2026</li>
              <li>Time: 5:00 PM to 8:30 PM</li>
              <li>
                Venue: Nitrro Gym Swimming Pool, Kanhaiyya Nagar, Thane East,
                Thane, Maharashtra 400603
              </li>
            </ul>

            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer">
              <button type="button">Open Google Maps</button>
            </a>
          </div>

          <div className="about-map-card">
            <iframe
              title="Nitrro Gym Swimming Pool Satellite Map"
              src={MAP_EMBED_LINK}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <footer>
        <p>Rukna Mana Hai Pool Party × Nitrro Thane East</p>
      </footer>
    </div>
  );
}