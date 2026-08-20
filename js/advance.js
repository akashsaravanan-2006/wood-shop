// =========================================
// ADVANCE.JS
// =========================================

document.addEventListener("DOMContentLoaded", function () {

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
    // =========================================
    // IMPORTANT:
    // finalTotal comes from the previous page.
    // Advance must NOT change this amount.
    // =========================================

    let grandTotal = Number(
        localStorage.getItem("finalTotal")
    );


    // =========================================
    // FALLBACK
    // =========================================

    if (
        !Number.isFinite(grandTotal) ||
        grandTotal <= 0
    ) {

        grandTotal = Number(
            localStorage.getItem("grandTotal")
        );

    }


    // =========================================
    // VALIDATE GRAND TOTAL
    // =========================================

    if (
        !Number.isFinite(grandTotal) ||
        grandTotal <= 0
    ) {

        alert(
            "Grand Total not found. Please go back and create the bill again."
        );

        return;
    }


    // =========================================
    // ROUND GRAND TOTAL
    // =========================================

    grandTotal = Math.round(grandTotal);


    // =========================================
    // SAVE ORIGINAL TOTAL
    // =========================================

    localStorage.setItem(
        "originalGrandTotal",
        String(grandTotal)
    );

    localStorage.setItem(
        "grandTotal",
        String(grandTotal)
    );


    // =========================================
    // RESET OLD DISCOUNT DATA
    // =========================================

    localStorage.removeItem(
        "discountAmount"
    );

    localStorage.removeItem(
        "discountApplied"
    );

    localStorage.setItem(
        "finalGrandTotal",
        String(grandTotal)
    );


    // =========================================
    // DISPLAY GRAND TOTAL
    // =========================================

    if (grandTotalInput) {

        grandTotalInput.value =
            "₹ " + grandTotal;
    }


    // =========================================
    // UPDATE PAYMENT TYPE
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


            localStorage.setItem(
                "paymentType",
                "cash"
            );


            // Full payment

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
    // PAYMENT MODE EVENTS
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


                // Get advance amount

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

                if (balanceAmountInput) {

                    balanceAmountInput.value =
                        "₹ " + balance;
                }


                // =====================================
                // SAVE ADVANCE
                // =====================================

                localStorage.setItem(
                    "advanceAmount",
                    String(advance)
                );


                localStorage.setItem(
                    "balanceAmount",
                    String(balance)
                );


                // IMPORTANT:
                // Grand Total stays unchanged

                localStorage.setItem(
                    "grandTotal",
                    String(grandTotal)
                );


                localStorage.setItem(
                    "originalGrandTotal",
                    String(grandTotal)
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

                if (
                    paymentType === "advance"
                ) {

                    const advance =
                        Math.round(
                            Number(
                                advanceAmountInput.value
                            ) || 0
                        );


                    // Validate advance

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
                // SAVE ORIGINAL GRAND TOTAL
                // =====================================

                localStorage.setItem(
                    "originalGrandTotal",
                    String(grandTotal)
                );


                localStorage.setItem(
                    "grandTotal",
                    String(grandTotal)
                );


                // =====================================
                // RESET DISCOUNT
                // =====================================

                localStorage.removeItem(
                    "discountAmount"
                );

                localStorage.removeItem(
                    "discountApplied"
                );


                // =====================================
                // INITIAL FINAL TOTAL
                // =====================================
                // Discount page will update this.

                localStorage.setItem(
                    "finalGrandTotal",
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

});
