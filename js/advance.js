// ============================================================
// ADVANCE.JS
// ============================================================
//
// FLOW:
//
// WOOD
//   ↓
// LABOUR
//   ↓
// PERSONAL
//   ↓
// ADVANCE
//   ↓
// DISCOUNT
//   ↓
// BILL
//
// IMPORTANT:
// ------------------------------------------------------------
// Advance page works with the ORIGINAL TOTAL.
// Discount has NOT happened yet.
//
// Therefore:
//     finalTotal       = ORIGINAL TOTAL
//     finalGrandTotal  = AFTER DISCOUNT
//
// DO NOT use finalGrandTotal here.
// ============================================================


// ============================================================
// 1. GET HTML ELEMENTS
// ============================================================

const grandTotalInput =
    document.getElementById("grandTotal");

const paymentTypes =
    document.querySelectorAll(
        'input[name="paymentType"]'
    );

const paymentModes =
    document.querySelectorAll(
        'input[name="paymentMode"]'
    );

const advanceSection =
    document.getElementById("advanceSection");

const advanceAmountInput =
    document.getElementById("advanceAmount");

const balanceAmountInput =
    document.getElementById("balanceAmount");

const calculateBtn =
    document.getElementById("calculateBtn");

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// ============================================================
// 2. DEBUG - CHECK HTML ELEMENTS
// ============================================================

console.log("==========================================");
console.log("ADVANCE.JS STARTED");
console.log("==========================================");

console.log(
    "grandTotalInput:",
    grandTotalInput
);

console.log(
    "paymentTypes:",
    paymentTypes.length
);

console.log(
    "paymentModes:",
    paymentModes.length
);

console.log(
    "advanceSection:",
    advanceSection
);

console.log(
    "advanceAmountInput:",
    advanceAmountInput
);

console.log(
    "balanceAmountInput:",
    balanceAmountInput
);

console.log(
    "calculateBtn:",
    calculateBtn
);

console.log(
    "nextBtn:",
    nextBtn
);

console.log(
    "backBtn:",
    backBtn
);


// ============================================================
// 3. NUMBER CONVERTER
// ============================================================
// Handles values such as:
//
// 7044.44
// "7044.44"
// "₹ 7044.44"
// "₹7044.44"
// ============================================================

function toNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }

    if (typeof value === "number") {

        return Number.isFinite(value)
            ? value
            : 0;

    }

    const cleaned =
        String(value)
            .replace(/₹/g, "")
            .replace(/,/g, "")
            .trim();

    const number =
        Number(cleaned);

    return Number.isFinite(number)
        ? number
        : 0;

}


// ============================================================
// 4. GET ORIGINAL GRAND TOTAL
// ============================================================
//
// IMPORTANT:
//
// We do NOT use:
//     finalGrandTotal
//
// because that value belongs to the Discount page.
//
// We need the amount BEFORE discount.
// ============================================================

function getOriginalGrandTotal() {

    let total = 0;


    // --------------------------------------------------------
    // SOURCE 1
    // CENTRAL BILL STORAGE
    // --------------------------------------------------------

    if (
        typeof getTotals === "function"
    ) {

        try {

            const totals =
                getTotals();

            if (
                totals &&
                totals.finalTotal !== undefined
            ) {

                total =
                    toNumber(
                        totals.finalTotal
                    );

            }

            console.log(
                "SOURCE 1 - storedata totals:",
                totals
            );

        }
        catch (error) {

            console.error(
                "Error reading central totals:",
                error
            );

        }

    }


    // --------------------------------------------------------
    // SOURCE 2
    // localStorage finalTotal
    // --------------------------------------------------------

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "finalTotal"
                )
            );

        console.log(
            "SOURCE 2 - localStorage finalTotal:",
            total
        );

    }


    // --------------------------------------------------------
    // SOURCE 3
    // localStorage grandTotal
    // --------------------------------------------------------

    if (total <= 0) {

        total =
            toNumber(
                localStorage.getItem(
                    "grandTotal"
                )
            );

        console.log(
            "SOURCE 3 - localStorage grandTotal:",
            total
        );

    }


    // --------------------------------------------------------
    // SOURCE 4
    // WOOD + OTHERS
    // --------------------------------------------------------

    if (total <= 0) {

        const wood =
            toNumber(
                localStorage.getItem(
                    "woodTotal"
                )
            );

        const others =
            toNumber(
                localStorage.getItem(
                    "othersTotal"
                )
            );

        total =
            wood +
            others;

        console.log(
            "SOURCE 4 - wood + others:",
            {
                wood: wood,
                others: others,
                total: total
            }
        );

    }


    // --------------------------------------------------------
    // FINAL VALUE
    // --------------------------------------------------------

    if (!Number.isFinite(total)) {

        total = 0;

    }


    total =
        Math.round(
            total * 100
        ) / 100;


    console.log(
        "ORIGINAL GRAND TOTAL:",
        total
    );


    return total;

}


