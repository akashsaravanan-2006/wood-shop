// =====================================================
// CONFIRM.JS
// AMMAN SAW MILL
// COMPLETE BILL SAVE VERSION
// =====================================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// =====================================================
// ELEMENTS
// =====================================================

const confirmInput =
    document.getElementById("confirmInput");

const saveBtn =
    document.getElementById("saveBtn");

const printBtn =
    document.getElementById("printBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const homeBtn =
    document.getElementById("homeBtn");

const message =
    document.getElementById("message");

const billNoText =
    document.getElementById("billNo");

const customerIdText =
    document.getElementById("customerId");

const printCustomerId =
    document.getElementById("printCustomerId");


// =====================================================
// INITIAL STATE
// =====================================================

if (printBtn) {
    printBtn.disabled = true;
}


// =====================================================
// GLOBAL
// =====================================================

let billData = null;
let isSaving = false;


// =====================================================
// HELPERS
// =====================================================

function toNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number = parseFloat(
        String(value).replace(/[₹,\s]/g, "")
    );

    return Number.isFinite(number)
        ? number
        : 0;
}


function safeJSON(value, fallback = []) {

    if (
        value === null ||
        value === undefined
    ) {
        return fallback;
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "object") {
        return value;
    }

    try {

        return JSON.parse(value);

    }
    catch (error) {

        return fallback;

    }

}


function getCurrentDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getCurrentTime() {

    const now = new Date();

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}


// =====================================================
// GET CENTRAL BILL DATA
// =====================================================

function getCompleteCentralBill() {

    let data = {};

    // -------------------------------------------------
    // PRIMARY SOURCE
    // -------------------------------------------------

    try {

        if (
            typeof getBillData === "function"
        ) {

            data =
                getBillData() || {};

        }

    }
    catch (error) {

        console.error(
            "getBillData ERROR:",
            error
        );

    }


    // -------------------------------------------------
    // DIRECT LOCAL STORAGE FALLBACK
    // -------------------------------------------------

    if (
        !data ||
        typeof data !== "object" ||
        Object.keys(data).length === 0
    ) {

        try {

            data =
                JSON.parse(
                    localStorage.getItem(
                        "current_bill_data"
                    ) || "{}"
                );

        }
        catch (error) {

            console.error(
                "current_bill_data ERROR:",
                error
            );

            data = {};

        }

    }

    return data || {};
}


// =====================================================
// CREATE COMPLETE BILL
// =====================================================

