// ======================================
// GET BILL ID FROM URL
// ======================================

const params = new URLSearchParams(window.location.search);

const billId = params.get("id");


// ======================================
// INPUT ELEMENTS
// ======================================

const billNo = document.getElementById("billNo");

const customerId = document.getElementById("customerId");

const customerName = document.getElementById("customerName");

const customerMobile = document.getElementById("customerMobile");

const customerPlace = document.getElementById("customerPlace");

const billDate = document.getElementById("billDate");

const grandTotal = document.getElementById("grandTotal");

const advanceAmount = document.getElementById("advanceAmount");

const balanceAmount = document.getElementById("balanceAmount");

const paidAmount = document.getElementById("paidAmount");

const newAdvance = document.getElementById("newAdvance");

const newBalance = document.getElementById("newBalance");

const updateBtn = document.getElementById("updateBtn");

const backBtn = document.getElementById("backBtn");// ======================================
// LOAD BILL DETAILS
// ======================================

async function loadBill() {

    try {

        const response = await fetch(
            `http://localhost:5000/bill/${billId}`
        );

        const bill = await response.json();

        billNo.value = bill.bill_no;

        customerId.value = bill.customer_id;

        customerName.value = bill.customer_name;

        customerMobile.value = bill.customer_mobile;

        customerPlace.value = bill.customer_place;

        billDate.value = bill.bill_date;

        grandTotal.value = Number(bill.grand_total).toFixed(2);

        advanceAmount.value = Number(bill.advance_amount).toFixed(2);

        balanceAmount.value = Number(bill.balance_amount).toFixed(2);

        // Default values for live calculation
        newAdvance.value = Number(bill.advance_amount).toFixed(2);

        newBalance.value = Number(bill.balance_amount).toFixed(2);

        // Clear paid amount whenever bill is loaded
        paidAmount.value = "";

    }

    catch (err) {

        console.log(err);

        alert("Unable to load bill details.");

    }

}// ======================================
// PAGE LOAD
// ======================================

loadBill();

// ======================================
// LIVE PAYMENT CALCULATION
// ======================================

paidAmount.addEventListener("input", () => {

    const advance = Number(advanceAmount.value);

    const balance = Number(balanceAmount.value);

    const paid = Number(paidAmount.value) || 0;

    let nextAdvance = advance + paid;

    let nextBalance = balance - paid;

    // Don't allow negative balance
    if (nextBalance < 0) {

        nextBalance = 0;

    }

    newAdvance.value = nextAdvance.toFixed(2);

    newBalance.value = nextBalance.toFixed(2);

});
// ======================================
// UPDATE PAYMENT
// ======================================

updateBtn.addEventListener("click", async () => {

    const paid = Number(paidAmount.value);

    if (!paid || paid <= 0) {
        alert("Enter a valid paid amount");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/update-pending",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: billId,
                    paidAmount: paid
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert("Payment Updated Successfully");

            window.location.href = "pendingBills.html";

        } else {

            alert("Update Failed");

        }

    } catch (err) {

        console.log(err);

        alert("Server Error");

    }

});

// ======================================
// BACK BUTTON
// ======================================

backBtn.addEventListener("click", () => {

    window.location.href = "pendingBills.html";

});