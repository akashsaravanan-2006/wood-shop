// =========================================
// ADVANCE.JS
// =========================================

// =========================================
// GET ELEMENTS
// =========================================

const grandTotalInput =
    document.getElementById("grandTotal");

const discountInput =
    document.getElementById("discountAmount");

const finalGrandTotalInput =
    document.getElementById("finalGrandTotal");

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
// =========================================

const originalGrandTotal =
    Number(
        localStorage.getItem("finalTotal")
    ) || 0;


// =========================================
// DISPLAY GRAND TOTAL
// =========================================

if (grandTotalInput) {

    grandTotalInput.value =
        originalGrandTotal.toFixed(2);

}


// =========================================
// CALCULATE FINAL TOTAL
// =========================================

function calculateFinalTotal() {

    let discount =
        Number(
            discountInput?.value
        ) || 0;


    if (discount < 0) {

        discount = 0;

        if (discountInput) {
            discountInput.value = "";
        }

    }


    if (discount > originalGrandTotal) {

        alert(
            "Discount cannot be greater than Grand Total."
        );

        discount =
            originalGrandTotal;

        if (discountInput) {

            discountInput.value =
                originalGrandTotal.toFixed(2);

        }

    }


    const finalTotal =
        originalGrandTotal - discount;


    if (finalGrandTotalInput) {

        finalGrandTotalInput.value =
            finalTotal.toFixed(2);

    }


    // Store discount

    localStorage.setItem(
        "discountAmount",
        discount.toFixed(2)
    );


    // Store final total

    localStorage.setItem(
        "finalTotal",
        finalTotal.toFixed(2)
    );


    return finalTotal;

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

        // Safe default

        if (advanceSection) {

            advanceSection.style.display =
                "none";

        }

        return;

    }


    console.log(
        "Selected Payment Type:",
        selectedPaymentType.value
    );


    // =====================================
    // READY CASH
    // =====================================

    if (
        selectedPaymentType.value === "cash"
    ) {

        console.log(
            "READY CASH SELECTED"
        );


        // IMPORTANT:
        // Hide Advance section completely

        if (advanceSection) {

            advanceSection.style.display =
                "none";

        }


        // Clear Advance fields

        if (advanceAmountInput) {

            advanceAmountInput.value =
                "";

        }


        if (balanceAmountInput) {

            balanceAmountInput.value =
                "";

        }


        // Final amount is fully paid

        const finalTotal =
            calculateFinalTotal();


        localStorage.setItem(
            "advanceAmount",
            finalTotal.toFixed(2)
        );


        localStorage.setItem(
            "balanceAmount",
            "0.00"
        );


        return;

    }


    // =====================================
    // ADVANCE SELECTED
    // =====================================

    if (
        selectedPaymentType.value === "advance"
    ) {

        console.log(
            "ADVANCE SELECTED"
        );


        // Show Advance section

        if (advanceSection) {

            advanceSection.style.display =
                "block";

        }


        // Do not automatically enter amount

        if (advanceAmountInput) {

            // Keep existing value if user
            // already entered it

        }


        return;

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

                console.log(
                    "Payment Type Changed:",
                    this.value
                );

                updatePaymentType();

            }
        );

    }
);


// =========================================
// DISCOUNT CHANGE
// =========================================

if (discountInput) {

    discountInput.addEventListener(
        "input",
        function () {

            calculateFinalTotal();

            updatePaymentType();

        }
    );

}


// =========================================
// PAYMENT MODE CHANGE
// CASH / UPI
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


            // Must be Advance

            if (
                !selectedPaymentType ||
                selectedPaymentType.value !== "advance"
            ) {

                alert(
                    "Advance Amount is only required for Advance payment."
                );

                return;

            }


            const finalTotal =
                calculateFinalTotal();


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


            if (advance > finalTotal) {

                alert(
                    "Advance cannot be greater than Final Grand Total."
                );

                advanceAmountInput.focus();

                return;

            }


            // =====================================
            // CALCULATE BALANCE
            // =====================================

            const balance =
                finalTotal - advance;


            balanceAmountInput.value =
                balance.toFixed(2);


            // =====================================
            // SAVE
            // =====================================

            localStorage.setItem(
                "advanceAmount",
                advance.toFixed(2)
            );


            localStorage.setItem(
                "balanceAmount",
                balance.toFixed(2)
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

            const finalTotal =
                calculateFinalTotal();


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
                    finalTotal.toFixed(2)
                );


                localStorage.setItem(
                    "balanceAmount",
                    "0.00"
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


                if (
                    balanceAmountInput.value === ""
                ) {

                    alert(
                        "Please click Calculate Balance."
                    );

                    return;

                }


                if (advance > finalTotal) {

                    alert(
                        "Advance cannot be greater than Final Grand Total."
                    );

                    return;

                }


                const balance =
                    Number(
                        balanceAmountInput.value
                    ) || 0;


                localStorage.setItem(
                    "advanceAmount",
                    advance.toFixed(2)
                );


                localStorage.setItem(
                    "balanceAmount",
                    balance.toFixed(2)
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


            localStorage.setItem(
                "discountAmount",
                (
                    Number(
                        discountInput?.value
                    ) || 0
                ).toFixed(2)
            );


            localStorage.setItem(
                "grandTotal",
                finalTotal.toFixed(2)
            );


            localStorage.setItem(
                "finalTotal",
                finalTotal.toFixed(2)
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
                "Discount:",
                localStorage.getItem(
                    "discountAmount"
                )
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
                )
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

// IMPORTANT:
// Run this LAST so Ready Cash starts
// with Advance section hidden.

calculateFinalTotal();

updatePaymentType();
