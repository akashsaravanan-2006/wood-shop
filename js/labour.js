// ============================================================
// LABOUR.JS
// ============================================================
// Labour + Other Charges
//
// CALCULATION:
//
// Others Total =
//     Labour Charge
//   + Other Charge
//   + Additional Other Items
//
// Grand Total =
//     Wood Total
//   + Others Total
//
// IMPORTANT:
// - Wood Total is never modified here.
// - Labour is NOT added twice.
// - storedata.js is NOT changed.
// ============================================================


console.log("LABOUR.JS LOADED");


// ============================================================
// ELEMENTS
// ============================================================

const woodTotalElement =
    document.getElementById("woodTotal");

const labourChargeInput =
    document.getElementById("labourCharge");

const otherChargeInput =
    document.getElementById("otherCharge");

const othersTotalElement =
    document.getElementById("othersTotal");

const grandTotalElement =
    document.getElementById("grandTotal");

const addOtherBtn =
    document.getElementById("addOtherBtn");

const addOtherForm =
    document.getElementById("addOtherForm");

const otherReasonInput =
    document.getElementById("otherReason");

const otherAmountInput =
    document.getElementById("otherAmount");

const saveOtherBtn =
    document.getElementById("saveOtherBtn");

const cancelOtherBtn =
    document.getElementById("cancelOtherBtn");

const othersContainer =
    document.getElementById("othersContainer");

const confirmBtn =
    document.getElementById("confirmBtn");

const backBtn =
    document.getElementById("backBtn");

const nextBtn =
    document.getElementById("nextBtn");


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

    const number =
        parseFloat(value);

    if (
        Number.isFinite(number)
    ) {

        return number;

    }

    return 0;

}


// ============================================================
// ROUND MONEY
// ============================================================

function roundMoney(value) {

    return Math.round(
        (
            toNumber(value) +
            Number.EPSILON
        ) * 100
    ) / 100;

}


// ============================================================
// MONEY FORMAT
// ============================================================

