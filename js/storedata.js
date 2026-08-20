// ============================================================
// STOREDATA.JS
// ============================================================
// CENTRAL TEMPORARY BILL STORAGE
//
// Data remains while moving between pages:
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
// Data is cleared ONLY when:
// 1. Database save is successful
// 2. User intentionally starts a new bill
// ============================================================


const BILL_STORAGE_KEY =
    "current_bill_data";


// ============================================================
// CREATE EMPTY BILL
// ============================================================

function createEmptyBillData() {

    return {

        wood: {
            calculations: [],
            grandTotal: 0
        },

        labour: {},

        personal: {},

        advance: {},

        discount: {},

        totals: {},

        editing: false,

        saved: false

    };

}


// ============================================================
// GET BILL DATA
// ============================================================

function getBillData() {

    const stored =
        localStorage.getItem(
            BILL_STORAGE_KEY
        );


    if (!stored) {

        return createEmptyBillData();

    }


    try {

        const data =
            JSON.parse(stored);


        const empty =
            createEmptyBillData();


        return {

            ...empty,

            ...data,

            // IMPORTANT:
            // Preserve every page individually.

            wood:
                data.wood ||
                empty.wood,

            labour:
                data.labour ||
                empty.labour,

            personal:
                data.personal ||
                empty.personal,

            advance:
                data.advance ||
                empty.advance,

            discount:
                data.discount ||
                empty.discount,

            totals:
                data.totals ||
                empty.totals

        };

    }
    catch (error) {

        console.error(
            "Error reading bill data:",
            error
        );


        return createEmptyBillData();

    }

}


// ============================================================
// SAVE COMPLETE BILL
// ============================================================

function saveBillData(data) {

    try {

        localStorage.setItem(

            BILL_STORAGE_KEY,

            JSON.stringify(data)

        );


        console.log(
            "BILL DATA SAVED:",
            data
        );

    }
    catch (error) {

        console.error(
            "Unable to save bill data:",
            error
        );

    }

}


// ============================================================
// SAVE ONE PAGE
// ============================================================

function savePageData(
    pageName,
    pageData
) {

    const bill =
        getBillData();


    // IMPORTANT:
    // Only update this page.
    //
    // Do NOT replace the whole bill.

    bill[pageName] =
        pageData;


    bill.saved =
        false;


    saveBillData(
        bill
    );

}


// ============================================================
// GET ONE PAGE
// ============================================================

function getPageData(
    pageName
) {

    const bill =
        getBillData();


    return (
        bill[pageName] ||
        {}
    );

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

}


// ============================================================
// GET TOTALS
// ============================================================

function getTotals() {

    const bill =
        getBillData();


    return (
        bill.totals ||
        {}
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


    return (
        bill.editing === true
    );

}


// ============================================================
// DATABASE SAVE SUCCESS
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

}


// ============================================================
// CLEAR AFTER DATABASE SAVE
// ============================================================

function clearBillData() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );


    console.log(
        "ALL BILL DATA CLEARED AFTER DB SAVE."
    );

}


// ============================================================
// START NEW BILL
// ============================================================

function startNewBill() {

    // Clear old bill.

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );


    // Also clear old compatibility keys.

    localStorage.removeItem(
        "woodData"
    );

    localStorage.removeItem(
        "woodTotal"
    );

    localStorage.removeItem(
        "grandTotal"
    );

    localStorage.removeItem(
        "finalTotal"
    );

    localStorage.removeItem(
        "advanceAmount"
    );

    localStorage.removeItem(
        "balanceAmount"
    );

    localStorage.removeItem(
        "discountAmount"
    );

    localStorage.removeItem(
        "discountApplied"
    );

    localStorage.removeItem(
        "finalGrandTotal"
    );


    console.log(
        "NEW BILL STARTED."
    );

}


// ============================================================
// DEBUG
// ============================================================

function showBillData() {

    const data =
        getBillData();


    console.log(
        "======================================"
    );

    console.log(
        "CURRENT BILL DATA"
    );

    console.log(
        data
    );

    console.log(
        "======================================"
    );

}
