// =======================================
// STOREDATA.JS
// =======================================
// CENTRAL TEMPORARY BILL STORAGE
//
// Data is kept until the BILL IS SUCCESSFULLY
// SAVED TO DATABASE.
//
// IMPORTANT:
// ---------------------------------------
// Wood Confirm     -> DO NOT CLEAR
// Labour Next      -> DO NOT CLEAR
// Personal Next    -> DO NOT CLEAR
// Advance Next     -> DO NOT CLEAR
// Discount Next    -> DO NOT CLEAR
// Bill Edit        -> DO NOT CLEAR
// Bill Back        -> DO NOT CLEAR
//
// ONLY:
// Database save SUCCESS -> clearBillData()
// New Bill / Home       -> startNewBill()
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

        saved: false,

        database: null

    };

}


// =======================================
// GET COMPLETE BILL DATA
// =======================================

function getBillData() {

    const stored =
        localStorage.getItem(
            BILL_STORAGE_KEY
        );

    // No existing bill
    if (!stored) {

        return createEmptyBillData();

    }


    try {

        const data =
            JSON.parse(stored);


        // Make sure all sections exist
        return {

            ...createEmptyBillData(),

            ...data

        };

    }
    catch (error) {

        console.error(
            "Error reading stored bill data:",
            error
        );

        return createEmptyBillData();

    }

}


// =======================================
// SAVE COMPLETE BILL
// =======================================

function saveBillData(data) {

    try {

        localStorage.setItem(

            BILL_STORAGE_KEY,

            JSON.stringify(data)

        );

        console.log(
            "Bill data stored successfully."
        );

    }
    catch (error) {

        console.error(
            "Unable to save bill data:",
            error
        );

    }

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


    // VERY IMPORTANT:
    // Saving a page NEVER clears anything.

    bill.saved =
        false;


    saveBillData(bill);


    console.log(
        pageName +
        " data saved."
    );

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


    bill.saved =
        false;


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


    bill.saved =
        false;


    saveBillData(bill);


    console.log(
        "Edit mode enabled."
    );

}


// =======================================
// CHECK EDIT MODE
// =======================================

function isEditMode() {

    const bill =
        getBillData();


    return (
        bill.editing === true
    );

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
// CALL THIS ONLY AFTER YOUR DATABASE/API
// CONFIRMS SUCCESS.
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


    console.log(
        "Bill successfully saved to database."
    );

}


// =======================================
// CLEAR BILL
// =======================================
// IMPORTANT:
//
// DO NOT CALL THIS FROM:
// wood.js Confirm
// labour.js
// personal.js
// advance.js
// discount.js
//
// Call ONLY after database SUCCESS.
// =======================================

function clearBillData() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );


    console.log(
        "Bill data cleared after successful database save."
    );

}


// =======================================
// START COMPLETELY NEW BILL
// =======================================
// Use this when the user intentionally
// wants to start a NEW bill.
// =======================================

function startNewBill() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );


    const newBill =
        createEmptyBillData();


    saveBillData(
        newBill
    );


    console.log(
        "New bill started."
    );

}


// =======================================
// DEBUG - SHOW ALL STORED DATA
// =======================================

function showBillData() {

    const bill =
        getBillData();


    console.log(
        "================================"
    );

    console.log(
        "CURRENT BILL DATA"
    );

    console.log(
        "================================"
    );


    console.log(
        "WOOD:",
        bill.wood
    );

    console.log(
        "LABOUR:",
        bill.labour
    );

    console.log(
        "PERSONAL:",
        bill.personal
    );

    console.log(
        "ADVANCE:",
        bill.advance
    );

    console.log(
        "DISCOUNT:",
        bill.discount
    );

    console.log(
        "TOTALS:",
        bill.totals
    );

    console.log(
        "EDITING:",
        bill.editing
    );

    console.log(
        "SAVED:",
        bill.saved
    );

    console.log(
        "DATABASE:",
        bill.database
    );

    console.log(
        "================================"
    );

}


// =======================================
// OPTIONAL DEBUG:
// SHOW DATA AUTOMATICALLY
// =======================================

console.log(
    "storedata.js loaded."
);
