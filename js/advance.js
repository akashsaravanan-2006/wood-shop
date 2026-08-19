// =========================================
// ADVANCE.JS
// Grand Total + Discount + Payment
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const originalGrandTotalInput =
    document.getElementById("originalGrandTotal");

const grandTotalInput =
    document.getElementById("grandTotal");

const discountInput =
    document.getElementById("discountAmount");

const advanceSection =
    document.getElementById("advanceSection");

const advanceInput =
    document.getElementById("advanceAmount");

const balanceInput =
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
//
// IMPORTANT:
// Do NOT take the already discounted finalTotal
// if grandTotal is available.
//

let storedGrandTotal =
    localStorage.getItem("grandTotal");


// If grandTotal does not exist,
// use finalTotal only as fallback.

if (
    storedGrandTotal === null ||
    storedGrandTotal === ""
) {

    storedGrandTotal =
        localStorage.getItem("finalTotal");

}


// =========================================
// FINAL ORIGINAL TOTAL
// =========================================

let originalGrandTotal =
    Number(storedGrandTotal) || 0;


// =========================================
// STORE ORIGINAL TOTAL SEPARATELY
// =========================================

localStorage.setItem(
    "originalGrandTotal",
    String(originalGrandTotal)
);


// =========================================
// DISPLAY ORIGINAL GRAND TOTAL
// =========================================

if (originalGrandTotalInput) {

    originalGrandTotalInput.value =
        originalGrandTotal.toFixed(0);

}


// =========================================
// LOAD SAVED DISCOUNT
// =========================================

const savedDiscount =
    Number(
        localStorage.getItem(
            "discountAmount"
        )
    ) || 0;


if (
    discountInput &&
    savedDiscount > 0
) {

    discountInput.value =
        savedDiscount;

}


// =========================================
// CALCULATE FINAL TOTAL
// =========================================

function calculateFinalTotal() {

    let discount =
        Number(
            discountInput.value
        ) || 0;


    // -----------------------------------------
    // DISCOUNT CANNOT BE NEGATIVE
    // -----------------------------------------

    if (discount < 0) {

        discount = 0;

        discountInput.value = "";

    }


    // -----------------------------------------
    // DISCOUNT CANNOT BE GREATER THAN TOTAL
    // -----------------------------------------

    if (
        discount >
        originalGrandTotal
    ) {

        alert(
            "Discount cannot be greater than Grand Total"
        );

        discountInput.value = "";

        discount = 0;

    }


    // -----------------------------------------
    // FINAL TOTAL
    // -----------------------------------------

    const finalTotal =
        originalGrandTotal -
        discount;


    // -----------------------------------------
    // DISPLAY
    // -----------------------------------------

    if (grandTotalInput) {

        grandTotalInput.value =
            finalTotal.toFixed(0);

    }


    return {
        discount: discount,
        finalTotal: finalTotal
    };

}


// =========================================
// DISCOUNT INPUT
// =========================================

if (discountInput) {

    discountInput.addEventListener(
        "input",
        function () {

            const result =
                calculateFinalTotal();


            updatePaymentSection(
                result.finalTotal
            );

        }
    );

}


// =========================================
// GET PAYMENT TYPE
// =========================================

function getPaymentType() {

    const selected =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (!selected) {

        return "ready_cash";

    }


    return selected.value;

}


// =========================================
// GET PAYMENT MODE
// =========================================

function getPaymentMode() {

    const selected =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        );


    if (!selected) {

        return "cash";

    }


    return selected.value;

}


// =========================================
// UPDATE PAYMENT SECTION
// =========================================

function updatePaymentSection(
    finalTotal
) {

    const paymentType =
        getPaymentType();


    // =====================================
    // READY CASH
    // =====================================

    if (
        paymentType === "ready_cash"
    ) {

        advanceSection.style.display =
            "none";


        advanceInput.value =
            finalTotal.toFixed(0);


        balanceInput.value =
            "0";

    }


    // =====================================
    // ADVANCE
    // =====================================

    else {

        advanceSection.style.display =
            "block";

    }

}


// =========================================
// PAYMENT TYPE CHANGE
// =========================================

document
    .querySelectorAll(
        'input[name="paymentType"]'
    )
    .forEach(function (radio) {

        radio.addEventListener(
            "change",
            function () {

                const result =
                    calculateFinalTotal();


                if (
                    this.value ===
                    "ready_cash"
                ) {

                    advanceInput.value =
                        result.finalTotal
                            .toFixed(0);

                    balanceInput.value =
                        "0";

                }
                else {

                    advanceInput.value =
                        "";

                    balanceInput.value =
                        "";

                }


                updatePaymentSection(
                    result.finalTotal
                );

            }
        );

    });


