// ============================================================
// LABOUR.JS
// Labour & Other Charges
//
// FLOW:
//
// Wood
//   ↓
// Personal
//   ↓
// Discount
//   ↓
// Labour
//   ↓
// Advance
//
// IMPORTANT:
//
// Labour gets the WOOD TOTAL from Discount.
// Labour calculates:
//
// Wood Total
// + Labour Charge
// + Other Charge
// + Additional Others
// = Grand Total
// ============================================================


console.clear();

console.log("======================================");
console.log("LABOUR.JS LOADED");
console.log("LABOUR.JS VERSION 300");
console.log("======================================");


// ============================================================
// ELEMENTS
// ============================================================

const woodTotalElement =
    document.getElementById("woodTotal");

const labourChargeInput =
    document.getElementById("labourCharge");

const otherChargeInput =
    document.getElementById("otherCharge");

const addOtherBtn =
    document.getElementById("addOtherBtn");

const othersContainer =
    document.getElementById("othersContainer");

const othersTotalElement =
    document.getElementById("othersTotal");

const grandTotalElement =
    document.getElementById("grandTotal");

const confirmBtn =
    document.getElementById("confirmBtn");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// VARIABLES
// ============================================================

let woodTotal = 0;


// ============================================================
// NUMBER
// ============================================================

function number(value) {

    const n = parseFloat(value);

    if (isNaN(n)) {
        return 0;
    }

    return n;
}


// ============================================================
// MONEY
// ============================================================

function money(value) {

    return Math.round(
        (number(value) + Number.EPSILON) * 100
    ) / 100;

}


// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(value) {

    return money(value).toFixed(2);

}


// ============================================================
// GET WOOD TOTAL
//
// IMPORTANT:
//
// DO NOT READ gTotal FIRST.
//
// gTotal is the FINAL LABOUR TOTAL.
// If we read it here, old Labour totals can become
// the new Wood Total.
//
// Correct source:
//
// Discount -> discountData.finalTotal
// ============================================================

