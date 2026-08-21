// ============================================================
// LABOUR.JS
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
// Labour
//   ↓
// Advance
//
// IMPORTANT:
//
// Discount saves the discounted amount into:
// localStorage["gTotal"]
//
// Labour reads that value.
// Labour adds labour + other charges.
// Labour saves the FINAL amount back to:
// localStorage["gTotal"]
//
// ============================================================

console.log("==========================================");
console.log("LABOUR.JS LOADED");
console.log("==========================================");


// ============================================================
// ELEMENTS
// ============================================================

const labourChargeInput =
    document.getElementById("labourCharge");

const otherChargeInput =
    document.getElementById("otherCharge");

const addOtherBtn =
    document.getElementById("addOther");

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

// Amount received from Discount
let baseTotal = 0;

// Labour charge
let labourCharge = 0;

// Other charge
let otherCharge = 0;

// Additional Other rows
let othersData = [];


// ============================================================
// NUMBER FUNCTION
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
// ROUND MONEY
// ============================================================

function roundMoney(value) {

    return Math.round(
        toNumber(value) * 100
    ) / 100;

}


// ============================================================
// LOAD gTotal FROM DISCOUNT
// ============================================================

function loadBaseTotal() {

    const storedTotal =
        localStorage.getItem("gTotal");


    console.log(
        "LABOUR - gTotal FROM STORAGE:",
        storedTotal
    );


    if (
        storedTotal === null ||
        storedTotal === ""
    ) {

        console.error(
            "LABOUR ERROR: gTotal NOT FOUND"
        );

        baseTotal = 0;

    }
    else {

        baseTotal =
            toNumber(storedTotal);

    }


    baseTotal =
        roundMoney(baseTotal);


    console.log(
        "LABOUR BASE TOTAL:",
        baseTotal
    );

}


// ============================================================
// GET INPUT VALUES
// ============================================================

function getCharges() {

    labourCharge =
        toNumber(
            labourChargeInput
                ? labourChargeInput.value
                : 0
        );


    otherCharge =
        toNumber(
            otherChargeInput
                ? otherChargeInput.value
                : 0
        );


    console.log(
        "LABOUR CHARGE:",
        labourCharge
    );

    console.log(
        "OTHER CHARGE:",
        otherCharge
    );

}


// ============================================================
// CALCULATE ADDITIONAL OTHERS
// ============================================================

function calculateOthersTotal() {

    let total = 0;


    othersData.forEach(
        function (item) {

            total +=
                toNumber(item.amount);

        }
    );


    return roundMoney(total);

}


// ============================================================
// UPDATE OTHERS TOTAL
// ============================================================

function updateOthersTotal() {

    const total =
        calculateOthersTotal();


    if (othersTotalElement) {

        othersTotalElement.textContent =
            "₹ " +
            total.toFixed(2);

    }


    return total;

}


// ============================================================
// CALCULATE FINAL TOTAL
// ============================================================

function calculateFinalTotal() {

    getCharges();


    const additionalOthers =
        calculateOthersTotal();


    const finalTotal =
        baseTotal +
        labourCharge +
        otherCharge +
        additionalOthers;


    return roundMoney(
        finalTotal
    );

}


// ============================================================
// DISPLAY FINAL TOTAL
// ============================================================

function updateGrandTotal() {

    const finalTotal =
        calculateFinalTotal();


    if (grandTotalElement) {

        grandTotalElement.textContent =
            "₹ " +
            finalTotal.toFixed(2);

    }


    updateOthersTotal();


    console.log(
        "=========================================="
    );

    console.log(
        "LABOUR CALCULATION"
    );

    console.log(
        "BASE TOTAL:",
        baseTotal
    );

    console.log(
        "LABOUR CHARGE:",
        labourCharge
    );

    console.log(
        "OTHER CHARGE:",
        otherCharge
    );

    console.log(
        "ADDITIONAL OTHERS:",
        calculateOthersTotal()
    );

    console.log(
        "FINAL TOTAL:",
        finalTotal
    );

    console.log(
        "=========================================="
    );


    return finalTotal;

}


// ============================================================
// SAVE FINAL TOTAL
// ============================================================

