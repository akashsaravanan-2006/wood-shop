// =====================================================
// CONFIRM.JS
// =====================================================


// =====================================================
// API
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
// GLOBAL VARIABLES
// =====================================================

let billData = null;
let isSaving = false;


// =====================================================
// INITIAL DISPLAY
// =====================================================

if (billNoText) {
    billNoText.textContent = "BILL-NEW";
}

if (customerIdText) {
    customerIdText.textContent = "CUST-NEW";
}

if (printCustomerId) {
    printCustomerId.textContent = "CUST-NEW";
}


// =====================================================
// DATE
// =====================================================

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

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


// =====================================================
// TIME
// =====================================================

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

    return (
        hours +
        ":" +
        minutes +
        ":" +
        seconds
    );
}


// =====================================================
// SAFE JSON
// =====================================================

function getJSON(key) {

    try {

        return (
            JSON.parse(
                localStorage.getItem(key)
            ) || []
        );

    }

    catch (error) {

        console.error(
            "JSON ERROR:",
            key,
            error
        );

        return [];

    }

}


// =====================================================
// CREATE BILL DATA
// =====================================================

function createBillData() {

    return {

        // Backend generates these
        billNo: null,
        customerId: null,

        // Date / Time
        billDate:
            getCurrentDate(),

        billTime:
            getCurrentTime(),

        // Customer
        customerName:
            localStorage.getItem(
                "customerName"
            ) || "",

        customerMobile:
            localStorage.getItem(
                "customerMobile"
            ) || "",

        customerPlace:
            localStorage.getItem(
                "customerPlace"
            ) || "",

        // Payment
        paymentType:
            localStorage.getItem(
                "paymentType"
            ) || "",

        advanceAmount:
            Number(
                localStorage.getItem(
                    "advanceAmount"
                )
            ) || 0,

        balanceAmount:
            Number(
                localStorage.getItem(
                    "balanceAmount"
                )
            ) || 0,

        // Totals
        totalCFT:
            Number(
                localStorage.getItem(
                    "totalCFT"
                )
            ) || 0,

        woodTotal:
            Number(
                localStorage.getItem(
                    "woodTotal"
                )
            ) || 0,

        labourCharge:
            Number(
                localStorage.getItem(
                    "labourCharge"
                )
            ) || 0,

        otherCharge:
            Number(
                localStorage.getItem(
                    "otherCharge"
                )
            ) || 0,

        othersTotal:
            Number(
                localStorage.getItem(
                    "othersTotal"
                )
            ) || 0,

        grandTotal:
            Number(
                localStorage.getItem(
                    "finalTotal"
                )
            ) ||
            Number(
                localStorage.getItem(
                    "grandTotal"
                )
            ) ||
            0,

        // Wood
        woodData:
            getJSON("woodData"),

        // Other charges
        othersData:
            getJSON("othersData"),

        // Remark
        remark:
            localStorage.getItem(
                "remark"
            ) || ""

    };

}


