// =========================================
// ADVANCE.JS
// Discount + Payment Type + Payment Mode
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const originalGrandTotalInput =
    document.getElementById(
        "originalGrandTotal"
    );


const grandTotalInput =
    document.getElementById(
        "grandTotal"
    );


const discountInput =
    document.getElementById(
        "discountAmount"
    );


const advanceSection =
    document.getElementById(
        "advanceSection"
    );


const advanceInput =
    document.getElementById(
        "advanceAmount"
    );


const balanceInput =
    document.getElementById(
        "balanceAmount"
    );


const calculateBtn =
    document.getElementById(
        "calculateBtn"
    );


const nextBtn =
    document.getElementById(
        "nextBtn"
    );


const backBtn =
    document.getElementById(
        "backBtn"
    );


// =========================================
// ORIGINAL GRAND TOTAL
// =========================================

const originalGrandTotal =
    Number(
        localStorage.getItem(
            "finalTotal"
        )
    ) || 0;


originalGrandTotalInput.value =
    originalGrandTotal.toFixed(0);


// =========================================
// LOAD SAVED DISCOUNT
// =========================================

const savedDiscount =
    Number(
        localStorage.getItem(
            "discountAmount"
        )
    ) || 0;


if (savedDiscount > 0) {

    discountInput.value =
        savedDiscount;

}


// =========================================
// CALCULATE FINAL TOTAL
// =========================================

function getFinalTotal() {

    let discount =
        Number(
            discountInput.value
        ) || 0;


    // Negative discount protection

    if (discount < 0) {

        discount = 0;

        discountInput.value = "";

    }


    // Discount cannot exceed total

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


    const finalTotal =
        originalGrandTotal -
        discount;


    grandTotalInput.value =
        finalTotal.toFixed(0);


    return {
        discount: discount,
        finalTotal: finalTotal
    };

}


// =========================================
// DISCOUNT INPUT
// =========================================

discountInput.addEventListener(
    "input",
    function() {

        const result =
            getFinalTotal();


        updatePaymentCalculation(
            result.finalTotal
        );

    }
);


// =========================================
// GET PAYMENT TYPE
// =========================================

function getPaymentType() {

    const selected =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    return selected
        ? selected.value
        : "ready_cash";

}


// =========================================
// GET PAYMENT MODE
// =========================================

function getPaymentMode() {

    const selected =
        document.querySelector(
            'input[name="paymentMode"]:checked'
        );


    return selected
        ? selected.value
        : "cash";

}


// =========================================
// UPDATE ADVANCE SECTION
// =========================================

function updatePaymentCalculation(
    finalTotal
) {

    const paymentType =
        getPaymentType();


    // =====================================
    // READY CASH
    // =====================================

    if (
        paymentType ===
        "ready_cash"
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
    .forEach(function(radio) {

        radio.addEventListener(
            "change",
            function() {

                const result =
                    getFinalTotal();


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


                updatePaymentCalculation(
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
    .forEach(function(radio) {

        radio.addEventListener(
            "change",
            function() {

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

calculateBtn.addEventListener(
    "click",
    function() {

        const result =
            getFinalTotal();


        const finalTotal =
            result.finalTotal;


        let advance =
            Number(
                advanceInput.value
            ) || 0;


        // =====================================
        // VALIDATE
        // =====================================

        if (advance < 0) {

            alert(
                "Advance cannot be negative"
            );

            return;

        }


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


        const balance =
            finalTotal -
            advance;


        advanceInput.value =
            advance.toFixed(0);


        balanceInput.value =
            balance.toFixed(0);

    }
);


// =========================================
// NEXT BUTTON
// =========================================

nextBtn.addEventListener(
    "click",
    function() {

        // =====================================
        // FINAL TOTAL
        // =====================================

        const result =
            getFinalTotal();


        const discount =
            result.discount;


        const finalTotal =
            result.finalTotal;


        // =====================================
        // PAYMENT TYPE
        // =====================================

        const paymentType =
            getPaymentType();


        // =====================================
        // PAYMENT MODE
        // =====================================

        const paymentMode =
            getPaymentMode();


        let advanceAmount = 0;

        let balanceAmount = 0;


        // =====================================
        // READY CASH
        // =====================================

        if (
            paymentType ===
            "ready_cash"
        ) {

            advanceAmount =
                finalTotal;

            balanceAmount =
                0;

        }


        // =====================================
        // ADVANCE
        // =====================================

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
                    "Advance cannot be greater than Grand Total"
                );

                return;

            }


            balanceAmount =
                finalTotal -
                advanceAmount;

        }


        // =====================================
        // SAVE DATA
        // =====================================

        localStorage.setItem(
            "discountAmount",
            String(discount)
        );


        localStorage.setItem(
            "grandTotal",
            String(finalTotal)
        );


        localStorage.setItem(
            "finalTotal",
            String(finalTotal)
        );


        localStorage.setItem(
            "paymentType",
            paymentType
        );


        localStorage.setItem(
            "paymentMode",
            paymentMode
        );


        localStorage.setItem(
            "advanceAmount",
            String(advanceAmount)
        );


        localStorage.setItem(
            "balanceAmount",
            String(balanceAmount)
        );


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "=============================="
        );

        console.log(
            "Original Total:",
            originalGrandTotal
        );

        console.log(
            "Discount:",
            discount
        );

        console.log(
            "Final Total:",
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


        // =====================================
        // GO TO BILL
        // =====================================

        window.location.href =
            "bill.html";

    }
);


// =========================================
// BACK BUTTON
// =========================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "personal.html";

        }
    );

}


// =========================================
// INITIAL STATE
// =========================================

const initialResult =
    getFinalTotal();


updatePaymentCalculation(
    initialResult.finalTotal
);


// Ready Cash initial values

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
