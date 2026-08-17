// =======================================
// PENDING BILLS.JS
// =======================================

// =======================================
// BACKEND API URL
// =======================================

// IMPORTANT:
// Your frontend is hosted on Vercel.
// Your backend is hosted separately.
//
// DO NOT use localhost here.

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// =======================================
// ELEMENTS
// =======================================

const tableBody =
    document.getElementById("tableBody");

const searchBox =
    document.getElementById("searchBox");

const searchBtn =
    document.getElementById("searchBtn");

const refreshBtn =
    document.getElementById("refreshBtn");

const homeBtn =
    document.getElementById("homeBtn");


// =======================================
// GLOBAL DATA
// =======================================

let allBills = [];


// =======================================
// LOAD PENDING BILLS
// =======================================

async function loadPendingBills() {

    try {

        console.log("=================================");
        console.log("Loading Pending Bills");
        console.log("API:", `${API_URL}/pending-bills`);
        console.log("=================================");


        // Show loading

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="noData">
                        Loading pending bills...
                    </td>
                </tr>
            `;

        }


        // ===================================
        // API REQUEST
        // ===================================

        const response = await fetch(
            `${API_URL}/pending-bills`,
            {
                method: "GET",

                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        console.log(
            "Response status:",
            response.status
        );


        // ===================================
        // HTTP ERROR
        // ===================================

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


        // ===================================
        // READ JSON
        // ===================================

        const data =
            await response.json();


        console.log(
            "Pending bills response:",
            data
        );


        // ===================================
        // CHECK SUCCESS
        // ===================================

        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load pending bills"
            );

        }


        // ===================================
        // LOAD BILL ARRAY
        // ===================================

        if (Array.isArray(data.bills)) {

            allBills = data.bills;

        }
        else {

            allBills = [];

        }


        console.log(
            "Pending bills loaded:",
            allBills
        );


        // ===================================
        // DISPLAY
        // ===================================

        displayBills(allBills);

    }


    catch (error) {

        console.error(
            "LOAD PENDING BILLS ERROR:",
            error
        );


        allBills = [];


        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="noData">
                        ❌ Unable to load pending bills
                    </td>
                </tr>
            `;

        }


        alert(
            "Unable to load pending bills.\n\n" +
            "Please check the server connection."
        );

    }

}


// =======================================
// DISPLAY PENDING BILLS
// =======================================

function displayBills(bills) {

    if (!tableBody) {

        console.error(
            "tableBody element not found"
        );

        return;

    }


    tableBody.innerHTML = "";


    // ===================================
    // SAFETY CHECK
    // ===================================

    if (!Array.isArray(bills)) {

        bills = [];

    }


    // ===================================
    // NO DATA
    // ===================================

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


    // ===================================
    // DISPLAY EACH BILL
    // ===================================

    bills.forEach(
        function (bill, index) {


            // ===================================
            // CUSTOMER DETAILS
            // ===================================

            const customerId =
                bill.customer_id ?? "-";


            const customerName =
                bill.customer_name ?? "-";


            const customerPlace =
                bill.customer_place ?? "-";


            const customerMobile =
                bill.customer_mobile ?? "-";


            // ===================================
            // BILL DATE
            // ===================================

            const billDate =
                bill.bill_date ?? "-";


            // ===================================
            // AMOUNTS
            // ===================================

            const advanceAmount =
                Number(
                    bill.advance_amount
                ) || 0;


            const balanceAmount =
                Number(
                    bill.balance_amount
                ) || 0;


            // ===================================
            // REMARK
            // ===================================

            const remark =
                bill.remark ?? "";


            // ===================================
            // CREATE ROW
            // ===================================

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <!-- S.NO -->

                <td>
                    ${index + 1}
                </td>


                <!-- CUSTOMER ID -->

                <td>
                    ${escapeHtml(customerId)}
                </td>


                <!-- CUSTOMER NAME -->

                <td>
                    ${escapeHtml(customerName)}
                </td>


                <!-- PLACE -->

                <td>
                    ${escapeHtml(customerPlace)}
                </td>


                <!-- MOBILE -->

                <td>
                    ${escapeHtml(customerMobile)}
                </td>


                <!-- BILL DATE -->

                <td>
                    ${escapeHtml(billDate)}
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

            `;


            tableBody.appendChild(row);

        }
    );

}


// =======================================
// ESCAPE HTML
// =======================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =======================================
// SEARCH
// =======================================

function searchBills() {

    if (!searchBox) {

        return;

    }


    const text =
        searchBox.value
            .trim()
            .toLowerCase();


    // ===================================
    // EMPTY SEARCH
    // ===================================

    if (text === "") {

        displayBills(allBills);

        return;

    }


    // ===================================
    // FILTER
    // ===================================

    const result =
        allBills.filter(
            function (bill) {


                const billNo =
                    String(
                        bill.bill_no ?? ""
                    ).toLowerCase();


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


                const customerPlace =
                    String(
                        bill.customer_place ?? ""
                    ).toLowerCase();


                return (

                    billNo.includes(text) ||

                    customerId.includes(text) ||

                    customerName.includes(text) ||

                    customerMobile.includes(text) ||

                    customerPlace.includes(text)

                );

            }
        );


    displayBills(result);

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
// SEARCH USING ENTER
// =======================================

if (searchBox) {

    searchBox.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                searchBills();

            }

        }
    );

}


// =======================================
// LIVE SEARCH
// =======================================

if (searchBox) {

    searchBox.addEventListener(
        "input",
        searchBills
    );

}


// =======================================
// REFRESH
// =======================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        function () {

            if (searchBox) {

                searchBox.value = "";

            }

            loadPendingBills();

        }
    );

}


// =======================================
// UPDATE PENDING BILL
// =======================================

function updatePending(id) {

    console.log(
        "Opening update page for bill:",
        id
    );


    window.location.href =
        `update.html?id=${encodeURIComponent(id)}`;

}


// =======================================
// SAVE REMARK
// =======================================

async function saveRemark(id) {

    const remarkInput =
        document.getElementById(
            `remark-${id}`
        );


    if (!remarkInput) {

        alert(
            "Remark input not found."
        );

        return;

    }


    const remark =
        remarkInput.value.trim();


    try {

        console.log(
            "Saving remark for bill:",
            id
        );


        const response =
            await fetch(
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


        console.log(
            "Remark response status:",
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Remark server response:",
                errorText
            );

            throw new Error(
                `Server returned HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Remark API response:",
            result
        );


        // ===================================
        // SUCCESS
        // ===================================

        if (result.success) {

            alert(
                "Remark Saved Successfully"
            );


            // Reload from database

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


// =======================================
// HOME BUTTON
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
// PAGE LOAD
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPendingBills();

    }
);
