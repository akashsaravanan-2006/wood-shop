// ===========================================
// ADVANCE.JS
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
        localStorage.getItem("finalTotal")
    ) || 0;


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


    let advance = 0;
    let balance = 0;


    // =====================================
    // READY CASH
    // =====================================

    if (
        paymentType === "cash"
    ) {

        advance =
            grandTotal;

        balance =
            0;

    }


    // =====================================
    // ADVANCE
    // =====================================

    if (
        paymentType === "advance"
    ) {

        advance =
            Number(
                advanceAmountInput.value
            ) || 0;

        balance =
            grandTotal -
            advance;

    }


    // =====================================
    // SAVE TO CENTRAL STORAGE
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
                    balance

            }
        );

    }


    // =====================================
    // OLD LOCAL STORAGE
    // Keep because your existing
    // bill/cbill may use these
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
            balance
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

                if (
                    this.value === "cash"
                ) {

                    // Hide advance section

                    if (advanceSection) {

                        advanceSection.style.display =
                            "none";

                    }


                    // Clear only the input display

                    if (advanceAmountInput) {

                        advanceAmountInput.value =
                            "";

                    }


                    if (balanceAmountInput) {

                        balanceAmountInput.value =
                            "";

                    }


                    saveAdvanceData();

                }


                // =================================
                // ADVANCE SELECTED
                // =================================

                if (
                    this.value === "advance"
                ) {

                    if (advanceSection) {

                        advanceSection.style.display =
                            "block";

                    }


                    // Restore saved amount

                    if (
                        savedAdvance.advanceAmount !==
                        undefined &&
                        savedAdvance.advanceAmount !== ""
                    ) {

                        advanceAmountInput.value =
                            savedAdvance.advanceAmount;

                    }


                    saveAdvanceData();

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


            // Must select Advance

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

            if (
                advance <= 0
            ) {

                alert(
                    "Please enter Advance Amount."
                );

                advanceAmountInput.focus();

                return;

            }


            if (
                advance > grandTotal
            ) {

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
            // PAYMENT TYPE VALIDATION
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
                            grandTotal,

                        balanceAmount:
                            0

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
                    String(grandTotal)
                );

                localStorage.setItem(
                    "balanceAmount",
                    "0"
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


                // Validation

                if (
                    advance <= 0
                ) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    advanceAmountInput.focus();

                    return;

                }


                if (
                    advance > grandTotal
                ) {

                    alert(
                        "Advance cannot be greater than Grand Total."
                    );

                    advanceAmountInput.focus();

                    return;

                }


                const balance =
                    grandTotal -
                    advance;


                // =================================
                // DISPLAY BALANCE
                // =================================

                balanceAmountInput.value =
                    "₹ " +
                    balance.toFixed(2);


                // =================================
                // SAVE CENTRAL DATA
                // =================================

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
                            balance

                    }
                );


                // =================================
                // OLD STORAGE
                // =================================

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

            // Save before leaving

            saveAdvanceData();


            // Go back to Personal

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


// ===========================================
// START
// ===========================================

initializeAdvancePage();


console.log(
    "ADVANCE.JS LOADED SUCCESSFULLY"
);
