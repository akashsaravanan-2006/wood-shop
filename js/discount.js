// ============================================================
// DISCOUNT.JS
// VERSION: 400
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
// Labour total = BASE TOTAL
// Discount changes only CURRENT/FINAL TOTAL
// Advance uses Discount FINAL TOTAL
//
// We DO NOT overwrite the original Labour total.
// ============================================================

console.log("==========================================");
console.log("DISCOUNT.JS LOADED - VERSION 400");
console.log("==========================================");


// ============================================================
// ELEMENTS
// ============================================================

const currentTotalElement =
    document.getElementById("currentTotal");

const newGrandTotalElement =
    document.getElementById("newGrandTotal");

const discountSection =
    document.getElementById("discountSection");

const discountAmountInput =
    document.getElementById("discountAmount");

const calculateDiscountBtn =
    document.getElementById("calculateDiscountBtn");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");

const discountOptions =
    document.querySelectorAll(
        'input[name="discountOption"]'
    );


// ============================================================
// VARIABLES
// ============================================================

// IMPORTANT:
//
// baseGrandTotal NEVER changes on this page.
//
// currentGrandTotal changes after discount.
//

let baseGrandTotal = 0;
let currentGrandTotal = 0;


// ============================================================
// NUMBER
// ============================================================

function toNumber(value) {

    const number = parseFloat(value);

    if (Number.isFinite(number)) {
        return number;
    }

    return 0;
}


// ============================================================
// MONEY
// ============================================================

function money(value) {

    return Math.round(
        (toNumber(value) + Number.EPSILON) * 100
    ) / 100;

}


// ============================================================
// FORMAT
// ============================================================

function formatMoney(value) {

    return money(value).toFixed(2);

}


// ============================================================
// GET LABOUR FINAL TOTAL
//
// SOURCE:
//
// labourData.finalTotal
//
// This is the ORIGINAL amount before discount.
//
// We DO NOT use gTotal here.
// ============================================================

