// ===========================================
// DISCOUNT.JS
// CENTRAL BILL STORAGE VERSION
// ===========================================


// ===========================================
// GET HTML ELEMENTS
// ===========================================

const currentTotalElement =
    document.getElementById("currentTotal");

const newGrandTotalElement =
    document.getElementById("newGrandTotal");

const discountSection =
    document.getElementById("discountSection");

const discountAmountInput =
    document.getElementById("discountAmount");

const calculateDiscountBtn =
    document.getElementById(
        "calculateDiscountBtn"
    );

const nextBtn =
    document.getElementById("nextBtn");

const backBtn =
    document.getElementById("backBtn");


// ===========================================
// GET ADVANCE DATA
// ===========================================

let advanceData = {};

if (
    typeof getPageData === "function"
) {

    advanceData =
        getPageData("advance") || {};

}


// ===========================================
// GET ORIGINAL GRAND TOTAL
// ===========================================

let originalGrandTotal =
    Number(
        advanceData.grandTotal
    ) || 0;


// Fallback for old storage

if (
    originalGrandTotal === 0
) {

    originalGrandTotal =
        Number(
            localStorage.getItem(
                "grandTotal"
            )
        ) || 0;

}


// ===========================================
// GET PAYMENT TYPE
// ===========================================
//
// Needed to decide how to finalize the
// bill once discount is applied.
// ===========================================

let paymentType =
    advanceData.paymentType ||
    localStorage.getItem("paymentType") ||
    "";


// ===========================================
// GET ADVANCE AMOUNT
// ===========================================

let advanceAmount =
    Number(
        advanceData.advanceAmount
    ) || 0;


// Fallback

if (
    advanceAmount === 0 &&
    localStorage.getItem("advanceAmount")
) {

    advanceAmount =
        Number(
            localStorage.getItem(
                "advanceAmount"
            )
        ) || 0;

}


// ===========================================
// GET BALANCE AFTER ADVANCE
// ===========================================

let balanceAmount =
    Number(
        advanceData.balanceAmount
    );


if (
    isNaN(balanceAmount)
) {

    balanceAmount =
        originalGrandTotal -
        advanceAmount;

}


// ===========================================
// DISPLAY CURRENT TOTAL
// ===========================================
//
// IMPORTANT:
// Discount is calculated from the
// BALANCE after advance.
//
// For "cash": balance = full grandTotal
// (nothing finalized yet).
//
// For "advance": balance = grandTotal
// minus what was already paid.
// ===========================================

if (currentTotalElement) {

    currentTotalElement.textContent =
        "₹ " +
        balanceAmount.toFixed(2);

}


if (newGrandTotalElement) {

    newGrandTotalElement.textContent =
        "₹ " +
        balanceAmount.toFixed(2);

}


// ===========================================
// LOAD SAVED DISCOUNT DATA
// ===========================================

let savedDiscount = {};

if (
    typeof getPageData === "function"
) {

    savedDiscount =
        getPageData("discount") || {};

}


// ===========================================
// RESTORE DISCOUNT AMOUNT
// ===========================================

if (
    discountAmountInput &&
    savedDiscount.discountAmount !==
    undefined
) {

    discountAmountInput.value =
        savedDiscount.discountAmount;

}


// ===========================================
// RESTORE DISCOUNT OPTION
// ===========================================

if (
    savedDiscount.discountOption
) {

    const savedOption =
        document.querySelector(
            'input[name="discountOption"][value="' +
            savedDiscount.discountOption +
            '"]'
        );


    if (savedOption) {

        savedOption.checked =
            true;

    }

}


// ===========================================
// SHOW / HIDE DISCOUNT SECTION
// ===========================================

function updateDiscountSection() {

    const selectedOption =
        document.querySelector(
            'input[name="discountOption"]:checked'
        );


    if (!selectedOption) {

        return;

    }


    if (
        selectedOption.value === "yes"
    ) {

        if (discountSection) {

            discountSection.style.display =
                "block";

        }

        if (discountAmountInput) {

            discountAmountInput.focus();

        }

    }
    else {

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
                balanceAmount.toFixed(2);

        }

    }

}


// ===========================================
// SAVE DISCOUNT DATA
// ===========================================

function saveDiscountData(
    discountOption,
    discount
) {

    const finalBalance =
        balanceAmount -
        discount;


    // =====================================
    // FINALIZE ADVANCE / BALANCE
    // =====================================
    //
    // CASH:
    // The whole discounted amount is
    // collected right now. Balance owed
    // becomes 0.
    //
    // ADVANCE:
    // The amount already collected stays
    // the same. The discounted amount
    // becomes the new balance owed.
    // =====================================

    let finalAdvanceAmount;
    let finalBalanceAmount;

    if (
        paymentType === "cash"
    ) {

        finalAdvanceAmount =
            finalBalance;

        finalBalanceAmount = 0;

    }
    else {

        finalAdvanceAmount =
            advanceAmount;

        finalBalanceAmount =
            finalBalance;

    }


    // =====================================
    // CENTRAL STORAGE - DISCOUNT
    // =====================================

    if (
        typeof savePageData === "function"
    ) {

        savePageData(
            "discount",
            {

                discountOption:
                    discountOption,

                discountAmount:
                    discount,

                discountApplied:
                    discount > 0,

                balanceBeforeDiscount:
                    balanceAmount,

                finalAmount:
                    finalBalance

            }
        );


        // =================================
        // CENTRAL STORAGE - ADVANCE
        // (updated with final values)
        // =================================

        savePageData(
            "advance",
            {

                ...advanceData,

                advanceAmount:
                    finalAdvanceAmount,

                balanceAmount:
                    finalBalanceAmount

            }
        );

    }


    // =====================================
    // OLD LOCAL STORAGE
    // Keep compatibility with bill.js
    // =====================================

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
        String(finalBalance)
    );


    localStorage.setItem(
        "balanceBeforeDiscount",
        String(balanceAmount)
    );


    localStorage.setItem(
        "finalBalance",
        String(finalBalance)
    );


    // Final, payment-type-aware values
    // used by bill.html

    localStorage.setItem(
        "advanceAmount",
        String(finalAdvanceAmount)
    );

    localStorage.setItem(
        "balanceAmount",
        String(finalBalanceAmount)
    );


    return finalBalance;

}


