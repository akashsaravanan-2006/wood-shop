// ===========================================
// ADVANCE.JS
// CENTRAL BILL STORAGE VERSION
// ===========================================


// ===========================================
// CHECK STORE DATA
// ===========================================

if (
    typeof getPageData !== "function" ||
    typeof savePageData !== "function"
) {

    console.error(
        "ERROR: storedata.js is not loaded before advance.js"
    );

}


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
// GET PREVIOUS BILL TOTAL
// ===========================================

function getGrandTotal() {

    const bill =
        getBillData();

    let total = 0;


    // First priority:
    // Total saved by previous page

    if (
        bill.totals &&
        bill.totals.grandTotal !== undefined
    ) {

        total =
            Number(
                bill.totals.grandTotal
            ) || 0;

    }


    // Existing localStorage compatibility

    if (
        total === 0
    ) {

        total =
            Number(
                localStorage.getItem(
                    "finalTotal"
                )
            ) || 0;

    }


    if (
        total === 0
    ) {

        total =
            Number(
                localStorage.getItem(
                    "woodTotal"
                )
            ) || 0;

    }


    return total;

}


let grandTotal =
    getGrandTotal();


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

const savedAdvance =
    getPageData("advance");


console.log(
    "Loaded Advance Data:",
    savedAdvance
);


// ===========================================
// RESTORE PAYMENT TYPE
// ===========================================

if (
    savedAdvance.paymentType
) {

    const paymentTypeRadio =
        document.querySelector(
            'input[name="paymentType"][value="' +
            savedAdvance.paymentType +
            '"]'
        );


    if (paymentTypeRadio) {

        paymentTypeRadio.checked =
            true;

    }

}


// ===========================================
// RESTORE PAYMENT MODE
// ===========================================

if (
    savedAdvance.paymentMode
) {

    const paymentModeRadio =
        document.querySelector(
            'input[name="paymentMode"][value="' +
            savedAdvance.paymentMode +
            '"]'
        );


    if (paymentModeRadio) {

        paymentModeRadio.checked =
            true;

    }

}


// ===========================================
// RESTORE ADVANCE AMOUNT
// ===========================================

if (
    advanceAmountInput &&
    savedAdvance.advanceAmount !== undefined
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

    const balance =
        Number(
            savedAdvance.balanceAmount
        ) || 0;


    balanceAmountInput.value =
        "₹ " +
        balance.toFixed(2);

}


// ===========================================
// SAVE ADVANCE DATA
// ===========================================

function saveAdvanceData() {

    const selectedPaymentType =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    const selectedPaymentMode =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        );


    const paymentType =
        selectedPaymentType
            ? selectedPaymentType.value
            : "";


    const paymentMode =
        selectedPaymentMode
            ? selectedPaymentMode.value
            : "";


    const advance =
        Number(
            advanceAmountInput?.value
        ) || 0;


    let balance = 0;


    if (
        paymentType === "cash"
    ) {

        balance = 0;

    }
    else {

        balance =
            grandTotal -
            advance;

    }


    // =====================================
    // CENTRAL STORAGE
    // =====================================

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


    // =====================================
    // OLD STORAGE
    // Keep for existing bill code
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


    console.log(
        "Advance data saved:"
    );

    console.log(
        getPageData("advance")
    );

}


// ===========================================
// UPDATE PAYMENT TYPE
// ===========================================

function updatePaymentType() {

    const selected =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (!selected) {

        return;

    }


    // =====================================
    // READY CASH
    // =====================================

    if (
        selected.value === "cash"
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

            balanceAmountInput.value =
                "";

        }


        // Full amount paid
        const advance =
            grandTotal;


        const balance =
            0;


        savePageData(
            "advance",
            {

                paymentType:
                    "cash",

                paymentMode:
                    document.querySelector(
                        'input[name="paymentMode"]:checked'
                    )?.value || "",

                grandTotal:
                    grandTotal,

                advanceAmount:
                    advance,

                balanceAmount:
                    balance

            }
        );


        localStorage.setItem(
            "paymentType",
            "cash"
        );

        localStorage.setItem(
            "advanceAmount",
            String(advance)
        );

        localStorage.setItem(
            "balanceAmount",
            "0"
        );


        return;

    }


    // =====================================
    // ADVANCE
    // =====================================

    if (
        selected.value === "advance"
    ) {

        if (advanceSection) {

            advanceSection.style.display =
                "block";

        }


        // Do not erase saved value
        if (
            savedAdvance.advanceAmount !==
            undefined &&
            advanceAmountInput &&
            advanceAmountInput.value === ""
        ) {

            advanceAmountInput.value =
                savedAdvance.advanceAmount;

        }

    }

}


// ===========================================
// PAYMENT TYPE CHANGE
// ===========================================

paymentTypes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                updatePaymentType();

                saveAdvanceData();

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
// ADVANCE AMOUNT INPUT
// ===========================================

if (advanceAmountInput) {

    advanceAmountInput.addEventListener(
        "input",
        function () {

            const advance =
                Number(
                    this.value
                ) || 0;


            if (
                advance > grandTotal
            ) {

                balanceAmountInput.value =
                    "₹ 0.00";

                return;

            }


            const balance =
                grandTotal -
                advance;


            if (balanceAmountInput) {

                balanceAmountInput.value =
                    "₹ " +
                    balance.toFixed(2);

            }


            saveAdvanceData();

        }
    );

}


// ===========================================
// CALCULATE BALANCE BUTTON
// ===========================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        function () {

            const selected =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            if (
                !selected ||
                selected.value !== "advance"
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

            const selectedPaymentType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            // =================================
            // PAYMENT TYPE VALIDATION
            // =================================

            if (!selectedPaymentType) {

                alert(
                    "Please select Payment Type."
                );

                return;

            }


            const paymentType =
                selectedPaymentType.value;


            // =================================
            // PAYMENT MODE
            // =================================

            const selectedPaymentMode =
                document.querySelector(
                    'input[name="paymentMode"]:checked'
                );


            if (!selectedPaymentMode) {

                alert(
                    "Please select Payment Mode."
                );

                return;

            }


            const paymentMode =
                selectedPaymentMode.value;


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
            // ADVANCE PAYMENT
            // =================================

            if (
                paymentType === "advance"
            ) {

                const advance =
                    Number(
                        advanceAmountInput.value
                    ) || 0;


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


            localStorage.setItem(
                "finalTotal",
                String(grandTotal)
            );


            // =================================
            // DEBUG
            // =================================

            console.log(
                "================================"
            );

            console.log(
                "ADVANCE DATA SAVED"
            );

            console.log(
                getPageData("advance")
            );

            console.log(
                "COMPLETE BILL DATA"
            );

            console.log(
                getBillData()
            );

            console.log(
                "================================"
            );


            // =================================
            // GO TO DISCOUNT PAGE
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
// INITIAL LOAD
// ===========================================

updatePaymentType();


console.log(
    "ADVANCE PAGE READY"
);
