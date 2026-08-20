// ============================================================
// ADVANCE.JS - FULL DEBUG VERSION
// ============================================================
//
// PAYMENT FLAG
//
// Ready Cash = "1"
// Advance   = "0"
//
// This flag is used by discount.js.
//
// IMPORTANT:
// This file does NOT clear bill data.
// ============================================================

console.log("========================================");
console.log("ADVANCE.JS VERSION 2 LOADED");
console.log("========================================");


// ============================================================
// STORAGE HELPERS
// ============================================================

function getNumber(value) {

    const number = parseFloat(value);

    return Number.isFinite(number) ? number : 0;

}


// ============================================================
// GET GRAND TOTAL
// ============================================================

function getGrandTotal() {

    // First try central storedata.js
    if (typeof getTotals === "function") {

        const totals = getTotals();

        console.log(
            "SOURCE 1 - storedata totals:",
            totals
        );

        const possibleValues = [
            totals.grandTotal,
            totals.finalGrandTotal,
            totals.finalTotal,
            totals.subtotal
        ];

        for (const value of possibleValues) {

            const number = getNumber(value);

            if (number > 0) {

                console.log(
                    "GRAND TOTAL FROM STORED DATA:",
                    number
                );

                return number;

            }

        }

    }


    // ========================================================
    // OLD LOCAL STORAGE FALLBACK
    // ========================================================

    const localKeys = [
        "finalGrandTotal",
        "grandTotal",
        "finalTotal",
        "woodTotal"
    ];


    for (const key of localKeys) {

        const value =
            getNumber(
                localStorage.getItem(key)
            );

        if (value > 0) {

            console.log(
                "GRAND TOTAL FROM localStorage:",
                key,
                value
            );

            return value;

        }

    }


    console.warn(
        "GRAND TOTAL NOT FOUND. USING 0."
    );

    return 0;

}


// ============================================================
// HTML ELEMENTS
// ============================================================

const grandTotalElement =
    document.getElementById("grandTotal");


// Try different possible IDs so the code works
// with your existing HTML.

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// Possible advance amount elements

const advanceAmountInput =
    document.getElementById("advanceAmount") ||
    document.getElementById("advance");


const balanceAmountElement =
    document.getElementById("balanceAmount") ||
    document.getElementById("balance");


// ============================================================
// FIND PAYMENT CARDS
// ============================================================

function findPaymentCard(text) {

    const allElements =
        document.querySelectorAll(
            "label, button, .payment-card, .payment-option, .card, .option-card, div"
        );


    for (const element of allElements) {

        const elementText =
            element.innerText
                ?.trim()
                .toLowerCase();


        if (
            elementText &&
            elementText.includes(text.toLowerCase())
        ) {

            // Avoid selecting the whole page/container
            if (elementText.length < 300) {

                return element;

            }

        }

    }

    return null;

}


const readyCashCard =
    findPaymentCard("Ready Cash");


const advanceCard =
    findPaymentCard("Advance");


// ============================================================
// PAYMENT MODE CARDS
// ============================================================

const cashCard =
    findPaymentCard("Cash");


const upiCard =
    findPaymentCard("UPI");


// ============================================================
// DEBUG ELEMENTS
// ============================================================

console.log(
    "Grand Total Element:",
    grandTotalElement
);

console.log(
    "Ready Cash Card:",
    readyCashCard
);

console.log(
    "Advance Card:",
    advanceCard
);

console.log(
    "Advance Amount Input:",
    advanceAmountInput
);

console.log(
    "Balance Element:",
    balanceAmountElement
);


// ============================================================
// CURRENT GRAND TOTAL
// ============================================================

let grandTotal =
    getGrandTotal();


console.log(
    "ORIGINAL GRAND TOTAL:",
    grandTotal
);


// ============================================================
// DISPLAY GRAND TOTAL
// ============================================================

