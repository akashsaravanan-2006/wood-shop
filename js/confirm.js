// =========================================
// CONFIRM.JS - PART 1
// =========================================

// =========================================
// ELEMENTS
// =========================================

const confirmInput = document.getElementById("confirmInput");
const saveBtn = document.getElementById("saveBtn");
const printBtn = document.getElementById("printBtn");
const cancelBtn = document.getElementById("cancelBtn");
const homeBtn = document.getElementById("homeBtn");
const message = document.getElementById("message");

const billNoText = document.getElementById("billNo");
const customerIdText = document.getElementById("customerId");
const printCustomerId = document.getElementById("printCustomerId");

// Disable Print Button Initially
printBtn.disabled = true;

// =========================================
// GLOBAL VARIABLES
// =========================================

let billData = null;

let billCount = Number(localStorage.getItem("billCount")) || 0;
let customerCount = Number(localStorage.getItem("customerCount")) || 0;

// =========================================
// BILL NUMBER
// =========================================

let billNo = "BILL-" + String(billCount + 1).padStart(4, "0");

if (billNoText) {
    billNoText.textContent = billNo;
}

// =========================================
// CUSTOMER ID
// =========================================

let customerId = "CUST-" + String(customerCount + 1).padStart(4, "0");

if (customerIdText) {
    customerIdText.textContent = customerId;
}

if (printCustomerId) {
    printCustomerId.textContent = customerId;
}

// =========================================
// DATE & TIME
// =========================================

const now = new Date();

const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");

const billDate = `${year}-${month}-${day}`;

const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const seconds = String(now.getSeconds()).padStart(2, "0");

const billTime = `${hours}:${minutes}:${seconds}`;// =========================================
// SAVE BUTTON
// =========================================

saveBtn.addEventListener("click", function () {

    // Check Confirmation
    if (confirmInput.value.trim().toUpperCase() !== "YES") {

        message.style.color = "red";
        message.textContent = 'Please type "YES" to continue.';
        return;

    }

    // Generate Bill Number
    billCount++;
    customerCount++;

    billNo = "BILL-" + String(billCount).padStart(4, "0");
    customerId = "CUST-" + String(customerCount).padStart(4, "0");

    localStorage.setItem("billCount", billCount);
    localStorage.setItem("customerCount", customerCount);

    if (billNoText) billNoText.textContent = billNo;
    if (customerIdText) customerIdText.textContent = customerId;
    if (printCustomerId) printCustomerId.textContent = customerId;

    // Create Bill Object
    billData = {

        billNo: billNo,
        customerId: customerId,

        billDate: billDate,
        billTime: billTime,

        customerName: localStorage.getItem("customerName"),
        customerMobile: localStorage.getItem("customerMobile"),
        customerPlace: localStorage.getItem("customerPlace"),

        paymentType: localStorage.getItem("paymentType"),

        advanceAmount: Number(localStorage.getItem("advanceAmount")) || 0,
        balanceAmount: Number(localStorage.getItem("balanceAmount")) || 0,

        totalCFT: Number(localStorage.getItem("totalCFT")) || 0,
        woodTotal: Number(localStorage.getItem("woodTotal")) || 0,
        labourCharge: Number(localStorage.getItem("labourCharge")) || 0,
        otherCharge: Number(localStorage.getItem("otherCharge")) || 0,
        othersTotal: Number(localStorage.getItem("othersTotal")) || 0,
        grandTotal: Number(localStorage.getItem("grandTotal")) || 0,

        woodData: JSON.parse(localStorage.getItem("woodData")) || [],
        othersData: JSON.parse(localStorage.getItem("othersData")) || [],

        createdAt: new Date().toISOString()

    };

    console.log("Bill Data:", billData);

    // =====================================
    // SAVE TO MYSQL
    // =====================================



fetch("https://wood-shop-backend.vercel.app/save-bill", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(billData)

})

    .then(response => {

        if (!response.ok) {

            throw new Error("HTTP Error : " + response.status);

        }

        return response.json();

    })

    .then(data => {

        if (data.success) {

            message.style.color = "green";
            message.textContent = "Bill Saved Successfully.";

            saveBtn.disabled = true;
            printBtn.disabled = false;

        }

        else {

            message.style.color = "red";
            message.textContent = data.message;

        }

    })

    .catch(error => {

        console.error(error);

        message.style.color = "red";
        message.textContent = "Server Connection Error.";

    });

});// =========================================
// PRINT BUTTON
// =========================================

printBtn.addEventListener("click", function () {

    if (printBtn.disabled) {

        alert("Please save the bill first.");
        return;

    }

    localStorage.setItem("printStatus", "Printed");

    console.log("================================");
    console.log("PRINTING BILL...");
    console.log("Bill No :", billData.billNo);
    console.log("Customer ID :", billData.customerId);
    console.log("================================");

    const printWindow = window.open("../html/bill.html", "_blank");

    printWindow.onload = function () {

        setTimeout(function () {

            printWindow.focus();
            printWindow.print();

        }, 500);

    };

});

// =========================================
// CANCEL BUTTON
// =========================================

cancelBtn.addEventListener("click", function () {

    const result = confirm("Are you sure you want to cancel?");

    if (!result) {
        return;
    }

    localStorage.removeItem("woodData");
    localStorage.removeItem("othersData");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerMobile");
    localStorage.removeItem("customerPlace");
    localStorage.removeItem("paymentType");
    localStorage.removeItem("advanceAmount");
    localStorage.removeItem("balanceAmount");
    localStorage.removeItem("totalCFT");
    localStorage.removeItem("woodTotal");
    localStorage.removeItem("labourCharge");
    localStorage.removeItem("otherCharge");
    localStorage.removeItem("othersTotal");
    localStorage.removeItem("grandTotal");
    localStorage.removeItem("billDate");
    localStorage.removeItem("billTime");
    localStorage.removeItem("printStatus");

    window.location.href = "../html/bill.html";

});// =========================================
// HOME BUTTON
// =========================================

homeBtn.addEventListener("click", function () {

    const confirmHome = confirm("Are you sure you want to go Home?");

    if (!confirmHome) {
        return;
    }

    // Clear temporary bill data
    localStorage.removeItem("woodData");
    localStorage.removeItem("othersData");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerMobile");
    localStorage.removeItem("customerPlace");
    localStorage.removeItem("paymentType");
    localStorage.removeItem("advanceAmount");
    localStorage.removeItem("balanceAmount");
    localStorage.removeItem("totalCFT");
    localStorage.removeItem("woodTotal");
    localStorage.removeItem("labourCharge");
    localStorage.removeItem("otherCharge");
    localStorage.removeItem("othersTotal");
    localStorage.removeItem("grandTotal");
    localStorage.removeItem("billDate");
    localStorage.removeItem("billTime");
    localStorage.removeItem("printStatus");

    // Go to Home Page
    window.location.href = "index.html";

});

// =========================================
// PAGE LOADED
// =========================================

window.addEventListener("load", function () {

    console.log("================================");
    console.log("CONFIRM PAGE LOADED");
    console.log("Bill No :", billNo);
    console.log("Customer ID :", customerId);
    console.log("================================");

});