// =====================================================
// SAVE BILL
// =====================================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        async function () {

            // Prevent double click
            if (isSaving) {
                return;
            }


            // Check YES
            if (
                !confirmInput ||
                confirmInput.value
                    .trim()
                    .toUpperCase() !== "YES"
            ) {

                if (message) {

                    message.style.color =
                        "red";

                    message.textContent =
                        'Please type "YES" to continue.';

                }

                return;

            }


            // Start saving
            isSaving = true;

            saveBtn.disabled = true;


            if (message) {

                message.style.color =
                    "black";

                message.textContent =
                    "Saving bill...";

            }


            // Create bill
            billData =
                createBillData();


            console.log(
                "Sending Bill Data:",
                billData
            );


            try {

                // =================================================
                // SEND TO BACKEND
                // =================================================

                const response =
                    await fetch(
                        API_URL +
                        "/save-bill",
                        {

                            method: "POST",

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


                // =================================================
                // BACKEND RESPONSE
                // =================================================

                const data =
                    await response.json();


                console.log(
                    "Backend Response:",
                    data
                );


                // HTTP ERROR
                if (!response.ok) {

                    throw new Error(

                        data.error ||
                        data.message ||
                        `HTTP ${response.status}`

                    );

                }


                // DATABASE ERROR
                if (!data.success) {

                    throw new Error(

                        data.error ||
                        data.message ||
                        "Bill could not be saved"

                    );

                }


                // =================================================
                // GET GENERATED BILL NUMBER
                // =================================================

                const savedBillNo =
                    data.billNo ||
                    data.bill_no;


                // =================================================
                // GET GENERATED CUSTOMER ID
                // =================================================

                const savedCustomerId =
                    data.customerId ||
                    data.customer_id;


                // =================================================
                // GET DATABASE ID
                // =================================================

                const savedBillId =
                    data.billId ||
                    data.bill_id ||
                    data.id ||
                    data.insertId ||
                    data.insert_id;


                console.log(
                    "================================"
                );

                console.log(
                    "Database ID:",
                    savedBillId
                );

                console.log(
                    "Bill Number:",
                    savedBillNo
                );

                console.log(
                    "Customer ID:",
                    savedCustomerId
                );

                console.log(
                    "================================"
                );


                // =================================================
                // VALIDATION
                // =================================================

                if (!savedBillId) {

                    throw new Error(
                        "Bill saved, but backend did not return bill ID."
                    );

                }


                if (!savedBillNo) {

                    throw new Error(
                        "Bill saved, but backend did not return bill number."
                    );

                }


                if (!savedCustomerId) {

                    throw new Error(
                        "Bill saved, but backend did not return customer ID."
                    );

                }


                // =================================================
                // SAVE EXACT VALUES
                // =================================================

                localStorage.setItem(
                    "savedBillId",
                    String(savedBillId)
                );


                localStorage.setItem(
                    "savedBillNo",
                    savedBillNo
                );


                localStorage.setItem(
                    "savedCustomerId",
                    savedCustomerId
                );


                // Keep compatibility
                localStorage.setItem(
                    "customerId",
                    savedCustomerId
                );


                localStorage.setItem(
                    "billDate",
                    billData.billDate
                );


                localStorage.setItem(
                    "billTime",
                    billData.billTime
                );


                // =================================================
                // UPDATE BILL DATA
                // =================================================

                billData.billNo =
                    savedBillNo;

                billData.customerId =
                    savedCustomerId;

                billData.id =
                    savedBillId;


                // =================================================
                // UPDATE SCREEN
                // =================================================

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


                // =================================================
                // SUCCESS
                // =================================================

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
// PRINT BILL
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


            // Print status
            localStorage.setItem(
                "printStatus",
                "Printed"
            );


            console.log(
                "================================"
            );

            console.log(
                "PRINTING BILL"
            );

            console.log(
                "Database ID:",
                billData.id
            );

            console.log(
                "Bill No:",
                billData.billNo
            );

            console.log(
                "Customer ID:",
                billData.customerId
            );

            console.log(
                "================================"
            );


            // =================================================
            // OPEN BILL PAGE
            // =================================================

            const printWindow =
                window.open(
                    "../html/bill.html",
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
// CLEAR TEMPORARY DATA
// =====================================================

function clearBillData() {

    localStorage.removeItem("woodData");

    localStorage.removeItem("othersData");

    localStorage.removeItem("customerName");

    localStorage.removeItem("customerMobile");

    localStorage.removeItem("customerPlace");

    localStorage.removeItem("paymentType");

    localStorage.removeItem("advanceAmount");

    localStorage.removeItem("balanceAmount");

    localStorage.removeItem("totalCFT");

    localStorage.removeItem("woodTotal");

    localStorage.removeItem("labourCharge");

    localStorage.removeItem("otherCharge");

    localStorage.removeItem("othersTotal");

    localStorage.removeItem("grandTotal");

    localStorage.removeItem("finalTotal");

    localStorage.removeItem("remark");

    localStorage.removeItem("billDate");

    localStorage.removeItem("billTime");

    localStorage.removeItem("printStatus");

    // IMPORTANT:
    // Do NOT remove:
    //
    // savedBillId
    // savedBillNo
    // savedCustomerId
    //
    // These identify the bill that was just saved.
}


// =====================================================
// CANCEL BUTTON
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


            clearBillData();


            window.location.href =
                "../html/bill.html";

        }
    );

}


// =====================================================
// HOME BUTTON
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


            // Clear current temporary bill data
            clearBillData();


            // ALWAYS GO TO HOME
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
            "================================"
        );

        console.log(
            "CONFIRM PAGE LOADED"
        );

        console.log(
            "Waiting for backend Bill No + Customer ID..."
        );

        console.log(
            "================================"
        );

    }
);
