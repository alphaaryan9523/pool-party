import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "./supabaseClient";
import "./App.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("poolPartyAdmin") === "true"
  );

  const [search, setSearch] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginAdmin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("poolPartyAdmin", "true");
      setIsAdmin(true);
      setError("");
    } else {
      setError("Wrong admin password.");
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("poolPartyAdmin");
    setIsAdmin(false);
    setPassword("");
  };

  const searchTicket = async (value = search) => {
    try {
      setLoading(true);
      setError("");
      setTicket(null);

      const query = value.trim();

      if (!query) {
        setError("Enter Booking ID, phone, name, or Instagram.");
        setLoading(false);
        return;
      }

      const { data, error: searchError } = await supabase
        .from("tickets")
        .select("*")
        .or(
          `booking_id.ilike.%${query}%,phone.ilike.%${query}%,name.ilike.%${query}%,instagram.ilike.%${query}%`
        )
        .limit(1)
        .maybeSingle();

      if (searchError) throw searchError;

      if (!data) {
        setError("No booking found.");
        setLoading(false);
        return;
      }

      setTicket(data);
      setLoading(false);
    } catch (err) {
      console.error("ADMIN SEARCH ERROR:", err);
      setError(err?.message || "Search failed.");
      setLoading(false);
    }
  };

  const markEntryUsed = async () => {
    try {
      if (!ticket) return;

      if (ticket.entry_status === "used") {
        setError("This booking is already marked as used.");
        return;
      }

      const { data, error: updateError } = await supabase
        .from("tickets")
        .update({ entry_status: "used" })
        .eq("id", ticket.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      setTicket(data);
      setError("");
    } catch (err) {
      console.error("ENTRY UPDATE ERROR:", err);
      setError(err?.message || "Could not mark entry as used.");
    }
  };

  useEffect(() => {
    if (!scannerActive || !isAdmin) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          let bookingId = decodedText;

          try {
            const parsed = JSON.parse(decodedText);
            bookingId = parsed.booking_id || parsed.bookingId || decodedText;
          } catch {
            bookingId = decodedText;
          }

          setSearch(bookingId);
          setScannerActive(false);

          await scanner.clear();
          await searchTicket(bookingId);
        } catch (err) {
          console.error(err);
          setError("Could not read QR code.");
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannerActive, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-card glass">
          <div className="success-badge">ADMIN LOGIN</div>
          <h1>Entry Dashboard</h1>
          <p className="success-subtitle">Enter admin password to continue.</p>

          <div className="admin-search">
            <input
              type="password"
              value={password}
              placeholder="Admin password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") loginAdmin();
              }}
            />
            <button onClick={loginAdmin}>Login</button>
          </div>

          {error && <div className="admin-error">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-card glass">
        <div className="admin-top">
          <div>
            <div className="success-badge">ADMIN DASHBOARD</div>
            <h1>Entry Verification</h1>
          </div>

          <button className="secondary-btn" onClick={logoutAdmin}>
            Logout
          </button>
        </div>

        <p className="success-subtitle">
          Scan QR or search by Booking ID, phone, name, or Instagram.
        </p>

        <div className="admin-actions">
          <button onClick={() => setScannerActive(!scannerActive)}>
            {scannerActive ? "Close Scanner" : "Open QR Scanner"}
          </button>
        </div>

        {scannerActive && (
          <div className="scanner-box">
            <div id="qr-reader"></div>
          </div>
        )}

        <div className="admin-search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Booking ID / phone / name / Instagram"
            onKeyDown={(e) => {
              if (e.key === "Enter") searchTicket();
            }}
          />
          <button onClick={() => searchTicket()}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {ticket && (
          <div className="admin-result">
            <div className="booking-pass small-pass">
              <p>Booking ID</p>
              <h2>{ticket.booking_id}</h2>

              <span
                className={
                  ticket.entry_status === "used"
                    ? "admin-status used"
                    : "admin-status valid"
                }
              >
                {ticket.entry_status === "used" ? "Already Used" : "Valid Entry"}
              </span>
            </div>

            <div className="ticket-details ticket-details-full">
              <h2>{ticket.name}</h2>

              <div>
                <strong>Phone</strong>
                <span>{ticket.phone}</span>
              </div>

              <div>
                <strong>Email</strong>
                <span>{ticket.email}</span>
              </div>

              <div>
                <strong>Instagram</strong>
                <span>{ticket.instagram}</span>
              </div>

              <div>
                <strong>Package</strong>
                <span>{ticket.package_type}</span>
              </div>

              <div>
                <strong>Payment</strong>
                <span>{ticket.payment_status}</span>
              </div>

              <div>
                <strong>Entry Status</strong>
                <span>{ticket.entry_status}</span>
              </div>
            </div>

            <button
              className={ticket.entry_status === "used" ? "disabled-btn" : ""}
              onClick={markEntryUsed}
              disabled={ticket.entry_status === "used"}
            >
              {ticket.entry_status === "used"
                ? "Entry Already Used"
                : "Mark Entry as Used"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}