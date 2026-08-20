// =======================================
// STOREDATA.JS
// CENTRAL BILL STORAGE
// =======================================

const BILL_STORAGE_KEY = "current_bill_data";


// =======================================
// EMPTY BILL
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

    bill.saved = false;

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
// CLEAR EVERYTHING
// ONLY USE FROM CLEAR BUTTON
// =======================================

function clearBillData() {

    // Central storage
    localStorage.removeItem(
        BILL_STORAGE_KEY
    );


    // =====================================
    // OLD WOOD STORAGE
    // =====================================

    localStorage.removeItem("woodData");
    localStorage.removeItem("wood_page_data");
    localStorage.removeItem("wood");
    localStorage.removeItem("woodDataStorage");


    // =====================================
    // OLD LABOUR STORAGE
    // =====================================

    localStorage.removeItem("labourData");
    localStorage.removeItem("labourCharge");
    localStorage.removeItem("otherCharge");
    localStorage.removeItem("othersData");
    localStorage.removeItem("labour");


    // =====================================
    // OLD PERSONAL STORAGE
    // =====================================

    localStorage.removeItem("personalData");
    localStorage.removeItem("personal");

    localStorage.removeItem("customerName");
    localStorage.removeItem("customerMobile");
    localStorage.removeItem("customerPlace");


    // =====================================
    // OLD ADVANCE STORAGE
    // =====================================

    localStorage.removeItem("advanceData");
    localStorage.removeItem("advance");

    localStorage.removeItem("advanceAmount");
    localStorage.removeItem("balanceAmount");

    localStorage.removeItem("paymentType");
    localStorage.removeItem("paymentMode");


    // =====================================
    // OLD DISCOUNT STORAGE
    // =====================================

    localStorage.removeItem("discountData");
    localStorage.removeItem("discount");

    localStorage.removeItem("discountAmount");
    localStorage.removeItem("discountApplied");
    localStorage.removeItem("billDiscount");
    localStorage.removeItem("finalGrandTotal");


    // =====================================
    // TOTALS
    // =====================================

    localStorage.removeItem("grandTotal");
    localStorage.removeItem("finalTotal");
    localStorage.removeItem("subtotal");
    localStorage.removeItem("woodTotal");
    localStorage.removeItem("othersTotal");


    // =====================================
    // BILL INFORMATION
    // =====================================

    localStorage.removeItem("savedBillId");
    localStorage.removeItem("savedBillNo");
    localStorage.removeItem("savedCustomerId");

    localStorage.removeItem("billConfirmed");
    localStorage.removeItem("billConfirmedAt");
    localStorage.removeItem("editingBill");
    localStorage.removeItem("billDate");


    // =====================================
    // SESSION
    // =====================================

    sessionStorage.clear();


    console.log(
        "ALL BILL DATA CLEARED"
    );
}


// =======================================
// START NEW BILL
// =======================================

function startNewBill() {

    clearBillData();

}


// =======================================
// DEBUG
// =======================================

function showBillData() {

    console.log(
        "=============================="
    );

    console.log(
        "CURRENT BILL DATA"
    );

    console.log(
        getBillData()
    );

    console.log(
        "=============================="
    );

}
