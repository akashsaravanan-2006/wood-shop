// ============================================================
// WOOD.JS
// ============================================================
// Wood Calculation + Permanent Temporary Bill Persistence
//
// Data is stored in storedata.js under:
//     current_bill_data
//
// Data is NOT cleared when:
//     Wood -> Labour
//     Labour -> Personal
//     Personal -> Advance
//     Advance -> Discount
//     Discount -> Bill
//     Bill -> Edit -> Wood
//
// Data is cleared ONLY after successful DB save
// or when startNewBill()/clearBillData() is called.
// ============================================================


// ============================================================
// HELPER: SAVE CURRENT WOOD PAGE
// ============================================================

function saveCurrentWoodData() {

    if (typeof savePageData !== "function") {
        console.error(
            "storedata.js is not loaded before wood.js"
        );
        return;
    }

    const woodData = [];

    document
        .querySelectorAll(".calculation")
        .forEach(function (card) {

            const pieces = [];
            let totalLength = 0;

            card
                .querySelectorAll(".lengthRow")
                .forEach(function (row) {

                    const length =
                        parseFloat(
                            row.querySelector(".length")?.value
                        ) || 0;

                    const extraLength =
                        parseFloat(
                            row.querySelector(".extraLength")?.value
                        ) || 0;

                    const qty =
                        parseFloat(
                            row.querySelector(".qty")?.value
                        ) || 0;

                    const finalLength =
                        length + extraLength;

                    const rowTotal =
                        finalLength * qty;

                    totalLength += rowTotal;

                    pieces.push({
                        length: length,
                        extraLength: extraLength,
                        qty: qty,
                        totalLength: rowTotal
                    });

                });


            const cubicFeet =
                parseFloat(
                    card.querySelector(".cf")?.textContent
                ) || 0;

            const amount =
                parseFloat(
                    card.querySelector(".amount")?.textContent
                ) || 0;


            woodData.push({

                woodType:
                    card.querySelector(".woodType")?.value || "",

                otherWood:
                    card.querySelector(".otherWood")?.value || "",

                breadth:
                    card.querySelector(".breadth")?.value || "",

                thickness:
                    card.querySelector(".thickness")?.value || "",

                rate:
                    card.querySelector(".rate")?.value || "",

                quality:
                    card.querySelector(".quality")?.value || "1",

                pieces:
                    pieces,

                totalLength:
                    totalLength,

                cubicFeet:
                    cubicFeet,

                amount:
                    amount

            });

        });


    const grandTotal =
        parseFloat(
            document.getElementById("grandTotal")?.textContent
        ) || 0;


    // --------------------------------------------------------
    // SAVE USING CENTRAL STORE
    // --------------------------------------------------------

    savePageData(
        "wood",
        {
            calculations: woodData,
            grandTotal: grandTotal
        }
    );


    // --------------------------------------------------------
    // OLD STORAGE KEYS
    // Keep these for compatibility with your existing pages.
    // --------------------------------------------------------

    localStorage.setItem(
        "woodData",
        JSON.stringify(woodData)
    );

    localStorage.setItem(
        "woodTotal",
        String(grandTotal)
    );


    console.log(
        "WOOD DATA SAVED:",
        woodData
    );

}


// ============================================================
// CREATE LENGTH ROW
// ============================================================

function createLengthRow(data = {}) {

    const row =
        document.createElement("div");

    row.className =
        "lengthRow";


    row.innerHTML = `

        <div class="lengthInput">

            <input
                type="number"
                class="length"
                step="0.01"
                min="0"
                placeholder="Length"
                value="${data.length ?? ""}">

            <input
                type="number"
                class="extraLength"
                step="0.01"
                min="0"
                placeholder="0"
                value="${data.extraLength ?? 0}">

        </div>


        <div class="qtyInput">

            <input
                type="number"
                class="qty"
                min="1"
                placeholder="Qty"
                value="${data.qty ?? ""}">

        </div>


        <button
            type="button"
            class="removeRow">

            ✖

        </button>

    `;


    return row;

}


