// ============================================================
// ADVANCE.JS
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
console.log("ADVANCE.JS DEBUG VERSION");
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


// ============================================================
// GRAND TOTAL
// ============================================================

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
        "advanceSection:",
        advanceSection
    );

    console.log(
        "nextBtn:",
        nextBtn
    );

    console.log(
        "backBtn:",
        backBtn
    );

}


// ============================================================
// NUMBER CONVERSION
// ============================================================

function numberValue(value) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {

        return 0;

    }

    return number;

}


// ============================================================
// GET DISCOUNT TOTAL
// ============================================================

function getDiscountTotal() {

    let total = 0;


    // ========================================================
    // SOURCE 1
    // storedata.js
    // ========================================================

    try {

        if (
            typeof getPageData === "function"
        ) {

            const discountData =
                getPageData("discount");


            console.log(
                "DISCOUNT DATA:",
                discountData
            );


            if (
                discountData &&
                discountData.grandTotal !== undefined
            ) {

                total =
                    numberValue(
                        discountData.grandTotal
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


    // ========================================================
    // SOURCE 2
    // finalGrandTotal
    // ========================================================

    if (total <= 0) {

        total =
            numberValue(
                localStorage.getItem(
                    "finalGrandTotal"
                )
            );


        console.log(
            "finalGrandTotal:",
            total
        );

    }


    // ========================================================
    // SOURCE 3
    // grandTotal
    // ========================================================

    if (total <= 0) {

        total =
            numberValue(
                localStorage.getItem(
                    "grandTotal"
                )
            );


        console.log(
            "grandTotal storage:",
            total
        );

    }


    // ========================================================
    // SOURCE 4
    // woodGrandTotal
    // ========================================================

    if (total <= 0) {

        total =
            numberValue(
                localStorage.getItem(
                    "woodGrandTotal"
                )
            );


        console.log(
            "woodGrandTotal:",
            total
        );

    }


    console.log(
        "FINAL TOTAL:",
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
        getDiscountTotal();


    const formatted =
        "₹ " +
        grandTotal.toFixed(2);


    console.log(
        "DISPLAYING GRAND TOTAL:",
        formatted
    );


    if (!grandTotalElement) {

        console.error(
            "ERROR: #grandTotal NOT FOUND"
        );

        return;

    }


    // ========================================================
    // INPUT / TEXTAREA
    // ========================================================

    if (
        grandTotalElement.tagName === "INPUT" ||
        grandTotalElement.tagName === "TEXTAREA"
    ) {

        grandTotalElement.value =
            formatted;

    }


    // ========================================================
    // SPAN / DIV / STRONG
    // ========================================================

    else {

        grandTotalElement.textContent =
            formatted;

    }


    // Force display

    grandTotalElement.removeAttribute(
        "hidden"
    );


    grandTotalElement.style.visibility =
        "visible";


    console.log(
        "GRAND TOTAL DISPLAY COMPLETE"
    );

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


    advanceSection.hidden = false;


    advanceSection.style.setProperty(
        "display",
        "block",
        "important"
    );


    console.log(
        "ADVANCE SECTION SHOWN"
    );

}


// ============================================================
// HIDE ADVANCE SECTION
// ============================================================

function hideAdvanceSection() {

    if (!advanceSection) {

        console.error(
            "advanceSection NOT FOUND"
        );

        return;

    }


    advanceSection.hidden = true;


    advanceSection.style.setProperty(
        "display",
        "none",
        "important"
    );


    console.log(
        "ADVANCE SECTION HIDDEN"
    );

}


// ============================================================
// PAYMENT FLAG
// ============================================================

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


    // Default Ready Cash

    return "1";

}


// ============================================================
// SET PAYMENT FLAG
// ============================================================

function setPaymentFlag(flag) {

    localStorage.setItem(
        "paymentFlag",
        flag
    );


    console.log(
        "PAYMENT FLAG:",
        flag
    );

}


// ============================================================
// READY CASH
// ============================================================

function selectReadyCash() {

    console.log(
        "READY CASH SELECTED"
    );


    // Flag 1

    setPaymentFlag("1");


    localStorage.setItem(
        "paymentType",
        "cash"
    );


    // Hide advance input

    hideAdvanceSection();


    // Full payment

    if (advanceAmountInput) {

        advanceAmountInput.value =
            grandTotal.toFixed(2);

    }


    // Balance = 0

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


    // Flag 0

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
            numberValue(
                advanceAmountInput.value
            );

    }


    if (
        amount > grandTotal
    ) {

        amount =
            grandTotal;

    }


    if (
        amount < 0
    ) {

        amount = 0;

    }


    if (
        advanceAmountInput &&
        amount > 0
    ) {

        advanceAmountInput.value =
            amount;

    }


    displayBalance(
        grandTotal - amount
    );


    saveAdvanceData();

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance(amount) {

    amount =
        Math.max(
            0,
            numberValue(amount)
        );


    if (!balanceAmountInput) {

        return;

    }


    balanceAmountInput.value =
        "₹ " +
        amount.toFixed(2);


    console.log(
        "BALANCE:",
        amount.toFixed(2)
    );

}


// ============================================================
// SAVE ADVANCE DATA
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


    // ========================================================
    // READY CASH
    // ========================================================

    if (
        flag === "1"
    ) {

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


    // ========================================================
    // CENTRAL STORAGE
    // ========================================================

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
            "savePageData ERROR:",
            error
        );

    }


    // ========================================================
    // LOCAL STORAGE
    // ========================================================

    localStorage.setItem(
        "paymentFlag",
        flag
    );


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
// PAYMENT TYPE CARDS
// ============================================================

function setupPaymentCards() {

    const cards =
        document.querySelectorAll(
            ".payment-card, .payment-option, .option-card"
        );


    console.log(
        "PAYMENT CARDS:",
        cards.length
    );


    cards.forEach(
        function(card) {

            card.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const text =
                        this.textContent
                            .trim()
                            .toLowerCase();


                    console.log(
                        "PAYMENT CARD:",
                        text
                    );


                    if (
                        text.includes(
                            "ready cash"
                        )
                    ) {

                        selectReadyCash();

                        return;

                    }


                    if (
                        text.includes(
                            "advance"
                        )
                    ) {

                        selectAdvance();

                        return;

                    }

                }
            );

        }
    );

}


// ============================================================
// PAYMENT MODE
// ============================================================

function setupPaymentMode() {

    const cards =
        document.querySelectorAll(
            ".payment-mode-card, .mode-card"
        );


    cards.forEach(
        function(card) {

            card.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const text =
                        this.textContent
                            .trim()
                            .toLowerCase();


                    if (
                        text.includes("upi")
                    ) {

                        localStorage.setItem(
                            "paymentMode",
                            "upi"
                        );

                    }
                    else if (
                        text.includes("cash")
                    ) {

                        localStorage.setItem(
                            "paymentMode",
                            "cash"
                        );

                    }


                    console.log(
                        "PAYMENT MODE:",
                        localStorage.getItem(
                            "paymentMode"
                        )
                    );


                    saveAdvanceData();

                }
            );

        }
    );

}


