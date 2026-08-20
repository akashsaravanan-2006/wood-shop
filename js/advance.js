// ===========================================
// ADVANCE.JS
// ===========================================
// Handles:
// 1. Ready Cash
// 2. Advance Payment
// 3. Cash / UPI
// 4. Saves data to storedata.js
// 5. Sends user to discount.html
// ===========================================


// ===========================================
// GET HTML ELEMENTS
// ===========================================

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


// ===========================================
// GET GRAND TOTAL
// ===========================================

let grandTotal =
    Number(
        localStorage.getItem("finalGrandTotal")
    );

if (!Number.isFinite(grandTotal)) {

    grandTotal =
        Number(
            localStorage.getItem("finalTotal")
        ) || 0;

}


// ===========================================
// DISPLAY GRAND TOTAL
// ===========================================

if (grandTotalInput) {

    grandTotalInput.value =
        "₹ " +
        grandTotal.toFixed(2);

}


// ===========================================
// LOAD SAVED ADVANCE DATA
// ===========================================

let savedAdvance = {};

if (
    typeof getPageData === "function"
) {

    savedAdvance =
        getPageData("advance") || {};

}


// ===========================================
// RESTORE PAYMENT TYPE
// ===========================================

if (savedAdvance.paymentType) {

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


// ===========================================
// RESTORE PAYMENT MODE
// ===========================================

if (savedAdvance.paymentMode) {

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


// ===========================================
// RESTORE ADVANCE AMOUNT
// ===========================================

if (
    advanceAmountInput &&
    savedAdvance.advanceAmount !== undefined &&
    savedAdvance.advanceAmount !== ""
) {

    advanceAmountInput.value =
        savedAdvance.advanceAmount;

}


// ===========================================
// RESTORE BALANCE
// ===========================================

if (
    balanceAmountInput &&
    savedAdvance.balanceAmount !== undefined
) {

    balanceAmountInput.value =
        "₹ " +
        Number(
            savedAdvance.balanceAmount
        ).toFixed(2);

}


// ===========================================
// SAVE ADVANCE DATA
// ===========================================

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


    // =====================================
    // DEFAULT VALUES
    // =====================================
    //
    // READY CASH:
    // Nothing is finalized yet.
    // Full grandTotal stays as the
    // "balance" so the Discount page
    // can correctly discount from it.
    // The actual amount collected is
    // decided AFTER discount, in
    // discount.js.
    //
    // This matches the comment below:
    // "Do NOT permanently calculate
    // advance here because Discount
    // comes after this page."
    // =====================================

    let advance = 0;
    let balance = grandTotal;


    // =====================================
    // ADVANCE PAYMENT
    // =====================================

    if (
        paymentType === "advance"
    ) {

        advance =
            Number(
                advanceAmountInput?.value
            ) || 0;


        balance =
            grandTotal -
            advance;


        if (balance < 0) {

            balance = 0;

        }

    }

    // NOTE: paymentType === "cash" uses
    // the defaults above (advance = 0,
    // balance = grandTotal) intentionally.


    // =====================================
    // CENTRAL STORAGE
    // =====================================

    if (
        typeof savePageData === "function"
    ) {

        savePageData(
            "advance",
            {

                paymentType:
                    paymentType,

                paymentMode:
                    paymentMode,

                grandTotal:
                    grandTotal,

                advanceAmount:
                    advance,

                balanceAmount:
                    balance,

                // IMPORTANT
                // Discount page uses this.
                discountBaseAmount:
                    grandTotal

            }
        );

    }


    // =====================================
    // OLD LOCAL STORAGE
    // =====================================

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
        String(advance)
    );

    localStorage.setItem(
        "balanceAmount",
        String(balance)
    );

    // IMPORTANT
    localStorage.setItem(
        "discountBaseAmount",
        String(grandTotal)
    );


    return {

        paymentType:
            paymentType,

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

}


// ===========================================
// PAYMENT TYPE CHANGE
// ===========================================

paymentTypes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {


                // =================================
                // READY CASH
                // =================================

                if (
                    this.value === "cash"
                ) {

                    if (advanceSection) {

                        advanceSection.style.display =
                            "none";

                    }


                    if (advanceAmountInput) {

                        advanceAmountInput.value =
                            "";

                    }


                    if (balanceAmountInput) {

                        // Balance is the FULL grand
                        // total at this stage - it
                        // only becomes 0 after the
                        // discount step decides the
                        // final cash amount.
                        balanceAmountInput.value =
                            "₹ " +
                            grandTotal.toFixed(2);

                    }


                    saveAdvanceData();

                }


                // =================================
                // ADVANCE
                // =================================

                if (
                    this.value === "advance"
                ) {

                    if (advanceSection) {

                        advanceSection.style.display =
                            "block";

                    }


                    if (
                        savedAdvance.advanceAmount !==
                        undefined &&
                        savedAdvance.advanceAmount !== ""
                    ) {

                        advanceAmountInput.value =
                            savedAdvance.advanceAmount;

                    }

                }

            }
        );

    }
);


