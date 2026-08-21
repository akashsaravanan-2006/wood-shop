// ============================================================
// ADVANCE.JS
// VERSION 400
//
// FLOW:
//
// WOOD
//   ↓
// LABOUR
//   ↓
// PERSONAL
//   ↓
// DISCOUNT
//   ↓
// ADVANCE
//   ↓
// BILL
//   ↓
// CBILL
//
// IMPORTANT:
//
// ADVANCE GRAND TOTAL comes ONLY from DISCOUNT FINAL TOTAL.
//
// Advance amount NEVER changes Grand Total.
//
// Grand Total = Discount Final Total
// Balance     = Grand Total - Advance Amount
// ============================================================

console.log("==========================================");
console.log("ADVANCE.JS VERSION 400 LOADED");
console.log("==========================================");


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let grandTotal = 0;

let paymentType = "cash";
let paymentMode = "cash";

let paymentFlag = "1";

let advanceAmount = 0;
let balanceAmount = 0;


// ============================================================
// ELEMENTS
// ============================================================

const grandTotalInput =
    document.getElementById("grandTotal");

const advanceSection =
    document.getElementById("advanceSection");

const advanceAmountInput =
    document.getElementById("advanceAmount");

const balanceAmountInput =
    document.getElementById("balanceAmount");

const calculateBtn =
    document.getElementById("calculateBtn");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// HELPERS
// ============================================================

function toNumber(value) {

    const number =
        parseFloat(value);

    if (
        Number.isFinite(number)
    ) {

        return number;

    }

    return 0;

}


// ============================================================
// MONEY ROUNDING
// ============================================================

function money(value) {

    return Math.round(
        (
            toNumber(value) +
            Number.EPSILON
        ) * 100
    ) / 100;

}


// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(value) {

    return money(value)
        .toFixed(2);

}


// ============================================================
// GET FINAL TOTAL FROM DISCOUNT
//
// ONLY THESE SOURCES ARE USED:
//
// 1. discountFinalTotal
// 2. discountData.finalTotal
//
// DO NOT USE:
// gTotal
// finalTotal
// grandTotal
// newGrandTotal
// old pageData
//
// This prevents old/stale values from other pages.
// ============================================================

function getDiscountFinalTotal() {

    console.log("------------------------------------------");
    console.log("READING TOTAL FROM DISCOUNT PAGE");


    // ========================================================
    // SOURCE 1
    // discountFinalTotal
    // ========================================================

    const savedDiscountTotal =
        localStorage.getItem(
            "discountFinalTotal"
        );


    console.log(
        "discountFinalTotal:",
        savedDiscountTotal
    );


    if (
        savedDiscountTotal !== null &&
        savedDiscountTotal !== ""
    ) {

        const total =
            money(savedDiscountTotal);


        if (total >= 0) {

            console.log(
                "USING discountFinalTotal:",
                total
            );

            return total;

        }

    }


    // ========================================================
    // SOURCE 2
    // discountData.finalTotal
    // ========================================================

    const discountDataString =
        localStorage.getItem(
            "discountData"
        );


    console.log(
        "discountData:",
        discountDataString
    );


    if (discountDataString) {

        try {

            const discountData =
                JSON.parse(
                    discountDataString
                );


            console.log(
                "PARSED DISCOUNT DATA:",
                discountData
            );


            if (
                discountData &&
                discountData.finalTotal !== undefined &&
                discountData.finalTotal !== null
            ) {

                const total =
                    money(
                        discountData.finalTotal
                    );


                console.log(
                    "USING discountData.finalTotal:",
                    total
                );


                return total;

            }

        }
        catch (error) {

            console.error(
                "DISCOUNT DATA JSON ERROR:",
                error
            );

        }

    }


    // ========================================================
    // NOTHING FOUND
    // ========================================================

    console.error(
        "=========================================="
    );

    console.error(
        "ADVANCE ERROR:"
    );

    console.error(
        "DISCOUNT FINAL TOTAL NOT FOUND"
    );

    console.error(
        "=========================================="
    );


    return 0;

}


