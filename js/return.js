"use strict";

/* =========================================================
   AMMAN SAW MILL
   RETURN BILL.JS
   =========================================================

   FLOW:

   History
      ↓
   Return Page
      ↓
   Load Bill
      ↓
   Enter Return Amount
      ↓
   Save Return
      ↓
   Database UPDATE
      ↓
   History shows RETURN amount
   ========================================================= */


/* =========================================================
   BACKEND
========================================================= */

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


console.log("======================================");
console.log("AMMAN SAW MILL - RETURN.JS");
console.log("RETURN PAGE LOADED");
console.log("======================================");


/* =========================================================
   ELEMENTS
========================================================= */

const billNo =
    document.getElementById("billNo");

const customerId =
    document.getElementById("customerId");

const customerName =
    document.getElementById("customerName");

const mobile =
    document.getElementById("mobile");

const place =
    document.getElementById("place");

const billDate =
    document.getElementById("billDate");

const grandTotal =
    document.getElementById("grandTotal");

const advanceAmount =
    document.getElementById("advanceAmount");

const balanceAmount =
    document.getElementById("balanceAmount");

const previousReturn =
    document.getElementById("previousReturn");

const returnAmount =
    document.getElementById("returnAmount");

const saveReturnBtn =
    document.getElementById("saveReturnBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const backBtn =
    document.getElementById("backBtn");

const message =
    document.getElementById("message");


/* =========================================================
   GET BILL ID FROM URL
========================================================= */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const billId =
    urlParams.get("id");


console.log(
    "Bill ID:",
    billId
);


/* =========================================================
   NUMBER HELPER
========================================================= */

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number =
        Number(
            String(value)
                .replace(/[₹,\s]/g, "")
        );

    return Number.isFinite(number)
        ? number
        : 0;
}


/* =========================================================
   MONEY FORMAT
========================================================= */

function formatMoney(value) {

    return numberValue(value)
        .toFixed(2);

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }

    return date.toLocaleDateString(
        "en-IN"
    );

}


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(
    text,
    type = "success"
) {

    if (!message) {
        return;
    }

    message.textContent =
        text;

    message.className =
        `message ${type}`;

}


/* =========================================================
   CLEAR MESSAGE
========================================================= */

function clearMessage() {

    if (!message) {
        return;
    }

    message.textContent = "";

    message.className =
        "message";

}


/* =========================================================
   CHECK BILL ID
========================================================= */

function checkBillId() {

    if (!billId) {

        showMessage(
            "Bill ID is missing.",
            "error"
        );

        if (saveReturnBtn) {
            saveReturnBtn.disabled = true;
        }

        return false;
    }

    return true;
}


/* =========================================================
   LOAD SINGLE BILL
========================================================= */

async function loadBill() {

    if (!checkBillId()) {
        return;
    }

    clearMessage();

    try {

        console.log(
            "Loading bill:",
            billId
        );


        const response =
            await fetch(
                `${API_URL}/bill/${encodeURIComponent(billId)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                `HTTP ${response.status}: ${errorText}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Bill API response:",
            result
        );


        /*
           Backend normally returns:

           {
               success: true,
               bill: {...}
           }

           Some older versions return
           the bill directly.

           This handles both.
        */

        const bill =
            result?.bill ??
            result?.data ??
            result;


        if (!bill) {

            throw new Error(
                "Bill data not found."
            );

        }


        displayBill(bill);


    }
    catch (error) {

        console.error(
            "LOAD BILL ERROR:",
            error
        );


        showMessage(
            "Unable to load bill. " +
            error.message,
            "error"
        );

    }

}


/* =========================================================
   DISPLAY BILL
========================================================= */

function displayBill(bill) {

    const billNumber =
        bill?.bill_no ??
        bill?.billNo ??
        "-";


    const customerID =
        bill?.customer_id ??
        bill?.customerId ??
        "-";


    const name =
        bill?.customer_name ??
        bill?.customerName ??
        bill?.customer ??
        "-";


    const customerMobile =
        bill?.customer_mobile ??
        bill?.customerMobile ??
        bill?.mobile ??
        "-";


    const customerPlace =
        bill?.customer_place ??
        bill?.customerPlace ??
        bill?.place ??
        "-";


    const date =
        bill?.bill_date ??
        bill?.billDate ??
        "";


    const total =
        numberValue(
            bill?.grand_total ??
            bill?.grandTotal
        );


    const advance =
        numberValue(
            bill?.advance_amount ??
            bill?.advanceAmount
        );


    const balance =
        numberValue(
            bill?.balance_amount ??
            bill?.balanceAmount
        );


    const returned =
        numberValue(
            bill?.return_amount ??
            bill?.returnAmount
        );


    /* =========================================
       SET VALUES
    ========================================= */

    if (billNo) {

        billNo.textContent =
            billNumber;

    }


    if (customerId) {

        customerId.textContent =
            customerID;

    }


    if (customerName) {

        customerName.textContent =
            name;

    }


    if (mobile) {

        mobile.textContent =
            customerMobile;

    }


    if (place) {

        place.textContent =
            customerPlace;

    }


    if (billDate) {

        billDate.textContent =
            formatDate(date);

    }


    if (grandTotal) {

        grandTotal.textContent =
            `₹ ${formatMoney(total)}`;

    }


    if (advanceAmount) {

        advanceAmount.textContent =
            `₹ ${formatMoney(advance)}`;

    }


    if (balanceAmount) {

        balanceAmount.textContent =
            `₹ ${formatMoney(balance)}`;

    }


    if (previousReturn) {

        previousReturn.textContent =
            `₹ ${formatMoney(returned)}`;

    }


    /*
       Save the current grand total
       on the input.

       This is useful for validation.
    */

    if (returnAmount) {

        returnAmount.max =
            total;

        returnAmount.dataset.grandTotal =
            total;

        returnAmount.dataset.previousReturn =
            returned;

    }


    console.log(
        "Bill displayed:",
        billNumber
    );

}


