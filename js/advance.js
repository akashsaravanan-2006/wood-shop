// ============================================================
// ADVANCE.JS - CLEAN DEBUG VERSION
// ============================================================
//
// PAYMENT FLAG
//
// Ready Cash = "1"
// Advance   = "0"
//
// Ready Cash:
//     Advance Amount = Grand Total
//     Balance Amount = 0
//
// Advance:
//     Advance Amount = user entered amount
//     Balance Amount = Grand Total - Advance Amount
//
// ============================================================

console.log("==========================================");
console.log("ADVANCE.JS CLEAN VERSION LOADED");
console.log("==========================================");


// ============================================================
// HELPER
// ============================================================

function numberValue(value) {

    const n = parseFloat(value);

    return Number.isFinite(n) ? n : 0;

}


// ============================================================
// HTML ELEMENTS
// ============================================================

const grandTotalElement =
    document.getElementById("grandTotal");

const advanceAmountInput =
    document.getElementById("advanceAmount");

const balanceAmountInput =
    document.getElementById("balanceAmount");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// PAYMENT CARDS
// ============================================================

// Your page has Ready Cash and Advance cards.
// We find them by their text.

function findCard(searchText) {

    const elements =
        document.querySelectorAll(
            "label, .payment-card, .payment-option, .option-card, .card"
        );

    for (const element of elements) {

        const text =
            element.textContent
                .trim()
                .toLowerCase();

        if (
            text.includes(searchText.toLowerCase())
        ) {

            return element;

        }

    }

    return null;

}


const readyCashCard =
    findCard("Ready Cash");

const advanceCard =
    findCard("Advance");


// ============================================================
// DEBUG
// ============================================================

console.log(
    "grandTotalElement:",
    grandTotalElement
);

console.log(
    "advanceAmountInput:",
    advanceAmountInput
);

console.log(
    "balanceAmountInput:",
    balanceAmountInput
);

console.log(
    "readyCashCard:",
    readyCashCard
);

console.log(
    "advanceCard:",
    advanceCard
);


// ============================================================
// GET GRAND TOTAL
// ============================================================

function getGrandTotal() {

    // --------------------------------------------------------
    // 1. Try storedata.js
    // --------------------------------------------------------

    if (
        typeof getTotals === "function"
    ) {

        const totals =
            getTotals();

        console.log(
            "STORE DATA TOTALS:",
            totals
        );


        const values = [

            totals.grandTotal,

            totals.finalGrandTotal,

            totals.finalTotal,

            totals.subtotal

        ];


        for (const value of values) {

            const total =
                numberValue(value);

            if (total > 0) {

                console.log(
                    "TOTAL FROM STOREDATA:",
                    total
                );

                return total;

            }

        }

    }


    // --------------------------------------------------------
    // 2. Try localStorage
    // --------------------------------------------------------

    const keys = [

        "finalGrandTotal",
        "grandTotal",
        "finalTotal",
        "woodTotal"

    ];


    for (const key of keys) {

        const total =
            numberValue(
                localStorage.getItem(key)
            );


        if (total > 0) {

            console.log(
                "TOTAL FROM LOCAL STORAGE:",
                key,
                total
            );

            return total;

        }

    }


    console.warn(
        "GRAND TOTAL NOT FOUND"
    );

    return 0;

}


// ============================================================
// GRAND TOTAL
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

        console.error(
            "ERROR: #grandTotal NOT FOUND"
        );

        return;

    }


    grandTotalElement.value =
        "₹ " + grandTotal.toFixed(2);

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance(amount) {

    if (!balanceAmountInput) {

        console.error(
            "ERROR: #balanceAmount NOT FOUND"
        );

        return;

    }


    balanceAmountInput.value =
        "₹ " + amount.toFixed(2);

}


// ============================================================
// GET PAYMENT FLAG
// ============================================================

function getPaymentFlag() {

    const flag =
        localStorage.getItem(
            "paymentFlag"
        );


    if (
        flag === "1" ||
        flag === "0"
    ) {

        return flag;

    }


    // First time opening page
    // Default = Ready Cash

    localStorage.setItem(
        "paymentFlag",
        "1"
    );


    return "1";

}


// ============================================================
// SET PAYMENT FLAG
// ============================================================

function setPaymentFlag(flag) {

    if (
        flag !== "1" &&
        flag !== "0"
    ) {

        return;

    }


    localStorage.setItem(
        "paymentFlag",
        flag
    );


    console.log(
        "PAYMENT FLAG SET TO:",
        flag
    );

}