function createBillData() {

    const central =
        getCompleteCentralBill();


    console.log(
        "===================================="
    );

    console.log(
        "CENTRAL BILL DATA"
    );

    console.log(
        central
    );

    console.log(
        "===================================="
    );


    // =================================================
    // PERSONAL
    // =================================================

    const personal =
        central.personal || {};


    const customerName =
        personal.name ||
        personal.customerName ||
        personal.customer_name ||
        localStorage.getItem("customerName") ||
        "";


    const customerMobile =
        personal.mobile ||
        personal.customerMobile ||
        personal.customer_mobile ||
        localStorage.getItem("customerMobile") ||
        "";


    const customerPlace =
        personal.place ||
        personal.customerPlace ||
        personal.customer_place ||
        localStorage.getItem("customerPlace") ||
        "";


    // =================================================
    // WOOD
    // =================================================

    const wood =
        central.wood || {};


    let woodData =
        Array.isArray(
            wood.calculations
        )
            ? wood.calculations
            : [];


    // Old storage fallback
    if (
        woodData.length === 0
    ) {

        woodData =
            safeJSON(
                localStorage.getItem(
                    "woodData"
                ),
                []
            );

    }


    // =================================================
    // LABOUR
    // =================================================

    const labour =
        central.labour || {};


    const labourCharge =
        toNumber(
            labour.labourCharge ??
            labour.labour_charge ??
            localStorage.getItem(
                "labourCharge"
            )
        );


    const otherCharge =
        toNumber(
            labour.otherCharge ??
            labour.other_charge ??
            localStorage.getItem(
                "otherCharge"
            )
        );


    let otherItems =
        Array.isArray(
            labour.otherItems
        )
            ? labour.otherItems
            : [];


    if (
        otherItems.length === 0
    ) {

        otherItems =
            safeJSON(
                localStorage.getItem(
                    "othersData"
                ),
                []
            );

    }


    // =================================================
    // TOTALS
    // =================================================

    const totals =
        central.totals || {};


    const woodTotal =
        toNumber(
            totals.woodTotal ??
            wood.woodTotal ??
            localStorage.getItem(
                "woodTotal"
            )
        );


    const othersTotal =
        toNumber(
            totals.othersTotal ??
            labour.othersTotal ??
            localStorage.getItem(
                "othersTotal"
            )
        );


    const subtotal =
        toNumber(
            totals.subtotal ??
            localStorage.getItem(
                "subtotal"
            )
        );


    // =================================================
    // DISCOUNT
    // =================================================

    const discount =
        central.discount || {};


    const discountAmount =
        toNumber(
            discount.discountAmount ??
            discount.amount ??
            discount.discount ??
            localStorage.getItem(
                "discountAmount"
            )
        );


    // =================================================
    // GRAND TOTAL
    // =================================================

    let grandTotal =
        toNumber(
            totals.grandTotal ??
            totals.finalTotal ??
            discount.newGrandTotal ??
            localStorage.getItem(
                "finalTotal"
            ) ??
            localStorage.getItem(
                "grandTotal"
            )
        );


    // If grand total is not stored,
    // calculate it safely.

    if (
        grandTotal === 0 &&
        (
            woodTotal > 0 ||
            othersTotal > 0
        )
    ) {

        const calculatedSubtotal =
            subtotal > 0
                ? subtotal
                : woodTotal + othersTotal;

        grandTotal =
            Math.max(
                0,
                calculatedSubtotal -
                discountAmount
            );

    }


    // =================================================
    // ADVANCE
    // =================================================

    const advance =
        central.advance || {};


    const advanceAmount =
        toNumber(
            advance.advanceAmount ??
            advance.amount ??
            localStorage.getItem(
                "advanceAmount"
            )
        );


    const balanceAmount =
        toNumber(
            advance.balanceAmount ??
            advance.balance ??
            localStorage.getItem(
                "balanceAmount"
            )
        );


    // =================================================
    // PAYMENT TYPE
    // =================================================

    const paymentType =
        advance.paymentType ||
        localStorage.getItem(
            "paymentType"
        ) ||
        "";


    // =================================================
    // PAYMENT MODE
    // =================================================

    const paymentMode =
        advance.paymentMode ||
        localStorage.getItem(
            "paymentMode"
        ) ||
        "";


    // =================================================
    // CFT
    // =================================================

    const totalCFT =
        toNumber(
            totals.totalCFT ??
            wood.totalCFT ??
            localStorage.getItem(
                "totalCFT"
            )
        );


    // =================================================
    // CREATE FINAL OBJECT
    // =================================================

    const finalBill = {

        // ---------------------------------------------
        // CUSTOMER
        // ---------------------------------------------

        customerName:
            String(
                customerName
            ).trim(),

        customerMobile:
            String(
                customerMobile
            ).trim(),

        customerPlace:
            String(
                customerPlace
            ).trim(),


        // ---------------------------------------------
        // DATE / TIME
        // ---------------------------------------------

        billDate:
            getCurrentDate(),

        billTime:
            getCurrentTime(),


        // ---------------------------------------------
        // PAYMENT
        // ---------------------------------------------

        paymentType:
            paymentType,

        paymentMode:
            paymentMode,

        advanceAmount:
            advanceAmount,

        balanceAmount:
            balanceAmount,


        // ---------------------------------------------
        // TOTALS
        // ---------------------------------------------

        totalCFT:
            totalCFT,

        woodTotal:
            woodTotal,

        labourCharge:
            labourCharge,

        otherCharge:
            otherCharge,

        othersTotal:
            othersTotal,

        subtotal:
            subtotal > 0
                ? subtotal
                : woodTotal + othersTotal,

        discountAmount:
            discountAmount,

        grandTotal:
            grandTotal,


        // ---------------------------------------------
        // COMPLETE WOOD DATA
        // ---------------------------------------------

        woodData:
            woodData,


        // ---------------------------------------------
        // COMPLETE OTHER CHARGES
        // ---------------------------------------------

        othersData:
            otherItems,


        // ---------------------------------------------
        // COMPLETE CENTRAL DATA
        //
        // This preserves the original page data
        // for the upcoming bill.
        // ---------------------------------------------

        billDetails:
            central,


        // ---------------------------------------------
        // REMARK
        // ---------------------------------------------

        remark:
            central.remark ||
            localStorage.getItem(
                "remark"
            ) ||
            ""

    };


    // =================================================
    // DEBUG
    // =================================================

    console.log(
        "===================================="
    );

    console.log(
        "FINAL BILL TO SEND"
    );

    console.log(
        finalBill
    );

    console.log(
        "CUSTOMER:",
        finalBill.customerName
    );

    console.log(
        "MOBILE:",
        finalBill.customerMobile
    );

    console.log(
        "PLACE:",
        finalBill.customerPlace
    );

    console.log(
        "WOOD:",
        finalBill.woodData
    );

    console.log(
        "OTHER ITEMS:",
        finalBill.othersData
    );

    console.log(
        "LABOUR:",
        finalBill.labourCharge
    );

    console.log(
        "DISCOUNT:",
        finalBill.discountAmount
    );

    console.log(
        "GRAND TOTAL:",
        finalBill.grandTotal
    );

    console.log(
        "ADVANCE:",
        finalBill.advanceAmount
    );

    console.log(
        "BALANCE:",
        finalBill.balanceAmount
    );

    console.log(
        "PAYMENT TYPE:",
        finalBill.paymentType
    );

    console.log(
        "PAYMENT MODE:",
        finalBill.paymentMode
    );

    console.log(
        "===================================="
    );


    return finalBill;
}


