// ============================================================
// DISCOUNT.JS
// ============================================================
//
// FLOW:
//
// Personal
//    ↓
// Discount
//    ↓
// Labour
//
// Discount reads gTotal.
// Discount modifies gTotal.
// Labour reads the updated gTotal.
//
// ============================================================

console.log("==========================================");
console.log("DISCOUNT.JS LOADED");
console.log("==========================================");


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
    document.getElementById(
        "calculateDiscountBtn"
    );

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");

const discountOptions =
    document.querySelectorAll(
        'input[name="discountOption"]'
    );


// ============================================================
// VARIABLE
// ============================================================

let gTotal = 0;


// ============================================================
// NUMBER
// ============================================================

function toNumber(value) {

    const number =
        parseFloat(value);

    if (Number.isFinite(number)) {

        return number;

    }

    return 0;

}


// ============================================================
// ROUND
// ============================================================

function roundMoney(value) {

    return Math.round(
        toNumber(value) * 100
    ) / 100;

}


// ============================================================
// LOAD gTotal
// ============================================================

function loadGTotal() {

    const stored =
        localStorage.getItem(
            "gTotal"
        );


    console.log(
        "DISCOUNT -> STORED gTotal:",
        stored
    );


    if (
        stored === null ||
        stored === ""
    ) {

        console.error(
            "ERROR: gTotal NOT FOUND"
        );

        gTotal = 0;

    }
    else {

        gTotal =
            roundMoney(
                toNumber(stored)
            );

    }


    console.log(
        "DISCOUNT -> LOADED TOTAL:",
        gTotal
    );

}


// ============================================================
// SAVE gTotal
// ============================================================

function saveGTotal() {

    gTotal =
        roundMoney(
            gTotal
        );


    localStorage.setItem(
        "gTotal",
        gTotal.toFixed(2)
    );


    console.log(
        "DISCOUNT -> SAVED gTotal:",
        localStorage.getItem("gTotal")
    );

}


// ============================================================
// DISPLAY
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


    console.log(
        "DISCOUNT DISPLAY:",
        gTotal
    );

}


// ============================================================
// SHOW/HIDE DISCOUNT
// ============================================================

function updateDiscountSection() {

    const selected =
        document.querySelector(
            'input[name="discountOption"]:checked'
        );


    if (!selected) {

        return;

    }


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

        displayTotal();

    }

}


// ============================================================
// CALCULATE DISCOUNT
// ============================================================

function calculateDiscount() {

    const discount =
        toNumber(
            discountAmount
                ? discountAmount.value
                : 0
        );


    console.log(
        "ORIGINAL TOTAL:",
        gTotal
    );

    console.log(
        "DISCOUNT:",
        discount
    );


    if (discount < 0) {

        alert(
            "Discount cannot be negative."
        );

        return false;

    }


    if (discount > gTotal) {

        alert(
            "Discount cannot be greater than total."
        );

        return false;

    }


    gTotal =
        roundMoney(
            gTotal - discount
        );


    saveGTotal();

    displayTotal();


    console.log(
        "FINAL TOTAL AFTER DISCOUNT:",
        gTotal
    );


    return true;

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
// CALCULATE DISCOUNT BUTTON
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
// NEXT
// Discount -> Labour
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "=========================================="
            );

            console.log(
                "DISCOUNT NEXT CLICKED"
            );


            const selected =
                document.querySelector(
                    'input[name="discountOption"]:checked'
                );


            // NO DISCOUNT
            if (
                selected &&
                selected.value === "no"
            ) {

                console.log(
                    "NO DISCOUNT"
                );

                // Keep same amount
                saveGTotal();

            }


            // DISCOUNT
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


            console.log(
                "FINAL gTotal BEFORE LABOUR:",
                localStorage.getItem("gTotal")
            );


            // Go to Labour
            window.location.href =
                "labour.html";

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
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            window.location.href =
                "personal.html";

        }
    );

}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "=========================================="
        );

        console.log(
            "DISCOUNT PAGE INITIALIZING"
        );


        loadGTotal();

        displayTotal();

        updateDiscountSection();


        console.log(
            "DISCOUNT PAGE READY"
        );

        console.log(
            "CURRENT gTotal:",
            localStorage.getItem("gTotal")
        );

    }
);