// ============================================================
// SAVE DATA
// ============================================================

function saveAdvanceData() {

    const flag =
        getPaymentFlag();


    let paymentType;

    let advanceAmount;

    let balanceAmount;


    // ========================================================
    // READY CASH
    // ========================================================

    if (flag === "1") {

        paymentType =
            "cash";

        advanceAmount =
            grandTotal;

        balanceAmount =
            0;

    }


    // ========================================================
    // ADVANCE
    // ========================================================

    else {

        paymentType =
            "advance";


        advanceAmount =
            numberValue(
                advanceAmountInput
                    ? advanceAmountInput.value
                    : 0
            );


        // Prevent negative

        if (
            advanceAmount < 0
        ) {

            advanceAmount = 0;

        }


        // Prevent greater than total

        if (
            advanceAmount > grandTotal
        ) {

            advanceAmount =
                grandTotal;

        }


        balanceAmount =
            grandTotal -
            advanceAmount;

    }


    const paymentMode =
        localStorage.getItem(
            "paymentMode"
        ) || "cash";


    const advanceData = {

        paymentType:
            paymentType,

        paymentMode:
            paymentMode,

        grandTotal:
            grandTotal,

        advanceAmount:
            advanceAmount,

        balanceAmount:
            balanceAmount,

        paymentFlag:
            flag

    };


    // ========================================================
    // CENTRAL STORAGE
    // ========================================================

    if (
        typeof savePageData === "function"
    ) {

        savePageData(
            "advance",
            advanceData
        );

    }


    // ========================================================
    // OLD STORAGE KEYS
    // Keep these because bill.js may use them.
    // ========================================================

    localStorage.setItem(
        "paymentType",
        paymentType
    );

    localStorage.setItem(
        "paymentMode",
        paymentMode
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
        flag
    );


    // ========================================================
    // DISPLAY
    // ========================================================

    if (
        flag === "1"
    ) {

        if (advanceAmountInput) {

            advanceAmountInput.value =
                grandTotal.toFixed(2);

        }


        displayBalance(0);

    }


    else {

        if (advanceAmountInput) {

            advanceAmountInput.value =
                advanceAmount > 0
                    ? advanceAmount.toFixed(2)
                    : "";

        }


        displayBalance(
            balanceAmount
        );

    }


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "------------------------------------------"
    );

    console.log(
        "ADVANCE DATA SAVED"
    );

    console.log(
        "Payment Flag:",
        flag
    );

    console.log(
        "Payment Type:",
        paymentType
    );

    console.log(
        "Grand Total:",
        grandTotal
    );

    console.log(
        "Advance Amount:",
        advanceAmount
    );

    console.log(
        "Balance Amount:",
        balanceAmount
    );

    console.log(
        "------------------------------------------"
    );


    return advanceData;

}


// ============================================================
// READY CASH
// ============================================================

function selectReadyCash() {

    console.log(
        "=========================================="
    );

    console.log(
        "READY CASH CLICKED"
    );


    // FLAG = 1

    setPaymentFlag("1");


    // Full payment

    if (advanceAmountInput) {

        advanceAmountInput.value =
            grandTotal.toFixed(2);

    }


    // Balance = 0

    displayBalance(0);


    // Save immediately

    saveAdvanceData();


    console.log(
        "READY CASH COMPLETE"
    );

    console.log(
        "FLAG = 1"
    );

    console.log(
        "ADVANCE =",
        grandTotal
    );

    console.log(
        "BALANCE = 0"
    );

}


// ============================================================
// ADVANCE
// ============================================================

function selectAdvance() {

    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE CLICKED"
    );


    // FLAG = 0

    setPaymentFlag("0");


    // Get existing amount

    let amount =
        numberValue(
            advanceAmountInput
                ? advanceAmountInput.value
                : 0
        );


    if (
        amount > grandTotal
    ) {

        amount =
            grandTotal;

    }


    // Display

    if (advanceAmountInput) {

        advanceAmountInput.value =
            amount > 0
                ? amount.toFixed(2)
                : "";

    }


    const balance =
        grandTotal -
        amount;


    displayBalance(
        balance
    );


    // Save

    saveAdvanceData();


    console.log(
        "ADVANCE COMPLETE"
    );

    console.log(
        "FLAG = 0"
    );

}


