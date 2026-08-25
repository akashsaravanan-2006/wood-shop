/* =========================================================
   AMMAN SAW MILL
   BILL HISTORY
   FULL UPDATED VERSION
   ========================================================= */

console.log("======================================");
console.log("HISTORY.JS LOADED");
console.log("HISTORY VERSION 70");
console.log("======================================");


/* =========================================================
   BACKEND
   ========================================================= */

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


/* =========================================================
   ELEMENTS
   ========================================================= */

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

const clearSearchBtn =
    document.getElementById("clearSearchBtn");

const resultCount =
    document.getElementById("resultCount");


/* =========================================================
   DATA
   ========================================================= */

let allBills = [];


/* =========================================================
   NUMBER
   ========================================================= */

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number =
        Number(
            String(value)
                .replace(/[₹,\s]/g, "")
        );

    return Number.isFinite(number)
        ? number
        : 0;
}


/* =========================================================
   MONEY
   ========================================================= */

function money(value) {

    return numberValue(value);

}


function formatMoney(value) {

    return money(value).toFixed(2);

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   PARSE JSON
   ========================================================= */

function parseJSON(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "object") {
        return value;
    }

    if (typeof value === "string") {

        try {

            return JSON.parse(value);

        } catch (error) {

            console.error(
                "JSON PARSE ERROR:",
                error
            );

            return [];

        }

    }

    return [];

}


/* =========================================================
   BILL ID
   ========================================================= */

function getBillId(bill) {

    return (
        bill?.id ??
        bill?.bill_id ??
        bill?.billId ??
        bill?._id ??
        ""
    );

}


/* =========================================================
   BILL NUMBER
   ========================================================= */

function getBillNumber(bill) {

    return (
        bill?.bill_no ??
        bill?.billNo ??
        `BILL-${getBillId(bill)}`
    );

}


/* =========================================================
   CUSTOMER NAME
   ========================================================= */

function getCustomerName(bill) {

    return (
        bill?.customer_name ??
        bill?.customerName ??
        bill?.customer ??
        "-"
    );

}


/* =========================================================
   CUSTOMER MOBILE
   ========================================================= */

function getCustomerMobile(bill) {

    return (
        bill?.customer_mobile ??
        bill?.customerMobile ??
        bill?.mobile ??
        "-"
    );

}


/* =========================================================
   CUSTOMER PLACE
   ========================================================= */

function getCustomerPlace(bill) {

    return (
        bill?.customer_place ??
        bill?.customerPlace ??
        bill?.place ??
        "-"
    );

}


/* =========================================================
   PAYMENT TYPE
   ========================================================= */

function getPaymentType(bill) {

    return String(
        bill?.payment_type ??
        bill?.paymentType ??
        "-"
    )
        .trim()
        .toUpperCase();

}


/* =========================================================
   PAYMENT MODE
   ========================================================= */

function getPaymentMode(bill) {

    const mode =
        String(
            bill?.payment_mode ??
            bill?.paymentMode ??
            ""
        )
            .trim()
            .toLowerCase();

    if (mode === "upi") {
        return "UPI";
    }

    if (mode === "cash") {
        return "CASH";
    }

    return "-";

}


/* =========================================================
   RETURN AMOUNT
   ========================================================= */

function getReturnAmount(bill) {

    return money(
        bill?.return_amount ??
        bill?.returnAmount ??
        0
    );

}


/* =========================================================
   STATUS
   ========================================================= */

function getStatus(bill) {

    const returnAmount =
        getReturnAmount(bill);

    const databaseStatus =
        String(
            bill?.status ??
            bill?.bill_status ??
            ""
        )
            .trim()
            .toLowerCase();


    /*
       RETURN HAS HIGHEST PRIORITY
    */

    if (
        returnAmount > 0 ||
        databaseStatus === "return" ||
        databaseStatus === "returned"
    ) {

        return "return";

    }


    /*
       BALANCE > 0 = PENDING
    */

    const balance =
        money(
            bill?.balance_amount ??
            bill?.balance ??
            0
        );

    if (balance > 0) {

        return "pending";

    }


    /*
       BALANCE = 0 = DELIVERED
    */

    return "finished";

}


/* =========================================================
   STATUS TEXT
   ========================================================= */

function getStatusText(bill) {

    const status =
        getStatus(bill);

    if (status === "pending") {
        return "PENDING";
    }

    if (status === "return") {
        return "RETURN";
    }

    return "DELIVERED";

}


