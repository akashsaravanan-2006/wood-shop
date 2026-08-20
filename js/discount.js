// ============================================================
// DISCOUNT.JS
// ============================================================
//
// Discount is calculated AFTER Advance page.
//
// IMPORTANT:
// ------------------------------------------------------------
// Advance page saves the ORIGINAL TOTAL as:
//
//     discountBaseAmount
//
// Discount page must use this value.
//
// Example:
//
// Original Total = ₹1094.44
// Advance = ₹500
//
// Discount page MUST show:
// Current Grand Total = ₹1094.44
//
// NOT:
// ₹594.44
//
// NOT:
// ₹0.00
// ============================================================


// ============================================================
// 1. GET HTML ELEMENTS
// ============================================================

const currentGrandTotalElement =
    document.getElementById("currentGrandTotal");

const newGrandTotalElement =
    document.getElementById("newGrandTotal");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// DISCOUNT OPTIONS
// ============================================================

const noDiscountOption =
    document.getElementById("noDiscount");

const needDiscountOption =
    document.getElementById("needDiscount");


// ============================================================
// DISCOUNT INPUT
// ============================================================

const discountInput =
    document.getElementById("discountInput");


// ============================================================
// DISCOUNT SECTION
// ============================================================

const discountSection =
    document.getElementById("discountSection");


// ============================================================
// 2. NUMBER CONVERTER
// ============================================================

function toNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }

    if (typeof value === "number") {

        return Number.isFinite(value)
            ? value
            : 0;

    }

    const cleaned =
        String(value)
            .replace(/₹/g, "")
            .replace(/,/g, "")
            .trim();

    const number =
        Number(cleaned);

    return Number.isFinite(number)
        ? number
        : 0;

}


// ============================================================
// 3. GET ORIGINAL TOTAL
// ============================================================

function getDiscountBaseAmount() {

    let total = 0;


    // ========================================================
    // SOURCE 1
    // storedata.js
    // ========================================================

    if (
        typeof getPageData === "function"
    ) {

        try {

            const advance =
                getPageData("advance") || {};

            console.log(
                "ADVANCE DATA FROM STORE:",
                advance
            );


            if (
                advance.discountBaseAmount !==
                undefined
            ) {

                total =
                    toNumber(
                        advance.discountBaseAmount
                    );

            }


            // Fallback
            if (
                total <= 0 &&
                advance.grandTotal !== undefined
            ) {

                total =
                    toNumber(
                        advance.grandTotal
                    );

            }

        }
        catch (error) {

            console.error(
                "Error reading advance data:",
                error
            );

        }

    }


    // ========================================================
    // SOURCE 2
    // localStorage discountBaseAmount
    // ========================================================

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "discountBaseAmount"
                )
            );

        console.log(
            "localStorage discountBaseAmount:",
            total
        );

    }


    // ========================================================
    // SOURCE 3
    // localStorage finalTotal
    // ========================================================

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "finalTotal"
                )
            );

        console.log(
            "localStorage finalTotal:",
            total
        );

    }


    // ========================================================
    // SOURCE 4
    // localStorage grandTotal
    // ========================================================

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "grandTotal"
                )
            );

        console.log(
            "localStorage grandTotal:",
            total
        );

    }


    // ========================================================
    // SOURCE 5
    // CENTRAL TOTALS
    // ========================================================

    if (
        total <= 0 &&
        typeof getTotals === "function"
    ) {

        try {

            const totals =
                getTotals();

            console.log(
                "CENTRAL TOTALS:",
                totals
            );


            if (
                totals.finalTotal !== undefined
            ) {

                total =
                    toNumber(
                        totals.finalTotal
                    );

            }

        }
        catch (error) {

            console.error(
                "Error reading totals:",
                error
            );

        }

    }


    // ========================================================
    // FINAL ROUNDING
    // ========================================================

    total =
        Math.round(
            total * 100
        ) / 100;


    console.log(
        "=========================================="
    );

    console.log(
        "DISCOUNT BASE AMOUNT:",
        total
    );

    console.log(
        "=========================================="
    );


    return total;

}


// ============================================================
// 4. ORIGINAL TOTAL
// ============================================================

let currentGrandTotal =
    getDiscountBaseAmount();


// ============================================================
// 5. DISPLAY CURRENT GRAND TOTAL
// ============================================================

function displayCurrentGrandTotal() {

    if (
        currentGrandTotalElement
    ) {

        currentGrandTotalElement.textContent =
            "₹ " +
            currentGrandTotal.toFixed(2);

    }

}


