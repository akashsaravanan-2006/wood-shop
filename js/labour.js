// ============================================================
// LABOUR.JS
// ============================================================

console.log("LABOUR.JS LOADED");


// ============================================================
// ELEMENTS
// ============================================================

const woodTotalElement = document.getElementById("woodTotal");
const labourChargeInput = document.getElementById("labourCharge");
const otherChargeInput = document.getElementById("otherCharge");

const othersTotalElement = document.getElementById("othersTotal");
const grandTotalElement = document.getElementById("grandTotal");

const addOtherBtn = document.getElementById("addOtherBtn");
const othersContainer = document.getElementById("othersContainer");

const confirmBtn = document.getElementById("confirmBtn");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");


// ============================================================
// VARIABLES
// ============================================================

let woodTotal = 0;
let labourCharge = 0;
let otherCharge = 0;

let otherItems = [];

let othersTotal = 0;
let grandTotal = 0;


// ============================================================
// NUMBER HELPER
// ============================================================

function toNumber(value) {

    const n = parseFloat(value);

    return Number.isFinite(n) ? n : 0;

}


// ============================================================
// ROUND MONEY
// ============================================================

function roundMoney(value) {

    return Math.round(
        (toNumber(value) + Number.EPSILON) * 100
    ) / 100;

}


// ============================================================
// DISPLAY MONEY
// ============================================================

function money(value) {

    return "₹ " + roundMoney(value).toFixed(2);

}


// ============================================================
// GET WOOD TOTAL
// ============================================================

function getWoodTotal() {

    const possibleKeys = [

        "woodFinalTotal",
        "woodTotal",
        "woodGrandTotal"

    ];


    for (const key of possibleKeys) {

        const value =
            localStorage.getItem(key);


        if (
            value !== null &&
            value !== ""
        ) {

            const amount =
                roundMoney(value);


            if (amount > 0) {

                console.log(
                    "WOOD TOTAL FOUND:",
                    key,
                    amount
                );


                return amount;

            }

        }

    }


    // --------------------------------------------------------
    // Try woodData
    // --------------------------------------------------------

    const woodData =
        localStorage.getItem("woodData");


    if (woodData) {

        try {

            const data =
                JSON.parse(woodData);


            const possibleValues = [

                data.grandTotal,
                data.finalTotal,
                data.totalAmount,
                data.woodTotal

            ];


            for (
                const value of possibleValues
            ) {

                const amount =
                    roundMoney(value);


                if (amount > 0) {

                    console.log(
                        "WOOD TOTAL FOUND IN woodData:",
                        amount
                    );


                    return amount;

                }

            }

        }
        catch (error) {

            console.error(
                "woodData JSON ERROR:",
                error
            );

        }

    }


    console.warn(
        "Wood total not found. Using 0."
    );


    return 0;

}


// ============================================================
// SHOW WOOD TOTAL
// ============================================================

function updateWoodTotal() {

    woodTotalElement.textContent =
        money(woodTotal);

}


// ============================================================
// CALCULATE OTHERS TOTAL
//
// IMPORTANT:
//
// Other Charge
// +
// Other 1
// +
// Other 2
// +
// Other 3
//
// = Others Total
// ============================================================

function calculateOthersTotal() {

    // Main Other Charge

    const mainOther =
        roundMoney(
            otherChargeInput.value
        );


    // Additional Other items

    let additionalTotal = 0;


    otherItems.forEach(
        function (item) {

            additionalTotal +=
                roundMoney(item);

        }
    );


    // Final Others Total

    othersTotal =
        roundMoney(
            mainOther +
            additionalTotal
        );


    // UPDATE SCREEN

    othersTotalElement.textContent =
        money(othersTotal);


    console.log(
        "MAIN OTHER:",
        mainOther
    );


    console.log(
        "ADDITIONAL OTHERS:",
        additionalTotal
    );


    console.log(
        "OTHERS TOTAL:",
        othersTotal
    );


    return othersTotal;

}


// ============================================================
// CALCULATE GRAND TOTAL
//
// Wood Total
// +
// Labour Charge
// +
// Others Total
// ============================================================

function calculateGrandTotal() {

    woodTotal =
        roundMoney(woodTotal);


    labourCharge =
        roundMoney(
            labourChargeInput.value
        );


    otherCharge =
        roundMoney(
            otherChargeInput.value
        );


    calculateOthersTotal();


    grandTotal =
        roundMoney(
            woodTotal +
            labourCharge +
            othersTotal
        );


    grandTotalElement.textContent =
        money(grandTotal);


    console.log("--------------------------------");

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

    console.log("--------------------------------");


    return grandTotal;

}