function displayGrandTotal() {

    if (!grandTotalElement) {

        console.warn(
            "grandTotal element not found."
        );

        return;

    }


    grandTotalElement.textContent =
        "₹ " + grandTotal.toFixed(2);

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance(amount) {

    if (!balanceAmountElement) {

        return;

    }


    balanceAmountElement.textContent =
        "₹ " + amount.toFixed(2);

}


// ============================================================
// SAVE ADVANCE DATA
// ============================================================

function saveAdvanceData() {

    const paymentFlag =
        localStorage.getItem("paymentFlag") || "1";


    let paymentType =
        paymentFlag === "1"
            ? "cash"
            : "advance";


    let advanceAmount = 0;

    let balanceAmount = grandTotal;


    if (paymentFlag === "1") {

        // ====================================================
        // READY CASH
        // ====================================================

        advanceAmount =
            grandTotal;

        balanceAmount =
            0;

    } else {

        // ====================================================
        // ADVANCE
        // ====================================================

        advanceAmount =
            getNumber(
                advanceAmountInput?.value
            );


        if (advanceAmount < 0) {

            advanceAmount = 0;

        }


        if (advanceAmount > grandTotal) {

            advanceAmount =
                grandTotal;

        }


        balanceAmount =
            grandTotal - advanceAmount;

    }


    const data = {

        paymentType: paymentType,

        paymentMode:
            localStorage.getItem(
                "paymentMode"
            ) || "cash",

        grandTotal:
            grandTotal,

        advanceAmount:
            advanceAmount,

        balanceAmount:
            balanceAmount,

        paymentFlag:
            paymentFlag

    };


    // ========================================================
    // SAVE IN CENTRAL STORAGE
    // ========================================================

    if (typeof savePageData === "function") {

        savePageData(
            "advance",
            data
        );

    }


    // ========================================================
    // ALSO SAVE OLD KEYS
    // For compatibility with your existing bill.js
    // ========================================================

    localStorage.setItem(
        "paymentType",
        paymentType
    );

    localStorage.setItem(
        "advanceAmount",
        advanceAmount.toString()
    );

    localStorage.setItem(
        "balanceAmount",
        balanceAmount.toString()
    );

    localStorage.setItem(
        "paymentFlag",
        paymentFlag
    );


    console.log(
        "========================================"
    );

    console.log(
        "SAVED ADVANCE DATA:"
    );

    console.log(
        data
    );

    console.log(
        "========================================"
    );


    return data;

}


// ============================================================
// READY CASH
// ============================================================

function selectReadyCash() {

    console.log(
        "READY CASH SELECTED"
    );


    // ========================================================
    // FLAG = 1
    // ========================================================

    localStorage.setItem(
        "paymentFlag",
        "1"
    );


    console.log(
        "PAYMENT FLAG = 1"
    );


    // Full payment

    if (advanceAmountInput) {

        advanceAmountInput.value =
            grandTotal.toFixed(2);

    }


    displayBalance(0);


    saveAdvanceData();

}


// ============================================================
// ADVANCE PAYMENT
// ============================================================

function selectAdvance() {

    console.log(
        "ADVANCE PAYMENT SELECTED"
    );


    // ========================================================
    // FLAG = 0
    // ========================================================

    localStorage.setItem(
        "paymentFlag",
        "0"
    );


    console.log(
        "PAYMENT FLAG = 0"
    );


    // Do NOT automatically set advance amount
    // unless previous value exists.

    const current =
        getNumber(
            advanceAmountInput?.value
        );


    if (advanceAmountInput) {

        if (current > grandTotal) {

            advanceAmountInput.value =
                grandTotal.toFixed(2);

        }

    }


    const amount =
        getNumber(
            advanceAmountInput?.value
        );


    displayBalance(
        Math.max(
            0,
            grandTotal - amount
        )
    );


    saveAdvanceData();

}


// ============================================================
// CLICK READY CASH
// ============================================================

if (readyCashCard) {

    readyCashCard.addEventListener(
        "click",
        function () {

            selectReadyCash();

        }
    );

}


// ============================================================
// CLICK ADVANCE
// ============================================================

if (advanceCard) {

    advanceCard.addEventListener(
        "click",
        function () {

            selectAdvance();

        }
    );

}


// ============================================================
// ADVANCE AMOUNT CHANGED
// ============================================================

if (advanceAmountInput) {

    advanceAmountInput.addEventListener(
        "input",
        function () {

            const flag =
                localStorage.getItem(
                    "paymentFlag"
                );


            // Ready Cash
            if (flag === "1") {

                this.value =
                    grandTotal.toFixed(2);

                displayBalance(0);

                return;

            }


            // Advance

            let amount =
                getNumber(this.value);


            if (amount > grandTotal) {

                amount =
                    grandTotal;

                this.value =
                    grandTotal.toFixed(2);

            }


            const balance =
                Math.max(
                    0,
                    grandTotal - amount
                );


            displayBalance(
                balance
            );


            saveAdvanceData();

        }
    );

}


// ============================================================
// PAYMENT MODE - CASH
// ============================================================

if (cashCard) {

    cashCard.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "paymentMode",
                "cash"
            );


            console.log(
                "PAYMENT MODE = CASH"
            );


            saveAdvanceData();

        }
    );

}


