// ============================================================
// STOREDATA.JS
// ============================================================
// CENTRAL BILL STORAGE
//
// Pages:
// Wood
// Labour
// Personal
// Advance
// Discount
// Bill
//
// DATA WILL REMAIN UNTIL USER CLICKS CLEAR.
//
// IMPORTANT:
// Do NOT call localStorage.clear()
// Do NOT clear bill data when changing pages.
// ============================================================


// ============================================================
// STORAGE KEYS
// ============================================================

const BILL_STORAGE_KEY = "current_bill_data";

const SAVED_BILLS_KEY = "saved_bills";


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


    // No current bill

    if (!stored) {

        return createEmptyBillData();

    }


    try {

        const data =
            JSON.parse(stored);


        // Make sure all default fields exist

        return {

            ...createEmptyBillData(),

            ...data

        };

    }

    catch (error) {

        console.error(
            "ERROR READING CURRENT BILL:",
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
// savePageData("advance", {
//     paymentType: "advance",
//     advanceAmount: 444,
//     balanceAmount: 69000
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


    // Bill is currently being edited

    bill.saved =
        false;


    saveBillData(
        bill
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
//
// Example:
//
// updatePageValue(
//     "advance",
//     "advanceAmount",
//     5000
// );
//
// ============================================================

function updatePageValue(
    pageName,
    key,
    value
) {

    const bill =
        getBillData();


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
// Call this when the bill is generated.
//
// IMPORTANT:
// This does NOT clear current bill data.
//
// Therefore the user can still edit the bill.
// ============================================================

function saveBillPermanently() {

    const currentBill =
        getBillData();


    // Generate unique bill ID

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


    // Check whether this bill already exists

    const existingIndex =
        savedBills.findIndex(
            function (bill) {

                return bill.id ===
                    billId;

            }
        );


    if (existingIndex >= 0) {

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
// Use this after editing a generated bill.
//
// It updates the permanent browser copy
// with the latest current bill data.
// ============================================================

function updatePermanentBill() {

    const currentBill =
        getBillData();


    if (
        !currentBill.billId
    ) {

        console.warn(
            "No permanent bill ID found."
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


    if (index === -1) {

        console.warn(
            "Permanent bill not found."
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
// DATABASE SAVE SUCCESS
// ============================================================
//
// Call this ONLY after your backend confirms
// that the bill has been successfully stored.
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
// IMPORTANT:
//
// This function should be called ONLY when
// the user intentionally clicks CLEAR.
//
// It does NOT clear other localStorage data.
// It does NOT use localStorage.clear().
// ============================================================

function clearCurrentBill() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );


    console.log(
        "CURRENT BILL CLEARED."
    );

}


// ============================================================
// CLEAR PERMANENT SAVED BILLS
// ============================================================
//
// Use this ONLY if you want to delete the
// permanently saved browser copies.
//
// Normally your CLEAR button should NOT
// call this unless that is your requirement.
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
// CLEAR ONE PERMANENT BILL
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
// START NEW BILL
// ============================================================
//
// Call this when user intentionally chooses
// "New Bill".
//
// This starts a completely fresh bill.
// ============================================================

function startNewBill() {

    localStorage.removeItem(
        BILL_STORAGE_KEY
    );


    console.log(
        "NEW BILL STARTED."
    );

}


// ============================================================
// CHECK WHETHER CURRENT BILL EXISTS
// ============================================================

function hasCurrentBill() {

    const stored =
        localStorage.getItem(
            BILL_STORAGE_KEY
        );


    return !!stored;

}


// ============================================================
// CHECK WHETHER CURRENT BILL IS SAVED
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
