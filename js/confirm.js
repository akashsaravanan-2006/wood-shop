// =========================================
// CONFIRM.JS
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

// =========================================
// PRINT DISABLED INITIALLY
// =========================================

if (printBtn) {
    printBtn.disabled = true;
}

// =========================================
// GLOBAL VARIABLES
// =========================================

let billData = null;
let savedBillNo = null;

// =========================================
// CUSTOMER ID
// =========================================

// Customer ID can still use localStorage.
// Bill number MUST come from backend.

let customerCount =
    Number(localStorage.getItem("customerCount")) || 0;

let customerId =
    "CUST-" +
    String(customerCount + 1).padStart(4, "0");

if (customerIdText) {
    customerIdText.textContent = customerId;
}

if (printCustomerId) {
    printCustomerId.textContent = customerId;
}

// =========================================
// SHOW BILL NUMBER
// =========================================

// Don't create bill number here.
// Backend will create BILL-0001, BILL-0002, etc.

if (billNoText) {
    billNoText.textContent = "Generating...";
}

// =========================================
// DATE & TIME
// =========================================

function getCurrentDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getCurrentTime() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}

// =========================================
// SAFE JSON
// =========================================

function getLocalJSON(key) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return [];
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            `Error reading ${key}:`,
            error
        );

        return [];
    }
}

// =========================================
// SHOW MESSAGE
// =========================================

function showMessage(text, color) {

    if (!message) {
        return;
    }

    message.style.color = color;
    message.textContent = text;
}

// =========================================
// SAVE BUTTON
// =========================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        async function () {

            // -----------------------------------------
            // CHECK YES
            // -----------------------------------------

            const confirmation =
                confirmInput
                    ? confirmInput.value
                        .trim()
                        .toUpperCase()
                    : "";

            if (confirmation !== "YES") {

                showMessage(
                    'Please type "YES" to continue.',
                    "red"
                );

                return;
            }

            // -----------------------------------------
            // DISABLE BUTTON
            // -----------------------------------------

            saveBtn.disabled = true;

            showMessage(
                "Saving bill...",
                "#555"
            );

            // -----------------------------------------
            // CREATE BILL DATA
            // -----------------------------------------

            billData = {

                // IMPORTANT:
                // DO NOT CREATE billNo HERE

                customerId:
                    customerId,

                customerName:
                    localStorage.getItem(
                        "customerName"
                    ) || "",

                customerMobile:
                    localStorage.getItem(
                        "customerMobile"
                    ) || "",

                customerPlace:
                    localStorage.getItem(
                        "customerPlace"
                    ) || "",

                billDate:
                    getCurrentDate(),

                billTime:
                    getCurrentTime(),

                paymentType:
                    localStorage.getItem(
                        "paymentType"
                    ) || "",

                advanceAmount:
                    Number(
                        localStorage.getItem(
                            "advanceAmount"
                        )
                    ) || 0,

                balanceAmount:
                    Number(
                        localStorage.getItem(
                            "balanceAmount"
                        )
                    ) || 0,

                totalCFT:
                    Number(
                        localStorage.getItem(
                            "totalCFT"
                        )
                    ) || 0,

                woodTotal:
                    Number(
                        localStorage.getItem(
                            "woodTotal"
                        )
                    ) || 0,

                labourCharge:
                    Number(
                        localStorage.getItem(
                            "labourCharge"
                        )
                    ) || 0,

                otherCharge:
                    Number(
                        localStorage.getItem(
                            "otherCharge"
                        )
                    ) || 0,

                othersTotal:
                    Number(
                        localStorage.getItem(
                            "othersTotal"
                        )
                    ) || 0,

                grandTotal:
                    Number(
                        localStorage.getItem(
                            "grandTotal"
                        )
                    ) || 0,

                woodData:
                    getLocalJSON(
                        "woodData"
                    ),

                othersData:
                    getLocalJSON(
                        "othersData"
                    ),

                remark:
                    localStorage.getItem(
                        "remark"
                    ) || ""

            };

            // -----------------------------------------
            // DEBUG
            // -----------------------------------------

            console.log(
                "================================"
            );

            console.log(
                "SENDING BILL TO SERVER"
            );

            console.log(
                billData
            );

            console.log(
                "================================"
            );

            // -----------------------------------------
            // SEND TO BACKEND
            // -----------------------------------------

            try {

                const response =
                    await fetch(
                        "https://wood-shop-backend.vercel.app/api/save-bill",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    billData
                                )
                        }
                    );

                // -------------------------------------
                // CHECK HTTP RESPONSE
                // -------------------------------------

                if (!response.ok) {

                    let errorMessage =
                        "Server error: " +
                        response.status;

                    try {

                        const errorData =
                            await response.json();

                        if (errorData.message) {

                            errorMessage =
                                errorData.message;
                        }

                    } catch (e) {

                        console.error(
                            "Could not read error response",
                            e
                        );
                    }

                    throw new Error(
                        errorMessage
                    );
                }

                // -------------------------------------
                // READ RESPONSE
                // -------------------------------------

                const data =
                    await response.json();

                console.log(
                    "SERVER RESPONSE:",
                    data
                );

                // -------------------------------------
                // SUCCESS
                // -------------------------------------

                if (data.success) {

                    // Backend generated number
                    savedBillNo =
                        data.billNo;

                    // Show actual bill number
                    if (billNoText) {

                        billNoText.textContent =
                            savedBillNo;
                    }

                    // Save bill number locally
                    localStorage.setItem(
                        "lastBillNo",
                        savedBillNo
                    );

                    // Update customer count
                    customerCount++;

                    localStorage.setItem(
                        "customerCount",
                        customerCount
                    );

                    // Add bill number to billData
                    billData.billNo =
                        savedBillNo;

                    // Add bill ID
                    billData.billId =
                        data.billId;

                    // Save complete bill data
                    localStorage.setItem(
                        "savedBillData",
                        JSON.stringify(
                            billData
                        )
                    );

                    // ---------------------------------
                    // SUCCESS MESSAGE
                    // ---------------------------------

                    showMessage(
                        "Bill Saved Successfully. " +
                        savedBillNo,
                        "green"
                    );

                    // ---------------------------------
                    // BUTTONS
                    // ---------------------------------

                    saveBtn.disabled = true;

                    if (printBtn) {
                        printBtn.disabled = false;
                    }

                } else {

                    throw new Error(
                        data.message ||
                        "Bill could not be saved"
                    );
                }

            } catch (error) {

                console.error(
                    "SAVE BILL ERROR:",
                    error
                );

                showMessage(
                    error.message ||
                    "Server Connection Error.",
                    "red"
                );

                // Allow user to try again
                saveBtn.disabled = false;
            }

        }
    );
}

