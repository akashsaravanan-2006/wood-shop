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
// Labour reads the FINAL TOTAL from Discount.
// ============================================================


console.clear();

console.log("==========================================");
console.log("LABOUR.JS LOADED");
console.log("LABOUR.JS VERSION 100");
console.log("==========================================");


// ============================================================
// HTML ELEMENTS
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
// GLOBAL VALUES
// ============================================================

let woodTotal = 0;

let labourCharge = 0;

let otherCharge = 0;

let additionalOthers = [];

let finalTotal = 0;


// ============================================================
// NUMBER HELPER
// ============================================================

function toNumber(value) {

    const number = parseFloat(value);

    if (isNaN(number)) {
        return 0;
    }

    return number;
}


// ============================================================
// ROUND MONEY
// ============================================================

function money(value) {

    return Math.round(
        (toNumber(value) + Number.EPSILON) * 100
    ) / 100;

}


// ============================================================
// FORMAT MONEY
// ============================================================

function formatMoney(value) {

    return money(value).toFixed(2);

}


// ============================================================
// READ VALUE FROM LOCAL STORAGE
// ============================================================

function readStorageNumber(key) {

    const value =
        localStorage.getItem(key);

    if (
        value === null ||
        value === ""
    ) {
        return null;
    }

    const number =
        parseFloat(value);

    if (isNaN(number)) {
        return null;
    }

    return number;

}


// ============================================================
// FIND FINAL TOTAL
//
// Priority:
//
// 1. gTotal
// 2. grandTotal
// 3. finalTotal
// 4. discountGrandTotal
// 5. discountData.grandTotal
// 6. totals.grandTotal
// ============================================================

