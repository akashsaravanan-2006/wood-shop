// ============================================================
// LABOUR.JS
// FLOW:
// WOOD → LABOUR → PERSONAL → DISCOUNT → ADVANCE → BILL
// ============================================================

console.log("LABOUR.JS LOADED");


// ============================================================
// ELEMENTS
// ============================================================

const woodTotalEl = document.getElementById("woodTotal");
const labourChargeEl = document.getElementById("labourCharge");
const otherChargeEl = document.getElementById("otherCharge");
const othersContainerEl = document.getElementById("othersContainer");
const othersTotalEl = document.getElementById("othersTotal");
const grandTotalEl = document.getElementById("grandTotal");

const addOtherBtn = document.getElementById("addOtherBtn");
const confirmBtn = document.getElementById("confirmBtn");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");


// ============================================================
// DATA
// ============================================================

let woodTotal = 0;
let labourCharge = 0;
let otherCharge = 0;
let additionalOthers = [];


// ============================================================
// NUMBER
// ============================================================

function getNumber(value) {

    const n = parseFloat(value);

    return Number.isFinite(n) ? n : 0;

}


// ============================================================
// MONEY
// ============================================================

function roundMoney(value) {

    return Math.round(
        (getNumber(value) + Number.EPSILON) * 100
    ) / 100;

}


function formatMoney(value) {

    return "₹ " + roundMoney(value).toFixed(2);

}


// ============================================================
// GET WOOD TOTAL
// ============================================================

function loadWoodTotal() {

    let value = 0;


    // --------------------------------------------------------
    // First: woodData
    // --------------------------------------------------------

    const woodDataText =
        localStorage.getItem("woodData");


    if (woodDataText) {

        try {

            const woodData =
                JSON.parse(woodDataText);


            console.log(
                "WOOD DATA:",
                woodData
            );


            value =
                getNumber(woodData.grandTotal);


            if (value === 0) {

                value =
                    getNumber(woodData.finalTotal);

            }


            if (value === 0) {

                value =
                    getNumber(woodData.totalAmount);

            }


            if (value === 0) {

                value =
                    getNumber(woodData.amount);

            }

        }
        catch (error) {

            console.error(
                "WOOD DATA ERROR:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // Other possible saved keys
    // --------------------------------------------------------

    if (value === 0) {

        const possibleKeys = [

            "woodFinalTotal",
            "woodTotal",
            "woodGrandTotal"

        ];


        for (
            const key of possibleKeys
        ) {

            const saved =
                localStorage.getItem(key);


            if (
                saved !== null &&
                saved !== ""
            ) {

                const numberValue =
                    getNumber(saved);


                if (numberValue > 0) {

                    value =
                        numberValue;

                    break;

                }

            }

        }

    }


    woodTotal =
        roundMoney(value);


    console.log(
        "WOOD TOTAL:",
        woodTotal
    );


    if (woodTotalEl) {

        woodTotalEl.textContent =
            formatMoney(woodTotal);

    }

}


// ============================================================
// CALCULATE OTHERS TOTAL
//
// Other Charge
// +
// Additional Others
// =
// Others Total
// ============================================================

function calculateOthersTotal() {

    // Main Other Charge

    otherCharge =
        roundMoney(
            getNumber(
                otherChargeEl.value
            )
        );


    // Additional Others

    let additionalTotal = 0;


    additionalOthers.forEach(
        function (value) {

            additionalTotal +=
                getNumber(value);

        }
    );


    additionalTotal =
        roundMoney(
            additionalTotal
        );


    // FINAL OTHERS TOTAL

    const othersTotal =
        roundMoney(
            otherCharge +
            additionalTotal
        );


    // --------------------------------------------------------
    // THIS IS THE IMPORTANT FIX
    // --------------------------------------------------------

    if (othersTotalEl) {

        othersTotalEl.textContent =
            formatMoney(othersTotal);

    }


    console.log(
        "================================"
    );

    console.log(
        "OTHER CALCULATION"
    );

    console.log(
        "OTHER CHARGE:",
        otherCharge
    );

    console.log(
        "ADDITIONAL OTHERS:",
        additionalTotal
    );

    console.log(
        "OTHERS TOTAL:",
        othersTotal
    );

    console.log(
        "================================"
    );


    return othersTotal;

}


// ============================================================
// CALCULATE GRAND TOTAL
// ============================================================

function calculateGrandTotal() {

    labourCharge =
        roundMoney(
            getNumber(
                labourChargeEl.value
            )
        );


    const othersTotal =
        calculateOthersTotal();


    const grandTotal =
        roundMoney(
            woodTotal +
            labourCharge +
            othersTotal
        );


    if (grandTotalEl) {

        grandTotalEl.textContent =
            formatMoney(grandTotal);

    }


    console.log(
        "================================"
    );

    console.log(
        "GRAND TOTAL CALCULATION"
    );

    console.log(
        "WOOD TOTAL:",
        woodTotal
    );

    console.log(
        "LABOUR:",
        labourCharge
    );

    console.log(
        "OTHERS:",
        othersTotal
    );

    console.log(
        "GRAND TOTAL:",
        grandTotal
    );

    console.log(
        "================================"
    );


    return grandTotal;

}


// ============================================================
// SAVE LABOUR DATA
// ============================================================

function saveLabourData() {

    const othersTotal =
        calculateOthersTotal();


    const grandTotal =
        roundMoney(
            woodTotal +
            labourCharge +
            othersTotal
        );


    const data = {

        woodTotal:
            woodTotal,

        labourCharge:
            labourCharge,

        otherCharge:
            otherCharge,

        additionalOthers:
            additionalOthers,

        othersTotal:
            othersTotal,

        grandTotal:
            grandTotal

    };


    // Main Labour object

    localStorage.setItem(
        "labourData",
        JSON.stringify(data)
    );


    // Source value for Personal / Discount

    localStorage.setItem(
        "labourFinalTotal",
        grandTotal.toFixed(2)
    );


    // Separate base value

    localStorage.setItem(
        "labourBaseTotal",
        grandTotal.toFixed(2)
    );


    console.log(
        "LABOUR DATA SAVED:",
        data
    );

}


// ============================================================
// LOAD LABOUR DATA
// ============================================================

function loadLabourData() {

    const saved =
        localStorage.getItem(
            "labourData"
        );


    if (!saved) {

        console.log(
            "NO OLD LABOUR DATA"
        );

        return;

    }


    try {

        const data =
            JSON.parse(saved);


        console.log(
            "LOADED LABOUR DATA:",
            data
        );


        // Labour

        if (
            data.labourCharge !== undefined
        ) {

            labourChargeEl.value =
                data.labourCharge;

        }


        // Other Charge

        if (
            data.otherCharge !== undefined
        ) {

            otherChargeEl.value =
                data.otherCharge;

        }


        // Additional Others

        if (
            Array.isArray(
                data.additionalOthers
            )
        ) {

            additionalOthers =
                data.additionalOthers.map(
                    function (value) {

                        return roundMoney(
                            value
                        );

                    }
                );

        }


        renderAdditionalOthers();

    }
    catch (error) {

        console.error(
            "LABOUR DATA LOAD ERROR:",
            error
        );

    }

}


// ============================================================
// RENDER ADDITIONAL OTHERS
// ============================================================

function renderAdditionalOthers() {

    if (!othersContainerEl) {

        return;

    }


    othersContainerEl.innerHTML = "";


    additionalOthers.forEach(
        function (value, index) {

            const div =
                document.createElement("div");


            div.className =
                "other-item";


            div.innerHTML = `

                <span class="other-item-name">
                    Other ${index + 1}
                </span>

                <span class="other-item-value">
                    ${formatMoney(value)}
                </span>

                <button
                    type="button"
                    class="remove-other-btn"
                    data-index="${index}">
                    Remove
                </button>

            `;


            othersContainerEl.appendChild(
                div
            );

        }
    );


    // Remove buttons

    const removeButtons =
        document.querySelectorAll(
            ".remove-other-btn"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        parseInt(
                            button.dataset.index,
                            10
                        );


                    if (
                        !Number.isNaN(index)
                    ) {

                        additionalOthers.splice(
                            index,
                            1
                        );

                    }


                    renderAdditionalOthers();

                    calculateGrandTotal();

                    saveLabourData();

                }
            );

        }
    );

}


