// ============================================================
// STOREDATA.JS
// ============================================================
// CENTRAL BILL STORAGE
//
// Stores:
//
// 1. Wood
// 2. Labour
// 3. Personal
// 4. Advance
// 5. Discount
// 6. Totals
//
// DATA WILL REMAIN UNTIL USER CLICKS CLEAR.
//
// IMPORTANT:
//
// DO NOT clear data when moving between pages.
//
// Flow:
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
//   ↓
// CBill
//
// Data remains available throughout the entire process.
//
// Only CLEAR button should remove the current bill.
// ============================================================


// ============================================================
// STORAGE KEYS
// ============================================================

const BILL_STORAGE_KEY =
    "current_bill_data";

const SAVED_BILLS_KEY =
    "saved_bills";


// ============================================================
// CREATE EMPTY BILL
// ============================================================

function createEmptyBillData() {

    return {

        wood: [],

        labour: {},

        personal: {},

        advance: {},

        discount: {},

        totals: {},

        editing: false,

        saved: false,

        database: null,

        billId: null,

        createdAt: null

    };

}


// ============================================================
// GET CURRENT BILL
// ============================================================

function getBillData() {

    const stored =
        localStorage.getItem(
            BILL_STORAGE_KEY
        );


    // No bill exists

    if (!stored) {

        return createEmptyBillData();

    }


    try {

        const data =
            JSON.parse(stored);


        // Make sure all properties exist

        return {

            ...createEmptyBillData(),

            ...data

        };

    }

    catch (error) {

        console.error(
            "ERROR READING BILL DATA:",
            error
        );


        return createEmptyBillData();

    }

}


// ============================================================
// SAVE CURRENT BILL
// ============================================================

function saveBillData(data) {

    try {

        localStorage.setItem(

            BILL_STORAGE_KEY,

            JSON.stringify(data)

        );


        console.log(
            "CURRENT BILL DATA SAVED:",
            data
        );


        return true;

    }

    catch (error) {

        console.error(
            "ERROR SAVING BILL DATA:",
            error
        );


        return false;

    }

}


// ============================================================
// SAVE ONE PAGE
// ============================================================
//
// Example:
//
// savePageData("personal", {
//     name: "Akash",
//     mobile: "9159034572"
// });
//
// ============================================================

function savePageData(
    pageName,
    pageData
) {

    const bill =
        getBillData();


    bill[pageName] =
        pageData;


    // Bill is still being edited

    bill.saved =
        false;


    saveBillData(
        bill
    );


    console.log(
        pageName +
        " DATA SAVED:",
        pageData
    );

}


// ============================================================
// GET ONE PAGE DATA
// ============================================================

function getPageData(
    pageName
) {

    const bill =
        getBillData();


    if (
        bill[pageName] === undefined ||
        bill[pageName] === null
    ) {

        return {};

    }


    return bill[pageName];

}


// ============================================================
// SAVE TOTALS
// ============================================================

function saveTotals(
    totals
) {

    const bill =
        getBillData();


    bill.totals =
        totals;


    bill.saved =
        false;


    saveBillData(
        bill
    );


    console.log(
        "TOTALS SAVED:",
        totals
    );

}


// ============================================================
// GET TOTALS
// ============================================================

function getTotals() {

    const bill =
        getBillData();


    return bill.totals || {};

}


// ============================================================
// UPDATE ONE VALUE INSIDE A PAGE
// ============================================================

function updatePageValue(
    pageName,
    key,
    value
) {

    const bill =
        getBillData();


    // Make sure page object exists

    if (
        !bill[pageName] ||
        typeof bill[pageName] !== "object"
    ) {

        bill[pageName] = {};

    }


    bill[pageName][key] =
        value;


    bill.saved =
        false;


    saveBillData(
        bill
    );

}


// ============================================================
// EDIT MODE
// ============================================================

function enableEditMode() {

    const bill =
        getBillData();


    bill.editing =
        true;


    bill.saved =
        false;


    saveBillData(
        bill
    );

}


// ============================================================
// CHECK EDIT MODE
// ============================================================

function isEditMode() {

    const bill =
        getBillData();


    return bill.editing === true;

}


// ============================================================
// DISABLE EDIT MODE
// ============================================================

