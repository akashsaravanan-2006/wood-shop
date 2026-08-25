// =====================================================
// HISTORY.JS
// BILL HISTORY + PDF
// =====================================================

console.log("======================================");
console.log("HISTORY.JS LOADED");
console.log("HISTORY VERSION 50");
console.log("======================================");


// =====================================================
// BACKEND
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
// NUMBER
// =====================================================

function numberValue(value) {

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
// MONEY
// =====================================================

function money(value) {

    return numberValue(value);

}


// =====================================================
// FORMAT MONEY
// =====================================================

function formatMoney(value) {

    return money(value).toFixed(2);

}


// =====================================================
// ESCAPE HTML
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
// PARSE JSON SAFELY
// =====================================================

function parseJSON(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return [];

    }


    if (
        Array.isArray(value)
    ) {

        return value;

    }


    if (
        typeof value === "object"
    ) {

        return value;

    }


    if (
        typeof value === "string"
    ) {

        try {

            return JSON.parse(value);

        }

        catch (error) {

            console.error(
                "JSON PARSE ERROR:",
                error
            );

            return [];

        }

    }


    return [];

}


// =====================================================
// BILL ID
// =====================================================

function getBillId(bill) {

    return (
        bill.id ??
        bill.bill_id ??
        bill.billId ??
        bill._id ??
        ""
    );

}


// =====================================================
// RETURN AMOUNT
// =====================================================

function getReturnAmount(bill) {

    return money(
        bill.return_amount ??
        bill.returnAmount ??
        0
    );

}


// =====================================================
// STATUS
// =====================================================

function getStatus(bill) {

    const returnAmount =
        getReturnAmount(bill);


    const status =
        String(
            bill.status ??
            bill.bill_status ??
            ""
        )
        .trim()
        .toLowerCase();


    if (
        returnAmount > 0 ||
        status === "return" ||
        status === "returned"
    ) {

        return "return";

    }


    const balance =
        money(
            bill.balance_amount
        );


    if (
        balance > 0
    ) {

        return "pending";

    }


    return "finished";

}


// =====================================================
// STATUS TEXT
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
// PAYMENT TYPE
// =====================================================

function getPaymentType(bill) {

    return (
        bill.payment_type ??
        bill.paymentType ??
        "-"
    );

}


// =====================================================
// PAYMENT MODE
// =====================================================

function getPaymentMode(bill) {

    const mode =
        bill.payment_mode ??
        bill.paymentMode ??
        "";


    if (
        String(mode)
            .toLowerCase() === "upi"
    ) {

        return "UPI";

    }


    if (
        String(mode)
            .toLowerCase() === "cash"
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
// GET WOOD DATA
// =====================================================

function getWoodData(bill) {

    return parseJSON(
        bill.wood_data ??
        bill.woodData ??
        []
    );

}


// =====================================================
// GET OTHERS DATA
// =====================================================

function getOthersData(bill) {

    return parseJSON(
        bill.others_data ??
        bill.othersData ??
        []
    );

}


// =====================================================
// GET DISCOUNT
// =====================================================

function getDiscount(bill) {

    return money(
        bill.discount_amount ??
        bill.discountAmount ??
        bill.discount ??
        0
    );

}


// =====================================================
// GET CUSTOMER NAME
// =====================================================

function getCustomerName(bill) {

    return (
        bill.customer_name ??
        bill.customerName ??
        ""
    );

}


// =====================================================
// GET CUSTOMER MOBILE
// =====================================================

function getCustomerMobile(bill) {

    return (
        bill.customer_mobile ??
        bill.customerMobile ??
        ""
    );

}


// =====================================================
// GET CUSTOMER PLACE
// =====================================================

function getCustomerPlace(bill) {

    return (
        bill.customer_place ??
        bill.customerPlace ??
        ""
    );

}


// =====================================================
// LOAD ALL BILLS
// =====================================================

async function loadBills() {

    console.log(
        "Loading bill history..."
    );


    if (historyBody) {

        historyBody.innerHTML = `

            <tr>

                <td
                    colspan="14"
                    class="noData">

                    Loading...

                </td>

            </tr>

        `;

    }


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


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "HISTORY RESPONSE:",
            data
        );


        if (
            Array.isArray(data)
        ) {

            allBills =
                data;

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
            "HISTORY ERROR:",
            error
        );


        if (historyBody) {

            historyBody.innerHTML = `

                <tr>

                    <td
                        colspan="14"
                        class="noData">

                        ❌ Unable to load bill history

                    </td>

                </tr>

            `;

        }

    }

}


