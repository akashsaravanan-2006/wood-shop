// ============================================================
// DISCOUNT.JS
// ============================================================
//
// paymentFlag:
// 1 = READY CASH
// 0 = ADVANCE
//
// READY CASH:
// No discount. Amount stays exactly the same.
//
// ADVANCE:
// Discount can be applied.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("NEW DISCOUNT.JS STARTED");
    console.log("====================================");


    // ========================================================
    // HTML ELEMENTS
    // ========================================================

    const currentTotal =
        document.getElementById("currentTotal");

    const newGrandTotal =
        document.getElementById("newGrandTotal");

    const discountSection =
        document.getElementById("discountSection");

    const discountAmount =
        document.getElementById("discountAmount");

    const calculateDiscountBtn =
        document.getElementById("calculateDiscountBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    const backBtn =
        document.getElementById("backBtn");


    // ========================================================
    // PAYMENT FLAG
    // ========================================================

    const paymentFlag =
        Number(localStorage.getItem("paymentFlag"));

    console.log("PAYMENT FLAG =", paymentFlag);


    // ========================================================
    // GET NUMBER
    // ========================================================

    function getNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return 0;
        }

        const number = Number(
            String(value)
                .replace(/₹/g, "")
                .replace(/,/g, "")
                .trim()
        );

        return Number.isFinite(number)
            ? number
            : 0;
    }


    // ========================================================
    // GET ORIGINAL TOTAL
    // ========================================================

    function getOriginalTotal() {

        let total = 0;


        // --------------------------------------------
        // 1. finalTotal
        // --------------------------------------------

        total = getNumber(
            localStorage.getItem("finalTotal")
        );


        // --------------------------------------------
        // 2. grandTotal
        // --------------------------------------------

        if (total <= 0) {

            total = getNumber(
                localStorage.getItem("grandTotal")
            );

        }


        // --------------------------------------------
        // 3. wood + others
        // --------------------------------------------

        if (total <= 0) {

            const wood =
                getNumber(
                    localStorage.getItem("woodTotal")
                );

            const others =
                getNumber(
                    localStorage.getItem("othersTotal")
                );

            total = wood + others;

        }


        return Math.round(
            total * 100
        ) / 100;

    }


    // ========================================================
    // ORIGINAL TOTAL
    // ========================================================

    const originalTotal =
        getOriginalTotal();


    console.log(
        "ORIGINAL TOTAL =",
        originalTotal
    );


    // ========================================================
    // DISPLAY TOTAL
    // ========================================================

    if (currentTotal) {

        currentTotal.textContent =
            "₹ " +
            originalTotal.toFixed(2);

    }

    if (newGrandTotal) {

        newGrandTotal.textContent =
            "₹ " +
            originalTotal.toFixed(2);

    }


    // ========================================================
    // READY CASH
    // paymentFlag = 1
    // ========================================================

    if (paymentFlag === 1) {

        console.log("READY CASH SELECTED");
        console.log("FLAG = 1");
        console.log("DISCOUNT DISABLED");


        // --------------------------------------------
        // Hide discount input
        // --------------------------------------------

        if (discountSection) {

            discountSection.style.display =
                "none";

        }


        // --------------------------------------------
        // Select NO DISCOUNT
        // --------------------------------------------

        const noDiscount =
            document.querySelector(
                'input[name="discountOption"][value="no"]'
            );

        const needDiscount =
            document.querySelector(
                'input[name="discountOption"][value="yes"]'
            );


        if (noDiscount) {

            noDiscount.checked = true;

        }

        if (needDiscount) {

            needDiscount.checked = false;

        }


        // --------------------------------------------
        // KEEP SAME AMOUNT
        // --------------------------------------------

        if (newGrandTotal) {

            newGrandTotal.textContent =
                "₹ " +
                originalTotal.toFixed(2);

        }


        // --------------------------------------------
        // SAVE
        // --------------------------------------------

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
            String(originalTotal)
        );


        console.log(
            "READY CASH FINAL TOTAL =",
            originalTotal
        );

    }


    // ========================================================
    // ADVANCE
    // paymentFlag = 0
    // ========================================================

    else if (paymentFlag === 0) {

        console.log("ADVANCE SELECTED");
        console.log("FLAG = 0");
        console.log("DISCOUNT ENABLED");


        // --------------------------------------------
        // Hide initially
        // --------------------------------------------

        if (discountSection) {

            discountSection.style.display =
                "none";

        }


        // --------------------------------------------
        // RADIO BUTTONS
        // --------------------------------------------

        const discountOptions =
            document.querySelectorAll(
                'input[name="discountOption"]'
            );


        discountOptions.forEach(function (radio) {

            radio.addEventListener(
                "change",
                function () {


                    // ==================================
                    // NO DISCOUNT
                    // ==================================

                    if (this.value === "no") {

                        if (discountSection) {

                            discountSection.style.display =
                                "none";

                        }


                        if (discountAmount) {

                            discountAmount.value =
                                "";

                        }


                        if (newGrandTotal) {

                            newGrandTotal.textContent =
                                "₹ " +
                                originalTotal.toFixed(2);

                        }

                    }


                    // ==================================
                    // NEED DISCOUNT
                    // ==================================

                    if (this.value === "yes") {

                        if (discountSection) {

                            discountSection.style.display =
                                "block";

                        }

                    }

                }
            );

        });


        // --------------------------------------------
        // CALCULATE DISCOUNT
        // --------------------------------------------

        function calculateDiscount() {

            const discount =
                getNumber(
                    discountAmount
                        ? discountAmount.value
                        : 0
                );


            if (discount < 0) {

                alert(
                    "Discount cannot be negative."
                );

                return null;

            }


            if (discount > originalTotal) {

                alert(
                    "Discount cannot be greater than Grand Total."
                );

                return null;

            }


            const finalAmount =
                originalTotal - discount;


            if (newGrandTotal) {

                newGrandTotal.textContent =
                    "₹ " +
                    finalAmount.toFixed(2);

            }


            return {

                discount: discount,

                finalAmount: finalAmount

            };

        }


        // --------------------------------------------
        // CALCULATE BUTTON
        // --------------------------------------------

        if (calculateDiscountBtn) {

            calculateDiscountBtn.addEventListener(
                "click",
                function () {

                    calculateDiscount();

                }
            );

        }


        // --------------------------------------------
        // NEXT BUTTON
        // --------------------------------------------

        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                function () {

                    const selected =
                        document.querySelector(
                            'input[name="discountOption"]:checked'
                        );


                    if (!selected) {

                        alert(
                            "Please select discount option."
                        );

                        return;

                    }


                    let discount = 0;


                    // -------------------------------
                    // NO DISCOUNT
                    // -------------------------------

                    if (
                        selected.value === "no"
                    ) {

                        discount = 0;

                    }


                    // -------------------------------
                    // NEED DISCOUNT
                    // -------------------------------

                    else {

                        const result =
                            calculateDiscount();


                        if (!result) {

                            return;

                        }


                        discount =
                            result.discount;

                    }


                    const finalAmount =
                        originalTotal -
                        discount;


                    // --------------------------------
                    // SAVE DISCOUNT
                    // --------------------------------

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
                        String(finalAmount)
                    );


                    console.log(
                        "DISCOUNT SAVED"
                    );

                    console.log(
                        "Original =",
                        originalTotal
                    );

                    console.log(
                        "Discount =",
                        discount
                    );

                    console.log(
                        "Final =",
                        finalAmount
                    );


                    // --------------------------------
                    // GO BILL
                    // --------------------------------

                    window.location.href =
                        "bill.html";

                }
            );

        }

    }


    // ========================================================
    // INVALID FLAG
    // ========================================================

    else {

        console.warn(
            "paymentFlag is missing or invalid."
        );

        console.warn(
            "Current value:",
            localStorage.getItem("paymentFlag")
        );

    }


    // ========================================================
    // BACK BUTTON
    // ========================================================

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "advance.html";

            }
        );

    }


    // ========================================================
    // FINAL DEBUG
    // ========================================================

    console.log(
        "===================================="
    );

    console.log(
        "DISCOUNT PAGE READY"
    );

    console.log(
        "paymentFlag:",
        paymentFlag
    );

    console.log(
        "originalTotal:",
        originalTotal
    );

    console.log(
        "===================================="
    );

});