// ===========================================
// PAYMENT MODE CHANGE
// ===========================================

paymentModes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                saveAdvanceData();

            }
        );

    }
);


// ===========================================
// CALCULATE BALANCE
// ===========================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        function () {


            const selectedType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            if (
                !selectedType ||
                selectedType.value !== "advance"
            ) {

                alert(
                    "Please select Advance payment."
                );

                return;

            }


            const advance =
                Number(
                    advanceAmountInput.value
                ) || 0;


            // =================================
            // VALIDATION
            // =================================

            if (advance <= 0) {

                alert(
                    "Please enter Advance Amount."
                );

                advanceAmountInput.focus();

                return;

            }


            if (advance > grandTotal) {

                alert(
                    "Advance cannot be greater than Grand Total."
                );

                advanceAmountInput.focus();

                return;

            }


            // =================================
            // CALCULATE BALANCE
            // =================================

            const balance =
                grandTotal -
                advance;


            // =================================
            // DISPLAY
            // =================================

            balanceAmountInput.value =
                "₹ " +
                balance.toFixed(2);


            // =================================
            // SAVE
            // =================================

            saveAdvanceData();

        }
    );

}


// ===========================================
// NEXT BUTTON
// ===========================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {


            const selectedType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            // =================================
            // PAYMENT TYPE
            // =================================

            if (!selectedType) {

                alert(
                    "Please select Payment Type."
                );

                return;

            }


            const paymentType =
                selectedType.value;


            // =================================
            // PAYMENT MODE
            // =================================

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


            // =================================
            // READY CASH
            // =================================
            //
            // Do NOT finalize advance/balance
            // here. Keep balance = grandTotal
            // so the Discount page can discount
            // from the full amount. discount.js
            // will finalize advance = final
            // amount, balance = 0 once the user
            // completes the discount step.
            // =================================

            if (
                paymentType === "cash"
            ) {

                savePageData(
                    "advance",
                    {

                        paymentType:
                            "cash",

                        paymentMode:
                            paymentMode,

                        grandTotal:
                            grandTotal,

                        advanceAmount:
                            0,

                        balanceAmount:
                            grandTotal,

                        discountBaseAmount:
                            grandTotal

                    }
                );


                localStorage.setItem(
                    "paymentType",
                    "cash"
                );

                localStorage.setItem(
                    "paymentMode",
                    paymentMode
                );

                localStorage.setItem(
                    "advanceAmount",
                    "0"
                );

                localStorage.setItem(
                    "balanceAmount",
                    String(grandTotal)
                );

                localStorage.setItem(
                    "discountBaseAmount",
                    String(grandTotal)
                );

            }


            // =================================
            // ADVANCE
            // =================================

            if (
                paymentType === "advance"
            ) {

                const advance =
                    Number(
                        advanceAmountInput.value
                    ) || 0;


                if (advance <= 0) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    advanceAmountInput.focus();

                    return;

                }


                if (advance > grandTotal) {

                    alert(
                        "Advance cannot be greater than Grand Total."
                    );

                    advanceAmountInput.focus();

                    return;

                }


                const balance =
                    grandTotal -
                    advance;


                balanceAmountInput.value =
                    "₹ " +
                    balance.toFixed(2);


                savePageData(
                    "advance",
                    {

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

                    }
                );


                localStorage.setItem(
                    "paymentType",
                    "advance"
                );

                localStorage.setItem(
                    "paymentMode",
                    paymentMode
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

            }


            // =================================
            // SAVE GRAND TOTAL
            // =================================

            localStorage.setItem(
                "grandTotal",
                String(grandTotal)
            );


            // =================================
            // DEBUG
            // =================================

            console.log(
                "================================"
            );

            console.log(
                "ADVANCE DATA"
            );

            if (
                typeof getPageData === "function"
            ) {

                console.log(
                    getPageData("advance")
                );

            }


            console.log(
                "COMPLETE BILL"
            );

            if (
                typeof getBillData === "function"
            ) {

                console.log(
                    getBillData()
                );

            }

            console.log(
                "================================"
            );


            // =================================
            // GO TO DISCOUNT
            // =================================

            window.location.href =
                "discount.html";

        }
    );

}


// ===========================================
// BACK BUTTON
// ===========================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            saveAdvanceData();

            window.location.href =
                "personal.html";

        }
    );

}


// ===========================================
// INITIAL DISPLAY
// ===========================================

function initializeAdvancePage() {

    const selectedType =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (
        selectedType &&
        selectedType.value === "advance"
    ) {

        if (advanceSection) {

            advanceSection.style.display =
                "block";

        }

    }
    else {

        if (advanceSection) {

            advanceSection.style.display =
                "none";

        }

    }

}


initializeAdvancePage();


console.log(
    "ADVANCE.JS LOADED SUCCESSFULLY"
);