// ============================================================
// SHOW / HIDE OTHER WOOD
// ============================================================

document.addEventListener(
    "change",
    function (e) {

        if (
            !e.target.classList.contains("woodType")
        ) {
            return;
        }


        const card =
            e.target.closest(".calculation");


        if (!card) {
            return;
        }


        const other =
            card.querySelector(".otherWood");


        if (!other) {
            return;
        }


        if (e.target.value === "Other") {

            other.style.display =
                "block";

            other.focus();

        }
        else {

            other.style.display =
                "none";

            other.value = "";

        }


        saveCurrentWoodData();

    }
);


// ============================================================
// ADD LENGTH
// ============================================================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.classList.contains("addLength")
        ) {
            return;
        }


        const card =
            e.target.closest(".calculation");


        if (!card) {
            return;
        }


        const container =
            card.querySelector(".lengthRows");


        if (!container) {
            return;
        }


        container.appendChild(
            createLengthRow()
        );


        // Recalculate after adding a row
        calculateCard(card);

        saveCurrentWoodData();

    }
);


// ============================================================
// REMOVE LENGTH
// ============================================================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.classList.contains("removeRow")
        ) {
            return;
        }


        const rows =
            e.target.closest(".lengthRows");


        if (!rows) {
            return;
        }


        if (rows.children.length === 1) {

            alert(
                "At least one row is required."
            );

            return;

        }


        const card =
            e.target.closest(".calculation");


        e.target
            .closest(".lengthRow")
            .remove();


        // Recalculate after removing a row
        if (card) {
            calculateCard(card);
        }

        saveCurrentWoodData();

    }
);


// ============================================================
// CALCULATE ONE CARD
// ============================================================

function calculateCard(card) {

    if (!card) {
        return;
    }


    const breadth =
        parseFloat(
            card.querySelector(".breadth")?.value
        ) || 0;


    const thickness =
        parseFloat(
            card.querySelector(".thickness")?.value
        ) || 0;


    const rate =
        parseFloat(
            card.querySelector(".rate")?.value
        ) || 0;


    let totalLength = 0;


    card
        .querySelectorAll(".lengthRow")
        .forEach(function (row) {

            const length =
                parseFloat(
                    row.querySelector(".length")?.value
                ) || 0;


            const extra =
                parseFloat(
                    row.querySelector(".extraLength")?.value
                ) || 0;


            const qty =
                parseFloat(
                    row.querySelector(".qty")?.value
                ) || 0;


            const finalLength =
                length + extra;


            totalLength +=
                finalLength * qty;

        });


    // --------------------------------------------------------
    // CUBIC FEET CALCULATION
    // --------------------------------------------------------

    const cubicFeet =
        (
            breadth *
            thickness *
            totalLength
        ) / 144;


    // --------------------------------------------------------
    // AMOUNT CALCULATION
    // --------------------------------------------------------

    const amount =
        cubicFeet * rate;


    // --------------------------------------------------------
    // DISPLAY RESULT
    // --------------------------------------------------------

    const cfElement =
        card.querySelector(".cf");


    const amountElement =
        card.querySelector(".amount");


    if (cfElement) {

        cfElement.textContent =
            cubicFeet.toFixed(2);

    }


    if (amountElement) {

        amountElement.textContent =
            amount.toFixed(2);

    }


    // Update grand total automatically
    updateGrandTotal();

}


// ============================================================
// CALCULATE BUTTON
// ============================================================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.classList.contains("calculate")
        ) {
            return;
        }


        const card =
            e.target.closest(".calculation");


        if (!card) {
            return;
        }


        calculateCard(card);

        saveCurrentWoodData();

    }
);


// ============================================================
// GRAND TOTAL
// ============================================================

