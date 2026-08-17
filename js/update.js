// ======================================
// UPDATE.JS
// UPDATE PENDING BILL PAYMENT
// ======================================


// ======================================
// BACKEND API URL
// ======================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// ======================================
// GET BILL ID FROM URL
// ======================================

const params =
    new URLSearchParams(
        window.location.search
    );

const billId =
    params.get("id");


// ======================================
// CHECK BILL ID
// ======================================

if (!billId) {

    alert("Bill ID not found.");

    window.location.href =
        "pendingBills.html";

}


// ======================================
// INPUT ELEMENTS
// ======================================

const billNo =
    document.getElementById("billNo");

const customerId =
    document.getElementById("customerId");

const customerName =
    document.getElementById("customerName");

const customerMobile =
    document.getElementById("customerMobile");

const customerPlace =
    document.getElementById("customerPlace");

const billDate =
    document.getElementById("billDate");

const grandTotal =
    document.getElementById("grandTotal");

const advanceAmount =
    document.getElementById("advanceAmount");

const balanceAmount =
    document.getElementById("balanceAmount");

const paidAmount =
    document.getElementById("paidAmount");

const newAdvance =
    document.getElementById("newAdvance");

const newBalance =
    document.getElementById("newBalance");

const updateBtn =
    document.getElementById("updateBtn");

const backBtn =
    document.getElementById("backBtn");


// ======================================
// LOAD BILL DETAILS
// ======================================

async function loadBill() {

    try {

        console.log(
            "================================="
        );

        console.log(
            "Loading Bill"
        );

        console.log(
            "Bill ID:",
            billId
        );

        console.log(
            "API:",
            `${API_URL}/bill/${billId}`
        );

        console.log(
            "================================="
        );


        // ==================================
        // LOADING MESSAGE
        // ==================================

        if (billNo) {

            billNo.value =
                "Loading...";

        }


        // ==================================
        // GET BILL
        // ==================================

        const response =
            await fetch(
                `${API_URL}/bill/${encodeURIComponent(billId)}`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        console.log(
            "Response status:",
            response.status
        );


        // ==================================
        // HTTP ERROR
        // ==================================

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Server response:",
                errorText
            );

            throw new Error(
                `Server returned HTTP ${response.status}`
            );

        }


        // ==================================
        // JSON RESPONSE
        // ==================================

        const data =
            await response.json();


        console.log(
            "Bill API response:",
            data
        );


        // ==================================
        // SUPPORT DIFFERENT RESPONSE TYPES
        // ==================================

        let bill = null;


        // Response:
        // {
        //   success: true,
        //   bill: {...}
        // }

        if (
            data &&
            data.success &&
            data.bill
        ) {

            bill =
                data.bill;

        }


        // Response:
        // {
        //   success: true,
        //   result: {...}
        // }

        else if (
            data &&
            data.success &&
            data.result
        ) {

            bill =
                Array.isArray(data.result)
                    ? data.result[0]
                    : data.result;

        }


        // Response directly:
        // {
        //   id: 30001,
        //   bill_no: "BILL-0001"
        // }

        else if (
            data &&
            data.bill_no
        ) {

            bill =
                data;

        }


        // ==================================
        // BILL NOT FOUND
        // ==================================

        if (!bill) {

            throw new Error(
                data?.message ||
                "Bill details not found"
            );

        }


        console.log(
            "Bill loaded:",
            bill
        );


        // ==================================
        // DISPLAY BILL DETAILS
        // ==================================

        if (billNo) {

            billNo.value =
                bill.bill_no || "";

        }


        if (customerId) {

            customerId.value =
                bill.customer_id || "";

        }


        if (customerName) {

            customerName.value =
                bill.customer_name || "";

        }


        if (customerMobile) {

            customerMobile.value =
                bill.customer_mobile || "";

        }


        if (customerPlace) {

            customerPlace.value =
                bill.customer_place || "";

        }


        // ==================================
        // BILL DATE
        // ==================================

        if (billDate) {

            let dateValue =
                bill.bill_date || "";

            // Convert date to YYYY-MM-DD
            // for <input type="date">

            if (
                typeof dateValue === "string"
            ) {

                dateValue =
                    dateValue.substring(
                        0,
                        10
                    );

            }

            billDate.value =
                dateValue;

        }


        // ==================================
        // TOTAL
        // ==================================

        const total =
            Number(
                bill.grand_total
            ) || 0;


        // ==================================
        // ADVANCE
        // ==================================

        const advance =
            Number(
                bill.advance_amount
            ) || 0;


        // ==================================
        // BALANCE
        // ==================================

        let balance =
            Number(
                bill.balance_amount
            );


        // If database balance is missing,
        // calculate it.

        if (
            isNaN(balance)
        ) {

            balance =
                Math.max(
                    total - advance,
                    0
                );

        }


        // ==================================
        // DISPLAY VALUES
        // ==================================

        if (grandTotal) {

            grandTotal.value =
                total.toFixed(2);

        }


        if (advanceAmount) {

            advanceAmount.value =
                advance.toFixed(2);

        }


        if (balanceAmount) {

            balanceAmount.value =
                balance.toFixed(2);

        }


        // ==================================
        // NEW VALUES
        // ==================================

        if (newAdvance) {

            newAdvance.value =
                advance.toFixed(2);

        }


        if (newBalance) {

            newBalance.value =
                balance.toFixed(2);

        }


        // ==================================
        // CLEAR PAYMENT INPUT
        // ==================================

        if (paidAmount) {

            paidAmount.value = "";

        }


        console.log(
            "Bill loaded successfully."
        );

    }


    catch (error) {

        console.error(
            "LOAD BILL ERROR:",
            error
        );


        if (billNo) {

            billNo.value = "";

        }


        alert(
            "Unable to load bill details."
        );

    }

}


