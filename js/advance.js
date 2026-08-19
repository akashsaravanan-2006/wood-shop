// =========================================
// ADVANCE.JS
// Discount + Payment Type + Advance
// =========================================


// =========================================
// GRAND TOTAL
// =========================================

const originalGrandTotal =
    Number(
        localStorage.getItem("finalTotal")
    ) || 0;


const grandTotalInput =
    document.getElementById("grandTotal");


const discountInput =
    document.getElementById("discountAmount");


const advanceInput =
    document.getElementById("advanceAmount");


const balanceInput =
    document.getElementById("balanceAmount");


const advanceSection =
    document.getElementById("advanceSection");


const calculateBtn =
    document.getElementById("calculateBtn");


const nextBtn =
    document.getElementById("nextBtn");


const paymentType =
    document.getElementsByName("paymentType");


const backBtn =
    document.getElementById("backBtn");


// =========================================
// INITIAL GRAND TOTAL
// =========================================

grandTotalInput.value =
    originalGrandTotal.toFixed(0);


// =========================================
// LOAD SAVED DISCOUNT
// =========================================

const savedDiscount =
    Number(
        localStorage.getItem("discountAmount")
    ) || 0;


if (savedDiscount > 0) {

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


    // Discount cannot exceed total

    if (discount > originalGrandTotal) {

        alert(
            "Discount cannot be greater than Grand Total"
        );

        discountInput.value = "";

        discount = 0;

    }


    const finalTotal =
        originalGrandTotal - discount;


    // Display discounted total

    grandTotalInput.value =
        finalTotal.toFixed(0);


    // Save discount

    localStorage.setItem(
        "discountAmount",
        String(discount)
    );


    // Save final total

    localStorage.setItem(
        "grandTotal",
        String(finalTotal)
    );


    localStorage.setItem(
        "finalTotal",
        String(finalTotal)
    );


    return finalTotal;

}


// =========================================
// DISCOUNT LIVE CALCULATION
// =========================================

discountInput.addEventListener(
    "input",
    function() {

        calculateFinalTotal();

    }
);


// =========================================
// PAYMENT TYPE
// =========================================

function updatePaymentSection() {

    const selected =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (!selected) {
        return;
    }


    if (selected.value === "advance") {

        advanceSection.style.display =
            "block";


        advanceInput.value = "";

        balanceInput.value = "";

    }

    else {

        advanceSection.style.display =
            "none";


        const finalTotal =
            calculateFinalTotal();


        // Cash / UPI means full payment

        advanceInput.value =
            finalTotal.toFixed(0);


        balanceInput.value =
            "0";


        localStorage.setItem(
            "advanceAmount",
            String(finalTotal)
        );


        localStorage.setItem(
            "balanceAmount",
            "0"
        );

    }

}


paymentType.forEach(
    function(radio) {

        radio.addEventListener(
            "change",
            updatePaymentSection
        );

    }
);


// =========================================
// CALCULATE ADVANCE
// =========================================

calculateBtn.addEventListener(
    "click",
    function() {

        const finalTotal =
            calculateFinalTotal();


        let advance =
            Number(
                advanceInput.value
            ) || 0;


        if (advance < 0) {

            alert(
                "Advance cannot be negative"
            );

            return;

        }


        if (advance > finalTotal) {

            alert(
                "Advance cannot be greater than Grand Total"
            );

            advanceInput.value = "";

            balanceInput.value = "";

            return;

        }


        const balance =
            finalTotal - advance;


        advanceInput.value =
            advance.toFixed(0);


        balanceInput.value =
            balance.toFixed(0);


        localStorage.setItem(
            "advanceAmount",
            String(advance)
        );


        localStorage.setItem(
            "balanceAmount",
            String(balance)
        );

    }
);


// =========================================
// NEXT
// =========================================

nextBtn.addEventListener(
    "click",
    function() {

        const selected =
            document.querySelector(
                'input[name="paymentType"]:checked'
            );


        if (!selected) {

            alert(
                "Please select Payment Type"
            );

            return;

        }


        const finalTotal =
            calculateFinalTotal();


        const discount =
            Number(
                discountInput.value
            ) || 0;


        let advance = 0;

        let balance = 0;


        // =====================================
        // ADVANCE PAYMENT
        // =====================================

        if (selected.value === "advance") {

            advance =
                Number(
                    advanceInput.value
                ) || 0;


            if (
                balanceInput.value === ""
            ) {

                alert(
                    "Please calculate the balance amount."
                );

                return;

            }


            if (advance > finalTotal) {

                alert(
                    "Advance cannot be greater than Grand Total"
                );

                return;

            }


            balance =
                finalTotal - advance;

        }


        // =====================================
        // CASH / UPI
        // =====================================

        else {

            advance =
                finalTotal;

            balance = 0;

        }


        // =====================================
        // SAVE PAYMENT DATA
        // =====================================

        localStorage.setItem(
            "paymentType",
            selected.value
        );


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
            "advanceAmount",
            String(advance)
        );


        localStorage.setItem(
            "balanceAmount",
            String(balance)
        );


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "=============================="
        );

        console.log(
            "Payment Type:",
            selected.value
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
            "Advance:",
            advance
        );

        console.log(
            "Balance:",
            balance
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

updatePaymentSection();