// ============================================================
// DISPLAY GRAND TOTAL
//
// IMPORTANT:
//
// This only displays the value.
// It does NOT modify the value.
// ============================================================

function displayGrandTotal() {

    if (!grandTotalInput) {

        console.error(
            "ERROR: #grandTotal NOT FOUND"
        );

        return;

    }


    grandTotalInput.value =
        "₹ " +
        formatMoney(grandTotal);


    console.log(
        "GRAND TOTAL DISPLAYED:",
        grandTotalInput.value
    );

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance() {

    if (!balanceAmountInput) {

        console.error(
            "ERROR: #balanceAmount NOT FOUND"
        );

        return;

    }


    balanceAmountInput.value =
        "₹ " +
        formatMoney(balanceAmount);


    console.log(
        "BALANCE DISPLAYED:",
        balanceAmountInput.value
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
        "ADVANCE SECTION: SHOW"
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
        "ADVANCE SECTION: HIDE"
    );

}


// ============================================================
// CALCULATE BALANCE
//
// GRAND TOTAL NEVER CHANGES.
//
// Example:
//
// Grand Total = 900
// Advance     = 200
//
// Balance = 700
//
// Grand Total remains 900.
// ============================================================

function calculateBalance() {

    console.log("------------------------------------------");
    console.log("CALCULATING BALANCE");


    // ========================================================
    // READY CASH
    // ========================================================

    if (
        paymentType === "cash"
    ) {

        advanceAmount =
            grandTotal;

        balanceAmount =
            0;


        displayBalance();


        console.log(
            "READY CASH:"
        );

        console.log(
            "GRAND TOTAL:",
            grandTotal
        );

        console.log(
            "ADVANCE:",
            advanceAmount
        );

        console.log(
            "BALANCE:",
            balanceAmount
        );


        return;

    }


    // ========================================================
    // ADVANCE PAYMENT
    // ========================================================

    advanceAmount =
        toNumber(
            advanceAmountInput
                ? advanceAmountInput.value
                : 0
        );


    // --------------------------------------------------------
    // Negative check
    // --------------------------------------------------------

    if (
        advanceAmount < 0
    ) {

        advanceAmount = 0;

    }


    // --------------------------------------------------------
    // Cannot exceed Grand Total
    // --------------------------------------------------------

    if (
        advanceAmount > grandTotal
    ) {

        alert(
            "Advance amount cannot be greater than Grand Total."
        );


        advanceAmount =
            grandTotal;


        if (advanceAmountInput) {

            advanceAmountInput.value =
                formatMoney(grandTotal);

        }

    }


    // ========================================================
    // IMPORTANT
    //
    // DO NOT CHANGE grandTotal.
    //
    // Only calculate balance.
    // ========================================================

    balanceAmount =
        money(
            grandTotal -
            advanceAmount
        );


    if (
        balanceAmount < 0
    ) {

        balanceAmount = 0;

    }


    displayBalance();


    console.log(
        "GRAND TOTAL:",
        grandTotal
    );

    console.log(
        "ADVANCE AMOUNT:",
        advanceAmount
    );

    console.log(
        "BALANCE:",
        balanceAmount
    );

}


// ============================================================
// PAYMENT TYPE
// ============================================================

function updatePaymentType() {

    const selected =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (!selected) {

        return;

    }


    paymentType =
        selected.value;


    console.log(
        "PAYMENT TYPE:",
        paymentType
    );


    // ========================================================
    // READY CASH
    // ========================================================

    if (
        paymentType === "cash"
    ) {

        paymentFlag = "1";


        hideAdvanceSection();


        advanceAmount =
            grandTotal;


        balanceAmount =
            0;


        if (advanceAmountInput) {

            advanceAmountInput.value =
                formatMoney(grandTotal);

        }


        displayBalance();

    }


    // ========================================================
    // ADVANCE
    // ========================================================

    else if (
        paymentType === "advance"
    ) {

        paymentFlag = "0";


        showAdvanceSection();


        // Start with zero.
        // User enters advance amount.

        advanceAmount = 0;

        balanceAmount =
            grandTotal;


        if (advanceAmountInput) {

            advanceAmountInput.value =
                "";

        }


        displayBalance();

    }


    // ========================================================
    // SAVE PAYMENT TYPE
    // ========================================================

    localStorage.setItem(
        "paymentType",
        paymentType
    );


    localStorage.setItem(
        "paymentFlag",
        paymentFlag
    );


    console.log(
        "PAYMENT FLAG:",
        paymentFlag
    );

}


// ============================================================
// PAYMENT MODE
// ============================================================

function updatePaymentMode() {

    const selected =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        );


    if (!selected) {

        return;

    }


    paymentMode =
        selected.value;


    localStorage.setItem(
        "paymentMode",
        paymentMode
    );


    console.log(
        "PAYMENT MODE:",
        paymentMode
    );

}


