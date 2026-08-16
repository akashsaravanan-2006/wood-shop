// =========================================
// CONFIRM.JS - COMPLETE CODE
// =========================================


// =========================================
// ELEMENTS
// =========================================

const confirmInput = document.getElementById("confirmInput");
const saveBtn = document.getElementById("saveBtn");
const printBtn = document.getElementById("printBtn");
const cancelBtn = document.getElementById("cancelBtn");
const homeBtn = document.getElementById("homeBtn");
const message = document.getElementById("message");

const billNoText = document.getElementById("billNo");
const customerIdText = document.getElementById("customerId");
const printCustomerId = document.getElementById("printCustomerId");


// =========================================
// INITIAL BUTTON STATE
// =========================================

if (printBtn) {
    printBtn.disabled = true;
}


// =========================================
// GLOBAL VARIABLES
// =========================================

let billData = null;

let billCount =
    Number(localStorage.getItem("billCount")) || 0;

let customerCount =
    Number(localStorage.getItem("customerCount")) || 0;


// =========================================
// BILL NUMBER
// =========================================

let billNo =
    "BILL-" + String(billCount + 1).padStart(4, "0");

if (billNoText) {
    billNoText.textContent = billNo;
}


// =========================================
// CUSTOMER ID
// =========================================

let customerId =
    "CUST-" + String(customerCount + 1).padStart(4, "0");

if (customerIdText) {
    customerIdText.textContent = customerId;
}

if (printCustomerId) {
    printCustomerId.textContent = customerId;
}


// =========================================
// DATE & TIME
// =========================================

