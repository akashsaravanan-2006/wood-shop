// ======================================
// UPDATE PENDING BILL
// ======================================

// IMPORTANT:
// Use the deployed backend, NOT localhost.
const API_URL = "https://wood-shop-backend.vercel.app/api";


// ======================================
// GET BILL ID FROM URL
// ======================================

const params = new URLSearchParams(window.location.search);

const billId = params.get("id");


// ======================================
// CHECK BILL ID
// ======================================

if (!billId) {

    alert("Bill ID is missing.");

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

    if (!billId) {
        return;
    }

    try {

        console.log(
            "Loading bill:",
            billId
        );

        const response = await fetch(
            `${API_URL}/bill/${encodeURIComponent(billId)}`
        );

        console.log(
            "Response status:",
            response.status
        );


        // ==================================
        // CHECK HTTP RESPONSE
        // ==================================

        if (!response.ok) {

            throw new Error(
                "HTTP Error " + response.status
            );

        }


        // ==================================
        // READ JSON
        // ==================================

        const result =
            await response.json();

        console.log(
            "API Response:",
            result
        );


        // ==================================
        // CHECK API SUCCESS
        // ==================================

        if (!result.success) {

            throw new Error(
                result.message ||
                "Unable to load bill"
            );

        }


        // ==================================
        // IMPORTANT:
        // Backend returns { success, bill }
        // ==================================

        const bill = result.bill;


        if (!bill) {

            throw new Error(
                "Bill data not found"
            );

        }


        // ==================================
        // DISPLAY BILL DATA
        // ==================================

        billNo.value =
            bill.bill_no || "";

        customerId.value =
            bill.customer_id || "";

        customerName.value =
            bill.customer_name || "";

        customerMobile.value =
            bill.customer_mobile || "";

        customerPlace.value =
            bill.customer_place || "";


        // ==================================
        // BILL DATE
        // ==================================

        if (bill.bill_date) {

            billDate.value =
                String(bill.bill_date)
                .substring(0, 10);

        }
        else {

            billDate.value = "";

        }


        // ==================================
        // TOTAL
        // ==================================

        const total =
            Number(bill.grand_total) || 0;

        grandTotal.value =
            total.toFixed(2);


        // ==================================
        // OLD ADVANCE
        // ==================================

        const oldAdvance =
            Number(bill.advance_amount) || 0;

        advanceAmount.value =
            oldAdvance.toFixed(2);


        // ==================================
        // OLD BALANCE
        // ==================================

        const oldBalance =
            Number(bill.balance_amount) || 0;

        balanceAmount.value =
            oldBalance.toFixed(2);


        // ==================================
        // NEW VALUES
        // ==================================

        newAdvance.value =
            oldAdvance.toFixed(2);

        newBalance.value =
            oldBalance.toFixed(2);


        // ==================================
        // CLEAR PAYMENT INPUT
        // ==================================

        paidAmount.value = "";


        console.log(
            "Bill loaded successfully:",
            bill
        );

    }

    catch (error) {

        console.error(
            "LOAD BILL ERROR:",
            error
        );

        alert(
            "Unable to load bill details.\n\n" +
            error.message
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
                    advanceAmount.value
                ) || 0;


            const balance =
                Number(
                    balanceAmount.value
                ) || 0;


            const paid =
                Number(
                    paidAmount.value
                ) || 0;


            // ==================================
            // VALIDATE PAYMENT
            // ==================================

            if (paid < 0) {

                paidAmount.value = 0;

            }


            // ==================================
            // NEW ADVANCE
            // ==================================

            let nextAdvance =
                advance + paid;


            // ==================================
            // NEW BALANCE
            // ==================================

            let nextBalance =
                balance - paid;


            // ==================================
            // DON'T ALLOW NEGATIVE BALANCE
            // ==================================

            if (nextBalance < 0) {

                nextBalance = 0;

            }


            // ==================================
            // DISPLAY
            // ==================================

            newAdvance.value =
                nextAdvance.toFixed(2);

            newBalance.value =
                nextBalance.toFixed(2);

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
            // GET PAID AMOUNT
            // ==================================

            const paid =
                Number(
                    paidAmount.value
                ) || 0;


            // ==================================
            // VALIDATE
            // ==================================

            if (paid <= 0) {

                alert(
                    "Enter a valid paid amount."
                );

                return;

            }


            // ==================================
            // GET CURRENT BALANCE
            // ==================================

            const currentBalance =
                Number(
                    balanceAmount.value
                ) || 0;


            // ==================================
            // DON'T ALLOW OVER PAYMENT
            // ==================================

            if (paid > currentBalance) {

                alert(
                    "Paid amount cannot be greater than pending amount."
                );

                return;

            }


            // ==================================
            // DISABLE BUTTON
            // ==================================

            updateBtn.disabled = true;

            updateBtn.textContent =
                "Updating...";


            try {

                console.log(
                    "Updating bill:",
                    billId
                );

                console.log(
                    "Paid amount:",
                    paid
                );


                // ==================================
                // SEND UPDATE TO BACKEND
                // ==================================

                const response = await fetch(
                    `${API_URL}/update-pending`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            id: Number(billId),

                            paidAmount: paid

                        })

                    }
                );


                // ==================================
                // CHECK HTTP RESPONSE
                // ==================================

                if (!response.ok) {

                    throw new Error(
                        "HTTP Error " +
                        response.status
                    );

                }


                // ==================================
                // READ RESULT
                // ==================================

                const result =
                    await response.json();


                console.log(
                    "Update response:",
                    result
                );


                // ==================================
                // CHECK SUCCESS
                // ==================================

                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Payment update failed"
                    );

                }


                // ==================================
                // SUCCESS
                // ==================================

                alert(
                    "Payment Updated Successfully"
                );


                // ==================================
                // GO BACK TO PENDING BILLS
                // ==================================

                window.location.href =
                    "pendingBills.html";

            }

            catch (error) {

                console.error(
                    "UPDATE ERROR:",
                    error
                );


                alert(
                    "Payment update failed.\n\n" +
                    error.message
                );


                // ==================================
                // ENABLE BUTTON AGAIN
                // ==================================

                updateBtn.disabled = false;

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
// LOAD BILL WHEN PAGE OPENS
// ======================================

loadBill();
