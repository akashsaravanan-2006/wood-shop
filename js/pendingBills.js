const tableBody = document.getElementById("tableBody");
const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");

// =======================================
// BACKEND URL
// =======================================

const API_URL = "YOUR_DEPLOYED_BACKEND_URL";

let allBills = [];

// =======================================
// Load Pending Bills
// =======================================

async function loadPendingBills() {

    try {

        const response = await fetch(`${API_URL}/pending-bills`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        allBills = data;

        displayBills(allBills);

    } catch (error) {

        console.error("Pending Bills Error:", error);

        alert("Unable to load pending bills.");

    }
}

// =======================================
// Display Bills
// =======================================

function displayBills(bills) {

    tableBody.innerHTML = "";

    if (bills.length === 0) {

        tableBody.innerHTML = `
        <tr>
            <td colspan="10" class="noData">
                No Pending Bills Found
            </td>
        </tr>`;

        return;
    }

    bills.forEach((bill, index) => {

        tableBody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${bill.customer_id}</td>

            <td>${bill.customer_name}</td>

            <td>${bill.customer_place}</td>

            <td>${bill.customer_mobile}</td>

            <td>${bill.bill_date}</td>

            <td class="advanceAmount">
                ₹${parseFloat(bill.advance_amount || 0).toFixed(2)}
            </td>

            <td class="pendingAmount">
                ₹${parseFloat(bill.balance_amount || 0).toFixed(2)}
            </td>

            <td>

                <div class="remarkBox">

                    <input
                        type="text"
                        class="remarkInput"
                        id="remark-${bill.id}"
                        value="${bill.remark || ''}"
                        placeholder="Enter Remark">

                    <button
                        class="saveRemarkBtn"
                        onclick="saveRemark(${bill.id})">
                        ✓
                    </button>

                </div>

            </td>

            <td>

                <button
                    class="updateBtn"
                    onclick="updatePending(${bill.id})">

                    Update

                </button>

            </td>

        </tr>

        `;

    });

}

// =======================================
// Search
// =======================================

searchBtn.addEventListener("click", () => {

    const text = searchBox.value.toLowerCase();

    const result = allBills.filter(bill =>

        String(bill.customer_id).toLowerCase().includes(text) ||

        String(bill.customer_name).toLowerCase().includes(text) ||

        String(bill.customer_mobile).includes(text)

    );

    displayBills(result);

});

// =======================================
// Refresh
// =======================================

refreshBtn.addEventListener("click", () => {

    searchBox.value = "";

    loadPendingBills();

});

// =======================================
// Update Button
// =======================================

function updatePending(id) {

    location.assign("update.html?id=" + id);

}

// =======================================
// Save Remark
// =======================================

async function saveRemark(id) {

    const remark = document.getElementById(`remark-${id}`).value;

    try {

        const response = await fetch(`${API_URL}/update-remark`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id,
                remark: remark
            })

        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {

            alert("Remark Saved Successfully");

        } else {

            alert("Unable to Save Remark");

        }

    } catch (err) {

        console.error("Remark Error:", err);

        alert("Server Error");

    }

}

// =======================================
// HOME BUTTON
// =======================================

const homeBtn = document.getElementById("homeBtn");

if (homeBtn) {

    homeBtn.addEventListener("click", () => {

        window.location.href = "index.html";

    });

}

// =======================================
// PAGE LOAD
// =======================================

loadPendingBills();
