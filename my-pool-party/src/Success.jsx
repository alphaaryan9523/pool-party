import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import emailjs from "@emailjs/browser";
import { supabase } from "./supabaseClient";
import "./App.css";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function generateBookingId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `RHM-${random}`;
}

export default function Success() {
  const [ticket, setTicket] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    generateTicket();
  }, []);

  const sendTicketEmail = async (ticketData) => {
    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        setEmailStatus("Ticket generated, but EmailJS setup is missing.");
        return;
      }

      const templateParams = {
        to_email: ticketData.email,
        name: ticketData.name,
        booking_id: ticketData.booking_id,
        event: ticketData.event,
        package_type: ticketData.package_type,
        event_date: ticketData.event_date,
        event_time: ticketData.event_time,
        venue: ticketData.venue,
        phone: ticketData.phone,
        instagram: ticketData.instagram,
        payment_id: ticketData.razorpay_payment_id || "N/A",
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setEmailStatus(`Ticket email sent to ${ticketData.email}`);
    } catch (emailErr) {
      console.error("EMAIL ERROR:", emailErr);
      setEmailStatus("Ticket generated, but email could not be sent.");
    }
  };

  const generateTicket = async () => {
    try {
      setLoading(true);
      setError("");

      const savedUser = localStorage.getItem("poolPartyUser");

      if (!savedUser) {
        setError("No registration details found. Please register first.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(savedUser);

      if (!user.name || !user.phone || !user.email) {
        setError("Incomplete registration details found. Please register again.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);

      const razorpayPaymentId =
        params.get("razorpay_payment_id") ||
        params.get("payment_id") ||
        "";

      const paymentReference =
        params.get("razorpay_payment_link_id") ||
        params.get("razorpay_payment_link_reference_id") ||
        params.get("reference_id") ||
        "";

      let ticketId = localStorage.getItem("poolPartyTicketId");
      let bookingId = localStorage.getItem("poolPartyBookingId");

      if (!ticketId) {
        ticketId = crypto.randomUUID();
        localStorage.setItem("poolPartyTicketId", ticketId);
      }

      if (!bookingId) {
        bookingId = generateBookingId();
        localStorage.setItem("poolPartyBookingId", bookingId);
      }

      const qrPayload = {
        booking_id: bookingId,
        ticket_id: ticketId,
        event: "Thane Pool Party",
        phone: user.phone,
      };

      const qrData = JSON.stringify(qrPayload);

      const qrCodeImage = await QRCode.toDataURL(qrData, {
        width: 320,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      const ticketData = {
        id: ticketId,
        booking_id: bookingId,
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        phone: user.phone || "",
        email: user.email || "",
        instagram: user.instagram || "",
        package_type: user.packageType || "",
        event: "Thane Pool Party",
        venue: "Nitrro Wellness & Fitness Hub, Thane East",
        event_date: "10 May 2026",
        event_time: "5:00 PM - 8:30 PM",
        payment_status: "paid",
        entry_status: "not_used",
        qr_data: qrData,
        qr_code: qrCodeImage,
        razorpay_payment_id: razorpayPaymentId,
        payment_reference: paymentReference,
      };

      const { data, error: supabaseError } = await supabase
        .from("tickets")
        .upsert(ticketData, { onConflict: "id" })
        .select("*")
        .single();

      if (supabaseError) {
        console.log("FULL SUPABASE ERROR:", JSON.stringify(supabaseError, null, 2));
        throw supabaseError;
      }

      const finalTicket = data || ticketData;

      setTicket(finalTicket);
      setQrImage(qrCodeImage);
      setLoading(false);

      const alreadyEmailedKey = `poolPartyTicketEmailSent_${ticketId}`;
      const alreadyEmailed = localStorage.getItem(alreadyEmailedKey);

      if (!alreadyEmailed) {
        await sendTicketEmail(finalTicket);
        localStorage.setItem(alreadyEmailedKey, "true");
      } else {
        setEmailStatus(`Ticket email already sent to ${finalTicket.email}`);
      }
    } catch (err) {
      console.error("TICKET ERROR:", err);
      setError(
        err?.message ||
          err?.details ||
          err?.hint ||
          JSON.stringify(err) ||
          "Something went wrong while generating your ticket."
      );
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="success-page">
        <div className="success-card glass">
          <h1>Generating Your Entry Pass...</h1>
          <p>Please wait while we create your Booking ID and QR ticket.</p>
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

  return (
    <div className="success-page">
      <div className="success-card glass">
        <div className="success-badge">PAYMENT SUCCESSFUL</div>

        <h1>Entry Pass Generated 🎉</h1>

        <p className="success-subtitle">
          Show this Booking ID or QR at the entry counter for verification.
        </p>

        {emailStatus && <p className="email-status">{emailStatus}</p>}

        <div className="booking-pass">
          <p>Your Booking ID</p>
          <h2>{ticket?.booking_id}</h2>
          <span>Screenshot this pass</span>
        </div>

        <div className="qr-ticket-box">
          <div className="qr-box">
            <img src={qrImage} alt="Entry QR Code" />
          </div>
          <p>Admin can scan this QR at entry.</p>
        </div>

        <div className="ticket-details ticket-details-full">
          <h2>{ticket?.name}</h2>

          <div>
            <strong>Event</strong>
            <span>{ticket?.event}</span>
          </div>

          <div>
            <strong>Package</strong>
            <span>{ticket?.package_type}</span>
          </div>

          <div>
            <strong>Date & Time</strong>
            <span>
              {ticket?.event_date} • {ticket?.event_time}
            </span>
          </div>

          <div>
            <strong>Venue</strong>
            <span>{ticket?.venue}</span>
          </div>

          <div>
            <strong>Contact</strong>
            <span>{ticket?.phone}</span>
          </div>

          <div>
            <strong>Email</strong>
            <span>{ticket?.email}</span>
          </div>

          <div>
            <strong>Instagram</strong>
            <span>{ticket?.instagram}</span>
          </div>

          {ticket?.razorpay_payment_id && (
            <div>
              <strong>Payment ID</strong>
              <span>{ticket?.razorpay_payment_id}</span>
            </div>
          )}

          <div>
            <strong>Entry Status</strong>
            <span className="status-pill">Not Used</span>
          </div>
        </div>

        <p className="entry-note">
          Your ticket details have been sent to your registered email. Carry your
          Booking ID and registered phone number for entry verification.
        </p>

        <a href="/">
          <button>Back to Home</button>
        </a>
      </div>
    </div>
  );
}