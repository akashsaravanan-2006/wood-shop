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

    const n =
        parseFloat(value);

    return Number.isFinite(n)
        ? n
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
// DISPLAY MONEY
// ============================================================

function money(value) {

    return "₹ " +
        roundMoney(value).toFixed(2);

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


    // --------------------------------------------------------
    // FIRST: CHECK DIRECT WOOD TOTAL KEYS
    // --------------------------------------------------------

    for (
        const key of possibleKeys
    ) {

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
    // SECOND: CHECK woodData
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
// ============================================================
//
// Others Total =
// Main Other Charge
// +
// Additional Other Items
//
// Example:
//
// Other Charge = ₹500
//
// Lunch = ₹300
// Transport = ₹200
//
// Others Total = ₹1000
// ============================================================

function calculateOthersTotal() {

    const mainOther =
        roundMoney(
            otherChargeInput.value
        );


    let additionalTotal = 0;


    otherItems.forEach(
        function (item) {

            additionalTotal +=
                roundMoney(
                    item.amount
                );

        }
    );


    othersTotal =
        roundMoney(
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
// Wood Total
// +
// Labour Charge
// +
// Others Total
//
// Wood Total is NEVER changed here.
// ============================================================

function calculateGrandTotal() {

    // IMPORTANT:
    // Do NOT read/recalculate Wood Total
    // from Labour inputs.

    woodTotal =
        roundMoney(
            woodTotal
        );


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


    console.log(
        "--------------------------------"
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


    console.log(
        "--------------------------------"
    );


    return grandTotal;

}


// ============================================================
// SHOW ADD OTHER FORM
// ============================================================

function showAddOtherForm() {

    addOtherForm.style.display =
        "block";


    otherReasonInput.focus();

}


// ============================================================
// HIDE ADD OTHER FORM
// ============================================================

function hideAddOtherForm() {

    addOtherForm.style.display =
        "none";


    otherReasonInput.value =
        "";

    otherAmountInput.value =
        "";

}


// ============================================================
// RENDER OTHER ITEMS
// ============================================================

function renderOtherItems() {

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
                        ${escapeHtml(item.reason)}
                    </div>

                </div>


                <strong class="other-item-value">

                    ${money(item.amount)}

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
        document.querySelectorAll(
            ".remove-other-btn"
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


                    if (
                        !Number.isInteger(
                            index
                        )
                    ) {
                        return;
                    }


                    otherItems.splice(
                        index,
                        1
                    );


                    renderOtherItems();

                    calculateGrandTotal();

                    saveLabourData();

                }
            );

        }
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================
//
// Prevents user-entered reason text from being treated
// as HTML.
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
// ADD OTHER ITEM
// ============================================================

function addOtherItem() {

    const reason =
        otherReasonInput.value
            .trim();


    const amount =
        roundMoney(
            otherAmountInput.value
        );


    if (!reason) {

        alert(
            "Please enter the reason."
        );


        otherReasonInput.focus();

        return;

    }


    if (amount <= 0) {

        alert(
            "Please enter a valid amount."
        );


        otherAmountInput.focus();

        return;

    }


    // --------------------------------------------------------
    // STORE BOTH REASON + AMOUNT
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

    addOtherForm.style.display =
        "none";


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
// MAIN OTHER INPUT
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

        showAddOtherForm();

    }
);


// ============================================================
// SAVE OTHER BUTTON
// ============================================================

saveOtherBtn.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        addOtherItem();

    }
);


// ============================================================
// CANCEL OTHER BUTTON
// ============================================================

cancelOtherBtn.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        hideAddOtherForm();

    }
);


// ============================================================
// ENTER KEY IN OTHER FORM
// ============================================================

otherAmountInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            addOtherItem();

        }

    }
);


otherReasonInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            otherAmountInput.focus();

        }

    }
);


// ============================================================
// SAVE DATA
// ============================================================

function saveLabourData() {

    calculateGrandTotal();


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


        // Save reason + amount
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
    // MAIN LABOUR DATA
    // --------------------------------------------------------

    localStorage.setItem(
        "labourData",
        JSON.stringify(data)
    );


    // --------------------------------------------------------
    // VALUE DISCOUNT SHOULD READ
    // --------------------------------------------------------

    localStorage.setItem(
        "labourFinalTotal",
        roundMoney(
            grandTotal
        ).toFixed(2)
    );


    // --------------------------------------------------------
    // IMMUTABLE BASE FOR THIS STAGE
    // --------------------------------------------------------

    localStorage.setItem(
        "labourBaseTotal",
        roundMoney(
            grandTotal
        ).toFixed(2)
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
            JSON.parse(
                saved
            );


        // ----------------------------------------------------
        // LABOUR CHARGE
        // ----------------------------------------------------

        if (
            data.labourCharge !==
            undefined
        ) {

            labourChargeInput.value =
                data.labourCharge;

        }


        // ----------------------------------------------------
        // MAIN OTHER CHARGE
        // ----------------------------------------------------

        if (
            data.otherCharge !==
            undefined
        ) {

            otherChargeInput.value =
                data.otherCharge;

        }


        // ----------------------------------------------------
        // ADDITIONAL OTHER ITEMS
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
                        // { reason, amount }

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


                        // Old format compatibility:
                        // If old data only contains amount,
                        // keep it as "Other".

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


        // ----------------------------------------------------
        // RENDER
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


    // --------------------------------------------------------
    // GET WOOD TOTAL
    // --------------------------------------------------------

    woodTotal =
        getWoodTotal();


    // --------------------------------------------------------
    // SHOW WOOD TOTAL
    // --------------------------------------------------------

    updateWoodTotal();


    // --------------------------------------------------------
    // LOAD PREVIOUS LABOUR DATA
    // --------------------------------------------------------

    loadLabourData();


    // --------------------------------------------------------
    // CALCULATE EVERYTHING
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