function disableEditMode() {

    const bill =
        getBillData();


    bill.editing =
        false;


    saveBillData(
        bill
    );

}


// ============================================================
// SAVE BILL PERMANENTLY
// ============================================================
//
// This creates a permanent browser copy.
//
// IMPORTANT:
//
// This DOES NOT clear current_bill_data.
//
// Therefore the user can still edit the bill.
// ============================================================

function saveBillPermanently() {

    const currentBill =
        getBillData();


    // Create bill ID

    const billId =
        currentBill.billId ||
        (
            "BILL-" +
            Date.now()
        );


    const permanentBill = {

        id:
            billId,

        createdAt:
            currentBill.createdAt ||
            new Date().toISOString(),

        data:
            currentBill

    };


    const savedBills =
        getSavedBills();


    // Check if bill already exists

    const existingIndex =
        savedBills.findIndex(
            function (bill) {

                return bill.id ===
                    billId;

            }
        );


    if (
        existingIndex >= 0
    ) {

        // Update existing bill

        savedBills[
            existingIndex
        ] =
            permanentBill;

    }

    else {

        // Add new bill

        savedBills.push(
            permanentBill
        );

    }


    try {

        localStorage.setItem(

            SAVED_BILLS_KEY,

            JSON.stringify(
                savedBills
            )

        );


        // Keep current bill

        const updatedBill =
            getBillData();


        updatedBill.billId =
            billId;


        updatedBill.createdAt =
            permanentBill.createdAt;


        updatedBill.saved =
            true;


        saveBillData(
            updatedBill
        );


        console.log(
            "BILL SAVED PERMANENTLY:",
            permanentBill
        );


        return permanentBill;

    }

    catch (error) {

        console.error(
            "ERROR SAVING PERMANENT BILL:",
            error
        );


        return null;

    }

}


// ============================================================
// GET ALL PERMANENT BILLS
// ============================================================

function getSavedBills() {

    const stored =
        localStorage.getItem(
            SAVED_BILLS_KEY
        );


    if (!stored) {

        return [];

    }


    try {

        const bills =
            JSON.parse(stored);


        if (
            !Array.isArray(bills)
        ) {

            return [];

        }


        return bills;

    }

    catch (error) {

        console.error(
            "ERROR READING SAVED BILLS:",
            error
        );


        return [];

    }

}


// ============================================================
// GET ONE SAVED BILL
// ============================================================

function getSavedBill(
    billId
) {

    const savedBills =
        getSavedBills();


    return savedBills.find(
        function (bill) {

            return bill.id ===
                billId;

        }
    ) || null;

}


// ============================================================
// UPDATE PERMANENT BILL
// ============================================================
//
// Call this after editing a generated bill.
// ============================================================

function updatePermanentBill() {

    const currentBill =
        getBillData();


    if (
        !currentBill.billId
    ) {

        console.warn(
            "NO PERMANENT BILL ID FOUND."
        );


        return null;

    }


    const savedBills =
        getSavedBills();


    const index =
        savedBills.findIndex(
            function (bill) {

                return bill.id ===
                    currentBill.billId;

            }
        );


    if (
        index === -1
    ) {

        console.warn(
            "PERMANENT BILL NOT FOUND."
        );


        return null;

    }


    savedBills[index] = {

        id:
            currentBill.billId,

        createdAt:
            currentBill.createdAt ||
            new Date().toISOString(),

        data:
            currentBill

    };


    localStorage.setItem(

        SAVED_BILLS_KEY,

        JSON.stringify(
            savedBills
        )

    );


    console.log(
        "PERMANENT BILL UPDATED:",
        savedBills[index]
    );


    return savedBills[index];

}


// ============================================================
// MARK DATABASE SAVE SUCCESS
// ============================================================
//
// Call this after your backend/database confirms
// successful bill storage.
// ============================================================

function markBillSaved(
    databaseResponse
) {

    const bill =
        getBillData();


    bill.saved =
        true;


    bill.database =
        databaseResponse;


    saveBillData(
        bill
    );


    console.log(
        "DATABASE SAVE SUCCESS:",
        databaseResponse
    );

}


