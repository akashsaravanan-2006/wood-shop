// ===========================================
// SCRIPT.JS
// INDEX PAGE
// ===========================================


// ===========================================
// WOOD CALCULATION BUTTON
// ===========================================

const woodBtn = document.getElementById("woodBtn");

if (woodBtn) {

    woodBtn.addEventListener("click", function () {

        window.location.href = "wood.html";

    });

}


// ===========================================
// PENDING BILL BUTTON
// ===========================================

const pendingBtn = document.getElementById("pendingBtn");

if (pendingBtn) {

    pendingBtn.addEventListener("click", function () {

        window.location.href = "pendingBills.html";

    });

}


// ===========================================
// HISTORY BUTTON
// ===========================================

const historyBtn = document.getElementById("historyBtn");

if (historyBtn) {

    historyBtn.addEventListener("click", function () {

        window.location.href = "history.html";

    });

}


// ===========================================
// CLEAR BUTTON
// ===========================================

const clearBtn = document.getElementById("clearBtn");

if (clearBtn) {

    clearBtn.addEventListener("click", function () {

        // -----------------------------------
        // CONFIRMATION
        // -----------------------------------

        const confirmClear = confirm(
            "Are you sure you want to clear ALL entered bill data?"
        );

        if (!confirmClear) {

            return;

        }


        // ===================================
        // CLEAR CENTRAL BILL STORAGE
        // ===================================

        if (typeof clearBillData === "function") {

            clearBillData();

        } else {

            // Fallback
            localStorage.removeItem("current_bill_data");

        }


        // ===================================
        // CLEAR OLD / LEGACY STORAGE VALUES
        // ===================================

        const keysToRemove = [

            // -------------------------------
            // WOOD
            // -------------------------------

            "woodTotal",
            "grandTotal",
            "finalTotal",
            "woodData",
            "wood_page_data",

            // -------------------------------
            // LABOUR
            // -------------------------------

            "labourCharge",
            "otherCharge",
            "othersData",
            "othersTotal",
            "labourData",

            // -------------------------------
            // PERSONAL
            // -------------------------------

            "customerName",
            "customerMobile",
            "customerPlace",
            "personalData",

            // -------------------------------
            // BILL
            // -------------------------------

            "billNo",
            "billDate",

            // -------------------------------
            // ADVANCE
            // -------------------------------

            "paymentType",
            "paymentMode",
            "advanceAmount",
            "balanceAmount",
            "advanceData",

            // -------------------------------
            // DISCOUNT
            // -------------------------------

            "discountAmount",
            "discountApplied",
            "finalGrandTotal",
            "balanceBeforeDiscount",
            "finalBalance",
            "discountData",

            // -------------------------------
            // OTHER TOTALS
            // -------------------------------

            "subtotal",
            "subtotalAmount",
            "finalBalanceAmount"
        ];


        keysToRemove.forEach(function (key) {

            localStorage.removeItem(key);

        });


        // ===================================
        // CLEAR SESSION STORAGE
        // ===================================

        sessionStorage.clear();


        // ===================================
        // SUCCESS MESSAGE
        // ===================================

        alert(
            "All entered bill data has been cleared successfully."
        );


        // ===================================
        // GO TO INDEX PAGE
        // ===================================

        window.location.href = "index.html";

    });

}
