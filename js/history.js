// =====================================================
// HISTORY.JS
// =====================================================

console.log("=======================================");
console.log("HISTORY.JS LOADED");
console.log("=======================================");


// =====================================================
// BACKEND API
// =====================================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// =====================================================
// ELEMENTS
// =====================================================

const historyBody =
    document.getElementById("historyBody");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const homeBtn =
    document.getElementById("homeBtn");

const statusFilter =
    document.getElementById("statusFilter");


const totalBills =
    document.getElementById("totalBills");

const pendingBills =
    document.getElementById("pendingBills");

const finishedBills =
    document.getElementById("finishedBills");

const returnBills =
    document.getElementById("returnBills");


// =====================================================
// DATA
// =====================================================

let allBills = [];


// =====================================================
// NUMBER HELPER
// =====================================================

function money(value) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {

        return 0;

    }

    return number;

}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// GET BILL ID
// =====================================================

function getBillId(bill) {

    return (
        bill.id ??
        bill.bill_id ??
        bill.billId ??
        bill._id ??
        bill.bill_no
    );

}


// =====================================================
// GET RETURN AMOUNT
// =====================================================

function getReturnAmount(bill) {

    return money(
        bill.return_amount ??
        bill.returnAmount ??
        bill.return_total ??
        bill.returnTotal ??
        0
    );

}


// =====================================================
// CHECK RETURN
// =====================================================

function isReturned(bill) {

    const status =
        String(
            bill.status ??
            bill.bill_status ??
            bill.billStatus ??
            ""
        )
        .trim()
        .toLowerCase();

    const returnAmount =
        getReturnAmount(bill);


    return (
        status === "return" ||
        status === "returned" ||
        status === "return bill" ||
        returnAmount > 0
    );

}


// =====================================================
// CHECK PENDING
// =====================================================

function isPending(bill) {

    if (isReturned(bill)) {

        return false;

    }


    const explicitStatus =
        String(
            bill.status ??
            bill.bill_status ??
            bill.billStatus ??
            ""
        )
        .trim()
        .toLowerCase();


    if (
        explicitStatus === "pending"
    ) {

        return true;

    }


    if (
        explicitStatus === "delivered" ||
        explicitStatus === "finished" ||
        explicitStatus === "paid" ||
        explicitStatus === "completed"
    ) {

        return false;

    }


    const balance =
        money(
            bill.balance_amount ??
            bill.balanceAmount ??
            0
        );


    return balance > 0;

}


// =====================================================
// CHECK FINISHED
// =====================================================

function isFinished(bill) {

    return (
        !isReturned(bill) &&
        !isPending(bill)
    );

}


// =====================================================
// GET STATUS
// =====================================================

function getStatus(bill) {

    if (
        isReturned(bill)
    ) {

        return "return";

    }


    if (
        isPending(bill)
    ) {

        return "pending";

    }


    return "finished";

}


// =====================================================
// GET STATUS TEXT
// =====================================================

function getStatusText(bill) {

    const status =
        getStatus(bill);


    if (
        status === "return"
    ) {

        return "RETURN";

    }


    if (
        status === "pending"
    ) {

        return "PENDING";

    }


    return "DELIVERED";

}


// =====================================================
// GET PAYMENT MODE
// =====================================================

function getPaymentMode(bill) {

    const mode =
        String(
            bill.payment_mode ??
            bill.paymentMode ??
            bill.payment_method ??
            bill.paymentMethod ??
            bill.mode ??
            ""
        )
        .trim()
        .toLowerCase();


    if (
        mode === "upi"
    ) {

        return "UPI";

    }


    if (
        mode === "cash"
    ) {

        return "CASH";

    }


    return "-";

}


// =====================================================
// DATE
// =====================================================

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


// =====================================================
// LOAD BILLS
// =====================================================

async function loadBills() {

    console.log(
        "LOADING BILL HISTORY"
    );


    historyBody.innerHTML = `

        <tr>

            <td
                colspan="14"
                class="noData">

                Loading bills...

            </td>

        </tr>

    `;


    try {

        const response =
            await fetch(
                `${API_URL}/bills`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    cache: "no-store"

                }
            );


        console.log(
            "History response:",
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Backend error:",
                errorText
            );

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "HISTORY DATA:",
            data
        );


        // -----------------------------------------
        // SUPPORT DIFFERENT API RESPONSE FORMATS
        // -----------------------------------------

        if (
            Array.isArray(data)
        ) {

            allBills = data;

        }

        else if (
            data &&
            Array.isArray(data.bills)
        ) {

            allBills =
                data.bills;

        }

        else if (
            data &&
            Array.isArray(data.result)
        ) {

            allBills =
                data.result;

        }

        else if (
            data &&
            data.success &&
            Array.isArray(data.data)
        ) {

            allBills =
                data.data;

        }

        else {

            throw new Error(
                "Bills array not found"
            );

        }


        console.log(
            "TOTAL BILLS:",
            allBills.length
        );


        applyFilters();

    }

    catch (error) {

        console.error(
            "HISTORY LOAD ERROR:",
            error
        );


        historyBody.innerHTML = `

            <tr>

                <td
                    colspan="14"
                    class="noData">

                    ❌ Unable to load bill history

                </td>

            </tr>

        `;


        updateSummary(
            [],
            allBills
        );

    }

}


