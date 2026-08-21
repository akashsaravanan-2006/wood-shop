// ============================================================
// ADVANCE.JS - FINAL DEBUG VERSION
//
// FLOW:
// Discount -> Advance -> Bill
//
// PAYMENT FLAG:
// Ready Cash = 1
// Advance    = 0
// ============================================================

"use strict";

console.log("==========================================");
console.log("ADVANCE.JS FINAL VERSION LOADED");
console.log("==========================================");


// ============================================================
// ELEMENTS
// ============================================================

let grandTotalElement = null;
let advanceAmountInput = null;
let balanceAmountInput = null;
let advanceSection = null;
let nextBtn = null;
let backBtn = null;

let grandTotal = 0;


// ============================================================
// GET ELEMENTS
// ============================================================

function getElements() {

    grandTotalElement =
        document.getElementById("grandTotal");

    advanceAmountInput =
        document.getElementById("advanceAmount");

    balanceAmountInput =
        document.getElementById("balanceAmount");

    advanceSection =
        document.getElementById("advanceSection");

    nextBtn =
        document.getElementById("nextBtn");

    backBtn =
        document.getElementById("backBtn");


    console.log("ELEMENT CHECK");
    console.log("grandTotal:", grandTotalElement);
    console.log("advanceAmount:", advanceAmountInput);
    console.log("balanceAmount:", balanceAmountInput);
    console.log("advanceSection:", advanceSection);
    console.log("nextBtn:", nextBtn);
    console.log("backBtn:", backBtn);

}


// ============================================================
// NUMBER
// ============================================================

function toNumber(value) {

    const n = Number(value);

    return Number.isFinite(n)
        ? n
        : 0;

}


// ============================================================
// GET FINAL TOTAL
// ============================================================

function getFinalTotal() {

    let total = 0;


    // --------------------------------------------------------
    // 1. DISCOUNT DATA
    // --------------------------------------------------------

    try {

        if (typeof getPageData === "function") {

            const data =
                getPageData("discount");

            console.log(
                "DISCOUNT DATA:",
                data
            );


            if (
                data &&
                data.grandTotal !== undefined
            ) {

                total =
                    toNumber(
                        data.grandTotal
                    );

            }

        }

    }
    catch (error) {

        console.error(
            "DISCOUNT DATA ERROR:",
            error
        );

    }


    // --------------------------------------------------------
    // 2. finalGrandTotal
    // --------------------------------------------------------

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "finalGrandTotal"
                )
            );

    }


    // --------------------------------------------------------
    // 3. grandTotal
    // --------------------------------------------------------

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "grandTotal"
                )
            );

    }


    // --------------------------------------------------------
    // 4. woodGrandTotal
    // --------------------------------------------------------

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "woodGrandTotal"
                )
            );

    }


    console.log(
        "FINAL TOTAL FROM DISCOUNT:",
        total
    );


    return Math.max(
        0,
        total
    );

}


// ============================================================
// DISPLAY GRAND TOTAL
// ============================================================

function displayGrandTotal() {

    grandTotal =
        getFinalTotal();


    const amount =
        "₹ " +
        grandTotal.toFixed(2);


    console.log(
        "DISPLAY GRAND TOTAL:",
        amount
    );


    if (!grandTotalElement) {

        console.error(
            "ERROR: grandTotal ELEMENT NOT FOUND"
        );

        return;

    }


    // INPUT

    if (
        grandTotalElement.tagName === "INPUT"
    ) {

        grandTotalElement.value =
            amount;

    }

    // SPAN / DIV / STRONG

    else {

        grandTotalElement.textContent =
            amount;

    }

}


// ============================================================
// SHOW ADVANCE SECTION
// ============================================================

function showAdvanceSection() {

    if (!advanceSection) {

        console.error(
            "advanceSection NOT FOUND"
        );

        return;

    }


    advanceSection.style.display =
        "block";


    console.log(
        "ADVANCE SECTION = SHOW"
    );

}


// ============================================================
// HIDE ADVANCE SECTION
// ============================================================

