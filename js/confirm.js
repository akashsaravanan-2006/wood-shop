// =====================================================
// CONFIRM.JS
// =====================================================

// =====================================================
// ELEMENTS
// =====================================================

const confirmInput = document.getElementById("confirmInput");
const saveBtn = document.getElementById("saveBtn");
const printBtn = document.getElementById("printBtn");
const cancelBtn = document.getElementById("cancelBtn");
const homeBtn = document.getElementById("homeBtn");
const message = document.getElementById("message");

const billNoText = document.getElementById("billNo");
const customerIdText = document.getElementById("customerId");
const printCustomerId = document.getElementById("printCustomerId");


// =====================================================
// INITIAL STATE
// =====================================================

if (printBtn) {
    printBtn.disabled = true;
}


// =====================================================
// GLOBAL VARIABLE
// =====================================================

let billData = null;
let isSaving = false;


// =====================================================
// CUSTOMER ID
// =====================================================

let customerCount =
    Number(localStorage.getItem("customerCount")) || 0;

let customerId =
    "CUST-" +
    String(customerCount + 1).padStart(4, "0");


if (customerIdText) {
    customerIdText.textContent = customerId;
}

if (printCustomerId) {
    printCustomerId.textContent = customerId;
}


// =====================================================
// BILL NUMBER
// IMPORTANT:
// Backend generates the real bill number.
// =====================================================

if (billNoText) {
    billNoText.textContent = "BILL-NEW";
}


// =====================================================
// DATE & TIME
// =====================================================

function getCurrentDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getCurrentTime() {

    const now = new Date();

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}


// =====================================================
// SAFE JSON
// =====================================================

function getJSON(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch (error) {

        console.error(
            "JSON ERROR:",
            key,
            error
        );

        return [];

    }

}


// =====================================================
// GET BILL DATA
// =====================================================

function createBillData() {

    return {

        // Backend will generate actual bill number
        billNo: null,

        customerId:
            customerId,

        billDate:
            getCurrentDate(),

        billTime:
            getCurrentTime(),

        customerName:
            localStorage.getItem("customerName") || "",

        customerMobile:
            localStorage.getItem("customerMobile") || "",

        customerPlace:
            localStorage.getItem("customerPlace") || "",

        paymentType:
            localStorage.getItem("paymentType") || "",

        advanceAmount:
            Number(
                localStorage.getItem("advanceAmount")
            ) || 0,

        balanceAmount:
            Number(
                localStorage.getItem("balanceAmount")
            ) || 0,

        totalCFT:
            Number(
                localStorage.getItem("totalCFT")
            ) || 0,

        woodTotal:
            Number(
                localStorage.getItem("woodTotal")
            ) || 0,

        labourCharge:
            Number(
                localStorage.getItem("labourCharge")
            ) || 0,

        otherCharge:
            Number(
                localStorage.getItem("otherCharge")
            ) || 0,

        othersTotal:
            Number(
                localStorage.getItem("othersTotal")
            ) || 0,

        grandTotal:
            Number(
                localStorage.getItem("grandTotal")
            ) || 0,

        woodData:
            getJSON("woodData"),

        othersData:
            getJSON("othersData"),

        remark:
            localStorage.getItem("remark") || ""

    };

}


// =====================================================
// SAVE BILL
// =====================================================

