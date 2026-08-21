// ============================================================
// LABOUR.JS
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
//
// Labour is the BASE TOTAL for the next stage.
// Discount and Advance must NOT modify this Labour base.
// ============================================================


console.log("======================================");
console.log("LABOUR.JS LOADED");
console.log("======================================");


// ============================================================
// GET ELEMENTS
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

const backBtn =
    document.getElementById("backBtn");

const nextBtn =
    document.getElementById("nextBtn");


// ============================================================
// CHECK HTML ELEMENTS
// ============================================================

console.log(
    "HTML ELEMENT CHECK"
);

console.log(
    "woodTotal:",
    !!woodTotalElement
);

console.log(
    "labourCharge:",
    !!labourChargeInput
);

console.log(
    "otherCharge:",
    !!otherChargeInput
);

console.log(
    "othersContainer:",
    !!othersContainer
);

console.log(
    "othersTotal:",
    !!othersTotalElement
);

console.log(
    "grandTotal:",
    !!grandTotalElement
);

console.log(
    "addOtherBtn:",
    !!addOtherBtn
);

console.log(
    "confirmBtn:",
    !!confirmBtn
);

console.log(
    "backBtn:",
    !!backBtn
);

console.log(
    "nextBtn:",
    !!nextBtn
);


// ============================================================
// VARIABLES
// ============================================================

let woodTotal = 0;

let labourCharge = 0;

let mainOtherCharge = 0;

let otherItems = [];

let othersTotal = 0;

let grandTotal = 0;


// ============================================================
// NUMBER FUNCTION
// ============================================================

function number(value) {

    const result =
        parseFloat(value);

    if (
        Number.isFinite(result)
    ) {

        return result;

    }

    return 0;

}


// ============================================================
// ROUND MONEY
// ============================================================

function moneyNumber(value) {

    return Math.round(
        (
            number(value) +
            Number.EPSILON
        ) * 100
    ) / 100;

}


// ============================================================
// FORMAT MONEY
// ============================================================

function money(value) {

    return (
        "₹ " +
        moneyNumber(value).toFixed(2)
    );

}


// ============================================================
// GET WOOD TOTAL
//
// We check several possible keys because
// your Wood page may already be saving
// the total under one of these names.
// ============================================================

