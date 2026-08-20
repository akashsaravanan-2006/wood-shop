// =======================================
// STOREDATA.JS
// =======================================
// CENTRAL TEMPORARY BILL STORAGE
//
// Stores data from:
// Wood
// Labour
// Personal
// Advance
// Discount
// Totals
//
// Data remains until:
// 1. Bill successfully saved to DB
// 2. User starts a new bill / clicks Home
//
// IMPORTANT:
// This file does NOT clear data automatically.
// =======================================

const BILL_STORAGE_KEY = "current_bill_data";


// =======================================
// CREATE EMPTY BILL
// =======================================

function createEmptyBillData() {

    return {
        wood: [],
        labour: {},
        personal: {},
        advance: {},
        discount: {},
        totals: {},
        editing: false,
        saved: false
    };

}


// =======================================
// GET COMPLETE BILL
// =======================================

function getBillData() {

    const stored =
        localStorage.getItem(BILL_STORAGE_KEY);

    if (!stored) {
        return createEmptyBillData();
    }

    try {

        const data = JSON.parse(stored);

        return {
            ...createEmptyBillData(),
            ...data
        };

    } catch (error) {

        console.error(
            "Error reading bill data:",
            error
        );

        return createEmptyBillData();
    }
}


// =======================================
// SAVE COMPLETE BILL
// =======================================

function saveBillData(data) {

    localStorage.setItem(
        BILL_STORAGE_KEY,
        JSON.stringify(data)
    );

    console.log(
        "CURRENT BILL DATA SAVED:",
        data
    );
}


// =======================================
// SAVE ONE PAGE
// =======================================

function savePageData(
    pageName,
    pageData
) {

    const bill =
        getBillData();

    bill[pageName] =
        pageData;

    saveBillData(bill);

}


// =======================================
// GET ONE PAGE
// =======================================

function getPageData(
    pageName
) {

    const bill =
        getBillData();

    return bill[pageName] || {};

}


// =======================================
// SAVE TOTALS
// =======================================

function saveTotals(
    totals
) {

    const bill =
        getBillData();

    bill.totals =
        totals;

    saveBillData(bill);

}


// =======================================
// GET TOTALS
// =======================================

function getTotals() {

    const bill =
        getBillData();

    return bill.totals || {};

}


// =======================================
// EDIT MODE
// =======================================

function enableEditMode() {

    const bill =
        getBillData();

    bill.editing =
        true;

    saveBillData(bill);

}


// =======================================
// CHECK EDIT MODE
// =======================================

function isEditMode() {

    const bill =
        getBillData();

    return bill.editing === true;

}


// =======================================
// DISABLE EDIT MODE
// =======================================

function disableEditMode() {

    const bill =
        getBillData();

    bill.editing =
        false;

    saveBillData(bill);

}


// =======================================
// DATABASE SAVE SUCCESS
// =======================================

function markBillSaved(
    databaseResponse
) {

    const bill =
        getBillData();

    bill.saved =
        true;

    bill.database =
        databaseResponse;

    saveBillData(bill);

}


// =======================================
// CLEAR ONLY AFTER DB SAVE
// =======================================

function clearBillData() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );

    console.log(
        "ALL TEMPORARY BILL DATA CLEARED."
    );

}


// =======================================
// START NEW BILL
// =======================================

function startNewBill() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );

    saveBillData(
        createEmptyBillData()
    );

}


// =======================================
// DEBUG
// =======================================

function showBillData() {

    console.log(
        "========== STORED BILL =========="
    );

    console.log(
        getBillData()
    );

    console.log(
        "================================="
    );

}
