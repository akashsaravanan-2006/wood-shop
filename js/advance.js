// ============================================================
// ADVANCE.JS
// ============================================================
//
// FLOW:
//
// Personal
//    ↓
// Discount
//    ↓
// Advance
//    ↓
// Bill
//
// PAYMENT FLAG:
//
// Ready Cash = "1"
// Advance   = "0"
//
// ============================================================

"use strict";

console.log("==========================================");
console.log("ADVANCE.JS STARTING");
console.log("==========================================");


// ============================================================
// HTML ELEMENTS
// ============================================================

let grandTotalElement;
let advanceAmountInput;
let balanceAmountInput;
let nextBtn;
let backBtn;
let advanceSection;


// ============================================================
// GLOBAL VARIABLES
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

    nextBtn =
        document.getElementById("nextBtn");

    backBtn =
        document.getElementById("backBtn");

    advanceSection =
        document.getElementById("advanceSection");


    console.log("ADVANCE ELEMENTS:");

    console.log(
        "grandTotal:",
        grandTotalElement
    );

    console.log(
        "advanceAmount:",
        advanceAmountInput
    );

    console.log(
        "balanceAmount:",
        balanceAmountInput
    );

    console.log(
        "nextBtn:",
        nextBtn
    );

    console.log(
        "backBtn:",
        backBtn
    );

    console.log(
        "advanceSection:",
        advanceSection
    );
}


// ============================================================
// NUMBER HELPER
// ============================================================

function toNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return number;
}


// ============================================================
// GET GRAND TOTAL
// ============================================================
//
// Priority:
//
// 1. Discount page data
// 2. Central totals
// 3. localStorage finalGrandTotal
// 4. localStorage grandTotal
// 5. wood grand total
//
// ============================================================

function getGrandTotal() {

    let total = 0;


    // ========================================================
    // SOURCE 1
    // DISCOUNT DATA
    // ========================================================

    try {

        if (
            typeof getPageData === "function"
        ) {

            const discountData =
                getPageData("discount");


            console.log(
                "SOURCE 1 - DISCOUNT DATA:",
                discountData
            );


            if (
                discountData &&
                discountData.grandTotal !== undefined
            ) {

                total =
                    toNumber(
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
    // CENTRAL TOTALS
    // ========================================================

    if (total <= 0) {

        try {

            if (
                typeof getTotals === "function"
            ) {

                const totals =
                    getTotals();


                console.log(
                    "SOURCE 2 - CENTRAL TOTALS:",
                    totals
                );


                if (
                    totals &&
                    totals.grandTotal !== undefined
                ) {

                    total =
                        toNumber(
                            totals.grandTotal
                        );

                }

            }

        }
        catch (error) {

            console.error(
                "CENTRAL TOTAL ERROR:",
                error
            );

        }

    }


    // ========================================================
    // SOURCE 3
    // finalGrandTotal
    // ========================================================

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "finalGrandTotal"
                )
            );


        console.log(
            "SOURCE 3 - finalGrandTotal:",
            total
        );

    }


    // ========================================================
    // SOURCE 4
    // grandTotal
    // ========================================================

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "grandTotal"
                )
            );


        console.log(
            "SOURCE 4 - grandTotal:",
            total
        );

    }


    // ========================================================
    // SOURCE 5
    // woodGrandTotal
    // ========================================================

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "woodGrandTotal"
                )
            );


        console.log(
            "SOURCE 5 - woodGrandTotal:",
            total
        );

    }


    // ========================================================
    // FINAL
    // ========================================================

    console.log(
        "FINAL GRAND TOTAL:",
        total
    );


    return Math.max(0, total);

}


// ============================================================
// REFRESH GRAND TOTAL
// ============================================================

function refreshGrandTotal() {

    grandTotal =
        getGrandTotal();


    console.log(
        "GRAND TOTAL USED:",
        grandTotal
    );


    if (grandTotalElement) {

        grandTotalElement.value =
            "₹ " + grandTotal.toFixed(2);

        grandTotalElement.textContent =
            "₹ " + grandTotal.toFixed(2);

    }

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance(amount) {

    amount =
        Math.max(
            0,
            toNumber(amount)
        );


    if (!balanceAmountInput) {
        return;
    }


    balanceAmountInput.value =
        "₹ " + amount.toFixed(2);


    console.log(
        "BALANCE:",
        amount.toFixed(2)
    );

}


// ============================================================
// SHOW ADVANCE SECTION
// ============================================================

function showAdvanceSection() {

    if (!advanceSection) {
        return;
    }


    advanceSection.style.display =
        "block";


    console.log(
        "ADVANCE SECTION: SHOWN"
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
        "ADVANCE SECTION: HIDDEN"
    );

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
        flag === "0" ||
        flag === "1"
    ) {

        return flag;

    }


    // Default = Ready Cash

    return "1";

}