saveBtn.addEventListener(
    "click",
    async function () {

        // ---------------------------------------------
        // Prevent double click
        // ---------------------------------------------

        if (isSaving) {
            return;
        }


        // ---------------------------------------------
        // Check YES
        // ---------------------------------------------

        if (
            confirmInput.value
                .trim()
                .toUpperCase() !== "YES"
        ) {

            message.style.color = "red";

            message.textContent =
                'Please type "YES" to continue.';

            return;

        }


        // ---------------------------------------------
        // Start saving
        // ---------------------------------------------

        isSaving = true;

        saveBtn.disabled = true;

        message.style.color = "black";

        message.textContent =
            "Saving bill...";


        // ---------------------------------------------
        // Create bill data
        // ---------------------------------------------

        billData =
            createBillData();


        console.log(
            "Sending Bill Data:",
            billData
        );


        // =================================================
        // IMPORTANT:
        // USE /api/save-bill
        // =================================================

        try {

            const response =
                await fetch(
                    "https://wood-shop-backend.vercel.app/api/save-bill",
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


            // ---------------------------------------------
            // Get response
            // ---------------------------------------------

            const data =
                await response.json();


            console.log(
                "Backend Response:",
                data
            );


            // ---------------------------------------------
            // HTTP ERROR
            // ---------------------------------------------

            if (!response.ok) {

                throw new Error(

                    data.error ||
                    data.message ||
                    `HTTP ${response.status}`

                );

            }


            // ---------------------------------------------
            // DATABASE ERROR
            // ---------------------------------------------

            if (!data.success) {

                throw new Error(

                    data.error ||
                    data.message ||
                    "Bill could not be saved"

                );

            }


            // =================================================
            // SUCCESS
            // =================================================

            const savedBillNo =
                data.billNo;


            const savedCustomerId =
                data.customerId;


            console.log(
                "Saved Bill Number:",
                savedBillNo
            );


            // ---------------------------------------------
            // Store returned values
            // ---------------------------------------------

            localStorage.setItem(
                "savedBillNo",
                savedBillNo
            );


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


            // ---------------------------------------------
            // Update screen
            // ---------------------------------------------

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


            // ---------------------------------------------
            // SUCCESS MESSAGE
            // ---------------------------------------------

            message.style.color =
                "green";

            message.textContent =
                "Bill Saved Successfully.";


            // ---------------------------------------------
            // Buttons
            // ---------------------------------------------

            saveBtn.disabled = true;

            if (printBtn) {
                printBtn.disabled = false;
            }


            // ---------------------------------------------
            // Update billData
            // ---------------------------------------------

            billData.billNo =
                savedBillNo;

            billData.customerId =
                savedCustomerId;


            // ---------------------------------------------
            // Reset saving
            // ---------------------------------------------

            isSaving = false;


        } catch (error) {

            console.error(
                "SAVE BILL ERROR:",
                error
            );


            message.style.color =
                "red";


            message.textContent =
                error.message ||
                "Server Connection Error.";


            // Allow retry
            isSaving = false;

            saveBtn.disabled = false;

        }

    }
);


// =====================================================
// PRINT BILL
// =====================================================

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


        console.log(
            "================================"
        );

        console.log(
            "PRINTING BILL..."
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
                    500
                );

            };

    }
);


// =====================================================
// CLEAR TEMPORARY DATA
// =====================================================

function clearBillData() {

    localStorage.removeItem(
        "woodData"
    );

    localStorage.removeItem(
        "othersData"
    );

    localStorage.removeItem(
        "customerName"
    );

    localStorage.removeItem(
        "customerMobile"
    );

    localStorage.removeItem(
        "customerPlace"
    );

    localStorage.removeItem(
        "paymentType"
    );

    localStorage.removeItem(
        "advanceAmount"
    );

    localStorage.removeItem(
        "balanceAmount"
    );

    localStorage.removeItem(
        "totalCFT"
    );

    localStorage.removeItem(
        "woodTotal"
    );

    localStorage.removeItem(
        "labourCharge"
    );

    localStorage.removeItem(
        "otherCharge"
    );

    localStorage.removeItem(
        "othersTotal"
    );

    localStorage.removeItem(
        "grandTotal"
    );

    localStorage.removeItem(
        "finalTotal"
    );

    localStorage.removeItem(
        "remark"
    );

    localStorage.removeItem(
        "billDate"
    );

    localStorage.removeItem(
        "billTime"
    );

    localStorage.removeItem(
        "printStatus"
    );

}


// =====================================================
// CANCEL
// =====================================================

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


// =====================================================
// HOME
// =====================================================

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


        clearBillData();


        window.location.href =
            "index.html";

    }
);


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
            "Customer ID:",
            customerId
        );

        console.log(
            "================================"
        );

    }
);
