// ============================================================
// DISCOUNT.JS
//
// FLOW:
// Personal -> Discount -> Advance
//
// Discount is calculated ONLY here.
// ============================================================

console.log("======================================");
console.log("DISCOUNT.JS LOADED");
console.log("======================================");


// ============================================================
// HTML ELEMENTS
// ============================================================

const currentTotal =
    document.getElementById("currentTotal");

const newGrandTotal =
    document.getElementById("newGrandTotal");

const discountAmount =
    document.getElementById("discountAmount");

const calculateDiscountBtn =
    document.getElementById(
        "calculateDiscountBtn"
    );

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");

const discountSection =
    document.getElementById(
        "discountSection"
    );


// ============================================================
// DISCOUNT RADIO BUTTONS
// ============================================================

const discountOptions =
    document.querySelectorAll(
        'input[name="discountOption"]'
    );


// ============================================================
// GET ORIGINAL GRAND TOTAL
// ============================================================

function getOriginalTotal() {

    // --------------------------------------------------------
    // CENTRAL STORAGE
    // --------------------------------------------------------

    if (
        typeof getTotals === "function"
    ) {

        const totals =
            getTotals();

        console.log(
            "STORED TOTALS:",
            totals
        );


        const values = [

            totals.grandTotal,

            totals.finalGrandTotal,

            totals.finalTotal,

            totals.subtotal

        ];


        for (const value of values) {

            const number =
                parseFloat(value);


            if (
                Number.isFinite(number) &&
                number > 0
            ) {

                return number;

            }

        }

    }


    // --------------------------------------------------------
    // OLD STORAGE FALLBACK
    // --------------------------------------------------------

    const keys = [

        "finalGrandTotal",
        "grandTotal",
        "finalTotal",
        "woodTotal"

    ];


    for (const key of keys) {

        const value =
            parseFloat(
                localStorage.getItem(key)
            );


        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            return value;

        }

    }


    return 0;

}


// ============================================================
// ORIGINAL TOTAL
// ============================================================

const originalTotal =
    getOriginalTotal();


console.log(
    "ORIGINAL TOTAL:",
    originalTotal
);


// ============================================================
// DISPLAY TOTAL
// ============================================================

function displayOriginalTotal() {

    if (currentTotal) {

        currentTotal.textContent =
            "₹ " +
            originalTotal.toFixed(2);

    }

}


// ============================================================
// DISPLAY NEW TOTAL
// ============================================================

function displayNewTotal(amount) {

    if (newGrandTotal) {

        newGrandTotal.textContent =
            "₹ " +
            amount.toFixed(2);

    }

}


// ============================================================
// SAVE DISCOUNT DATA
// ============================================================

function saveDiscountData(
    option,
    discount,
    finalTotal
) {

    const data = {

        discountOption:
            option,

        originalGrandTotal:
            originalTotal,

        discountAmount:
            discount,

        grandTotal:
            finalTotal

    };


    // ========================================================
    // CENTRAL STORAGE
    // ========================================================

    if (
        typeof savePageData === "function"
    ) {

        savePageData(
            "discount",
            data
        );

    }


    // ========================================================
    // SAVE TOTALS
    // ========================================================

    if (
        typeof saveTotals === "function"
    ) {

        saveTotals({

            originalGrandTotal:
                originalTotal,

            discountAmount:
                discount,

            grandTotal:
                finalTotal

        });

    }


    // ========================================================
    // OLD STORAGE
    // ========================================================

    localStorage.setItem(
        "discountAmount",
        discount.toString()
    );

    localStorage.setItem(
        "finalGrandTotal",
        finalTotal.toString()
    );

    localStorage.setItem(
        "grandTotal",
        finalTotal.toString()
    );


    console.log(
        "DISCOUNT DATA SAVED:",
        data
    );

}


// ============================================================
// CALCULATE DISCOUNT
// ============================================================

function calculateDiscount() {

    const selected =
        document.querySelector(
            'input[name="discountOption"]:checked'
        );


    const option =
        selected
            ? selected.value
            : "no";


    // ========================================================
    // NO DISCOUNT
    // ========================================================

    if (
        option === "no"
    ) {

        const finalTotal =
            originalTotal;


        displayNewTotal(
            finalTotal
        );


        saveDiscountData(
            "no",
            0,
            finalTotal
        );


        console.log(
            "NO DISCOUNT"
        );


        return;

    }


    // ========================================================
    // NEED DISCOUNT
    // ========================================================

    let discount =
        parseFloat(
            discountAmount
                ? discountAmount.value
                : 0
        );


    if (
        !Number.isFinite(discount) ||
        discount < 0
    ) {

        discount = 0;

    }


    // Discount cannot exceed total

    if (
        discount > originalTotal
    ) {

        discount =
            originalTotal;


        if (discountAmount) {

            discountAmount.value =
                discount;

        }

    }


    const finalTotal =
        originalTotal -
        discount;


    displayNewTotal(
        finalTotal
    );


    saveDiscountData(
        "yes",
        discount,
        finalTotal
    );


    console.log(
        "DISCOUNT:",
        discount
    );

    console.log(
        "FINAL TOTAL:",
        finalTotal
    );

}


// ============================================================
// RADIO CHANGE
// ============================================================

discountOptions.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                if (
                    this.value === "yes"
                ) {

                    // Show input

                    if (discountSection) {

                        discountSection.style.display =
                            "block";

                    }

                }
                else {

                    // Hide input

                    if (discountSection) {

                        discountSection.style.display =
                            "none";

                    }


                    if (discountAmount) {

                        discountAmount.value =
                            "";

                    }

                }


                calculateDiscount();

            }
        );

    }
);


// ============================================================
// CALCULATE BUTTON
// ============================================================

if (calculateDiscountBtn) {

    calculateDiscountBtn.addEventListener(
        "click",
        function () {

            calculateDiscount();

        }
    );

}


// ============================================================
// NEXT
// Discount -> Advance
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {

            calculateDiscount();


            console.log(
                "DISCOUNT COMPLETE"
            );

            console.log(
                "GOING TO ADVANCE"
            );


            window.location.href =
                "advance.html";

        }
    );

}


// ============================================================
// BACK
// Discount -> Personal
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "personal.html";

        }
    );

}


// ============================================================
// LOAD SAVED DISCOUNT
// ============================================================

function loadDiscountData() {

    displayOriginalTotal();


    let saved = null;


    if (
        typeof getPageData === "function"
    ) {

        saved =
            getPageData("discount");

    }


    if (
        saved &&
        saved.discountOption
    ) {

        const radio =
            document.querySelector(
                `input[name="discountOption"][value="${saved.discountOption}"]`
            );


        if (radio) {

            radio.checked = true;

        }


        if (
            saved.discountOption === "yes"
        ) {

            if (discountSection) {

                discountSection.style.display =
                    "block";

            }


            if (discountAmount) {

                discountAmount.value =
                    saved.discountAmount || "";

            }

        }
        else {

            if (discountSection) {

                discountSection.style.display =
                    "none";

            }

        }


        displayNewTotal(
            Number(saved.grandTotal) ||
            originalTotal
        );


        return;

    }


    // Default

    if (discountSection) {

        discountSection.style.display =
            "none";

    }


    displayNewTotal(
        originalTotal
    );

}


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDiscountData();

    }
);