function money(value) {

    return (
        "₹ " +
        roundMoney(value).toFixed(2)
    );

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
// GET WOOD TOTAL
// ============================================================
//
// IMPORTANT:
// We ONLY READ the Wood Total.
// We never change it.
//
// ============================================================

function getWoodTotal() {

    // --------------------------------------------------------
    // FIRST: DIRECT WOOD TOTAL
    // --------------------------------------------------------

    const possibleKeys = [

        "woodFinalTotal",

        "woodTotal",

        "woodGrandTotal"

    ];


    for (
        const key of possibleKeys
    ) {

        const savedValue =
            localStorage.getItem(key);


        if (
            savedValue !== null &&
            savedValue !== ""
        ) {

            const amount =
                roundMoney(
                    savedValue
                );


            if (
                amount > 0
            ) {

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
    // SECOND: woodData
    // --------------------------------------------------------

    const savedWoodData =
        localStorage.getItem(
            "woodData"
        );


    if (
        savedWoodData
    ) {

        try {

            const data =
                JSON.parse(
                    savedWoodData
                );


            if (
                data &&
                typeof data === "object"
            ) {

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


                    if (
                        amount > 0
                    ) {

                        console.log(
                            "WOOD TOTAL FOUND IN woodData:",
                            amount
                        );

                        return amount;

                    }

                }

            }

        }
        catch (error) {

            console.error(
                "WOOD DATA ERROR:",
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
// DISPLAY WOOD TOTAL
// ============================================================

function updateWoodTotal() {

    if (
        woodTotalElement
    ) {

        woodTotalElement.textContent =
            money(woodTotal);

    }

}


// ============================================================
// CALCULATE OTHERS TOTAL
// ============================================================
//
// Others Total:
//
// Labour Charge
// + Other Charge
// + Added Other Items
//
// ============================================================

function calculateOthersTotal() {

    // --------------------------------------------------------
    // LABOUR
    // --------------------------------------------------------

    const labour =
        roundMoney(
            labourChargeInput.value
        );


    // --------------------------------------------------------
    // MAIN OTHER CHARGE
    // --------------------------------------------------------

    const mainOther =
        roundMoney(
            otherChargeInput.value
        );


    // --------------------------------------------------------
    // ADDITIONAL OTHER ITEMS
    // --------------------------------------------------------

    let additionalTotal = 0;


    otherItems.forEach(
        function (item) {

            if (
                item &&
                typeof item === "object"
            ) {

                additionalTotal +=
                    roundMoney(
                        item.amount
                    );

            }

        }
    );


    // --------------------------------------------------------
    // FINAL OTHERS TOTAL
    // --------------------------------------------------------

    othersTotal =
        roundMoney(
            labour +
            mainOther +
            additionalTotal
        );


    // --------------------------------------------------------
    // DISPLAY
    // --------------------------------------------------------

    if (
        othersTotalElement
    ) {

        othersTotalElement.textContent =
            money(othersTotal);

    }


    console.log(
        "LABOUR:",
        labour
    );

    console.log(
        "MAIN OTHER:",
        mainOther
    );

    console.log(
        "ADDITIONAL OTHER:",
        additionalTotal
    );

    console.log(
        "OTHERS TOTAL:",
        othersTotal
    );


    return othersTotal;

}


function calculateGrandTotal() {

    const currentWoodTotal =
        roundMoney(woodTotal);

    labourCharge =
        roundMoney(
            labourChargeInput.value
        );

    otherCharge =
        roundMoney(
            otherChargeInput.value
        );

    const currentOthersTotal =
        calculateOthersTotal();

    // IMPORTANT:
    // Labour is already inside Others Total.
    // Do NOT add labourCharge again.

    grandTotal =
        roundMoney(
            currentWoodTotal +
            currentOthersTotal
        );

    grandTotalElement.textContent =
        money(grandTotal);

    console.log(
        "WOOD TOTAL:",
        currentWoodTotal
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
        "OTHERS TOTAL:",
        currentOthersTotal
    );

    console.log(
        "GRAND TOTAL:",
        grandTotal
    );

    return grandTotal;
}
// ============================================================
// SHOW ADD OTHER FORM
// ============================================================

function showAddOtherForm() {

    if (
        !addOtherForm
    ) {

        return;

    }


    addOtherForm.style.display =
        "block";


    if (
        otherReasonInput
    ) {

        otherReasonInput.focus();

    }

}


// ============================================================
// HIDE ADD OTHER FORM
// ============================================================

function hideAddOtherForm() {

    if (
        addOtherForm
    ) {

        addOtherForm.style.display =
            "none";

    }


    if (
        otherReasonInput
    ) {

        otherReasonInput.value =
            "";

    }


    if (
        otherAmountInput
    ) {

        otherAmountInput.value =
            "";

    }

}


// ============================================================
// RENDER OTHER ITEMS
// ============================================================

function renderOtherItems() {

    if (
        !othersContainer
    ) {

        return;

    }


    othersContainer.innerHTML =
        "";


    otherItems.forEach(
        function (item, index) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "other-item";


            row.innerHTML = `

                <div class="other-item-info">

                    <div class="other-item-name">

                        ${escapeHtml(
                            item.reason
                        )}

                    </div>

                </div>


                <strong
                    class="other-item-value">

                    ${money(
                        item.amount
                    )}

                </strong>


                <button
                    type="button"
                    class="remove-other-btn"
                    data-index="${index}">

                    Remove

                </button>

            `;


            othersContainer.appendChild(
                row
            );

        }
    );


    // --------------------------------------------------------
    // REMOVE BUTTONS
    // --------------------------------------------------------

    const removeButtons =
        othersContainer.querySelectorAll(
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
                        !Number.isInteger(
                            index
                        )
                    ) {

                        return;

                    }


                    // Remove item

                    otherItems.splice(
                        index,
                        1
                    );


                    // Re-render

                    renderOtherItems();


                    // Recalculate

                    calculateGrandTotal();


                    // Save existing labour data

                    saveLabourData();

                }
            );

        }
    );

}


// ============================================================
// ADD OTHER ITEM
// ============================================================

function addOtherItem() {

    if (
        !otherReasonInput ||
        !otherAmountInput
    ) {

        return;

    }


    const reason =
        otherReasonInput.value
            .trim();


    const amount =
        roundMoney(
            otherAmountInput.value
        );


    // --------------------------------------------------------
    // CHECK REASON
    // --------------------------------------------------------

    if (
        !reason
    ) {

        alert(
            "Please enter the reason."
        );


        otherReasonInput.focus();

        return;

    }


    // --------------------------------------------------------
    // CHECK AMOUNT
    // --------------------------------------------------------

    if (
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );


        otherAmountInput.focus();

        return;

    }


    // --------------------------------------------------------
    // ADD ITEM
    // --------------------------------------------------------

    otherItems.push({

        reason:
            reason,

        amount:
            amount

    });


    // --------------------------------------------------------
    // CLEAR FORM
    // --------------------------------------------------------

    otherReasonInput.value =
        "";

    otherAmountInput.value =
        "";


    // --------------------------------------------------------
    // HIDE FORM
    // --------------------------------------------------------

    hideAddOtherForm();


    // --------------------------------------------------------
    // SHOW ITEM
    // --------------------------------------------------------

    renderOtherItems();


    // --------------------------------------------------------
    // CALCULATE
    // --------------------------------------------------------

    calculateGrandTotal();


    // --------------------------------------------------------
    // SAVE
    // --------------------------------------------------------

    saveLabourData();

}


// ============================================================
// SAVE LABOUR DATA
// ============================================================
// Labour.js only saves the values.
// It does NOT create PDF.
// It does NOT create quotation.
// It does NOT modify wood data.
// ============================================================

function saveLabourData() {

    // Get latest values
    labourCharge = roundMoney(
        labourChargeInput ? labourChargeInput.value : 0
    );

    otherCharge = roundMoney(
        otherChargeInput ? otherChargeInput.value : 0
    );

    // Recalculate totals
    calculateGrandTotal();

    // Prepare data for bill.js / history.js
    const data = {

        // Wood total comes from wood page
        woodTotal: roundMoney(woodTotal),

        // Labour value
        labourCharge: roundMoney(labourCharge),

        // Main other charge
        otherCharge: roundMoney(otherCharge),

        // Additional other charges
        otherItems: Array.isArray(otherItems)
            ? otherItems.map(function (item) {

                return {
                    reason: String(
                        item && item.reason
                            ? item.reason
                            : "Other"
                    ),

                    amount: roundMoney(
                        item && item.amount
                            ? item.amount
                            : 0
                    )
                };

            })
            : [],

        // Total of Labour + Other Charge + Additional Items
        othersTotal: roundMoney(othersTotal),

        // Wood Total + Others Total
        grandTotal: roundMoney(grandTotal)
    };

    // ========================================================
    // SAVE EVERYTHING IN ONE PLACE
    // ========================================================

    localStorage.setItem(
        "labourData",
        JSON.stringify(data)
    );

    console.log(
        "LABOUR VALUES SAVED:",
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


    if (
        !saved
    ) {

        console.log(
            "NO LABOUR DATA FOUND"
        );

        return;

    }


    try {

        const data =
            JSON.parse(
                saved
            );


        // ----------------------------------------------------
        // LABOUR
        // ----------------------------------------------------

        if (
            data.labourCharge !==
            undefined
        ) {

            labourChargeInput.value =
                data.labourCharge;

        }


        // ----------------------------------------------------
        // OTHER CHARGE
        // ----------------------------------------------------

        if (
            data.otherCharge !==
            undefined
        ) {

            otherChargeInput.value =
                data.otherCharge;

        }


        // ----------------------------------------------------
        // OTHER ITEMS
        // ----------------------------------------------------

        if (
            Array.isArray(
                data.otherItems
            )
        ) {

            otherItems =
                data.otherItems.map(
                    function (item) {

                        // New format

                        if (
                            item &&
                            typeof item ===
                            "object"
                        ) {

                            return {

                                reason:
                                    String(
                                        item.reason ||
                                        "Other"
                                    ),

                                amount:
                                    roundMoney(
                                        item.amount
                                    )

                            };

                        }


                        // Old format compatibility

                        return {

                            reason:
                                "Other",

                            amount:
                                roundMoney(
                                    item
                                )

                        };

                    }
                );

        }
        else {

            otherItems = [];

        }


        // ----------------------------------------------------
        // DISPLAY ITEMS
        // ----------------------------------------------------

        renderOtherItems();


        console.log(
            "LABOUR DATA RESTORED:",
            data
        );

    }
    catch (error) {

        console.error(
            "LABOUR DATA RESTORE ERROR:",
            error
        );

        otherItems = [];

    }

}


// ============================================================
// LABOUR INPUT
// ============================================================

if (
    labourChargeInput
) {

    labourChargeInput.addEventListener(
        "input",
        function () {

            calculateGrandTotal();

            saveLabourData();

        }
    );

}


// ============================================================
// OTHER CHARGE INPUT
// ============================================================

if (
    otherChargeInput
) {

    otherChargeInput.addEventListener(
        "input",
        function () {

            calculateGrandTotal();

            saveLabourData();

        }
    );

}


// ============================================================
// ADD OTHER BUTTON
// ============================================================

if (
    addOtherBtn
) {

    addOtherBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showAddOtherForm();

        }
    );

}


