// ============================================================
// ADVANCE.JS
// ADVANCE PAYMENT PAGE
//
// FLOW:
// Discount -> Advance -> Bill
//
// PAYMENT TYPE:
// Ready Cash = paymentFlag = 1
// Advance    = paymentFlag = 0
//
// PAYMENT MODE:
// Cash
// UPI
// ============================================================

console.log("==========================================");
console.log("ADVANCE.JS CLEAN VERSION LOADED");
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
// HELPER - NUMBER
// ============================================================

function toNumber(value) {

    const number = parseFloat(value);

    if (Number.isNaN(number)) {
        return 0;
    }

    return number;
}


// ============================================================
// GET ELEMENT
// ============================================================

function get(id) {
    return document.getElementById(id);
}


// ============================================================
// HTML ELEMENTS
// ============================================================

let grandTotalInput;

let advanceSection;
let advanceAmountInput;
let balanceAmountInput;

let calculateBtn;
let nextBtn;
let backBtn;


// ============================================================
// INITIALIZE ELEMENTS
// ============================================================

function initializeElements() {

    grandTotalInput =
        get("grandTotal");

    /*
        Some versions of your HTML may use:
        totalAmount
        grandTotal
    */

    if (!grandTotalInput) {
        grandTotalInput =
            get("totalAmount");
    }


    advanceSection =
        get("advanceSection");


    advanceAmountInput =
        get("advanceAmount");


    balanceAmountInput =
        get("balanceAmount");


    calculateBtn =
        get("calculateBtn");


    nextBtn =
        get("nextBtn");


    backBtn =
        get("backBtn");


    console.log("HTML ELEMENTS INITIALIZED");

    console.log({
        grandTotalInput,
        advanceSection,
        advanceAmountInput,
        balanceAmountInput,
        calculateBtn,
        nextBtn,
        backBtn
    });

}


// ============================================================
// GET FINAL TOTAL FROM DISCOUNT PAGE
// ============================================================

function getFinalTotal() {

    let total = 0;


    // --------------------------------------------------------
    // 1. finalTotal
    // --------------------------------------------------------

    const finalTotal =
        localStorage.getItem("finalTotal");


    if (
        finalTotal !== null &&
        finalTotal !== ""
    ) {

        total =
            toNumber(finalTotal);

        if (total > 0) {

            console.log(
                "FINAL TOTAL FROM localStorage.finalTotal:",
                total
            );

            return total;
        }
    }


    // --------------------------------------------------------
    // 2. grandTotal
    // --------------------------------------------------------

    const savedGrandTotal =
        localStorage.getItem("grandTotal");


    if (
        savedGrandTotal !== null &&
        savedGrandTotal !== ""
    ) {

        total =
            toNumber(savedGrandTotal);

        if (total > 0) {

            console.log(
                "FINAL TOTAL FROM localStorage.grandTotal:",
                total
            );

            return total;
        }
    }


    // --------------------------------------------------------
    // 3. newGrandTotal
    // --------------------------------------------------------

    const newGrandTotal =
        localStorage.getItem("newGrandTotal");


    if (
        newGrandTotal !== null &&
        newGrandTotal !== ""
    ) {

        total =
            toNumber(newGrandTotal);

        if (total > 0) {

            console.log(
                "FINAL TOTAL FROM localStorage.newGrandTotal:",
                total
            );

            return total;
        }
    }


    // --------------------------------------------------------
    // 4. discountData
    // --------------------------------------------------------

    try {

        const discountData =
            JSON.parse(
                localStorage.getItem(
                    "discountData"
                )
            );


        if (
            discountData &&
            discountData.newGrandTotal !== undefined
        ) {

            total =
                toNumber(
                    discountData.newGrandTotal
                );

            if (total > 0) {

                console.log(
                    "FINAL TOTAL FROM discountData:",
                    total
                );

                return total;
            }

        }

    } catch (error) {

        console.warn(
            "discountData could not be read",
            error
        );

    }


    // --------------------------------------------------------
    // 5. pageData / central storage
    // --------------------------------------------------------

    try {

        if (
            typeof getPageData === "function"
        ) {

            const discountPage =
                getPageData("discount");


            if (
                discountPage &&
                discountPage.newGrandTotal !== undefined
            ) {

                total =
                    toNumber(
                        discountPage.newGrandTotal
                    );


                if (total > 0) {

                    console.log(
                        "FINAL TOTAL FROM storedata:",
                        total
                    );

                    return total;
                }

            }

        }

    } catch (error) {

        console.warn(
            "Could not read central storage",
            error
        );

    }


    // --------------------------------------------------------
    // Nothing found
    // --------------------------------------------------------

    console.warn(
        "NO FINAL TOTAL FOUND"
    );


    return 0;

}


