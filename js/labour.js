// ============================================================
// LABOUR.JS
// VERSION 500
//
// FLOW:
//
// WOOD
//   ↓
// LABOUR
//   ↓
// PERSONAL
//   ↓
// DISCOUNT
//   ↓
// ADVANCE
//   ↓
// BILL
//   ↓
// CBILL
//
// LABOUR TOTAL IS INDEPENDENT.
// DISCOUNT MUST NOT CHANGE LABOUR TOTAL.
// ============================================================

console.log("==========================================");
console.log("LABOUR.JS VERSION 500 LOADED");
console.log("==========================================");


// ============================================================
// ELEMENTS
// ============================================================

const woodTotalElement =
    document.getElementById("woodTotal");

const labourChargeInput =
    document.getElementById("labourCharge");

const otherChargeInput =
    document.getElementById("otherCharge");

const othersContainer =
    document.getElementById("othersContainer");

const othersTotalElement =
    document.getElementById("othersTotal");

const grandTotalElement =
    document.getElementById("grandTotal");

const addOtherBtn =
    document.getElementById("addOtherBtn");

const confirmBtn =
    document.getElementById("confirmBtn");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// VARIABLES
// ============================================================

let woodTotal = 0;

let labourCharge = 0;

let otherCharge = 0;

let additionalOthers = [];

let othersTotal = 0;

let grandTotal = 0;


// ============================================================
// NUMBER
// ============================================================