// ============================================================
// SAVE ADVANCE DATA
//
// IMPORTANT:
//
// grandTotal is ALWAYS the Discount final total.
//
// Advance amount and balance are stored separately.
// ============================================================

function saveAdvanceData() {

    const data = {

        paymentType:
            paymentType,

        paymentMode:
            paymentMode,

        paymentFlag:
            paymentFlag,

        grandTotal:
            money(grandTotal),

        advanceAmount:
            money(advanceAmount),

        balanceAmount:
            money(balanceAmount),

        savedAt:
            new Date().toISOString()

    };


    // ========================================================
    // MAIN DATA
    // ========================================================

    localStorage.setItem(
        "advanceData",
        JSON.stringify(data)
    );


    // ========================================================
    // INDIVIDUAL VALUES
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
        "paymentFlag",
        paymentFlag
    );


    localStorage.setItem(
        "advanceAmount",
        money(advanceAmount).toFixed(2)
    );


    localStorage.setItem(
        "balanceAmount",
        money(balanceAmount).toFixed(2)
    );


    localStorage.setItem(
        "advanceGrandTotal",
        money(grandTotal).toFixed(2)
    );


    console.log("==========================================");
    console.log("ADVANCE DATA SAVED");
    console.log(data);
    console.log("==========================================");

}


// ============================================================
// PAYMENT TYPE RADIO
// ============================================================

document
    .querySelectorAll(
        'input[name="paymentType"]'
    )
    .forEach(
        function (radio) {

            radio.addEventListener(
                "change",
                function () {

                    updatePaymentType();

                }
            );

        }
    );


// ============================================================
// PAYMENT MODE RADIO
// ============================================================

document
    .querySelectorAll(
        'input[name="paymentMode"]'
    )
    .forEach(
        function (radio) {

            radio.addEventListener(
                "change",
                function () {

                    updatePaymentMode();

                }
            );

        }
    );


// ============================================================
// ADVANCE AMOUNT INPUT
//
// Update Balance while typing.
// ============================================================

if (advanceAmountInput) {

    advanceAmountInput.addEventListener(
        "input",
        function () {

            if (
                paymentType !== "advance"
            ) {

                return;

            }


            calculateBalance();

        }
    );

}


// ============================================================
// CALCULATE BUTTON
// ============================================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            console.log(
                "CALCULATE BALANCE CLICKED"
            );


            calculateBalance();


            saveAdvanceData();

        }
    );

}