function hideAdvanceSection() {

    if (!advanceSection) {

        return;

    }


    advanceSection.style.display =
        "none";


    console.log(
        "ADVANCE SECTION = HIDE"
    );

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance(amount) {

    if (!balanceAmountInput) {

        return;

    }


    amount =
        Math.max(
            0,
            toNumber(amount)
        );


    balanceAmountInput.value =
        "₹ " +
        amount.toFixed(2);


    console.log(
        "BALANCE:",
        amount.toFixed(2)
    );

}


// ============================================================
// PAYMENT FLAG
// ============================================================

function setPaymentFlag(flag) {

    localStorage.setItem(
        "paymentFlag",
        flag
    );


    console.log(
        "PAYMENT FLAG =",
        flag
    );

}


function getPaymentFlag() {

    const flag =
        localStorage.getItem(
            "paymentFlag"
        );


    if (
        flag === "0" ||
        flag === "1"
    ) {

        return flag;

    }


    return "1";

}


// ============================================================
// READY CASH
// ============================================================

function selectReadyCash() {

    console.log(
        "READY CASH CLICKED"
    );


    // FLAG = 1

    setPaymentFlag("1");


    localStorage.setItem(
        "paymentType",
        "cash"
    );


    // Full payment

    if (advanceAmountInput) {

        advanceAmountInput.value =
            grandTotal.toFixed(2);

    }


    // Balance zero

    displayBalance(0);


    // Hide advance input

    hideAdvanceSection();


    saveAdvanceData();


    updateCardUI(
        "readycash"
    );

}


// ============================================================
// ADVANCE
// ============================================================

function selectAdvance() {

    console.log(
        "ADVANCE CLICKED"
    );


    // FLAG = 0

    setPaymentFlag("0");


    localStorage.setItem(
        "paymentType",
        "advance"
    );


    // Show advance section

    showAdvanceSection();


    let amount = 0;


    if (advanceAmountInput) {

        amount =
            toNumber(
                advanceAmountInput.value
            );

    }


    if (
        amount > grandTotal
    ) {

        amount =
            grandTotal;

        advanceAmountInput.value =
            grandTotal;

    }


    displayBalance(
        grandTotal - amount
    );


    saveAdvanceData();


    updateCardUI(
        "advance"
    );

}


// ============================================================
// PAYMENT MODE
// ============================================================

function selectCashMode() {

    localStorage.setItem(
        "paymentMode",
        "cash"
    );


    console.log(
        "PAYMENT MODE = CASH"
    );


    updateModeUI("cash");


    saveAdvanceData();

}


function selectUpiMode() {

    localStorage.setItem(
        "paymentMode",
        "upi"
    );


    console.log(
        "PAYMENT MODE = UPI"
    );


    updateModeUI("upi");


    saveAdvanceData();

}


// ============================================================
// CARD UI
// ============================================================

function updateCardUI(type) {

    console.log(
        "UPDATING PAYMENT UI:",
        type
    );


    // Find all elements that contain payment text

    const all =
        document.querySelectorAll(
            "label, div, button"
        );


    all.forEach(
        function(element) {

            const text =
                element.textContent
                    .trim()
                    .toLowerCase();


            // Only direct-ish card elements
            // with payment wording

            if (
                text.includes("ready cash") &&
                text.length < 150
            ) {

                if (
                    type === "readycash"
                ) {

                    element.classList.add(
                        "selected"
                    );

                }
                else {

                    element.classList.remove(
                        "selected"
                    );

                }

            }


            if (
                text === "advance" ||
                (
                    text.includes("advance") &&
                    text.length < 100
                )
            ) {

                if (
                    type === "advance"
                ) {

                    element.classList.add(
                        "selected"
                    );

                }
                else {

                    element.classList.remove(
                        "selected"
                    );

                }

            }

        }
    );

}


// ============================================================
// MODE UI
// ============================================================

function updateModeUI(mode) {

    console.log(
        "MODE UI:",
        mode
    );

}


// ============================================================
// SAVE DATA
// ============================================================

function saveAdvanceData() {

    const flag =
        getPaymentFlag();


    let paymentType =
        "cash";


    let advanceAmount =
        grandTotal;


    let balanceAmount =
        0;


    // --------------------------------------------------------
    // READY CASH
    // --------------------------------------------------------

    if (flag === "1") {

        paymentType =
            "cash";

        advanceAmount =
            grandTotal;

        balanceAmount =
            0;

    }


    // --------------------------------------------------------
    // ADVANCE
    // --------------------------------------------------------

    else {

        paymentType =
            "advance";


        advanceAmount =
            toNumber(
                advanceAmountInput
                    ? advanceAmountInput.value
                    : 0
            );


        if (
            advanceAmount < 0
        ) {

            advanceAmount = 0;

        }


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


    const data = {

        paymentType:
            paymentType,

        paymentMode:
            paymentMode,

        paymentFlag:
            flag,

        grandTotal:
            grandTotal,

        advanceAmount:
            advanceAmount,

        balanceAmount:
            balanceAmount

    };


    // Central storage

    try {

        if (
            typeof savePageData === "function"
        ) {

            savePageData(
                "advance",
                data
            );

        }

    }
    catch (error) {

        console.error(
            "STORE DATA ERROR:",
            error
        );

    }


    // Local storage

    localStorage.setItem(
        "paymentType",
        paymentType
    );


    localStorage.setItem(
        "paymentMode",
        paymentMode
    );


    localStorage.setItem(
        "paymentFlag",
        flag
    );


    localStorage.setItem(
        "advanceAmount",
        advanceAmount.toFixed(2)
    );


    localStorage.setItem(
        "balanceAmount",
        balanceAmount.toFixed(2)
    );


    console.log(
        "ADVANCE DATA SAVED:",
        data
    );

}


// ============================================================
// IMPORTANT:
// PAYMENT CARD CLICK HANDLER
//
// This does NOT depend on CSS class names.
// ============================================================

function setupPaymentClick() {

    document.addEventListener(
        "click",
        function(event) {

            // Don't interfere with actual buttons

            if (
                event.target.closest(
                    "#nextBtn"
                ) ||
                event.target.closest(
                    "#backBtn"
                )
            ) {

                return;

            }


            // Find nearest useful clickable element

            const clicked =
                event.target.closest(
                    "label, .card, .option, .payment-card, .payment-option, .mode-card"
                );


            if (!clicked) {

                return;

            }


            const text =
                clicked.textContent
                    .trim()
                    .toLowerCase();


            console.log(
                "CLICK DETECTED:",
                text
            );


            // ------------------------------------------------
            // READY CASH
            // ------------------------------------------------

            if (
                text.includes("ready cash")
            ) {

                event.preventDefault();


                selectReadyCash();

                return;

            }


            // ------------------------------------------------
            // ADVANCE
            // ------------------------------------------------

            if (
                text.includes("advance")
            ) {

                event.preventDefault();


                selectAdvance();

                return;

            }


            // ------------------------------------------------
            // UPI
            // ------------------------------------------------

            if (
                text.includes("upi")
            ) {

                event.preventDefault();


                selectUpiMode();

                return;

            }


            // ------------------------------------------------
            // CASH MODE
            // ------------------------------------------------

            if (
                text.includes("cash")
            ) {

                event.preventDefault();


                selectCashMode();

                return;

            }

        },
        false
    );

}


// ============================================================
// ADVANCE AMOUNT INPUT
// ============================================================

function setupAdvanceInput() {

    if (!advanceAmountInput) {

        return;

    }


    advanceAmountInput.addEventListener(
        "input",
        function() {

            // Selecting advance automatically

            setPaymentFlag("0");


            localStorage.setItem(
                "paymentType",
                "advance"
            );


            let amount =
                toNumber(
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
                    grandTotal;

            }


            displayBalance(
                grandTotal - amount
            );


            saveAdvanceData();

        }
    );

}


// ============================================================
// NEXT BUTTON
// ADVANCE -> BILL
// ============================================================

function setupNextButton() {

    if (!nextBtn) {

        console.error(
            "NEXT BUTTON NOT FOUND"
        );

        return;

    }


    console.log(
        "NEXT BUTTON CONNECTED"
    );


    nextBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();


            console.log(
                "================================"
            );

            console.log(
                "NEXT BUTTON CLICKED"
            );


            saveAdvanceData();


            console.log(
                "REDIRECTING TO BILL.HTML"
            );


            window.location.assign(
                "./bill.html"
            );

        },
        false
    );

}