/* =========================================================
   DATE
   ========================================================= */

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

    return date.toLocaleDateString("en-IN");

}


/* =========================================================
   WOOD DATA
   ========================================================= */

function getWoodData(bill) {

    let data =
        bill?.wood_data ??
        bill?.woodData ??
        bill?.wood ??
        [];

    data =
        parseJSON(data);

    if (Array.isArray(data)) {
        return data;
    }

    return [];

}


/* =========================================================
   OTHER DATA
   ========================================================= */

function getOthersData(bill) {

    let data =
        bill?.others_data ??
        bill?.othersData ??
        bill?.other_data ??
        bill?.charges ??
        bill?.additional_charges ??
        [];

    data =
        parseJSON(data);

    if (Array.isArray(data)) {
        return data;
    }

    return [];

}


/* =========================================================
   WOOD NAME
   ========================================================= */

function getWoodName(item) {

    let name =
        item?.woodType ||
        item?.wood ||
        item?.woodName ||
        "-";

    if (
        String(name)
            .toLowerCase() === "other"
    ) {

        name =
            item?.otherWood ||
            "Other";

    }

    return name;

}


/* =========================================================
   WOOD SIZE
   ========================================================= */

function getWoodSize(item) {

    const breadth =
        numberValue(
            item?.breadth
        );

    const thickness =
        numberValue(
            item?.thickness
        );


    if (
        breadth > 0 &&
        thickness > 0
    ) {

        return `${breadth} × ${thickness}`;

    }


    if (breadth > 0) {
        return String(breadth);
    }


    if (thickness > 0) {
        return String(thickness);
    }


    return "-";

}


/* =========================================================
   LENGTH + QTY
   ========================================================= */

function getLengthQty(item) {

    const result = [];

    const pieces =
        Array.isArray(item?.pieces)
            ? item.pieces
            : [];


    pieces.forEach(
        function(piece) {

            if (!piece) {
                return;
            }

            const length =
                numberValue(
                    piece.length
                );

            const extraLength =
                numberValue(
                    piece.extraLength
                );

            const qty =
                numberValue(
                    piece.qty
                );

            const finalLength =
                length +
                extraLength;


            if (finalLength > 0) {

                result.push(
                    `${finalLength} → ${qty}`
                );

            }

        }
    );


    if (
        result.length === 0 &&
        item?.length !== undefined
    ) {

        result.push(
            `${numberValue(item.length)} → ${numberValue(item.qty)}`
        );

    }


    return result.length
        ? result.join("<br>")
        : "-";

}


/* =========================================================
   DISCOUNT
   ========================================================= */

function getDiscount(bill) {

    return money(
        bill?.discount_amount ??
        bill?.discountAmount ??
        bill?.discount ??
        0
    );

}


/* =========================================================
   RESULT COUNT
   ========================================================= */

function updateResultCount(count) {

    if (!resultCount) {
        return;
    }

    resultCount.textContent =
        `${count} ${count === 1 ? "bill" : "bills"}`;

}


/* =========================================================
   LOAD BILLS
   ========================================================= */

async function loadBills() {

    console.log(
        "Loading bill history..."
    );


    if (historyBody) {

        historyBody.innerHTML = `
            <tr>
                <td colspan="15" class="noData">
                    Loading bill history...
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


        if (Array.isArray(data)) {

            allBills = data;

        }
        else if (
            data &&
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
                "Bills array not found in API response."
            );

        }


        updateSummary();
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
                    <td colspan="15" class="noData">
                        ❌ Unable to load bill history
                    </td>
                </tr>
            `;

        }

    }

}


/* =========================================================
   DISPLAY BILLS
   ========================================================= */

