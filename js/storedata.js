// =======================================
// STOREDATA.JS
// =======================================
// Temporary Bill Data Storage
//
// Stores ALL form data until the bill
// is successfully saved into the database.
//
// Flow:
//
// Wood → Labour → Personal → Advance
//      → Discount → Bill → Confirm → DB
//
// Data is cleared ONLY after successful
// database save or when user clicks Home.
// =======================================


const BILL_STORAGE_KEY = "current_bill_data";


// =======================================
// DEFAULT BILL DATA
// =======================================

function getDefaultBillData() {

    return {

        wood: {},
        labour: {},
        personal: {},
        advance: {},
        discount: {},

        // Bill calculation values
        totals: {},

        // Editing state
        editing: false,

        // Database state
        saved: false

    };

}


// =======================================
// GET COMPLETE BILL DATA
// =======================================

function getBillData() {

    const saved =
        sessionStorage.getItem(
            BILL_STORAGE_KEY
        );

    if (!saved) {

        return getDefaultBillData();

    }


    try {

        const data =
            JSON.parse(saved);

        return {
            ...getDefaultBillData(),
            ...data
        };

    }
    catch (error) {

        console.error(
            "Unable to read stored bill data:",
            error
        );

        return getDefaultBillData();

    }

}


// =======================================
// SAVE COMPLETE BILL DATA
// =======================================

function saveBillData(data) {

    sessionStorage.setItem(

        BILL_STORAGE_KEY,

        JSON.stringify(data)

    );


    console.log(
        "Bill data stored successfully."
    );

}


// =======================================
// UPDATE ONE SECTION
// =======================================

function updateBillSection(
    section,
    data
) {

    const billData =
        getBillData();


    billData[section] = data;


    saveBillData(
        billData
    );

}


// =======================================
// GET ONE SECTION
// =======================================

function getBillSection(
    section
) {

    const billData =
        getBillData();


    return billData[section] || {};

}


// =======================================
// SAVE TOTALS
// =======================================

function saveBillTotals(
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

function getBillTotals() {

    const billData =
        getBillData();


    return billData.totals || {};

}


// =======================================
// START EDIT MODE
// =======================================

function startBillEdit() {

    const billData =
        getBillData();


    billData.editing =
        true;


    saveBillData(
        billData
    );


    console.log(
        "Bill edit mode enabled."
    );

}


// =======================================
// CHECK EDIT MODE
// =======================================

function isBillEditing() {

    const billData =
        getBillData();


    return billData.editing === true;

}


// =======================================
// STOP EDIT MODE
// =======================================

function stopBillEdit() {

    const billData =
        getBillData();


    billData.editing =
        false;


    saveBillData(
        billData
    );

}


// =======================================
// MARK BILL AS SAVED
// =======================================

function markBillSaved(
    databaseData
) {

    const billData =
        getBillData();


    billData.saved =
        true;


    billData.editing =
        false;


    billData.database =
        databaseData;


    saveBillData(
        billData
    );

}


// =======================================
// CLEAR ALL BILL DATA
// =======================================

function clearBillData() {

    sessionStorage.removeItem(
        BILL_STORAGE_KEY
    );


    console.log(
        "All temporary bill data cleared."
    );

}


// =======================================
// DEBUG
// =======================================

function showStoredBillData() {

    console.log(
        "CURRENT BILL DATA:"
    );


    console.log(
        getBillData()
    );

}
