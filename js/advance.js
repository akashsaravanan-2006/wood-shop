// =========================================
// ADVANCE.JS
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const grandTotalInput = document.getElementById("grandTotal");

const paymentTypes = document.querySelectorAll(
    'input[name="paymentType"]'
);

const paymentModes = document.querySelectorAll(
    'input[name="paymentMode"]'
);

const advanceSection = document.getElementById(
    "advanceSection"
);

const advanceAmountInput = document.getElementById(
    "advanceAmount"
);

const balanceAmountInput = document.getElementById(
    "balanceAmount"
);

const calculateBtn = document.getElementById(
    "calculateBtn"
);

const nextBtn = document.getElementById(
    "nextBtn"
);

const backBtn = document.getElementById(
    "backBtn"
);


// =========================================
// GET GRAND TOTAL
// =========================================

// Get the total created on the previous page
const grandTotal = Number(
    localStorage.getItem("finalTotal")
) || 0;


// =========================================
// DISPLAY GRAND TOTAL
// =========================================

if (grandTotalInput) {

    grandTotalInput.value =
        "₹ " + grandTotal.toFixed(2);

}


// =========================================
// PAYMENT TYPE
// READY CASH / ADVANCE
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

    if (selectedPaymentType.value === "cash") {

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


        // Full amount paid

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

    if (selectedPaymentType.value === "advance") {

        // Show advance section

        if (advanceSection) {

            advanceSection.style.display =
                "block";

        }

    }

}


// =========================================
// PAYMENT TYPE EVENTS
// =========================================

paymentTypes.forEach(function (radio) {

    radio.addEventListener(
        "change",
        updatePaymentType
    );

});


// =========================================
// PAYMENT MODE
// CASH / UPI
// =========================================

paymentModes.forEach(function (radio) {

    radio.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "paymentMode",
                this.value
            );

        }
    );

});


// =========================================
// CALCULATE BALANCE BUTTON
// =========================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        function () {


            // =================================
            // CHECK PAYMENT TYPE
            // =================================

            const selectedPaymentType =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            if (
                !selectedPaymentType ||
                selectedPaymentType.value !== "advance"
            ) {

                alert(
                    "Please select Advance payment."
                );

                return;

            }


            // =================================
            // GET ADVANCE AMOUNT
            // =================================

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
                grandTotal - advance;


            // =================================
            // DISPLAY BALANCE
            // =================================

            balanceAmountInput.value =
                "₹ " + balance.toFixed(2);


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
    );

}


// =========================================
// NEXT BUTTON
// =========================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {


            // =================================
            // GET PAYMENT TYPE
            // =================================

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


            // =================================
            // GET PAYMENT MODE
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

            if (paymentType === "cash") {

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

            if (paymentType === "advance") {


                const advance =
                    Number(
                        advanceAmountInput.value
                    ) || 0;


                // Check advance amount

                if (advance <= 0) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    advanceAmountInput.focus();

                    return;

                }


                // Check maximum amount

                if (advance > grandTotal) {

                    alert(
                        "Advance cannot be greater than Grand Total."
                    );

                    advanceAmountInput.focus();

                    return;

                }


                // Calculate balance

                const balance =
                    grandTotal - advance;


                // Save advance

                localStorage.setItem(
                    "advanceAmount",
                    String(advance)
                );


                // Save balance

                localStorage.setItem(
                    "balanceAmount",
                    String(balance)
                );

            }


            // =================================
            // SAVE PAYMENT TYPE
            // =================================

            localStorage.setItem(
                "paymentType",
                paymentType
            );


            // =================================
            // SAVE PAYMENT MODE
            // =================================

            localStorage.setItem(
                "paymentMode",
                paymentMode
            );


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
            // INITIAL DISCOUNT VALUES
            // =================================

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


            // =================================
            // GO TO DISCOUNT PAGE
            // =================================

            window.location.href =
                "discount.html";

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