function updateGrandTotal() {

    let total = 0;


    document
        .querySelectorAll(".amount")
        .forEach(function (item) {

            total +=
                parseFloat(
                    item.textContent
                ) || 0;

        });


    const grandTotalElement =
        document.getElementById(
            "grandTotal"
        );


    if (grandTotalElement) {

        grandTotalElement.textContent =
    Math.round(total);

    }


    return total;

}


// ============================================================
// CLEAR CALCULATION
// ============================================================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.classList.contains("clear")
        ) {
            return;
        }


        const card =
            e.target.closest(".calculation");


        if (!card) {
            return;
        }


        card
            .querySelectorAll("input")
            .forEach(function (input) {

                if (
                    input.classList.contains(
                        "extraLength"
                    )
                ) {

                    input.value = "0";

                }
                else {

                    input.value = "";

                }

            });


        const woodType =
            card.querySelector(
                ".woodType"
            );


        if (woodType) {

            woodType.selectedIndex =
                0;

        }


        const otherWood =
            card.querySelector(
                ".otherWood"
            );


        if (otherWood) {

            otherWood.value = "";

            otherWood.style.display =
                "none";

        }


        const cf =
            card.querySelector(".cf");


        const amount =
            card.querySelector(".amount");


        if (cf) {

            cf.textContent =
                "0.00";

        }


        if (amount) {

            amount.textContent =
                "0.00";

        }


        const rows =
            card.querySelector(
                ".lengthRows"
            );


        if (rows) {

            rows.innerHTML = "";

            rows.appendChild(
                createLengthRow()
            );

        }


        updateGrandTotal();

        saveCurrentWoodData();

    }
);


// ============================================================
// REMOVE CALCULATION
// ============================================================

document.addEventListener(
    "click",
    function (e) {

        if (
            !e.target.classList.contains("remove")
        ) {
            return;
        }


        const cards =
            document.querySelectorAll(
                ".calculation"
            );


        if (cards.length === 1) {

            alert(
                "At least one calculation is required."
            );

            return;

        }


        const card =
            e.target.closest(
                ".calculation"
            );


        if (card) {

            card.remove();

        }


        renameCalculations();

        updateGrandTotal();

        saveCurrentWoodData();

    }
);


// ============================================================
// RENAME CALCULATIONS
// ============================================================

function renameCalculations() {

    document
        .querySelectorAll(".calculation")
        .forEach(function (card, index) {

            const heading =
                card.querySelector("h2");


            if (heading) {

                heading.textContent =
                    "Calculation " +
                    (index + 1);

            }

        });

}


// ============================================================
// ADD ANOTHER CALCULATION
// ============================================================

const addCalculation =
    document.getElementById(
        "addCalculation"
    );


if (addCalculation) {

    addCalculation.addEventListener(
        "click",
        function () {

            const first =
                document.querySelector(
                    ".calculation"
                );


            if (!first) {
                return;
            }


            const newCard =
                first.cloneNode(true);


            // ------------------------------------------------
            // RESET INPUTS
            // ------------------------------------------------

            newCard
                .querySelectorAll("input")
                .forEach(function (input) {

                    if (
                        input.classList.contains(
                            "extraLength"
                        )
                    ) {

                        input.value =
                            "0";

                    }
                    else {

                        input.value =
                            "";

                    }

                });


            // ------------------------------------------------
            // RESET WOOD TYPE
            // ------------------------------------------------

            const woodType =
                newCard.querySelector(
                    ".woodType"
                );


            if (woodType) {

                woodType.selectedIndex =
                    0;

            }


            const otherWood =
                newCard.querySelector(
                    ".otherWood"
                );


            if (otherWood) {

                otherWood.value =
                    "";

                otherWood.style.display =
                    "none";

            }


            // ------------------------------------------------
            // RESET RESULT
            // ------------------------------------------------

            const cf =
                newCard.querySelector(
                    ".cf"
                );


            const amount =
                newCard.querySelector(
                    ".amount"
                );


            if (cf) {

                cf.textContent =
                    "0.00";

            }


            if (amount) {

                amount.textContent =
                    "0.00";

            }


            // ------------------------------------------------
            // RESET LENGTH ROWS
            // ------------------------------------------------

            const lengthRows =
                newCard.querySelector(
                    ".lengthRows"
                );


            if (lengthRows) {

                lengthRows.innerHTML =
                    "";

                lengthRows.appendChild(
                    createLengthRow()
                );

            }


            const allCalculations =
                document.getElementById(
                    "allCalculations"
                );


            if (!allCalculations) {
                return;
            }


            allCalculations.appendChild(
                newCard
            );


            renameCalculations();

            updateGrandTotal();

            saveCurrentWoodData();

        }
    );

}


