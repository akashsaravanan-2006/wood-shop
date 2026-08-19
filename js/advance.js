// =========================================
// ADVANCE.JS
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const grandTotalInput =
    document.getElementById("grandTotal");

const discountInput =
    document.getElementById("discountAmount");

const finalGrandTotalInput =
    document.getElementById("finalGrandTotal");

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

const originalGrandTotal =
    Number(
        localStorage.getItem("finalTotal")
    ) || 0;


// =========================================
// SHOW ORIGINAL GRAND TOTAL
// =========================================

grandTotalInput.value =
    originalGrandTotal.toFixed(0);


// =========================================
// CALCULATE FINAL GRAND TOTAL
// =========================================

function calculateFinalTotal() {

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

    if (discount > originalGrandTotal) {

        discount =
            originalGrandTotal;

        discountInput.value =
            originalGrandTotal;

        alert(
            "Discount cannot be greater than Grand Total."
        );

    }


    const finalTotal =
        originalGrandTotal - discount;


    finalGrandTotalInput.value =
        finalTotal.toFixed(0);


    // Store discount

    localStorage.setItem(
        "discountAmount",
        discount.toFixed(0)
    );


    // Store final total

    localStorage.setItem(
        "finalTotal",
        finalTotal.toFixed(0)
    );


    return finalTotal;

}


// =========================================
// DISCOUNT INPUT
// =========================================

discountInput.addEventListener(
    "input",
    function () {

        calculateFinalTotal();

        updatePaymentType();

    }
);


// =========================================
// PAYMENT TYPE
// READY CASH / ADVANCE
// =========================================

function updatePaymentType() {

    const selected =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (!selected) {
        return;
    }


    const finalTotal =
        calculateFinalTotal();


    // =====================================
    // ADVANCE
    // =====================================

    if (selected.value === "advance") {

        advanceSection.style.display =
            "block";


        // Do not automatically calculate
        // until user enters advance

        if (
            advanceAmountInput.value === ""
        ) {

            balanceAmountInput.value = "";

        }

        return;
    }


    // =====================================
    // READY CASH
    // =====================================

    advanceSection.style.display =
        "none";


    // Clear advance input

    advanceAmountInput.value = "";

    balanceAmountInput.value = "";


    // Ready Cash means full amount paid

    localStorage.setItem(
        "advanceAmount",
        finalTotal.toFixed(0)
    );


    localStorage.setItem(
        "balanceAmount",
        "0"
    );

}


// =========================================
// PAYMENT TYPE CHANGE
// =========================================

paymentTypes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                updatePaymentType();

            }
        );

    }
);


// =========================================
// PAYMENT MODE CHANGE
// =========================================

paymentModes.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                console.log(
                    "Payment Mode:",
                    this.value
                );

            }
        );

    }
);


// =========================================
// CALCULATE BALANCE
// =========================================

calculateBtn.addEventListener(
    "click",
    function () {

        const finalTotal =
            calculateFinalTotal();


        let advance =
            Number(
                advanceAmountInput.value
            ) || 0;


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


        if (advance > finalTotal) {

            alert(
                "Advance cannot be greater than Final Grand Total."
            );

            advanceAmountInput.focus();

            return;

        }


        // =====================================
        // BALANCE
        // =====================================

        const balance =
            finalTotal - advance;


        balanceAmountInput.value =
            balance.toFixed(0);


        // =====================================
        // STORE
        // =====================================

        localStorage.setItem(
            "advanceAmount",
            advance.toFixed(0)
        );


        localStorage.setItem(
            "balanceAmount",
            balance.toFixed(0)
        );

    }
);


// =========================================
// NEXT BUTTON
// =========================================

nextBtn.addEventListener(
    "click",
    function () {

        const finalTotal =
            calculateFinalTotal();


        // =====================================
        // PAYMENT TYPE
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
        // PAYMENT MODE
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

        if (paymentType === "cash") {

            localStorage.setItem(
                "advanceAmount",
                finalTotal.toFixed(0)
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


            const balance =
                Number(
                    balanceAmountInput.value
                ) || 0;


            if (advance <= 0) {

                alert(
                    "Please enter Advance Amount."
                );

                advanceAmountInput.focus();

                return;

            }


            if (
                balanceAmountInput.value === ""
            ) {

                alert(
                    "Please calculate the Balance Amount."
                );

                return;

            }


            if (advance > finalTotal) {

                alert(
                    "Advance cannot be greater than Final Grand Total."
                );

                return;

            }


            localStorage.setItem(
                "advanceAmount",
                advance.toFixed(0)
            );


            localStorage.setItem(
                "balanceAmount",
                balance.toFixed(0)
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


        localStorage.setItem(
            "discountAmount",
            (
                Number(
                    discountInput.value
                ) || 0
            ).toFixed(0)
        );


        localStorage.setItem(
            "grandTotal",
            finalTotal.toFixed(0)
        );


        localStorage.setItem(
            "finalTotal",
            finalTotal.toFixed(0)
        );


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "=============================="
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
            "Original Grand Total:",
            originalGrandTotal
        );

        console.log(
            "Discount:",
            discountInput.value || 0
        );

        console.log(
            "Final Grand Total:",
            finalTotal
        );

        console.log(
            "Advance:",
            localStorage.getItem(
                "advanceAmount"
            )
        );

        console.log(
            "Balance:",
            localStorage.getItem(
                "balanceAmount"
            )
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
        function () {

            window.location.href =
                "personal.html";

        }
    );

}


// =========================================
// INITIAL LOAD
// =========================================

calculateFinalTotal();

updatePaymentType();