// ======================================
// LIVE PAYMENT CALCULATION
// ======================================

if (paidAmount) {

    paidAmount.addEventListener(
        "input",
        function () {


            const advance =
                Number(
                    advanceAmount?.value
                ) || 0;


            const balance =
                Number(
                    balanceAmount?.value
                ) || 0;


            let paid =
                Number(
                    paidAmount.value
                ) || 0;


            // ==================================
            // NEGATIVE PAYMENT NOT ALLOWED
            // ==================================

            if (paid < 0) {

                paid = 0;

                paidAmount.value = "0";

            }


            // ==================================
            // DO NOT ALLOW OVERPAYMENT
            // ==================================

            if (paid > balance) {

                paid =
                    balance;

                paidAmount.value =
                    balance.toFixed(2);

            }


            // ==================================
            // NEW ADVANCE
            // ==================================

            const nextAdvance =
                advance + paid;


            // ==================================
            // NEW BALANCE
            // ==================================

            const nextBalance =
                Math.max(
                    balance - paid,
                    0
                );


            // ==================================
            // DISPLAY
            // ==================================

            if (newAdvance) {

                newAdvance.value =
                    nextAdvance.toFixed(2);

            }


            if (newBalance) {

                newBalance.value =
                    nextBalance.toFixed(2);

            }

        }
    );

}


// ======================================
// UPDATE PAYMENT
// ======================================

if (updateBtn) {

    updateBtn.addEventListener(
        "click",
        async function () {


            // ==================================
            // GET PAYMENT
            // ==================================

            const paid =
                Number(
                    paidAmount?.value
                ) || 0;


            // ==================================
            // VALIDATE PAYMENT
            // ==================================

            if (paid <= 0) {

                alert(
                    "Enter a valid paid amount."
                );

                return;

            }


            // ==================================
            // CURRENT BALANCE
            // ==================================

            const currentBalance =
                Number(
                    balanceAmount?.value
                ) || 0;


            // ==================================
            // PREVENT OVERPAYMENT
            // ==================================

            if (paid > currentBalance) {

                alert(
                    "Paid amount cannot be greater than pending amount."
                );

                return;

            }


            // ==================================
            // CONFIRM PAYMENT
            // ==================================

            const confirmPayment =
                confirm(
                    `Confirm payment of ₹${paid.toFixed(2)}?`
                );


            if (!confirmPayment) {

                return;

            }


            try {


                // ==================================
                // DISABLE BUTTON
                // ==================================

                updateBtn.disabled =
                    true;

                updateBtn.textContent =
                    "Updating...";


                console.log(
                    "================================="
                );

                console.log(
                    "Updating Payment"
                );

                console.log(
                    "Bill ID:",
                    billId
                );

                console.log(
                    "Paid Amount:",
                    paid
                );

                console.log(
                    "API:",
                    `${API_URL}/update-pending`
                );

                console.log(
                    "================================="
                );


                // ==================================
                // UPDATE DATABASE
                // ==================================

                const response =
                    await fetch(
                        `${API_URL}/update-pending`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                id:
                                    billId,

                                paidAmount:
                                    paid

                            })
                        }
                    );


                console.log(
                    "Update response status:",
                    response.status
                );


                // ==================================
                // HTTP ERROR
                // ==================================

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Update server response:",
                        errorText
                    );

                    throw new Error(
                        `Server returned HTTP ${response.status}`
                    );

                }


                // ==================================
                // READ RESPONSE
                // ==================================

                const result =
                    await response.json();


                console.log(
                    "Update API response:",
                    result
                );


                // ==================================
                // SUCCESS
                // ==================================

                if (
                    result.success
                ) {


                    alert(
                        "Payment Updated Successfully"
                    );


                    // ==================================
                    // GO TO PENDING BILLS
                    // ==================================

                    window.location.href =
                        "pendingBills.html";


                }


                // ==================================
                // FAILED
                // ==================================

                else {

                    alert(
                        result.message ||
                        "Update Failed"
                    );


                    updateBtn.disabled =
                        false;

                    updateBtn.textContent =
                        "Update";

                }

            }


            catch (error) {

                console.error(
                    "UPDATE PAYMENT ERROR:",
                    error
                );


                alert(
                    "Server Error while updating payment."
                );


                updateBtn.disabled =
                    false;

                updateBtn.textContent =
                    "Update";

            }

        }
    );

}


// ======================================
// BACK BUTTON
// ======================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "pendingBills.html";

        }
    );

}


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBill();

    }
);
