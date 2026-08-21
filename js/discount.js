// ============================================================
// DISCOUNT.JS
// ============================================================

console.log("==========================================");
console.log("DISCOUNT.JS - NEW VERSION");
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


// ============================================================
// NUMBER
// ============================================================

function numberValue(value) {

    const n = parseFloat(value);

    if (Number.isFinite(n)) {
        return n;
    }

    return 0;
}


// ============================================================
// ROUND
// ============================================================

function roundMoney(value) {

    return Math.round(
        numberValue(value) * 100
    ) / 100;

}


// ============================================================
// LOAD gTotal
// ============================================================

function loadGTotal() {

    const stored =
        localStorage.getItem("gTotal");

    console.log(
        "DISCOUNT -> gTotal BEFORE:",
        stored
    );


    if (
        stored === null ||
        stored === ""
    ) {

        console.error(
            "DISCOUNT ERROR: gTotal IS NULL"
        );

        gTotal = 0;

    }
    else {

        gTotal =
            roundMoney(stored);

    }


    console.log(
        "DISCOUNT -> gTotal LOADED:",
        gTotal
    );

}


// ============================================================
// SAVE gTotal
// ============================================================

function saveGTotal() {

    gTotal =
        roundMoney(gTotal);


    localStorage.setItem(
        "gTotal",
        gTotal.toFixed(2)
    );


    console.log(
        "=========================================="
    );

    console.log(
        "DISCOUNT -> gTotal SAVED"
    );

    console.log(
        "VALUE:",
        gTotal.toFixed(2)
    );

    console.log(
        "CHECK:",
        localStorage.getItem("gTotal")
    );

    console.log(
        "=========================================="
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

    }

}


// ============================================================
// CALCULATE DISCOUNT
// ============================================================

function calculateDiscount() {

    const discount =
        numberValue(
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


    return true;

}


// ============================================================
// RADIO CHANGE
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
// NEXT
// DISCOUNT -> LABOUR
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


            // ==================================================
            // NO DISCOUNT
            // ==================================================

            if (
                selected &&
                selected.value === "no"
            ) {

                console.log(
                    "NO DISCOUNT SELECTED"
                );


                // IMPORTANT
                // Save current amount
                saveGTotal();

            }


            // ==================================================
            // DISCOUNT
            // ==================================================

            else if (
                selected &&
                selected.value === "yes"
            ) {

                console.log(
                    "DISCOUNT SELECTED"
                );


                const success =
                    calculateDiscount();


                if (!success) {
                    return;
                }

            }


            // ==================================================
            // FINAL CHECK
            // ==================================================

            const finalStoredTotal =
                localStorage.getItem(
                    "gTotal"
                );


            console.log(
                "=========================================="
            );

            console.log(
                "FINAL gTotal BEFORE LABOUR:",
                finalStoredTotal
            );

            console.log(
                "=========================================="
            );


            // SAFETY CHECK
            if (
                finalStoredTotal === null ||
                finalStoredTotal === ""
            ) {

                alert(
                    "Total could not be saved. Please try again."
                );

                return;

            }


            // ==================================================
            // GO TO LABOUR
            // ==================================================

            window.location.href =
                "labour.html";

        }
    );

}


// ============================================================
// BACK
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
            "DISCOUNT PAGE INITIALIZING"
        );


        loadGTotal();

        displayTotal();

        updateDiscountSection();


        console.log(
            "DISCOUNT PAGE READY"
        );

        console.log(
            "CURRENT STORAGE gTotal:",
            localStorage.getItem("gTotal")
        );

    }
);