// ============================================================
// SAVE OTHER BUTTON
// ============================================================

if (
    saveOtherBtn
) {

    saveOtherBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            addOtherItem();

        }
    );

}


// ============================================================
// CANCEL OTHER BUTTON
// ============================================================

if (
    cancelOtherBtn
) {

    cancelOtherBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            hideAddOtherForm();

        }
    );

}


// ============================================================
// ENTER - REASON
// ============================================================

if (
    otherReasonInput
) {

    otherReasonInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                if (
                    otherAmountInput
                ) {

                    otherAmountInput.focus();

                }

            }

        }
    );

}


// ============================================================
// ENTER - AMOUNT
// ============================================================

if (
    otherAmountInput
) {

    otherAmountInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                addOtherItem();

            }

        }
    );

}


// ============================================================
// CONFIRM
// ============================================================

if (
    confirmBtn
) {

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

}


// ============================================================
// BACK
// ============================================================

if (
    backBtn
) {

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

}


// ============================================================
// NEXT
// ============================================================

if (
    nextBtn
) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            calculateGrandTotal();

            saveLabourData();


            window.location.href =
                "personal.html";

        }
    );

}


// ============================================================
// INITIALIZE
// ============================================================

function initializeLabourPage() {

    console.log(
        "LABOUR PAGE INITIALIZING"
    );


    // --------------------------------------------------------
    // GET WOOD TOTAL ONCE
    // --------------------------------------------------------

    woodTotal =
        getWoodTotal();


    // --------------------------------------------------------
    // DISPLAY WOOD TOTAL
    // --------------------------------------------------------

    updateWoodTotal();


    // --------------------------------------------------------
    // RESTORE LABOUR DATA
    // --------------------------------------------------------

    loadLabourData();


    // --------------------------------------------------------
    // CALCULATE
    // --------------------------------------------------------

    calculateGrandTotal();


    console.log(
        "LABOUR PAGE READY"
    );

}


// ============================================================
// START
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeLabourPage
    );

}
else {

    initializeLabourPage();

}
