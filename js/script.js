// ===========================================
// SCRIPT.JS
// ===========================================


// ===========================================
// WOOD BUTTON
// ===========================================

const woodBtn =
    document.getElementById("woodBtn");


if (woodBtn) {

    woodBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "wood.html";

        }
    );

}


// ===========================================
// PENDING BILL BUTTON
// ===========================================

const pendingBtn =
    document.getElementById("pendingBtn");


if (pendingBtn) {

    pendingBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "pendingBills.html";

        }
    );

}


// ===========================================
// HISTORY BUTTON
// ===========================================

const historyBtn =
    document.getElementById("historyBtn");


if (historyBtn) {

    historyBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "history.html";

        }
    );

}


// ===========================================
// CLEAR BUTTON
// ===========================================

const clearBtn =
    document.getElementById("clearBtn");


if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            // =================================
            // CONFIRMATION
            // =================================

            const confirmed =
                window.confirm(
                    "Are you sure you want to clear ALL bill data?"
                );


            // User clicked Cancel

            if (!confirmed) {

                return;

            }


            // =================================
            // CLEAR CENTRAL BILL STORAGE
            // =================================

            if (
                typeof clearBillData ===
                "function"
            ) {

                clearBillData();

            }
            else {

                // Fallback

                localStorage.removeItem(
                    "current_bill_data"
                );

            }


            // =================================
            // CLEAR OLD LOCAL STORAGE VALUES
            // =================================

            const keysToRemove = [

                // WOOD

                "woodTotal",
                "finalTotal",
                "grandTotal",

                // LABOUR

                "labourCharge",
                "otherCharge",
                "othersData",
                "othersTotal",

                // PERSONAL

                "customerName",
                "customerMobile",
                "customerPlace",

                // BILL

                "billNo",
                "billDate",

                // ADVANCE

                "paymentType",
                "paymentMode",
                "advanceAmount",
                "balanceAmount",

                // DISCOUNT

                "discountAmount",
                "discountApplied",
                "finalGrandTotal",
                "balanceBeforeDiscount",
                "finalBalance"

            ];


            keysToRemove.forEach(
                function (key) {

                    localStorage.removeItem(
                        key
                    );

                }
            );


            // =================================
            // CLEAR SESSION STORAGE
            // =================================

            sessionStorage.clear();


            // =================================
            // SUCCESS MESSAGE
            // =================================

            alert(
                "All bill data has been cleared successfully."
            );


            // =================================
            // STAY / GO TO INDEX
            // =================================

            window.location.href =
                "index.html";

        }
    );

}