// ============================================================
// FINAL CALCULATION
// ============================================================

const finalCalculation =
    document.getElementById(
        "finalCalculation"
    );


if (finalCalculation) {

    finalCalculation.addEventListener(
        "click",
        function () {

            const total =
                updateGrandTotal();


            saveCurrentWoodData();


            alert(
                "Grand Total : ₹ " +
Math.round(total)
            );

        }
    );

}


// ============================================================
// CONFIRM
// ============================================================

const confirmBtn =
    document.getElementById(
        "confirmBtn"
    );


if (confirmBtn) {

    confirmBtn.addEventListener(
        "click",
        function () {

            const total =
                updateGrandTotal();


            if (total <= 0) {

                alert(
                    "Your cart is Empty!"
                );

                return;

            }


            // IMPORTANT:
            // SAVE DATA BEFORE LEAVING PAGE.
            // DO NOT CLEAR ANY DATA.

            saveCurrentWoodData();


            // Keep old compatibility values.
localStorage.setItem(
    "finalTotal",
    String(Math.round(total))
);

localStorage.setItem(
    "grandTotal",
    String(Math.round(total))
);


            console.log(
                "Wood confirmed. Data preserved."
            );


            // GO TO LABOUR PAGE

            window.location.href =
                "labour.html";

        }
    );

}


// ============================================================
// HOME
// ============================================================

const homeBtn =
    document.getElementById(
        "homeBtn"
    );


if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            // ------------------------------------------------
            // START A COMPLETELY NEW BILL
            // ------------------------------------------------

            if (
                typeof startNewBill ===
                "function"
            ) {

                startNewBill();

            }
            else {

                localStorage.removeItem(
                    "current_bill_data"
                );

                localStorage.removeItem(
                    "woodData"
                );

                localStorage.removeItem(
                    "woodTotal"
                );

            }


            window.location.href =
                "index.html";

        }
    );

}


// ============================================================
// AUTO CALCULATE + SAVE WHILE USER TYPES
// ============================================================

document.addEventListener(
    "input",
    function (e) {

        const card =
            e.target.closest(
                ".calculation"
            );


        if (!card) {
            return;
        }


        // ----------------------------------------------------
        // AUTOMATIC CALCULATION
        // ----------------------------------------------------

        calculateCard(card);


        // ----------------------------------------------------
        // AUTOMATIC SAVE
        // ----------------------------------------------------

        saveCurrentWoodData();

    }
);


// ============================================================
// SAVE SELECT / RADIO / CHECKBOX
// ============================================================

document.addEventListener(
    "change",
    function (e) {

        const card =
            e.target.closest(
                ".calculation"
            );


        if (!card) {
            return;
        }


        // Recalculate for select/change inputs too
        calculateCard(card);


        saveCurrentWoodData();

    }
);


// ============================================================
// RESTORE WOOD DATA
// ============================================================

