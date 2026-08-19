// =========================================
// DISCOUNT.JS
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // ELEMENTS
    // =========================================

    const currentTotalElement =
        document.getElementById("currentTotal");

    const newGrandTotalElement =
        document.getElementById("newGrandTotal");

    const discountSection =
        document.getElementById("discountSection");

    const discountAmountInput =
        document.getElementById("discountAmount");

    const calculateDiscountBtn =
        document.getElementById("calculateDiscountBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    const backBtn =
        document.getElementById("backBtn");


    // =========================================
    // GET ORIGINAL GRAND TOTAL
    // =========================================
    //
    // IMPORTANT:
    // Do NOT use finalGrandTotal here.
    // Do NOT use old discount value.
    //
    // First priority:
    // originalGrandTotal
    //
    // =========================================

    let grandTotal =
        Number(
            localStorage.getItem("originalGrandTotal")
        );


    // =========================================
    // FALLBACK
    // =========================================

    if (
        !Number.isFinite(grandTotal) ||
        grandTotal <= 0
    ) {

        grandTotal =
            Number(
                localStorage.getItem("grandTotal")
            ) || 0;
    }


    // =========================================
    // ROUND
    // =========================================

    grandTotal =
        Math.round(
            (grandTotal + Number.EPSILON) * 100
        ) / 100;


    // =========================================
    // VALIDATE
    // =========================================

    if (grandTotal <= 0) {

        alert(
            "Grand Total not found. Please go back and create the bill again."
        );

        return;
    }


    // =========================================
    // DISPLAY CURRENT GRAND TOTAL
    // =========================================

    if (currentTotalElement) {

        currentTotalElement.textContent =
            "₹ " +
            grandTotal.toFixed(2);
    }


    // =========================================
    // INITIAL NEW GRAND TOTAL
    // =========================================

    if (newGrandTotalElement) {

        newGrandTotalElement.textContent =
            "₹ " +
            grandTotal.toFixed(2);
    }


    // =========================================
    // DISCOUNT OPTIONS
    // =========================================

    const discountOptions =
        document.querySelectorAll(
            'input[name="discountOption"]'
        );


    discountOptions.forEach(function (option) {

        option.addEventListener(
            "change",
            function () {

                // =================================
                // NEED DISCOUNT
                // =================================

                if (this.value === "yes") {

                    if (discountSection) {

                        discountSection.style.display =
                            "block";
                    }

                    if (discountAmountInput) {

                        discountAmountInput.focus();
                    }

                    return;
                }


                // =================================
                // NO DISCOUNT
                // =================================

                if (this.value === "no") {

                    if (discountSection) {

                        discountSection.style.display =
                            "none";
                    }

                    if (discountAmountInput) {

                        discountAmountInput.value =
                            "";
                    }


                    // Restore original total

                    if (newGrandTotalElement) {

                        newGrandTotalElement.textContent =
                            "₹ " +
                            grandTotal.toFixed(2);
                    }


                    // Save

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

                }

            }
        );

    });


    // =========================================
    // CALCULATE DISCOUNT
    // =========================================

    if (calculateDiscountBtn) {

        calculateDiscountBtn.addEventListener(
            "click",
            function () {

                let discount =
                    Number(
                        discountAmountInput.value
                    ) || 0;


                discount =
                    Math.round(
                        (discount + Number.EPSILON) * 100
                    ) / 100;


                // =================================
                // VALIDATION
                // =================================

                if (discount <= 0) {

                    alert(
                        "Please enter the discount amount."
                    );

                    discountAmountInput.focus();

                    return;
                }


                if (discount > grandTotal) {

                    alert(
                        "Discount cannot be greater than Grand Total."
                    );

                    discountAmountInput.focus();

                    return;
                }


                // =================================
                // CALCULATE
                // =================================

                const finalTotal =
                    Math.round(
                        (
                            grandTotal -
                            discount
                        ) * 100
                    ) / 100;


                // =================================
                // DISPLAY
                // =================================

                if (newGrandTotalElement) {

                    newGrandTotalElement.textContent =
                        "₹ " +
                        finalTotal.toFixed(2);
                }


                // =================================
                // SAVE DISCOUNT
                // =================================

                localStorage.setItem(
                    "discountAmount",
                    String(discount)
                );

                localStorage.setItem(
                    "discountApplied",
                    "true"
                );

                localStorage.setItem(
                    "finalGrandTotal",
                    String(finalTotal)
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

                const selectedOption =
                    document.querySelector(
                        'input[name="discountOption"]:checked'
                    );


                // =================================
                // OPTION REQUIRED
                // =================================

                if (!selectedOption) {

                    alert(
                        "Please select a discount option."
                    );

                    return;
                }


                // =================================
                // NO DISCOUNT
                // =================================

                if (
                    selectedOption.value === "no"
                ) {

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
                }


                // =================================
                // NEED DISCOUNT
                // =================================

                if (
                    selectedOption.value === "yes"
                ) {

                    let discount =
                        Number(
                            discountAmountInput.value
                        ) || 0;


                    discount =
                        Math.round(
                            (discount + Number.EPSILON) * 100
                        ) / 100;


                    // =================================
                    // VALIDATE
                    // =================================

                    if (discount <= 0) {

                        alert(
                            "Please enter the discount amount."
                        );

                        discountAmountInput.focus();

                        return;
                    }


                    if (discount > grandTotal) {

                        alert(
                            "Discount cannot be greater than Grand Total."
                        );

                        discountAmountInput.focus();

                        return;
                    }


                    // =================================
                    // FINAL TOTAL
                    // =================================

                    const finalTotal =
                        Math.round(
                            (
                                grandTotal -
                                discount
                            ) * 100
                        ) / 100;


                    // =================================
                    // SAVE
                    // =================================

                    localStorage.setItem(
                        "discountAmount",
                        String(discount)
                    );

                    localStorage.setItem(
                        "discountApplied",
                        "true"
                    );

                    localStorage.setItem(
                        "finalGrandTotal",
                        String(finalTotal)
                    );

                }


                // =================================
                // GO TO BILL
                // =================================

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
                    "advance.html";

            }
        );
    }

});