// =====================================================
// SAVE BILL
// =====================================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        async function () {

            // -----------------------------------------
            // DOUBLE CLICK PROTECTION
            // -----------------------------------------

            if (isSaving) {
                return;
            }


            // -----------------------------------------
            // YES VALIDATION
            // -----------------------------------------

            if (
                !confirmInput ||
                confirmInput.value
                    .trim()
                    .toUpperCase() !==
                "YES"
            ) {

                if (message) {

                    message.style.color =
                        "red";

                    message.textContent =
                        'Please type "YES" to continue.';

                }

                return;
            }


            // -----------------------------------------
            // START
            // -----------------------------------------

            isSaving = true;

            saveBtn.disabled = true;


            if (message) {

                message.style.color =
                    "black";

                message.textContent =
                    "Saving complete bill...";

            }


            try {

                // -------------------------------------
                // CREATE COMPLETE BILL
                // -------------------------------------

                billData =
                    createBillData();


                // -------------------------------------
                // BASIC VALIDATION
                // -------------------------------------

                if (
                    !billData.customerName
                ) {

                    throw new Error(
                        "Customer name is missing."
                    );

                }


                if (
                    !billData.customerMobile
                ) {

                    throw new Error(
                        "Customer mobile number is missing."
                    );

                }


                if (
                    billData.woodData.length === 0
                ) {

                    console.warn(
                        "No wood data found."
                    );

                }


                console.log(
                    "Sending COMPLETE BILL:",
                    billData
                );


                // -------------------------------------
                // SEND TO BACKEND
                // -------------------------------------

                const response =
                    await fetch(
                        API_URL +
                        "/save-bill",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    billData
                                )

                        }
                    );


                // -------------------------------------
                // READ RESPONSE
                // -------------------------------------

                let data = {};

                try {

                    data =
                        await response.json();

                }
                catch (error) {

                    throw new Error(
                        "Backend returned an invalid response."
                    );

                }


                console.log(
                    "BACKEND RESPONSE:",
                    data
                );


                // -------------------------------------
                // HTTP ERROR
                // -------------------------------------

                if (
                    !response.ok
                ) {

                    throw new Error(
                        data.error ||
                        data.message ||
                        `HTTP ${response.status}`
                    );

                }


                // -------------------------------------
                // SUCCESS CHECK
                // -------------------------------------

                if (
                    !data.success
                ) {

                    throw new Error(
                        data.error ||
                        data.message ||
                        "Bill could not be saved."
                    );

                }


                // -------------------------------------
                // GET IDs
                // -------------------------------------

                const savedBillId =
                    data.billId ??
                    data.bill_id ??
                    data.id ??
                    data.insertId ??
                    data.insert_id;


                const savedBillNo =
                    data.billNo ??
                    data.bill_no;


                const savedCustomerId =
                    data.customerId ??
                    data.customer_id;


                // -------------------------------------
                // VALIDATE
                // -------------------------------------

                if (
                    savedBillId ===
                    undefined ||
                    savedBillId ===
                    null
                ) {

                    throw new Error(
                        "Bill saved, but backend did not return bill ID."
                    );

                }


                if (
                    !savedBillNo
                ) {

                    throw new Error(
                        "Bill saved, but backend did not return bill number."
                    );

                }


                if (
                    !savedCustomerId
                ) {

                    throw new Error(
                        "Bill saved, but backend did not return customer ID."
                    );

                }


                // -------------------------------------
                // SAVE GENERATED VALUES
                // -------------------------------------

                localStorage.setItem(
                    "savedBillId",
                    String(
                        savedBillId
                    )
                );


                localStorage.setItem(
                    "savedBillNo",
                    String(
                        savedBillNo
                    )
                );


                localStorage.setItem(
                    "savedCustomerId",
                    String(
                        savedCustomerId
                    )
                );


                localStorage.setItem(
                    "customerId",
                    String(
                        savedCustomerId
                    )
                );


                localStorage.setItem(
                    "billDate",
                    billData.billDate
                );


                localStorage.setItem(
                    "billTime",
                    billData.billTime
                );


                // -------------------------------------
                // UPDATE BILL OBJECT
                // -------------------------------------

                billData.billNo =
                    savedBillNo;

                billData.customerId =
                    savedCustomerId;

                billData.id =
                    savedBillId;


                // -------------------------------------
                // SAVE COMPLETE RESULT LOCALLY
                // -------------------------------------

                try {

                    const central =
                        getCompleteCentralBill();

                    central.billNo =
                        savedBillNo;

                    central.customerId =
                        savedCustomerId;

                    central.savedBillId =
                        savedBillId;

                    central.saved =
                        true;

                    central.savedBillAt =
                        new Date().toISOString();

                    saveBillData(
                        central
                    );

                }
                catch (error) {

                    console.warn(
                        "Could not update central bill:",
                        error
                    );

                }


                // -------------------------------------
                // UPDATE SCREEN
                // -------------------------------------

                if (billNoText) {

                    billNoText.textContent =
                        savedBillNo;

                }


                if (customerIdText) {

                    customerIdText.textContent =
                        savedCustomerId;

                }


                if (printCustomerId) {

                    printCustomerId.textContent =
                        savedCustomerId;

                }


                // -------------------------------------
                // SUCCESS
                // -------------------------------------

                if (message) {

                    message.style.color =
                        "green";

                    message.textContent =
                        "Bill Saved Successfully.";

                }


                saveBtn.disabled =
                    true;


                if (printBtn) {

                    printBtn.disabled =
                        false;

                }


                isSaving =
                    false;


                console.log(
                    "===================================="
                );

                console.log(
                    "BILL SAVED SUCCESSFULLY"
                );

                console.log(
                    "Bill No:",
                    savedBillNo
                );

                console.log(
                    "Customer:",
                    billData.customerName
                );

                console.log(
                    "Mobile:",
                    billData.customerMobile
                );

                console.log(
                    "Place:",
                    billData.customerPlace
                );

                console.log(
                    "===================================="
                );

            }
            catch (error) {

                console.error(
                    "SAVE BILL ERROR:",
                    error
                );


                if (message) {

                    message.style.color =
                        "red";

                    message.textContent =
                        error.message ||
                        "Server Connection Error.";

                }


                isSaving =
                    false;

                saveBtn.disabled =
                    false;

            }

        }
    );

}