// ============================================================
// SET PAYMENT FLAG
// ============================================================

function setPaymentFlag(flag) {

    if (
        flag !== "0" &&
        flag !== "1"
    ) {

        flag = "1";

    }


    localStorage.setItem(
        "paymentFlag",
        flag
    );


    console.log(
        "PAYMENT FLAG SET:",
        flag
    );

}


// ============================================================
// SET PAYMENT TYPE
// ============================================================

function setPaymentType(type) {

    console.log(
        "=========================================="
    );

    console.log(
        "SETTING PAYMENT TYPE:",
        type
    );


    // ========================================================
    // READY CASH
    // FLAG = 1
    // ========================================================

    if (type === "cash") {

        setPaymentFlag("1");


        localStorage.setItem(
            "paymentType",
            "cash"
        );


        hideAdvanceSection();


        if (advanceAmountInput) {

            advanceAmountInput.value =
                grandTotal.toFixed(2);

        }


        displayBalance(0);


        console.log(
            "READY CASH SELECTED"
        );

    }


    // ========================================================
    // ADVANCE
    // FLAG = 0
    // ========================================================

    else if (type === "advance") {

        setPaymentFlag("0");


        localStorage.setItem(
            "paymentType",
            "advance"
        );


        showAdvanceSection();


        let amount = 0;


        if (advanceAmountInput) {

            amount =
                toNumber(
                    advanceAmountInput.value
                );

        }


        // Never allow advance greater than total

        if (amount > grandTotal) {

            amount =
                grandTotal;

        }


        if (amount < 0) {

            amount = 0;

        }


        if (advanceAmountInput) {

            if (amount > 0) {

                advanceAmountInput.value =
                    amount;

            }

        }


        displayBalance(
            grandTotal - amount
        );


        console.log(
            "ADVANCE SELECTED"
        );

    }


    saveAdvanceData();

}


// ============================================================
// SAVE ADVANCE DATA
// ============================================================

function saveAdvanceData() {

    const flag =
        getPaymentFlag();


    const paymentType =
        flag === "1"
            ? "cash"
            : "advance";


    let advanceAmount = 0;

    let balanceAmount = 0;


    // ========================================================
    // READY CASH
    // ========================================================

    if (flag === "1") {

        advanceAmount =
            grandTotal;

        balanceAmount = 0;

    }


    // ========================================================
    // ADVANCE
    // ========================================================

    else {

        advanceAmount =
            toNumber(
                advanceAmountInput
                    ? advanceAmountInput.value
                    : 0
            );


        if (advanceAmount < 0) {

            advanceAmount = 0;

        }


        if (advanceAmount > grandTotal) {

            advanceAmount =
                grandTotal;

        }


        balanceAmount =
            grandTotal -
            advanceAmount;

    }


    // ========================================================
    // PAYMENT MODE
    // ========================================================

    const paymentMode =
        localStorage.getItem(
            "paymentMode"
        ) || "cash";


    // ========================================================
    // DATA
    // ========================================================

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
    // OLD STORAGE
    // ========================================================

    localStorage.setItem(
        "advanceAmount",
        advanceAmount.toFixed(2)
    );


    localStorage.setItem(
        "balanceAmount",
        balanceAmount.toFixed(2)
    );


    localStorage.setItem(
        "paymentType",
        paymentType
    );


    localStorage.setItem(
        "paymentFlag",
        flag
    );


    localStorage.setItem(
        "paymentMode",
        paymentMode
    );


    console.log(
        "ADVANCE DATA SAVED:",
        data
    );

}


// ============================================================
// PAYMENT CARD LOGIC
// ============================================================
//
// IMPORTANT:
// Do NOT use every <label>.
// Only detect actual payment cards.
//
// ============================================================