// =========================================
// PAYMENT MODE CHANGE
// =========================================

document
    .querySelectorAll(
        'input[name="paymentMode"]'
    )
    .forEach(function (radio) {

        radio.addEventListener(
            "change",
            function () {

                console.log(
                    "Payment Mode:",
                    this.value
                );

            }
        );

    });


// =========================================
// CALCULATE ADVANCE
// =========================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        function () {

            const result =
                calculateFinalTotal();


            const finalTotal =
                result.finalTotal;


            let advance =
                Number(
                    advanceInput.value
                ) || 0;


            // --------------------------------
            // NEGATIVE CHECK
            // --------------------------------

            if (advance < 0) {

                alert(
                    "Advance cannot be negative"
                );

                return;

            }


            // --------------------------------
            // GREATER THAN TOTAL
            // --------------------------------

            if (
                advance >
                finalTotal
            ) {

                alert(
                    "Advance cannot be greater than Grand Total"
                );

                advanceInput.value =
                    "";

                balanceInput.value =
                    "";

                return;

            }


            // --------------------------------
            // BALANCE
            // --------------------------------

            const balance =
                finalTotal -
                advance;


            advanceInput.value =
                advance.toFixed(0);


            balanceInput.value =
                balance.toFixed(0);

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

            // =================================
            // CALCULATE TOTAL
            // =================================

            const result =
                calculateFinalTotal();


            const discount =
                result.discount;


            const finalTotal =
                result.finalTotal;


            // =================================
            // PAYMENT TYPE
            // =================================

            const paymentType =
                getPaymentType();


            // =================================
            // PAYMENT MODE
            // =================================

            const paymentMode =
                getPaymentMode();


            let advanceAmount = 0;

            let balanceAmount = 0;


            // =================================
            // READY CASH
            // =================================

            if (
                paymentType ===
                "ready_cash"
            ) {

                advanceAmount =
                    finalTotal;

                balanceAmount =
                    0;

            }


            // =================================
            // ADVANCE
            // =================================

            else {

                if (
                    advanceInput.value === ""
                ) {

                    alert(
                        "Please enter Advance Amount"
                    );

                    advanceInput.focus();

                    return;

                }


                advanceAmount =
                    Number(
                        advanceInput.value
                    ) || 0;


                if (
                    advanceAmount >
                    finalTotal
                ) {

                    alert(
                        "Advance cannot be greater than Final Grand Total"
                    );

                    return;

                }


                balanceAmount =
                    finalTotal -
                    advanceAmount;

            }


            // =================================
            // SAVE ORIGINAL GRAND TOTAL
            // =================================

            localStorage.setItem(
                "originalGrandTotal",
                String(originalGrandTotal)
            );


            // =================================
            // SAVE DISCOUNT
            // =================================

            localStorage.setItem(
                "discountAmount",
                String(discount)
            );


            // =================================
            // SAVE FINAL TOTAL
            // =================================

            localStorage.setItem(
                "finalTotal",
                String(finalTotal)
            );


            localStorage.setItem(
                "grandTotal",
                String(finalTotal)
            );


            // =================================
            // PAYMENT TYPE
            // =================================

            localStorage.setItem(
                "paymentType",
                paymentType
            );


            // =================================
            // PAYMENT MODE
            // =================================

            localStorage.setItem(
                "paymentMode",
                paymentMode
            );


            // =================================
            // ADVANCE
            // =================================

            localStorage.setItem(
                "advanceAmount",
                String(advanceAmount)
            );


            // =================================
            // BALANCE
            // =================================

            localStorage.setItem(
                "balanceAmount",
                String(balanceAmount)
            );


            // =================================
            // DEBUG
            // =================================

            console.log(
                "=============================="
            );

            console.log(
                "Original Grand Total:",
                originalGrandTotal
            );

            console.log(
                "Discount:",
                discount
            );

            console.log(
                "Final Grand Total:",
                finalTotal
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
                "Advance:",
                advanceAmount
            );

            console.log(
                "Balance:",
                balanceAmount
            );

            console.log(
                "=============================="
            );


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
                "personal.html";

        }
    );

}


// =========================================
// INITIAL DISPLAY
// =========================================

const initialResult =
    calculateFinalTotal();


updatePaymentSection(
    initialResult.finalTotal
);


// =========================================
// INITIAL READY CASH
// =========================================

if (
    getPaymentType() ===
    "ready_cash"
) {

    advanceInput.value =
        initialResult.finalTotal
            .toFixed(0);

    balanceInput.value =
        "0";

}
