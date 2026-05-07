import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "./supabaseClient";
import "./Admin.css";

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
    setTicket(null);
    setSearch("");
    setScannerActive(false);
  };

  const searchTicket = async (value = search) => {
    try {
      setLoading(true);
      setError("");
      setTicket(null);

      const query = value.trim();

      if (!query) {
        setError("Enter Booking ID, phone, name, email, or Instagram.");
        setLoading(false);
        return;
      }

      const safeQuery = query.replaceAll(",", "").replaceAll("'", "");

      const { data, error: searchError } = await supabase
        .from("tickets")
        .select("*")
        .or(
          `booking_id.ilike.%${safeQuery}%,phone.ilike.%${safeQuery}%,name.ilike.%${safeQuery}%,instagram.ilike.%${safeQuery}%,email.ilike.%${safeQuery}%`
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

  const markEntryValidAgain = async () => {
    try {
      if (!ticket) return;

      const { data, error: updateError } = await supabase
        .from("tickets")
        .update({ entry_status: "valid" })
        .eq("id", ticket.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      setTicket(data);
      setError("");
    } catch (err) {
      console.error("ENTRY UPDATE ERROR:", err);
      setError(err?.message || "Could not mark entry as valid.");
    }
  };

  const markPaymentPaid = async () => {
    try {
      if (!ticket) return;

      const { data, error: updateError } = await supabase
        .from("tickets")
        .update({ payment_status: "paid" })
        .eq("id", ticket.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      setTicket(data);
      setError("");
    } catch (err) {
      console.error("PAYMENT UPDATE ERROR:", err);
      setError(err?.message || "Could not mark payment as paid.");
    }
  };

  const markPaymentPending = async () => {
    try {
      if (!ticket) return;

      const { data, error: updateError } = await supabase
        .from("tickets")
        .update({ payment_status: "pending" })
        .eq("id", ticket.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      setTicket(data);
      setError("");
    } catch (err) {
      console.error("PAYMENT UPDATE ERROR:", err);
      setError(err?.message || "Could not mark payment as pending.");
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

  const displayValue = (value, fallback = "N/A") => {
    if (value === null || value === undefined || value === "") return fallback;
    return value;
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === "") return "₹0";
    const cleanValue = String(value).replace("₹", "");
    return `₹${cleanValue}`;
  };

  const ticketCount = Number(ticket?.ticket_count || ticket?.ticketCount || 1);
  const ticketPrice = Number(ticket?.ticket_price || ticket?.ticketPrice || 650);

  const ticketTotal = Number(
    ticket?.ticket_total || ticket?.ticketTotal || ticketCount * ticketPrice
  );

  const iceBathSelected =
    ticket?.ice_bath_selected === true ||
    ticket?.iceBathSelected === true ||
    ticket?.iceBathOptIn === true;

  const iceBathPrice = Number(
    ticket?.ice_bath_price || ticket?.iceBathPricePerPerson || 500
  );

  const iceBathTotal = Number(
    ticket?.ice_bath_total ||
      ticket?.iceBathTotal ||
      (iceBathSelected ? ticketCount * iceBathPrice : 0)
  );

  const finalAmount = Number(
    ticket?.final_amount ||
      ticket?.amount?.toString?.().replace("₹", "") ||
      ticketTotal + iceBathTotal
  );

  const pickleballSelected =
    ticket?.pickleball_opt_in === true || ticket?.pickleballOptIn === true;

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
          Scan QR or search by Booking ID, phone, name, email, or Instagram.
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
            placeholder="Booking ID / phone / name / email / Instagram"
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

              <h2>{displayValue(ticket.booking_id, "No Booking ID")}</h2>

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
              <h2>{displayValue(ticket.name, "Guest Name")}</h2>

              <div>
                <strong>Phone</strong>
                <span>{displayValue(ticket.phone)}</span>
              </div>

              <div>
                <strong>Email</strong>
                <span>{displayValue(ticket.email)}</span>
              </div>

              <div>
                <strong>Instagram</strong>
                <span>{displayValue(ticket.instagram, "Optional / Not Added")}</span>
              </div>

              <div>
                <strong>Age</strong>
                <span>{displayValue(ticket.age)}</span>
              </div>

              <div>
                <strong>Gender</strong>
                <span>{displayValue(ticket.gender)}</span>
              </div>

              <div>
                <strong>Package</strong>
                <span>
                  {displayValue(ticket.package_type || ticket.packageType, "Pool Party")}
                </span>
              </div>

              <div>
                <strong>People Count</strong>
                <span>{ticketCount}</span>
              </div>

              <div>
                <strong>Ticket Price</strong>
                <span>₹{ticketPrice} per person</span>
              </div>

              <div>
                <strong>Ticket Total</strong>
                <span>
                  ₹{ticketPrice} × {ticketCount} = ₹{ticketTotal}
                </span>
              </div>

              <div>
                <strong>Ice Bath</strong>
                <span>{iceBathSelected ? "Yes" : "No"}</span>
              </div>

              {iceBathSelected && (
                <div>
                  <strong>Ice Bath Total</strong>
                  <span>
                    ₹{iceBathPrice} × {ticketCount} = ₹{iceBathTotal}
                  </span>
                </div>
              )}

              <div>
                <strong>Pickleball</strong>
                <span>{pickleballSelected ? "Yes" : "No"}</span>
              </div>

              <div className="final-amount-row">
                <strong>Final Amount</strong>
                <span>{formatAmount(finalAmount)}</span>
              </div>

              <div>
                <strong>Payment</strong>
                <span
                  className={
                    ticket.payment_status === "paid"
                      ? "payment-pill paid"
                      : "payment-pill pending"
                  }
                >
                  {displayValue(ticket.payment_status, "pending")}
                </span>
              </div>

              <div>
                <strong>Entry Status</strong>
                <span>{displayValue(ticket.entry_status, "valid")}</span>
              </div>

              <div>
                <strong>Created At</strong>
                <span>
                  {ticket.created_at
                    ? new Date(ticket.created_at).toLocaleString("en-IN")
                    : displayValue(ticket.createdAt)}
                </span>
              </div>
            </div>

            <div className="admin-actions admin-actions-bottom">
              <button
                className={ticket.entry_status === "used" ? "disabled-btn" : ""}
                onClick={markEntryUsed}
                disabled={ticket.entry_status === "used"}
              >
                {ticket.entry_status === "used"
                  ? "Entry Already Used"
                  : "Mark Entry as Used"}
              </button>

              {ticket.entry_status === "used" && (
                <button className="secondary-btn" onClick={markEntryValidAgain}>
                  Mark Entry Valid Again
                </button>
              )}

              {ticket.payment_status === "paid" ? (
                <button className="secondary-btn" onClick={markPaymentPending}>
                  Mark Payment Pending
                </button>
              ) : (
                <button className="secondary-btn" onClick={markPaymentPaid}>
                  Mark Payment Paid
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}