// ===========================================
// DISCOUNT OPTION EVENTS
// ===========================================

const discountOptions =
    document.querySelectorAll(
        'input[name="discountOption"]'
    );


discountOptions.forEach(
    function (option) {

        option.addEventListener(
            "change",
            function () {

                if (
                    this.value === "yes"
                ) {

                    if (discountSection) {

                        discountSection.style.display =
                            "block";

                    }


                    if (discountAmountInput) {

                        discountAmountInput.focus();

                    }

                }
                else {

                    // No discount

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
                            balanceAmount.toFixed(2);

                    }


                    saveDiscountData(
                        "no",
                        0
                    );

                }

            }
        );

    }
);


// ===========================================
// CALCULATE DISCOUNT
// ===========================================

if (calculateDiscountBtn) {

    calculateDiscountBtn.addEventListener(
        "click",
        function () {

            const selectedOption =
                document.querySelector(
                    'input[name="discountOption"]:checked'
                );


            if (
                !selectedOption ||
                selectedOption.value !== "yes"
            ) {

                alert(
                    "Please select Need Discount."
                );

                return;

            }


            let discount =
                Number(
                    discountAmountInput.value
                ) || 0;


            // =================================
            // VALIDATION
            // =================================

            if (
                discount <= 0
            ) {

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


            // =================================
            // CALCULATE FINAL AMOUNT
            // =================================

            const finalAmount =
                balanceAmount -
                discount;


            // =================================
            // DISPLAY
            // =================================

            if (newGrandTotalElement) {

                newGrandTotalElement.textContent =
                    "₹ " +
                    finalAmount.toFixed(2);

            }


            // =================================
            // SAVE
            // =================================

            saveDiscountData(
                "yes",
                discount
            );


            console.log(
                "Discount calculated:"
            );

            console.log(
                "Balance:",
                balanceAmount
            );

            console.log(
                "Discount:",
                discount
            );

            console.log(
                "Final:",
                finalAmount
            );

        }
    );

}


// ===========================================
// NEXT BUTTON
// ===========================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {

            const selectedOption =
                document.querySelector(
                    'input[name="discountOption"]:checked'
                );


            // =================================
            // VALIDATION
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

                saveDiscountData(
                    "no",
                    0
                );

            }


            // =================================
            // DISCOUNT REQUIRED
            // =================================

            if (
                selectedOption.value === "yes"
            ) {

                const discount =
                    Number(
                        discountAmountInput.value
                    ) || 0;


                if (
                    discount <= 0
                ) {

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


                saveDiscountData(
                    "yes",
                    discount
                );

            }


            // =================================
            // SAVE COMPLETE BILL DEBUG
            // =================================

            console.log(
                "================================"
            );

            console.log(
                "DISCOUNT DATA"
            );


            if (
                typeof getPageData === "function"
            ) {

                console.log(
                    getPageData("discount")
                );

            }


            console.log(
                "COMPLETE BILL DATA"
            );


            if (
                typeof getBillData === "function"
            ) {

                console.log(
                    getBillData()
                );

            }


            console.log(
                "================================"
            );


            // =================================
            // GO TO BILL
            // =================================

            window.location.href =
                "bill.html";

        }
    );

}


// ===========================================
// BACK BUTTON
// ===========================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            // Save current discount data
            const selectedOption =
                document.querySelector(
                    'input[name="discountOption"]:checked'
                );


            if (
                selectedOption
            ) {

                if (
                    selectedOption.value === "yes"
                ) {

                    const discount =
                        Number(
                            discountAmountInput.value
                        ) || 0;


                    if (
                        discount >= 0 &&
                        discount <= balanceAmount
                    ) {

                        saveDiscountData(
                            "yes",
                            discount
                        );

                    }

                }
                else {

                    saveDiscountData(
                        "no",
                        0
                    );

                }

            }


            // Go back to Advance

            window.location.href =
                "advance.html";

        }
    );

}


// ===========================================
// INITIAL LOAD
// ===========================================

updateDiscountSection();


console.log(
    "DISCOUNT.JS LOADED SUCCESSFULLY"
);

console.log(
    "Original Grand Total:",
    originalGrandTotal
);

console.log(
    "Payment Type:",
    paymentType
);

console.log(
    "Advance Amount:",
    advanceAmount
);

console.log(
    "Balance Before Discount:",
    balanceAmount
);
