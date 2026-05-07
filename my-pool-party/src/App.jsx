import React, { useEffect, useState } from "react";
import "./App.css";

const PAYMENT_LINKS = {
  650: "https://rzp.io/rzp/ZgtwVmr",
  1300: "https://rzp.io/rzp/S8og1Qx",
  1950: "https://rzp.io/rzp/WqYUKisG",
  2600: "https://rzp.io/rzp/WCBWwzEa",
  3250: "https://rzp.io/rzp/DE0ejGOc",

  1150: "https://rzp.io/rzp/dfyUby8",
  2300: "https://rzp.io/rzp/Lo51twe",
  3450: "https://rzp.io/rzp/tyPOcox",
  4600: "https://rzp.io/rzp/EtFkSOvi",
  5750: "https://rzp.io/rzp/NSd0cKE",
};

const TICKET_PRICE = 650;
const ICE_BATH_PRICE = 500;

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
    title: "Ice Bath",
    text: "Optional ice bath add-on at ₹500 per person.",
  },
];

export default function App() {
  const [peopleCount, setPeopleCount] = useState(1);

  const [contact, setContact] = useState({
    phone: "",
    email: "",
    instagram: "",
  });

  const [participants, setParticipants] = useState([
    { name: "", age: "", gender: "" },
  ]);

  const [iceBathSelected, setIceBathSelected] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [fitForPool, setFitForPool] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setParticipants((prev) => {
      const current = [...prev];

      if (peopleCount > current.length) {
        const extra = Array.from(
          { length: peopleCount - current.length },
          () => ({
            name: "",
            age: "",
            gender: "",
          })
        );

        return [...current, ...extra];
      }

      return current.slice(0, peopleCount);
    });
  }, [peopleCount]);

  const ticketTotal = peopleCount * TICKET_PRICE;
  const iceBathTotal = iceBathSelected ? peopleCount * ICE_BATH_PRICE : 0;
  const finalAmount = ticketTotal + iceBathTotal;

  const handleContactChange = (field, value) => {
    setContact((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleParticipantChange = (index, field, value) => {
    setParticipants((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });

    setError("");
  };

  const validateForm = () => {
    if (!contact.phone || !contact.email || !contact.instagram) {
      setError("Please fill contact number, email and Instagram handle.");
      return false;
    }

    if (contact.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid contact number.");
      return false;
    }

    if (!contact.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    for (let i = 0; i < participants.length; i++) {
      const person = participants[i];

      if (!person.name || !person.age || !person.gender) {
        setError(`Please fill all details for Person ${i + 1}.`);
        return false;
      }

      if (Number(person.age) < 16) {
        setError(`Person ${i + 1} must be 16+.`);
        return false;
      }
    }

    if (!agreeTerms || !fitForPool) {
      setError("Please accept the mandatory declarations.");
      return false;
    }

    if (!PAYMENT_LINKS[finalAmount]) {
      setError(`Payment link for ₹${finalAmount} is not configured.`);
      return false;
    }

    return true;
  };

  const saveBookingAndPay = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const bookingPayload = {
      contact,
      participants,
      peopleCount,
      iceBathSelected,
      ticketPrice: TICKET_PRICE,
      iceBathPrice: ICE_BATH_PRICE,
      ticketTotal,
      iceBathTotal,
      finalAmount,
      packageType: iceBathSelected ? "Pool Party + Ice Bath" : "Pool Party",
      event: "Rukna Mana Hai Pool Party",
      venue:
        "Nitrro Gym Swimming Pool, Kanhaiyya Nagar, Thane East, Thane, Maharashtra 400603",
      eventDate: "10 May 2026",
      eventTime: "5:00 PM - 8:30 PM",
      locationLink: GOOGLE_MAPS_LINK,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("poolPartyBooking", JSON.stringify(bookingPayload));

    localStorage.removeItem("poolPartyGroupId");
    localStorage.removeItem("poolPartyTicketCreated");
    localStorage.removeItem("poolPartyTickets");
    localStorage.removeItem("poolPartyEmailSent");

    window.location.href = PAYMENT_LINKS[finalAmount];
  };

  return (
    <div className="app">
      <div className="liquid-bg"></div>
      <div className="liquid-blob blob-one"></div>
      <div className="liquid-blob blob-two"></div>
      <div className="jelly-orb"></div>

      <section className="hero">
        <nav className="navbar glass">
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
              Dive into a premium sundowner with EDM and house music, pool
              games, free mocktails, sunscreen, snacks, pickleball courts and
              complete summer energy.
            </p>

            <div className="hero-mini-info">
              <div>
                <strong>₹650</strong>
                <span>Per Person</span>
              </div>

              <div>
                <strong>₹500</strong>
                <span>Ice Bath Add-on</span>
              </div>

              <div>
                <strong>5 PM</strong>
                <span>Entry Time</span>
              </div>
            </div>

            <div className="hero-actions">
              <a href="#register">
                <button type="button">Register Now</button>
              </a>

              <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noreferrer">
                <button type="button">Open Location</button>
              </a>

              <span>Limited curated entries only</span>
            </div>
          </div>

          <div className="hero-includes">
            <div className="includes-heading">
              <p>WHAT’S INCLUDED</p>
              <h2>Poolside experience built for the perfect sundowner.</h2>
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
        <form className="form-box glass" onSubmit={saveBookingAndPay}>
          <div className="form-badge">ENTRY REGISTRATION</div>

          <h3>Register Now</h3>

          <p>
            Select number of people, enter every participant’s details and pay
            the dynamic total amount.
          </p>

          {error && <div className="error">{error}</div>}

          <div className="ticket-count-box">
            <label>Total People</label>

            <select
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option value={num} key={num}>
                  {num} {num === 1 ? "Person" : "People"}
                </option>
              ))}
            </select>

            <small>
              A separate ticket entry will be created for every person.
            </small>
          </div>

          <div className="section-group">
            <h4>Primary Contact</h4>

            <input
              value={contact.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              placeholder="Contact Number *"
              type="tel"
            />

            <input
              value={contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              placeholder="Email Address *"
              type="email"
            />

            <input
              value={contact.instagram}
              onChange={(e) =>
                handleContactChange("instagram", e.target.value)
              }
              placeholder="Instagram Handle *"
            />
          </div>

          <div className="participants-wrapper">
            <h4>Participant Details</h4>

            {participants.map((person, index) => (
              <div className="participant-card" key={index}>
                <h5>Person {index + 1}</h5>

                <input
                  value={person.name}
                  onChange={(e) =>
                    handleParticipantChange(index, "name", e.target.value)
                  }
                  placeholder={`Person ${index + 1} Full Name *`}
                />

                <div className="two-field-grid">
                  <input
                    value={person.age}
                    onChange={(e) =>
                      handleParticipantChange(index, "age", e.target.value)
                    }
                    placeholder="Age *"
                    type="number"
                  />

                  <select
                    value={person.gender}
                    onChange={(e) =>
                      handleParticipantChange(index, "gender", e.target.value)
                    }
                  >
                    <option value="">Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">
                      Prefer not to say
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="option-card">
            <label>
              <input
                type="checkbox"
                checked={iceBathSelected}
                onChange={(e) => setIceBathSelected(e.target.checked)}
              />

              <span>
                Add Ice Bath Experience <b>₹500 per person</b>
              </span>
            </label>
          </div>

          <div className="amount-breakdown">
            <div className="amount-box">
              <span>Pool Party</span>
              <strong>
                ₹{TICKET_PRICE} × {peopleCount} = ₹{ticketTotal}
              </strong>
            </div>

            <div className="amount-box">
              <span>Ice Bath</span>
              <strong>
                {iceBathSelected
                  ? `₹${ICE_BATH_PRICE} × ${peopleCount} = ₹${iceBathTotal}`
                  : "Not selected"}
              </strong>
            </div>

            <div className="amount-box total">
              <span>Total Payable</span>
              <strong>₹{finalAmount}</strong>
            </div>
          </div>

          <div className="terms-box">
            <h4>Terms & Conditions</h4>

            <ul>
              <li>Entry is allowed only with confirmed registration.</li>
              <li>No spot entries.</li>
              <li>Age 16+ only.</li>
              <li>Pool access is at your own risk.</li>
              <li>No running, pushing, or unsafe behavior near the pool.</li>
              <li>No alcohol, smoking, or illegal substances.</li>
              <li>Proper swimwear or quick-dry athleisure is mandatory.</li>
              <li>All ticket purchases are non-refundable.</li>
            </ul>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />

              <span>I have read and agree to all terms and conditions.</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={fitForPool}
                onChange={(e) => setFitForPool(e.target.checked)}
              />

              <span>
                I confirm all participants are physically fit for pool activity.
              </span>
            </label>
          </div>

          <button type="submit">Pay ₹{finalAmount}</button>

          <small>
            After successful payment, every participant will get a separate
            Booking ID and QR entry pass.
          </small>
        </form>
      </section>

      <section className="venue-final-section">
        <div className="venue-final-card glass">
          <div className="venue-content">
            <h2>
              Event <span>Location</span>
            </h2>

            <ul>
              <li>Nitrro Gym Swimming Pool</li>
              <li>Kanhaiyya Nagar, Thane East</li>
              <li>Thane, Maharashtra 400603</li>
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