// ============================================================
// RENDER OTHER ITEMS
// ============================================================

function renderOtherItems() {

    othersContainer.innerHTML = "";


    otherItems.forEach(
        function (amount, index) {

            const row =
                document.createElement("div");


            row.className =
                "other-item";


            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.justifyContent = "space-between";
            row.style.marginTop = "10px";
            row.style.padding = "10px";
            row.style.border = "1px solid #ddd";
            row.style.borderRadius = "6px";


            row.innerHTML = `

                <span>
                    Other ${index + 1}
                </span>

                <strong>
                    ${money(amount)}
                </strong>

                <button
                    type="button"
                    class="removeOtherBtn"
                    data-index="${index}">

                    Remove

                </button>

            `;


            othersContainer.appendChild(row);

        }
    );


    // Remove buttons

    const removeButtons =
        document.querySelectorAll(
            ".removeOtherBtn"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    otherItems.splice(
                        index,
                        1
                    );


                    renderOtherItems();

                    calculateGrandTotal();

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
            otherChargeInput.value
        );


    if (value <= 0) {

        alert(
            "Please enter Other Charge."
        );

        otherChargeInput.focus();

        return;

    }


    // Add to array

    otherItems.push(value);


    console.log(
        "OTHER ADDED:",
        value
    );


    // Clear input

    otherChargeInput.value = "";


    // Render

    renderOtherItems();


    // Calculate

    calculateGrandTotal();

}


// ============================================================
// LABOUR INPUT
// ============================================================

labourChargeInput.addEventListener(
    "input",
    function () {

        calculateGrandTotal();

    }
);


// ============================================================
// OTHER INPUT
//
// This is important.
//
// When user types Other Charge,
// Others Total and Grand Total update.
// ============================================================

otherChargeInput.addEventListener(
    "input",
    function () {

        calculateGrandTotal();

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
// SAVE DATA
// ============================================================

function saveLabourData() {

    calculateGrandTotal();


    const data = {

        woodTotal:
            roundMoney(woodTotal),

        labourCharge:
            roundMoney(labourCharge),

        otherCharge:
            roundMoney(otherCharge),

        otherItems:
            otherItems.map(
                function (value) {

                    return roundMoney(value);

                }
            ),

        othersTotal:
            roundMoney(othersTotal),

        grandTotal:
            roundMoney(grandTotal)

    };


    // --------------------------------------------------------
    // Main Labour data
    // --------------------------------------------------------

    localStorage.setItem(
        "labourData",
        JSON.stringify(data)
    );


    // --------------------------------------------------------
    // THIS IS THE VALUE DISCOUNT SHOULD READ
    // --------------------------------------------------------

    localStorage.setItem(
        "labourFinalTotal",
        roundMoney(grandTotal).toFixed(2)
    );


    // Also save a separate immutable base for this stage.

    localStorage.setItem(
        "labourBaseTotal",
        roundMoney(grandTotal).toFixed(2)
    );


    console.log(
        "LABOUR DATA SAVED:",
        data
    );


    console.log(
        "LABOUR FINAL TOTAL:",
        grandTotal
    );

}


// ============================================================
// LOAD PREVIOUS LABOUR DATA
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
                data.otherItems
            )
        ) {

            otherItems =
                data.otherItems.map(
                    function (value) {

                        return roundMoney(value);

                    }
                );

        }


        renderOtherItems();


        console.log(
            "LABOUR DATA RESTORED:",
            data
        );

    }
    catch (error) {

        console.error(
            "LABOUR DATA LOAD ERROR:",
            error
        );

    }

}


// ============================================================
// CONFIRM BUTTON
// ============================================================

confirmBtn.addEventListener(
    "click",
    function (event) {

        event.preventDefault();


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
    function (event) {

        event.preventDefault();


        console.log(
            "LABOUR → PERSONAL"
        );


        calculateGrandTotal();

        saveLabourData();


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
        "LABOUR PAGE INITIALIZING"
    );


    // Get Wood total.

    woodTotal =
        getWoodTotal();


    // Show Wood total.

    updateWoodTotal();


    // Load previous Labour data.

    loadLabourData();


    // Calculate everything.

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