// ============================================================
// CLEAR CURRENT BILL
// ============================================================
//
// THIS IS THE IMPORTANT CLEAR FUNCTION.
//
// It removes:
//
// current_bill_data
// grandTotal
// finalTotal
// advanceAmount
// balanceAmount
// paymentType
// paymentMode
// discountAmount
// discountApplied
// finalGrandTotal
// old wood_page_data
//
// It does NOT use localStorage.clear().
//
// Therefore unrelated application data remains safe.
// ============================================================

function clearCurrentBill() {

    // ==========================================
    // CENTRAL BILL DATA
    // ==========================================

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );


    // ==========================================
    // OLD TOTAL DATA
    // ==========================================

    localStorage.removeItem(
        "grandTotal"
    );

    localStorage.removeItem(
        "finalTotal"
    );


    // ==========================================
    // ADVANCE DATA
    // ==========================================

    localStorage.removeItem(
        "advanceAmount"
    );

    localStorage.removeItem(
        "balanceAmount"
    );

    localStorage.removeItem(
        "paymentType"
    );

    localStorage.removeItem(
        "paymentMode"
    );


    // ==========================================
    // DISCOUNT DATA
    // ==========================================

    localStorage.removeItem(
        "discountAmount"
    );

    localStorage.removeItem(
        "discountApplied"
    );

    localStorage.removeItem(
        "finalGrandTotal"
    );


    // ==========================================
    // OLD WOOD DATA
    // ==========================================

    sessionStorage.removeItem(
        "wood_page_data"
    );


    console.log(
        "================================"
    );

    console.log(
        "CURRENT BILL COMPLETELY CLEARED"
    );

    console.log(
        "================================"
    );

}


// ============================================================
// CLEAR ONE PERMANENT BILL
// ============================================================
//
// This deletes a specific browser-saved bill.
//
// Normally you don't need this for the Clear button.
// ============================================================

function deleteSavedBill(
    billId
) {

    const savedBills =
        getSavedBills();


    const updatedBills =
        savedBills.filter(
            function (bill) {

                return bill.id !==
                    billId;

            }
        );


    localStorage.setItem(

        SAVED_BILLS_KEY,

        JSON.stringify(
            updatedBills
        )

    );


    console.log(
        "PERMANENT BILL DELETED:",
        billId
    );

}


// ============================================================
// CLEAR ALL PERMANENT BILLS
// ============================================================
//
// Use only if you intentionally want to delete
// every browser-saved generated bill.
// ============================================================

function clearSavedBills() {

    localStorage.removeItem(
        SAVED_BILLS_KEY
    );


    console.log(
        "ALL PERMANENT BILLS CLEARED."
    );

}


// ============================================================
// START NEW BILL
// ============================================================
//
// Same as clearing the current bill,
// but does not delete permanent saved bills.
// ============================================================

function startNewBill() {

    clearCurrentBill();


    console.log(
        "NEW BILL STARTED."
    );

}


// ============================================================
// CHECK CURRENT BILL
// ============================================================

function hasCurrentBill() {

    return (
        localStorage.getItem(
            BILL_STORAGE_KEY
        ) !== null
    );

}


// ============================================================
// CHECK IF CURRENT BILL IS SAVED
// ============================================================

function isCurrentBillSaved() {

    const bill =
        getBillData();


    return bill.saved === true;

}


// ============================================================
// DEBUG CURRENT BILL
// ============================================================

function showBillData() {

    console.log(
        "========================================"
    );


    console.log(
        "CURRENT BILL DATA"
    );


    console.log(
        getBillData()
    );


    console.log(
        "========================================"
    );

}


// ============================================================
// DEBUG PERMANENT BILLS
// ============================================================

function showSavedBills() {

    console.log(
        "========================================"
    );


    console.log(
        "PERMANENT SAVED BILLS"
    );


    console.log(
        getSavedBills()
    );


    console.log(
        "========================================"
    );

}


// ============================================================
// DEBUG STORAGE KEYS
// ============================================================

function showStorageKeys() {

    console.log(
        "CURRENT BILL:"
    );

    console.log(
        localStorage.getItem(
            BILL_STORAGE_KEY
        )
    );


    console.log(
        "PERMANENT BILLS:"
    );

    console.log(
        localStorage.getItem(
            SAVED_BILLS_KEY
        )
    );

}