function restoreWoodData() {

    if (
        typeof getPageData !==
        "function"
    ) {

        console.error(
            "storedata.js is not loaded."
        );

        return;

    }


    const woodPage =
        getPageData(
            "wood"
        );


    if (
        !woodPage ||
        !Array.isArray(
            woodPage.calculations
        ) ||
        woodPage.calculations.length === 0
    ) {

        console.log(
            "No previous Wood data found."
        );

        return;

    }


    const allCalculations =
        document.getElementById(
            "allCalculations"
        );


    if (!allCalculations) {
        return;
    }


    // --------------------------------------------------------
    // USE FIRST HTML CARD AS TEMPLATE
    // --------------------------------------------------------

    const template =
        allCalculations.querySelector(
            ".calculation"
        );


    if (!template) {
        return;
    }


    // Remove current cards.

    allCalculations.innerHTML =
        "";


    // --------------------------------------------------------
    // RECREATE EVERY CALCULATION
    // --------------------------------------------------------

    woodPage.calculations
        .forEach(function (data, index) {

            const card =
                template.cloneNode(true);


            // =================================================
            // WOOD TYPE
            // =================================================

            const woodType =
                card.querySelector(
                    ".woodType"
                );


            if (woodType) {

                woodType.value =
                    data.woodType || "Teak";

            }


            // =================================================
            // OTHER WOOD
            // =================================================

            const otherWood =
                card.querySelector(
                    ".otherWood"
                );


            if (otherWood) {

                otherWood.value =
                    data.otherWood || "";


                if (
                    data.woodType ===
                    "Other"
                ) {

                    otherWood.style.display =
                        "block";

                }
                else {

                    otherWood.style.display =
                        "none";

                }

            }


            // =================================================
            // BREADTH
            // =================================================

            const breadth =
                card.querySelector(
                    ".breadth"
                );


            if (breadth) {

                breadth.value =
                    data.breadth || "";

            }


            // =================================================
            // THICKNESS
            // =================================================

            const thickness =
                card.querySelector(
                    ".thickness"
                );


            if (thickness) {

                thickness.value =
                    data.thickness || "";

            }


            // =================================================
            // RATE
            // =================================================

            const rate =
                card.querySelector(
                    ".rate"
                );


            if (rate) {

                rate.value =
                    data.rate || "";

            }


            // =================================================
            // QUALITY
            // =================================================

            const quality =
                card.querySelector(
                    ".quality"
                );


            if (quality) {

                quality.value =
                    data.quality || "1";

            }


            // =================================================
            // LENGTH ROWS
            // =================================================

            const lengthRows =
                card.querySelector(
                    ".lengthRows"
                );


            if (lengthRows) {

                lengthRows.innerHTML =
                    "";


                const pieces =
                    Array.isArray(
                        data.pieces
                    )
                        ? data.pieces
                        : [];


                if (pieces.length > 0) {

                    pieces.forEach(
                        function (piece) {

                            lengthRows.appendChild(
                                createLengthRow(
                                    piece
                                )
                            );

                        }
                    );

                }
                else {

                    lengthRows.appendChild(
                        createLengthRow()
                    );

                }

            }


            // =================================================
            // RESULT
            // =================================================

            const cf =
                card.querySelector(
                    ".cf"
                );


            if (cf) {

                cf.textContent =
                    Number(
                        data.cubicFeet ||
                        0
                    ).toFixed(2);

            }


            const amount =
                card.querySelector(
                    ".amount"
                );


            if (amount) {

                amount.textContent =
                    Number(
                        data.amount ||
                        0
                    ).toFixed(2);

            }


            // =================================================
            // HEADING
            // =================================================

            const heading =
                card.querySelector(
                    "h2"
                );


            if (heading) {

                heading.textContent =
                    "Calculation " +
                    (index + 1);

            }


            allCalculations.appendChild(
                card
            );

        });


    // --------------------------------------------------------
    // RECALCULATE ALL RESTORED CARDS
    // --------------------------------------------------------

    document
        .querySelectorAll(".calculation")
        .forEach(function (card) {

            calculateCard(card);

        });


    // --------------------------------------------------------
    // RESTORE TOTAL
    // --------------------------------------------------------

    updateGrandTotal();


    console.log(
        "WOOD DATA RESTORED:",
        woodPage
    );

}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        restoreWoodData();

    }
);