function getFinalTotalFromStorage() {

    console.log("==========================================");
    console.log("SEARCHING FOR FINAL TOTAL");
    console.log("==========================================");


    // --------------------------------------------------------
    // 1. gTotal
    // --------------------------------------------------------

    let value =
        readStorageNumber("gTotal");

    console.log(
        "gTotal:",
        value
    );

    if (value !== null) {
        return value;
    }


    // --------------------------------------------------------
    // 2. grandTotal
    // --------------------------------------------------------

    value =
        readStorageNumber("grandTotal");

    console.log(
        "grandTotal:",
        value
    );

    if (value !== null) {
        return value;
    }


    // --------------------------------------------------------
    // 3. finalTotal
    // --------------------------------------------------------

    value =
        readStorageNumber("finalTotal");

    console.log(
        "finalTotal:",
        value
    );

    if (value !== null) {
        return value;
    }


    // --------------------------------------------------------
    // 4. discountGrandTotal
    // --------------------------------------------------------

    value =
        readStorageNumber("discountGrandTotal");

    console.log(
        "discountGrandTotal:",
        value
    );

    if (value !== null) {
        return value;
    }


    // --------------------------------------------------------
    // 5. discountData
    // --------------------------------------------------------

    const discountDataText =
        localStorage.getItem("discountData");

    console.log(
        "discountData:",
        discountDataText
    );


    if (discountDataText) {

        try {

            const discountData =
                JSON.parse(discountDataText);

            if (
                discountData &&
                discountData.grandTotal !== undefined
            ) {

                const discountTotal =
                    toNumber(
                        discountData.grandTotal
                    );

                console.log(
                    "FOUND TOTAL INSIDE discountData:",
                    discountTotal
                );

                return discountTotal;

            }

        } catch (error) {

            console.error(
                "ERROR READING discountData:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // 6. totals
    // --------------------------------------------------------

    const totalsText =
        localStorage.getItem("totals");

    console.log(
        "totals:",
        totalsText
    );


    if (totalsText) {

        try {

            const totals =
                JSON.parse(totalsText);

            if (
                totals &&
                totals.grandTotal !== undefined
            ) {

                const total =
                    toNumber(
                        totals.grandTotal
                    );

                console.log(
                    "FOUND TOTAL INSIDE totals:",
                    total
                );

                return total;

            }

        } catch (error) {

            console.error(
                "ERROR READING totals:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // Nothing found
    // --------------------------------------------------------

    console.error(
        "=========================================="
    );

    console.error(
        "LABOUR ERROR: FINAL TOTAL NOT FOUND"
    );

    console.error(
        "=========================================="
    );

    return 0;

}


// ============================================================
// LOAD WOOD / DISCOUNT TOTAL
// ============================================================

function loadWoodTotal() {

    woodTotal =
        money(
            getFinalTotalFromStorage()
        );


    console.log(
        "LABOUR WOOD TOTAL:",
        woodTotal
    );


    if (woodTotalElement) {

        woodTotalElement.textContent =
            formatMoney(woodTotal);

    }

}


// ============================================================
// GET LABOUR CHARGE
// ============================================================

function getLabourCharge() {

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

function getOtherCharge() {

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

function getAdditionalOthersTotal() {

    let total = 0;


    additionalOthers.forEach(function (item) {

        total +=
            toNumber(item.amount);

    });


    return money(total);

}


// ============================================================
// CALCULATE OTHERS TOTAL
//
// Main Other Charge
// +
// Additional Others
// ============================================================

function calculateOthersTotal() {

    const mainOther =
        getOtherCharge();

    const additionalOther =
        getAdditionalOthersTotal();


    const total =
        money(
            mainOther +
            additionalOther
        );


    if (othersTotalElement) {

        othersTotalElement.textContent =
            "₹ " + formatMoney(total);

    }


    return total;

}


// ============================================================
// CALCULATE GRAND TOTAL
//
// Wood Total
// +
// Labour
// +
// Other Charges
// +
// Additional Others
// ============================================================

function calculateGrandTotal() {

    const labour =
        getLabourCharge();

    const others =
        calculateOthersTotal();


    finalTotal =
        money(
            woodTotal +
            labour +
            others
        );


    console.log("==========================================");
    console.log("LABOUR CALCULATION");
    console.log("WOOD TOTAL:", woodTotal);
    console.log("LABOUR CHARGE:", labour);
    console.log("OTHERS TOTAL:", others);
    console.log("FINAL TOTAL:", finalTotal);
    console.log("==========================================");


    if (grandTotalElement) {

        grandTotalElement.textContent =
            "₹ " + formatMoney(finalTotal);

    }


    return finalTotal;

}


// ============================================================
// ADD OTHER CHARGE ROW
// ============================================================

function addOtherRow() {

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
            class="additionalOtherAmount"
            min="0"
            step="0.01"
            value="0"
            placeholder="Amount">

        <button
            type="button"
            class="removeOtherBtn">

            Remove

        </button>

    `;


    const nameInput =
        row.querySelector(".otherName");

    const amountInput =
        row.querySelector(
            ".additionalOtherAmount"
        );

    const removeButton =
        row.querySelector(
            ".removeOtherBtn"
        );


    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    function updateRow() {

        calculateGrandTotal();

    }


    amountInput.addEventListener(
        "input",
        updateRow
    );


    nameInput.addEventListener(
        "input",
        updateRow
    );


    // --------------------------------------------------------
    // REMOVE
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

    labourCharge =
        getLabourCharge();

    otherCharge =
        getOtherCharge();


    const additionalData = [];


    if (othersContainer) {

        const rows =
            othersContainer.querySelectorAll(
                ".otherRow"
            );


        rows.forEach(function (row) {

            const nameInput =
                row.querySelector(
                    ".otherName"
                );

            const amountInput =
                row.querySelector(
                    ".additionalOtherAmount"
                );


            additionalData.push({

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

    }


    additionalOthers =
        additionalData;


    finalTotal =
        calculateGrandTotal();


    const labourData = {

        woodTotal:
            woodTotal,

        labourCharge:
            labourCharge,

        otherCharge:
            otherCharge,

        othersData:
            additionalOthers,

        othersTotal:
            calculateOthersTotal(),

        finalTotal:
            finalTotal

    };


    // ========================================================
    // SAVE MAIN LABOUR DATA
    // ========================================================

    localStorage.setItem(
        "labourData",
        JSON.stringify(labourData)
    );


    // ========================================================
    // SAVE FINAL TOTAL
    // ========================================================

    localStorage.setItem(
        "gTotal",
        finalTotal.toFixed(2)
    );


    localStorage.setItem(
        "grandTotal",
        finalTotal.toFixed(2)
    );


    localStorage.setItem(
        "finalTotal",
        finalTotal.toFixed(2)
    );


    console.log(
        "LABOUR DATA SAVED:",
        labourData
    );

    console.log(
        "gTotal SAVED:",
        finalTotal.toFixed(2)
    );

}


// ============================================================
// LOAD SAVED LABOUR DATA
// ============================================================

function loadLabourData() {

    const saved =
        localStorage.getItem(
            "labourData"
        );


    if (!saved) {

        return;

    }


    try {

        const data =
            JSON.parse(saved);


        if (
            data.woodTotal !== undefined &&
            woodTotal === 0
        ) {

            woodTotal =
                money(data.woodTotal);

        }


        if (labourChargeInput) {

            labourChargeInput.value =
                data.labourCharge || 0;

        }


        if (otherChargeInput) {

            otherChargeInput.value =
                data.otherCharge || 0;

        }


        additionalOthers =
            Array.isArray(data.othersData)
                ? data.othersData
                : [];


        // ----------------------------------------------------
        // Recreate additional rows
        // ----------------------------------------------------

        if (othersContainer) {

            othersContainer.innerHTML = "";


            additionalOthers.forEach(
                function (item) {

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "otherRow";


                    row.innerHTML = `

                        <input
                            type="text"
                            class="otherName"
                            placeholder="Other Name"
                            value="${escapeHtml(
                                item.name || ""
                            )}">

                        <input
                            type="number"
                            class="additionalOtherAmount"
                            min="0"
                            step="0.01"
                            value="${money(
                                item.amount || 0
                            )}">

                        <button
                            type="button"
                            class="removeOtherBtn">

                            Remove

                        </button>

                    `;


                    const amountInput =
                        row.querySelector(
                            ".additionalOtherAmount"
                        );

                    const nameInput =
                        row.querySelector(
                            ".otherName"
                        );

                    const removeButton =
                        row.querySelector(
                            ".removeOtherBtn"
                        );


                    amountInput.addEventListener(
                        "input",
                        calculateGrandTotal
                    );


                    nameInput.addEventListener(
                        "input",
                        calculateGrandTotal
                    );


                    removeButton.addEventListener(
                        "click",
                        function () {

                            row.remove();

                            calculateGrandTotal();

                        }
                    );


                    othersContainer.appendChild(row);

                }
            );

        }


    } catch (error) {

        console.error(
            "ERROR LOADING LABOUR DATA:",
            error
        );

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
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

            addOtherRow();

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
                "=========================================="
            );

            console.log(
                "LABOUR CONFIRM CLICKED"
            );


            // Calculate latest value
            calculateGrandTotal();


            // Save everything
            saveLabourData();


            console.log(
                "LABOUR TOTAL SAVED:",
                finalTotal
            );

            console.log(
                "GOING TO ADVANCE.HTML"
            );

            console.log(
                "=========================================="
            );


            // IMPORTANT:
            // Labour -> Advance

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
                "LABOUR BACK CLICKED"
            );


            window.location.href =
                "discount.html";

        }
    );

}


// ============================================================
// INITIALIZE
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


        // ----------------------------------------------------
        // IMPORTANT:
        // First read Discount total
        // ----------------------------------------------------

        loadWoodTotal();


        // ----------------------------------------------------
        // Load previously saved Labour data
        // ----------------------------------------------------

        loadLabourData();


        // ----------------------------------------------------
        // Recalculate
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
            finalTotal
        );

        console.log(
            "=========================================="
        );

    }
);
