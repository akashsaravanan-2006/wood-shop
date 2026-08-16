const tableBody = document.getElementById("tableBody");
const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");

let allBills = [];

// ===============================
// Load Pending Bills
// ===============================

async function loadPendingBills() {

    try {

        const response = await fetch("http://localhost:5000/pending-bills");

        const data = await response.json();

        allBills = data;

        displayBills(allBills);

    }
    catch (error) {

        console.error(error);

        alert("Unable to load pending bills.");

    }

}

// ===============================
// Display Bills
// ===============================

function displayBills(bills) {

    tableBody.innerHTML = "";

    if (bills.length === 0) {

        tableBody.innerHTML = `
        <tr>
            <td colspan="9" class="noData">
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
                ₹${parseFloat(bill.advance_amount).toFixed(2)}
            </td>

            <td class="pendingAmount">
    ₹${parseFloat(bill.balance_amount).toFixed(2)}
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

// ===============================
// Search
// ===============================

searchBtn.addEventListener("click", () => {

    const text = searchBox.value.toLowerCase();

    const result = allBills.filter(bill =>

        bill.customer_id.toLowerCase().includes(text) ||

        bill.customer_name.toLowerCase().includes(text) ||

        bill.customer_mobile.includes(text)

    );

    displayBills(result);

});

// ===============================
// Refresh
// ===============================

refreshBtn.addEventListener("click", () => {

    searchBox.value = "";

    loadPendingBills();

});

// ===============================
// Update Button
// ===============================

function updatePending(id) {


    location.assign("update.html?id=" + id);

}
// ===============================
// Page Load
// ===============================

loadPendingBills();
async function saveRemark(id) {

    const remark = document.getElementById(`remark-${id}`).value;

    try {

        const response = await fetch(
            "http://localhost:5000/update-remark",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    remark: remark
                })
            }
        );

        const result = await response.json();

        if (result.success) {

            alert("Remark Saved Successfully");

        } else {

            alert("Unable to Save Remark");

        }

    } catch (err) {

        console.error(err);

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