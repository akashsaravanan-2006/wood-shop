// =======================================
// STOREDATA.JS
// =======================================
// CENTRAL BILL STORAGE
//
// Data remains until:
// 1. Bill is successfully saved to DB
// 2. User intentionally starts a NEW bill
//
// NEVER clear data when moving between pages.
// =======================================

const BILL_STORAGE_KEY = "current_bill_data";


// =======================================
// CREATE NEW BILL OBJECT
// =======================================

function createEmptyBillData() {

    return {
        wood: {},
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
            "Error reading bill storage:",
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
        "BILL DATA SAVED:",
        data
    );

}


// =======================================
// SAVE ONE PAGE
// =======================================

function savePageData(pageName, pageData) {

    const bill =
        getBillData();

    bill[pageName] =
        pageData;

    // Bill is not saved to DB yet
    bill.saved = false;

    saveBillData(bill);

}


// =======================================
// GET ONE PAGE
// =======================================

function getPageData(pageName) {

    const bill =
        getBillData();

    return bill[pageName] || {};

}


// =======================================
// SAVE TOTALS
// =======================================

function saveTotals(totals) {

    const bill =
        getBillData();

    bill.totals =
        totals;

    bill.saved = false;

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

    bill.editing = true;

    bill.saved = false;

    saveBillData(bill);

}


// =======================================
// DATABASE SAVE SUCCESS
// =======================================

function markBillSaved(databaseResponse) {

    const bill =
        getBillData();

    bill.saved = true;

    bill.database =
        databaseResponse;

    saveBillData(bill);

}


// =======================================
// CLEAR BILL
// =======================================
// IMPORTANT:
//
// ONLY call this AFTER DB SUCCESS.
//
// DO NOT call this from:
// wood.js
// labour.js
// personal.js
// advance.js
// discount.js
// =======================================

function clearBillData() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );

    console.log(
        "BILL DATA CLEARED AFTER DATABASE SAVE."
    );

}


// =======================================
// START COMPLETELY NEW BILL
// =======================================

function startNewBill() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );

    console.log(
        "NEW BILL STARTED."
    );

}


// =======================================
// DEBUG
// =======================================

function showBillData() {

    console.log(
        "================================"
    );

    console.log(
        "CURRENT BILL DATA"
    );

    console.log(
        getBillData()
    );

    console.log(
        "================================"
    );

}
