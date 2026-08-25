/* =========================================================
   AMMAN SAW MILL
   BILL HISTORY
   COMPLETE UPDATED VERSION
   ========================================================= */

"use strict";

console.log("======================================");
console.log("HISTORY.JS LOADED");
console.log("HISTORY VERSION 80");
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

    const number = Number(
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
   JSON PARSER
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
   CUSTOMER ID
   ========================================================= */

function getCustomerId(bill) {

    return (
        bill?.customer_id ??
        bill?.customerId ??
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

    const mode = String(
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

    const balance = money(
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

    data = parseJSON(data);

    if (Array.isArray(data)) {
        return data;
    }

    return [];
}


/* =========================================================
   OTHER CHARGES DATA
   ========================================================= */

function getOthersData(bill) {

    let data =
        bill?.others_data ??
        bill?.othersData ??
        bill?.other_data ??
        bill?.charges ??
        bill?.additional_charges ??
        [];

    data = parseJSON(data);

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
        numberValue(item?.breadth);

    const thickness =
        numberValue(item?.thickness);

    if (
        breadth > 0 &&
        thickness > 0
    ) {
        return `${breadth} x ${thickness}`;
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


    pieces.forEach(function(piece) {

        if (!piece) {
            return;
        }

        const length =
            numberValue(piece.length);

        const extraLength =
            numberValue(piece.extraLength);

        const qty =
            numberValue(piece.qty);

        const finalLength =
            length + extraLength;

        if (finalLength > 0) {

            result.push(
                `${finalLength} -> ${qty}`
            );
        }

    });


    if (
        result.length === 0 &&
        item?.length !== undefined
    ) {

        result.push(
            `${numberValue(item.length)} -> ${numberValue(item.qty)}`
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
                        Unable to load bill history
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
               STATUS CLASS

               CSS can now make:
               PENDING  = RED
               RETURN   = YELLOW
               DELIVERED = GREEN
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
               RETURN AMOUNT
               ================================================= */

            let returnHTML = `
                <span class="noReturn">
                    -
                </span>
            `;


            if (returnAmount > 0) {

                returnHTML = `
                    <span class="returnAmount">
                        Rs. ${formatMoney(returnAmount)}
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
                    Rs. ${formatMoney(grandTotal)}
                </td>

                <td>
                    Rs. ${formatMoney(advance)}
                </td>

                <td>
                    Rs. ${formatMoney(balance)}
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
   LOAD jsPDF
   ========================================================= */

function loadJsPDF() {

    return new Promise(
        function(resolve, reject) {

            if (
                window.jspdf &&
                window.jspdf.jsPDF
            ) {

                resolve(
                    window.jspdf.jsPDF
                );

                return;
            }


            const oldScript =
                document.querySelector(
                    'script[data-jspdf="true"]'
                );


            if (oldScript) {

                oldScript.addEventListener(
                    "load",
                    function() {

                        if (
                            window.jspdf &&
                            window.jspdf.jsPDF
                        ) {

                            resolve(
                                window.jspdf.jsPDF
                            );

                        }
                        else {

                            reject(
                                new Error(
                                    "jsPDF loaded but was not available."
                                )
                            );
                        }
                    }
                );


                oldScript.addEventListener(
                    "error",
                    function() {

                        reject(
                            new Error(
                                "Unable to load jsPDF."
                            )
                        );
                    }
                );


                return;
            }


            const script =
                document.createElement("script");


            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

            script.async = true;

            script.dataset.jspdf = "true";


            script.onload =
                function() {

                    if (
                        window.jspdf &&
                        window.jspdf.jsPDF
                    ) {

                        resolve(
                            window.jspdf.jsPDF
                        );

                    }
                    else {

                        reject(
                            new Error(
                                "jsPDF library is unavailable."
                            )
                        );
                    }
                };


            script.onerror =
                function() {

                    reject(
                        new Error(
                            "Could not load jsPDF library."
                        )
                    );
                };


            document.head.appendChild(script);
        }
    );
}


/* =========================================================
   PDF HELPERS
   ========================================================= */

function pdfText(
    doc,
    text,
    x,
    y,
    size = 10,
    style = "normal"
) {

    doc.setFont(
        "helvetica",
        style
    );

    doc.setFontSize(size);

    doc.text(
        String(text ?? "-"),
        x,
        y
    );
}


function pdfLine(
    doc,
    x1,
    y1,
    x2,
    y2
) {

    doc.line(
        x1,
        y1,
        x2,
        y2
    );
}


function pdfBox(
    doc,
    x,
    y,
    width,
    height
) {

    doc.rect(
        x,
        y,
        width,
        height
    );
}


/* =========================================================
   BUILD PDF
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


    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();


    const margin = 10;

    const contentWidth =
        pageWidth - margin * 2;


    let y = 14;


    /* =====================================================
       HEADER
       ===================================================== */

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(20);

    doc.text(
        "AMMAN SAW MILL",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 7;


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(10);

    doc.text(
        "BILL",
        pageWidth / 2,
        y,
        {
            align: "center"
        }
    );


    y += 6;


    doc.setLineWidth(0.6);

    pdfLine(
        doc,
        margin,
        y,
        pageWidth - margin,
        y
    );


    y += 8;


    /* =====================================================
       BILL INFORMATION
       ===================================================== */

    const billNo =
        getBillNumber(bill);

    const billDate =
        formatDate(
            bill?.bill_date ??
            bill?.billDate ??
            bill?.date
        );

    const customerId =
        getCustomerId(bill);

    const customerName =
        getCustomerName(bill);

    const mobile =
        getCustomerMobile(bill);

    const place =
        getCustomerPlace(bill);

    const paymentType =
        getPaymentType(bill);

    const paymentMode =
        getPaymentMode(bill);

    const status =
        getStatusText(bill);


    const infoRowHeight = 8;

    const infoLabelWidth = 32;

    const infoValueWidth =
        (contentWidth - infoLabelWidth * 2) / 2;


    const infoRows = [

        [
            "Bill No",
            billNo,
            "Date",
            billDate
        ],

        [
            "Customer ID",
            customerId,
            "Customer Name",
            customerName
        ],

        [
            "Mobile",
            mobile,
            "Place",
            place
        ],

        [
            "Payment Type",
            paymentType,
            "Payment Mode",
            paymentMode
        ],

        [
            "Status",
            status,
            "",
            ""
        ]

    ];


    infoRows.forEach(
        function(row, index) {

            const currentY =
                y + index * infoRowHeight;


            pdfBox(
                doc,
                margin,
                currentY,
                infoLabelWidth,
                infoRowHeight
            );


            pdfBox(
                doc,
                margin + infoLabelWidth,
                currentY,
                infoValueWidth,
                infoRowHeight
            );


            pdfBox(
                doc,
                margin +
                infoLabelWidth +
                infoValueWidth,
                currentY,
                infoLabelWidth,
                infoRowHeight
            );


            pdfBox(
                doc,
                margin +
                infoLabelWidth * 2 +
                infoValueWidth,
                currentY,
                infoValueWidth,
                infoRowHeight
            );


            pdfText(
                doc,
                row[0],
                margin + 2,
                currentY + 5.2,
                8,
                "bold"
            );


            pdfText(
                doc,
                row[1],
                margin + infoLabelWidth + 2,
                currentY + 5.2,
                8,
                "normal"
            );


            if (row[2]) {

                pdfText(
                    doc,
                    row[2],
                    margin +
                    infoLabelWidth +
                    infoValueWidth +
                    2,
                    currentY + 5.2,
                    8,
                    "bold"
                );


                pdfText(
                    doc,
                    row[3],
                    margin +
                    infoLabelWidth * 2 +
                    infoValueWidth +
                    2,
                    currentY + 5.2,
                    8,
                    "normal"
                );
            }

        }
    );


    y +=
        infoRows.length *
        infoRowHeight +
        10;


    /* =====================================================
       WOOD DETAILS
       ===================================================== */

    pdfText(
        doc,
        "WOOD DETAILS",
        margin,
        y,
        12,
        "bold"
    );


    y += 6;


    const woodData =
        getWoodData(bill);


    const columns = [
        {
            title: "S.No",
            width: 10
        },
        {
            title: "Wood",
            width: 30
        },
        {
            title: "Size",
            width: 24
        },
        {
            title: "Length / Qty",
            width: 32
        },
        {
            title: "Qty",
            width: 14
        },
        {
            title: "CFT",
            width: 18
        },
        {
            title: "Rate",
            width: 25
        },
        {
            title: "Amount",
            width: 27
        }
    ];


    let tableX = margin;

    const headerHeight = 8;


    /* HEADER */

    columns.forEach(
        function(column) {

            doc.setFillColor(
                235,
                239,
                244
            );

            doc.rect(
                tableX,
                y,
                column.width,
                headerHeight,
                "FD"
            );


            pdfText(
                doc,
                column.title,
                tableX + column.width / 2,
                y + 5.2,
                7,
                "bold"
            );


            /*
               Center alignment manually
               for small PDF table headers.
            */

            tableX += column.width;
        }
    );


    y += headerHeight;


    /* =====================================================
       WOOD ROWS
       ===================================================== */

    if (
        !Array.isArray(woodData) ||
        woodData.length === 0
    ) {

        const emptyHeight = 8;

        doc.rect(
            margin,
            y,
            contentWidth,
            emptyHeight
        );

        pdfText(
            doc,
            "No wood details",
            margin + contentWidth / 2,
            y + 5.2,
            8,
            "normal"
        );

        y += emptyHeight;

    }
    else {

        woodData.forEach(
            function(item, index) {

                if (y > pageHeight - 45) {

                    doc.addPage();

                    y = 15;

                    pdfText(
                        doc,
                        "AMMAN SAW MILL - BILL",
                        margin,
                        y,
                        11,
                        "bold"
                    );

                    y += 8;
                }


                const woodName =
                    getWoodName(item);

                const size =
                    getWoodSize(item);

                const lengthQty =
                    getLengthQty(item)
                        .replace(/<br>/g, " / ");


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


                const rowHeight = 9;


                const values = [

                    String(index + 1),

                    woodName,

                    size,

                    lengthQty,

                    String(qty),

                    cft.toFixed(2),

                    "Rs. " + formatMoney(rate),

                    "Rs. " + formatMoney(amount)

                ];


                let x =
                    margin;


                columns.forEach(
                    function(column, colIndex) {

                        doc.rect(
                            x,
                            y,
                            column.width,
                            rowHeight
                        );


                        pdfText(
                            doc,
                            values[colIndex],
                            x + 2,
                            y + 5.5,
                            7,
                            "normal"
                        );


                        x +=
                            column.width;
                    }
                );


                y += rowHeight;

            }
        );
    }


    y += 8;


    /* =====================================================
       OTHER CHARGES
       ===================================================== */

    if (y > pageHeight - 70) {

        doc.addPage();

        y = 15;
    }


    pdfText(
        doc,
        "OTHER CHARGES",
        margin,
        y,
        12,
        "bold"
    );


    y += 6;


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


    const othersData =
        getOthersData(bill);


    const chargeRows = [];


    if (labourCharge > 0) {

        chargeRows.push([
            "Labour Charge",
            labourCharge
        ]);
    }


    if (otherCharge > 0) {

        chargeRows.push([
            "Other Charge",
            otherCharge
        ]);
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


            chargeRows.push([
                name,
                amount
            ]);

        }
    );


    if (chargeRows.length === 0) {

        chargeRows.push([
            "No additional charges",
            0
        ]);
    }


    chargeRows.forEach(
        function(row) {

            const rowHeight = 8;

            pdfBox(
                doc,
                margin,
                y,
                contentWidth * 0.65,
                rowHeight
            );

            pdfBox(
                doc,
                margin +
                contentWidth * 0.65,
                y,
                contentWidth * 0.35,
                rowHeight
            );


            pdfText(
                doc,
                row[0],
                margin + 2,
                y + 5.2,
                8
            );


            pdfText(
                doc,
                "Rs. " + formatMoney(row[1]),
                margin +
                contentWidth * 0.65 +
                2,
                y + 5.2,
                8
            );


            y += rowHeight;
        }
    );


    y += 8;


    /* =====================================================
       TOTALS
       ===================================================== */

    if (y > pageHeight - 65) {

        doc.addPage();

        y = 15;
    }


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


    const totalX =
        margin +
        contentWidth * 0.52;


    const totalWidth =
        contentWidth * 0.48;


    function addTotalRow(
        label,
        value,
        height = 8,
        bold = false
    ) {

        doc.rect(
            totalX,
            y,
            totalWidth * 0.55,
            height
        );


        doc.rect(
            totalX +
            totalWidth * 0.55,
            y,
            totalWidth * 0.45,
            height
        );


        pdfText(
            doc,
            label,
            totalX + 2,
            y + 5.2,
            bold ? 8.5 : 8,
            bold ? "bold" : "normal"
        );


        pdfText(
            doc,
            "Rs. " + formatMoney(value),
            totalX +
            totalWidth * 0.55 +
            2,
            y + 5.2,
            bold ? 8.5 : 8,
            bold ? "bold" : "normal"
        );


        y += height;
    }


    addTotalRow(
        "Wood Total",
        woodTotal
    );


    addTotalRow(
        "Others Total",
        othersTotal
    );


    if (discount > 0) {

        addTotalRow(
            "Discount",
            discount
        );
    }


    addTotalRow(
        "Original Total",
        originalTotal,
        9,
        true
    );


    if (returnAmount > 0) {

        addTotalRow(
            "Return",
            returnAmount
        );
    }


    addTotalRow(
        "GRAND TOTAL",
        grandTotal,
        10,
        true
    );


    addTotalRow(
        "Advance / Paid",
        advance
    );


    addTotalRow(
        "BALANCE",
        balance,
        10,
        true
    );


    y += 8;


    /* =====================================================
       REMARK
       ===================================================== */

    if (bill?.remark) {

        pdfText(
            doc,
            "Remark: " +
            String(bill.remark),
            margin,
            y,
            8,
            "normal"
        );

        y += 8;
    }


    /* =====================================================
       FOOTER
       ===================================================== */

    if (y > pageHeight - 15) {

        doc.addPage();

        y = pageHeight - 15;
    }
    else {

        y = pageHeight - 15;
    }


    pdfLine(
        doc,
        margin,
        y - 4,
        pageWidth - margin,
        y - 4
    );


    pdfText(
        doc,
        "Thank you for your business",
        pageWidth / 2,
        y,
        8,
        "normal"
    );


    return doc;
}


/* =========================================================
   OPEN BILL PDF
   =========================================================

   IMPORTANT:

   - No download
   - No html2pdf
   - No html2canvas
   - No window.open()
   - No blank HTML PDF
   - Opens PDF in CURRENT TAB
   ========================================================= */

async function openBillPDF(
    billId,
    button = null
) {

    const originalButtonText =
        button
            ? button.textContent
            : "PDF";


    try {

        console.log(
            "======================================"
        );

        console.log(
            "PDF OPEN START"
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
            "Bill found:",
            bill
        );


        /* =================================================
           BUTTON
           ================================================= */

        if (button) {

            button.disabled = true;

            button.textContent =
                "Opening...";
        }


        /* =================================================
           LOAD jsPDF
           ================================================= */

        const jsPDF =
            await loadJsPDF();


        if (!jsPDF) {

            throw new Error(
                "jsPDF is not available."
            );
        }


        /* =================================================
           CREATE PDF
           ================================================= */

        const doc =
            createBillPDF(
                bill,
                jsPDF
            );


        if (!doc) {

            throw new Error(
                "PDF document was not created."
            );
        }


        /* =================================================
           CREATE BLOB
           ================================================= */

        const pdfBlob =
            doc.output("blob");


        if (
            !pdfBlob ||
            pdfBlob.size < 1000
        ) {

            throw new Error(
                "Generated PDF is empty."
            );
        }


        console.log(
            "PDF created successfully."
        );

        console.log(
            "PDF size:",
            pdfBlob.size
        );


        /* =================================================
           CREATE BLOB URL
           ================================================= */

        const pdfUrl =
            URL.createObjectURL(
                pdfBlob
            );


        console.log(
            "PDF URL:",
            pdfUrl
        );


        /* =================================================
           OPEN CURRENT TAB
           =================================================

           This does NOT download the PDF.

           Edge/Chrome will show the
           built-in PDF viewer.
        */

        window.location.assign(
            pdfUrl
        );


        /*
           Do NOT revoke immediately.

           The browser PDF viewer needs
           the Blob URL.
        */

    }
    catch (error) {

        console.error(
            "======================================"
        );

        console.error(
            "PDF CREATION ERROR"
        );

        console.error(
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
            `Grand Total: Rs. ${formatMoney(grandTotal)}`
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
            `Return: Rs. ${formatMoney(returnAmount)}`
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


                        openBillPDF(
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

            if (searchInput) {

                searchInput.value = "";
            }


            if (statusFilter) {

                statusFilter.value =
                    "all";
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