// ============================================================
// 5. GET TOTAL
// ============================================================

let grandTotal =
    getOriginalGrandTotal();


// ============================================================
// 6. DISPLAY TOTAL
// ============================================================

function displayGrandTotal() {

    if (!grandTotalInput) {

        return;

    }

    grandTotalInput.value =
        "₹ " +
        grandTotal.toFixed(2);

}


displayGrandTotal();


// ============================================================
// 7. LOAD SAVED ADVANCE DATA
// ============================================================

let savedAdvance = {};

if (
    typeof getPageData === "function"
) {

    try {

        savedAdvance =
            getPageData("advance") || {};

    }
    catch (error) {

        console.error(
            "Could not load advance data:",
            error
        );

        savedAdvance = {};

    }

}


console.log(
    "SAVED ADVANCE DATA:",
    savedAdvance
);


// ============================================================
// 8. RESTORE PAYMENT TYPE
// ============================================================

if (
    savedAdvance.paymentType
) {

    const savedType =
        document.querySelector(
            'input[name="paymentType"][value="' +
            savedAdvance.paymentType +
            '"]'
        );

    if (savedType) {

        savedType.checked = true;

    }

}


// ============================================================
// 9. RESTORE PAYMENT MODE
// ============================================================

if (
    savedAdvance.paymentMode
) {

    const savedMode =
        document.querySelector(
            'input[name="paymentMode"][value="' +
            savedAdvance.paymentMode +
            '"]'
        );

    if (savedMode) {

        savedMode.checked = true;

    }

}


// ============================================================
// 10. RESTORE ADVANCE AMOUNT
// ============================================================

if (
    advanceAmountInput &&
    savedAdvance.advanceAmount !== undefined &&
    savedAdvance.advanceAmount !== ""
) {

    advanceAmountInput.value =
        savedAdvance.advanceAmount;

}


// ============================================================
// 11. RESTORE BALANCE
// ============================================================

if (
    balanceAmountInput &&
    savedAdvance.balanceAmount !== undefined
) {

    balanceAmountInput.value =
        "₹ " +
        toNumber(
            savedAdvance.balanceAmount
        ).toFixed(2);

}


// ============================================================
// 12. SAVE ADVANCE DATA
// ============================================================

function saveAdvanceData() {

    const selectedType =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );

    const selectedMode =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        );


    const paymentType =
        selectedType
            ? selectedType.value
            : "";


    const paymentMode =
        selectedMode
            ? selectedMode.value
            : "";


    let advanceAmount = 0;

    let balanceAmount =
        grandTotal;


    // ========================================================
    // READY CASH
    // ========================================================

    if (
        paymentType === "cash"
    ) {

        advanceAmount =
            grandTotal;

        balanceAmount =
            0;

    }


    // ========================================================
    // ADVANCE PAYMENT
    // ========================================================

    else if (
        paymentType === "advance"
    ) {

        advanceAmount =
            toNumber(
                advanceAmountInput
                    ? advanceAmountInput.value
                    : 0
            );


        balanceAmount =
            grandTotal -
            advanceAmount;


        if (balanceAmount < 0) {

            balanceAmount = 0;

        }

    }


    // ========================================================
    // ROUND VALUES
    // ========================================================

    advanceAmount =
        Math.round(
            advanceAmount * 100
        ) / 100;


    balanceAmount =
        Math.round(
            balanceAmount * 100
        ) / 100;


    // ========================================================
    // DATA OBJECT
    // ========================================================

    const advanceData = {

        paymentType:
            paymentType,

        paymentMode:
            paymentMode,

        // Original total BEFORE discount
        grandTotal:
            grandTotal,

        advanceAmount:
            advanceAmount,

        balanceAmount:
            balanceAmount,

        // Discount must start from original total
        discountBaseAmount:
            grandTotal

    };


    // ========================================================
    // SAVE CENTRAL STORAGE
    // ========================================================

    if (
        typeof savePageData === "function"
    ) {

        savePageData(
            "advance",
            advanceData
        );

    }


    // ========================================================
    // SAVE OLD LOCAL STORAGE
    // ========================================================

    localStorage.setItem(
        "paymentType",
        paymentType
    );

    localStorage.setItem(
        "paymentMode",
        paymentMode
    );

    localStorage.setItem(
        "grandTotal",
        String(grandTotal)
    );

    localStorage.setItem(
        "advanceAmount",
        String(advanceAmount)
    );

    localStorage.setItem(
        "balanceAmount",
        String(balanceAmount)
    );

    localStorage.setItem(
        "discountBaseAmount",
        String(grandTotal)
    );


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "------------------------------------------"
    );

    console.log(
        "ADVANCE DATA SAVED"
    );

    console.log(
        advanceData
    );

    console.log(
        "------------------------------------------"
    );


    return advanceData;

}