function getLabourFinalTotal() {

    console.log("------------------------------------------");
    console.log("READING LABOUR FINAL TOTAL");

    const labourDataString =
        localStorage.getItem("labourData");

    console.log(
        "labourData:",
        labourDataString
    );


    if (labourDataString) {

        try {

            const labourData =
                JSON.parse(labourDataString);

            console.log(
                "LABOUR DATA:",
                labourData
            );


            if (
                labourData &&
                labourData.finalTotal !== undefined &&
                labourData.finalTotal !== null
            ) {

                const total =
                    money(
                        labourData.finalTotal
                    );

                console.log(
                    "USING labourData.finalTotal:",
                    total
                );

                return total;
            }

        }
        catch (error) {

            console.error(
                "LABOUR DATA JSON ERROR:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // FALLBACK: finalTotal
    // --------------------------------------------------------

    const finalTotal =
        localStorage.getItem("finalTotal");


    if (
        finalTotal !== null &&
        finalTotal !== ""
    ) {

        const total =
            money(finalTotal);

        console.log(
            "USING FALLBACK finalTotal:",
            total
        );

        return total;

    }


    // --------------------------------------------------------
    // FALLBACK: grandTotal
    // --------------------------------------------------------

    const grandTotal =
        localStorage.getItem("grandTotal");


    if (
        grandTotal !== null &&
        grandTotal !== ""
    ) {

        const total =
            money(grandTotal);

        console.log(
            "USING FALLBACK grandTotal:",
            total
        );

        return total;

    }


    console.error(
        "DISCOUNT ERROR: LABOUR TOTAL NOT FOUND"
    );

    return 0;

}


// ============================================================
// DISPLAY
// ============================================================

function displayTotals() {

    // --------------------------------------------------------
    // CURRENT GRAND TOTAL
    //
    // This remains the ORIGINAL Labour total.
    // --------------------------------------------------------

    if (currentTotalElement) {

        currentTotalElement.textContent =
            "₹ " +
            formatMoney(baseGrandTotal);

    }


    // --------------------------------------------------------
    // NEW GRAND TOTAL
    //
    // This changes when discount is applied.
    // --------------------------------------------------------

    if (newGrandTotalElement) {

        newGrandTotalElement.textContent =
            "₹ " +
            formatMoney(currentGrandTotal);

    }

}


// ============================================================
// DISCOUNT SECTION
// ============================================================

function updateDiscountSection() {

    const selected =
        document.querySelector(
            'input[name="discountOption"]:checked'
        );


    if (!selected) {
        return;
    }


    console.log(
        "DISCOUNT OPTION:",
        selected.value
    );


    if (
        selected.value === "yes"
    ) {

        if (discountSection) {

            discountSection.style.display =
                "block";

        }

    }
    else {

        if (discountSection) {

            discountSection.style.display =
                "none";

        }

        // No discount
        currentGrandTotal =
            money(baseGrandTotal);

        displayTotals();

    }

}


// ============================================================
// CALCULATE DISCOUNT
//
// IMPORTANT:
//
// baseGrandTotal NEVER changes.
//
// Example:
//
// Labour = 1000
// Discount = 100
//
// Current Grand Total = 1000
// New Grand Total     = 900
//
// If user changes discount to 200:
//
// Current Grand Total = 1000
// New Grand Total     = 800
//
// We calculate from BASE every time.
// ============================================================

function calculateDiscount() {

    const discount =
        toNumber(
            discountAmountInput
                ? discountAmountInput.value
                : 0
        );


    console.log("------------------------------------------");
    console.log("CALCULATING DISCOUNT");
    console.log("BASE TOTAL:", baseGrandTotal);
    console.log("DISCOUNT:", discount);


    if (discount < 0) {

        alert(
            "Discount cannot be negative."
        );

        return false;

    }


    if (discount > baseGrandTotal) {

        alert(
            "Discount cannot be greater than total."
        );

        return false;

    }


    // IMPORTANT:
    //
    // Always calculate from BASE.
    //
    // DO NOT do:
    //
    // currentGrandTotal - discount
    //
    // because repeated clicks would deduct twice.
    //

    currentGrandTotal =
        money(
            baseGrandTotal - discount
        );


    console.log(
        "NEW GRAND TOTAL:",
        currentGrandTotal
    );


    displayTotals();


    return true;

}


// ============================================================
// SAVE DISCOUNT DATA
//
// IMPORTANT:
//
// originalTotal = Labour total
// finalTotal    = after discount
//
// We also keep gTotal for compatibility,
// but gTotal contains the CURRENT final amount.
//
// The original Labour total is NEVER lost because
// labourData.finalTotal remains unchanged.
// ============================================================

function saveDiscountData() {

    const selected =
        document.querySelector(
            'input[name="discountOption"]:checked'
        );


    let discount = 0;


    if (
        selected &&
        selected.value === "yes"
    ) {

        discount =
            toNumber(
                discountAmountInput
                    ? discountAmountInput.value
                    : 0
            );

    }


    const data = {

        originalTotal:
            money(baseGrandTotal),

        discountAmount:
            money(discount),

        grandTotal:
            money(currentGrandTotal),

        finalTotal:
            money(currentGrandTotal)

    };


    // --------------------------------------------------------
    // SAVE DISCOUNT DATA
    // --------------------------------------------------------

    localStorage.setItem(
        "discountData",
        JSON.stringify(data)
    );


    // --------------------------------------------------------
    // CURRENT TOTAL
    //
    // This is the value Advance should use.
    // --------------------------------------------------------

    localStorage.setItem(
        "discountFinalTotal",
        currentGrandTotal.toFixed(2)
    );


    // --------------------------------------------------------
    // DO NOT overwrite Labour data
    // --------------------------------------------------------


    console.log("==========================================");
    console.log("DISCOUNT DATA SAVED");
    console.log(data);
    console.log(
        "discountFinalTotal:",
        localStorage.getItem(
            "discountFinalTotal"
        )
    );
    console.log("==========================================");

}


// ============================================================
// RADIO CHANGE
// ============================================================

discountOptions.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                console.log(
                    "DISCOUNT RADIO CHANGED:",
                    this.value
                );


                if (
                    this.value === "no"
                ) {

                    currentGrandTotal =
                        money(baseGrandTotal);

                    displayTotals();

                }


                updateDiscountSection();

            }
        );

    }
);


