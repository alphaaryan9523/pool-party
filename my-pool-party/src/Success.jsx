import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import emailjs from "@emailjs/browser";
import { supabase } from "./supabaseClient";
import "./App.css";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function generateBookingId(index) {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RHM-${random}-${index + 1}`;
}

function generateGroupId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `GROUP-${random}`;
}

export default function Success() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    generateTickets();
  }, []);

  const sendTicketEmail = async (ticketRows) => {
    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        setEmailStatus("Tickets generated, but EmailJS setup is missing.");
        return;
      }

      const leadTicket = ticketRows[0];

      const ticketList = ticketRows
        .map(
          (ticket, index) =>
            `${index + 1}. ${ticket.name} - ${ticket.booking_id}`
        )
        .join("\n");

      const templateParams = {
        to_email: leadTicket.email,
        name: leadTicket.name,
        booking_id: leadTicket.group_id,
        event: leadTicket.event,
        package_type: leadTicket.package_type,
        event_date: leadTicket.event_date,
        event_time: leadTicket.event_time,
        venue: leadTicket.venue,
        phone: leadTicket.phone,
        instagram: leadTicket.instagram,
        payment_id: leadTicket.razorpay_payment_id || "Online Payment",
        ticket_list: ticketList,
        final_amount: `₹${leadTicket.final_amount}`,
        total_people: leadTicket.total_people,
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      setEmailStatus(`Ticket email sent to ${leadTicket.email}`);
    } catch (emailErr) {
      console.error("EMAIL ERROR:", emailErr);
      setEmailStatus("Tickets generated, but email failed to send.");
    }
  };

  const generateTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const savedBooking = localStorage.getItem("poolPartyBooking");

      if (!savedBooking) {
        setError("No registration details found. Please register first.");
        setLoading(false);
        return;
      }

      const booking = JSON.parse(savedBooking);

      if (!booking.participants || booking.participants.length === 0) {
        setError("No participant details found.");
        setLoading(false);
        return;
      }

      const savedTickets = localStorage.getItem("poolPartyTickets");

      if (
        localStorage.getItem("poolPartyTicketCreated") === "true" &&
        savedTickets
      ) {
        setTickets(JSON.parse(savedTickets));
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);

      const razorpayPaymentId =
        params.get("razorpay_payment_id") ||
        params.get("payment_id") ||
        "Online Payment";

      const paymentReference =
        params.get("razorpay_payment_link_id") ||
        params.get("razorpay_payment_link_reference_id") ||
        params.get("reference_id") ||
        "";

      const groupId =
        localStorage.getItem("poolPartyGroupId") || generateGroupId();

      localStorage.setItem("poolPartyGroupId", groupId);

      const ticketRows = await Promise.all(
        booking.participants.map(async (person, index) => {
          const bookingId = generateBookingId(index);
          const ticketId = crypto.randomUUID();

          const qrPayload = {
            booking_id: bookingId,
            group_id: groupId,
            name: person.name,
            person_number: index + 1,
            total_people: booking.peopleCount,
          };

          const qrData = JSON.stringify(qrPayload);

          const qrCode = await QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
          });

          return {
            id: ticketId,
            group_id: groupId,
            booking_id: bookingId,

            name: person.name,
            age: person.age,
            gender: person.gender,

            phone: booking.contact.phone,
            email: booking.contact.email,
            instagram: booking.contact.instagram,

            person_number: index + 1,
            total_people: booking.peopleCount,

            package_type: booking.packageType,
            ticket_price: booking.ticketPrice,
            ice_bath_selected: booking.iceBathSelected,
            ice_bath_price: booking.iceBathPrice,

            ticket_total: booking.ticketTotal,
            ice_bath_total: booking.iceBathTotal,
            final_amount: booking.finalAmount,

            event: booking.event,
            venue: booking.venue,
            event_date: booking.eventDate,
            event_time: booking.eventTime,

            qr_data: qrData,
            qr_code: qrCode,

            razorpay_payment_id: razorpayPaymentId,
            payment_reference: paymentReference,

            payment_status: "paid",
            entry_status: "valid",
          };
        })
      );

      const { data, error: supabaseError } = await supabase
        .from("tickets")
        .insert(ticketRows)
        .select("*");

      if (supabaseError) {
        console.log(
          "FULL SUPABASE ERROR:",
          JSON.stringify(supabaseError, null, 2)
        );
        throw supabaseError;
      }

      const finalTickets = data || ticketRows;

      localStorage.setItem("poolPartyTickets", JSON.stringify(finalTickets));
      localStorage.setItem("poolPartyTicketCreated", "true");

      setTickets(finalTickets);
      setLoading(false);

      if (!localStorage.getItem("poolPartyEmailSent")) {
        await sendTicketEmail(finalTickets);
        localStorage.setItem("poolPartyEmailSent", "true");
      } else {
        setEmailStatus(`Ticket email already sent to ${finalTickets[0].email}`);
      }
    } catch (err) {
      console.error("TICKET ERROR:", err);

      setError(
        err?.message ||
          err?.details ||
          err?.hint ||
          JSON.stringify(err) ||
          "Something went wrong while generating tickets."
      );

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="success-page">
        <div className="success-card glass">
          <h1>Generating Your Entry Passes...</h1>
          <p>Please wait while we create tickets for all participants.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="success-card glass">
          <div className="success-badge error-badge">ERROR</div>

          <h1>Unable to Generate Pass</h1>

          <p className="success-subtitle">{error}</p>

          <a href="/">
            <button>Go Back to Registration</button>
          </a>
        </div>
      </div>
    );
  }

  const leadTicket = tickets[0];

  return (
    <div className="success-page">
      <div className="success-card glass">
        <div className="success-badge">PAYMENT SUCCESSFUL</div>

        <h1>Entry Passes Generated 🎉</h1>

        <p className="success-subtitle">
          {tickets.length} separate ticket
          {tickets.length > 1 ? "s" : ""} created successfully.
        </p>

        {emailStatus && <p className="email-status">{emailStatus}</p>}

        <div className="booking-pass">
          <p>Group ID</p>
          <h2>{leadTicket?.group_id}</h2>
          <span>Total Paid: ₹{leadTicket?.final_amount}</span>
        </div>

        <div className="success-tickets-grid">
          {tickets.map((ticket) => (
            <div className="success-ticket-card" key={ticket.id}>
              <h2>{ticket.name}</h2>

              <div className="qr-box">
                <img src={ticket.qr_code} alt={ticket.booking_id} />
              </div>

              <div className="ticket-details ticket-details-full">
                <div>
                  <strong>Booking ID</strong>
                  <span>{ticket.booking_id}</span>
                </div>

                <div>
                  <strong>Person</strong>
                  <span>
                    {ticket.person_number} of {ticket.total_people}
                  </span>
                </div>

                <div>
                  <strong>Package</strong>
                  <span>{ticket.package_type}</span>
                </div>

                <div>
                  <strong>Entry Status</strong>
                  <span>{ticket.entry_status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="entry-note">
          Screenshot all passes. Each person has a separate Booking ID and QR.
        </p>

        <a href="/">
          <button>Back to Home</button>
        </a>
      </div>
    </div>
  );
}