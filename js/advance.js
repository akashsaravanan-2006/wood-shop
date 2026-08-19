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

        // Hide Advance section

        advanceSection.style.display =
            "none";


        // Clear advance values

        advanceAmountInput.value = "";

        balanceAmountInput.value = "";


        // Full payment

        localStorage.setItem(
            "advanceAmount",
            grandTotal
        );

        localStorage.setItem(
            "balanceAmount",
            0
        );


        return;
    }


    // =====================================
    // ADVANCE
    // =====================================

    if (
        selectedPaymentType.value === "advance"
    ) {

        // Show Advance section

        advanceSection.style.display =
            "block";


        // Do not automatically fill amount

        advanceAmountInput.focus();

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

calculateBtn.addEventListener(
    "click",
    function () {

        const selectedPaymentType =
            document.querySelector(
                'input[name="paymentType"]:checked'
            );


        // Must select Advance

        if (
            !selectedPaymentType ||
            selectedPaymentType.value !== "advance"
        ) {

            alert(
                "Please select Advance payment."
            );

            return;
        }


        // Get Advance Amount

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
        // BALANCE
        // =====================================

        const balance =
            grandTotal - advance;


        // =====================================
        // DISPLAY
        // =====================================

        balanceAmountInput.value =
            "₹ " + balance;


        // =====================================
        // SAVE
        // =====================================

        localStorage.setItem(
            "advanceAmount",
            advance
        );

        localStorage.setItem(
            "balanceAmount",
            balance
        );

    }
);


// =========================================
// NEXT BUTTON
// =========================================

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

        if (
            paymentType === "cash"
        ) {

            localStorage.setItem(
                "advanceAmount",
                grandTotal
            );

            localStorage.setItem(
                "balanceAmount",
                0
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


            // Save

            localStorage.setItem(
                "advanceAmount",
                advance
            );

            localStorage.setItem(
                "balanceAmount",
                balance
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
        // SAVE GRAND TOTAL
        // =====================================

        localStorage.setItem(
            "grandTotal",
            grandTotal
        );

        localStorage.setItem(
            "finalTotal",
            grandTotal
        );


        // =====================================
        // GO TO BILL
        // =====================================

        window.location.href =
            "bill.html";

    }
);


// =========================================
// BACK BUTTON
// =========================================

backBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "personal.html";

    }
);


// =========================================
// INITIAL LOAD
// =========================================

updatePaymentType();