// ============================================================
// DISPLAY GRAND TOTAL
// ============================================================

function displayGrandTotal() {

    if (!grandTotalInput) {

        console.warn(
            "Grand total element not found"
        );

        return;
    }


    const formatted =
        "₹ " +
        grandTotal.toFixed(2);


    // INPUT
    if (
        grandTotalInput.tagName === "INPUT"
    ) {

        grandTotalInput.value =
            formatted;

    }

    // NORMAL ELEMENT
    else {

        grandTotalInput.textContent =
            formatted;

    }


    console.log(
        "GRAND TOTAL DISPLAYED:",
        formatted
    );

}


// ============================================================
// PAYMENT FLAG
// ============================================================

function setPaymentFlag(flag) {

    paymentFlag =
        String(flag);


    localStorage.setItem(
        "paymentFlag",
        paymentFlag
    );


    console.log(
        "PAYMENT FLAG =",
        paymentFlag
    );

}


// ============================================================
// GET SAVED PAYMENT FLAG
// ============================================================

function loadPaymentFlag() {

    const saved =
        localStorage.getItem(
            "paymentFlag"
        );


    if (
        saved === "0" ||
        saved === "1"
    ) {

        paymentFlag =
            saved;

    }


    console.log(
        "LOADED PAYMENT FLAG:",
        paymentFlag
    );

}


// ============================================================
// SHOW ADVANCE SECTION
// ============================================================

