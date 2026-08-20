// =======================================
// WOOD BUTTON
// =======================================

const woodBtn = document.getElementById("woodBtn");

if (woodBtn) {

    woodBtn.addEventListener("click", function () {

        window.location.href = "wood.html";

    });

}


// =======================================
// PLATE BUTTON
// =======================================

const plateBtn = document.getElementById("plateBtn");

if (plateBtn) {

    plateBtn.addEventListener("click", function () {

        window.location.href = "plate.html";

    });

}


// =======================================
// HISTORY BUTTON
// =======================================

const historyBtn = document.getElementById("historyBtn");

if (historyBtn) {

    historyBtn.addEventListener("click", function () {

        window.location.href = "history.html";

    });

}// ===========================================
// CLEAR ALL BILL DATA
// ===========================================

const clearBtn =
    document.getElementById("clearBtn");


if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            const confirmClear =
                confirm(
                    "Are you sure you want to clear all entered data?"
                );


            if (!confirmClear) {

                return;

            }


            // =================================
            // CLEAR CENTRAL BILL DATA
            // =================================

            if (
                typeof clearBillData === "function"
            ) {

                clearBillData();

            }


            // =================================
            // CLEAR OLD LOCAL STORAGE VALUES
            // =================================

            const keysToRemove = [

                // Wood
                "woodTotal",
                "finalTotal",
                "grandTotal",

                // Labour
                "labourCharge",
                "otherCharge",
                "othersData",
                "othersTotal",

                // Personal
                "customerName",
                "customerMobile",
                "customerPlace",

                // Bill
                "billNo",
                "billDate",
                "billCount",

                // Advance
                "paymentType",
                "paymentMode",
                "advanceAmount",
                "balanceAmount",

                // Discount
                "discountAmount",
                "discountApplied",
                "finalGrandTotal",
                "balanceBeforeDiscount",
                "finalBalance"

            ];


            keysToRemove.forEach(
                function (key) {

                    localStorage.removeItem(key);

                }
            );


            // =================================
            // CLEAR OLD SESSION STORAGE
            // =================================

            sessionStorage.clear();


            // =================================
            // MESSAGE
            // =================================

            alert(
                "All bill data has been cleared successfully."
            );


            // =================================
            // GO TO INDEX PAGE
            // =================================

            window.location.href =
                "index.html";

        }
    );

}
