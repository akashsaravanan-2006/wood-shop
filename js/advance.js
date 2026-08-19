// =========================================
// ADVANCE.JS
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

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


// =========================================
// GET GRAND TOTAL
// =========================================

const grandTotal =
    Math.round(
        Number(
            localStorage.getItem("finalTotal")
        ) || 0
    );


// =========================================
// DISPLAY GRAND TOTAL
// =========================================

if (grandTotalInput) {

    grandTotalInput.value =
        "₹ " + grandTotal;

}


// =========================================
// PAYMENT TYPE CHANGE
// =========================================

function updatePaymentType() {

    const selectedPaymentType =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (!selectedPaymentType) {

        return;

    }


    // =====================================
    // READY CASH
    // =====================================

    if (
        selectedPaymentType.value === "cash"
    ) {

        // Hide advance section

        if (advanceSection) {

            advanceSection.style.display =
                "none";

        }


        // Clear advance inputs

        if (advanceAmountInput) {

            advanceAmountInput.value = "";

        }


        if (balanceAmountInput) {

            balanceAmountInput.value = "";

        }


        // Full amount is paid

        localStorage.setItem(
            "advanceAmount",
            String(grandTotal)
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
        selectedPaymentType.value === "advance"
    ) {

        // Show advance section

        if (advanceSection) {

            advanceSection.style.display =
                "block";

        }


        // Do not automatically enter amount

        if (advanceAmountInput) {

            advanceAmountInput.focus();

        }

    }

}


// =========================================
// PAYMENT TYPE EVENTS
// =========================================

paymentTypes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            updatePaymentType
        );

    }
);


// =========================================
// PAYMENT MODE
// CASH / UPI
// =========================================

paymentModes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                localStorage.setItem(
                    "paymentMode",
                    this.value
                );

            }
        );

    }
);


// =========================================
// CALCULATE BALANCE
// =========================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        function () {

            const selectedPaymentType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            // =====================================
            // CHECK PAYMENT TYPE
            // =====================================

            if (
                !selectedPaymentType ||
                selectedPaymentType.value !== "advance"
            ) {

                alert(
                    "Please select Advance payment."
                );

                return;

            }


            // =====================================
            // GET ADVANCE AMOUNT
            // =====================================

            const advance =
                Math.round(
                    Number(
                        advanceAmountInput.value
                    ) || 0
                );


            // =====================================
            // VALIDATION
            // =====================================

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


            // =====================================
            // CALCULATE BALANCE
            // =====================================

            const balance =
                grandTotal - advance;


            // =====================================
            // DISPLAY BALANCE
            // =====================================

            balanceAmountInput.value =
                "₹ " + balance;


            // =====================================
            // SAVE ADVANCE
            // =====================================

            localStorage.setItem(
                "advanceAmount",
                String(advance)
            );


            // =====================================
            // SAVE BALANCE
            // =====================================

            localStorage.setItem(
                "balanceAmount",
                String(balance)
            );

        }
    );

}


// =========================================
// NEXT BUTTON
// =========================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {


            // =====================================
            // GET PAYMENT TYPE
            // =====================================

            const selectedPaymentType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            if (!selectedPaymentType) {

                alert(
                    "Please select Payment Type."
                );

                return;

            }


            const paymentType =
                selectedPaymentType.value;


            // =====================================
            // GET PAYMENT MODE
            // =====================================

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


            // =====================================
            // READY CASH
            // =====================================

            if (
                paymentType === "cash"
            ) {

                // Full payment

                localStorage.setItem(
                    "advanceAmount",
                    String(grandTotal)
                );


                // No balance

                localStorage.setItem(
                    "balanceAmount",
                    "0"
                );

            }


            // =====================================
            // ADVANCE
            // =====================================

            if (
                paymentType === "advance"
            ) {

                const advance =
                    Math.round(
                        Number(
                            advanceAmountInput.value
                        ) || 0
                    );


                // =================================
                // CHECK ADVANCE
                // =================================

                if (advance <= 0) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    advanceAmountInput.focus();

                    return;

                }


                // =================================
                // CHECK ADVANCE LIMIT
                // =================================

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
                    grandTotal - advance;


                // =================================
                // DISPLAY BALANCE
                // =================================

                if (balanceAmountInput) {

                    balanceAmountInput.value =
                        "₹ " + balance;

                }


                // =================================
                // SAVE ADVANCE
                // =================================

                localStorage.setItem(
                    "advanceAmount",
                    String(advance)
                );


                // =================================
                // SAVE BALANCE
                // =================================

                localStorage.setItem(
                    "balanceAmount",
                    String(balance)
                );

            }


            // =====================================
            // SAVE PAYMENT TYPE
            // =====================================

            localStorage.setItem(
                "paymentType",
                paymentType
            );


            // =====================================
            // SAVE PAYMENT MODE
            // =====================================

            localStorage.setItem(
                "paymentMode",
                paymentMode
            );


            // =====================================
            // SAVE GRAND TOTAL
            // =====================================

            localStorage.setItem(
                "grandTotal",
                String(grandTotal)
            );


            localStorage.setItem(
                "finalTotal",
                String(grandTotal)
            );


            // =====================================
            // RESET DISCOUNT FOR NEW BILL FLOW
            // =====================================

            localStorage.setItem(
                "discountAmount",
                "0"
            );


            localStorage.setItem(
                "discountApplied",
                "false"
            );


            localStorage.setItem(
                "finalGrandTotal",
                String(grandTotal)
            );


            // =====================================
            // GO TO DISCOUNT PAGE
            // =====================================

            // =====================================
// GO TO DISCOUNT PAGE
// =====================================

window.location.assign("./discount.html");

        }
    );

}


// =========================================
// BACK BUTTON
// =========================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "personal.html";

        }
    );

}


// =========================================
// INITIAL LOAD
// =========================================

updatePaymentType();
