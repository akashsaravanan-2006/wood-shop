// =======================================
// STOREDATA.JS
// =======================================
// Central temporary storage for ONE BILL.
//
// Stores:
// 1. Wood
// 2. Labour
// 3. Personal
// 4. Advance
// 5. Discount
// 6. Totals
//
// Data remains available while moving
// between pages and while editing.
//
// Data is cleared ONLY after successful
// database save / new bill.
//
// =======================================

const BILL_STORAGE_KEY = "current_bill_data";


// =======================================
// DEFAULT DATA
// =======================================

function createEmptyBillData() {

    return {

        wood: {},

        labour: {},

        personal: {},

        advance: {},

        discount: {},

        totals: {},

        bill: {},

        editing: false,

        savedToDatabase: false

    };

}


// =======================================
// GET ALL BILL DATA
// =======================================

function getBillData() {

    const stored =
        sessionStorage.getItem(
            BILL_STORAGE_KEY
        );


    if (!stored) {

        return createEmptyBillData();

    }


    try {

        const data =
            JSON.parse(stored);


        return {

            ...createEmptyBillData(),

            ...data

        };

    }
    catch (error) {

        console.error(
            "Error reading bill storage:",
            error
        );

        return createEmptyBillData();

    }

}


// =======================================
// SAVE ALL BILL DATA
// =======================================

function saveBillData(data) {

    sessionStorage.setItem(

        BILL_STORAGE_KEY,

        JSON.stringify(data)

    );


    console.log(
        "Bill data saved:",
        data
    );

}


// =======================================
// UPDATE ONE PAGE
// =======================================

function savePageData(
    pageName,
    data
) {

    const billData =
        getBillData();


    billData[pageName] =
        data;


    saveBillData(
        billData
    );

}


// =======================================
// GET ONE PAGE DATA
// =======================================

function getPageData(
    pageName
) {

    const billData =
        getBillData();


    return billData[pageName] || {};

}


// =======================================
// UPDATE TOTALS
// =======================================

function saveTotals(
    totals
) {

    const billData =
        getBillData();


    billData.totals =
        totals;


    saveBillData(
        billData
    );

}


// =======================================
// GET TOTALS
// =======================================

function getTotals() {

    const billData =
        getBillData();


    return billData.totals || {};

}


// =======================================
// EDIT MODE
// =======================================

function enableEditMode() {

    const billData =
        getBillData();


    billData.editing =
        true;


    saveBillData(
        billData
    );

}


// =======================================
// CHECK EDIT MODE
// =======================================

function isEditMode() {

    const billData =
        getBillData();


    return billData.editing === true;

}


// =======================================
// DATABASE SAVE SUCCESS
// =======================================

function markDatabaseSaved(
    databaseResponse
) {

    const billData =
        getBillData();


    billData.savedToDatabase =
        true;


    billData.editing =
        false;


    billData.database =
        databaseResponse;


    saveBillData(
        billData
    );

}


// =======================================
// CLEAR BILL DATA
// =======================================
// Call this ONLY after successful
// database save.
//
// =======================================

function clearBillData() {

    sessionStorage.removeItem(
        BILL_STORAGE_KEY
    );


    console.log(
        "Temporary bill data cleared."
    );

}


// =======================================
// START NEW BILL
// =======================================

function startNewBill() {

    sessionStorage.removeItem(
        BILL_STORAGE_KEY
    );


    saveBillData(
        createEmptyBillData()
    );


    console.log(
        "New bill started."
    );

}


// =======================================
// DEBUG
// =======================================

function showBillData() {

    console.log(
        "========== CURRENT BILL =========="
    );

    console.log(
        getBillData()
    );

    console.log(
        "=================================="
    );

}
