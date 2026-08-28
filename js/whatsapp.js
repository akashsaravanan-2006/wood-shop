"use strict";

/* ============================================
   WHATSAPP BILL SENDER
   ============================================ */

function sendBillToWhatsApp() {

    // Get customer details
    const customerName =
        document.getElementById("customerName")?.textContent?.trim() || "";

    let mobile =
        document.getElementById("customerMobile")?.textContent?.trim() || "";

    // Remove spaces, +, -, etc.
    mobile = mobile.replace(/\D/g, "");

    // Remove 91 if already included
    if (mobile.length === 12 && mobile.startsWith("91")) {
        mobile = mobile.substring(2);
    }

    // Validate
    if (!customerName) {
        alert("Customer name is missing.");
        return;
    }

    if (mobile.length !== 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    // Greeting message
    const message =
        `Hello ${customerName} 👋\n\n` +
        `Thank you for choosing Amman Saw Mill.\n` +
        `Please find your quotation/bill details.\n\n` +
        `Thank you for your business! 🌳`;

    // WhatsApp URL
    const whatsappURL =
        `https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(
        whatsappURL,
        "_blank"
    );
}
