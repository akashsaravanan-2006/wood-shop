// ============================================================
// LABOUR.JS
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

let otherItems = [];

let othersTotal = 0;

let grandTotal = 0;


// ============================================================
// NUMBER HELPER
// ============================================================

function toNumber(value) {

    const number =
        parseFloat(value);

    return Number.isFinite(number)
        ? number
        : 0;

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
// MONEY DISPLAY
// ============================================================

function money(value) {

    return "₹ " +
        roundMoney(value).toFixed(2);

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// GET WOOD TOTAL
// ============================================================

function getWoodTotal() {

    // --------------------------------------------------------
    // IMPORTANT:
    // Wood Total must come from Wood page.
    // It must NOT come from Labour calculations.
    // --------------------------------------------------------

    const possibleKeys = [

        "woodFinalTotal",

        "woodTotal",

        "woodGrandTotal"

    ];


    // --------------------------------------------------------
    // CHECK DIRECT LOCAL STORAGE KEYS
    // --------------------------------------------------------

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
    // CHECK woodData
    // --------------------------------------------------------

    const woodData =
        localStorage.getItem(
            "woodData"
        );


    if (woodData) {

        try {

            const data =
                JSON.parse(
                    woodData
                );


            // Your wood.js stores grandTotal
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


                    if (amount > 0) {

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
                "WOOD DATA JSON ERROR:",
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

    if (!woodTotalElement) {
        return;
    }


    woodTotalElement.textContent =
        money(woodTotal);

}


// ============================================================
// CALCULATE OTHERS TOTAL
// ============================================================
//
// Others Total =
// Labour Charge
// + Other Charge
// + Additional Other Items
// ============================================================

function calculateOthersTotal() {

    const labour =
        roundMoney(
            labourChargeInput.value
        );

    const mainOther =
        roundMoney(
            otherChargeInput.value
        );

    let additionalTotal = 0;

    otherItems.forEach(function (item) {

        additionalTotal +=
            roundMoney(item.amount);

    });

    othersTotal =
        roundMoney(
            labour +
            mainOther +
            additionalTotal
        );

    othersTotalElement.textContent =
        money(othersTotal);

    return othersTotal;
}

// ============================================================
// CALCULATE GRAND TOTAL
// ============================================================
//
// Grand Total =
// Wood Total + Others Total
//
// IMPORTANT:
// Labour is already included inside Others Total.
// So DO NOT add Labour separately.
// ============================================================

function calculateGrandTotal() {

    const currentWoodTotal =
        roundMoney(
            woodTotal
        );

    const currentOthersTotal =
        calculateOthersTotal();

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

    if (!addOtherForm) {
        return;
    }


    addOtherForm.style.display =
        "block";


    if (otherReasonInput) {

        otherReasonInput.focus();

    }

}


// ============================================================
// HIDE ADD OTHER FORM
// ============================================================

function hideAddOtherForm() {

    if (addOtherForm) {

        addOtherForm.style.display =
            "none";

    }


    if (otherReasonInput) {

        otherReasonInput.value =
            "";

    }


    if (otherAmountInput) {

        otherAmountInput.value =
            "";

    }

}


// ============================================================
// RENDER OTHER ITEMS
// ============================================================

function renderOtherItems() {

    if (!othersContainer) {
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


            const reason =
                escapeHtml(
                    item.reason
                );


            const amount =
                money(
                    item.amount
                );


            row.innerHTML = `

                <div class="other-item-info">

                    <div class="other-item-name">
                        ${reason}
                    </div>

                </div>

                <strong class="other-item-value">
                    ${amount}
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
                        !Number.isInteger(index)
                    ) {

                        return;

                    }


                    // Remove selected item

                    otherItems.splice(
                        index,
                        1
                    );


                    // Re-render

                    renderOtherItems();


                    // Recalculate

                    calculateGrandTotal();


                    // Save immediately

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
    // VALIDATE REASON
    // --------------------------------------------------------

    if (!reason) {

        alert(
            "Please enter the reason."
        );


        otherReasonInput.focus();

        return;

    }


    // --------------------------------------------------------
    // VALIDATE AMOUNT
    // --------------------------------------------------------

    if (amount <= 0) {

        alert(
            "Please enter a valid amount."
        );


        otherAmountInput.focus();

        return;

    }


    // --------------------------------------------------------
    // SAVE ITEM
    // --------------------------------------------------------

    otherItems.push({

        reason:
            reason,

        amount:
            amount

    });


    console.log(
        "OTHER ITEM ADDED:",
        {
            reason,
            amount
        }
    );


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
    // DISPLAY ITEM
    // --------------------------------------------------------

    renderOtherItems();


    // --------------------------------------------------------
    // RECALCULATE
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
//
// This function saves EVERYTHING:
//
// Wood Total
// Labour Charge
// Main Other Charge
// Additional Other reason
// Additional Other amount
// Others Total
// Grand Total
//
// ============================================================

function saveLabourData() {

    // Make sure latest values are calculated first.

    calculateGrandTotal();


    // --------------------------------------------------------
    // CREATE DATA OBJECT
    // --------------------------------------------------------

    const data = {

        woodTotal:
            roundMoney(
                woodTotal
            ),


        labourCharge:
            roundMoney(
                labourCharge
            ),


        otherCharge:
            roundMoney(
                otherCharge
            ),


        otherItems:
            otherItems.map(
                function (item) {

                    return {

                        reason:
                            String(
                                item.reason
                            ),

                        amount:
                            roundMoney(
                                item.amount
                            )

                    };

                }
            ),


        othersTotal:
            roundMoney(
                othersTotal
            ),


        grandTotal:
            roundMoney(
                grandTotal
            )

    };


    // --------------------------------------------------------
    // SAVE MAIN LABOUR DATA
    // --------------------------------------------------------

    localStorage.setItem(
        "labourData",
        JSON.stringify(data)
    );


    // --------------------------------------------------------
    // SAVE LABOUR FINAL TOTAL
    // --------------------------------------------------------

    localStorage.setItem(
        "labourFinalTotal",
        grandTotal.toFixed(2)
    );


    // --------------------------------------------------------
    // SAVE LABOUR BASE TOTAL
    // --------------------------------------------------------

    localStorage.setItem(
        "labourBaseTotal",
        grandTotal.toFixed(2)
    );


    console.log(
        "================================"
    );


    console.log(
        "LABOUR DATA SAVED:",
        data
    );


    console.log(
        "LABOUR FINAL TOTAL:",
        grandTotal
    );


    console.log(
        "================================"
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
            "NO PREVIOUS LABOUR DATA"
        );

        return;

    }


    try {

        const data =
            JSON.parse(
                saved
            );


        // ----------------------------------------------------
        // RESTORE LABOUR CHARGE
        // ----------------------------------------------------

        if (
            data.labourCharge !==
            undefined &&
            labourChargeInput
        ) {

            labourChargeInput.value =
                data.labourCharge;

        }


        // ----------------------------------------------------
        // RESTORE MAIN OTHER CHARGE
        // ----------------------------------------------------

        if (
            data.otherCharge !==
            undefined &&
            otherChargeInput
        ) {

            otherChargeInput.value =
                data.otherCharge;

        }


        // ----------------------------------------------------
        // RESTORE OTHER ITEMS
        // ----------------------------------------------------

        if (
            Array.isArray(
                data.otherItems
            )
        ) {

            otherItems =
                data.otherItems.map(
                    function (item) {

                        // New format:
                        //
                        // {
                        //     reason: "Lunch",
                        //     amount: 300
                        // }

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


                        // ------------------------------------------------
                        // OLD FORMAT COMPATIBILITY
                        // ------------------------------------------------
                        //
                        // Old data only stored:
                        //
                        // [300, 200]
                        //
                        // Convert it to:
                        //
                        // [
                        //   { reason:"Other", amount:300 },
                        //   { reason:"Other", amount:200 }
                        // ]

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
        // RENDER RESTORED ITEMS
        // ----------------------------------------------------

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

        otherItems = [];

    }

}


// ============================================================
// LABOUR INPUT - AUTO SAVE
// ============================================================

if (labourChargeInput) {

    labourChargeInput.addEventListener(
        "input",
        function () {

            calculateGrandTotal();

            saveLabourData();

        }
    );

}


// ============================================================
// MAIN OTHER CHARGE - AUTO SAVE
// ============================================================

if (otherChargeInput) {

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

if (addOtherBtn) {

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

if (saveOtherBtn) {

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

if (cancelOtherBtn) {

    cancelOtherBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            hideAddOtherForm();

        }
    );

}


// ============================================================
// ENTER KEY - REASON
// ============================================================

if (otherReasonInput) {

    otherReasonInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                if (otherAmountInput) {

                    otherAmountInput.focus();

                }

            }

        }
    );

}


// ============================================================
// ENTER KEY - AMOUNT
// ============================================================

if (otherAmountInput) {

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
// CONFIRM BUTTON
// ============================================================

if (confirmBtn) {

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
// NEXT
//
// LABOUR → PERSONAL
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            // Save EVERYTHING before leaving

            calculateGrandTotal();

            saveLabourData();


            console.log(
                "LABOUR → PERSONAL"
            );


            window.location.href =
                "personal.html";

        }
    );

}


// ============================================================
// BACK
//
// LABOUR → WOOD
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            // Save EVERYTHING before leaving

            calculateGrandTotal();

            saveLabourData();


            console.log(
                "LABOUR → WOOD"
            );


            window.location.href =
                "wood.html";

        }
    );

}


// ============================================================
// INITIALIZE
// ============================================================

function initialize() {

    console.log(
        "LABOUR PAGE INITIALIZING"
    );


    // --------------------------------------------------------
    // GET FIXED WOOD TOTAL
    // --------------------------------------------------------

    woodTotal =
        getWoodTotal();


    // --------------------------------------------------------
    // DISPLAY WOOD TOTAL
    // --------------------------------------------------------

    updateWoodTotal();


    // --------------------------------------------------------
    // LOAD PREVIOUS LABOUR VALUES
    // --------------------------------------------------------

    loadLabourData();


    // --------------------------------------------------------
    // CALCULATE AFTER RESTORING
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
        initialize
    );

}
else {

    initialize();

}
