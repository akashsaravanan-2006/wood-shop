// ============================================================
// LABOUR.JS
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
// Wood Total = final total received from Discount
//
// Grand Total =
// Wood Total
// + Labour Charge
// + Other Charge
// + Additional Others
// ============================================================


console.clear();

console.log("======================================");
console.log("LABOUR.JS LOADED");
console.log("LABOUR.JS VERSION 200");
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

let additionalOthers = [];


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
// FORMAT
// ============================================================

function formatMoney(value) {

    return money(value).toFixed(2);

}


// ============================================================
// GET TOTAL FROM STORAGE
//
// We specifically check gTotal first.
// ============================================================

function getWoodTotal() {

    console.log("======================================");
    console.log("READING TOTAL FROM STORAGE");
    console.log("======================================");


    // --------------------------------------------------------
    // gTotal
    // --------------------------------------------------------

    const gTotal =
        localStorage.getItem("gTotal");


    console.log(
        "gTotal FROM STORAGE:",
        gTotal
    );


    if (
        gTotal !== null &&
        gTotal !== ""
    ) {

        const value =
            number(gTotal);


        console.log(
            "USING gTotal:",
            value
        );


        return money(value);

    }


    // --------------------------------------------------------
    // finalTotal
    // --------------------------------------------------------

    const finalTotal =
        localStorage.getItem("finalTotal");


    console.log(
        "finalTotal FROM STORAGE:",
        finalTotal
    );


    if (
        finalTotal !== null &&
        finalTotal !== ""
    ) {

        return money(finalTotal);

    }


    // --------------------------------------------------------
    // grandTotal
    // --------------------------------------------------------

    const grandTotal =
        localStorage.getItem("grandTotal");


    console.log(
        "grandTotal FROM STORAGE:",
        grandTotal
    );


    if (
        grandTotal !== null &&
        grandTotal !== ""
    ) {

        return money(grandTotal);

    }


    // --------------------------------------------------------
    // discountData
    // --------------------------------------------------------

    const discountData =
        localStorage.getItem("discountData");


    console.log(
        "discountData FROM STORAGE:",
        discountData
    );


    if (discountData) {

        try {

            const data =
                JSON.parse(discountData);


            if (
                data &&
                data.grandTotal !== undefined
            ) {

                return money(
                    data.grandTotal
                );

            }


            if (
                data &&
                data.finalTotal !== undefined
            ) {

                return money(
                    data.finalTotal
                );

            }

        } catch (error) {

            console.error(
                "discountData JSON ERROR:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // totals
    // --------------------------------------------------------

    const totals =
        localStorage.getItem("totals");


    console.log(
        "totals FROM STORAGE:",
        totals
    );


    if (totals) {

        try {

            const data =
                JSON.parse(totals);


            if (
                data &&
                data.grandTotal !== undefined
            ) {

                return money(
                    data.grandTotal
                );

            }

        } catch (error) {

            console.error(
                "totals JSON ERROR:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // Nothing found
    // --------------------------------------------------------

    console.error(
        "LABOUR ERROR: NO TOTAL FOUND"
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
// GET LABOUR
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
// GET MAIN OTHER
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
// CALCULATE ADDITIONAL OTHERS
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
// ============================================================

function updateOthersTotal() {

    const labour = getLabour();

    const mainOther = getMainOther();

    const additional = calculateAdditionalOthers();

    const total = money(
        woodTotal +
        labour +
        mainOther +
        additional
    );

    if (othersTotalElement) {

        othersTotalElement.textContent =
            "₹ " + formatMoney(total);

    }

    return total;
}


// ============================================================
// CALCULATE GRAND TOTAL
// ============================================================

function calculateGrandTotal() {

    const labour = getLabour();

    const mainOther = getMainOther();

    const additional = calculateAdditionalOthers();

    const total = money(
        woodTotal +
        labour +
        mainOther +
        additional
    );


    console.log("--------------------------------------");
    console.log("LABOUR CALCULATION");
    console.log("WOOD TOTAL:", woodTotal);
    console.log("LABOUR CHARGE:", labour);
    console.log("OTHER CHARGE:", mainOther);
    console.log("ADDITIONAL OTHERS:", additional);
    console.log("OTHERS TOTAL:", total);
    console.log("GRAND TOTAL:", total);
    console.log("--------------------------------------");


    // OTHERS TOTAL
    if (othersTotalElement) {

        othersTotalElement.textContent =
            "₹ " + formatMoney(total);

    }


    // GRAND TOTAL
    if (grandTotalElement) {

        grandTotalElement.textContent =
            "₹ " + formatMoney(total);

    }


    return total;
}


    // ========================================================
    // THIS IS THE IMPORTANT PART
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

        return;

    }


    const row =
        document.createElement("div");


    row.className =
        "otherRow";


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


    const amountInput =
        row.querySelector(
            ".additionalAmount"
        );


    const removeButton =
        row.querySelector(
            ".removeOther"
        );


    // --------------------------------------------------------
    // Amount change
    // --------------------------------------------------------

    amountInput.addEventListener(
        "input",
        function () {

            calculateGrandTotal();

        }
    );


    // --------------------------------------------------------
    // Remove
    // --------------------------------------------------------

    removeButton.addEventListener(
        "click",
        function () {

            row.remove();

            calculateGrandTotal();

        }
    );


    othersContainer.appendChild(row);


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


    const others =
        money(
            mainOther +
            additional
        );


    const grandTotal =
        money(
            woodTotal +
            labour +
            others
        );


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
            others,

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
        "LABOUR DATA SAVED:",
        data
    );


    console.log(
        "gTotal SAVED:",
        grandTotal.toFixed(2)
    );

}


// ============================================================
// INPUT EVENTS
// ============================================================

if (labourChargeInput) {

    labourChargeInput.addEventListener(
        "input",
        function () {

            calculateGrandTotal();

        }
    );

}


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
        function () {

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


            // Always calculate one final time
            const total =
                calculateGrandTotal();


            // Save
            saveLabourData();


            console.log(
                "FINAL LABOUR TOTAL:",
                total
            );


            console.log(
                "REDIRECT: advance.html"
            );


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


        // ----------------------------------------------------
        // Read Discount total
        // ----------------------------------------------------

        displayWoodTotal();


        // ----------------------------------------------------
        // IMPORTANT:
        // Calculate after woodTotal has been loaded.
        // ----------------------------------------------------

        calculateGrandTotal();


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