// ============================================================
// 13. PAYMENT TYPE CHANGE
// ============================================================

paymentTypes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {


                // ==================================================
                // READY CASH
                // ==================================================

                if (
                    this.value === "cash"
                ) {

                    console.log(
                        "READY CASH SELECTED"
                    );


                    if (
                        advanceSection
                    ) {

                        advanceSection.style.display =
                            "none";

                    }


                    if (
                        advanceAmountInput
                    ) {

                        advanceAmountInput.value =
                            "";

                    }


                    if (
                        balanceAmountInput
                    ) {

                        balanceAmountInput.value =
                            "₹ 0.00";

                    }


                    // Save immediately
                    saveAdvanceData();

                }


                // ==================================================
                // ADVANCE
                // ==================================================

                else if (
                    this.value === "advance"
                ) {

                    console.log(
                        "ADVANCE PAYMENT SELECTED"
                    );


                    if (
                        advanceSection
                    ) {

                        advanceSection.style.display =
                            "block";

                    }


                    // Restore saved amount
                    if (
                        advanceAmountInput &&
                        savedAdvance.advanceAmount !==
                            undefined &&
                        savedAdvance.advanceAmount !==
                            ""
                    ) {

                        advanceAmountInput.value =
                            savedAdvance.advanceAmount;

                    }

                }

            }
        );

    }
);


// ============================================================
// 14. PAYMENT MODE CHANGE
// ============================================================

paymentModes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                console.log(
                    "PAYMENT MODE:",
                    this.value
                );

                saveAdvanceData();

            }
        );

    }
);


// ============================================================
// 15. CALCULATE BALANCE BUTTON
// ============================================================

if (
    calculateBtn
) {

    calculateBtn.addEventListener(
        "click",
        function () {


            const selectedType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            // ----------------------------------------------------
            // Must select Advance
            // ----------------------------------------------------

            if (
                !selectedType ||
                selectedType.value !== "advance"
            ) {

                alert(
                    "Please select Advance payment."
                );

                return;

            }


            // ----------------------------------------------------
            // Get Advance Amount
            // ----------------------------------------------------

            const advance =
                toNumber(
                    advanceAmountInput
                        ? advanceAmountInput.value
                        : 0
                );


            // ----------------------------------------------------
            // Validate
            // ----------------------------------------------------

            if (
                advance <= 0
            ) {

                alert(
                    "Please enter Advance Amount."
                );

                if (
                    advanceAmountInput
                ) {

                    advanceAmountInput.focus();

                }

                return;

            }


            if (
                advance > grandTotal
            ) {

                alert(
                    "Advance cannot be greater than Grand Total."
                );

                if (
                    advanceAmountInput
                ) {

                    advanceAmountInput.focus();

                }

                return;

            }


            // ----------------------------------------------------
            // Calculate Balance
            // ----------------------------------------------------

            const balance =
                grandTotal -
                advance;


            // ----------------------------------------------------
            // Display
            // ----------------------------------------------------

            if (
                balanceAmountInput
            ) {

                balanceAmountInput.value =
                    "₹ " +
                    balance.toFixed(2);

            }


            // ----------------------------------------------------
            // Save
            // ----------------------------------------------------

            saveAdvanceData();


            console.log(
                "CALCULATED BALANCE:",
                balance
            );

        }
    );

}


// ============================================================
// 16. NEXT BUTTON
// ============================================================