// ============================================================
// ADD OTHER
// ============================================================

function addOther() {

    const value =
        roundMoney(
            getNumber(
                otherChargeEl.value
            )
        );


    if (value <= 0) {

        alert(
            "Please enter Other Charge first."
        );

        otherChargeEl.focus();

        return;

    }


    additionalOthers.push(
        value
    );


    // Clear input

    otherChargeEl.value = "";


    renderAdditionalOthers();

    calculateGrandTotal();

    saveLabourData();

}


// ============================================================
// LABOUR INPUT
// ============================================================

labourChargeEl.addEventListener(
    "input",
    function () {

        calculateGrandTotal();

        saveLabourData();

    }
);


// ============================================================
// OTHER INPUT
//
// THIS WILL UPDATE OTHERS TOTAL IMMEDIATELY
// ============================================================

otherChargeEl.addEventListener(
    "input",
    function () {

        calculateGrandTotal();

        saveLabourData();

    }
);


// ============================================================
// ADD OTHER BUTTON
// ============================================================

addOtherBtn.addEventListener(
    "click",
    function () {

        addOther();

    }
);


// ============================================================
// CONFIRM
// ============================================================

confirmBtn.addEventListener(
    "click",
    function () {

        calculateGrandTotal();

        saveLabourData();


        alert(
            "Labour details saved successfully."
        );

    }
);


// ============================================================
// NEXT
//
// LABOUR → PERSONAL
// ============================================================

nextBtn.addEventListener(
    "click",
    function () {

        calculateGrandTotal();

        saveLabourData();


        console.log(
            "GOING TO PERSONAL PAGE"
        );


        window.location.href =
            "personal.html";

    }
);


// ============================================================
// BACK
//
// LABOUR → WOOD
// ============================================================

backBtn.addEventListener(
    "click",
    function () {

        calculateGrandTotal();

        saveLabourData();


        window.location.href =
            "wood.html";

    }
);


// ============================================================
// INITIALIZE
// ============================================================

function initialize() {

    console.log(
        "================================"
    );

    console.log(
        "LABOUR PAGE INITIALIZING"
    );

    console.log(
        "================================"
    );


    loadWoodTotal();

    loadLabourData();

    renderAdditionalOthers();

    calculateGrandTotal();


    console.log(
        "LABOUR PAGE READY"
    );

}


// ============================================================
// START
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

}
else {

    initialize();

}