// =====================================================
// DISPLAY HISTORY
// =====================================================

function displayBills(
    bills
) {

    if (!historyBody) {

        return;

    }


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


            const billId =
                getBillId(bill);


            const grandTotal =
                money(
                    bill.grand_total
                );


            const advance =
                money(
                    bill.advance_amount
                );


            const balance =
                money(
                    bill.balance_amount
                );


            const returnAmount =
                getReturnAmount(bill);


            const paymentType =
                getPaymentType(bill);


            const paymentMode =
                getPaymentMode(bill);


            const customerName =
                getCustomerName(bill);


            const customerMobile =
                getCustomerMobile(bill);


            const customerPlace =
                getCustomerPlace(bill);


            const row =
                document.createElement(
                    "tr"
                );


            // -----------------------------------------
            // ROW COLOUR
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
            // PAYMENT
            // -----------------------------------------

            let paymentHTML =
                "-";


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


            if (
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
            // -----------------------------------------

            let returnHTML =
                `<span class="noReturn">-</span>`;


            if (
                returnAmount > 0
            ) {

                returnHTML = `

                    <span
                        class="returnAmount">

                        ₹ ${formatMoney(returnAmount)}

                    </span>

                `;

            }


            // -----------------------------------------
            // RETURN BUTTON
            // -----------------------------------------

            let returnHTMLButton = "";


            if (
                status === "return"
            ) {

                returnHTMLButton = `

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

                returnHTMLButton = `

                    <div class="actionBox">

                        <button
                            type="button"
                            class="returnBtn"
                            data-bill-id="${escapeHtml(billId)}">

                            Return

                        </button>

                    </div>

                `;

            }


            // -----------------------------------------
            // PDF BUTTON
            // -----------------------------------------

            const pdfHTML = `

                <div class="actionBox">

                    <button
                        type="button"
                        class="pdfBtn"
                        data-bill-id="${escapeHtml(billId)}">

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
                        bill.bill_no || "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        bill.customer_id || "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        customerName || "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        customerMobile || "-"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        customerPlace || "-"
                    )}
                </td>


                <td>
                    ${formatDate(
                        bill.bill_date
                    )}
                </td>


                <td>

                    <div>
                        ${paymentHTML}
                    </div>

                    <small>
                        ${escapeHtml(
                            paymentType
                        )}
                    </small>

                </td>


                <td>
                    ₹ ${formatMoney(
                        grandTotal
                    )}
                </td>


                <td>
                    ₹ ${formatMoney(
                        advance
                    )}
                </td>


                <td>
                    ₹ ${formatMoney(
                        balance
                    )}
                </td>


                <td>
                    ${returnHTML}
                </td>


                <td>

                    <span
                        class="status ${status}">

                        ${getStatusText(bill)}

                    </span>

                </td>


                <td>

                    <div class="actions">

                        ${returnHTMLButton}

                        ${pdfHTML}

                    </div>

                </td>

            `;


            historyBody.appendChild(
                row
            );

        }
    );


    attachActionEvents();

    updateSummary();

}


// =====================================================
// SUMMARY
// =====================================================

function updateSummary() {

    let pending = 0;

    let finished = 0;

    let returned = 0;


    allBills.forEach(
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
            allBills.length;

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
        search
    ) {

        filtered =
            filtered.filter(
                function (bill) {

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
                            getCustomerName(bill)
                        )
                        .toLowerCase()
                        .includes(search)


                        ||

                        String(
                            getCustomerMobile(bill)
                        )
                        .toLowerCase()
                        .includes(search)


                        ||

                        String(
                            getCustomerPlace(bill)
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

}


// =====================================================
// ACTION EVENTS
// =====================================================

function attachActionEvents() {


    // -----------------------------------------
    // RETURN
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
                            allBills.find(
                                function (item) {

                                    return String(
                                        getBillId(item)
                                    ) ===
                                    String(billId);

                                }
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
    // PDF
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


                        console.log(
                            "PDF CLICK:",
                            billId
                        );


                        const bill =
                            allBills.find(
                                function (item) {

                                    return String(
                                        getBillId(item)
                                    ) ===
                                    String(billId);

                                }
                            );


                        if (!bill) {

                            alert(
                                "Bill not found."
                            );

                            return;

                        }


                        downloadBillPDF(
                            billId
                        );

                    }
                );

            }
        );

}


// =====================================================
// RETURN
// =====================================================

async function handleReturn(
    bill
) {

    const billNo =
        bill.bill_no ||
        "-";


    const grandTotal =
        money(
            bill.grand_total
        );


    const returnAmount =
        Number(
            prompt(
                `Enter Return Amount\n\nBill No: ${billNo}\nGrand Total: ₹ ${formatMoney(grandTotal)}`
            )
        );


    if (
        !Number.isFinite(
            returnAmount
        )
    ) {

        return;

    }


    if (
        returnAmount <= 0
    ) {

        alert(
            "Enter a valid return amount."
        );

        return;

    }


    if (
        returnAmount > grandTotal
    ) {

        alert(
            "Return amount cannot be greater than Grand Total."
        );

        return;

    }


    const confirmReturn =
        confirm(
            `Confirm return?\n\nBill: ${billNo}\nReturn: ₹ ${formatMoney(returnAmount)}`
        );


    if (
        !confirmReturn
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/bills/${encodeURIComponent(
                    getBillId(bill)
                )}`,
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
                `HTTP ${response.status}: ${text}`
            );

        }


        alert(
            "Return saved successfully."
        );


        await loadBills();

    }

    catch (error) {

        console.error(
            "RETURN ERROR:",
            error
        );


        alert(
            "Return update failed.\n\n" +
            error.message
        );

    }

}