// =====================================================
// PRINT FINAL BILL
// =====================================================

if (printBtn) {

    printBtn.addEventListener(
        "click",
        function () {

            if (
                printBtn.disabled ||
                !billData
            ) {

                alert(
                    "Please save the bill first."
                );

                return;

            }


            localStorage.setItem(
                "printStatus",
                "Printed"
            );


            const printWindow =
                window.open(
                    "../html/cbill.html",
                    "_blank"
                );


            if (!printWindow) {

                alert(
                    "Please allow pop-ups for this website."
                );

                return;

            }


            printWindow.onload =
                function () {

                    setTimeout(
                        function () {

                            printWindow.focus();

                            printWindow.print();

                        },
                        700
                    );

                };

        }
    );

}


// =====================================================
// CANCEL
// =====================================================

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function () {

            const result =
                confirm(
                    "Are you sure you want to cancel?"
                );


            if (!result) {
                return;
            }


            if (
                typeof clearBillData ===
                "function"
            ) {

                clearBillData();

            }
            else {

                localStorage.removeItem(
                    "current_bill_data"
                );

            }


            window.location.href =
                "../html/index.html";

        }
    );

}


// =====================================================
// HOME
// =====================================================

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            const result =
                confirm(
                    "Are you sure you want to go Home?"
                );


            if (!result) {
                return;
            }


            if (
                typeof clearBillData ===
                "function"
            ) {

                clearBillData();

            }
            else {

                localStorage.removeItem(
                    "current_bill_data"
                );

            }


            window.location.href =
                "../html/index.html";

        }
    );

}


// =====================================================
// PAGE LOAD
// =====================================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "===================================="
        );

        console.log(
            "CONFIRM PAGE LOADED"
        );

        const central =
            getCompleteCentralBill();

        console.log(
            "CURRENT BILL DATA:",
            central
        );

        console.log(
            "PERSONAL DATA:",
            central.personal
        );

        console.log(
            "WOOD DATA:",
            central.wood
        );

        console.log(
            "LABOUR DATA:",
            central.labour
        );

        console.log(
            "DISCOUNT DATA:",
            central.discount
        );

        console.log(
            "ADVANCE DATA:",
            central.advance
        );

        console.log(
            "===================================="
        );

    }
);
