// ============================================================
// DISCOUNT.JS
// ============================================================
//
// FLOW:
//
// Wood -> Discount -> Labour -> Advance
//
// ONLY ONE TOTAL IS USED:
// localStorage["gTotal"]
//
// ============================================================

console.log("======================================");
console.log("DISCOUNT.JS LOADED");
console.log("======================================");


// ============================================================
// ELEMENTS
// ============================================================

const currentTotal =
    document.getElementById("currentTotal");

const newGrandTotal =
    document.getElementById("newGrandTotal");

const discountSection =
    document.getElementById("discountSection");

const discountAmount =
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

let gTotal = 0;

let discount = 0;


// ============================================================
// NUMBER FUNCTION
// ============================================================

function numberValue(value) {

    const n =
        parseFloat(value);

    if (Number.isFinite(n)) {

        return n;

    }

    return 0;
}


// ============================================================
// GET TOTAL
// ============================================================

function getGTotal() {

    const value =
        localStorage.getItem("gTotal");

    console.log(
        "DISCOUNT - gTotal FROM STORAGE:",
        value
    );


    if (value === null) {

        console.error(
            "gTotal NOT FOUND IN LOCAL STORAGE"
        );

        return 0;

    }


    return numberValue(value);

}


// ============================================================
// SAVE TOTAL
// ============================================================

function saveGTotal(value) {

    value =
        Math.round(
            numberValue(value) * 100
        ) / 100;


    localStorage.setItem(
        "gTotal",
        value.toFixed(2)
    );


    console.log(
        "DISCOUNT - gTotal SAVED:",
        value.toFixed(2)
    );

}


// ============================================================
// DISPLAY TOTAL
// ============================================================

function displayTotal() {

    if (currentTotal) {

        currentTotal.textContent =
            "₹ " +
            gTotal.toFixed(2);

    }


    if (newGrandTotal) {

        newGrandTotal.textContent =
            "₹ " +
            gTotal.toFixed(2);

    }

}


// ============================================================
// SHOW / HIDE DISCOUNT
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
        discount = 0;

        // Keep same total
        saveGTotal(gTotal);

        displayTotal();

    }

}


// ============================================================
// CALCULATE DISCOUNT
// ============================================================

function calculateDiscount() {

    console.log("--------------------------------");
    console.log("CALCULATE DISCOUNT");
    console.log("--------------------------------");


    discount =
        numberValue(
            discountAmount
                ? discountAmount.value
                : 0
        );


    console.log(
        "CURRENT gTotal:",
        gTotal
    );


    console.log(
        "DISCOUNT:",
        discount
    );


    // ========================================================
    // VALIDATION
    // ========================================================

    if (discount < 0) {

        alert(
            "Discount cannot be negative."
        );

        return;

    }


    if (discount > gTotal) {

        alert(
            "Discount cannot be greater than the total."
        );

        return;

    }


    // ========================================================
    // SUBTRACT DISCOUNT
    // ========================================================

    gTotal =
        gTotal - discount;


    gTotal =
        Math.round(
            gTotal * 100
        ) / 100;


    console.log(
        "NEW gTotal AFTER DISCOUNT:",
        gTotal
    );


    // ========================================================
    // SAVE NEW TOTAL
    // ========================================================

    saveGTotal(gTotal);


    // ========================================================
    // DISPLAY
    // ========================================================

    displayTotal();

}


// ============================================================
// NEXT BUTTON
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log("--------------------------------");
            console.log("DISCOUNT NEXT CLICKED");
            console.log("--------------------------------");


            const selected =
                document.querySelector(
                    'input[name="discountOption"]:checked'
                );


            // =================================================
            // NO DISCOUNT
            // =================================================

            if (
                selected &&
                selected.value === "no"
            ) {

                discount = 0;

                saveGTotal(gTotal);

            }


            // =================================================
            // DISCOUNT
            // =================================================

            else if (
                selected &&
                selected.value === "yes"
            ) {

                calculateDiscount();

            }


            console.log(
                "FINAL gTotal BEFORE LABOUR:",
                localStorage.getItem("gTotal")
            );


            // =================================================
            // GO TO LABOUR
            // =================================================

            window.location.href =
                "labour.html";

        }
    );

}


// ============================================================
// BACK BUTTON
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            window.location.href =
                "personal.html";

        }
    );

}


// ============================================================
// RADIO BUTTONS
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

if (calculateDiscountBtn) {

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
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("--------------------------------");
        console.log("DISCOUNT PAGE INITIALIZING");
        console.log("--------------------------------");


        // ====================================================
        // GET TOTAL FROM WOOD
        // ====================================================

        gTotal =
            getGTotal();


        console.log(
            "DISCOUNT ORIGINAL gTotal:",
            gTotal
        );


        // ====================================================
        // DISPLAY
        // ====================================================

        displayTotal();


        // ====================================================
        // DISCOUNT SECTION
        // ====================================================

        updateDiscountSection();


        console.log("--------------------------------");
        console.log(
            "DISCOUNT PAGE READY - gTotal:",
            gTotal
        );
        console.log("--------------------------------");

    }
);