// =====================================================
// DISPLAY BILLS
// =====================================================

function displayBills(
    bills
) {

    historyBody.innerHTML = "";


    if (
        !Array.isArray(bills) ||
        bills.length === 0
    ) {

        historyBody.innerHTML = `

            <tr>

                <td
                    colspan="14"
                    class="noData">

                    No bills found

                </td>

            </tr>

        `;

        return;

    }


    bills.forEach(
        function (
            bill,
            index
        ) {

            const status =
                getStatus(bill);

            const statusText =
                getStatusText(bill);


            const grandTotal =
                money(
                    bill.grand_total ??
                    bill.grandTotal ??
                    0
                );


            const advance =
                money(
                    bill.advance_amount ??
                    bill.advanceAmount ??
                    0
                );


            const balance =
                money(
                    bill.balance_amount ??
                    bill.balanceAmount ??
                    0
                );


            const returnAmount =
                getReturnAmount(
                    bill
                );


            const paymentMode =
                getPaymentMode(
                    bill
                );


            const row =
                document.createElement(
                    "tr"
                );


            // -----------------------------------------
            // FIXED ROW COLOUR
            // -----------------------------------------

            if (
                status === "pending"
            ) {

                row.className =
                    "pendingRow";

            }

            else if (
                status === "return"
            ) {

                row.className =
                    "returnRow";

            }

            else {

                row.className =
                    "finishedRow";

            }


            // -----------------------------------------
            // PAYMENT PILL
            // -----------------------------------------

            let paymentHTML =
                `<span>-</span>`;


            if (
                paymentMode === "CASH"
            ) {

                paymentHTML = `

                    <span
                        class="paymentPill paymentCash">

                        CASH

                    </span>

                `;

            }

            else if (
                paymentMode === "UPI"
            ) {

                paymentHTML = `

                    <span
                        class="paymentPill paymentUpi">

                        UPI

                    </span>

                `;

            }


            // -----------------------------------------
            // RETURN AMOUNT
            //
            // Normal bill:
            // blank
            //
            // Returned bill:
            // ₹ amount
            // -----------------------------------------

            let returnHTML =
                `<span class="noReturn">-</span>`;


            if (
                status === "return" &&
                returnAmount > 0
            ) {

                returnHTML = `

                    <span
                        class="returnAmount">

                        ₹ ${returnAmount.toFixed(2)}

                    </span>

                `;

            }


            // -----------------------------------------
            // RETURN BUTTON
            // -----------------------------------------

            let returnButtonHTML = "";


            if (
                status === "return"
            ) {

                returnButtonHTML = `

                    <div class="actionBox">

                        <button
                            type="button"
                            class="returnBtn returnedBtn"
                            disabled>

                            Returned

                        </button>

                    </div>

                `;

            }

            else {

                returnButtonHTML = `

                    <div class="actionBox">

                        <button
                            type="button"
                            class="returnBtn"
                            data-bill-id="${escapeHtml(
                                getBillId(bill)
                            )}">

                            Return

                        </button>

                    </div>

                `;

            }


            // -----------------------------------------
            // PDF BUTTON
            // -----------------------------------------

            const pdfButtonHTML = `

                <div class="actionBox">

                    <button
                        type="button"
                        class="pdfBtn"
                        data-bill-id="${escapeHtml(
                            getBillId(bill)
                        )}">

                        PDF

                    </button>

                </div>

            `;


            // -----------------------------------------
            // ROW
            // -----------------------------------------

            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    ${escapeHtml(
                        bill.bill_no ??
                        bill.billNo ??
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        bill.customer_id ??
                        bill.customerId ??
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        bill.customer_name ??
                        bill.customerName ??
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        bill.customer_mobile ??
                        bill.customerMobile ??
                        bill.mobile ??
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        bill.customer_place ??
                        bill.customerPlace ??
                        bill.place ??
                        "-"
                    )}
                </td>


                <td>
                    ${formatDate(
                        bill.bill_date ??
                        bill.billDate ??
                        bill.created_at ??
                        bill.createdAt
                    )}
                </td>


                <td>
                    ${paymentHTML}
                </td>


                <td>
                    ₹ ${grandTotal.toFixed(2)}
                </td>


                <td>
                    ₹ ${advance.toFixed(2)}
                </td>


                <td>
                    ₹ ${balance.toFixed(2)}
                </td>


                <td>
                    ${returnHTML}
                </td>


                <td>

                    <span
                        class="status ${status}">

                        ${statusText}

                    </span>

                </td>


                <td>

                    <div class="actions">

                        ${returnButtonHTML}

                        ${pdfButtonHTML}

                    </div>

                </td>

            `;


            historyBody.appendChild(
                row
            );

        }
    );


    // -----------------------------------------
    // ADD BUTTON EVENTS
    // -----------------------------------------

    attachActionEvents();

}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateSummary(
    displayedBills,
    sourceBills
) {

    const bills =
        Array.isArray(sourceBills)
            ? sourceBills
            : [];


    let pending = 0;

    let finished = 0;

    let returned = 0;


    bills.forEach(
        function (bill) {

            const status =
                getStatus(bill);


            if (
                status === "pending"
            ) {

                pending++;

            }

            else if (
                status === "return"
            ) {

                returned++;

            }

            else {

                finished++;

            }

        }
    );


    if (totalBills) {

        totalBills.textContent =
            bills.length;

    }


    if (pendingBills) {

        pendingBills.textContent =
            pending;

    }


    if (finishedBills) {

        finishedBills.textContent =
            finished;

    }


    if (returnBills) {

        returnBills.textContent =
            returned;

    }


    console.log(
        "TOTAL:",
        bills.length
    );

    console.log(
        "PENDING:",
        pending
    );

    console.log(
        "FINISHED:",
        finished
    );

    console.log(
        "RETURN:",
        returned
    );

}


// =====================================================
// FILTER
// =====================================================

function applyFilters() {

    const search =
        (
            searchInput?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const filter =
        statusFilter?.value ||
        "all";


    let filtered =
        [...allBills];


    // -----------------------------------------
    // SEARCH
    // -----------------------------------------

    if (
        search !== ""
    ) {

        filtered =
            filtered.filter(
                function (bill) {

                    return (

                        String(
                            bill.bill_no ??
                            bill.billNo ??
                            ""
                        )
                        .toLowerCase()
                        .includes(search)


                        ||

                        String(
                            bill.customer_id ??
                            bill.customerId ??
                            ""
                        )
                        .toLowerCase()
                        .includes(search)


                        ||

                        String(
                            bill.customer_name ??
                            bill.customerName ??
                            ""
                        )
                        .toLowerCase()
                        .includes(search)


                        ||

                        String(
                            bill.customer_mobile ??
                            bill.customerMobile ??
                            bill.mobile ??
                            ""
                        )
                        .toLowerCase()
                        .includes(search)


                        ||

                        String(
                            bill.customer_place ??
                            bill.customerPlace ??
                            bill.place ??
                            ""
                        )
                        .toLowerCase()
                        .includes(search)

                    );

                }
            );

    }


    // -----------------------------------------
    // STATUS FILTER
    // -----------------------------------------

    if (
        filter !== "all"
    ) {

        filtered =
            filtered.filter(
                function (bill) {

                    return (
                        getStatus(bill) ===
                        filter
                    );

                }
            );

    }


    displayBills(
        filtered
    );


    // -----------------------------------------
    // SUMMARY ALWAYS SHOWS ALL BILLS
    // -----------------------------------------

    updateSummary(
        filtered,
        allBills
    );

}


// =====================================================
// SEARCH BUTTON
// =====================================================

if (
    searchBtn
) {

    searchBtn.addEventListener(
        "click",
        applyFilters
    );

}


// =====================================================
// LIVE SEARCH
// =====================================================

if (
    searchInput
) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );


    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                applyFilters();

            }

        }
    );

}


// =====================================================
// FILTER CHANGE
// =====================================================

if (
    statusFilter
) {

    statusFilter.addEventListener(
        "change",
        applyFilters
    );

}


// =====================================================
// REFRESH
// =====================================================

if (
    refreshBtn
) {

    refreshBtn.addEventListener(
        "click",
        function () {

            loadBills();

        }
    );

}


// =====================================================
// HOME
// =====================================================

if (
    homeBtn
) {

    homeBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";

        }
    );

}


// =====================================================
// ACTION EVENTS
// =====================================================

function attachActionEvents() {


    // -----------------------------------------
    // RETURN BUTTONS
    // -----------------------------------------

    document
        .querySelectorAll(
            ".returnBtn:not(.returnedBtn)"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const billId =
                            button.dataset.billId;


                        const bill =
                            findBill(
                                billId
                            );


                        if (!bill) {

                            alert(
                                "Bill not found."
                            );

                            return;

                        }


                        handleReturn(
                            bill
                        );

                    }
                );

            }
        );


    // -----------------------------------------
    // PDF BUTTONS
    // -----------------------------------------

    document
        .querySelectorAll(
            ".pdfBtn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const billId =
                            button.dataset.billId;


                        const bill =
                            findBill(
                                billId
                            );


                        if (!bill) {

                            alert(
                                "Bill not found."
                            );

                            return;

                        }


                        openBillPDF(
                            bill
                        );

                    }
                );

            }
        );

}


// =====================================================
// FIND BILL
// =====================================================

function findBill(
    id
) {

    return allBills.find(
        function (bill) {

            return String(
                getBillId(bill)
            ) === String(id);

        }
    );

}


// =====================================================
// RETURN BILL
// =====================================================

async function handleReturn(
    bill
) {

    const billNo =
        bill.bill_no ??
        bill.billNo ??
        "-";


    const grandTotal =
        money(
            bill.grand_total ??
            bill.grandTotal ??
            0
        );


    const existingReturn =
        getReturnAmount(
            bill
        );


    const availableAmount =
        Math.max(
            0,
            grandTotal -
            existingReturn
        );


    const input =
        prompt(
            `Return Amount for Bill ${billNo}\n\n` +
            `Bill Total: ₹ ${grandTotal.toFixed(2)}\n\n` +
            `Enter return amount:`
        );


    if (
        input === null
    ) {

        return;

    }


    const returnAmount =
        Number(input);


    if (
        !Number.isFinite(
            returnAmount
        ) ||
        returnAmount <= 0
    ) {

        alert(
            "Please enter a valid return amount."
        );

        return;

    }


    if (
        returnAmount >
        availableAmount
    ) {

        alert(
            `Return amount cannot be greater than ₹ ${availableAmount.toFixed(2)}`
        );

        return;

    }


    const confirmed =
        confirm(
            `Confirm Return?\n\n` +
            `Bill No: ${billNo}\n` +
            `Return Amount: ₹ ${returnAmount.toFixed(2)}`
        );


    if (
        !confirmed
    ) {

        return;

    }


    try {

        await saveReturn(
            bill,
            returnAmount
        );


        // -----------------------------------------
        // UPDATE FRONTEND DATA
        // -----------------------------------------

        const index =
            allBills.indexOf(
                bill
            );


        if (
            index !== -1
        ) {

            allBills[index] = {

                ...allBills[index],

                return_amount:
                    returnAmount,

                status:
                    "return"

            };

        }


        alert(
            "Return saved successfully."
        );


        applyFilters();


    }

    catch (error) {

        console.error(
            "RETURN ERROR:",
            error
        );


        alert(
            "Unable to save return.\n\n" +
            error.message
        );

    }

}


// =====================================================
// SAVE RETURN TO BACKEND
// =====================================================
//
// IMPORTANT
// -----------------------------------------------------
// This expects your backend to support:
//
// PATCH /api/bills/:id
//
// with:
//
// {
//     "return_amount": 100,
//     "status": "return"
// }
//
// If your backend uses another route, change ONLY
// this function.
// =====================================================

async function saveReturn(
    bill,
    returnAmount
) {

    const billId =
        getBillId(bill);


    if (
        billId === undefined ||
        billId === null ||
        billId === ""
    ) {

        throw new Error(
            "Bill ID is missing."
        );

    }


    const url =
        `${API_URL}/bills/${encodeURIComponent(
            billId
        )}`;


    console.log(
        "SAVING RETURN:",
        url
    );


    const response =
        await fetch(
            url,
            {

                method: "PATCH",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    return_amount:
                        returnAmount,

                    status:
                        "return"

                })

            }
        );


    if (
        !response.ok
    ) {

        const text =
            await response.text();


        throw new Error(
            `Backend return update failed: HTTP ${response.status} ${text}`
        );

    }


    return response.json();

}


// =====================================================
// PDF / PRINT BILL
// =====================================================

function openBillPDF(
    bill
) {

    console.log(
        "OPENING BILL PDF:",
        bill
    );


    const billNo =
        bill.bill_no ??
        bill.billNo ??
        "Bill";


    const customerName =
        bill.customer_name ??
        bill.customerName ??
        "-";


    const mobile =
        bill.customer_mobile ??
        bill.customerMobile ??
        bill.mobile ??
        "-";


    const place =
        bill.customer_place ??
        bill.customerPlace ??
        bill.place ??
        "-";


    const date =
        formatDate(
            bill.bill_date ??
            bill.billDate ??
            bill.created_at ??
            bill.createdAt
        );


    const paymentMode =
        getPaymentMode(
            bill
        );


    const grandTotal =
        money(
            bill.grand_total ??
            bill.grandTotal ??
            0
        );


    const advance =
        money(
            bill.advance_amount ??
            bill.advanceAmount ??
            0
        );


    const balance =
        money(
            bill.balance_amount ??
            bill.balanceAmount ??
            0
        );


    const returnAmount =
        getReturnAmount(
            bill
        );


    const status =
        getStatusText(
            bill
        );


    // -----------------------------------------
    // OPEN PRINT WINDOW
    // -----------------------------------------

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );


    if (
        !printWindow
    ) {

        alert(
            "Popup was blocked. Please allow popups for this website."
        );

        return;

    }


    const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
Bill-${escapeHtml(billNo)}
</title>


<style>

* {
    box-sizing: border-box;
}


body {

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    margin: 0;

    padding: 30px;

    color: #111;

}


.bill {

    max-width: 800px;

    margin: 0 auto;

}


h1 {

    text-align: center;

    margin-bottom: 5px;

}


.billNo {

    text-align: center;

    font-size: 18px;

    font-weight: bold;

    margin-bottom: 25px;

}


.info {

    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 10px;

    margin-bottom: 25px;

}


.info div {

    padding: 10px;

    border: 1px solid #ddd;

}


table {

    width: 100%;

    border-collapse: collapse;

    margin-top: 20px;

}


th,
td {

    border: 1px solid #ccc;

    padding: 12px;

}


th {

    background: #f1f1f1;

    text-align: left;

}


.amount {

    text-align: right;

}


.total {

    font-size: 18px;

    font-weight: bold;

}


.return {

    color: #a16207;

    font-weight: bold;

}


.footer {

    margin-top: 40px;

    text-align: center;

    color: #666;

}


@media print {

    body {

        padding: 0;

    }

}

</style>

</head>


<body>

<div class="bill">


    <h1>
        WOOD SHOP
    </h1>


    <div class="billNo">

        BILL NO:
        ${escapeHtml(billNo)}

    </div>


    <div class="info">

        <div>
            <strong>Customer Name:</strong>
            ${escapeHtml(customerName)}
        </div>


        <div>
            <strong>Mobile:</strong>
            ${escapeHtml(mobile)}
        </div>


        <div>
            <strong>Place:</strong>
            ${escapeHtml(place)}
        </div>


        <div>
            <strong>Date:</strong>
            ${escapeHtml(date)}
        </div>


        <div>
            <strong>Payment Mode:</strong>
            ${escapeHtml(paymentMode)}
        </div>


        <div>
            <strong>Status:</strong>
            ${escapeHtml(status)}
        </div>

    </div>


    <table>

        <tr>

            <th>
                Description
            </th>

            <th class="amount">
                Amount
            </th>

        </tr>


        <tr>

            <td>
                Grand Total
            </td>

            <td class="amount">
                ₹ ${grandTotal.toFixed(2)}
            </td>

        </tr>


        <tr>

            <td>
                Advance
            </td>

            <td class="amount">
                ₹ ${advance.toFixed(2)}
            </td>

        </tr>


        <tr>

            <td>
                Balance
            </td>

            <td class="amount">
                ₹ ${balance.toFixed(2)}
            </td>

        </tr>


        ${
            returnAmount > 0
            ? `

            <tr>

                <td class="return">
                    Return Amount
                </td>

                <td class="amount return">
                    ₹ ${returnAmount.toFixed(2)}
                </td>

            </tr>

            `
            : ""
        }


        <tr>

            <td class="total">
                Grand Total
            </td>

            <td class="amount total">
                ₹ ${grandTotal.toFixed(2)}
            </td>

        </tr>

    </table>


    <div class="footer">

        Thank you

    </div>


</div>


<script>

window.onload = function () {

    setTimeout(
        function () {

            window.print();

        },
        300
    );

};

</script>


</body>

</html>

`;


    printWindow.document.open();

    printWindow.document.write(
        html
    );

    printWindow.document.close();

}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "HISTORY PAGE READY"
        );


        loadBills();

    }
);