function setupPaymentCards() {

    const cards =
        document.querySelectorAll(
            ".payment-card, .payment-option, .option-card"
        );


    console.log(
        "PAYMENT CARDS FOUND:",
        cards.length
    );


    cards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    const text =
                        this.textContent
                            .trim()
                            .toLowerCase();


                    console.log(
                        "PAYMENT CARD CLICKED:",
                        text
                    );


                    // ========================================
                    // READY CASH
                    // ========================================

                    if (
                        text.includes(
                            "ready cash"
                        )
                    ) {

                        setPaymentType(
                            "cash"
                        );

                        return;

                    }


                    // ========================================
                    // ADVANCE
                    // ========================================

                    if (
                        text.includes(
                            "advance"
                        )
                    ) {

                        setPaymentType(
                            "advance"
                        );

                        return;

                    }


                    // ========================================
                    // UPI
                    // ========================================

                    if (
                        text.includes(
                            "upi"
                        )
                    ) {

                        localStorage.setItem(
                            "paymentMode",
                            "upi"
                        );


                        console.log(
                            "PAYMENT MODE: UPI"
                        );


                        saveAdvanceData();

                        return;

                    }


                    // ========================================
                    // CASH MODE
                    // ========================================

                    if (
                        text.includes(
                            "cash"
                        )
                    ) {

                        localStorage.setItem(
                            "paymentMode",
                            "cash"
                        );


                        console.log(
                            "PAYMENT MODE: CASH"
                        );


                        saveAdvanceData();

                    }

                }
            );

        }
    );

}


// ============================================================
// ADVANCE AMOUNT INPUT
// ============================================================

function setupAdvanceInput() {

    if (!advanceAmountInput) {

        console.log(
            "NO ADVANCE INPUT FOUND"
        );

        return;

    }


    advanceAmountInput.addEventListener(
        "input",
        function () {

            const flag =
                getPaymentFlag();


            // ================================================
            // READY CASH
            // ================================================

            if (flag === "1") {

                this.value =
                    grandTotal;

                displayBalance(0);

                saveAdvanceData();

                return;

            }


            // ================================================
            // ADVANCE
            // ================================================

            let amount =
                toNumber(
                    this.value
                );


            if (amount < 0) {

                amount = 0;

            }


            if (amount > grandTotal) {

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
// PAYMENT MODE
// ============================================================

function setupPaymentMode() {

    const paymentModeCards =
        document.querySelectorAll(
            ".payment-mode-card, .mode-card"
        );


    paymentModeCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

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
// NEXT
// ADVANCE -> BILL
// ============================================================

function setupNextButton() {

    if (!nextBtn) {

        console.log(
            "NEXT BUTTON NOT FOUND"
        );

        return;

    }


    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopImmediatePropagation();


            console.log(
                "=========================================="
            );

            console.log(
                "ADVANCE NEXT CLICKED"
            );


            // Recalculate before moving

            refreshGrandTotal();


            // Save latest data

            saveAdvanceData();


            console.log(
                "ADVANCE COMPLETE"
            );

            console.log(
                "REDIRECTING TO BILL.HTML"
            );


            window.location.href =
                "./bill.html";

        }
    );

}


// ============================================================
// BACK
// ADVANCE -> DISCOUNT
// ============================================================

function setupBackButton() {

    if (!backBtn) {

        console.log(
            "BACK BUTTON NOT FOUND"
        );

        return;

    }


    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopImmediatePropagation();


            console.log(
                "=========================================="
            );

            console.log(
                "ADVANCE BACK CLICKED"
            );

            console.log(
                "REDIRECTING TO DISCOUNT.HTML"
            );


            saveAdvanceData();


            window.location.href =
                "./discount.html";

        }
    );

}


// ============================================================
// LOAD SAVED PAYMENT STATE
// ============================================================

function loadPaymentState() {

    const flag =
        getPaymentFlag();


    console.log(
        "SAVED PAYMENT FLAG:",
        flag
    );


    // ========================================================
    // READY CASH
    // ========================================================

    if (flag === "1") {

        setPaymentType(
            "cash"
        );

        return;

    }


    // ========================================================
    // ADVANCE
    // ========================================================

    if (flag === "0") {

        showAdvanceSection();


        let amount =
            toNumber(
                localStorage.getItem(
                    "advanceAmount"
                )
            );


        if (amount > grandTotal) {

            amount =
                grandTotal;

        }


        if (amount < 0) {

            amount = 0;

        }


        if (advanceAmountInput) {

            advanceAmountInput.value =
                amount > 0
                    ? amount
                    : "";

        }


        displayBalance(
            grandTotal - amount
        );


        console.log(
            "ADVANCE PAYMENT RESTORED"
        );


        return;

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


    // Get HTML elements

    getElements();


    // IMPORTANT:
    // Calculate total AFTER page/storage is ready

    refreshGrandTotal();


    // Set default section

    if (advanceSection) {

        advanceSection.style.display =
            "none";

    }


    // Setup controls

    setupPaymentCards();

    setupPaymentMode();

    setupAdvanceInput();

    setupNextButton();

    setupBackButton();


    // Load payment state

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
        "PAYMENT TYPE:",
        localStorage.getItem(
            "paymentType"
        )
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