function displayBills(bills) {

    if (!historyBody) {
        return;
    }


    historyBody.innerHTML = "";


    updateResultCount(
        Array.isArray(bills)
            ? bills.length
            : 0
    );


    if (
        !Array.isArray(bills) ||
        bills.length === 0
    ) {

        historyBody.innerHTML = `
            <tr>
                <td colspan="15" class="noData">
                    No bills found
                </td>
            </tr>
        `;

        return;

    }


    bills.forEach(
        function(bill, index) {

            const billId =
                getBillId(bill);

            const status =
                getStatus(bill);

            const customerName =
                getCustomerName(bill);

            const customerMobile =
                getCustomerMobile(bill);

            const customerPlace =
                getCustomerPlace(bill);

            const paymentType =
                getPaymentType(bill);

            const paymentMode =
                getPaymentMode(bill);

            const grandTotal =
                money(
                    bill?.grand_total ??
                    bill?.grandTotal
                );

            const advance =
                money(
                    bill?.advance_amount ??
                    bill?.advance
                );

            const balance =
                money(
                    bill?.balance_amount ??
                    bill?.balance
                );

            const returnAmount =
                getReturnAmount(bill);


            const row =
                document.createElement("tr");


            /*
               STATUS ROW COLOUR
            */

            if (status === "pending") {

                row.className =
                    "pendingRow";

            }
            else if (status === "return") {

                row.className =
                    "returnRow";

            }
            else {

                row.className =
                    "finishedRow";

            }


            /* =================================================
               PAYMENT TYPE
               ================================================= */

            const paymentTypeHTML = `
                <span class="payment-type">
                    ${escapeHtml(paymentType)}
                </span>
            `;


            /* =================================================
               PAYMENT MODE
               ================================================= */

            let paymentModeHTML = `
                <span class="payment-pill paymentNone">
                    -
                </span>
            `;


            if (paymentMode === "CASH") {

                paymentModeHTML = `
                    <span class="payment-pill paymentCash">
                        CASH
                    </span>
                `;

            }


            if (paymentMode === "UPI") {

                paymentModeHTML = `
                    <span class="payment-pill paymentUpi">
                        UPI
                    </span>
                `;

            }


            /* =================================================
               RETURN
               ================================================= */

            let returnHTML = `
                <span class="noReturn">
                    -
                </span>
            `;


            if (returnAmount > 0) {

                returnHTML = `
                    <span class="returnAmount">
                        ₹ ${formatMoney(returnAmount)}
                    </span>
                `;

            }


            /* =================================================
               RETURN BUTTON
               ================================================= */

            let returnButtonHTML = "";


            if (status === "return") {

                returnButtonHTML = `
                    <button
                        type="button"
                        class="returnBtn returnedBtn"
                        disabled
                    >
                        Returned
                    </button>
                `;

            }
            else {

                returnButtonHTML = `
                    <button
                        type="button"
                        class="returnBtn"
                        data-bill-id="${escapeHtml(billId)}"
                    >
                        Return
                    </button>
                `;

            }


            /* =================================================
               PDF BUTTON
               ================================================= */

            const pdfButtonHTML = `
                <button
                    type="button"
                    class="pdfBtn"
                    data-bill-id="${escapeHtml(billId)}"
                >
                    PDF
                </button>
            `;


            /* =================================================
               ROW
               ================================================= */

            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <span class="bill-number">
                        ${escapeHtml(getBillNumber(bill))}
                    </span>
                </td>

                <td>
                    ${escapeHtml(
                        bill?.customer_id ??
                        bill?.customerId ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(customerName)}
                </td>

                <td>
                    ${escapeHtml(customerMobile)}
                </td>

                <td>
                    ${escapeHtml(customerPlace)}
                </td>

                <td>
                    ${formatDate(
                        bill?.bill_date ??
                        bill?.billDate ??
                        bill?.date
                    )}
                </td>

                <td>
                    ${paymentTypeHTML}
                </td>

                <td>
                    ${paymentModeHTML}
                </td>

                <td>
                    ₹ ${formatMoney(grandTotal)}
                </td>

                <td>
                    ₹ ${formatMoney(advance)}
                </td>

                <td>
                    ₹ ${formatMoney(balance)}
                </td>

                <td>
                    ${returnHTML}
                </td>

                <td>
                    <span class="status ${status}">
                        ${getStatusText(bill)}
                    </span>
                </td>

                <td>
                    <div class="actions">
                        ${pdfButtonHTML}
                        ${returnButtonHTML}
                    </div>
                </td>

            `;


            historyBody.appendChild(row);

        }
    );


    attachActionEvents();

}


/* =========================================================
   SUMMARY
   ========================================================= */

function updateSummary() {

    let pending = 0;
    let finished = 0;
    let returned = 0;


    allBills.forEach(
        function(bill) {

            const status =
                getStatus(bill);


            if (status === "pending") {

                pending++;

            }
            else if (status === "return") {

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


/* =========================================================
   FILTER
   ========================================================= */

function applyFilters() {

    const search =
        String(
            searchInput?.value || ""
        )
            .trim()
            .toLowerCase();


    const selectedStatus =
        String(
            statusFilter?.value || "all"
        )
            .toLowerCase();


    let filtered =
        [...allBills];


    if (search) {

        filtered =
            filtered.filter(
                function(bill) {

                    const searchableText = [

                        bill?.bill_no,

                        bill?.billNo,

                        bill?.customer_id,

                        bill?.customerId,

                        getCustomerName(bill),

                        getCustomerMobile(bill),

                        getCustomerPlace(bill),

                        getPaymentType(bill),

                        getPaymentMode(bill),

                        getStatusText(bill)

                    ]
                        .map(
                            value =>
                                String(
                                    value ?? ""
                                ).toLowerCase()
                        )
                        .join(" ");


                    return searchableText
                        .includes(search);

                }
            );

    }


    if (selectedStatus !== "all") {

        filtered =
            filtered.filter(
                function(bill) {

                    return (
                        getStatus(bill) ===
                        selectedStatus
                    );

                }
            );

    }


    displayBills(filtered);


    if (clearSearchBtn) {

        clearSearchBtn.classList.toggle(
            "visible",
            search !== ""
        );

    }

}


/* =========================================================
   LOAD HTML2PDF
   ========================================================= */

function loadHtml2Pdf() {

    return new Promise(
        function(resolve, reject) {

            if (
                typeof window.html2pdf !==
                "undefined"
            ) {

                resolve();
                return;

            }


            const script =
                document.createElement("script");


            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";


            script.onload =
                function() {

                    if (
                        typeof window.html2pdf ===
                        "undefined"
                    ) {

                        reject(
                            new Error(
                                "html2pdf library loaded but is unavailable."
                            )
                        );

                        return;

                    }

                    resolve();

                };


            script.onerror =
                function() {

                    reject(
                        new Error(
                            "Unable to load PDF library. Check internet connection or CDN access."
                        )
                    );

                };


            document.head.appendChild(script);

        }
    );

}


/* =========================================================
   PDF WOOD ROWS
   ========================================================= */

function buildPdfWoodRows(woodData) {

    if (
        !Array.isArray(woodData) ||
        woodData.length === 0
    ) {

        return `
            <tr>
                <td
                    colspan="9"
                    style="
                        border:1px solid #ddd;
                        padding:8px;
                        text-align:center;
                    "
                >
                    No wood details
                </td>
            </tr>
        `;

    }


    let rows = "";


    woodData.forEach(
        function(item, index) {

            const woodName =
                getWoodName(item);

            const size =
                getWoodSize(item);

            const lengthQty =
                getLengthQty(item);

            const pieces =
                Array.isArray(item?.pieces)
                    ? item.pieces
                    : [];


            let qty = 0;


            pieces.forEach(
                function(piece) {

                    qty +=
                        numberValue(
                            piece?.qty
                        );

                }
            );


            if (qty === 0) {

                qty =
                    numberValue(
                        item?.qty
                    );

            }


            const cft =
                numberValue(
                    item?.cubicFeet ??
                    item?.cft
                );


            const rate =
                numberValue(
                    item?.rate
                );


            const amount =
                numberValue(
                    item?.amount
                );


            const quality =
                item?.quality ??
                "-";


            rows += `

                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:center;
                    ">
                        ${index + 1}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                    ">
                        ${escapeHtml(woodName)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:center;
                    ">
                        ${escapeHtml(size)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                    ">
                        ${lengthQty}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:center;
                    ">
                        ${qty}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:center;
                    ">
                        ${cft.toFixed(2)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:right;
                    ">
                        ₹ ${formatMoney(rate)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:right;
                    ">
                        ₹ ${formatMoney(amount)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                    ">
                        ${escapeHtml(quality)}
                    </td>

                </tr>

            `;

        }
    );


    return rows;

}


/* =========================================================
   PDF CHARGE ROWS
   ========================================================= */

function buildPdfChargeRows(bill) {

    const othersData =
        getOthersData(bill);


    const labourCharge =
        numberValue(
            bill?.labour_charge ??
            bill?.labourCharge
        );


    const otherCharge =
        numberValue(
            bill?.other_charge ??
            bill?.otherCharge
        );


    let rows = "";


    if (labourCharge > 0) {

        rows += `

            <tr>

                <td style="
                    border:1px solid #ddd;
                    padding:7px;
                ">
                    Labour Charge
                </td>

                <td style="
                    border:1px solid #ddd;
                    padding:7px;
                    text-align:right;
                ">
                    ₹ ${formatMoney(labourCharge)}
                </td>

            </tr>

        `;

    }


    if (otherCharge > 0) {

        rows += `

            <tr>

                <td style="
                    border:1px solid #ddd;
                    padding:7px;
                ">
                    Other Charge
                </td>

                <td style="
                    border:1px solid #ddd;
                    padding:7px;
                    text-align:right;
                ">
                    ₹ ${formatMoney(otherCharge)}
                </td>

            </tr>

        `;

    }


    othersData.forEach(
        function(item) {

            if (!item) {
                return;
            }


            const amount =
                numberValue(
                    item?.amount ??
                    item?.charge ??
                    item?.value
                );


            if (amount <= 0) {
                return;
            }


            const name =
                item?.name ||
                item?.reason ||
                item?.title ||
                item?.description ||
                "Other Charge";


            rows += `

                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                    ">
                        ${escapeHtml(name)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        text-align:right;
                    ">
                        ₹ ${formatMoney(amount)}
                    </td>

                </tr>

            `;

        }
    );


    if (rows === "") {

        rows = `

            <tr>

                <td style="
                    border:1px solid #ddd;
                    padding:7px;
                ">
                    -
                </td>

                <td style="
                    border:1px solid #ddd;
                    padding:7px;
                    text-align:right;
                ">
                    ₹ 0.00
                </td>

            </tr>

        `;

    }


    return rows;

}


/* =========================================================
   CREATE PDF HTML
   ========================================================= */

function buildBillPdfHTML(bill) {

    const billNo =
        getBillNumber(bill);


    const billDate =
        formatDate(
            bill?.bill_date ??
            bill?.billDate ??
            bill?.date
        );


    const customerId =
        bill?.customer_id ??
        bill?.customerId ??
        "-";


    const customerName =
        getCustomerName(bill);


    const customerMobile =
        getCustomerMobile(bill);


    const customerPlace =
        getCustomerPlace(bill);


    const paymentType =
        getPaymentType(bill);


    const paymentMode =
        getPaymentMode(bill);


    const status =
        getStatusText(bill);


    const woodTotal =
        numberValue(
            bill?.wood_total ??
            bill?.woodTotal
        );


    const othersTotal =
        numberValue(
            bill?.others_total ??
            bill?.othersTotal
        );


    const discount =
        getDiscount(bill);


    const originalTotal =
        numberValue(
            bill?.original_grand_total
        ) ||
        numberValue(
            bill?.grand_total ??
            bill?.grandTotal
        );


    const grandTotal =
        numberValue(
            bill?.grand_total ??
            bill?.grandTotal
        );


    const advance =
        numberValue(
            bill?.advance_amount ??
            bill?.advance
        );


    const balance =
        numberValue(
            bill?.balance_amount ??
            bill?.balance
        );


    const returnAmount =
        getReturnAmount(bill);


    const woodData =
        getWoodData(bill);


    const woodRows =
        buildPdfWoodRows(
            woodData
        );


    const chargeRows =
        buildPdfChargeRows(
            bill
        );


    return `

        <div style="
            width:100%;
            background:#ffffff;
            color:#111111;
            font-family:Arial,Helvetica,sans-serif;
            box-sizing:border-box;
        ">

            <!-- HEADER -->

            <div style="
                text-align:center;
                margin-bottom:16px;
            ">

                <div style="
                    font-size:26px;
                    font-weight:800;
                    letter-spacing:1px;
                ">
                    AMMAN SAW MILL
                </div>

                <div style="
                    margin-top:5px;
                    color:#666;
                    font-size:12px;
                ">
                    BILL
                </div>

            </div>


            <div style="
                height:2px;
                background:#222;
                margin-bottom:16px;
            "></div>


            <!-- CUSTOMER -->

            <table style="
                width:100%;
                border-collapse:collapse;
                font-size:11px;
                margin-bottom:18px;
            ">

                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Bill No
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                    ">
                        ${escapeHtml(billNo)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Date
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                    ">
                        ${escapeHtml(billDate)}
                    </td>

                </tr>


                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Customer ID
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                    ">
                        ${escapeHtml(customerId)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Customer Name
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                    ">
                        ${escapeHtml(customerName)}
                    </td>

                </tr>


                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Mobile
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                    ">
                        ${escapeHtml(customerMobile)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Place
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                    ">
                        ${escapeHtml(customerPlace)}
                    </td>

                </tr>


                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Payment Type
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        ${escapeHtml(paymentType)}
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Payment Mode
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        ${escapeHtml(paymentMode)}
                    </td>

                </tr>


                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Status
                    </td>

                    <td
                        colspan="3"
                        style="
                            border:1px solid #ddd;
                            padding:7px;
                            font-weight:bold;
                        "
                    >
                        ${escapeHtml(status)}
                    </td>

                </tr>

            </table>


            <!-- WOOD DETAILS -->

            <h3 style="
                font-size:14px;
                margin:0 0 8px;
            ">
                Wood Details
            </h3>


            <table style="
                width:100%;
                border-collapse:collapse;
                font-size:9px;
                margin-bottom:18px;
            ">

                <thead>

                    <tr style="
                        background:#f1f3f5;
                    ">

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            S.No
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            Wood
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            Size
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            Length → Qty
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            Qty
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            CFT
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            Rate
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            Amount
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:5px;
                        ">
                            Quality
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${woodRows}

                </tbody>

            </table>


            <!-- OTHER CHARGES -->

            <h3 style="
                font-size:14px;
                margin:0 0 8px;
            ">
                Other Charges
            </h3>


            <table style="
                width:100%;
                border-collapse:collapse;
                font-size:10px;
                margin-bottom:18px;
            ">

                <thead>

                    <tr style="
                        background:#f1f3f5;
                    ">

                        <th style="
                            border:1px solid #333;
                            padding:6px;
                            text-align:left;
                        ">
                            Charge
                        </th>

                        <th style="
                            border:1px solid #333;
                            padding:6px;
                            text-align:right;
                        ">
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${chargeRows}

                </tbody>

            </table>


            <!-- TOTALS -->

            <table style="
                width:52%;
                margin-left:auto;
                border-collapse:collapse;
                font-size:10px;
            ">

                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                    ">
                        Wood Total
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:right;
                    ">
                        ₹ ${formatMoney(woodTotal)}
                    </td>

                </tr>


                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                    ">
                        Others Total
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:right;
                    ">
                        ₹ ${formatMoney(othersTotal)}
                    </td>

                </tr>


                ${
                    discount > 0
                        ? `

                            <tr>

                                <td style="
                                    border:1px solid #ddd;
                                    padding:6px;
                                ">
                                    Discount
                                </td>

                                <td style="
                                    border:1px solid #ddd;
                                    padding:6px;
                                    text-align:right;
                                ">
                                    ₹ ${formatMoney(discount)}
                                </td>

                            </tr>

                        `
                        : ""
                }


                <tr>

                    <td style="
                        border:1px solid #222;
                        padding:7px;
                        font-weight:bold;
                    ">
                        Original Total
                    </td>

                    <td style="
                        border:1px solid #222;
                        padding:7px;
                        text-align:right;
                        font-weight:bold;
                    ">
                        ₹ ${formatMoney(originalTotal)}
                    </td>

                </tr>


                ${
                    returnAmount > 0
                        ? `

                            <tr>

                                <td style="
                                    border:1px solid #ddd;
                                    padding:7px;
                                ">
                                    Return
                                </td>

                                <td style="
                                    border:1px solid #ddd;
                                    padding:7px;
                                    text-align:right;
                                ">
                                    ₹ ${formatMoney(returnAmount)}
                                </td>

                            </tr>

                        `
                        : ""
                }


                <tr>

                    <td style="
                        border:2px solid #222;
                        padding:9px;
                        font-size:13px;
                        font-weight:bold;
                    ">
                        Grand Total
                    </td>

                    <td style="
                        border:2px solid #222;
                        padding:9px;
                        text-align:right;
                        font-size:13px;
                        font-weight:bold;
                    ">
                        ₹ ${formatMoney(grandTotal)}
                    </td>

                </tr>


                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                    ">
                        Advance / Paid
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:right;
                    ">
                        ₹ ${formatMoney(advance)}
                    </td>

                </tr>


                <tr>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                    ">
                        Balance
                    </td>

                    <td style="
                        border:1px solid #ddd;
                        padding:6px;
                        text-align:right;
                    ">
                        ₹ ${formatMoney(balance)}
                    </td>

                </tr>

            </table>


            ${
                bill?.remark
                    ? `

                        <div style="
                            margin-top:18px;
                            border-top:1px solid #ddd;
                            padding-top:8px;
                            font-size:10px;
                        ">

                            <b>Remark:</b>

                            ${escapeHtml(bill.remark)}

                        </div>

                    `
                    : ""
            }


            <div style="
                margin-top:25px;
                padding-top:10px;
                border-top:1px solid #ddd;
                text-align:center;
                color:#666;
                font-size:9px;
            ">
                Thank you for your business
            </div>

        </div>

    `;

}


/* =========================================================
   OPEN BILL PDF
   =========================================================

   IMPORTANT:

   1. No download
   2. No new tab
   3. Opens in SAME TAB
   4. Browser Back returns to history
   ========================================================= */

async function downloadBillPDF(
    billId,
    button = null
) {

    let pdfContainer = null;

    const originalButtonText =
        button
            ? button.textContent
            : "PDF";


    try {

        console.log(
            "PDF START:",
            billId
        );


        /* =====================================================
           FIND BILL
           ===================================================== */

        const bill =
            allBills.find(
                function(item) {

                    return String(
                        getBillId(item)
                    ) ===
                    String(billId);

                }
            );


        if (!bill) {

            throw new Error(
                "Bill not found in loaded history."
            );

        }


        /* =====================================================
           LOAD PDF LIBRARY
           ===================================================== */

        await loadHtml2Pdf();


        if (
            typeof window.html2pdf ===
            "undefined"
        ) {

            throw new Error(
                "PDF library is not available."
            );

        }


        /* =====================================================
           BUTTON
           ===================================================== */

        if (button) {

            button.disabled = true;
            button.textContent = "Opening...";

        }


        /* =====================================================
           PDF CONTAINER
           ===================================================== */

        pdfContainer =
            document.createElement("div");


        /*
           IMPORTANT

           Do NOT use display:none.

           html2canvas needs to see
           the element.
        */

        pdfContainer.style.position =
            "fixed";

        pdfContainer.style.left =
            "-10000px";

        pdfContainer.style.top =
            "0";

        pdfContainer.style.width =
            "794px";

        pdfContainer.style.minHeight =
            "1123px";

        pdfContainer.style.padding =
            "28px";

        pdfContainer.style.background =
            "#ffffff";

        pdfContainer.style.color =
            "#111111";

        pdfContainer.style.fontFamily =
            "Arial, Helvetica, sans-serif";

        pdfContainer.style.boxSizing =
            "border-box";

        pdfContainer.style.zIndex =
            "999999";


        /* =====================================================
           BILL HTML
           ===================================================== */

        pdfContainer.innerHTML =
            buildBillPdfHTML(bill);


        document.body.appendChild(
            pdfContainer
        );


        /* =====================================================
           WAIT FOR RENDER
           ===================================================== */

        await new Promise(
            function(resolve) {

                requestAnimationFrame(
                    function() {

                        requestAnimationFrame(
                            function() {

                                setTimeout(
                                    resolve,
                                    500
                                );

                            }
                        );

                    }
                );

            }
        );


        /* =====================================================
           FILE NAME
           ===================================================== */

        const billNo =
            getBillNumber(bill);


        const safeFileName =
            String(billNo)
                .replace(
                    /[<>:"/\\|?*]+/g,
                    "_"
                )
                .trim();


        /* =====================================================
           PDF OPTIONS
           ===================================================== */

        const options = {

            margin: 8,

            filename:
                `${safeFileName}.pdf`,

            image: {

                type: "jpeg",

                quality: 0.98

            },

            html2canvas: {

                scale: 2,

                useCORS: true,

                allowTaint: false,

                backgroundColor:
                    "#ffffff",

                logging: false,

                scrollX: 0,

                scrollY: 0,

                windowWidth: 794

            },

            jsPDF: {

                unit: "mm",

                format: "a4",

                orientation:
                    "portrait",

                compress: true

            },

            pagebreak: {

                mode: [
                    "css",
                    "legacy"
                ]

            }

        };


        /* =====================================================
           GENERATE PDF BLOB
           ===================================================== */

        console.log(
            "Generating PDF..."
        );


        const pdfBlob =
            await window.html2pdf()
                .set(options)
                .from(pdfContainer)
                .outputPdf("blob");


        console.log(
            "PDF SIZE:",
            pdfBlob?.size
        );


        if (
            !pdfBlob ||
            pdfBlob.size < 1000
        ) {

            throw new Error(
                "Generated PDF is empty."
            );

        }


        /* =====================================================
           CREATE BLOB URL
           ===================================================== */

        const pdfUrl =
            URL.createObjectURL(
                pdfBlob
            );


        console.log(
            "PDF URL CREATED:",
            pdfUrl
        );


        /* =====================================================
           REMOVE TEMPORARY HTML
           ===================================================== */

        pdfContainer.remove();
        pdfContainer = null;


        /* =====================================================
           OPEN IN SAME PAGE
           =====================================================

           DO NOT USE:

           window.open()

           DO NOT USE:

           "_blank"

           DO NOT USE:

           download attribute

           We directly navigate the CURRENT TAB.
        */

        console.log(
            "Opening PDF in SAME TAB..."
        );


        window.location.href =
            pdfUrl;


        /*
           IMPORTANT:

           Do not immediately call:

           URL.revokeObjectURL(pdfUrl)

           because the browser PDF viewer
           still needs the Blob URL.
        */

    }
    catch (error) {

        console.error(
            "PDF CREATION ERROR:",
            error
        );


        if (pdfContainer) {

            pdfContainer.remove();

            pdfContainer = null;

        }


        alert(
            "PDF creation failed.\n\n" +
            error.message
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                originalButtonText;

        }

    }

}


/* =========================================================
   RETURN BILL
   ========================================================= */

async function handleReturn(bill) {

    const billId =
        getBillId(bill);


    const billNo =
        getBillNumber(bill);


    const grandTotal =
        numberValue(
            bill?.grand_total ??
            bill?.grandTotal
        );


    const value =
        prompt(
            `Enter Return Amount\n\n` +
            `Bill No: ${billNo}\n` +
            `Grand Total: ₹ ${formatMoney(grandTotal)}`
        );


    if (value === null) {
        return;
    }


    const returnAmount =
        Number(value);


    if (
        !Number.isFinite(returnAmount) ||
        returnAmount <= 0
    ) {

        alert(
            "Enter a valid return amount."
        );

        return;

    }


    if (
        returnAmount >
        grandTotal
    ) {

        alert(
            "Return amount cannot be greater than Grand Total."
        );

        return;

    }


    const confirmed =
        confirm(
            `Confirm return?\n\n` +
            `Bill: ${billNo}\n` +
            `Return: ₹ ${formatMoney(returnAmount)}`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/bills/${encodeURIComponent(billId)}`,
                {

                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            return_amount:
                                returnAmount,

                            status:
                                "return"

                        })

                }
            );


        if (!response.ok) {

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


/* =========================================================
   ACTION EVENTS
   ========================================================= */

function attachActionEvents() {


    /* =====================================================
       PDF BUTTON
       ===================================================== */

    document
        .querySelectorAll(".pdfBtn")
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const billId =
                            button.dataset.billId;


                        downloadBillPDF(
                            billId,
                            button
                        );

                    }
                );

            }
        );


    /* =====================================================
       RETURN BUTTON
       ===================================================== */

    document
        .querySelectorAll(
            ".returnBtn:not(.returnedBtn)"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    async function() {

                        const billId =
                            button.dataset.billId;


                        const bill =
                            allBills.find(
                                function(item) {

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


                        await handleReturn(
                            bill
                        );

                    }
                );

            }
        );

}


/* =========================================================
   SEARCH BUTTON
   ========================================================= */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function() {

            applyFilters();

        }
    );

}


/* =========================================================
   LIVE SEARCH
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            applyFilters();

        }
    );


    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                applyFilters();

            }

        }
    );

}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

if (clearSearchBtn) {

    clearSearchBtn.addEventListener(
        "click",
        function() {

            if (searchInput) {
                searchInput.value = "";
            }


            if (statusFilter) {
                statusFilter.value = "all";
            }


            applyFilters();


            if (searchInput) {
                searchInput.focus();
            }

        }
    );

}


/* =========================================================
   STATUS FILTER
   ========================================================= */

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function() {

            applyFilters();

        }
    );

}


/* =========================================================
   REFRESH
   ========================================================= */

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async function() {

            if (searchInput) {
                searchInput.value = "";
            }


            if (statusFilter) {
                statusFilter.value = "all";
            }


            await loadBills();

        }
    );

}


/* =========================================================
   HOME
   ========================================================= */

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "../index.html";

        }
    );

}


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "History page initialized."
        );

        loadBills();

    }
);