if (
    nextBtn
) {

    nextBtn.addEventListener(
        "click",
        function () {


            // ==================================================
            // CHECK PAYMENT TYPE
            // ==================================================

            const selectedType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            if (!selectedType) {

                alert(
                    "Please select Payment Type."
                );

                return;

            }


            const paymentType =
                selectedType.value;


            // ==================================================
            // CHECK PAYMENT MODE
            // ==================================================

            const selectedMode =
                document.querySelector(
                    'input[name="paymentMode"]:checked'
                );


            if (!selectedMode) {

                alert(
                    "Please select Payment Mode."
                );

                return;

            }


            const paymentMode =
                selectedMode.value;


            // ==================================================
            // READY CASH
            // ==================================================

            if (
                paymentType === "cash"
            ) {

                const data = {

                    paymentType:
                        "cash",

                    paymentMode:
                        paymentMode,

                    grandTotal:
                        grandTotal,

                    advanceAmount:
                        grandTotal,

                    balanceAmount:
                        0,

                    discountBaseAmount:
                        grandTotal

                };


                if (
                    typeof savePageData === "function"
                ) {

                    savePageData(
                        "advance",
                        data
                    );

                }


                // Legacy values
                localStorage.setItem(
                    "paymentType",
                    "cash"
                );

                localStorage.setItem(
                    "paymentMode",
                    paymentMode
                );

                localStorage.setItem(
                    "grandTotal",
                    String(grandTotal)
                );

                localStorage.setItem(
                    "advanceAmount",
                    String(grandTotal)
                );

                localStorage.setItem(
                    "balanceAmount",
                    "0"
                );

                localStorage.setItem(
                    "discountBaseAmount",
                    String(grandTotal)
                );


                console.log(
                    "=========================================="
                );

                console.log(
                    "READY CASH - NEXT"
                );

                console.log(
                    data
                );

                console.log(
                    "=========================================="
                );

            }


            // ==================================================
            // ADVANCE PAYMENT
            // ==================================================

            else if (
                paymentType === "advance"
            ) {


                const advance =
                    toNumber(
                        advanceAmountInput
                            ? advanceAmountInput.value
                            : 0
                    );


                // ------------------------------------------------
                // Validate Advance
                // ------------------------------------------------

                if (
                    advance <= 0
                ) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    if (
                        advanceAmountInput
                    ) {

                        advanceAmountInput.focus();

                    }

                    return;

                }


                if (
                    advance > grandTotal
                ) {

                    alert(
                        "Advance cannot be greater than Grand Total."
                    );

                    if (
                        advanceAmountInput
                    ) {

                        advanceAmountInput.focus();

                    }

                    return;

                }


                // ------------------------------------------------
                // Calculate Balance
                // ------------------------------------------------

                const balance =
                    grandTotal -
                    advance;


                // ------------------------------------------------
                // Display
                // ------------------------------------------------

                if (
                    balanceAmountInput
                ) {

                    balanceAmountInput.value =
                        "₹ " +
                        balance.toFixed(2);

                }


                // ------------------------------------------------
                // Save
                // ------------------------------------------------

                const data = {

                    paymentType:
                        "advance",

                    paymentMode:
                        paymentMode,

                    grandTotal:
                        grandTotal,

                    advanceAmount:
                        advance,

                    balanceAmount:
                        balance,

                    discountBaseAmount:
                        grandTotal

                };


                if (
                    typeof savePageData === "function"
                ) {

                    savePageData(
                        "advance",
                        data
                    );

                }


                // Legacy storage
                localStorage.setItem(
                    "paymentType",
                    "advance"
                );

                localStorage.setItem(
                    "paymentMode",
                    paymentMode
                );

                localStorage.setItem(
                    "grandTotal",
                    String(grandTotal)
                );

                localStorage.setItem(
                    "advanceAmount",
                    String(advance)
                );

                localStorage.setItem(
                    "balanceAmount",
                    String(balance)
                );

                localStorage.setItem(
                    "discountBaseAmount",
                    String(grandTotal)
                );


                console.log(
                    "=========================================="
                );

                console.log(
                    "ADVANCE PAYMENT - NEXT"
                );

                console.log(
                    data
                );

                console.log(
                    "=========================================="
                );

            }


            // ==================================================
            // DEBUG COMPLETE BILL
            // ==================================================

            if (
                typeof getBillData === "function"
            ) {

                console.log(
                    "COMPLETE BILL AFTER ADVANCE:"
                );

                console.log(
                    getBillData()
                );

            }


            // ==================================================
            // GO TO DISCOUNT
            // ==================================================

            window.location.href =
                "discount.html";

        }
    );

}


// ============================================================
// 17. BACK BUTTON
// ============================================================

if (
    backBtn
) {

    backBtn.addEventListener(
        "click",
        function () {

            console.log(
                "BACK BUTTON CLICKED"
            );


            // Save current information
            // before leaving.

            const selectedType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            if (selectedType) {

                saveAdvanceData();

            }


            window.location.href =
                "personal.html";

        }
    );

}


// ============================================================
// 18. INITIALIZE PAGE
// ============================================================

function initializeAdvancePage() {

    const selectedType =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (
        selectedType &&
        selectedType.value === "advance"
    ) {

        if (
            advanceSection
        ) {

            advanceSection.style.display =
                "block";

        }

    }
    else {

        if (
            advanceSection
        ) {

            advanceSection.style.display =
                "none";

        }

    }


    // Always display original total
    displayGrandTotal();


    console.log(
        "=========================================="
    );

    console.log(
        "ADVANCE PAGE INITIALIZED"
    );

    console.log(
        "Original Total:",
        grandTotal
    );

    console.log(
        "Saved Advance:",
        savedAdvance
    );

    console.log(
        "=========================================="
    );

}


initializeAdvancePage();


// ============================================================
// 19. FINAL DEBUG
// ============================================================

console.log(
    "ADVANCE.JS LOADED SUCCESSFULLY"
);

console.log(
    "Original Total Used:",
    grandTotal
);
