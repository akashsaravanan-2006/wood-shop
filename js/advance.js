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
    // Get the total from the page before Advance.
    // Do NOT use old finalGrandTotal.
    // =========================================

    let grandTotal =
        Number(
            localStorage.getItem("grandTotal")
        ) || 0;


    grandTotal =
        Math.round(
            (grandTotal + Number.EPSILON) * 100
        ) / 100;


    // =========================================
    // VALIDATE GRAND TOTAL
    // =========================================

    if (grandTotal <= 0) {

        alert(
            "Grand Total not found. Please go back and create the bill again."
        );

        return;
    }


    // =========================================
    // VERY IMPORTANT
    // SAVE ORIGINAL TOTAL
    // =========================================

    localStorage.setItem(
        "originalGrandTotal",
        String(grandTotal)
    );

    // Keep grandTotal as original total
    localStorage.setItem(
        "grandTotal",
        String(grandTotal)
    );

    // At this stage final total is also original
    localStorage.setItem(
        "finalGrandTotal",
        String(grandTotal)
    );


    // =========================================
    // CLEAR OLD DISCOUNT DATA
    // =========================================

    localStorage.removeItem("discountAmount");

    localStorage.removeItem("discountApplied");


    // =========================================
    // DISPLAY GRAND TOTAL
    // =========================================

    if (grandTotalInput) {

        grandTotalInput.value =
            "₹ " + grandTotal.toFixed(2);

    }


    // =========================================
    // PAYMENT TYPE
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


                const roundedAdvance =
                    Math.round(
                        (advance + Number.EPSILON) * 100
                    ) / 100;


                // =====================================
                // VALIDATION
                // =====================================

                if (roundedAdvance <= 0) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    advanceAmountInput.focus();

                    return;
                }


                if (roundedAdvance > grandTotal) {

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
                    Math.round(
                        (
                            grandTotal -
                            roundedAdvance
                        ) * 100
                    ) / 100;


                // =====================================
                // DISPLAY
                // =====================================

                balanceAmountInput.value =
                    "₹ " + balance.toFixed(2);


                // =====================================
                // SAVE ADVANCE DETAILS
                // =====================================

                localStorage.setItem(
                    "advanceAmount",
                    String(roundedAdvance)
                );


                localStorage.setItem(
                    "balanceAmount",
                    String(balance)
                );


                // IMPORTANT:
                // Grand Total DOES NOT change.
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


                    const roundedAdvance =
                        Math.round(
                            (
                                advance +
                                Number.EPSILON
                            ) * 100
                        ) / 100;


                    if (roundedAdvance <= 0) {

                        alert(
                            "Please enter Advance Amount."
                        );

                        advanceAmountInput.focus();

                        return;
                    }


                    if (roundedAdvance > grandTotal) {

                        alert(
                            "Advance cannot be greater than Grand Total."
                        );

                        advanceAmountInput.focus();

                        return;
                    }


                    const balance =
                        Math.round(
                            (
                                grandTotal -
                                roundedAdvance
                            ) * 100
                        ) / 100;


                    localStorage.setItem(
                        "advanceAmount",
                        String(roundedAdvance)
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
                // SAVE ORIGINAL TOTAL
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


                localStorage.setItem(
                    "finalGrandTotal",
                    String(grandTotal)
                );


                // =====================================
                // GO TO DISCOUNT
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