function showAdvanceSection() {

    if (!advanceSection) {

        console.warn(
            "advanceSection not found"
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
// CALCULATE BALANCE
// ============================================================

function calculateBalance() {

    if (
        grandTotal <= 0
    ) {

        balanceAmount =
            0;

        displayBalance();

        return;

    }


    advanceAmount =
        toNumber(
            advanceAmountInput
                ? advanceAmountInput.value
                : 0
        );


    // --------------------------------------------------------
    // Prevent negative
    // --------------------------------------------------------

    if (advanceAmount < 0) {

        advanceAmount =
            0;

    }


    // --------------------------------------------------------
    // Advance cannot exceed total
    // --------------------------------------------------------

    if (
        advanceAmount >
        grandTotal
    ) {

        alert(
            "Advance amount cannot be greater than Grand Total."
        );


        advanceAmount =
            grandTotal;


        if (advanceAmountInput) {

            advanceAmountInput.value =
                grandTotal.toFixed(2);

        }

    }


    balanceAmount =
        grandTotal -
        advanceAmount;


    if (balanceAmount < 0) {

        balanceAmount =
            0;

    }


    balanceAmount =
        parseFloat(
            balanceAmount.toFixed(2)
        );


    displayBalance();


    console.log(
        "ADVANCE AMOUNT:",
        advanceAmount
    );


    console.log(
        "BALANCE AMOUNT:",
        balanceAmount
    );

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance(value) {

    if (
        value !== undefined
    ) {

        balanceAmount =
            toNumber(value);

    }


    if (!balanceAmountInput) {

        console.warn(
            "balanceAmount element not found"
        );

        return;

    }


    const formatted =
        "₹ " +
        balanceAmount.toFixed(2);


    if (
        balanceAmountInput.tagName === "INPUT"
    ) {

        balanceAmountInput.value =
            formatted;

    }

    else {

        balanceAmountInput.textContent =
            formatted;

    }

}


// ============================================================
// READY CASH
// ============================================================

function selectReadyCash() {

    console.log(
        "================================"
    );

    console.log(
        "READY CASH CLICKED"
    );


    // --------------------------------------------------------
    // FLAG = 1
    // --------------------------------------------------------

    setPaymentFlag("1");


    paymentType =
        "cash";


    localStorage.setItem(
        "paymentType",
        paymentType
    );


    // --------------------------------------------------------
    // Full payment
    // --------------------------------------------------------

    advanceAmount =
        grandTotal;


    balanceAmount =
        0;


    if (advanceAmountInput) {

        advanceAmountInput.value =
            grandTotal.toFixed(2);

    }


    displayBalance(0);


    // --------------------------------------------------------
    // Hide advance section
    // --------------------------------------------------------

    hideAdvanceSection();


    // --------------------------------------------------------
    // Update visual UI
    // --------------------------------------------------------

    updatePaymentTypeUI(
        "readycash"
    );


    saveAdvanceData();


    console.log(
        "READY CASH SELECTED"
    );

    console.log(
        "PAYMENT FLAG:",
        paymentFlag
    );

}


// ============================================================
// ADVANCE PAYMENT
// ============================================================

function selectAdvance() {

    console.log(
        "================================"
    );

    console.log(
        "ADVANCE CLICKED"
    );


    // --------------------------------------------------------
    // FLAG = 0
    // --------------------------------------------------------

    setPaymentFlag("0");


    paymentType =
        "advance";


    localStorage.setItem(
        "paymentType",
        paymentType
    );


    // --------------------------------------------------------
    // Show advance section
    // --------------------------------------------------------

    showAdvanceSection();


    // --------------------------------------------------------
    // Default advance amount
    // --------------------------------------------------------

    if (advanceAmountInput) {

        let current =
            toNumber(
                advanceAmountInput.value
            );


        if (
            current <= 0
        ) {

            current =
                0;

            advanceAmountInput.value =
                "";

        }


        advanceAmount =
            current;

    }


    calculateBalance();


    // --------------------------------------------------------
    // Update UI
    // --------------------------------------------------------

    updatePaymentTypeUI(
        "advance"
    );


    saveAdvanceData();


    console.log(
        "ADVANCE SELECTED"
    );

    console.log(
        "PAYMENT FLAG:",
        paymentFlag
    );

}


// ============================================================
// CASH MODE
// ============================================================

function selectCashMode() {

    paymentMode =
        "cash";


    localStorage.setItem(
        "paymentMode",
        "cash"
    );


    updatePaymentModeUI(
        "cash"
    );


    saveAdvanceData();


    console.log(
        "PAYMENT MODE = CASH"
    );

}


// ============================================================
// UPI MODE
// ============================================================

function selectUpiMode() {

    paymentMode =
        "upi";


    localStorage.setItem(
        "paymentMode",
        "upi"
    );


    updatePaymentModeUI(
        "upi"
    );


    saveAdvanceData();


    console.log(
        "PAYMENT MODE = UPI"
    );

}


// ============================================================
// UPDATE PAYMENT TYPE UI
//
// READY CASH / ADVANCE
// ============================================================

function updatePaymentTypeUI(selected) {

    const allElements =
        document.querySelectorAll(
            "label, .payment-card, .payment-option, .option-card, .type-card"
        );


    allElements.forEach(
        function (card) {

            const text =
                card.textContent
                    .trim()
                    .toLowerCase();


            let selectedCard =
                false;


            if (
                selected === "readycash" &&
                text.includes("ready cash")
            ) {

                selectedCard =
                    true;

            }


            if (
                selected === "advance" &&
                text.includes("advance")
            ) {

                selectedCard =
                    true;

            }


            if (
                selectedCard
            ) {

                card.classList.add(
                    "selected"
                );

                card.classList.add(
                    "active"
                );

            }

            else {

                card.classList.remove(
                    "selected"
                );

                card.classList.remove(
                    "active"
                );

            }


            // ------------------------------------------------
            // Radio button
            // ------------------------------------------------

            const radio =
                card.querySelector(
                    'input[type="radio"]'
                );


            if (radio) {

                if (selectedCard) {

                    radio.checked =
                        true;

                }

                else {

                    radio.checked =
                        false;

                }

            }


            // ------------------------------------------------
            // Check mark
            // ------------------------------------------------

            const check =
                card.querySelector(
                    ".check-mark"
                );


            if (check) {

                if (selectedCard) {

                    check.style.background =
                        "#0789e8";

                    check.style.color =
                        "#ffffff";

                    check.style.opacity =
                        "1";

                }

                else {

                    check.style.background =
                        "#dddddd";

                    check.style.color =
                        "#ffffff";

                    check.style.opacity =
                        "1";

                }

            }

        }
    );


    console.log(
        "PAYMENT TYPE UI UPDATED:",
        selected
    );

}


// ============================================================
// UPDATE PAYMENT MODE UI
//
// CASH / UPI
// ============================================================

function updatePaymentModeUI(selected) {

    const allElements =
        document.querySelectorAll(
            "label, .payment-card, .payment-option, .option-card, .mode-card"
        );


    allElements.forEach(
        function (card) {

            const text =
                card.textContent
                    .trim()
                    .toLowerCase();


            let selectedCard =
                false;


            if (
                selected === "cash" &&
                text.includes("cash") &&
                !text.includes("ready cash")
            ) {

                selectedCard =
                    true;

            }


            if (
                selected === "upi" &&
                text.includes("upi")
            ) {

                selectedCard =
                    true;

            }


            if (
                selectedCard
            ) {

                card.classList.add(
                    "selected"
                );

                card.classList.add(
                    "active"
                );

            }

            else {

                card.classList.remove(
                    "selected"
                );

                card.classList.remove(
                    "active"
                );

            }


            const radio =
                card.querySelector(
                    'input[type="radio"]'
                );


            if (radio) {

                radio.checked =
                    selectedCard;

            }


            const check =
                card.querySelector(
                    ".check-mark"
                );


            if (check) {

                if (selectedCard) {

                    check.style.background =
                        "#0789e8";

                    check.style.color =
                        "#ffffff";

                }

                else {

                    check.style.background =
                        "#dddddd";

                    check.style.color =
                        "#ffffff";

                }

            }

        }
    );


    console.log(
        "PAYMENT MODE UI UPDATED:",
        selected
    );

}


// ============================================================
// SAVE ADVANCE DATA
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
            parseFloat(
                grandTotal.toFixed(2)
            ),

        advanceAmount:
            parseFloat(
                advanceAmount.toFixed(2)
            ),

        balanceAmount:
            parseFloat(
                balanceAmount.toFixed(2)
            ),

        savedAt:
            new Date().toISOString()

    };


    // --------------------------------------------------------
    // Main storage
    // --------------------------------------------------------

    localStorage.setItem(
        "advanceData",
        JSON.stringify(data)
    );


    // --------------------------------------------------------
    // Individual values
    // --------------------------------------------------------

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
        advanceAmount.toFixed(2)
    );


    localStorage.setItem(
        "balanceAmount",
        balanceAmount.toFixed(2)
    );


    localStorage.setItem(
        "advanceGrandTotal",
        grandTotal.toFixed(2)
    );


    console.log(
        "ADVANCE DATA SAVED:",
        data
    );

}


// ============================================================
// LOAD SAVED ADVANCE DATA
// ============================================================

function loadSavedAdvanceData() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "advanceData"
                )
            );


        if (
            !saved
        ) {

            return;

        }


        console.log(
            "SAVED ADVANCE DATA:",
            saved
        );


        if (
            saved.paymentType
        ) {

            paymentType =
                saved.paymentType;

        }


        if (
            saved.paymentMode
        ) {

            paymentMode =
                saved.paymentMode;

        }


        if (
            saved.paymentFlag === "0" ||
            saved.paymentFlag === "1"
        ) {

            paymentFlag =
                saved.paymentFlag;

        }


        if (
            saved.advanceAmount !== undefined
        ) {

            advanceAmount =
                toNumber(
                    saved.advanceAmount
                );

        }


        if (
            saved.balanceAmount !== undefined
        ) {

            balanceAmount =
                toNumber(
                    saved.balanceAmount
                );

        }


    } catch (error) {

        console.warn(
            "Could not load advanceData:",
            error
        );

    }

}