// =========================================
// PRINT BUTTON
// =========================================

if (printBtn) {

    printBtn.addEventListener(
        "click",
        function () {

            if (
                printBtn.disabled ||
                !billData
            ) {

                alert(
                    "Please save the bill first."
                );

                return;
            }

            // -----------------------------------------
            // PRINT STATUS
            // -----------------------------------------

            localStorage.setItem(
                "printStatus",
                "Printed"
            );

            console.log(
                "================================"
            );

            console.log(
                "PRINTING BILL"
            );

            console.log(
                "Bill No:",
                billData.billNo
            );

            console.log(
                "Customer ID:",
                billData.customerId
            );

            console.log(
                "================================"
            );

            // -----------------------------------------
            // OPEN BILL PAGE
            // -----------------------------------------

            const printWindow =
                window.open(
                    "../html/bill.html",
                    "_blank"
                );

            if (!printWindow) {

                alert(
                    "Please allow pop-ups for this website."
                );

                return;
            }

            printWindow.onload =
                function () {

                    setTimeout(
                        function () {

                            printWindow.focus();

                            printWindow.print();

                        },
                        500
                    );
                };
        }
    );
}

// =========================================
// CLEAR TEMPORARY BILL DATA
// =========================================

function clearBillData() {

    const keys = [

        "woodData",
        "othersData",

        "customerName",
        "customerMobile",
        "customerPlace",

        "paymentType",

        "advanceAmount",
        "balanceAmount",

        "totalCFT",
        "woodTotal",

        "labourCharge",
        "otherCharge",
        "othersTotal",

        "grandTotal",

        "remark",

        "billDate",
        "billTime",

        "printStatus",

        "savedBillData"
    ];

    keys.forEach(
        function (key) {

            localStorage.removeItem(
                key
            );
        }
    );
}

// =========================================
// CANCEL BUTTON
// =========================================

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function () {

            const result =
                confirm(
                    "Are you sure you want to cancel?"
                );

            if (!result) {
                return;
            }

            clearBillData();

            window.location.href =
                "../html/bill.html";
        }
    );
}

// =========================================
// HOME BUTTON
// =========================================

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            const confirmHome =
                confirm(
                    "Are you sure you want to go Home?"
                );

            if (!confirmHome) {
                return;
            }

            clearBillData();

            window.location.href =
                "index.html";
        }
    );
}

// =========================================
// PAGE LOADED
// =========================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "================================"
        );

        console.log(
            "CONFIRM PAGE LOADED"
        );

        console.log(
            "Customer ID:",
            customerId
        );

        console.log(
            "Bill number will be generated by backend."
        );

        console.log(
            "================================"
        );
    }
);