// ============================================================
// READY CASH CLICK
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
// ADVANCE CLICK
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
// ADVANCE AMOUNT INPUT
// ============================================================

if (advanceAmountInput) {

    advanceAmountInput.addEventListener(
        "input",
        function () {

            const flag =
                getPaymentFlag();


            // ==================================================
            // READY CASH
            // ==================================================

            if (
                flag === "1"
            ) {

                this.value =
                    grandTotal.toFixed(2);

                displayBalance(0);

                return;

            }


            // ==================================================
            // ADVANCE
            // ==================================================

            let amount =
                numberValue(
                    this.value
                );


            if (
                amount < 0
            ) {

                amount = 0;

            }


            if (
                amount > grandTotal
            ) {

                amount =
                    grandTotal;

                this.value =
                    grandTotal.toFixed(2);

            }


            const balance =
                grandTotal -
                amount;


            displayBalance(
                balance
            );


            // Save

            saveAdvanceData();

        }
    );

}


// ============================================================
// PAYMENT MODE
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        const target =
            event.target.closest(
                "label, .payment-card, .payment-option, .option-card, .card"
            );


        if (!target) {

            return;

        }


        const text =
            target.textContent
                .trim()
                .toLowerCase();


        // Do not confuse Ready Cash with
        // payment mode Cash.

        if (
            text.includes("upi") &&
            !text.includes("ready cash")
        ) {

            localStorage.setItem(
                "paymentMode",
                "upi"
            );


            console.log(
                "PAYMENT MODE = UPI"
            );


            saveAdvanceData();

        }


        else if (
            text.includes("cash") &&
            !text.includes("ready cash") &&
            !text.includes("advance")
        ) {

            localStorage.setItem(
                "paymentMode",
                "cash"
            );


            console.log(
                "PAYMENT MODE = CASH"
            );


            saveAdvanceData();

        }

    }
);


// ============================================================
// NEXT BUTTON
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {

            console.log(
                "NEXT CLICKED"
            );


            // Save latest values

            saveAdvanceData();


            // Go discount

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
// INITIALIZE
// ============================================================

function initializeAdvancePage() {

    console.log(
        "=========================================="
    );

    console.log(
        "INITIALIZING ADVANCE PAGE"
    );


    grandTotal =
        getGrandTotal();


    displayGrandTotal();


    // ========================================================
    // GET SAVED DATA
    // ========================================================

    let savedData = null;


    if (
        typeof getPageData === "function"
    ) {

        savedData =
            getPageData("advance");

    }


    console.log(
        "SAVED ADVANCE DATA:",
        savedData
    );


    // ========================================================
    // DETERMINE FLAG
    // ========================================================

    let flag =
        localStorage.getItem(
            "paymentFlag"
        );


    // If no flag exists, use saved central data.

    if (
        flag !== "0" &&
        flag !== "1"
    ) {

        if (
            savedData &&
            (
                savedData.paymentFlag === "0" ||
                savedData.paymentFlag === "1"
            )
        ) {

            flag =
                savedData.paymentFlag;

        }

        else {

            // Default Ready Cash

            flag = "1";

        }


        setPaymentFlag(flag);

    }


    console.log(
        "CURRENT FLAG:",
        flag
    );


    // ========================================================
    // READY CASH
    // ========================================================

    if (
        flag === "1"
    ) {

        selectReadyCash();

    }


    // ========================================================
    // ADVANCE
    // ========================================================

    else {

        let amount = 0;


        if (
            savedData &&
            savedData.advanceAmount !== undefined
        ) {

            amount =
                numberValue(
                    savedData.advanceAmount
                );

        }

        else {

            amount =
                numberValue(
                    localStorage.getItem(
                        "advanceAmount"
                    )
                );

        }


        if (
            amount > grandTotal
        ) {

            amount =
                grandTotal;

        }


        if (advanceAmountInput) {

            advanceAmountInput.value =
                amount > 0
                    ? amount.toFixed(2)
                    : "";

        }


        displayBalance(
            grandTotal - amount
        );


        saveAdvanceData();

    }


    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE PAGE INITIALIZED"
    );

    console.log(
        "Grand Total:",
        grandTotal
    );

    console.log(
        "Payment Flag:",
        getPaymentFlag()
    );

    console.log(
        "=========================================="

    );

}


// ============================================================
// START
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAdvancePage
    );

}

else {

    initializeAdvancePage();

}