// ============================================================
// ADVANCE INPUT
// ============================================================

function setupAdvanceInput() {

    if (!advanceAmountInput) {

        return;

    }


    advanceAmountInput.addEventListener(
        "input",
        function() {

            // Must be Advance mode

            setPaymentFlag("0");


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
// NEXT
// ADVANCE -> BILL
// ============================================================

function setupNextButton() {

    if (!nextBtn) {

        return;

    }


    nextBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopImmediatePropagation();


            console.log(
                "ADVANCE NEXT CLICKED"
            );


            saveAdvanceData();


            console.log(
                "GOING TO BILL.HTML"
            );


            window.location.assign(
                "./bill.html"
            );

        }
    );

}


// ============================================================
// BACK
// ADVANCE -> DISCOUNT
// ============================================================

function setupBackButton() {

    if (!backBtn) {

        return;

    }


    backBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopImmediatePropagation();


            console.log(
                "ADVANCE BACK CLICKED"
            );


            saveAdvanceData();


            console.log(
                "GOING TO DISCOUNT.HTML"
            );


            window.location.assign(
                "./discount.html"
            );

        }
    );

}


// ============================================================
// LOAD PAYMENT STATE
// ============================================================

function loadPaymentState() {

    const flag =
        getPaymentFlag();


    console.log(
        "LOADING PAYMENT FLAG:",
        flag
    );


    if (
        flag === "1"
    ) {

        selectReadyCash();

    }
    else {

        selectAdvance();

    }

}


// ============================================================
// INITIALIZE
// ============================================================

function initializeAdvancePage() {

    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE PAGE INITIALIZING"
    );


    getElements();


    // VERY IMPORTANT

    displayGrandTotal();


    setupPaymentCards();


    setupPaymentMode();


    setupAdvanceInput();


    setupNextButton();


    setupBackButton();


    loadPaymentState();


    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE PAGE READY"
    );

    console.log(
        "GRAND TOTAL:",
        grandTotal
    );

    console.log(
        "PAYMENT FLAG:",
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


console.log(
    "ADVANCE.JS LOADED SUCCESSFULLY"
);