// ============================================================
// PAYMENT MODE - UPI
// ============================================================

if (upiCard) {

    upiCard.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "paymentMode",
                "upi"
            );


            console.log(
                "PAYMENT MODE = UPI"
            );


            saveAdvanceData();

        }
    );

}


// ============================================================
// INITIALIZE FROM SAVED DATA
// ============================================================

function initializeAdvancePage() {

    grandTotal =
        getGrandTotal();


    displayGrandTotal();


    // ========================================================
    // GET SAVED ADVANCE DATA
    // ========================================================

    let saved = null;


    if (typeof getPageData === "function") {

        saved =
            getPageData("advance");

    }


    console.log(
        "SAVED ADVANCE DATA:",
        saved
    );


    // ========================================================
    // DETERMINE PAYMENT FLAG
    // ========================================================

    let flag =
        localStorage.getItem(
            "paymentFlag"
        );


    if (
        flag !== "0" &&
        flag !== "1"
    ) {

        flag = "1";

        localStorage.setItem(
            "paymentFlag",
            "1"
        );

    }


    console.log(
        "CURRENT PAYMENT FLAG:",
        flag
    );


    // ========================================================
    // RESTORE ADVANCE AMOUNT
    // ========================================================

    if (flag === "1") {

        // Ready Cash

        if (advanceAmountInput) {

            advanceAmountInput.value =
                grandTotal.toFixed(2);

        }


        displayBalance(0);

    } else {

        // Advance

        let amount = 0;


        if (
            saved &&
            saved.advanceAmount !== undefined
        ) {

            amount =
                getNumber(
                    saved.advanceAmount
                );

        } else {

            amount =
                getNumber(
                    localStorage.getItem(
                        "advanceAmount"
                    )
                );

        }


        if (advanceAmountInput) {

            advanceAmountInput.value =
                amount > 0
                    ? amount.toFixed(2)
                    : "";

        }


        displayBalance(
            Math.max(
                0,
                grandTotal - amount
            )
        );

    }


    // ========================================================
    // SAVE CURRENT STATE
    // ========================================================

    saveAdvanceData();


    console.log(
        "========================================"
    );

    console.log(
        "ADVANCE PAGE INITIALIZED"
    );

    console.log(
        "Original Total:",
        grandTotal
    );

    console.log(
        "Payment Flag:",
        flag
    );

    console.log(
        "========================================"
    );

}


// ============================================================
// NEXT BUTTON
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {

            saveAdvanceData();

            window.location.href =
                "discount.html";

        }
    );

}


// ============================================================
// BACK BUTTON
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            saveAdvanceData();

            window.location.href =
                "personal.html";

        }
    );

}


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeAdvancePage();

    }
);