function number(value) {

    const n = parseFloat(value);

    if (Number.isFinite(n)) {

        return n;

    }

    return 0;

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
// DISPLAY MONEY
// ============================================================

function displayMoney(value) {

    return "₹ " + money(value).toFixed(2);

}


// ============================================================
// GET WOOD TOTAL
//
// Your existing Wood project may have used different keys.
// We check the common keys without changing them.
//
// IMPORTANT:
// We DO NOT read discount or advance values here.
// ============================================================

function getWoodTotal() {

    console.log("------------------------------------------");
    console.log("SEARCHING FOR WOOD TOTAL");


    // --------------------------------------------------------
    // KEY 1
    // --------------------------------------------------------

    let value =
        localStorage.getItem("woodFinalTotal");


    if (
        value !== null &&
        value !== ""
    ) {

        const result = money(value);

        console.log(
            "FOUND woodFinalTotal:",
            result
        );

        return result;

    }


    // --------------------------------------------------------
    // KEY 2
    // --------------------------------------------------------

    value =
        localStorage.getItem("woodTotal");


    if (
        value !== null &&
        value !== ""
    ) {

        const result = money(value);

        console.log(
            "FOUND woodTotal:",
            result
        );

        return result;

    }


    // --------------------------------------------------------
    // KEY 3
    // --------------------------------------------------------

    value =
        localStorage.getItem("woodGrandTotal");


    if (
        value !== null &&
        value !== ""
    ) {

        const result = money(value);

        console.log(
            "FOUND woodGrandTotal:",
            result
        );

        return result;

    }


    // --------------------------------------------------------
    // KEY 4
    // --------------------------------------------------------

    value =
        localStorage.getItem("grandTotal");


    if (
        value !== null &&
        value !== ""
    ) {

        const result = money(value);

        console.log(
            "FOUND grandTotal:",
            result
        );

        return result;

    }


    // --------------------------------------------------------
    // KEY 5
    // labour-compatible old data
    // --------------------------------------------------------

    const labourData =
        localStorage.getItem("labourData");


    if (labourData) {

        try {

            const data =
                JSON.parse(labourData);


            if (
                data.woodTotal !== undefined
            ) {

                const result =
                    money(data.woodTotal);


                console.log(
                    "FOUND woodTotal INSIDE labourData:",
                    result
                );


                return result;

            }

        }
        catch (error) {

            console.error(
                "labourData JSON ERROR:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // NOTHING FOUND
    // --------------------------------------------------------

    console.error(
        "=========================================="
    );

    console.error(
        "WOOD TOTAL NOT FOUND"
    );

    console.error(
        "Check Wood page localStorage."
    );

    console.error(
        "=========================================="
    );


    return 0;

}


// ============================================================
// DISPLAY WOOD TOTAL
// ============================================================

function showWoodTotal() {

    woodTotalElement.textContent =
        displayMoney(woodTotal);

}


// ============================================================
// CALCULATE OTHERS
//
// Other Total:
//
// Other Charge
// +
// Additional Others
// ============================================================

function calculateOthers() {

    otherCharge =
        money(
            otherChargeInput.value
        );


    let additionalTotal = 0;


    additionalOthers.forEach(
        function (item) {

            additionalTotal +=
                money(item.amount);

        }
    );


    othersTotal =
        money(
            otherCharge +
            additionalTotal
        );


    othersTotalElement.textContent =
        displayMoney(othersTotal);


    console.log(
        "OTHERS TOTAL:",
        othersTotal
    );

}


// ============================================================
// CALCULATE GRAND TOTAL
//
// Wood + Labour + Others
// ============================================================

function calculateTotal() {

    labourCharge =
        money(
            labourChargeInput.value
        );


    calculateOthers();


    grandTotal =
        money(
            woodTotal +
            labourCharge +
            othersTotal
        );


    grandTotalElement.textContent =
        displayMoney(grandTotal);


    console.log("------------------------------------------");
    console.log("LABOUR CALCULATION");

    console.log(
        "WOOD TOTAL:",
        woodTotal
    );

    console.log(
        "LABOUR CHARGE:",
        labourCharge
    );

    console.log(
        "OTHERS TOTAL:",
        othersTotal
    );

    console.log(
        "GRAND TOTAL:",
        grandTotal
    );

    console.log("------------------------------------------");

}


// ============================================================
// SAVE LABOUR DATA
//
// IMPORTANT:
//
// labourFinalTotal is separate from woodFinalTotal.
// Discount will use labourFinalTotal.
//
// Discount must NEVER overwrite it.
// ============================================================

function saveLabourData() {

    const data = {

        woodTotal: money(woodTotal),

        labourCharge:
            money(labourCharge),

        otherCharge:
            money(otherCharge),

        additionalOthers:
            additionalOthers,

        othersTotal:
            money(othersTotal),

        grandTotal:
            money(grandTotal),

        savedAt:
            new Date().toISOString()

    };


    // Save complete Labour page data.

    localStorage.setItem(
        "labourData",
        JSON.stringify(data)
    );


    // Save Labour final total separately.

    localStorage.setItem(
        "labourFinalTotal",
        money(grandTotal).toFixed(2)
    );


    console.log("==========================================");
    console.log("LABOUR DATA SAVED");
    console.log(data);

    console.log(
        "labourFinalTotal =",
        localStorage.getItem(
            "labourFinalTotal"
        )
    );

    console.log("==========================================");

}


// ============================================================
// LOAD LABOUR DATA
//
// When coming back to Labour, restore:
//
// Labour Charge
// Other Charge
// Additional Others
//
// DO NOT load Discount total.
// ============================================================

function loadLabourData() {

    const saved =
        localStorage.getItem(
            "labourData"
        );


    if (!saved) {

        console.log(
            "NO PREVIOUS LABOUR DATA"
        );

        return;

    }


    try {

        const data =
            JSON.parse(saved);


        console.log(
            "RESTORING LABOUR DATA:",
            data
        );


        if (
            data.labourCharge !== undefined
        ) {

            labourChargeInput.value =
                data.labourCharge;

        }


        if (
            data.otherCharge !== undefined
        ) {

            otherChargeInput.value =
                data.otherCharge;

        }


        if (
            Array.isArray(
                data.additionalOthers
            )
        ) {

            additionalOthers =
                data.additionalOthers;

        }

    }
    catch (error) {

        console.error(
            "ERROR LOADING LABOUR DATA:",
            error
        );

    }

}


// ============================================================
// RENDER ADDITIONAL OTHERS
// ============================================================

function renderOthers() {

    othersContainer.innerHTML = "";


    additionalOthers.forEach(
        function (item, index) {

            const row =
                document.createElement("div");


            row.className =
                "other-item";


            row.innerHTML = `

                <span>
                    Other ${index + 1}
                </span>

                <strong>
                    ${displayMoney(item.amount)}
                </strong>

                <button
                    type="button"
                    class="removeOther"
                    data-index="${index}">

                    Remove

                </button>

            `;


            othersContainer.appendChild(row);

        }
    );


    document
        .querySelectorAll(".removeOther")
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            parseInt(
                                button.dataset.index
                            );


                        additionalOthers.splice(
                            index,
                            1
                        );


                        renderOthers();

                        calculateTotal();

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
        money(
            otherChargeInput.value
        );


    if (value <= 0) {

        alert(
            "Please enter Other Charge."
        );

        return;

    }


    additionalOthers.push({

        amount: value

    });


    console.log(
        "ADDITIONAL OTHER ADDED:",
        value
    );


    // Clear input after adding.

    otherChargeInput.value = "";


    renderOthers();

    calculateTotal();

}


// ============================================================
// LABOUR INPUT
// ============================================================

labourChargeInput.addEventListener(
    "input",
    function () {

        calculateTotal();

    }
);


// ============================================================
// OTHER INPUT
// ============================================================

otherChargeInput.addEventListener(
    "input",
    function () {

        calculateTotal();

    }
);


// ============================================================
// ADD OTHER BUTTON
// ============================================================

addOtherBtn.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        addOther();

    }
);


// ============================================================
// CONFIRM
// ============================================================

confirmBtn.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        calculateTotal();

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
    function (event) {

        event.preventDefault();


        console.log("==========================================");
        console.log("LABOUR NEXT CLICKED");
        console.log("==========================================");


        // Recalculate.

        calculateTotal();


        // Save Labour total.

        saveLabourData();


        console.log(
            "LABOUR TOTAL BEFORE PERSONAL:",
            grandTotal
        );


        // IMPORTANT:
        // Do NOT send grandTotal through URL.
        // It is already stored in localStorage.


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
    function (event) {

        event.preventDefault();


        calculateTotal();

        saveLabourData();


        window.location.href =
            "wood.html";

    }
);


// ============================================================
// INITIALIZE
// ============================================================

function initializeLabour() {

    console.log("==========================================");
    console.log("LABOUR PAGE INITIALIZING");
    console.log("==========================================");


    // Get Wood total ONLY.

    woodTotal =
        getWoodTotal();


    console.log(
        "WOOD TOTAL:",
        woodTotal
    );


    // Display Wood total.

    showWoodTotal();


    // Restore Labour data.

    loadLabourData();


    // Render additional others.

    renderOthers();


    // Calculate Labour total.

    calculateTotal();


    console.log("==========================================");
    console.log("LABOUR PAGE READY");
    console.log("==========================================");

}


// ============================================================
// START
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeLabour
    );

}
else {

    initializeLabour();

}