// ============================================================
// PAYMENT CARD CLICK HANDLER
//
// IMPORTANT:
// NO preventDefault()
// ============================================================

function setupPaymentClick() {

    document.addEventListener(
        "click",
        function (event) {

            // ------------------------------------------------
            // Next / Back are handled separately
            // ------------------------------------------------

            if (
                event.target.closest(
                    "#nextBtn"
                )
            ) {

                return;

            }


            if (
                event.target.closest(
                    "#backBtn"
                )
            ) {

                return;

            }


            // ------------------------------------------------
            // Find clicked card
            // ------------------------------------------------

            const card =
                event.target.closest(
                    "label, .payment-card, .payment-option, .option-card, .type-card, .mode-card"
                );


            if (!card) {

                return;

            }


            const text =
                card.textContent
                    .trim()
                    .toLowerCase();


            console.log(
                "CARD CLICKED:",
                text
            );


            // ------------------------------------------------
            // Radio
            // ------------------------------------------------

            const radio =
                card.querySelector(
                    'input[type="radio"]'
                );


            /*
             * DO NOT USE:
             *
             * event.preventDefault();
             *
             * We manually check the radio.
             */

            if (radio) {

                radio.checked =
                    true;

            }


            // ------------------------------------------------
            // READY CASH
            // ------------------------------------------------

            if (
                text.includes(
                    "ready cash"
                )
            ) {

                selectReadyCash();

                return;

            }


            // ------------------------------------------------
            // ADVANCE
            // ------------------------------------------------

            if (
                text.includes(
                    "advance"
                )
            ) {

                selectAdvance();

                return;

            }


            // ------------------------------------------------
            // UPI
            // ------------------------------------------------

            if (
                text.includes(
                    "upi"
                )
            ) {

                selectUpiMode();

                return;

            }


            // ------------------------------------------------
            // CASH
            //
            // Avoid Ready Cash
            // ------------------------------------------------

            if (
                text.includes("cash") &&
                !text.includes("ready cash")
            ) {

                selectCashMode();

                return;

            }

        },
        false
    );

}


