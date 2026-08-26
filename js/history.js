/* =========================================================
   AMMAN SAW MILL
   BILL HISTORY
   FULL CLEAN VERSION
   ========================================================= */

"use strict";

console.log("======================================");
console.log("AMMAN SAW MILL - HISTORY.JS");
console.log("HISTORY VERSION 100");
console.log("======================================");


/* =========================================================
   BACKEND
   ========================================================= */

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


/* =========================================================
   PAGE ELEMENTS
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
   GLOBAL DATA
   ========================================================= */

let allBills = [];


/* =========================================================
   NUMBER HELPERS
   ========================================================= */

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const n = Number(
        String(value)
            .replace(/[₹,\s]/g, "")
    );

    return Number.isFinite(n)
        ? n
        : 0;
}


function formatMoney(value) {

    return numberValue(value)
        .toFixed(2);

}


/* =========================================================
   HTML ESCAPE
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
   JSON HELPER
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
   CUSTOMER
   ========================================================= */

function getCustomerId(bill) {

    return (
        bill?.customer_id ??
        bill?.customerId ??
        "-"
    );

}


function getCustomerName(bill) {

    return (
        bill?.customer_name ??
        bill?.customerName ??
        bill?.customer ??
        "-"
    );

}


function getCustomerMobile(bill) {

    return (
        bill?.customer_mobile ??
        bill?.customerMobile ??
        bill?.mobile ??
        "-"
    );

}


function getCustomerPlace(bill) {

    return (
        bill?.customer_place ??
        bill?.customerPlace ??
        bill?.place ??
        "-"
    );

}


/* =========================================================
   PAYMENT
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
   AMOUNTS
   ========================================================= */

function getWoodTotal(bill) {

    return numberValue(
        bill?.wood_total ??
        bill?.woodTotal
    );

}


function getLabourCharge(bill) {

    return numberValue(
        bill?.labour_charge ??
        bill?.labourCharge
    );

}


function getOtherCharge(bill) {

    return numberValue(
        bill?.other_charge ??
        bill?.otherCharge
    );

}


function getOthersTotal(bill) {

    return numberValue(
        bill?.others_total ??
        bill?.othersTotal
    );

}


function getDiscount(bill) {

    return numberValue(
        bill?.discount_amount ??
        bill?.discountAmount ??
        bill?.discount
    );

}


function getGrandTotal(bill) {

    return numberValue(
        bill?.grand_total ??
        bill?.grandTotal
    );

}


function getAdvance(bill) {

    return numberValue(
        bill?.advance_amount ??
        bill?.advance
    );

}


function getBalance(bill) {

    return numberValue(
        bill?.balance_amount ??
        bill?.balance
    );

}


function getReturnAmount(bill) {

    return numberValue(
        bill?.return_amount ??
        bill?.returnAmount
    );

}


/* =========================================================
   STATUS
   ========================================================= */

function getStatus(bill) {

    const returnAmount =
        getReturnAmount(bill);


    const dbStatus =
        String(
            bill?.status ??
            bill?.bill_status ??
            ""
        )
            .trim()
            .toLowerCase();


    if (
        returnAmount > 0 ||
        dbStatus === "return" ||
        dbStatus === "returned"
    ) {

        return "return";

    }


    if (
        getBalance(bill) > 0
    ) {

        return "pending";

    }


    return "finished";

}


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


    return date.toLocaleDateString(
        "en-IN"
    );

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
   LABOUR DATA
   ========================================================= */

function getLabourData(bill) {

    let data =
        bill?.labour_data ??
        bill?.labourData ??
        bill?.labour ??
        [];


    data =
        parseJSON(data);


    if (Array.isArray(data)) {
        return data;
    }


    if (
        data &&
        typeof data === "object"
    ) {

        return [data];

    }


    return [];

}


/* =========================================================
   OTHER DATA
   ========================================================= */

function getOtherData(bill) {

    let data =
        bill?.others_data ??
        bill?.othersData ??
        bill?.other_data ??
        bill?.otherData ??
        bill?.charges ??
        bill?.additional_charges ??
        [];


    data =
        parseJSON(data);


    if (Array.isArray(data)) {
        return data;
    }


    if (
        data &&
        typeof data === "object"
    ) {

        return [data];

    }


    return [];

}


