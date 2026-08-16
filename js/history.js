// =======================================
// HISTORY.JS
// =======================================

const API_URL = "http://localhost:5000";

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

const totalBills =
    document.getElementById("totalBills");

const pendingBills =
    document.getElementById("pendingBills");

const paidBills =
    document.getElementById("paidBills");


let allBills = [];


// =======================================
// LOAD ALL BILLS
// =======================================

async function loadBills() {

    try {

        historyBody.innerHTML = `
            <tr>
                <td colspan="12">
                    Loading...
                </td>
            </tr>
        `;

        const response =
            await fetch(`${API_URL}/bills`);

        if (!response.ok) {
            throw new Error("Failed to load bills");
        }

        allBills = await response.json();

        displayBills(allBills);

    }

    catch (error) {

        console.error(error);

        historyBody.innerHTML = `
            <tr>
                <td colspan="12">
                    ❌ Unable to load bill history
                </td>
            </tr>
        `;

    }

}


// =======================================
// DISPLAY BILLS
// =======================================

function displayBills(bills) {

    historyBody.innerHTML = "";

    let pendingCount = 0;
    let paidCount = 0;


    if (bills.length === 0) {

        historyBody.innerHTML = `
            <tr>
                <td colspan="12">
                    No bills found
                </td>
            </tr>
        `;

        updateSummary(0, 0, 0);

        return;

    }


    bills.forEach((bill, index) => {

        const balance =
            Number(bill.balance_amount) || 0;


        // ===================================
        // STATUS
        // ===================================

        const isPending = balance > 1;

        let statusText;

        if (isPending) {

            statusText = "PENDING";
            pendingCount++;

        }
        else {

            statusText = "PAID";
            paidCount++;

        }


        // ===================================
        // DATE
        // ===================================

        let date = "-";

        if (bill.bill_date) {

            const d =
                new Date(bill.bill_date);

            date =
                d.toLocaleDateString("en-IN");

        }


        // ===================================
        // TABLE ROW
        // ===================================

        const row =
            document.createElement("tr");


        if (isPending) {

            row.classList.add("pendingRow");

        }


        row.innerHTML = `

            <td>${index + 1}</td>

            <td class="billNo">
                ${bill.bill_no || "-"}
            </td>

            <td>
                ${bill.customer_id || "-"}
            </td>

            <td>
                ${bill.customer_name || "-"}
            </td>

            <td>
                ${bill.customer_mobile || "-"}
            </td>

            <td>
                ${bill.customer_place || "-"}
            </td>

            <td>
                ${date}
            </td>

            <td>
                ${bill.payment_type || "-"}
            </td>

            <td>
                ₹ ${Number(
                    bill.grand_total || 0
                ).toFixed(2)}
            </td>

            <td>
                ₹ ${Number(
                    bill.advance_amount || 0
                ).toFixed(2)}
            </td>

            <td>
                ₹ ${balance.toFixed(2)}
            </td>

            <td class="status ${isPending
                ? "pending"
                : "paid"}">

                ${statusText}

            </td>

        `;

        historyBody.appendChild(row);

    });


    updateSummary(
        bills.length,
        pendingCount,
        paidCount
    );

}


// =======================================
// SUMMARY
// =======================================

function updateSummary(
    total,
    pending,
    paid
) {

    totalBills.textContent = total;

    pendingBills.textContent = pending;

    paidBills.textContent = paid;

}


// =======================================
// SEARCH
// =======================================

function searchBills() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (search === "") {

        displayBills(allBills);

        return;

    }


    const filtered =
        allBills.filter(function (bill) {

            return (

                String(
                    bill.bill_no || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    bill.customer_id || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    bill.customer_name || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    bill.customer_mobile || ""
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    bill.customer_place || ""
                )
                .toLowerCase()
                .includes(search)

            );

        });


    displayBills(filtered);

}


// =======================================
// SEARCH BUTTON
// =======================================

searchBtn.addEventListener(
    "click",
    searchBills
);


// =======================================
// LIVE SEARCH
// =======================================

searchInput.addEventListener(
    "input",
    searchBills
);


// =======================================
// REFRESH
// =======================================

refreshBtn.addEventListener(
    "click",
    loadBills
);


// =======================================
// HOME
// =======================================

homeBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "index.html";

    }
);


// =======================================
// INITIAL LOAD
// =======================================

loadBills();