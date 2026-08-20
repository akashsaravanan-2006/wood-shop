// =========================================
// DISCOUNT.JS
// =========================================

document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // GET ELEMENTS
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
    // GET BALANCE AMOUNT
    // =========================================
    // IMPORTANT:
    // Discount must be calculated from
    // the balance after advance payment.
    // =========================================

    let balanceAmount = Number(
        localStorage.getItem("balanceAmount")
    );


    // =========================================
    // VALIDATE BALANCE
    // =========================================

    if (
        !Number.isFinite(balanceAmount) ||
        balanceAmount < 0
    ) {

        alert(
            "Balance Amount not found. Please complete the Advance Payment again."
        );

        return;
    }


    // =========================================
    // ROUND BALANCE
    // =========================================

    balanceAmount =
        Math.round(balanceAmount);


    // =========================================
    // SAVE DISCOUNT BASE AMOUNT
    // =========================================

    localStorage.setItem(
        "discountBaseAmount",
        String(balanceAmount)
    );


    // =========================================
    // DISPLAY CURRENT TOTAL
    // =========================================

    if (currentTotalElement) {

        currentTotalElement.textContent =
            "₹ " + balanceAmount;
    }


    // =========================================
    // INITIAL NEW GRAND TOTAL
    // =========================================

    if (newGrandTotalElement) {

        newGrandTotalElement.textContent =
            "₹ " + balanceAmount;
    }


    // =========================================
    // RESET DISCOUNT
    // =========================================

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
        String(balanceAmount)
    );


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

                }


                // =================================
                // NO DISCOUNT
                // =================================

                else {

                    if (discountSection) {

                        discountSection.style.display =
                            "none";
                    }


                    if (discountAmountInput) {

                        discountAmountInput.value = "";
                    }


                    if (newGrandTotalElement) {

                        newGrandTotalElement.textContent =
                            "₹ " + balanceAmount;
                    }


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
                        String(balanceAmount)
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
                    Math.round(discount);


                // =================================
                // VALIDATION
                // =================================

                if (discount <= 0) {

                    alert(
                        "Please enter a valid discount amount."
                    );

                    discountAmountInput.focus();

                    return;
                }


                // Discount cannot exceed balance

                if (discount > balanceAmount) {

                    alert(
                        "Discount cannot be greater than Balance Amount."
                    );

                    discountAmountInput.value =
                        balanceAmount;

                    return;
                }


                // =================================
                // CALCULATE FINAL AMOUNT
                // =================================

                const finalAmount =
                    balanceAmount - discount;


                // =================================
                // DISPLAY FINAL AMOUNT
                // =================================

                if (newGrandTotalElement) {

                    newGrandTotalElement.textContent =
                        "₹ " + finalAmount;
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
                    String(finalAmount)
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
                // VALIDATE OPTION
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
                        String(balanceAmount)
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
                        Math.round(discount);


                    // Validate

                    if (discount <= 0) {

                        alert(
                            "Please enter the discount amount."
                        );

                        discountAmountInput.focus();

                        return;
                    }


                    if (
                        discount > balanceAmount
                    ) {

                        alert(
                            "Discount cannot be greater than Balance Amount."
                        );

                        discountAmountInput.focus();

                        return;
                    }


                    // Calculate

                    const finalAmount =
                        balanceAmount - discount;


                    // Save

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
                        String(finalAmount)
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
