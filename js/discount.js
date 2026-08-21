// ============================================================
// DISCOUNT.JS
// ============================================================
//
// FLOW:
//
// Wood
//   ↓
// Personal
//   ↓
// Discount
//   ↓
// Advance
//   ↓
// Bill
//
// IMPORTANT:
// Discount uses the ORIGINAL WOOD TOTAL as its starting amount.
// After discount, FINAL TOTAL is saved for Advance page.
//
// ============================================================

console.log("================================================");
console.log("DISCOUNT.JS LOADED - CLEAN VERSION");
console.log("================================================");


// ============================================================
// HTML ELEMENTS
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
// GLOBAL VARIABLES
// ============================================================

let originalGrandTotal = 0;

let discountAmount = 0;

let finalGrandTotal = 0;


// ============================================================
// NUMBER HELPER
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
// GET WOOD TOTAL
// ============================================================
//
// IMPORTANT:
// We intentionally DO NOT use an old finalTotal here.
//
// finalTotal belongs to the Discount result.
// Therefore it must NOT be used as the starting amount.
//
// ============================================================

function getWoodGrandTotal() {

    console.log("--------------------------------");
    console.log("SEARCHING FOR WOOD GRAND TOTAL");
    console.log("--------------------------------");


    let total = 0;


    // ========================================================
    // 1. Try woodData
    // ========================================================

    const woodDataRaw =
        localStorage.getItem("woodData");


    if (woodDataRaw) {

        try {

            const woodData =
                JSON.parse(woodDataRaw);

            console.log(
                "woodData found:",
                woodData
            );


            // ------------------------------------------------
            // CASE A:
            // { grandTotal: 694.44 }
            // ------------------------------------------------

            if (
                woodData &&
                typeof woodData === "object" &&
                !Array.isArray(woodData)
            ) {

                if (
                    woodData.grandTotal !== undefined
                ) {

                    total =
                        toNumber(
                            woodData.grandTotal
                        );

                }

            }


            // ------------------------------------------------
            // CASE B:
            // { total: 694.44 }
            // ------------------------------------------------

            if (
                total === 0 &&
                woodData &&
                typeof woodData === "object" &&
                woodData.total !== undefined
            ) {

                total =
                    toNumber(
                        woodData.total
                    );

            }


            // ------------------------------------------------
            // CASE C:
            // Array of calculations
            // ------------------------------------------------

            if (
                total === 0 &&
                Array.isArray(woodData)
            ) {

                woodData.forEach(
                    function (item) {

                        if (!item) {
                            return;
                        }

                        if (
                            item.amount !== undefined
                        ) {

                            total +=
                                toNumber(
                                    item.amount
                                );

                        }
                        else if (
                            item.total !== undefined
                        ) {

                            total +=
                                toNumber(
                                    item.total
                                );

                        }

                    }
                );

            }

        }
        catch (error) {

            console.error(
                "ERROR READING woodData:",
                error
            );

        }

    }


    // ========================================================
    // 2. Try grandTotal
    // ========================================================

    if (total === 0) {

        const storedGrandTotal =
            localStorage.getItem(
                "grandTotal"
            );

        if (
            storedGrandTotal !== null
        ) {

            total =
                toNumber(
                    storedGrandTotal
                );

            console.log(
                "Using stored grandTotal:",
                total
            );

        }

    }


    // ========================================================
    // 3. Try woodGrandTotal
    // ========================================================

    if (total === 0) {

        const woodGrandTotal =
            localStorage.getItem(
                "woodGrandTotal"
            );

        if (
            woodGrandTotal !== null
        ) {

            total =
                toNumber(
                    woodGrandTotal
                );

            console.log(
                "Using woodGrandTotal:",
                total
            );

        }

    }


    // ========================================================
    // 4. Try originalGrandTotal
    // ========================================================

    if (total === 0) {

        const originalTotal =
            localStorage.getItem(
                "originalGrandTotal"
            );

        if (
            originalTotal !== null
        ) {

            total =
                toNumber(
                    originalTotal
                );

            console.log(
                "Using originalGrandTotal:",
                total
            );

        }

    }


    // ========================================================
    // FINAL RESULT
    // ========================================================

    console.log(
        "WOOD GRAND TOTAL FOUND:",
        total
    );


    return total;
}


// ============================================================
// DISPLAY CURRENT TOTAL
// ============================================================

function displayCurrentTotal() {

    if (
        currentTotalElement
    ) {

        currentTotalElement.textContent =
            "₹ " +
            originalGrandTotal.toFixed(2);

    }


    if (
        newGrandTotalElement
    ) {

        newGrandTotalElement.textContent =
            "₹ " +
            finalGrandTotal.toFixed(2);

    }

}


// ============================================================
// SHOW / HIDE DISCOUNT SECTION
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

        if (
            discountSection
        ) {

            discountSection.style.display =
                "block";

        }

    }
    else {

        if (
            discountSection
        ) {

            discountSection.style.display =
                "none";

        }


        // No discount
        discountAmount = 0;

        finalGrandTotal =
            originalGrandTotal;


        displayCurrentTotal();

        saveDiscountData();

    }

}


// ============================================================
// CALCULATE DISCOUNT
// ============================================================