// ============================================================
// CALCULATE DISCOUNT BUTTON
// ============================================================

if (calculateDiscountBtn) {

    calculateDiscountBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            console.log(
                "CALCULATE DISCOUNT CLICKED"
            );


            const success =
                calculateDiscount();


            if (success) {

                saveDiscountData();

            }

        }
    );

}


// ============================================================
// NEXT
//
// DISCOUNT -> ADVANCE
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            console.log("==========================================");
            console.log("DISCOUNT NEXT CLICKED");


            const selected =
                document.querySelector(
                    'input[name="discountOption"]:checked'
                );


            // ------------------------------------------------
            // NO DISCOUNT
            // ------------------------------------------------

            if (
                selected &&
                selected.value === "no"
            ) {

                console.log(
                    "NO DISCOUNT"
                );


                currentGrandTotal =
                    money(baseGrandTotal);

            }


            // ------------------------------------------------
            // DISCOUNT
            // ------------------------------------------------

            else if (
                selected &&
                selected.value === "yes"
            ) {

                const success =
                    calculateDiscount();


                if (!success) {
                    return;
                }

            }


            // ------------------------------------------------
            // SAVE
            // ------------------------------------------------

            saveDiscountData();


            console.log(
                "FINAL DISCOUNT TOTAL:",
                currentGrandTotal
            );


            console.log(
                "REDIRECT: advance.html"
            );


            // ------------------------------------------------
            // GO TO ADVANCE
            // ------------------------------------------------

            window.location.href =
                "advance.html";

        }
    );

}


// ============================================================
// BACK
//
// DISCOUNT -> PERSONAL
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            console.log(
                "BACK: personal.html"
            );


            window.location.href =
                "personal.html";

        }
    );

}


// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("==========================================");
        console.log("DISCOUNT PAGE INITIALIZING");


        // ----------------------------------------------------
        // GET ORIGINAL LABOUR TOTAL
        // ----------------------------------------------------

        baseGrandTotal =
            getLabourFinalTotal();


        // ----------------------------------------------------
        // CHECK EXISTING DISCOUNT
        //
        // This prevents old discount data from being
        // accidentally treated as the original total.
        // ----------------------------------------------------

        const existingDiscount =
            localStorage.getItem("discountData");


        if (existingDiscount) {

            try {

                const data =
                    JSON.parse(existingDiscount);


                if (
                    data &&
                    data.originalTotal !== undefined
                ) {

                    // Always trust Labour total as base
                    // for a fresh calculation.

                    console.log(
                        "EXISTING DISCOUNT DATA:",
                        data
                    );

                }

            }
            catch (error) {

                console.error(
                    "EXISTING DISCOUNT DATA ERROR:",
                    error
                );

            }

        }


        // ----------------------------------------------------
        // INITIAL VALUE
        // ----------------------------------------------------

        currentGrandTotal =
            money(baseGrandTotal);


        // ----------------------------------------------------
        // DISPLAY
        // ----------------------------------------------------

        displayTotals();


        // ----------------------------------------------------
        // SHOW/HIDE DISCOUNT
        // ----------------------------------------------------

        updateDiscountSection();


        console.log(
            "BASE GRAND TOTAL:",
            baseGrandTotal
        );

        console.log(
            "CURRENT GRAND TOTAL:",
            currentGrandTotal
        );

        console.log("DISCOUNT PAGE READY");
        console.log("==========================================");

    }
);