function getCurrentDateTime() {

    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}:${seconds}`
    };
}


// =========================================
// SAFE JSON PARSER
// =========================================

function getLocalStorageJSON(key) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {
            return [];
        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            `Error reading ${key}:`,
            error
        );

        return [];
    }
}


// =========================================
// SHOW MESSAGE
// =========================================

function showMessage(text, color) {

    if (!message) {
        return;
    }

    message.style.color = color;
    message.textContent = text;
}


// =========================================
// SAVE BUTTON
// =========================================

if (saveBtn) {

    saveBtn.addEventListener("click", async function () {

        // =====================================
        // CHECK CONFIRMATION
        // =====================================

        if (!confirmInput) {

            showMessage(
                "Confirmation input not found.",
                "red"
            );

            return;
        }


        if (
            confirmInput.value
                .trim()
                .toUpperCase() !== "YES"
        ) {

            showMessage(
                'Please type "YES" to continue.',
                "red"
            );

            return;
        }


        // =====================================
        // PREVENT DOUBLE CLICK
        // =====================================

        if (saveBtn.disabled) {
            return;
        }

        saveBtn.disabled = true;

        showMessage(
            "Saving bill...",
            "#555"
        );


        // =====================================
        // DATE & TIME
        // =====================================

        const dateTime =
            getCurrentDateTime();


        // =====================================
        // GENERATE BILL NUMBER
        // =====================================

        const newBillCount =
            billCount + 1;

        const newCustomerCount =
            customerCount + 1;

        const newBillNo =
            "BILL-" +
            String(newBillCount).padStart(4, "0");

        const newCustomerId =
            "CUST-" +
            String(newCustomerCount).padStart(4, "0");


        // =====================================
        // CREATE BILL OBJECT
        // =====================================

        billData = {

            billNo: newBillNo,

            customerId: newCustomerId,

            billDate: dateTime.date,

            billTime: dateTime.time,


            // CUSTOMER DETAILS
            customerName:
                localStorage.getItem("customerName") || "",

            customerMobile:
                localStorage.getItem("customerMobile") || "",

            customerPlace:
                localStorage.getItem("customerPlace") || "",


            // PAYMENT
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


            // TOTALS
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


            // WOOD DATA
            woodData:
                getLocalStorageJSON("woodData"),


            // OTHER ITEMS
            othersData:
                getLocalStorageJSON("othersData"),


            // CREATED TIME
            createdAt:
                new Date().toISOString()
        };


        // =====================================
        // DEBUG
        // =====================================

        console.log(
            "================================"
        );

        console.log(
            "SENDING BILL TO SERVER"
        );

        console.log(
            "================================"
        );

        console.log(
            "Bill Data:",
            billData
        );


        // =====================================
        // BACKEND API
        // =====================================

        const API_URL =
            "https://wood-shop-backend.vercel.app/api/save-bill";


        try {

            // =================================
            // SEND REQUEST
            // =================================

            const response =
                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(billData)
                });


            // =================================
            // READ RESPONSE
            // =================================

            let data;

            try {

                data =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "Server returned an invalid response."
                );
            }


            // =================================
            // DEBUG RESPONSE
            // =================================

            console.log(
                "Server HTTP Status:",
                response.status
            );

            console.log(
                "Server Response:",
                data
            );


            // =================================
            // CHECK HTTP ERROR
            // =================================

            if (!response.ok) {

                throw new Error(

                    data.message ||

                    data.error ||

                    "HTTP Error: " +
                    response.status
                );
            }


            // =================================
            // CHECK API SUCCESS
            // =================================

            if (data.success === true) {

                // Only update local counters
                // AFTER successful database save

                billCount =
                    newBillCount;

                customerCount =
                    newCustomerCount;


                localStorage.setItem(
                    "billCount",
                    billCount
                );

                localStorage.setItem(
                    "customerCount",
                    customerCount
                );


                // Update screen

                if (billNoText) {

                    billNoText.textContent =
                        newBillNo;
                }

                if (customerIdText) {

                    customerIdText.textContent =
                        newCustomerId;
                }

                if (printCustomerId) {

                    printCustomerId.textContent =
                        newCustomerId;
                }


                // Save status

                localStorage.setItem(
                    "printStatus",
                    "Not Printed"
                );


                // Success message

                showMessage(
                    "Bill Saved Successfully.",
                    "green"
                );


                // Save button disabled

                saveBtn.disabled = true;


                // Enable print

                if (printBtn) {

                    printBtn.disabled = false;
                }


                console.log(
                    "================================"
                );

                console.log(
                    "BILL SAVED SUCCESSFULLY"
                );

                console.log(
                    "Bill No:",
                    newBillNo
                );

                console.log(
                    "Customer ID:",
                    newCustomerId
                );

                console.log(
                    "================================"
                );


            } else {

                // =================================
                // DATABASE/API RETURNED FAILURE
                // =================================

                throw new Error(

                    data.message ||

                    data.error ||

                    "Bill could not be saved."
                );
            }


        } catch (error) {

            // =====================================
            // ERROR
            // =====================================

            console.error(
                "================================"
            );

            console.error(
                "SAVE BILL ERROR"
            );

            console.error(
                error
            );

            console.error(
                "================================"
            );


            showMessage(
                error.message ||
                "Server Connection Error.",
                "red"
            );


            // Allow user to try again

            saveBtn.disabled = false;
        }

    });

}


// =========================================
// PRINT BUTTON
// =========================================

if (printBtn) {

    printBtn.addEventListener(
        "click",
        function () {

            // =================================
            // CHECK BILL SAVED
            // =================================

            if (
                printBtn.disabled ||
                !billData
            ) {

                alert(
                    "Please save the bill first."
                );

                return;
            }


            // =================================
            // PRINT STATUS
            // =================================

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


            // =================================
            // OPEN BILL PAGE
            // =================================

            const printWindow =
                window.open(
                    "../html/bill.html",
                    "_blank"
                );


            if (!printWindow) {

                alert(
                    "Please allow pop-ups to print the bill."
                );

                return;
            }


            // =================================
            // PRINT AFTER PAGE LOAD
            // =================================

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
}


// =========================================
// CLEAR TEMPORARY BILL DATA
// =========================================

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

    localStorage.removeItem("billDate");

    localStorage.removeItem("billTime");

    localStorage.removeItem("printStatus");
}


// =========================================
// CANCEL BUTTON
// =========================================

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


// =========================================
// HOME BUTTON
// =========================================

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            const confirmHome =
                confirm(
                    "Are you sure you want to go Home?"
                );


            if (!confirmHome) {
                return;
            }


            clearBillData();


            window.location.href =
                "index.html";
        }
    );
}


// =========================================
// PAGE LOADED
// =========================================

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
            "Bill No:",
            billNo
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
