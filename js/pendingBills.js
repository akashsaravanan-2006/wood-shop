const tableBody = document.getElementById("tableBody");
const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");

// ======================================================
// BACKEND API URL
// ======================================================
//
// If your backend and frontend are deployed in the SAME
// Vercel project, keep this as:
//
// const API_URL = "";
//
// If your backend is deployed separately, put its URL here:
//
// const API_URL = "https://your-backend-url.com";
//
// DO NOT use localhost for the Vercel website.
//
// ======================================================

const API_URL = "";

let allBills = [];


// ======================================================
// LOAD PENDING BILLS
// ======================================================

async function loadPendingBills() {

    try {

        console.log("Loading pending bills...");

        const response = await fetch(`${API_URL}/pending-bills`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Response status:", response.status);

        // Check HTTP status
        if (!response.ok) {

            throw new Error(
                `Server returned HTTP ${response.status}`
            );

        }

        const data = await response.json();

        console.log("Pending bills response:", data);

        // ==================================================
        // IMPORTANT
        // Backend returns:
        //
        // {
        //     success: true,
        //     bills: [...]
        // }
        //
        // So we MUST use data.bills
        // ==================================================

        if (!data.success) {

            throw new Error(
                data.message || "Unable to load pending bills"
            );

        }

        allBills = Array.isArray(data.bills)
            ? data.bills
            : [];

        console.log(
            "Pending bills loaded:",
            allBills
        );

        displayBills(allBills);

    }
    catch (error) {

        console.error(
            "LOAD PENDING BILLS ERROR:",
            error
        );

        allBills = [];

        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="noData">
                    Unable to load pending bills
                </td>
            </tr>
        `;

        alert(
            "Unable to load pending bills.\n\n" +
            "Please check the server connection."
        );

    }

}


// ======================================================
// DISPLAY BILLS
// ======================================================

function displayBills(bills) {

    tableBody.innerHTML = "";

    // Make sure bills is an array
    if (!Array.isArray(bills)) {

        bills = [];

    }


    // ==================================================
    // NO DATA
    // ==================================================

    if (bills.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="noData">
                    No Pending Bills Found
                </td>
            </tr>
        `;

        return;

    }


    // ==================================================
    // DISPLAY EACH BILL
    // ==================================================

    bills.forEach((bill, index) => {

        const customerId =
            bill.customer_id ?? "";

        const customerName =
            bill.customer_name ?? "";

        const customerPlace =
            bill.customer_place ?? "";

        const customerMobile =
            bill.customer_mobile ?? "";

        const billDate =
            bill.bill_date ?? "";

        const advanceAmount =
            Number(bill.advance_amount) || 0;

        const balanceAmount =
            Number(bill.balance_amount) || 0;

        const remark =
            bill.remark ?? "";


        tableBody.innerHTML += `

            <tr>

                <!-- S.NO -->
                <td>
                    ${index + 1}
                </td>


                <!-- CUSTOMER ID -->
                <td>
                    ${customerId}
                </td>


                <!-- CUSTOMER NAME -->
                <td>
                    ${customerName}
                </td>


                <!-- PLACE -->
                <td>
                    ${customerPlace}
                </td>


                <!-- MOBILE -->
                <td>
                    ${customerMobile}
                </td>


                <!-- BILL DATE -->
                <td>
                    ${billDate}
                </td>


                <!-- ADVANCE -->
                <td class="advanceAmount">
                    ₹${advanceAmount.toFixed(2)}
                </td>


                <!-- PENDING -->
                <td class="pendingAmount">
                    ₹${balanceAmount.toFixed(2)}
                </td>


                <!-- REMARK -->
                <td>

                    <div class="remarkBox">

                        <input
                            type="text"
                            class="remarkInput"
                            id="remark-${bill.id}"
                            value="${escapeHtml(remark)}"
                            placeholder="Enter Remark"
                        >

                        <button
                            class="saveRemarkBtn"
                            onclick="saveRemark(${bill.id})"
                            title="Save Remark"
                        >
                            ✓
                        </button>

                    </div>

                </td>


                <!-- UPDATE -->
                <td>

                    <button
                        class="updateBtn"
                        onclick="updatePending(${bill.id})"
                    >
                        Update
                    </button>

                </td>

            </tr>

        `;

    });

}


// ======================================================
// ESCAPE HTML
// ======================================================
//
// Prevents customer remarks from breaking HTML
//
// ======================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// SEARCH
// ======================================================

if (searchBtn) {

    searchBtn.addEventListener("click", () => {

        const text =
            searchBox.value
                .trim()
                .toLowerCase();


        // If search box is empty,
        // show all bills

        if (text === "") {

            displayBills(allBills);

            return;

        }


        const result =
            allBills.filter((bill) => {

                const customerId =
                    String(
                        bill.customer_id ?? ""
                    ).toLowerCase();

                const customerName =
                    String(
                        bill.customer_name ?? ""
                    ).toLowerCase();

                const customerMobile =
                    String(
                        bill.customer_mobile ?? ""
                    ).toLowerCase();


                return (

                    customerId.includes(text) ||

                    customerName.includes(text) ||

                    customerMobile.includes(text)

                );

            });


        displayBills(result);

    });

}


// ======================================================
// SEARCH USING ENTER KEY
// ======================================================

if (searchBox) {

    searchBox.addEventListener("keypress", (event) => {

        if (event.key === "Enter") {

            searchBtn.click();

        }

    });

}


// ======================================================
// REFRESH
// ======================================================

if (refreshBtn) {

    refreshBtn.addEventListener("click", () => {

        searchBox.value = "";

        loadPendingBills();

    });

}


// ======================================================
// UPDATE PENDING BILL
// ======================================================

function updatePending(id) {

    console.log(
        "Opening update page for bill:",
        id
    );

    window.location.href =
        `update.html?id=${encodeURIComponent(id)}`;

}


// ======================================================
// SAVE REMARK
// ======================================================

async function saveRemark(id) {

    const remarkInput =
        document.getElementById(
            `remark-${id}`
        );


    if (!remarkInput) {

        alert("Remark input not found.");

        return;

    }


    const remark =
        remarkInput.value.trim();


    try {

        console.log(
            "Saving remark for bill:",
            id
        );


        const response = await fetch(
            `${API_URL}/update-remark`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    id: id,

                    remark: remark

                })

            }
        );


        if (!response.ok) {

            throw new Error(
                `Server returned HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Remark response:",
            result
        );


        if (result.success) {

            alert(
                "Remark Saved Successfully"
            );

            // Reload data so the saved remark
            // is displayed from the database

            loadPendingBills();

        }
        else {

            alert(
                result.message ||
                "Unable to Save Remark"
            );

        }

    }
    catch (error) {

        console.error(
            "SAVE REMARK ERROR:",
            error
        );

        alert(
            "Server Error while saving remark."
        );

    }

}


// ======================================================
// HOME BUTTON
// ======================================================

const homeBtn =
    document.getElementById("homeBtn");


if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPendingBills();

    }
);
