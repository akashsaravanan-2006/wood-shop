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
// GET ORIGINAL GRAND TOTAL
// IMPORTANT:
// ADVANCE MUST NEVER CHANGE THIS VALUE
// =========================================

let grandTotal =
    Number(localStorage.getItem("grandTotal"));

// If grandTotal is not available,
// use finalTotal only as the original bill total.
if (!grandTotal || grandTotal <= 0) {

    grandTotal =
        Number(localStorage.getItem("finalTotal")) || 0;

}


// =========================================
// DISPLAY GRAND TOTAL
// =========================================

if (grandTotalInput) {

    grandTotalInput.value =
        "₹ " + grandTotal.toFixed(2);

}


// =========================================
// SAVE ORIGINAL GRAND TOTAL
// =========================================

localStorage.setItem(
    "grandTotal",
    String(grandTotal)
);


// =========================================
// CLEAR OLD DISCOUNT DATA
// New discount will be handled on discount.html
// =========================================

localStorage.removeItem("discountAmount");
localStorage.removeItem("discountApplied");
localStorage.removeItem("finalGrandTotal");


// =========================================
// UPDATE PAYMENT TYPE
// =========================================

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

    if (selected.value === "cash") {

        if (advanceSection) {

            advanceSection.style.display =
                "none";

        }


        if (advanceAmountInput) {

            advanceAmountInput.value = "";

        }


        if (balanceAmountInput) {

            balanceAmountInput.value = "";

        }


        // Full payment

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

            advanceSection.style.display =
                "block";

        }


        localStorage.setItem(
            "paymentType",
            "advance"
        );

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
// CALCULATE BALANCE
// =========================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        function () {

            const selected =
                document.querySelector(
                    'input[name="paymentType"]:checked'
                );


            // Must select Advance

            if (
                !selected ||
                selected.value !== "advance"
            ) {

                alert(
                    "Please select Advance payment."
                );

                return;
            }


            // Get advance

            const advance =
                Number(
                    advanceAmountInput.value
                ) || 0;


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
            // BALANCE
            // =====================================

            const balance =
                grandTotal - advance;


            // =====================================
            // DISPLAY
            // =====================================

            balanceAmountInput.value =
                "₹ " + balance.toFixed(2);


            // =====================================
            // SAVE
            // =====================================

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

            // =====================================
            // PAYMENT TYPE
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
            // PAYMENT MODE
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


            // =====================================
            // ADVANCE
            // =====================================

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


            // =====================================
            // SAVE PAYMENT DETAILS
            // =====================================

            localStorage.setItem(
                "paymentType",
                paymentType
            );

            localStorage.setItem(
                "paymentMode",
                paymentMode
            );


            // =====================================
            // SAVE ORIGINAL GRAND TOTAL
            // IMPORTANT:
            // DO NOT SAVE ADVANCE AS GRAND TOTAL
            // =====================================

            localStorage.setItem(
                "grandTotal",
                String(grandTotal)
            );


            // =====================================
            // GO TO DISCOUNT PAGE
            // =====================================

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