/* =========================================================
   SAVE RETURN
========================================================= */

async function saveReturn() {

    clearMessage();


    if (!billId) {

        showMessage(
            "Bill ID is missing.",
            "error"
        );

        return;
    }


    if (!returnAmount) {

        showMessage(
            "Return amount input not found.",
            "error"
        );

        return;
    }


    const amount =
        Number(
            returnAmount.value
        );


    /* =========================================
       VALIDATE NUMBER
    ========================================= */

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showMessage(
            "Please enter a valid return amount.",
            "error"
        );

        return;
    }


    /* =========================================
       GET GRAND TOTAL
    ========================================= */

    const total =
        Number(
            returnAmount.dataset.grandTotal
        ) || 0;


    /* =========================================
       DON'T RETURN MORE THAN TOTAL
    ========================================= */

    if (amount > total) {

        showMessage(
            `Return amount cannot be greater than ₹ ${formatMoney(total)}.`,
            "error"
        );

        return;
    }


    /* =========================================
       CONFIRM
    ========================================= */

    const confirmed =
        confirm(
            "Confirm Return\n\n" +
            `Bill No: ${billNo?.textContent || "-"}` +
            "\n" +
            `Return Amount: ₹ ${formatMoney(amount)}` +
            "\n\n" +
            "Do you want to save this return?"
        );


    if (!confirmed) {
        return;
    }


    /* =========================================
       DISABLE BUTTON
    ========================================= */

    if (saveReturnBtn) {

        saveReturnBtn.disabled =
            true;

        saveReturnBtn.textContent =
            "Saving...";

    }


    try {

        console.log(
            "Saving return:",
            {
                id: billId,
                returnAmount: amount
            }
        );


        /*
           IMPORTANT:

           Your backend already has:

           PUT /return-bill

           and expects:

           {
               id: billId,
               returnAmount: amount
           }

           We use that existing API.
        */

        const response =
            await fetch(
                `${API_URL}/return-bill`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            id: billId,
                            returnAmount: amount
                        })
                }
            );


        const text =
            await response.text();


        let result = {};

        try {

            result =
                text
                    ? JSON.parse(text)
                    : {};

        }
        catch {

            result = {
                message: text
            };

        }


        console.log(
            "RETURN API RESPONSE:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result?.message ||
                `HTTP ${response.status}`
            );

        }


        if (
            result?.success === false
        ) {

            throw new Error(
                result?.message ||
                "Return could not be saved."
            );

        }


        /* =====================================
           SUCCESS
        ===================================== */

        showMessage(
            "Return saved successfully.",
            "success"
        );


        alert(
            "Return saved successfully."
        );


        /*
           Go back to History after saving.

           History will load the latest
           database values, including:

           return_amount
           status
           grand_total
        */

        window.location.href =
            "history.html";


    }
    catch (error) {

        console.error(
            "RETURN SAVE ERROR:",
            error
        );


        showMessage(
            "Return update failed.\n" +
            error.message,
            "error"
        );


        alert(
            "Return could not be saved.\n\n" +
            error.message
        );


        if (saveReturnBtn) {

            saveReturnBtn.disabled =
                false;

            saveReturnBtn.textContent =
                "↩ Save Return";

        }

    }

}


/* =========================================================
   SAVE BUTTON
========================================================= */

if (saveReturnBtn) {

    saveReturnBtn.addEventListener(
        "click",
        saveReturn
    );

}


/* =========================================================
   ENTER KEY
========================================================= */

if (returnAmount) {

    returnAmount.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                saveReturn();

            }

        }
    );

}


/* =========================================================
   CANCEL BUTTON
========================================================= */

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "history.html";

        }
    );

}


/* =========================================================
   BACK BUTTON
========================================================= */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "history.html";

        }
    );

}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "Return page initialized."
        );

        loadBill();

    }
);