/* =========================================================
   WOOD TYPE
   ========================================================= */

function getWoodName(item) {

    let name =
        item?.woodType ??
        item?.wood_type ??
        item?.wood ??
        item?.woodName ??
        "-";


    if (
        String(name)
            .toLowerCase() === "other"
    ) {

        name =
            item?.otherWood ??
            item?.other_wood ??
            "Other";

    }


    return name;

}


/* =========================================================
   QUALITY
   ========================================================= */

function getQuality(item) {

    return (
        item?.quality ??
        item?.Quality ??
        "-"
    );

}


/* =========================================================
   BREADTH
   ========================================================= */

function getBreadth(item) {

    return numberValue(
        item?.breadth
    );

}


/* =========================================================
   THICKNESS
   ========================================================= */

function getThickness(item) {

    return numberValue(
        item?.thickness
    );

}


/* =========================================================
   RATE
   ========================================================= */

function getRate(item) {

    return numberValue(
        item?.rate
    );

}


/* =========================================================
   CFT
   ========================================================= */

function getCFT(item) {

    return numberValue(
        item?.cubicFeet ??
        item?.cft
    );

}


/* =========================================================
   WOOD AMOUNT
   ========================================================= */

function getWoodAmount(item) {

    return numberValue(
        item?.amount ??
        item?.totalAmount
    );

}


/* =========================================================
   WOOD QUANTITY
   ========================================================= */

function getWoodQuantity(item) {

    let qty = 0;


    const pieces =
        Array.isArray(item?.pieces)
            ? item.pieces
            : [];


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
                item?.qty ??
                item?.quantity ??
                item?.pieces_count
            );

    }


    return qty;

}


/* =========================================================
   WOOD LENGTH
   ========================================================= */