function getWoodTotal() {

    console.log(
        "Searching Wood Total..."
    );


    // --------------------------------------------------------
    // Direct keys
    // --------------------------------------------------------

    const keys = [

        "woodFinalTotal",

        "woodTotal",

        "woodGrandTotal",

        "grandTotal",

        "finalTotal"

    ];


    for (
        const key of keys
    ) {

        const saved =
            localStorage.getItem(key);


        if (
            saved !== null &&
            saved !== ""
        ) {

            const value =
                moneyNumber(saved);


            if (value > 0) {

                console.log(
                    "WOOD TOTAL FOUND:",
                    key,
                    value
                );


                return value;

            }

        }

    }


    // --------------------------------------------------------
    // Try woodData
    // --------------------------------------------------------

    const woodDataString =
        localStorage.getItem(
            "woodData"
        );


    if (woodDataString) {

        try {

            const woodData =
                JSON.parse(
                    woodDataString
                );


            console.log(
                "WOOD DATA:",
                woodData
            );


            const values = [

                woodData.grandTotal,

                woodData.finalTotal,

                woodData.totalAmount,

                woodData.woodTotal,

                woodData.amount

            ];


            for (
                const item of values
            ) {

                const value =
                    moneyNumber(item);


                if (value > 0) {

                    console.log(
                        "WOOD TOTAL FOUND IN woodData:",
                        value
                    );


                    return value;

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
        "WOOD TOTAL NOT FOUND"
    );


    return 0;

}


// ============================================================
// UPDATE WOOD DISPLAY
// ============================================================

function updateWoodDisplay() {

    woodTotalElement.textContent =
        money(woodTotal);

}


// ============================================================
// CALCULATE OTHERS TOTAL
//
// Main Other Charge
// +
// Additional Other Items
//
// = Others Total
// ============================================================

function calculateOthersTotal() {

    mainOtherCharge =
        moneyNumber(
            otherChargeInput.value
        );


    let additionalTotal = 0;


    otherItems.forEach(
        function (item) {

            additionalTotal +=
                moneyNumber(item);

        }
    );


    othersTotal =
        moneyNumber(
            mainOtherCharge +
            additionalTotal
        );


    // IMPORTANT:
    // Update Others Total on screen.

    othersTotalElement.textContent =
        money(othersTotal);


    console.log(
        "MAIN OTHER:",
        mainOtherCharge
    );


    console.log(
        "ADDITIONAL OTHER TOTAL:",
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
// Wood
// +
// Labour
// +
// Others
// ============================================================

function calculateGrandTotal() {

    woodTotal =
        moneyNumber(
            woodTotal
        );


    labourCharge =
        moneyNumber(
            labourChargeInput.value
        );


    calculateOthersTotal();


    grandTotal =
        moneyNumber(
            woodTotal +
            labourCharge +
            othersTotal
        );


    // Update display

    grandTotalElement.textContent =
        money(grandTotal);


    console.log("--------------------------------");

    console.log(
        "LABOUR CALCULATION"
    );

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
// RENDER ADDITIONAL OTHER ITEMS
// ============================================================

function renderOtherItems() {

    othersContainer.innerHTML = "";


    otherItems.forEach(
        function (amount, index) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "other-item";


            item.innerHTML = `

                <span
                    class="other-item-name">

                    Other ${index + 1}

                </span>

                <span
                    class="other-item-value">

                    ${money(amount)}

                </span>

                <button
                    type="button"
                    class="remove-other-btn"
                    data-index="${index}">

                    Remove

                </button>

            `;


            othersContainer.appendChild(
                item
            );

        }
    );


    // --------------------------------------------------------
    // REMOVE BUTTONS
    // --------------------------------------------------------

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

                        otherItems.splice(
                            index,
                            1
                        );

                    }


                    renderOtherItems();

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

    const amount =
        moneyNumber(
            otherChargeInput.value
        );


    if (amount <= 0) {

        alert(
            "Please enter a valid Other Charge."
        );


        otherChargeInput.focus();

        return;

    }


    console.log(
        "ADDING OTHER:",
        amount
    );


    otherItems.push(
        amount
    );


    // Clear input

    otherChargeInput.value = "";


    renderOtherItems();

    calculateGrandTotal();

    saveLabourData();

}


// ============================================================
// SAVE LABOUR DATA
//
// IMPORTANT:
//
// labourFinalTotal is the amount sent
// to Personal / Discount.
//
// This is the ORIGINAL LABOUR STAGE TOTAL.
//
// Discount must NOT overwrite this value
// until the next stage intentionally creates
// its own value.
// ============================================================

function saveLabourData() {

    calculateGrandTotal();


    const data = {

        woodTotal:
            moneyNumber(
                woodTotal
            ),

        labourCharge:
            moneyNumber(
                labourCharge
            ),

        mainOtherCharge:
            moneyNumber(
                mainOtherCharge
            ),

        otherItems:
            otherItems.map(
                function (value) {

                    return moneyNumber(
                        value
                    );

                }
            ),

        othersTotal:
            moneyNumber(
                othersTotal
            ),

        grandTotal:
            moneyNumber(
                grandTotal
            )

    };


    // --------------------------------------------------------
    // Save complete Labour object
    // --------------------------------------------------------

    localStorage.setItem(
        "labourData",
        JSON.stringify(data)
    );


    // --------------------------------------------------------
    // Save source total for Discount
    // --------------------------------------------------------

    localStorage.setItem(
        "labourFinalTotal",
        grandTotal.toFixed(2)
    );


    // --------------------------------------------------------
    // Keep separate base value
    // --------------------------------------------------------

    localStorage.setItem(
        "labourBaseTotal",
        grandTotal.toFixed(2)
    );


    console.log(
        "LABOUR DATA SAVED:",
        data
    );


    console.log(
        "LABOUR FINAL TOTAL SAVED:",
        grandTotal
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
            "No previous Labour data."
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

            labourChargeInput.value =
                data.labourCharge;

        }


        // Main Other

        if (
            data.mainOtherCharge !== undefined
        ) {

            otherChargeInput.value =
                data.mainOtherCharge;

        }


        // Backward compatibility
        // if old data uses otherCharge

        else if (
            data.otherCharge !== undefined
        ) {

            otherChargeInput.value =
                data.otherCharge;

        }


        // Additional Others

        if (
            Array.isArray(
                data.otherItems
            )
        ) {

            otherItems =
                data.otherItems.map(
                    function (value) {

                        return moneyNumber(
                            value
                        );

                    }
                );

        }


        renderOtherItems();


    }
    catch (error) {

        console.error(
            "LABOUR DATA LOAD ERROR:",
            error
        );

    }

}


// ============================================================
// LABOUR INPUT
// ============================================================

labourChargeInput.addEventListener(
    "input",
    function () {

        calculateGrandTotal();

        saveLabourData();

    }
);


// ============================================================
// OTHER INPUT
// ============================================================

otherChargeInput.addEventListener(
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

function initializeLabourPage() {

    console.log(
        "======================================"
    );

    console.log(
        "LABOUR PAGE INITIALIZING"
    );

    console.log(
        "======================================"
    );


    // --------------------------------------------------------
    // Get Wood Total
    // --------------------------------------------------------

    woodTotal =
        getWoodTotal();


    // --------------------------------------------------------
    // Show Wood Total
    // --------------------------------------------------------

    updateWoodDisplay();


    // --------------------------------------------------------
    // Load Labour data
    // --------------------------------------------------------

    loadLabourData();


    // --------------------------------------------------------
    // Render Others
    // --------------------------------------------------------

    renderOtherItems();


    // --------------------------------------------------------
    // Calculate
    // --------------------------------------------------------

    calculateGrandTotal();


    console.log(
        "======================================"
    );

    console.log(
        "LABOUR PAGE READY"
    );

    console.log(
        "======================================"
    );

}


// ============================================================
// START AFTER PAGE LOAD
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeLabourPage
    );

}
else {

    initializeLabourPage();

}
