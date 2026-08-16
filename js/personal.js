// ===========================================
// PERSONAL.JS - PART 1
// Get HTML Elements
// ===========================================

// Customer Details
const customerName = document.getElementById("customerName");
const mobileNumber = document.getElementById("mobileNumber");
const place = document.getElementById("place");

// Next Button
const nextBtn = document.getElementById("nextBtn");

// ===========================================
// Validation
// ===========================================

function validateForm() {

    const name = customerName.value.trim();
    const mobile = mobileNumber.value.trim();
    const customerPlace = place.value.trim();

    if (name === "") {
        alert("Please enter Customer Name");
        customerName.focus();
        return false;
    }

    if (mobile === "") {
        alert("Please enter Mobile Number");
        mobileNumber.focus();
        return false;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit Mobile Number");
        mobileNumber.focus();
        return false;
    }

    if (customerPlace === "") {
        alert("Please enter Place");
        place.focus();
        return false;
    }

    return true;
}// ===========================================
// PERSONAL.JS - PART 2
// Save Customer Details & Next Page
// ===========================================

nextBtn.addEventListener("click", function () {

    // Validate Form
    if (!validateForm()) {
        return;
    }

    // Get Values
    const name = customerName.value.trim();
    const mobile = mobileNumber.value.trim();
    const customerPlace = place.value.trim();

    // ==============================
    // Save Customer Details
    // ==============================

    localStorage.setItem("customerName", name);
    localStorage.setItem("customerMobile", mobile);
    localStorage.setItem("customerPlace", customerPlace);

    // Check Saved Values
    console.log("==================================");
    console.log("Customer Details Saved");
    console.log("Name :", localStorage.getItem("customerName"));
    console.log("Mobile :", localStorage.getItem("customerMobile"));
    console.log("Place :", localStorage.getItem("customerPlace"));
    console.log("==================================");

    // ==============================
    // Bill Number
    // ==============================

    let billCount = Number(localStorage.getItem("billCount")) || 0;
    let billNo = "BILL-" + String(billCount + 1).padStart(4, "0");

    localStorage.setItem("billNo", billNo);

    // ==============================
    // Bill Date
    // ==============================

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const billDate = `${year}-${month}-${day}`;

    localStorage.setItem("billDate", billDate);

    // ==============================
    // Go To Advance Page
    // ==============================

    window.location.href = "advance.html";

});// =======================================
// BACK BUTTON
// =======================================

const backBtn = document.getElementById("backBtn");

if (backBtn) {
    backBtn.addEventListener("click", () => {
        window.location.href = "labour.html";
    });
}