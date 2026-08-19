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

const advanceSection = document.getElementById("advanceSection");

const advanceAmountInput = document.getElementById("advanceAmount");

const balanceAmountInput = document.getElementById("balanceAmount");

const calculateBtn = document.getElementById("calculateBtn");

const nextBtn = document.getElementById("nextBtn");

const backBtn = document.getElementById("backBtn");


// =========================================
// GET GRAND TOTAL
// =========================================

let grandTotal = Number(
    localStorage.getItem("finalTotal")
) || 0;


// =========================================
// DISPLAY GRAND TOTAL
// =========================================

if (grandTotalInput) {
    grandTotalInput.value = "₹ " + grandTotal.toFixed(2);
}


// =========================================
// UPDATE PAYMENT TYPE
// =========================================

function updatePaymentType() {

    const selected = document.querySelector(
        'input[name="paymentType"]:checked'
    );

    if (!selected) {
        return;
    }


    // =====================================
    // READY CASH
    // =====================================

    if (selected.value === "cash") {

        if (advanceSection) {
            advanceSection.style.display = "none";
        }

        if (advanceAmountInput) {
            advanceAmountInput.value = "";
        }

        if (balanceAmountInput) {
            balanceAmountInput.value = "";
        }

        localStorage.setItem(
            "paymentType",
            "cash"
        );

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

    if (selected.value === "advance") {

        if (advanceSection) {
            advanceSection.style.display = "block";
        }

        localStorage.setItem(
            "paymentType",
            "advance"
        );
    }
}


// =========================================
// PAYMENT TYPE CHANGE
// =========================================

paymentTypes.forEach(function (radio) {

    radio.addEventListener(
        "change",
        updatePaymentType
    );

});


// =========================================
// PAYMENT MODE CHANGE
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
// CALCULATE BALANCE
// =========================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        function () {

            const selected = document.querySelector(
                'input[name="paymentType"]:checked'
            );


            // Must select Advance

            if (!selected || selected.value !== "advance") {

                alert(
                    "Please select Advance payment."
                );

                return;
            }


            // Get advance amount

            const advance = Number(
                advanceAmountInput.value
            ) || 0;


            // Validate

            if (advance <= 0) {

                alert(
                    "Please enter Advance Amount."
                );

                advanceAmountInput.focus();

                return;
            }


            // Advance cannot exceed grand total

            if (advance > grandTotal) {

                alert(
                    "Advance cannot be greater than Grand Total."
                );

                advanceAmountInput.focus();

                return;
            }


            // Calculate balance

            const balance = grandTotal - advance;


            // Display balance

            balanceAmountInput.value =
                "₹ " + balance.toFixed(2);


            // Save values

            localStorage.setItem(
                "advanceAmount",
                String(advance)
            );

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
            // PAYMENT TYPE
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
            // ADVANCE PAYMENT
            // =================================

            if (paymentType === "advance") {

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
                    grandTotal - advance;


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
            // SAVE PAYMENT DETAILS
            // =================================

            localStorage.setItem(
                "paymentType",
                paymentType
            );

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
            // CLEAR OLD DISCOUNT DATA
            // =================================

            localStorage.removeItem(
                "discountAmount"
            );

            localStorage.removeItem(
                "discountApplied"
            );

            localStorage.removeItem(
                "finalGrandTotal"
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