displayCurrentGrandTotal();


// ============================================================
// 6. CALCULATE NEW TOTAL
// ============================================================

function calculateNewGrandTotal() {

    let discount = 0;


    // ========================================================
    // GET DISCOUNT
    // ========================================================

    if (
        discountInput
    ) {

        discount =
            toNumber(
                discountInput.value
            );

    }


    // ========================================================
    // VALIDATE DISCOUNT
    // ========================================================

    if (
        discount < 0
    ) {

        discount = 0;

    }


    if (
        discount > currentGrandTotal
    ) {

        discount =
            currentGrandTotal;

    }


    // ========================================================
    // NEW TOTAL
    // ========================================================

    const newTotal =
        currentGrandTotal -
        discount;


    // ========================================================
    // DISPLAY
    // ========================================================

    if (
        newGrandTotalElement
    ) {

        newGrandTotalElement.textContent =
            "₹ " +
            newTotal.toFixed(2);

    }


    // ========================================================
    // RETURN
    // ========================================================

    return {

        discount:
            discount,

        newTotal:
            newTotal

    };

}


// ============================================================
// 7. NO DISCOUNT
// ============================================================

if (
    noDiscountOption
) {

    noDiscountOption.addEventListener(
        "click",
        function () {

            if (
                discountSection
            ) {

                discountSection.style.display =
                    "none";

            }


            if (
                discountInput
            ) {

                discountInput.value =
                    "0";

            }


            if (
                newGrandTotalElement
            ) {

                newGrandTotalElement.textContent =
                    "₹ " +
                    currentGrandTotal.toFixed(2);

            }


            console.log(
                "NO DISCOUNT SELECTED"
            );

        }
    );

}


// ============================================================
// 8. NEED DISCOUNT
// ============================================================

if (
    needDiscountOption
) {

    needDiscountOption.addEventListener(
        "click",
        function () {

            if (
                discountSection
            ) {

                discountSection.style.display =
                    "block";

            }


            if (
                discountInput
            ) {

                discountInput.focus();

            }


            console.log(
                "DISCOUNT SELECTED"
            );

        }
    );

}


// ============================================================
// 9. DISCOUNT INPUT
// ============================================================

if (
    discountInput
) {

    discountInput.addEventListener(
        "input",
        function () {

            calculateNewGrandTotal();

        }
    );

}


// ============================================================
// 10. NEXT BUTTON
// ============================================================

if (
    nextBtn
) {

    nextBtn.addEventListener(
        "click",
        function () {


            // ==================================================
            // CALCULATE
            // ==================================================

            const result =
                calculateNewGrandTotal();


            const discount =
                result.discount;

            const newTotal =
                result.newTotal;


            // ==================================================
            // SAVE DISCOUNT DATA
            // ==================================================

            const discountData = {

                originalGrandTotal:
                    currentGrandTotal,

                discount:
                    discount,

                newGrandTotal:
                    newTotal

            };


            // ==================================================
            // SAVE CENTRAL STORAGE
            // ==================================================

            if (
                typeof savePageData === "function"
            ) {

                savePageData(
                    "discount",
                    discountData
                );

            }


            // ==================================================
            // SAVE OLD LOCAL STORAGE
            // ==================================================

            localStorage.setItem(
                "discountAmount",
                String(discount)
            );

            localStorage.setItem(
                "discountApplied",
                discount > 0
                    ? "true"
                    : "false"
            );

            localStorage.setItem(
                "finalGrandTotal",
                String(newTotal)
            );

            localStorage.setItem(
                "discountBaseAmount",
                String(currentGrandTotal)
            );


            // ==================================================
            // DEBUG
            // ==================================================

            console.log(
                "=========================================="
            );

            console.log(
                "DISCOUNT DATA SAVED"
            );

            console.log(
                discountData
            );

            console.log(
                "=========================================="
            );


            // ==================================================
            // GO TO BILL
            // ==================================================

            window.location.href =
                "bill.html";

        }
    );

}


// ============================================================
// 11. BACK BUTTON
// ============================================================

if (
    backBtn
) {

    backBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "advance.html";

        }
    );

}


// ============================================================
// 12. INITIAL DISPLAY
// ============================================================

if (
    newGrandTotalElement
) {

    newGrandTotalElement.textContent =
        "₹ " +
        currentGrandTotal.toFixed(2);

}


console.log(
    "DISCOUNT.JS LOADED"
);

console.log(
    "CURRENT GRAND TOTAL:",
    currentGrandTotal
);