// =====================================================
// DOWNLOAD / PRINT PDF
// =====================================================

async function downloadBillPDF(
    billId
) {

    console.log(
        "Preparing PDF for:",
        billId
    );


    try {

        // =================================================
        // GET EXACT BILL FROM DATABASE
        // =================================================

        const response =
            await fetch(
                `${API_URL}/bill/${encodeURIComponent(
                    billId
                )}`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    cache: "no-store"

                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                `Bill API HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "EXACT BILL RESPONSE:",
            result
        );


        const bill =
            result.bill ||
            result.data ||
            result;


        if (
            !bill
        ) {

            throw new Error(
                "Bill data not found."
            );

        }


        console.log(
            "EXACT BILL:",
            bill
        );


        // =================================================
        // EXACT CUSTOMER VALUES
        // =================================================

        const customerName =
            getCustomerName(
                bill
            );


        const customerMobile =
            getCustomerMobile(
                bill
            );


        const customerPlace =
            getCustomerPlace(
                bill
            );


        // =================================================
        // BILL VALUES
        // =================================================

        const billNo =
            bill.bill_no ||
            `BILL-${billId}`;


        const billDate =
            formatDate(
                bill.bill_date
            );


        const billTime =
            bill.bill_time ||
            "-";


        const customerId =
            bill.customer_id ||
            "-";


        const paymentType =
            getPaymentType(
                bill
            );


        const paymentMode =
            getPaymentMode(
                bill
            );


        // =================================================
        // TOTALS
        // =================================================

        const totalCFT =
            money(
                bill.total_cft
            );


        const woodTotal =
            money(
                bill.wood_total
            );


        const labourCharge =
            money(
                bill.labour_charge
            );


        const otherCharge =
            money(
                bill.other_charge
            );


        const othersTotal =
            money(
                bill.others_total
            );


        const discount =
            getDiscount(
                bill
            );


        const grandTotal =
            money(
                bill.grand_total
            );


        const advance =
            money(
                bill.advance_amount
            );


        const balance =
            money(
                bill.balance_amount
            );


        const returnAmount =
            money(
                bill.return_amount
            );


        // =================================================
        // JSON DATA
        // =================================================

        const woodData =
            getWoodData(
                bill
            );


        const othersData =
            getOthersData(
                bill
            );


        console.log(
            "CUSTOMER NAME:",
            customerName
        );

        console.log(
            "CUSTOMER MOBILE:",
            customerMobile
        );

        console.log(
            "CUSTOMER PLACE:",
            customerPlace
        );

        console.log(
            "WOOD DATA:",
            woodData
        );

        console.log(
            "OTHERS DATA:",
            othersData
        );


        // =================================================
        // BUILD WOOD TABLE
        // =================================================

        let woodRows = "";


        if (
            Array.isArray(
                woodData
            ) &&
            woodData.length > 0
        ) {

            woodData.forEach(
                function (
                    item,
                    index
                ) {

                    let woodType =
                        item.woodType ||
                        item.wood_type ||
                        "-";


                    if (
                        String(woodType)
                            .toLowerCase() ===
                        "other"
                    ) {

                        woodType =
                            item.otherWood ||
                            item.other_wood ||
                            "Other";

                    }


                    const breadth =
                        item.breadth ??
                        item.breadthInch ??
                        item.breadth_inch ??
                        "-";


                    const thickness =
                        item.thickness ??
                        item.thicknessInch ??
                        item.thickness_inch ??
                        "-";


                    const cubicFeet =
                        money(
                            item.cubicFeet ??
                            item.cubic_feet ??
                            item.cft ??
                            0
                        );


                    const amount =
                        money(
                            item.amount ??
                            item.totalAmount ??
                            item.total_amount ??
                            0
                        );


                    // -------------------------------------
                    // LENGTH DATA
                    // -------------------------------------

                    let lengthText = "-";


                    if (
                        Array.isArray(
                            item.lengths
                        )
                    ) {

                        const parts =
                            item.lengths.map(
                                function (
                                    lengthItem
                                ) {

                                    const length =
                                        numberValue(
                                            lengthItem.length ??
                                            lengthItem.feet ??
                                            0
                                        );


                                    const extra =
                                        numberValue(
                                            lengthItem.extraLength ??
                                            lengthItem.extra_length ??
                                            0
                                        );


                                    const qty =
                                        numberValue(
                                            lengthItem.qty ??
                                            lengthItem.quantity ??
                                            0
                                        );


                                    const finalLength =
                                        length +
                                        extra;


                                    return (
                                        `${formatMoney(
                                            finalLength
                                        )} ft × ${qty}`
                                    );

                                }
                            );


                        if (
                            parts.length
                        ) {

                            lengthText =
                                parts.join(
                                    "<br>"
                                );

                        }

                    }


                    else if (
                        item.length !==
                        undefined
                    ) {

                        const length =
                            numberValue(
                                item.length
                            );


                        const extra =
                            numberValue(
                                item.extraLength ??
                                item.extra_length ??
                                0
                            );


                        const qty =
                            numberValue(
                                item.qty ??
                                item.quantity ??
                                0
                            );


                        lengthText =
                            `${formatMoney(
                                length + extra
                            )} ft × ${qty}`;

                    }


                    woodRows += `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${escapeHtml(
                                    woodType
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    String(breadth)
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    String(thickness)
                                )}
                            </td>

                            <td>
                                ${lengthText}
                            </td>

                            <td>
                                ${formatMoney(
                                    cubicFeet
                                )}
                            </td>

                            <td>
                                ₹ ${formatMoney(
                                    amount
                                )}
                            </td>

                        </tr>

                    `;

                }
            );

        }

        else {

            woodRows = `

                <tr>

                    <td colspan="7">
                        No wood details
                    </td>

                </tr>

            `;

        }


        // =================================================
        // OTHER CHARGES TABLE
        // =================================================

        let otherRows = "";


        // Main other charge

        if (
            otherCharge > 0
        ) {

            otherRows += `

                <tr>

                    <td>
                        Other Charge
                    </td>

                    <td class="right">
                        ₹ ${formatMoney(
                            otherCharge
                        )}
                    </td>

                </tr>

            `;

        }


        // Additional charges

        if (
            Array.isArray(
                othersData
            )
        ) {

            othersData.forEach(
                function (
                    item
                ) {

                    const name =
                        item.name ||
                        item.title ||
                        item.description ||
                        "Other";


                    const amount =
                        money(
                            item.amount
                        );


                    otherRows += `

                        <tr>

                            <td>
                                ${escapeHtml(
                                    name
                                )}
                            </td>

                            <td class="right">
                                ₹ ${formatMoney(
                                    amount
                                )}
                            </td>

                        </tr>

                    `;

                }
            );

        }


        if (
            otherRows === ""
        ) {

            otherRows = `

                <tr>

                    <td>
                        No Other Charges
                    </td>

                    <td class="right">
                        ₹ 0.00
                    </td>

                </tr>

            `;

        }


        // =================================================
        // RETURN ROW
        // =================================================

        let returnRow = "";


        if (
            returnAmount > 0
        ) {

            returnRow = `

                <tr class="returnRow">

                    <td>
                        Return Amount
                    </td>

                    <td class="right">
                        ₹ ${formatMoney(
                            returnAmount
                        )}
                    </td>

                </tr>

            `;

        }


        // =================================================
        // DISCOUNT ROW
        // =================================================

        let discountRow = "";


        if (
            discount > 0
        ) {

            discountRow = `

                <tr>

                    <td>
                        Discount
                    </td>

                    <td class="right discount">
                        - ₹ ${formatMoney(
                            discount
                        )}
                    </td>

                </tr>

            `;

        }


        // =================================================
        // STATUS
        // =================================================

        const status =
            getStatusText(
                bill
            );


        // =================================================
        // PRINT WINDOW
        // =================================================

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=1000,height=800"
            );


        if (
            !printWindow
        ) {

            alert(
                "Popup blocked. Please allow popups for this website."
            );

            return;

        }


        // =================================================
        // COMPLETE BILL
        // =================================================

        const html = `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<title>
${escapeHtml(billNo)}.pdf
</title>


<style>

* {
    box-sizing: border-box;
}


body {

    margin: 0;

    padding: 20px;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    color: #111;

    background: white;

}


.bill {

    width: 100%;

    max-width: 900px;

    margin: auto;

}


.header {

    text-align: center;

    border-bottom: 2px solid #111;

    padding-bottom: 12px;

}


.header h1 {

    margin: 0;

    font-size: 28px;

}


.header p {

    margin: 5px 0;

}


.billNumber {

    text-align: center;

    font-size: 18px;

    font-weight: bold;

    margin: 15px 0;

}


.customer {

    border: 1px solid #333;

    margin-top: 15px;

}


.customerTitle {

    background: #f1f1f1;

    padding: 8px;

    font-weight: bold;

    border-bottom: 1px solid #333;

}


.customerGrid {

    display: grid;

    grid-template-columns:
        1fr 1fr;

}


.customerItem {

    padding: 9px;

    border-bottom: 1px solid #ddd;

}


.customerItem:nth-child(odd) {

    border-right: 1px solid #ddd;

}


.label {

    font-weight: bold;

}


.sectionTitle {

    margin-top: 22px;

    margin-bottom: 8px;

    font-size: 18px;

    font-weight: bold;

}


table {

    width: 100%;

    border-collapse: collapse;

}


th,
td {

    border: 1px solid #333;

    padding: 8px;

    font-size: 12px;

    vertical-align: top;

}


th {

    background: #eeeeee;

}


.right {

    text-align: right;

}


.summary {

    width: 420px;

    margin-left: auto;

    margin-top: 20px;

}


.summary td {

    font-size: 14px;

}


.summary .grand {

    font-size: 18px;

    font-weight: bold;

}


.discount {

    color: #b91c1c;

}


.returnRow {

    color: #a16207;

    font-weight: bold;

}


.footer {

    margin-top: 35px;

    text-align: center;

    font-size: 13px;

}


@media print {

    body {

        padding: 0;

    }


    .bill {

        width: 100%;

    }

}

</style>

</head>


<body>


<div class="bill">


    <!-- =================================
         SHOP HEADER
    ================================== -->

    <div class="header">

        <h1>
            ஸ்ரீ அம்மன் சாமில்
        </h1>

        <p>
            தேக்கு, வேம்பு, பூவரசு வியாபாரம்
        </p>

        <p>
            Mobile : 9443076409 , 9715050908
        </p>

        <p>
            GST : 33DLKPK5760D1Z5
        </p>

    </div>


    <!-- =================================
         BILL NUMBER
    ================================== -->

    <div class="billNumber">

        BILL NO:
        ${escapeHtml(billNo)}

    </div>


    <!-- =================================
         CUSTOMER
    ================================== -->

    <div class="customer">


        <div class="customerTitle">

            Customer Information

        </div>


        <div class="customerGrid">


            <div class="customerItem">

                <span class="label">
                    Customer Name:
                </span>

                ${escapeHtml(
                    customerName || "-"
                )}

            </div>


            <div class="customerItem">

                <span class="label">
                    Mobile:
                </span>

                ${escapeHtml(
                    customerMobile || "-"
                )}

            </div>


            <div class="customerItem">

                <span class="label">
                    Place:
                </span>

                ${escapeHtml(
                    customerPlace || "-"
                )}

            </div>


            <div class="customerItem">

                <span class="label">
                    Customer ID:
                </span>

                ${escapeHtml(
                    customerId
                )}

            </div>


            <div class="customerItem">

                <span class="label">
                    Date:
                </span>

                ${escapeHtml(
                    billDate
                )}

            </div>


            <div class="customerItem">

                <span class="label">
                    Time:
                </span>

                ${escapeHtml(
                    String(billTime)
                )}

            </div>


            <div class="customerItem">

                <span class="label">
                    Payment Type:
                </span>

                ${escapeHtml(
                    paymentType
                )}

            </div>


            <div class="customerItem">

                <span class="label">
                    Payment Mode:
                </span>

                ${escapeHtml(
                    paymentMode
                )}

            </div>


            <div class="customerItem">

                <span class="label">
                    Status:
                </span>

                ${escapeHtml(
                    status
                )}

            </div>


        </div>

    </div>


    <!-- =================================
         WOOD DETAILS
    ================================== -->

    <div class="sectionTitle">

        Wood Details

    </div>


    <table>

        <thead>

            <tr>

                <th>
                    S.No
                </th>

                <th>
                    Wood Type
                </th>

                <th>
                    Breadth
                </th>

                <th>
                    Thickness
                </th>

                <th>
                    Length / Qty
                </th>

                <th>
                    CFT
                </th>

                <th>
                    Amount
                </th>

            </tr>

        </thead>


        <tbody>

            ${woodRows}

        </tbody>

    </table>


    <!-- =================================
         WOOD SUMMARY
    ================================== -->

    <div class="sectionTitle">

        Wood Summary

    </div>


    <table>

        <tr>

            <td>
                Total CFT
            </td>

            <td class="right">
                ${formatMoney(totalCFT)}
            </td>

        </tr>


        <tr>

            <td>
                Wood Total
            </td>

            <td class="right">
                ₹ ${formatMoney(woodTotal)}
            </td>

        </tr>

    </table>


    <!-- =================================
         LABOUR
    ================================== -->

    <div class="sectionTitle">

        Labour & Other Charges

    </div>


    <table>

        <tr>

            <td>
                Labour Charge
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    labourCharge
                )}
            </td>

        </tr>


        ${otherRows}


        <tr>

            <td>
                Other Charges Total
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    othersTotal
                )}
            </td>

        </tr>

    </table>


    <!-- =================================
         FINAL SUMMARY
    ================================== -->

    <div class="sectionTitle">

        Payment Summary

    </div>


    <table class="summary">


        <tr>

            <td>
                Wood Total
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    woodTotal
                )}
            </td>

        </tr>


        <tr>

            <td>
                Labour Charge
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    labourCharge
                )}
            </td>

        </tr>


        <tr>

            <td>
                Other Charge
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    otherCharge
                )}
            </td>

        </tr>


        <tr>

            <td>
                Additional Others
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    othersTotal
                )}
            </td>

        </tr>


        ${discountRow}


        <tr class="grand">

            <td>
                Grand Total
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    grandTotal
                )}
            </td>

        </tr>


        <tr>

            <td>
                Advance
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    advance
                )}
            </td>

        </tr>


        <tr>

            <td>
                Balance
            </td>

            <td class="right">
                ₹ ${formatMoney(
                    balance
                )}
            </td>

        </tr>


        ${returnRow}


    </table>


    <!-- =================================
         FOOTER
    ================================== -->

    <div class="footer">

        Thank You

    </div>


</div>


<script>

window.onload = function () {

    setTimeout(
        function () {

            window.print();

        },
        500
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


        console.log(
            "PDF/PRINT READY:",
            billNo
        );

    }

    catch (error) {

        console.error(
            "PDF ERROR:",
            error
        );


        alert(
            "Unable to create bill PDF.\n\n" +
            error.message
        );

    }

}


// =====================================================
// SEARCH
// =====================================================

if (
    searchBtn
) {

    searchBtn.addEventListener(
        "click",
        applyFilters
    );

}


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
// FILTER
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
        loadBills
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
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBills();

    }
);
