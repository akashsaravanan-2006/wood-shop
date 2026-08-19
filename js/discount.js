document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       ELEMENTS
    ========================================= */

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


    /* =========================================
       GET GRAND TOTAL
    ========================================= */

    let grandTotal = parseInt(
        localStorage.getItem("grandTotal") || "0",
        10
    );

    if (isNaN(grandTotal)) {

        grandTotal = 0;

    }


    /* =========================================
       DISPLAY CURRENT TOTAL
    ========================================= */

    currentTotalElement.textContent =
        "₹ " + grandTotal;

    newGrandTotalElement.textContent =
        "₹ " + grandTotal;


    /* =========================================
       DISCOUNT OPTION
    ========================================= */

    const discountOptions =
        document.querySelectorAll(
            'input[name="discountOption"]'
        );


    discountOptions.forEach(function (option) {

        option.addEventListener("change", function () {

            if (this.value === "yes") {

                /* SHOW DISCOUNT INPUT */

                discountSection.style.display = "block";

                discountAmountInput.focus();

            } else {

                /* HIDE DISCOUNT INPUT */

                discountSection.style.display = "none";

                discountAmountInput.value = "";

                /* RESTORE ORIGINAL TOTAL */

                newGrandTotalElement.textContent =
                    "₹ " + grandTotal;

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

        });

    });


    /* =========================================
       CALCULATE DISCOUNT
    ========================================= */

    calculateDiscountBtn.addEventListener(
        "click",
        function () {

            let discount = parseInt(
                discountAmountInput.value || "0",
                10
            );


            if (isNaN(discount)) {

                discount = 0;

            }


            /* DISCOUNT CANNOT BE NEGATIVE */

            if (discount < 0) {

                discount = 0;

            }


            /* DISCOUNT CANNOT BE GREATER
               THAN GRAND TOTAL */

            if (discount > grandTotal) {

                alert(
                    "Discount cannot be greater than Grand Total."
                );

                discountAmountInput.value =
                    grandTotal;

                discount = grandTotal;

            }


            /* CALCULATE NEW TOTAL */

            const finalTotal =
                grandTotal - discount;


            /* DISPLAY */

            newGrandTotalElement.textContent =
                "₹ " + finalTotal;


            /* SAVE */

            localStorage.setItem(
                "discountAmount",
                String(discount)
            );

            localStorage.setItem(
                "discountApplied",
                discount > 0
                    ? "true"
                    : "false"
            );

            localStorage.setItem(
                "finalGrandTotal",
                String(finalTotal)
            );

        }
    );


    /* =========================================
       NEXT BUTTON
    ========================================= */

    nextBtn.addEventListener(
        "click",
        function () {

            const selectedOption =
                document.querySelector(
                    'input[name="discountOption"]:checked'
                );


            if (!selectedOption) {

                alert(
                    "Please select a discount option."
                );

                return;

            }


            /* =================================
               NO DISCOUNT
            ================================= */

            if (selectedOption.value === "no") {

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


            /* =================================
               NEED DISCOUNT
            ================================= */

            if (selectedOption.value === "yes") {

                let discount = parseInt(
                    discountAmountInput.value || "0",
                    10
                );


                if (
                    isNaN(discount) ||
                    discount <= 0
                ) {

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


                const finalTotal =
                    grandTotal - discount;


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


            /* =================================
               GO TO BILL PAGE
            ================================= */

            window.location.href =
                "bill.html";

        }
    );


    /* =========================================
       BACK BUTTON
    ========================================= */

    backBtn.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

});