function calculateDiscount() {

    console.log("--------------------------------");
    console.log("CALCULATING DISCOUNT");
    console.log("--------------------------------");


    if (
        originalGrandTotal <= 0
    ) {

        alert(
            "Wood Grand Total is not available."
        );

        console.error(
            "ORIGINAL TOTAL IS INVALID:",
            originalGrandTotal
        );

        return;

    }


    discountAmount =
        toNumber(
            discountAmountInput
                ? discountAmountInput.value
                : 0
        );


    console.log(
        "Original Total:",
        originalGrandTotal
    );

    console.log(
        "Discount:",
        discountAmount
    );


    // ========================================================
    // VALIDATION
    // ========================================================

    if (
        discountAmount < 0
    ) {

        alert(
            "Discount cannot be negative."
        );

        return;

    }


    if (
        discountAmount > originalGrandTotal
    ) {

        alert(
            "Discount cannot be greater than the Grand Total."
        );

        if (
            discountAmountInput
        ) {

            discountAmountInput.focus();

        }

        return;

    }


    // ========================================================
    // FINAL CALCULATION
    // ========================================================

    finalGrandTotal =
        originalGrandTotal -
        discountAmount;


    // Avoid floating point display problems
    finalGrandTotal =
        Math.round(
            finalGrandTotal * 100
        ) / 100;


    console.log(
        "FINAL TOTAL:",
        finalGrandTotal
    );


    // ========================================================
    // DISPLAY
    // ========================================================

    displayCurrentTotal();


    // ========================================================
    // SAVE
    // ========================================================

    saveDiscountData();

}


// ============================================================
// SAVE DISCOUNT DATA
// ============================================================

function saveDiscountData() {

    const selected =
        document.querySelector(
            'input[name="discountOption"]:checked'
        );


    const discountType =
        selected
            ? selected.value
            : "no";


    const data = {

        originalGrandTotal:
            Number(
                originalGrandTotal.toFixed(2)
            ),

        discountType:
            discountType,

        discountAmount:
            Number(
                discountAmount.toFixed(2)
            ),

        finalGrandTotal:
            Number(
                finalGrandTotal.toFixed(2)
            )

    };


    console.log(
        "DISCOUNT DATA SAVED:",
        data
    );


    // ========================================================
    // Save complete discount object
    // ========================================================

    localStorage.setItem(
        "discountData",
        JSON.stringify(data)
    );


    // ========================================================
    // IMPORTANT:
    // finalTotal = FINAL TOTAL AFTER DISCOUNT
    // ========================================================

    localStorage.setItem(
        "finalTotal",
        finalGrandTotal.toFixed(2)
    );


    // ========================================================
    // Keep newGrandTotal for compatibility
    // ========================================================

    localStorage.setItem(
        "newGrandTotal",
        finalGrandTotal.toFixed(2)
    );


    // ========================================================
    // Keep grandTotal updated
    // ========================================================

    localStorage.setItem(
        "grandTotal",
        finalGrandTotal.toFixed(2)
    );


    console.log(
        "finalTotal SAVED:",
        localStorage.getItem("finalTotal")
    );

}


// ============================================================
// NEXT
// Discount -> Advance
// ============================================================

function goToAdvance() {

    console.log("--------------------------------");
    console.log("DISCOUNT NEXT CLICKED");
    console.log("--------------------------------");


    // --------------------------------------------------------
    // Make sure latest discount is saved
    // --------------------------------------------------------

    const selected =
        document.querySelector(
            'input[name="discountOption"]:checked'
        );


    if (
        selected &&
        selected.value === "yes"
    ) {

        calculateDiscount();

    }
    else {

        discountAmount = 0;

        finalGrandTotal =
            originalGrandTotal;

        saveDiscountData();

    }


    // --------------------------------------------------------
    // Verify final amount
    // --------------------------------------------------------

    const savedFinalTotal =
        toNumber(
            localStorage.getItem(
                "finalTotal"
            )
        );


    console.log(
        "FINAL TOTAL BEFORE ADVANCE:",
        savedFinalTotal
    );


    if (
        savedFinalTotal < 0
    ) {

        alert(
            "Invalid final total."
        );

        return;

    }


    // --------------------------------------------------------
    // Redirect
    // --------------------------------------------------------

    console.log(
        "REDIRECTING TO advance.html"
    );


    window.location.href =
        "advance.html";

}


// ============================================================
// BACK
// Discount -> Personal
// ============================================================

function goBack() {

    console.log(
        "DISCOUNT BACK -> PERSONAL"
    );


    window.location.href =
        "personal.html";

}


// ============================================================
// RADIO BUTTON EVENTS
// ============================================================

discountOptions.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                updateDiscountSection();

            }
        );

    }
);


// ============================================================
// CALCULATE BUTTON
// ============================================================

if (
    calculateDiscountBtn
) {

    calculateDiscountBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            calculateDiscount();

        }
    );

}


// ============================================================
// NEXT BUTTON
// ============================================================

if (
    nextBtn
) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            goToAdvance();

        }
    );

}


// ============================================================
// BACK BUTTON
// ============================================================

if (
    backBtn
) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            goBack();

        }
    );

}


// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("--------------------------------");
        console.log("DISCOUNT PAGE INITIALIZING");
        console.log("--------------------------------");


        // ----------------------------------------------------
        // IMPORTANT:
        // Get the Wood total first.
        // Do NOT use old finalTotal.
        // ----------------------------------------------------

        originalGrandTotal =
            getWoodGrandTotal();


        console.log(
            "ORIGINAL WOOD TOTAL:",
            originalGrandTotal
        );


        // ----------------------------------------------------
        // Start with no discount
        // ----------------------------------------------------

        discountAmount = 0;

        finalGrandTotal =
            originalGrandTotal;


        // ----------------------------------------------------
        // Display
        // ----------------------------------------------------

        displayCurrentTotal();


        // ----------------------------------------------------
        // Update discount section
        // ----------------------------------------------------

        updateDiscountSection();


        console.log("--------------------------------");
        console.log("DISCOUNT PAGE READY");
        console.log(
            "WOOD TOTAL = ₹",
            originalGrandTotal.toFixed(2)
        );
        console.log("--------------------------------");

    }
);
