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
//
// No discount here.
// Grand Total comes directly from the
// previous wood calculation.
// =========================================

const originalGrandTotal =
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
        "₹ " + originalGrandTotal;
}


// =========================================
// CLEAR OLD DISCOUNT DATA
// =========================================
//
// Important:
// If an old discount was saved in
// localStorage, remove it so it cannot
// appear accidentally in the bill.
// =========================================

localStorage.removeItem("discountAmount");


// =========================================
// SAVE GRAND TOTAL
// =========================================

localStorage.setItem(
    "grandTotal",
    originalGrandTotal
);

localStorage.setItem(
    "finalTotal",
    originalGrandTotal
);


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

        if (advanceSection) {

            advanceSection.style.display =
                "none";
        }

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


        // Clear advance input

        if (advanceAmountInput) {

            advanceAmountInput.value =
                "";
        }


        // Balance is zero

        if (balanceAmountInput) {

            balanceAmountInput.value =
                "₹ 0";
        }


        // Full amount is paid

        localStorage.setItem(
            "advanceAmount",
            originalGrandTotal
        );

        localStorage.setItem(
            "balanceAmount",
            0
        );


        return;
    }


    // =====================================
    // ADVANCE SELECTED
    // =====================================

    if (
        selectedPaymentType.value === "advance"
    ) {

        if (advanceSection) {

            advanceSection.style.display =
                "block";
        }

    }

}


// =========================================
// PAYMENT TYPE CHANGE
// =========================================

paymentTypes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                updatePaymentType();

            }
        );

    }
);


// =========================================
// PAYMENT MODE CHANGE
// =========================================

paymentModes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                console.log(
                    "Payment Mode:",
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
            // GET ADVANCE
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


            // =====================================
            // ADVANCE CANNOT EXCEED GRAND TOTAL
            // =====================================

            if (
                advance > originalGrandTotal
            ) {

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
                originalGrandTotal - advance;


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
                advance
            );


            // =====================================
            // SAVE BALANCE
            // =====================================

            localStorage.setItem(
                "balanceAmount",
                balance
            );


            console.log(
                "Grand Total:",
                originalGrandTotal
            );

            console.log(
                "Advance:",
                advance
            );

            console.log(
                "Balance:",
                balance
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

            if (
                paymentType === "cash"
            ) {

                // Full payment

                localStorage.setItem(
                    "advanceAmount",
                    originalGrandTotal
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


                // Check advance

                if (advance <= 0) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    advanceAmountInput.focus();

                    return;
                }


                // Check advance against total

                if (
                    advance > originalGrandTotal
                ) {

                    alert(
                        "Advance cannot be greater than Grand Total."
                    );

                    advanceAmountInput.focus();

                    return;
                }


                // Calculate balance again

                const balance =
                    originalGrandTotal - advance;


                // Display

                balanceAmountInput.value =
                    "₹ " + balance;


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
            // NO DISCOUNT
            // =====================================

            localStorage.setItem(
                "discountAmount",
                0
            );


            // =====================================
            // FINAL TOTAL = GRAND TOTAL
            // =====================================

            localStorage.setItem(
                "grandTotal",
                originalGrandTotal
            );


            localStorage.setItem(
                "finalTotal",
                originalGrandTotal
            );


            // =====================================
            // DEBUG
            // =====================================

            console.log(
                "=============================="
            );

            console.log(
                "Payment Type:",
                paymentType
            );

            console.log(
                "Payment Mode:",
                paymentMode
            );

            console.log(
                "Grand Total:",
                localStorage.getItem(
                    "grandTotal"
                )
            );

            console.log(
                "Discount:",
                0
            );

            console.log(
                "Final Grand Total:",
                localStorage.getItem(
                    "finalTotal"
                )
            );

            console.log(
                "Advance:",
                localStorage.getItem(
                    "advanceAmount"
                )
            );

            console.log(
                "Balance:",
                localStorage.getItem(
                    "balanceAmount"
                );

            console.log(
                "=============================="
            );


            // =====================================
            // GO TO BILL
            // =====================================

            window.location.href =
                "bill.html";

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
// INITIAL PAGE LOAD
// =========================================

updatePaymentType();