function getWoodTotal() {

    console.log("======================================");
    console.log("READING WOOD TOTAL");
    console.log("======================================");


    // ========================================================
    // 1. discountData
    // ========================================================

    const discountData =
        localStorage.getItem("discountData");


    console.log(
        "discountData:",
        discountData
    );


    if (discountData) {

        try {

            const data =
                JSON.parse(discountData);


            console.log(
                "DISCOUNT DATA:",
                data
            );


            // ------------------------------------------------
            // Discount finalTotal
            // ------------------------------------------------

            if (
                data &&
                data.finalTotal !== undefined &&
                data.finalTotal !== null
            ) {

                const value =
                    money(data.finalTotal);


                console.log(
                    "USING DISCOUNT finalTotal:",
                    value
                );


                return value;

            }


            // ------------------------------------------------
            // Discount grandTotal
            // ------------------------------------------------

            if (
                data &&
                data.grandTotal !== undefined &&
                data.grandTotal !== null
            ) {

                const value =
                    money(data.grandTotal);


                console.log(
                    "USING DISCOUNT grandTotal:",
                    value
                );


                return value;

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
    // 2. finalTotal
    // ========================================================

    const finalTotal =
        localStorage.getItem("finalTotal");


    console.log(
        "finalTotal:",
        finalTotal
    );


    if (
        finalTotal !== null &&
        finalTotal !== ""
    ) {

        const value =
            money(finalTotal);


        console.log(
            "USING finalTotal:",
            value
        );


        return value;

    }


    // ========================================================
    // 3. grandTotal
    // ========================================================

    const grandTotal =
        localStorage.getItem("grandTotal");


    console.log(
        "grandTotal:",
        grandTotal
    );


    if (
        grandTotal !== null &&
        grandTotal !== ""
    ) {

        const value =
            money(grandTotal);


        console.log(
            "USING grandTotal:",
            value
        );


        return value;

    }


    // ========================================================
    // IMPORTANT
    //
    // DO NOT USE gTotal HERE
    // ========================================================

    console.warn(
        "NO DISCOUNT TOTAL FOUND"
    );


    return 0;

}


// ============================================================
// DISPLAY WOOD TOTAL
// ============================================================

function displayWoodTotal() {

    woodTotal =
        getWoodTotal();


    console.log(
        "WOOD TOTAL:",
        woodTotal
    );


    if (woodTotalElement) {

        woodTotalElement.textContent =
            "₹ " + formatMoney(woodTotal);

    }

}


// ============================================================
// GET LABOUR CHARGE
// ============================================================

function getLabour() {

    if (!labourChargeInput) {
        return 0;
    }


    return money(
        labourChargeInput.value
    );

}


// ============================================================
// GET MAIN OTHER CHARGE
// ============================================================

function getMainOther() {

    if (!otherChargeInput) {
        return 0;
    }


    return money(
        otherChargeInput.value
    );

}


// ============================================================
// GET ADDITIONAL OTHERS
// ============================================================

function calculateAdditionalOthers() {

    let total = 0;


    const rows =
        document.querySelectorAll(
            ".otherRow"
        );


    rows.forEach(function (row) {

        const amountInput =
            row.querySelector(
                ".additionalAmount"
            );


        if (amountInput) {

            total +=
                money(
                    amountInput.value
                );

        }

    });


    return money(total);

}


// ============================================================
// UPDATE OTHERS TOTAL
//
// Others Total:
//
// Labour Charge
// + Other Charge
// + Additional Others
//
// Example:
//
// Labour = 10
// Other = 20
// Additional = 5
//
// Others Total = 35
// ============================================================

function updateOthersTotal() {

    const labour =
        getLabour();


    const mainOther =
        getMainOther();


    const additional =
        calculateAdditionalOthers();


    const othersTotal =
        money(
            labour +
            mainOther +
            additional
        );


    console.log(
        "OTHERS TOTAL:",
        othersTotal
    );


    if (othersTotalElement) {

        othersTotalElement.textContent =
            "₹ " + formatMoney(othersTotal);

    }


    return othersTotal;

}


// ============================================================
// CALCULATE GRAND TOTAL
//
// Wood Total
// + Labour
// + Other
// + Additional Others
//
// = Grand Total
// ============================================================

function calculateGrandTotal() {

    const labour =
        getLabour();


    const mainOther =
        getMainOther();


    const additional =
        calculateAdditionalOthers();


    // ========================================================
    // OTHERS TOTAL
    // ========================================================

    const othersTotal =
        money(
            labour +
            mainOther +
            additional
        );


    // ========================================================
    // GRAND TOTAL
    // ========================================================

    const grandTotal =
        money(
            woodTotal +
            othersTotal
        );


    console.log("--------------------------------------");
    console.log("LABOUR CALCULATION");
    console.log("WOOD TOTAL:", woodTotal);
    console.log("LABOUR CHARGE:", labour);
    console.log("OTHER CHARGE:", mainOther);
    console.log("ADDITIONAL OTHERS:", additional);
    console.log("OTHERS TOTAL:", othersTotal);
    console.log("GRAND TOTAL:", grandTotal);
    console.log("--------------------------------------");


    // ========================================================
    // UPDATE OTHERS TOTAL
    // ========================================================

    if (othersTotalElement) {

        othersTotalElement.textContent =
            "₹ " + formatMoney(othersTotal);

    }


    // ========================================================
    // UPDATE GRAND TOTAL
    // ========================================================

    if (grandTotalElement) {

        grandTotalElement.textContent =
            "₹ " + formatMoney(grandTotal);

    }


    return grandTotal;

}


// ============================================================
// ADD OTHER
// ============================================================

function addOther() {

    if (!othersContainer) {

        console.error(
            "othersContainer NOT FOUND"
        );

        return;

    }


    // ========================================================
    // CREATE ROW
    // ========================================================

    const row =
        document.createElement("div");


    row.className =
        "otherRow";


    // ========================================================
    // ROW HTML
    // ========================================================

    row.innerHTML = `

        <input
            type="text"
            class="otherName"
            placeholder="Other Name">

        <input
            type="number"
            class="additionalAmount"
            min="0"
            step="0.01"
            value="0"
            placeholder="Amount">

        <button
            type="button"
            class="removeOther">

            Remove

        </button>

    `;


    // ========================================================
    // ELEMENTS
    // ========================================================

    const amountInput =
        row.querySelector(
            ".additionalAmount"
        );


    const removeButton =
        row.querySelector(
            ".removeOther"
        );


    // ========================================================
    // AMOUNT INPUT
    // ========================================================

    if (amountInput) {

        amountInput.addEventListener(
            "input",
            function () {

                calculateGrandTotal();

            }
        );

    }


    // ========================================================
    // REMOVE BUTTON
    // ========================================================

    if (removeButton) {

        removeButton.addEventListener(
            "click",
            function () {

                row.remove();

                calculateGrandTotal();

            }
        );

    }


    // ========================================================
    // ADD ROW
    // ========================================================

    othersContainer.appendChild(row);


    // ========================================================
    // RECALCULATE
    // ========================================================

    calculateGrandTotal();

}


// ============================================================
// SAVE LABOUR DATA
// ============================================================

function saveLabourData() {

    const labour =
        getLabour();


    const mainOther =
        getMainOther();


    const additional =
        calculateAdditionalOthers();


    // ========================================================
    // OTHERS TOTAL
    // ========================================================

    const othersTotal =
        money(
            labour +
            mainOther +
            additional
        );


    // ========================================================
    // FINAL GRAND TOTAL
    // ========================================================

    const grandTotal =
        money(
            woodTotal +
            othersTotal
        );


    // ========================================================
    // GET OTHER ROW DATA
    // ========================================================

    const rows =
        document.querySelectorAll(
            ".otherRow"
        );


    const othersData = [];


    rows.forEach(function (row) {

        const nameInput =
            row.querySelector(
                ".otherName"
            );


        const amountInput =
            row.querySelector(
                ".additionalAmount"
            );


        othersData.push({

            name:
                nameInput
                    ? nameInput.value.trim()
                    : "",

            amount:
                amountInput
                    ? money(amountInput.value)
                    : 0

        });

    });


    // ========================================================
    // DATA OBJECT
    // ========================================================

    const data = {

        woodTotal:
            woodTotal,

        labourCharge:
            labour,

        otherCharge:
            mainOther,

        othersData:
            othersData,

        othersTotal:
            othersTotal,

        finalTotal:
            grandTotal

    };


    // ========================================================
    // SAVE LABOUR DATA
    // ========================================================

    localStorage.setItem(
        "labourData",
        JSON.stringify(data)
    );


    // ========================================================
    // SAVE FINAL TOTAL
    //
    // gTotal is ONLY the final Labour total.
    // It is NOT used as Wood Total.
    // ========================================================

    localStorage.setItem(
        "gTotal",
        grandTotal.toFixed(2)
    );


    localStorage.setItem(
        "grandTotal",
        grandTotal.toFixed(2)
    );


    localStorage.setItem(
        "finalTotal",
        grandTotal.toFixed(2)
    );


    console.log(
        "======================================"
    );


    console.log(
        "LABOUR DATA SAVED:",
        data
    );


    console.log(
        "gTotal SAVED:",
        grandTotal.toFixed(2)
    );


    console.log(
        "FINAL LABOUR TOTAL:",
        grandTotal
    );


    console.log(
        "======================================"
    );


    return grandTotal;

}


// ============================================================
// LABOUR INPUT EVENT
// ============================================================

if (labourChargeInput) {

    labourChargeInput.addEventListener(
        "input",
        function () {

            calculateGrandTotal();

        }
    );

}


// ============================================================
// OTHER INPUT EVENT
// ============================================================

if (otherChargeInput) {

    otherChargeInput.addEventListener(
        "input",
        function () {

            calculateGrandTotal();

        }
    );

}


// ============================================================
// ADD OTHER BUTTON
// ============================================================

if (addOtherBtn) {

    addOtherBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            addOther();

        }
    );

}


// ============================================================
// CONFIRM
//
// Labour -> Advance
// ============================================================

if (confirmBtn) {

    confirmBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "======================================"
            );


            console.log(
                "LABOUR CONFIRM CLICKED"
            );


            // ==================================================
            // FINAL CALCULATION
            // ==================================================

            const total =
                calculateGrandTotal();


            // ==================================================
            // SAVE
            // ==================================================

            saveLabourData();


            console.log(
                "FINAL LABOUR TOTAL:",
                total
            );


            console.log(
                "REDIRECT: advance.html"
            );


            // ==================================================
            // GO TO ADVANCE
            // ==================================================

            window.location.href =
                "advance.html";

        }
    );

}


// ============================================================
// BACK
//
// Labour -> Discount
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "BACK: discount.html"
            );


            window.location.href =
                "discount.html";

        }
    );

}


// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "======================================"
        );


        console.log(
            "LABOUR PAGE INITIALIZING"
        );


        // ====================================================
        // LOAD WOOD/DISCOUNT TOTAL
        // ====================================================

        displayWoodTotal();


        // ====================================================
        // CALCULATE INITIAL TOTAL
        // ====================================================

        calculateGrandTotal();


        console.log(
            "======================================"
        );


        console.log(
            "LABOUR PAGE READY"
        );


        console.log(
            "CURRENT WOOD TOTAL:",
            woodTotal
        );


        console.log(
            "CURRENT GRAND TOTAL:",
            calculateGrandTotal()
        );


        console.log(
            "======================================"
        );

    }
);