// ============================================================
// RADIO CHANGE HANDLER
//
// This also supports direct radio clicks.
// ============================================================

function setupRadioChangeEvents() {

    document.addEventListener(
        "change",
        function (event) {

            const radio =
                event.target;


            if (
                !radio.matches(
                    'input[type="radio"]'
                )
            ) {

                return;

            }


            const value =
                String(
                    radio.value || ""
                ).toLowerCase();


            const name =
                String(
                    radio.name || ""
                ).toLowerCase();


            console.log(
                "RADIO CHANGED:",
                {
                    name,
                    value
                }
            );


            // ------------------------------------------------
            // Payment type
            // ------------------------------------------------

            if (
                name.includes(
                    "paymenttype"
                ) ||
                name.includes(
                    "payment_type"
                )
            ) {

                if (
                    value.includes("advance")
                ) {

                    selectAdvance();

                }

                else {

                    selectReadyCash();

                }

                return;

            }


            // ------------------------------------------------
            // Payment mode
            // ------------------------------------------------

            if (
                name.includes(
                    "paymentmode"
                ) ||
                name.includes(
                    "payment_mode"
                )
            ) {

                if (
                    value.includes("upi")
                ) {

                    selectUpiMode();

                }

                else {

                    selectCashMode();

                }

                return;

            }

        }
    );

}


// ============================================================
// CALCULATE BUTTON
// ============================================================