// ============================================================
// NEXT BUTTON
//
// ADVANCE -> BILL
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            console.log("==========================================");
            console.log("ADVANCE NEXT CLICKED");


            // =================================================
            // GET CURRENT PAYMENT TYPE
            // =================================================

            const selected =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            if (selected) {

                paymentType =
                    selected.value;

            }


            // =================================================
            // READY CASH
            // =================================================

            if (
                paymentType === "cash"
            ) {

                paymentFlag = "1";


                advanceAmount =
                    grandTotal;


                balanceAmount =
                    0;

            }


            // =================================================
            // ADVANCE
            // =================================================

            else {

                paymentFlag = "0";


                advanceAmount =
                    toNumber(
                        advanceAmountInput
                            ? advanceAmountInput.value
                            : 0
                    );


                if (
                    advanceAmount <= 0
                ) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    return;

                }


                if (
                    advanceAmount > grandTotal
                ) {

                    alert(
                        "Advance amount cannot be greater than Grand Total."
                    );

                    return;

                }


                balanceAmount =
                    money(
                        grandTotal -
                        advanceAmount
                    );

            }


            // =================================================
            // PAYMENT MODE
            // =================================================

            const selectedMode =
                document.querySelector(
                    'input[name="paymentMode"]:checked'
                );


            if (selectedMode) {

                paymentMode =
                    selectedMode.value;

            }


            // =================================================
            // SAVE
            // =================================================

            saveAdvanceData();


            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "FINAL GRAND TOTAL:",
                grandTotal
            );

            console.log(
                "FINAL ADVANCE:",
                advanceAmount
            );

            console.log(
                "FINAL BALANCE:",
                balanceAmount
            );


            // =================================================
            // GO TO BILL
            // =================================================

            console.log(
                "REDIRECTING TO bill.html"
            );


            window.location.href =
                "bill.html";

        }
    );

}


// ============================================================
// BACK BUTTON
//
// ADVANCE -> DISCOUNT
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            console.log(
                "ADVANCE BACK -> DISCOUNT"
            );


            window.location.href =
                "discount.html";

        }
    );

}


// ============================================================
// INITIALIZE
// ============================================================

function initializeAdvancePage() {

    console.log("==========================================");
    console.log("ADVANCE PAGE INITIALIZING");


    // ========================================================
    // CHECK HTML
    // ========================================================

    if (!grandTotalInput) {

        console.error(
            "ERROR: grandTotal element missing"
        );

    }


    if (!advanceSection) {

        console.error(
            "ERROR: advanceSection element missing"
        );

    }


    if (!advanceAmountInput) {

        console.error(
            "ERROR: advanceAmount element missing"
        );

    }


    if (!balanceAmountInput) {

        console.error(
            "ERROR: balanceAmount element missing"
        );

    }


    // ========================================================
    // GET TOTAL FROM DISCOUNT
    // ========================================================

    grandTotal =
        getDiscountFinalTotal();


    console.log(
        "FINAL GRAND TOTAL FROM DISCOUNT:",
        grandTotal
    );


    // ========================================================
    // DISPLAY
    // ========================================================

    displayGrandTotal();


    // ========================================================
    // DEFAULT PAYMENT TYPE
    //
    // HTML already has Ready Cash checked.
    // ========================================================

    const selectedType =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (selectedType) {

        paymentType =
            selectedType.value;

    }


    const selectedMode =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        );


    if (selectedMode) {

        paymentMode =
            selectedMode.value;

    }


    // ========================================================
    // INITIAL PAYMENT STATE
    // ========================================================

    if (
        paymentType === "advance"
    ) {

        paymentFlag = "0";

        showAdvanceSection();

        advanceAmount = 0;

        balanceAmount =
            grandTotal;

        displayBalance();

    }
    else {

        paymentType = "cash";

        paymentFlag = "1";

        hideAdvanceSection();

        advanceAmount =
            grandTotal;

        balanceAmount = 0;

        if (advanceAmountInput) {

            advanceAmountInput.value =
                formatMoney(grandTotal);

        }

        displayBalance();

    }


    // ========================================================
    // SAVE INITIAL STATE
    // ========================================================

    saveAdvanceData();


    console.log(
        "PAYMENT TYPE:",
        paymentType
    );

    console.log(
        "PAYMENT MODE:",
        paymentMode
    );

    console.log(
        "PAYMENT FLAG:",
        paymentFlag
    );

    console.log("ADVANCE PAGE READY");
    console.log("==========================================");

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


// ============================================================
// OPTIONAL GLOBAL FUNCTIONS
// ============================================================

window.calculateBalance =
    calculateBalance;

window.saveAdvanceData =
    saveAdvanceData;

console.log(
    "ADVANCE.JS VERSION 400 READY"
);
