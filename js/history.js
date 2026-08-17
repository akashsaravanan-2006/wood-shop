// =======================================
// HISTORY.JS
// =======================================

// =======================================
// BACKEND API
// =======================================

const API_URL = "https://wood-shop-backend.vercel.app/api";

// =======================================
// ELEMENTS
// =======================================

const historyBody = document.getElementById("historyBody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const homeBtn = document.getElementById("homeBtn");

const totalBills = document.getElementById("totalBills");
const pendingBills = document.getElementById("pendingBills");
const paidBills = document.getElementById("paidBills");

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

        console.log("Loading history...");
        console.log("API:", `${API_URL}/bills`);

        const response = await fetch(`${API_URL}/bills`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("History response status:", response.status);

        if (!response.ok) {

            const errorText = await response.text();

            console.error("Server response:", errorText);

            throw new Error(
                `Server returned HTTP ${response.status}`
            );
        }

        const data = await response.json();

        console.log("History API response:", data);

        // ===================================
        // SUPPORT BOTH RESPONSE FORMATS
        // ===================================

        if (Array.isArray(data)) {

            allBills = data;

        }
        else if (
            data &&
            data.success &&
            Array.isArray(data.bills)
        ) {

            allBills = data.bills;

        }
        else if (
            data &&
            Array.isArray(data.result)
        ) {

            allBills = data.result;

        }
        else {

            throw new Error(
                data?.message || "Invalid bills response"
            );

        }

        displayBills(allBills);

    }

    catch (error) {

        console.error("HISTORY LOAD ERROR:", error);

        historyBody.innerHTML = `
            <tr>
                <td colspan="12">
                    ❌ Unable to load bill history
                </td>
            </tr>
        `;

        updateSummary(0, 0, 0);

    }

}


// =======================================
// DISPLAY BILLS
// =======================================

function displayBills(bills) {

    historyBody.innerHTML = "";

    let pendingCount = 0;
    let paidCount = 0;

    if (!Array.isArray(bills)) {

        bills = [];

    }


    // ===================================
    // NO BILLS
    // ===================================

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


    // ===================================
    // DISPLAY EACH BILL
    // ===================================

    bills.forEach((bill, index) => {

        const balance =
            Number(bill.balance_amount) || 0;

        const isPending =
            balance > 0;

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

            const d = new Date(bill.bill_date);

            if (!isNaN(d.getTime())) {

                date =
                    d.toLocaleDateString("en-IN");

            }
            else {

                date = bill.bill_date;

            }

        }


        // ===================================
        // CREATE ROW
        // ===================================

        const row =
            document.createElement("tr");

        if (isPending) {

            row.classList.add("pendingRow");

        }


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td class="billNo">
                ${escapeHtml(bill.bill_no || "-")}
            </td>

            <td>
                ${escapeHtml(bill.customer_id || "-")}
            </td>

            <td>
                ${escapeHtml(bill.customer_name || "-")}
            </td>

            <td>
                ${escapeHtml(bill.customer_mobile || "-")}
            </td>

            <td>
                ${escapeHtml(bill.customer_place || "-")}
            </td>

            <td>
                ${date}
            </td>

            <td>
                ${escapeHtml(bill.payment_type || "-")}
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

            <td class="status ${
                isPending ? "pending" : "paid"
            }">

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
// ESCAPE HTML
// =======================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =======================================
// SUMMARY
// =======================================

function updateSummary(
    total,
    pending,
    paid
) {

    if (totalBills) {

        totalBills.textContent = total;

    }

    if (pendingBills) {

        pendingBills.textContent = pending;

    }

    if (paidBills) {

        paidBills.textContent = paid;

    }

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

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchBills
    );

}


// =======================================
// LIVE SEARCH
// =======================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchBills
    );

}


// =======================================
// ENTER KEY
// =======================================

if (searchInput) {

    searchInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                searchBills();

            }

        }
    );

}


// =======================================
// REFRESH
// =======================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        function () {

            loadBills();

        }
    );

}


// =======================================
// HOME
// =======================================

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";

        }
    );

}


// =======================================
// START
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBills();

    }
);