function setupCalculateButton() {

    if (!calculateBtn) {

        console.warn(
            "Calculate button not found"
        );

        return;

    }


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
// Advance -> Bill
// ============================================================

function setupNextButton() {

    if (!nextBtn) {

        console.warn(
            "Next button not found"
        );

        return;

    }


    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            console.log(
                "================================"
            );

            console.log(
                "ADVANCE NEXT CLICKED"
            );


            // ------------------------------------------------
            // READY CASH
            // ------------------------------------------------

            if (
                paymentFlag === "1"
            ) {

                advanceAmount =
                    grandTotal;

                balanceAmount =
                    0;

            }


            // ------------------------------------------------
            // ADVANCE
            // ------------------------------------------------

            else {

                calculateBalance();

            }


            // ------------------------------------------------
            // Save
            // ------------------------------------------------

            saveAdvanceData();


            console.log(
                "FINAL ADVANCE DATA:"
            );


            console.log(
                JSON.parse(
                    localStorage.getItem(
                        "advanceData"
                    )
                )
            );


            // ------------------------------------------------
            // NEXT PAGE
            //
            // Change ONLY if your bill page has
            // another filename.
            // ------------------------------------------------

            console.log(
                "REDIRECTING TO BILL.HTML"
            );


            window.location.href =
                "bill.html";

        }
    );

}


// ============================================================
// BACK BUTTON
//
// Advance -> Discount
// ============================================================

function setupBackButton() {

    if (!backBtn) {

        console.warn(
            "Back button not found"
        );

        return;

    }


    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            console.log(
                "ADVANCE BACK CLICKED"
            );


            window.location.href =
                "discount.html";

        }
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
        function () {

            // Only calculate automatically
            // when Advance is selected.

            if (
                paymentFlag !== "0"
            ) {

                return;

            }


            calculateBalance();

        }
    );


    advanceAmountInput.addEventListener(
        "blur",
        function () {

            if (
                paymentFlag !== "0"
            ) {

                return;

            }


            calculateBalance();

            saveAdvanceData();

        }
    );

}


// ============================================================
// INITIAL UI
// ============================================================

function initializePaymentUI() {

    console.log(
        "INITIAL PAYMENT STATE:"
    );


    console.log({
        paymentType,
        paymentMode,
        paymentFlag
    });


    // --------------------------------------------------------
    // Payment type
    // --------------------------------------------------------

    if (
        paymentFlag === "0"
    ) {

        selectAdvance();

    }

    else {

        selectReadyCash();

    }


    // --------------------------------------------------------
    // Payment mode
    // --------------------------------------------------------

    if (
        paymentMode === "upi"
    ) {

        selectUpiMode();

    }

    else {

        selectCashMode();

    }

}


// ============================================================
// PAGE INITIALIZATION
// ============================================================

function initializeAdvancePage() {

    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE PAGE INITIALIZED"
    );

    console.log(
        "=========================================="
    );


    initializeElements();


    // --------------------------------------------------------
    // Get total FIRST
    // --------------------------------------------------------

    grandTotal =
        getFinalTotal();


    console.log(
        "FINAL GRAND TOTAL:",
        grandTotal
    );


    // --------------------------------------------------------
    // Display total
    // --------------------------------------------------------

    displayGrandTotal();


    // --------------------------------------------------------
    // Load saved values
    // --------------------------------------------------------

    loadPaymentFlag();

    loadSavedAdvanceData();


    // --------------------------------------------------------
    // If total exists, display it again
    // --------------------------------------------------------

    displayGrandTotal();


    // --------------------------------------------------------
    // Setup events
    // --------------------------------------------------------

    setupPaymentClick();

    setupRadioChangeEvents();

    setupCalculateButton();

    setupNextButton();

    setupBackButton();

    setupAdvanceInput();


    // --------------------------------------------------------
    // Initialize UI
    // --------------------------------------------------------

    initializePaymentUI();


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

    console.log(
        "=========================================="
    );

}


// ============================================================
// DOM READY
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
// EXPOSE FUNCTIONS
//
// Useful if HTML onclick is present.
// ============================================================

window.selectReadyCash =
    selectReadyCash;

window.selectAdvance =
    selectAdvance;

window.selectCashMode =
    selectCashMode;

window.selectUpiMode =
    selectUpiMode;

window.calculateBalance =
    calculateBalance;

window.saveAdvanceData =
    saveAdvanceData;


console.log(
    "ADVANCE.JS READY"
);