// ============================================================
// BACK BUTTON
// ADVANCE -> DISCOUNT
// ============================================================

function setupBackButton() {

    if (!backBtn) {

        console.error(
            "BACK BUTTON NOT FOUND"
        );

        return;

    }


    console.log(
        "BACK BUTTON CONNECTED"
    );


    backBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();


            console.log(
                "================================"
            );

            console.log(
                "BACK BUTTON CLICKED"
            );


            saveAdvanceData();


            console.log(
                "REDIRECTING TO DISCOUNT.HTML"
            );


            window.location.assign(
                "./discount.html"
            );

        },
        false
    );

}


// ============================================================
// LOAD SAVED PAYMENT
// ============================================================

function loadPaymentState() {

    const flag =
        getPaymentFlag();


    console.log(
        "SAVED PAYMENT FLAG:",
        flag
    );


    if (flag === "1") {

        selectReadyCash();

    }
    else {

        showAdvanceSection();

        updateCardUI(
            "advance"
        );


        const savedAmount =
            toNumber(
                localStorage.getItem(
                    "advanceAmount"
                )
            );


        if (advanceAmountInput) {

            advanceAmountInput.value =
                savedAmount > 0
                    ? savedAmount
                    : "";

        }


        displayBalance(
            grandTotal - savedAmount
        );

    }

}


// ============================================================
// INITIALIZE
// ============================================================

function initialize() {

    console.log(
        "=========================================="
    );

    console.log(
        "INITIALIZING ADVANCE PAGE"
    );


    getElements();


    // Get final total

    grandTotal =
        getFinalTotal();


    // Display total

    displayGrandTotal();


    // Setup buttons

    setupPaymentClick();

    setupAdvanceInput();

    setupNextButton();

    setupBackButton();


    // Restore previous state

    loadPaymentState();


    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE PAGE READY"
    );

    console.log(
        "TOTAL:",
        grandTotal
    );

    console.log(
        "FLAG:",
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
        initialize
    );

}
else {

    initialize();

}