function getWoodLengths(item) {

    const pieces =
        Array.isArray(item?.pieces)
            ? item.pieces
            : [];


    if (
        pieces.length === 0
    ) {

        const length =
            numberValue(
                item?.length
            );


        return length > 0
            ? String(length)
            : "-";

    }


    return pieces
        .map(
            function(piece) {

                const length =
                    numberValue(
                        piece?.length
                    );


                const extra =
                    numberValue(
                        piece?.extraLength
                    );


                const qty =
                    numberValue(
                        piece?.qty
                    );


                const finalLength =
                    length + extra;


                if (finalLength <= 0) {
                    return "";
                }


                return `${finalLength} x ${qty}`;

            }
        )
        .filter(Boolean)
        .join(", ");

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
                <td
                    colspan="15"
                    class="noData"
                >
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
                "Bills array not found."
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
                    <td
                        colspan="15"
                        class="noData"
                    >
                        Failed to load bills
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
        bills.length
    );


    if (
        !Array.isArray(bills) ||
        bills.length === 0
    ) {

        historyBody.innerHTML = `
            <tr>
                <td
                    colspan="15"
                    class="noData"
                >
                    No bills found
                </td>
            </tr>
        `;

        return;

    }


    bills.forEach(
        function(bill, index) {

            const status =
                getStatus(bill);


            const paymentMode =
                getPaymentMode(bill);


            const returnAmount =
                getReturnAmount(bill);


            const row =
                document.createElement("tr");


            /* =================================================
               STATUS COLOUR CLASS
               ================================================= */

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


            /* =================================================
               PAYMENT MODE
               ================================================= */

            let paymentModeHTML = `
                <span
                    class="payment-pill paymentNone"
                >
                    -
                </span>
            `;


            if (
                paymentMode === "CASH"
            ) {

                paymentModeHTML = `
                    <span
                        class="payment-pill paymentCash"
                    >
                        CASH
                    </span>
                `;

            }


            if (
                paymentMode === "UPI"
            ) {

                paymentModeHTML = `
                    <span
                        class="payment-pill paymentUpi"
                    >
                        UPI
                    </span>
                `;

            }


            /* =================================================
               RETURN
               ================================================= */

            const returnHTML =
                returnAmount > 0

                    ? `
                        <span class="returnAmount">
                            Rs. ${formatMoney(
                                returnAmount
                            )}
                        </span>
                    `

                    : `
                        <span class="noReturn">
                            -
                        </span>
                    `;


            /* =================================================
               RETURN BUTTON
               ================================================= */

            const returnButtonHTML =
                status === "return"

                    ? `
                        <button
                            type="button"
                            class="returnBtn returnedBtn"
                            disabled
                        >
                            Returned
                        </button>
                    `

                    : `
                        <button
                            type="button"
                            class="returnBtn"
                            data-bill-id="${escapeHtml(
                                getBillId(bill)
                            )}"
                        >
                            Return
                        </button>
                    `;


            /* =================================================
               PDF BUTTON
               ================================================= */

            const pdfButtonHTML = `
                <button
                    type="button"
                    class="pdfBtn"
                    data-bill-id="${escapeHtml(
                        getBillId(bill)
                    )}"
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
                        ${escapeHtml(
                            getBillNumber(bill)
                        )}
                    </span>
                </td>

                <td>
                    ${escapeHtml(
                        getCustomerId(bill)
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        getCustomerName(bill)
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        getCustomerMobile(bill)
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        getCustomerPlace(bill)
                    )}
                </td>

                <td>
                    ${formatDate(
                        bill?.bill_date ??
                        bill?.billDate ??
                        bill?.date
                    )}
                </td>

                <td>
                    <span class="payment-type">
                        ${escapeHtml(
                            getPaymentType(bill)
                        )}
                    </span>
                </td>

                <td>
                    ${paymentModeHTML}
                </td>

                <td>
                    Rs.
                    ${formatMoney(
                        getGrandTotal(bill)
                    )}
                </td>

                <td>
                    Rs.
                    ${formatMoney(
                        getAdvance(bill)
                    )}
                </td>

                <td>
                    Rs.
                    ${formatMoney(
                        getBalance(bill)
                    )}
                </td>

                <td>
                    ${returnHTML}
                </td>

                <td>
                    <span
                        class="status ${status}"
                    >
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


            historyBody.appendChild(
                row
            );

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


/* =========================================================
   RESULT COUNT
   ========================================================= */

function updateResultCount(count) {

    if (!resultCount) {
        return;
    }


    resultCount.textContent =
        `${count} ${
            count === 1
                ? "bill"
                : "bills"
        }`;

}


/* =========================================================
   FILTER
   ========================================================= */

function applyFilters() {

    const search =
        String(
            searchInput?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const selectedStatus =
        String(
            statusFilter?.value ||
            "all"
        )
            .trim()
            .toLowerCase();


    let filtered =
        [...allBills];


    /* =====================================================
       SEARCH
       ===================================================== */

    if (search) {

        filtered =
            filtered.filter(
                function(bill) {

                    const text = [

                        getBillNumber(bill),

                        getCustomerId(bill),

                        getCustomerName(bill),

                        getCustomerMobile(bill),

                        getCustomerPlace(bill),

                        getPaymentType(bill),

                        getPaymentMode(bill),

                        getStatusText(bill)

                    ]
                        .join(" ")
                        .toLowerCase();


                    return text.includes(
                        search
                    );

                }
            );

    }


    /* =====================================================
       STATUS
       ===================================================== */

    if (
        selectedStatus !== "all"
    ) {

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


    displayBills(
        filtered
    );


    if (clearSearchBtn) {

        clearSearchBtn.classList.toggle(
            "visible",
            search.length > 0
        );

    }

}


/* =========================================================
   LOAD jsPDF
   ========================================================= */

function loadJsPDF() {

    return new Promise(
        function(resolve, reject) {

            if (
                window.jspdf &&
                typeof window.jspdf.jsPDF ===
                    "function"
            ) {

                resolve(
                    window.jspdf.jsPDF
                );

                return;

            }


            const existing =
                document.querySelector(
                    'script[data-amman-jspdf="true"]'
                );


            if (existing) {

                existing.addEventListener(
                    "load",
                    function() {

                        if (
                            window.jspdf &&
                            typeof window.jspdf.jsPDF ===
                                "function"
                        ) {

                            resolve(
                                window.jspdf.jsPDF
                            );

                        }
                        else {

                            reject(
                                new Error(
                                    "jsPDF did not initialize."
                                )
                            );

                        }

                    }
                );


                existing.addEventListener(
                    "error",
                    function() {

                        reject(
                            new Error(
                                "jsPDF could not be loaded."
                            )
                        );

                    }
                );


                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";


            script.async = true;

            script.dataset.ammanJspdf =
                "true";


            script.onload =
                function() {

                    if (
                        window.jspdf &&
                        typeof window.jspdf.jsPDF ===
                            "function"
                    ) {

                        resolve(
                            window.jspdf.jsPDF
                        );

                    }
                    else {

                        reject(
                            new Error(
                                "jsPDF loaded but is unavailable."
                            )
                        );

                    }

                };


            script.onerror =
                function() {

                    reject(
                        new Error(
                            "Could not load jsPDF."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


/* =========================================================
   PDF DRAW HELPERS
   ========================================================= */

function pdfCell(
    doc,
    text,
    x,
    y,
    width,
    height,
    options = {}
) {

    const fill =
        options.fill || false;

    const bold =
        options.bold || false;

    const fontSize =
        options.fontSize || 7;

    const align =
        options.align || "left";


    if (fill) {

        doc.setFillColor(
            240,
            242,
            245
        );

        doc.rect(
            x,
            y,
            width,
            height,
            "FD"
        );

    }
    else {

        doc.rect(
            x,
            y,
            width,
            height
        );

    }


    doc.setFont(
        "helvetica",
        bold
            ? "bold"
            : "normal"
    );


    doc.setFontSize(
        fontSize
    );


    let tx = x + 2;


    if (align === "center") {

        tx =
            x +
            width / 2;

    }


    if (align === "right") {

        tx =
            x +
            width -
            2;

    }


    doc.text(
        String(text ?? "-"),
        tx,
        y + height / 2 + 2.2,
        {
            align:
                align === "right"
                    ? "right"
                    : align === "center"
                        ? "center"
                        : "left"
        }
    );

}


/* =========================================================
   PDF PAGE HEADER
   ========================================================= */

function addPDFHeader(
    doc,
    bill
) {

    const pageWidth =
        doc.internal.pageSize.getWidth();


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        19
    );


    doc.text(
        "AMMAN SAW MILL",
        pageWidth / 2,
        14,
        {
            align: "center"
        }
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(
        9
    );


    doc.text(
        "BILL",
        pageWidth / 2,
        20,
        {
            align: "center"
        }
    );


    doc.setLineWidth(
        0.5
    );


    doc.line(
        10,
        24,
        pageWidth - 10,
        24
    );

}


/* =========================================================
   PDF CUSTOMER DETAILS
   ========================================================= */

function addCustomerPDFDetails(
    doc,
    bill,
    startY
) {

    const x = 10;

    const totalWidth =
        190;


    const label1 =
        30;

    const value1 =
        65;

    const label2 =
        30;

    const value2 =
        65;


    const rowHeight =
        8;


    const rows = [

        [
            "Bill No",
            getBillNumber(bill),

            "Date",
            formatDate(
                bill?.bill_date ??
                bill?.billDate ??
                bill?.date
            )
        ],

        [
            "Customer ID",
            getCustomerId(bill),

            "Customer",
            getCustomerName(bill)
        ],

        [
            "Mobile",
            getCustomerMobile(bill),

            "Place",
            getCustomerPlace(bill)
        ],

        [
            "Payment Type",
            getPaymentType(bill),

            "Payment Mode",
            getPaymentMode(bill)
        ],

        [
            "Status",
            getStatusText(bill),

            "",
            ""
        ]

    ];


    let y =
        startY;


    rows.forEach(
        function(row) {

            pdfCell(
                doc,
                row[0],
                x,
                y,
                label1,
                rowHeight,
                {
                    fill: true,
                    bold: true,
                    fontSize: 7
                }
            );


            pdfCell(
                doc,
                row[1],
                x + label1,
                y,
                value1,
                rowHeight,
                {
                    fontSize: 7
                }
            );


            pdfCell(
                doc,
                row[2],
                x +
                label1 +
                value1,
                y,
                label2,
                rowHeight,
                {
                    fill: true,
                    bold: true,
                    fontSize: 7
                }
            );


            pdfCell(
                doc,
                row[3],
                x +
                label1 +
                value1 +
                label2,
                y,
                value2,
                rowHeight,
                {
                    fontSize: 7
                }
            );


            y +=
                rowHeight;

        }
    );


    return y;

}


/* =========================================================
   PDF WOOD DETAILS
   ========================================================= */

function addWoodPDF(
    doc,
    bill,
    startY
) {

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();


    const margin = 10;


    let y =
        startY;


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        11
    );


    doc.text(
        "WOOD DETAILS",
        margin,
        y
    );


    y += 5;


    const columns = [

        {
            title: "S.No",
            width: 9
        },

        {
            title: "Wood",
            width: 27
        },

        {
            title: "Quality",
            width: 18
        },

        {
            title: "Breadth",
            width: 17
        },

        {
            title: "Thickness",
            width: 19
        },

        {
            title: "Length",
            width: 29
        },

        {
            title: "Qty",
            width: 13
        },

        {
            title: "CFT",
            width: 17
        },

        {
            title: "Rate",
            width: 21
        },

        {
            title: "Amount",
            width: 20
        }

    ];


    const woodData =
        getWoodData(bill);


    let x =
        margin;


    columns.forEach(
        function(column) {

            pdfCell(
                doc,
                column.title,
                x,
                y,
                column.width,
                8,
                {
                    fill: true,
                    bold: true,
                    fontSize: 6.5,
                    align: "center"
                }
            );


            x +=
                column.width;

        }
    );


    y += 8;


    if (
        woodData.length === 0
    ) {

        pdfCell(
            doc,
            "No wood details",
            margin,
            y,
            190,
            9,
            {
                fontSize: 8,
                align: "center"
            }
        );


        return y + 15;

    }


    woodData.forEach(
        function(item, index) {

            if (
                y >
                pageHeight - 35
            ) {

                doc.addPage();

                addPDFHeader(
                    doc,
                    bill
                );

                y = 31;

            }


            const values = [

                index + 1,

                getWoodName(item),

                getQuality(item),

                getBreadth(item),

                getThickness(item),

                getWoodLengths(item),

                getWoodQuantity(item),

                getCFT(item).toFixed(2),

                "Rs. " +
                formatMoney(
                    getRate(item)
                ),

                "Rs. " +
                formatMoney(
                    getWoodAmount(item)
                )

            ];


            let rowX =
                margin;


            columns.forEach(
                function(column, colIndex) {

                    pdfCell(
                        doc,
                        values[colIndex],
                        rowX,
                        y,
                        column.width,
                        9,
                        {
                            fontSize: 6.5,
                            align:
                                colIndex === 0 ||
                                colIndex === 2 ||
                                colIndex === 3 ||
                                colIndex === 4 ||
                                colIndex === 6 ||
                                colIndex === 7
                                    ? "center"
                                    : "left"
                        }
                    );


                    rowX +=
                        column.width;

                }
            );


            y += 9;

        }
    );


    return y + 8;

}


/* =========================================================
   PDF LABOUR + OTHER DETAILS
   ========================================================= */

function addChargesPDF(
    doc,
    bill,
    startY
) {

    const margin = 10;

    let y =
        startY;


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        11
    );


    doc.text(
        "LABOUR / OTHER DETAILS",
        margin,
        y
    );


    y += 5;


    const rows = [];


    const labourData =
        getLabourData(bill);


    labourData.forEach(
        function(item) {

            if (!item) {
                return;
            }


            const name =
                item?.name ??
                item?.type ??
                item?.description ??
                item?.title ??
                "Labour";


            const amount =
                numberValue(
                    item?.amount ??
                    item?.charge ??
                    item?.value
                );


            rows.push([
                name,
                amount
            ]);

        }
    );


    const labourCharge =
        getLabourCharge(bill);


    if (
        labourCharge > 0 &&
        rows.length === 0
    ) {

        rows.push([
            "Labour Charge",
            labourCharge
        ]);

    }


    const otherCharge =
        getOtherCharge(bill);


    if (
        otherCharge > 0
    ) {

        rows.push([
            "Other Charge",
            otherCharge
        ]);

    }


    const otherData =
        getOtherData(bill);


    otherData.forEach(
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


            if (
                amount <= 0
            ) {
                return;
            }


            const name =
                item?.name ??
                item?.reason ??
                item?.title ??
                item?.description ??
                "Other";


            rows.push([
                name,
                amount
            ]);

        }
    );


    if (
        rows.length === 0
    ) {

        rows.push([
            "No additional charges",
            0
        ]);

    }


    rows.forEach(
        function(row) {

            pdfCell(
                doc,
                row[0],
                margin,
                y,
                120,
                8,
                {
                    fontSize: 8
                }
            );


            pdfCell(
                doc,
                "Rs. " +
                formatMoney(row[1]),
                margin + 120,
                y,
                70,
                8,
                {
                    fontSize: 8,
                    align: "right"
                }
            );


            y += 8;

        }
    );


    return y + 8;

}


/* =========================================================
   PDF TOTALS
   ========================================================= */

function addTotalsPDF(
    doc,
    bill,
    startY
) {

    const pageWidth =
        doc.internal.pageSize.getWidth();


    const pageHeight =
        doc.internal.pageSize.getHeight();


    const x =
        105;


    const width =
        95;


    let y =
        startY;


    const rows = [

        [
            "Wood Total",
            getWoodTotal(bill)
        ],

        [
            "Labour Charge",
            getLabourCharge(bill)
        ],

        [
            "Other Charge",
            getOtherCharge(bill)
        ],

        [
            "Others Total",
            getOthersTotal(bill)
        ],

        [
            "Discount",
            getDiscount(bill)
        ],

        [
            "Grand Total",
            getGrandTotal(bill)
        ],

        [
            "Advance / Paid",
            getAdvance(bill)
        ],

        [
            "Balance",
            getBalance(bill)
        ]

    ];


    const returnAmount =
        getReturnAmount(bill);


    if (
        returnAmount > 0
    ) {

        rows.splice(
            rows.length - 2,
            0,
            [
                "Return Amount",
                returnAmount
            ]
        );

    }


    rows.forEach(
        function(row) {

            if (
                y >
                pageHeight - 20
            ) {

                doc.addPage();

                addPDFHeader(
                    doc,
                    bill
                );

                y = 31;

            }


            const isGrand =
                row[0] ===
                "Grand Total";


            const isBalance =
                row[0] ===
                "Balance";


            pdfCell(
                doc,
                row[0],
                x,
                y,
                width * 0.55,
                isGrand || isBalance
                    ? 10
                    : 8,
                {
                    fill:
                        isGrand ||
                        isBalance,

                    bold:
                        isGrand ||
                        isBalance,

                    fontSize:
                        isGrand ||
                        isBalance
                            ? 9
                            : 8
                }
            );


            pdfCell(
                doc,
                "Rs. " +
                formatMoney(row[1]),
                x +
                width * 0.55,
                y,
                width * 0.45,
                isGrand || isBalance
                    ? 10
                    : 8,
                {
                    fill:
                        isGrand ||
                        isBalance,

                    bold:
                        isGrand ||
                        isBalance,

                    fontSize:
                        isGrand ||
                        isBalance
                            ? 9
                            : 8,

                    align: "right"
                }
            );


            y +=
                isGrand || isBalance
                    ? 10
                    : 8;

        }
    );


    return y;

}


/* =========================================================
   CREATE COMPLETE PDF
   ========================================================= */

function createBillPDF(
    bill,
    jsPDF
) {

    const doc =
        new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });


    addPDFHeader(
        doc,
        bill
    );


    let y =
        31;


    y =
        addCustomerPDFDetails(
            doc,
            bill,
            y
        );


    y += 7;


    y =
        addWoodPDF(
            doc,
            bill,
            y
        );


    y =
        addChargesPDF(
            doc,
            bill,
            y
        );


    y =
        addTotalsPDF(
            doc,
            bill,
            y
        );


    /* =====================================================
       FOOTER
       ===================================================== */

    const pageCount =
        doc.getNumberOfPages();


    for (
        let page = 1;
        page <= pageCount;
        page++
    ) {

        doc.setPage(
            page
        );


        const width =
            doc.internal.pageSize.getWidth();


        const height =
            doc.internal.pageSize.getHeight();


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            7
        );


        doc.line(
            10,
            height - 12,
            width - 10,
            height - 12
        );


        doc.text(
            "AMMAN SAW MILL",
            10,
            height - 7
        );


        doc.text(
            `Page ${page} of ${pageCount}`,
            width - 10,
            height - 7,
            {
                align: "right"
            }
        );

    }


    return doc;

}


/* =========================================================
   OPEN PDF IN SAME TAB
   ========================================================= */

async function openBillPDF(
    billId,
    button = null
) {

    const oldText =
        button
            ? button.textContent
            : "PDF";


    try {

        console.log(
            "======================================"
        );

        console.log(
            "PDF GENERATION START"
        );

        console.log(
            "Bill ID:",
            billId
        );


        /* =================================================
           FIND BILL
           ================================================= */

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
                "Bill not found."
            );

        }


        console.log(
            "SELECTED BILL:",
            bill
        );


        /* =================================================
           BUTTON
           ================================================= */

        if (button) {

            button.disabled = true;

            button.textContent =
                "Creating...";

        }


        /* =================================================
           LOAD JSPDF
           ================================================= */

        const jsPDF =
            await loadJsPDF();


        /* =================================================
           CREATE PDF
           ================================================= */

        const doc =
            createBillPDF(
                bill,
                jsPDF
            );


        /* =================================================
           VERIFY PDF
           ================================================= */

        const pages =
            doc.getNumberOfPages();


        console.log(
            "PDF PAGES:",
            pages
        );


        if (
            !pages ||
            pages < 1
        ) {

            throw new Error(
                "PDF has no pages."
            );

        }


        /* =================================================
           GET PDF BLOB
           ================================================= */

        const pdfBlob =
            doc.output(
                "blob"
            );


        console.log(
            "PDF BLOB SIZE:",
            pdfBlob.size
        );


        if (
            !pdfBlob ||
            pdfBlob.size < 1000
        ) {

            throw new Error(
                "PDF is empty."
            );

        }


        /* =================================================
           CREATE OBJECT URL
           ================================================= */

        const pdfURL =
            URL.createObjectURL(
                pdfBlob
            );


        console.log(
            "PDF URL CREATED:",
            pdfURL
        );


        /* =================================================
           SAME TAB
           ================================================= */

        /*
           IMPORTANT:

           We use the current browser tab.

           We do NOT use:
           window.open()

           We do NOT use:
           "_blank"

           We do NOT use:
           download=""
        */

        window.location.href =
            pdfURL;


        /*
           Do NOT revoke URL here.
        */

    }
    catch (error) {

        console.error(
            "======================================"
        );

        console.error(
            "PDF ERROR:",
            error
        );

        console.error(
            "======================================"
        );


        alert(
            "PDF creation failed.\n\n" +
            error.message
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                oldText;

        }

    }

}


/* =========================================================
   RETURN BILL
   ========================================================= */

async function handleReturn(
    bill
) {

    const billId =
        getBillId(bill);


    const billNo =
        getBillNumber(bill);


    const grandTotal =
        getGrandTotal(bill);


    const value =
        prompt(
            `Enter Return Amount\n\n` +
            `Bill No: ${billNo}\n` +
            `Grand Total: Rs. ${formatMoney(
                grandTotal
            )}`
        );


    if (
        value === null
    ) {
        return;
    }


    const returnAmount =
        Number(value);


    if (
        !Number.isFinite(
            returnAmount
        ) ||
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
            `Confirm Return?\n\n` +
            `Bill: ${billNo}\n` +
            `Amount: Rs. ${formatMoney(
                returnAmount
            )}`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/bills/${encodeURIComponent(
                    billId
                )}`,
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
       PDF
       ===================================================== */

    document
        .querySelectorAll(
            ".pdfBtn"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const billId =
                            button.dataset.billId;


                        openBillPDF(
                            billId,
                            button
                        );

                    }
                );

            }
        );


    /* =====================================================
       RETURN
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
                                    String(
                                        billId
                                    );

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
   SEARCH
   ========================================================= */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function() {

            applyFilters();

        }
    );

}


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

                searchInput.value =
                    "";

            }


            if (statusFilter) {

                statusFilter.value =
                    "all";

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
            "HISTORY PAGE READY"
        );


        loadBills();

    }
);
