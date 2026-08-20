// ============================================================
// DISCOUNT.JS
// ============================================================
// FLOW:
//
// Wood
//   ↓
// Labour
//   ↓
// Personal
//   ↓
// Advance
//   ↓
// Discount
//   ↓
// Bill
//
// IMPORTANT:
// Discount uses the TOTAL BEFORE DISCOUNT.
// Advance amount is NOT subtracted here.
// ============================================================


document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("DISCOUNT.JS STARTED");
    console.log("=================================");


    // ========================================================
    // HTML ELEMENTS
    // ========================================================

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


    // ========================================================
    // CHECK HTML ELEMENTS
    // ========================================================

    console.log("currentTotal:", currentTotalElement);
    console.log("newGrandTotal:", newGrandTotalElement);
    console.log("discountSection:", discountSection);
    console.log("discountAmount:", discountAmountInput);
    console.log("calculateButton:", calculateDiscountBtn);
    console.log("nextButton:", nextBtn);
    console.log("backButton:", backBtn);


    // ========================================================
    // GET NUMBER SAFELY
    // ========================================================

    function getNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return 0;

        }


        const number =
            parseFloat(
                String(value)
                    .replace("₹", "")
                    .replace(/,/g, "")
                    .trim()
            );


        return isNaN(number)
            ? 0
            : number;

    }


    // ========================================================
    // GET GRAND TOTAL
    // ========================================================

    function getGrandTotal() {

        let total = 0;


        // ====================================================
        // METHOD 1
        // CENTRAL STOREDATA.JS
        // ====================================================

        if (
            typeof getPageData === "function"
        ) {

            try {

                const advanceData =
                    getPageData("advance");

                console.log(
                    "ADVANCE DATA:",
                    advanceData
                );


                if (
                    advanceData &&
                    advanceData.discountBaseAmount !==
                    undefined
                ) {

                    total =
                        getNumber(
                            advanceData.discountBaseAmount
                        );

                }


                // Fallback
                if (
                    total <= 0 &&
                    advanceData &&
                    advanceData.grandTotal !==
                    undefined
                ) {

                    total =
                        getNumber(
                            advanceData.grandTotal
                        );

                }


                // Fallback
                if (
                    total <= 0 &&
                    advanceData &&
                    advanceData.finalTotal !==
                    undefined
                ) {

                    total =
                        getNumber(
                            advanceData.finalTotal
                        );

                }

            }
            catch (error) {

                console.error(
                    "Error reading advance data:",
                    error
                );

            }

        }


        // ====================================================
        // METHOD 2
        // LOCAL STORAGE
        // ====================================================

        if (total <= 0) {

            total =
                getNumber(
                    localStorage.getItem(
                        "discountBaseAmount"
                    )
                );

            console.log(
                "discountBaseAmount:",
                total
            );

        }


        // ====================================================
        // METHOD 3
        // FINAL TOTAL
        // ====================================================

        if (total <= 0) {

            total =
                getNumber(
                    localStorage.getItem(
                        "finalTotal"
                    )
                );

            console.log(
                "finalTotal:",
                total
            );

        }


        // ====================================================
        // METHOD 4
        // GRAND TOTAL
        // ====================================================

        if (total <= 0) {

            total =
                getNumber(
                    localStorage.getItem(
                        "grandTotal"
                    )
                );

            console.log(
                "grandTotal:",
                total
            );

        }


        // ====================================================
        // METHOD 5
        // CENTRAL TOTALS
        // ====================================================

        if (
            total <= 0 &&
            typeof getTotals === "function"
        ) {

            try {

                const totals =
                    getTotals();

                console.log(
                    "TOTALS DATA:",
                    totals
                );


                if (
                    totals &&
                    totals.finalTotal !==
                    undefined
                ) {

                    total =
                        getNumber(
                            totals.finalTotal
                        );

                }


                if (
                    total <= 0 &&
                    totals &&
                    totals.grandTotal !==
                    undefined
                ) {

                    total =
                        getNumber(
                            totals.grandTotal
                        );

                }

            }
            catch (error) {

                console.error(
                    "Error reading totals:",
                    error
                );

            }

        }


        total =
            Math.round(
                total * 100
            ) / 100;


        console.log(
            "FINAL DISCOUNT BASE TOTAL:",
            total
        );


        return total;

    }


    // ========================================================
    // GET CURRENT TOTAL
    // ========================================================

    let grandTotal =
        getGrandTotal();


    // ========================================================
    // DISPLAY CURRENT TOTAL
    // ========================================================

    function displayCurrentTotal() {

        if (currentTotalElement) {

            currentTotalElement.textContent =
                "₹ " +
                grandTotal.toFixed(2);

        }


        if (newGrandTotalElement) {

            newGrandTotalElement.textContent =
                "₹ " +
                grandTotal.toFixed(2);

        }

    }


    displayCurrentTotal();


    // ========================================================
    // DISCOUNT OPTIONS
    // ========================================================

    const discountOptions =
        document.querySelectorAll(
            'input[name="discountOption"]'
        );


    discountOptions.forEach(function (option) {

        option.addEventListener(
            "change",
            function () {

                console.log(
                    "Discount option:",
                    this.value
                );


                // ============================================
                // NO DISCOUNT
                // ============================================

                if (this.value === "no") {

                    if (discountSection) {

                        discountSection.style.display =
                            "none";

                    }


                    if (discountAmountInput) {

                        discountAmountInput.value =
                            "";

                    }


                    if (newGrandTotalElement) {

                        newGrandTotalElement.textContent =
                            "₹ " +
                            grandTotal.toFixed(2);

                    }


                    // Save zero discount

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


                // ============================================
                // NEED DISCOUNT
                // ============================================

                if (this.value === "yes") {

                    if (discountSection) {

                        discountSection.style.display =
                            "block";

                    }


                    if (discountAmountInput) {

                        discountAmountInput.focus();

                    }

                }

            }
        );

    });


    // ========================================================
    // CALCULATE DISCOUNT
    // ========================================================

    function calculateDiscount() {

        let discount = 0;


        if (discountAmountInput) {

            discount =
                getNumber(
                    discountAmountInput.value
                );

        }


        // Discount cannot be negative

        if (discount < 0) {

            discount = 0;

        }


        // Discount cannot exceed total

        if (discount > grandTotal) {

            alert(
                "Discount cannot be greater than Grand Total."
            );


            discount =
                grandTotal;


            if (discountAmountInput) {

                discountAmountInput.value =
                    grandTotal;

            }

        }


        // ====================================================
        // NEW GRAND TOTAL
        // ====================================================

        const finalTotal =
            grandTotal -
            discount;


        // ====================================================
        // DISPLAY
        // ====================================================

        if (newGrandTotalElement) {

            newGrandTotalElement.textContent =
                "₹ " +
                finalTotal.toFixed(2);

        }


        console.log(
            "Grand Total:",
            grandTotal
        );

        console.log(
            "Discount:",
            discount
        );

        console.log(
            "Final Total:",
            finalTotal
        );


        return {

            discount:
                discount,

            finalTotal:
                finalTotal

        };

    }


    // ========================================================
    // CALCULATE BUTTON
    // ========================================================

    if (calculateDiscountBtn) {

        calculateDiscountBtn.addEventListener(
            "click",
            function () {

                calculateDiscount();

            }
        );

    }


    // ========================================================
    // NEXT BUTTON
    // ========================================================

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                console.log(
                    "NEXT BUTTON CLICKED"
                );


                // ==================================================
                // CHECK SELECTED DISCOUNT
                // ==================================================

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


                console.log(
                    "Selected:",
                    selectedOption.value
                );


                // ==================================================
                // NO DISCOUNT
                // ==================================================

                if (
                    selectedOption.value ===
                    "no"
                ) {

                    const discount =
                        0;

                    const finalTotal =
                        grandTotal;


                    // ==============================================
                    // SAVE OLD LOCAL STORAGE
                    // ==============================================

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
                        String(finalTotal)
                    );

                    localStorage.setItem(
                        "discountBaseAmount",
                        String(grandTotal)
                    );


                    // ==============================================
                    // SAVE CENTRAL STORAGE
                    // ==============================================

                    if (
                        typeof savePageData ===
                        "function"
                    ) {

                        savePageData(
                            "discount",
                            {

                                originalGrandTotal:
                                    grandTotal,

                                discount:
                                    discount,

                                finalGrandTotal:
                                    finalTotal,

                                discountApplied:
                                    false

                            }
                        );

                    }


                    console.log(
                        "NO DISCOUNT SAVED"
                    );

                }


                // ==================================================
                // NEED DISCOUNT
                // ==================================================

                if (
                    selectedOption.value ===
                    "yes"
                ) {

                    const result =
                        calculateDiscount();


                    if (
                        result.discount <= 0
                    ) {

                        alert(
                            "Please enter the discount amount."
                        );

                        if (
                            discountAmountInput
                        ) {

                            discountAmountInput.focus();

                        }

                        return;

                    }


                    // ==============================================
                    // SAVE LOCAL STORAGE
                    // ==============================================

                    localStorage.setItem(
                        "discountAmount",
                        String(
                            result.discount
                        )
                    );

                    localStorage.setItem(
                        "discountApplied",
                        "true"
                    );

                    localStorage.setItem(
                        "finalGrandTotal",
                        String(
                            result.finalTotal
                        )
                    );

                    localStorage.setItem(
                        "discountBaseAmount",
                        String(
                            grandTotal
                        )
                    );


                    // ==============================================
                    // SAVE CENTRAL STORAGE
                    // ==============================================

                    if (
                        typeof savePageData ===
                        "function"
                    ) {

                        savePageData(
                            "discount",
                            {

                                originalGrandTotal:
                                    grandTotal,

                                discount:
                                    result.discount,

                                finalGrandTotal:
                                    result.finalTotal,

                                discountApplied:
                                    true

                            }
                        );

                    }


                    console.log(
                        "DISCOUNT SAVED"
                    );

                }


                // ==================================================
                // GO TO BILL
                // ==================================================

                window.location.href =
                    "bill.html";

            }
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
        "================================="
    );

    console.log(
        "DISCOUNT PAGE READY"
    );

    console.log(
        "Grand Total =",
        grandTotal
    );

    console.log(
        "================================="
    );

});
