// ============================================================
// ADVANCE.JS
//
// FLOW:
// Discount -> Advance -> Bill
//
// Ready Cash = flag 1
// Advance    = flag 0
// ============================================================

console.log("======================================");
console.log("ADVANCE.JS CLEAN VERSION");
console.log("======================================");


// ============================================================
// HTML
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
// ADVANCE SECTION
// ============================================================

const advanceSection =
    document.getElementById(
        "advanceSection"
    );


// ============================================================
// PAYMENT CARDS
// ============================================================

const paymentCards =
    document.querySelectorAll(
        ".payment-card, .payment-option, .option-card, label"
    );


// ============================================================
// GET FINAL TOTAL FROM DISCOUNT
// ============================================================

function getFinalTotal() {

    // Central storage

    if (
        typeof getTotals === "function"
    ) {

        const totals =
            getTotals();


        if (
            totals &&
            Number(totals.grandTotal) >= 0
        ) {

            return Number(
                totals.grandTotal
            );

        }

    }


    // Discount page storage

    const discountData =
        typeof getPageData === "function"
            ? getPageData("discount")
            : null;


    if (
        discountData &&
        Number(discountData.grandTotal) >= 0
    ) {

        return Number(
            discountData.grandTotal
        );

    }


    // Old localStorage

    return (
        Number(
            localStorage.getItem(
                "finalGrandTotal"
            )
        ) || 0
    );

}


// ============================================================
// TOTAL
// ============================================================

const grandTotal =
    getFinalTotal();


console.log(
    "FINAL TOTAL FROM DISCOUNT:",
    grandTotal
);


// ============================================================
// DISPLAY TOTAL
// ============================================================

function displayGrandTotal() {

    if (!grandTotalElement) {

        return;

    }


    grandTotalElement.textContent =
        "₹ " +
        grandTotal.toFixed(2);

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

function displayBalance(
    amount
) {

    if (!balanceAmountInput) {

        return;

    }


    balanceAmountInput.value =
        "₹ " +
        amount.toFixed(2);

}


// ============================================================
// SHOW / HIDE ADVANCE
// ============================================================

function showAdvanceSection() {

    if (advanceSection) {

        advanceSection.style.display =
            "block";

    }

}


function hideAdvanceSection() {

    if (advanceSection) {

        advanceSection.style.display =
            "none";

    }

}


// ============================================================
// SET PAYMENT TYPE
// ============================================================

function setPaymentType(type) {

    if (
        type === "cash"
    ) {

        // --------------------------------------------
        // READY CASH
        // --------------------------------------------

        localStorage.setItem(
            "paymentFlag",
            "1"
        );

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

    else {

        // --------------------------------------------
        // ADVANCE
        // --------------------------------------------

        localStorage.setItem(
            "paymentFlag",
            "0"
        );

        localStorage.setItem(
            "paymentType",
            "advance"
        );


        showAdvanceSection();


        let amount =
            Number(
                advanceAmountInput?.value
            ) || 0;


        if (
            amount > grandTotal
        ) {

            amount =
                grandTotal;

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
            "ADVANCE SELECTED"
        );

    }


    saveAdvanceData();

}


// ============================================================
// SAVE ADVANCE
// ============================================================

function saveAdvanceData() {

    const flag =
        localStorage.getItem(
            "paymentFlag"
        ) || "1";


    const paymentType =
        flag === "1"
            ? "cash"
            : "advance";


    let advanceAmount;


    let balanceAmount;


    // Ready Cash

    if (
        flag === "1"
    ) {

        advanceAmount =
            grandTotal;

        balanceAmount =
            0;

    }

    // Advance

    else {

        advanceAmount =
            Number(
                advanceAmountInput?.value
            ) || 0;


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

    if (
        typeof savePageData === "function"
    ) {

        savePageData(
            "advance",
            data
        );

    }


    // Old storage compatibility

    localStorage.setItem(
        "advanceAmount",
        advanceAmount
    );

    localStorage.setItem(
        "balanceAmount",
        balanceAmount
    );

    localStorage.setItem(
        "paymentType",
        paymentType
    );


    console.log(
        "ADVANCE DATA SAVED:",
        data
    );

}


// ============================================================
// CLICK PAYMENT CARDS
// ============================================================

paymentCards.forEach(
    function (card) {

        card.addEventListener(
            "click",
            function () {

                const text =
                    this.textContent
                        .trim()
                        .toLowerCase();


                // Ready Cash

                if (
                    text.includes("ready cash")
                ) {

                    setPaymentType(
                        "cash"
                    );

                    return;

                }


                // Advance

                if (
                    text.includes("advance")
                ) {

                    setPaymentType(
                        "advance"
                    );

                    return;

                }


                // UPI

                if (
                    text.includes("upi")
                ) {

                    localStorage.setItem(
                        "paymentMode",
                        "upi"
                    );

                    saveAdvanceData();

                    return;

                }


                // Cash payment mode

                if (
                    text.includes("cash")
                ) {

                    localStorage.setItem(
                        "paymentMode",
                        "cash"
                    );

                    saveAdvanceData();

                }

            }
        );

    }
);


// ============================================================
// ADVANCE INPUT
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

            if (
                flag === "1"
            ) {

                this.value =
                    grandTotal;

                displayBalance(0);

                return;

            }


            // Advance

            let amount =
                Number(this.value) || 0;


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
// Advance -> Bill
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {

            saveAdvanceData();


            console.log(
                "ADVANCE COMPLETE"
            );


            window.location.href =
                "bill.html";

        }
    );

}


// ============================================================
// BACK
// Advance -> Discount
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            saveAdvanceData();


            window.location.href =
                "discount.html";

        }
    );

}


// ============================================================
// LOAD SAVED DATA
// ============================================================

function loadAdvanceData() {

    displayGrandTotal();


    let saved = null;


    if (
        typeof getPageData === "function"
    ) {

        saved =
            getPageData("advance");

    }


    if (
        saved &&
        (
            saved.paymentFlag === "0" ||
            saved.paymentFlag === "1"
        )
    ) {

        localStorage.setItem(
            "paymentFlag",
            saved.paymentFlag
        );

    }


    const flag =
        localStorage.getItem(
            "paymentFlag"
        ) || "1";


    // ========================================================
    // READY CASH
    // ========================================================

    if (
        flag === "1"
    ) {

        setPaymentType(
            "cash"
        );

    }

    // ========================================================
    // ADVANCE
    // ========================================================

    else {

        showAdvanceSection();


        let amount =
            saved
                ? Number(saved.advanceAmount) || 0
                : Number(
                    localStorage.getItem(
                        "advanceAmount"
                    )
                ) || 0;


        if (
            amount > grandTotal
        ) {

            amount =
                grandTotal;

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

        saveAdvanceData();

    }


    console.log(
        "ADVANCE PAGE READY"
    );

}


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdvanceData();

    }
);