function saveLabourData() {

    const finalTotal =
        updateGrandTotal();


    // ========================================================
    // SAVE FINAL TOTAL AS gTotal
    // ========================================================

    localStorage.setItem(
        "gTotal",
        finalTotal.toFixed(2)
    );


    // ========================================================
    // SAVE LABOUR DATA
    // ========================================================

    const labourData = {

        baseTotal:
            baseTotal,

        labourCharge:
            labourCharge,

        otherCharge:
            otherCharge,

        othersData:
            othersData,

        othersTotal:
            calculateOthersTotal(),

        finalTotal:
            finalTotal

    };


    localStorage.setItem(
        "labourData",
        JSON.stringify(
            labourData
        )
    );


    console.log(
        "LABOUR DATA SAVED:",
        labourData
    );


    console.log(
        "LABOUR -> gTotal SAVED:",
        localStorage.getItem("gTotal")
    );


    return finalTotal;

}


// ============================================================
// ADD OTHER
// ============================================================

function addOther() {

    if (!othersContainer) {

        console.warn(
            "othersContainer not found"
        );

        return;

    }


    const row =
        document.createElement("div");


    row.className =
        "other-row";


    row.innerHTML = `

        <input
            type="text"
            class="otherName"
            placeholder="Other Name">

        <input
            type="number"
            class="otherAmount"
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


    othersContainer.appendChild(
        row
    );


    const nameInput =
        row.querySelector(
            ".otherName"
        );

    const amountInput =
        row.querySelector(
            ".otherAmount"
        );

    const removeButton =
        row.querySelector(
            ".removeOther"
        );


    function updateRow() {

        const name =
            nameInput.value.trim();

        const amount =
            toNumber(
                amountInput.value
            );


        const existingIndex =
            othersData.findIndex(
                function (item) {

                    return item.row === row;

                }
            );


        if (existingIndex !== -1) {

            othersData[
                existingIndex
            ].name =
                name;

            othersData[
                existingIndex
            ].amount =
                amount;

        }
        else {

            othersData.push({

                row:
                    row,

                name:
                    name,

                amount:
                    amount

            });

        }


        updateGrandTotal();

    }


    nameInput.addEventListener(
        "input",
        updateRow
    );


    amountInput.addEventListener(
        "input",
        updateRow
    );


    removeButton.addEventListener(
        "click",
        function () {

            othersData =
                othersData.filter(
                    function (item) {

                        return item.row !== row;

                    }
                );


            row.remove();


            updateGrandTotal();

        }
    );


    othersData.push({

        row:
            row,

        name:
            "",

        amount:
            0

    });


    updateGrandTotal();

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
// LIVE LABOUR INPUT
// ============================================================

if (labourChargeInput) {

    labourChargeInput.addEventListener(
        "input",
        function () {

            updateGrandTotal();

        }
    );

}


// ============================================================
// LIVE OTHER CHARGE INPUT
// ============================================================

if (otherChargeInput) {

    otherChargeInput.addEventListener(
        "input",
        function () {

            updateGrandTotal();

        }
    );

}


// ============================================================
// CONFIRM
// Labour -> Advance
// ============================================================

if (confirmBtn) {

    confirmBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "=========================================="
            );

            console.log(
                "LABOUR CONFIRM CLICKED"
            );


            // Save final Labour amount
            const finalTotal =
                saveLabourData();


            console.log(
                "FINAL LABOUR TOTAL:",
                finalTotal
            );


            console.log(
                "REDIRECTING TO ADVANCE"
            );


            // IMPORTANT
            // Labour -> Advance
            window.location.href =
                "advance.html";

        }
    );

}


// ============================================================
// BACK
// Labour -> Discount
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "LABOUR BACK CLICKED"
            );


            window.location.href =
                "discount.html";

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
            "LABOUR PAGE INITIALIZING"
        );


        // Load discounted total
        loadBaseTotal();


        // Load previously saved Labour data
        const savedData =
            localStorage.getItem(
                "labourData"
            );


        if (savedData) {

            try {

                const data =
                    JSON.parse(
                        savedData
                    );


                console.log(
                    "SAVED LABOUR DATA:",
                    data
                );


                // Do NOT replace baseTotal
                // with old data.
                //
                // Always use current gTotal
                // from Discount.

                if (labourChargeInput) {

                    labourChargeInput.value =
                        data.labourCharge || "";

                }


                if (otherChargeInput) {

                    otherChargeInput.value =
                        data.otherCharge || "";

                }

            }
            catch (error) {

                console.error(
                    "LABOUR DATA PARSE ERROR:",
                    error
                );

            }

        }


        updateGrandTotal();


        console.log(
            "LABOUR PAGE READY"
        );

        console.log(
            "CURRENT gTotal:",
            localStorage.getItem("gTotal")
        );

    }
);
