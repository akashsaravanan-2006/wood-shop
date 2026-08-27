"use strict";

/* ============================================================
   HISTORY.JS
   WOOD SHOP - BILL HISTORY

   FEATURES
   ------------------------------------------------------------
   1. Load bills from backend
   2. Search bills
   3. Filter by status
   4. Return bill
   5. Open quotation PDF in NEW TAB
   6. PDF does NOT automatically download
   7. Wood Length + Qty shown separately
   8. Quality shown
   9. CFT shown
   10. CFT TOTAL grouped by SAME WOOD + SAME QUALITY
   11. Other Charges shown correctly
   12. Labour Charge shown
   13. Payment summary shown
   ============================================================ */


/* ============================================================
   API
   ============================================================ */

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


/* ============================================================
   ELEMENT HELPER
   ============================================================ */

function $(id) {
    return document.getElementById(id);
}


/* ============================================================
   PAGE ELEMENTS
   ============================================================ */

const historyBody = $("historyBody");

const searchInput = $("searchInput");
const searchBtn = $("searchBtn");
const refreshBtn = $("refreshBtn");
const homeBtn = $("homeBtn");
const statusFilter = $("statusFilter");
const clearSearchBtn = $("clearSearchBtn");

const totalBills = $("totalBills");
const pendingBills = $("pendingBills");
const finishedBills = $("finishedBills");
const returnBills = $("returnBills");
const resultCount = $("resultCount");


/* ============================================================
   DATA
   ============================================================ */

let allBills = [];


/* ============================================================
   NUMBER
   ============================================================ */

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    if (
        typeof value === "number"
    ) {
        return Number.isFinite(value)
            ? value
            : 0;
    }

    const number =
        parseFloat(
            String(value)
                .replace(/₹/g, "")
                .replace(/,/g, "")
                .replace(/\s/g, "")
        );

    return Number.isFinite(number)
        ? number
        : 0;
}


/* ============================================================
   MONEY
   ============================================================ */

function formatMoney(value) {

    return numberValue(value)
        .toFixed(2);
}


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ============================================================
   SAFE JSON PARSER
   ============================================================ */

function parseJSON(value, fallback = []) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    if (
        typeof value === "object"
    ) {
        return value;
    }

    if (
        typeof value !== "string"
    ) {
        return fallback;
    }

    try {

        return JSON.parse(value);

    }
    catch (error) {

        console.warn(
            "JSON parse failed:",
            error
        );

        return fallback;
    }
}


/* ============================================================
   BILL ID
   ============================================================ */

function getBillId(bill) {

    return (
        bill?.id ??
        bill?.bill_id ??
        bill?.billId ??
        bill?._id ??
        ""
    );
}


/* ============================================================
   BILL NUMBER
   ============================================================ */

function getBillNumber(bill) {

    return (
        bill?.bill_no ??
        bill?.billNo ??
        ""
    );
}


/* ============================================================
   CUSTOMER
   ============================================================ */

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


/* ============================================================
   CUSTOMER ID
   ============================================================ */

function getCustomerId(bill) {

    return (
        bill?.customer_id ??
        bill?.customerId ??
        "-"
    );
}


/* ============================================================
   PAYMENT TYPE
   ============================================================ */

function getPaymentType(bill) {

    const value =
        bill?.payment_type ??
        bill?.paymentType ??
        "-";

    return (
        String(value)
            .trim()
            .toUpperCase() || "-"
    );
}


/* ============================================================
   PAYMENT MODE
   ============================================================ */

function getPaymentMode(bill) {

    const value =
        bill?.payment_mode ??
        bill?.paymentMode ??
        "";

    const mode =
        String(value)
            .trim()
            .toUpperCase();

    if (mode === "UPI") {
        return "UPI";
    }

    if (mode === "CASH") {
        return "CASH";
    }

    if (mode) {
        return mode;
    }

    return "-";
}


/* ============================================================
   TOTALS
   ============================================================ */

function getGrandTotal(bill) {

    return numberValue(
        bill?.grand_total ??
        bill?.grandTotal ??
        bill?.total ??
        0
    );
}


function getAdvance(bill) {

    return numberValue(
        bill?.advance_amount ??
        bill?.advanceAmount ??
        bill?.advance ??
        0
    );
}


function getBalance(bill) {

    return numberValue(
        bill?.balance_amount ??
        bill?.balanceAmount ??
        bill?.balance ??
        0
    );
}


function getReturnAmount(bill) {

    return numberValue(
        bill?.return_amount ??
        bill?.returnAmount ??
        bill?.return ??
        0
    );
}


function getDiscount(bill) {

    return numberValue(
        bill?.discount_amount ??
        bill?.discountAmount ??
        (
            typeof bill?.discount === "object"
                ? (
                    bill.discount.amount ??
                    bill.discount.discountAmount ??
                    0
                )
                : bill?.discount
        ) ??
        0
    );
}


function getLabourCharge(bill) {

    return numberValue(
        bill?.labour_charge ??
        bill?.labourCharge ??
        0
    );
}


function getOtherCharge(bill) {

    return numberValue(
        bill?.other_charge ??
        bill?.otherCharge ??
        0
    );
}


/* ============================================================
   DATE
   ============================================================ */

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


/* ============================================================
   STATUS
   ============================================================ */

function getStatus(bill) {

    const returnAmount =
        getReturnAmount(bill);

    const rawStatus =
        String(
            bill?.status ??
            bill?.bill_status ??
            ""
        )
            .trim()
            .toLowerCase();

    const balance =
        getBalance(bill);


    if (
        returnAmount > 0 ||
        rawStatus === "return" ||
        rawStatus === "returned"
    ) {

        return "return";
    }


    if (
        balance > 0 ||
        rawStatus === "pending"
    ) {

        return "pending";
    }


    return "finished";
}


function getStatusText(bill) {

    const status =
        getStatus(bill);

    if (status === "return") {
        return "RETURNED";
    }

    if (status === "pending") {
        return "PENDING";
    }

    return "DELIVERED";
}


/* ============================================================
   PAYMENT HTML
   ============================================================ */

function paymentModeHTML(mode) {

    if (mode === "UPI") {

        return `
            <span class="payment-pill upi">
                UPI
            </span>
        `;
    }


    if (mode === "CASH") {

        return `
            <span class="payment-pill cash">
                CASH
            </span>
        `;
    }


    return `
        <span class="payment-pill unknown">
            ${escapeHtml(mode)}
        </span>
    `;
}


/* ============================================================
   STATUS HTML
   ============================================================ */

function statusHTML(bill) {

    const status =
        getStatus(bill);

    return `
        <span class="status ${status}">
            ${getStatusText(bill)}
        </span>
    `;
}


/* ============================================================
   WOOD DATA
   ============================================================ */

function getWoodData(bill) {

    const possibleValues = [

        bill?.wood_data,
        bill?.woodData,
        bill?.wood,
        bill?.wood_details,
        bill?.woodDetails,

        bill?.calculations,
        bill?.woodCalculations

    ];


    for (
        const value of possibleValues
    ) {

        const parsed =
            parseJSON(value, null);

        if (
            Array.isArray(parsed) &&
            parsed.length > 0
        ) {

            return parsed;
        }
    }


    return [];
}


/* ============================================================
   WOOD NAME
   ============================================================ */

function getWoodName(item) {

    let name =
        item?.woodType ??
        item?.wood_type ??
        item?.wood ??
        item?.woodName ??
        "-";


    if (
        String(name)
            .trim()
            .toLowerCase() === "other"
    ) {

        name =
            item?.otherWood ??
            item?.other_wood ??
            item?.otherWoodName ??
            "Other";
    }


    return String(name || "-");
}


/* ============================================================
   QUALITY
   ============================================================ */

function getQuality(item) {

    const quality =
        item?.quality ??
        item?.grade ??
        item?.woodQuality ??
        item?.wood_quality ??
        "1";

    return String(
        quality === ""
            ? "1"
            : quality
    );
}


/* ============================================================
   BREADTH
   ============================================================ */

function getBreadth(item) {

    return (
        item?.breadth ??
        item?.breadthInch ??
        item?.breadth_inch ??
        item?.width ??
        "-"
    );
}


/* ============================================================
   THICKNESS
   ============================================================ */

function getThickness(item) {

    return (
        item?.thickness ??
        item?.thicknessInch ??
        item?.thickness_inch ??
        "-"
    );
}


/* ============================================================
   RATE
   ============================================================ */

function getRate(item) {

    return numberValue(
        item?.rate ??
        item?.price ??
        0
    );
}


/* ============================================================
   AMOUNT
   ============================================================ */

function getAmount(item) {

    return numberValue(
        item?.amount ??
        item?.totalAmount ??
        item?.total_amount ??
        0
    );
}


/* ============================================================
   CFT
   ============================================================ */

function getCFT(item) {

    return numberValue(
        item?.cubicFeet ??
        item?.cubic_feet ??
        item?.cft ??
        item?.cubicft ??
        0
    );
}


/* ============================================================
   PIECES
   ============================================================ */

function getPieces(item) {

    let pieces =
        item?.pieces ??
        item?.pieceDetails ??
        item?.piece_details ??
        item?.lengths ??
        null;


    pieces =
        parseJSON(
            pieces,
            null
        );


    if (
        Array.isArray(pieces) &&
        pieces.length > 0
    ) {

        return pieces;
    }


    /*
       Some old records store only
       one length and one quantity.
    */

    if (
        item?.length !== undefined ||
        item?.qty !== undefined ||
        item?.quantity !== undefined
    ) {

        return [
            {
                length:
                    item?.length ?? 0,

                extraLength:
                    item?.extraLength ??
                    item?.extra_length ??
                    0,

                qty:
                    item?.qty ??
                    item?.quantity ??
                    0
            }
        ];
    }


    return [];
}


/* ============================================================
   LENGTH VALUE
   ============================================================ */

function getPieceLength(piece) {

    const length =
        numberValue(
            piece?.length ??
            piece?.len ??
            0
        );

    const extra =
        numberValue(
            piece?.extraLength ??
            piece?.extra_length ??
            piece?.extra ??
            0
        );


    return length + extra;
}


/* ============================================================
   QUANTITY VALUE
   ============================================================ */

function getPieceQty(piece) {

    return numberValue(
        piece?.qty ??
        piece?.quantity ??
        piece?.count ??
        0
    );
}


/* ============================================================
   LENGTH TEXT
   ============================================================ */

function getLengthText(item) {

    const pieces =
        getPieces(item);


    if (
        pieces.length === 0
    ) {

        return "-";
    }


    return pieces
        .map(
            function(piece) {

                const length =
                    getPieceLength(
                        piece
                    );

                return (
                    length
                        .toFixed(2)
                        .replace(/\.00$/, "") +
                    " ft"
                );
            }
        )
        .join("<br>");
}


/* ============================================================
   QTY TEXT
   ============================================================ */

function getQtyText(item) {

    const pieces =
        getPieces(item);


    if (
        pieces.length === 0
    ) {

        return "-";
    }


    return pieces
        .map(
            function(piece) {

                return String(
                    getPieceQty(piece)
                );
            }
        )
        .join("<br>");
}


/* ============================================================
   WOOD TOTAL CALCULATION
   ============================================================ */

function calculateWoodTotal(
    woodData
) {

    if (
        !Array.isArray(woodData)
    ) {

        return 0;
    }


    return woodData.reduce(
        function(total, item) {

            return (
                total +
                getAmount(item)
            );

        },
        0
    );
}


/* ============================================================
   TOTAL CFT CALCULATION
   ============================================================ */

function calculateTotalCFT(
    woodData
) {

    if (
        !Array.isArray(woodData)
    ) {

        return 0;
    }


    return woodData.reduce(
        function(total, item) {

            return (
                total +
                getCFT(item)
            );

        },
        0
    );
}


/* ============================================================
   GROUP CFT BY WOOD + QUALITY

   IMPORTANT

   Same Wood + Same Quality
   ------------------------
   Teak + Quality 1 = 10 CFT
   Teak + Quality 1 = 20 CFT

   RESULT
   Teak + Quality 1 = 30 CFT

   Different quality stays separate.
   ============================================================ */

function groupCFTByWoodQuality(
    woodData
) {

    const groups =
        new Map();


    if (
        !Array.isArray(woodData)
    ) {

        return [];
    }


    woodData.forEach(
        function(item) {

            if (!item) {
                return;
            }


            const wood =
                getWoodName(item);


            const quality =
                getQuality(item);


            const cft =
                getCFT(item);


            const key =
                wood
                    .trim()
                    .toLowerCase() +
                "||" +
                quality
                    .trim()
                    .toLowerCase();


            if (
                groups.has(key)
            ) {

                groups.get(key).cft +=
                    cft;
            }
            else {

                groups.set(
                    key,
                    {
                        wood: wood,
                        quality: quality,
                        cft: cft
                    }
                );
            }
        }
    );


    return Array.from(
        groups.values()
    );
}


/* ============================================================
   OTHER CHARGES

   IMPORTANT:
   Search many possible database/localStorage formats.
   ============================================================ */

function getOtherItems(bill) {

    const possibleKeys = [

        "others_data",
        "othersData",
        "other_data",
        "otherData",
        "other_items",
        "otherItems",
        "other_charges",
        "otherCharges",
        "additional_charges",
        "additionalCharges",
        "charges",
        "charges_data",
        "chargesData"

    ];


    let result = [];


    for (
        const key of possibleKeys
    ) {

        const value =
            parseJSON(
                bill?.[key],
                null
            );


        if (
            Array.isArray(value) &&
            value.length > 0
        ) {

            result =
                result.concat(
                    value
                );
        }
    }


    /*
       Sometimes the backend returns
       an object instead of an array.
    */

    if (
        bill?.others &&
        typeof bill.others === "object" &&
        !Array.isArray(bill.others)
    ) {

        const objectItems =
            Object.entries(
                bill.others
            );


        objectItems.forEach(
            function([
                key,
                value
            ]) {

                if (
                    value === null ||
                    value === undefined
                ) {
                    return;
                }


                if (
                    typeof value === "number"
                ) {

                    result.push({

                        name: key,

                        amount: value

                    });

                    return;
                }


                if (
                    typeof value === "object"
                ) {

                    result.push({

                        name:
                            value?.name ??
                            value?.title ??
                            value?.description ??
                            key,

                        amount:
                            value?.amount ??
                            value?.charge ??
                            value?.value ??
                            0

                    });
                }
            }
        );
    }


    /*
       Remove duplicate references.
    */

    const unique = [];


    result.forEach(
        function(item) {

            if (!item) {
                return;
            }


            const name =
                item?.name ??
                item?.title ??
                item?.description ??
                item?.reason ??
                item?.chargeName ??
                item?.charge_name ??
                "Other Charge";


            const amount =
                numberValue(
                    item?.amount ??
                    item?.charge ??
                    item?.value ??
                    item?.price ??
                    item?.cost ??
                    0
                );


            unique.push({

                name:
                    String(name),

                amount:
                    amount

            });
        }
    );


    return unique;
}


/* ============================================================
   CALCULATE OTHER ITEMS TOTAL
   ============================================================ */

function calculateOtherItemsTotal(
    items
) {

    if (
        !Array.isArray(items)
    ) {

        return 0;
    }


    return items.reduce(
        function(total, item) {

            return (
                total +
                numberValue(
                    item?.amount
                )
            );

        },
        0
    );
}


/* ============================================================
   GET OTHERS TOTAL

   Prefer database total.
   Otherwise calculate from individual items.
   ============================================================ */

function getOthersTotal(
    bill,
    items
) {

    const databaseTotal =
        numberValue(
            bill?.others_total ??
            bill?.othersTotal ??
            bill?.additional_total ??
            bill?.additionalTotal
        );


    if (
        databaseTotal > 0
    ) {

        return databaseTotal;
    }


    return (
        getLabourCharge(bill) +
        getOtherCharge(bill) +
        calculateOtherItemsTotal(items)
    );
}


/* ============================================================
   LOAD BILLS
   ============================================================ */

async function loadBills() {

    if (historyBody) {

        historyBody.innerHTML = `
            <tr>
                <td
                    colspan="15"
                    class="loading-cell"
                >
                    Loading bills...
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


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        if (
            Array.isArray(data)
        ) {

            allBills =
                data;
        }

        else if (
            Array.isArray(
                data?.bills
            )
        ) {

            allBills =
                data.bills;
        }

        else if (
            Array.isArray(
                data?.result
            )
        ) {

            allBills =
                data.result;
        }

        else if (
            Array.isArray(
                data?.data
            )
        ) {

            allBills =
                data.data;
        }

        else {

            throw new Error(
                "Invalid bills response"
            );
        }


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
                        class="error-cell"
                    >
                        Unable to load bill history.
                        <br>
                        <small>
                            ${escapeHtml(
                                error.message
                            )}
                        </small>
                    </td>
                </tr>
            `;
        }


        updateSummary([]);
        updateResultCount(0);
    }
}


/* ============================================================
   DISPLAY BILLS
   ============================================================ */

function displayBills(
    bills
) {

    if (!historyBody) {
        return;
    }


    historyBody.innerHTML =
        "";


    if (
        !Array.isArray(bills)
    ) {

        bills = [];
    }


    updateSummary(bills);

    updateResultCount(
        bills.length
    );


    if (
        bills.length === 0
    ) {

        historyBody.innerHTML = `
            <tr>
                <td
                    colspan="15"
                    class="empty-cell"
                >
                    No bills found.
                </td>
            </tr>
        `;

        return;
    }


    bills.forEach(
        function(
            bill,
            index
        ) {

            const id =
                getBillId(bill);


            const billNo =
                getBillNumber(bill);


            const customerId =
                getCustomerId(bill);


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
                getGrandTotal(bill);


            const advance =
                getAdvance(bill);


            const balance =
                getBalance(bill);


            const returnAmount =
                getReturnAmount(bill);


            const status =
                getStatus(bill);


            const balanceClass =
                balance > 0
                    ? "balance-due"
                    : "balance-zero";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <span
                        class="bill-number"
                    >
                        ${
                            escapeHtml(
                                billNo || "-"
                            )
                        }
                    </span>
                </td>

                <td>
                    <span
                        class="customer-id"
                    >
                        ${
                            escapeHtml(
                                customerId
                            )
                        }
                    </span>
                </td>

                <td>
                    <span
                        class="customer-name"
                    >
                        ${
                            escapeHtml(
                                customerName
                            )
                        }
                    </span>
                </td>

                <td>
                    ${
                        escapeHtml(
                            customerMobile
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            customerPlace
                        )
                    }
                </td>

                <td>
                    ${
                        escapeHtml(
                            formatDate(
                                bill?.bill_date ??
                                bill?.billDate ??
                                bill?.date ??
                                bill?.created_at
                            )
                        )
                    }
                </td>

                <td>
                    <span
                        class="payment-type"
                    >
                        ${
                            escapeHtml(
                                paymentType
                            )
                        }
                    </span>
                </td>

                <td>
                    ${
                        paymentModeHTML(
                            paymentMode
                        )
                    }
                </td>

                <td
                    class="money"
                >
                    ₹ ${formatMoney(
                        grandTotal
                    )}
                </td>

                <td
                    class="money"
                >
                    ₹ ${formatMoney(
                        advance
                    )}
                </td>

                <td
                    class="
                        money
                        ${balanceClass}
                    "
                >
                    ₹ ${formatMoney(
                        balance
                    )}
                </td>

                <td
                    class="money"
                >
                    ₹ ${formatMoney(
                        returnAmount
                    )}
                </td>

                <td>
                    ${
                        statusHTML(
                            bill
                        )
                    }
                </td>

                <td>

                    <div
                        class="actions"
                    >

                        <button
                            type="button"
                            class="
                                action-btn
                                pdf-btn
                                pdfBtn
                            "
                            data-bill-id="${escapeHtml(
                                id
                            )}"
                        >
                            PDF
                        </button>

                        ${
                            status !== "return"
                                ? `
                                    <button
                                        type="button"
                                        class="
                                            action-btn
                                            return-btn
                                            returnBtn
                                        "
                                        data-bill-id="${escapeHtml(
                                            id
                                        )}"
                                    >
                                        Return
                                    </button>
                                `
                                : ""
                        }

                    </div>

                </td>
            `;


            historyBody.appendChild(
                row
            );
        }
    );


    bindRowActions();
}


/* ============================================================
   SUMMARY
   ============================================================ */

function updateSummary(
    bills
) {

    let pending = 0;
    let finished = 0;
    let returned = 0;


    bills.forEach(
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
            bills.length;
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


/* ============================================================
   RESULT COUNT
   ============================================================ */

function updateResultCount(
    count
) {

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


/* ============================================================
   SEARCH / FILTER
   ============================================================ */

function applyFilters() {

    if (!searchInput) {
        return;
    }


    const search =
        String(
            searchInput.value || ""
        )
            .trim()
            .toLowerCase();


    const selectedStatus =
        String(
            statusFilter?.value ||
            "all"
        )
            .toLowerCase();


    const filtered =
        allBills.filter(
            function(bill) {

                const searchText = [

                    bill?.bill_no,
                    bill?.billNo,

                    bill?.customer_id,
                    bill?.customerId,

                    getCustomerName(
                        bill
                    ),

                    getCustomerMobile(
                        bill
                    ),

                    getCustomerPlace(
                        bill
                    ),

                    getPaymentType(
                        bill
                    ),

                    getPaymentMode(
                        bill
                    ),

                    getStatusText(
                        bill
                    )

                ]
                    .map(
                        function(value) {

                            return String(
                                value ?? ""
                            )
                                .toLowerCase();
                        }
                    )
                    .join(" ");


                const matchesSearch =
                    search === "" ||
                    searchText.includes(
                        search
                    );


                const matchesStatus =
                    selectedStatus ===
                        "all" ||
                    selectedStatus ===
                        getStatus(bill);


                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );


    displayBills(
        filtered
    );


    if (clearSearchBtn) {

        clearSearchBtn.classList.toggle(
            "visible",
            search !== ""
        );
    }
}


/* ============================================================
   BIND ROW ACTIONS
   ============================================================ */

function bindRowActions() {

    document
        .querySelectorAll(
            ".pdfBtn"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        openBillPDF(
                            button.dataset.billId,
                            button
                        );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            ".returnBtn"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    async function() {

                        const id =
                            button.dataset.billId;


                        const bill =
                            allBills.find(
                                function(item) {

                                    return (
                                        String(
                                            getBillId(
                                                item
                                            )
                                        ) ===
                                        String(id)
                                    );
                                }
                            );


                        if (bill) {

                            await handleReturn(
                                bill
                            );
                        }
                    }
                );
            }
        );
}


/* ============================================================
   RETURN BILL
   ============================================================ */

async function handleReturn(
    bill
) {

    const id =
        getBillId(bill);


    const billNo =
        getBillNumber(bill);


    const grandTotal =
        getGrandTotal(bill);


    const value =
        prompt(
            `Enter Return Amount\n\n` +
            `Bill No: ${
                billNo || "-"
            }\n` +
            `Grand Total: ₹ ${
                formatMoney(
                    grandTotal
                )
            }`
        );


    if (
        value === null
    ) {

        return;
    }


    const returnAmount =
        numberValue(value);


    if (
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
            `Bill: ${
                billNo || "-"
            }\n` +
            `Return: ₹ ${
                formatMoney(
                    returnAmount
                )
            }`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/bills/${encodeURIComponent(
                    id
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


        if (
            !response.ok
        ) {

            const text =
                await response.text();


            throw new Error(
                `HTTP ${
                    response.status
                }: ${text}`
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


/* ============================================================
   PDF - WOOD ROWS

   IMPORTANT:
   Every piece gets its own Length and Qty line.

   Example:

   Length     Qty
   ----------------
   10 ft      2
   20 ft      3
   12 ft      3

   Quality remains for the complete wood item.
   ============================================================ */

function buildWoodRows(
    woodData
) {

    if (
        !Array.isArray(
            woodData
        ) ||
        woodData.length === 0
    ) {

        return `
            <tr>
                <td
                    colspan="10"
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    No wood details
                </td>
            </tr>
        `;
    }


    let html = "";


    woodData.forEach(
        function(item, index) {

            if (!item) {
                return;
            }


            const woodName =
                getWoodName(item);


            const breadth =
                getBreadth(item);


            const thickness =
                getThickness(item);


            const quality =
                getQuality(item);


            const cft =
                getCFT(item);


            const rate =
                getRate(item);


            const amount =
                getAmount(item);


            const pieces =
                getPieces(item);


            /*
               If there are no piece records,
               still show one row.
            */

            if (
                pieces.length === 0
            ) {

                html += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHtml(
                                woodName
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                breadth
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                thickness
                            )}
                        </td>

                        <td>
                            -
                        </td>

                        <td>
                            -
                        </td>

                        <td>
                            ${escapeHtml(
                                quality
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                cft
                            )}
                        </td>

                        <td>
                            ₹ ${formatMoney(
                                rate
                            )}
                        </td>

                        <td>
                            ₹ ${formatMoney(
                                amount
                            )}
                        </td>

                    </tr>
                `;

                return;
            }


            /*
               First row contains
               wood information.
            */

            pieces.forEach(
                function(
                    piece,
                    pieceIndex
                ) {

                    const length =
                        getPieceLength(
                            piece
                        );


                    const qty =
                        getPieceQty(
                            piece
                        );


                    html += `

                        <tr>

                            <td>
                                ${
                                    pieceIndex === 0
                                        ? index + 1
                                        : ""
                                }
                            </td>

                            <td>
                                ${
                                    pieceIndex === 0
                                        ? escapeHtml(
                                            woodName
                                        )
                                        : ""
                                }
                            </td>

                            <td>
                                ${
                                    pieceIndex === 0
                                        ? escapeHtml(
                                            breadth
                                        )
                                        : ""
                                }
                            </td>

                            <td>
                                ${
                                    pieceIndex === 0
                                        ? escapeHtml(
                                            thickness
                                        )
                                        : ""
                                }
                            </td>

                            <td>
                                ${
                                    length
                                        .toFixed(2)
                                        .replace(
                                            /\.00$/,
                                            ""
                                        )
                                }
                                ft
                            </td>

                            <td>
                                ${qty}
                            </td>

                            <td>
                                ${
                                    pieceIndex === 0
                                        ? escapeHtml(
                                            quality
                                        )
                                        : ""
                                }
                            </td>

                            <td>
                                ${
                                    pieceIndex === 0
                                        ? formatMoney(
                                            cft
                                        )
                                        : ""
                                }
                            </td>

                            <td>
                                ${
                                    pieceIndex === 0
                                        ? "₹ " +
                                          formatMoney(
                                              rate
                                          )
                                        : ""
                                }
                            </td>

                            <td>
                                ${
                                    pieceIndex === 0
                                        ? "₹ " +
                                          formatMoney(
                                              amount
                                          )
                                        : ""
                                }
                            </td>

                        </tr>
                    `;
                }
            );
        }
    );


    return html;
}


/* ============================================================
   PDF - OTHER CHARGE ROWS

   This is intentionally separate from
   Labour Charge and Other Charge.
   ============================================================ */

function buildOtherChargeRows(
    items
) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <tr>

                <td>
                    1
                </td>

                <td>
                    No additional charges
                </td>

                <td
                    class="right"
                >
                    ₹ 0.00
                </td>

            </tr>
        `;
    }


    return items
        .map(
            function(item, index) {

                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${
                                escapeHtml(
                                    item.name
                                )
                            }
                        </td>

                        <td
                            class="right"
                        >
                            ₹ ${
                                formatMoney(
                                    item.amount
                                )
                            }
                        </td>

                    </tr>
                `;
            }
        )
        .join("");
}


/* ============================================================
   PDF - CFT SUMMARY

   SAME WOOD + SAME QUALITY

   Example:

   Teak - Quality 1 = 12.50 CFT
   Teak - Quality 2 = 30.25 CFT
   Neem - Quality 1 = 15.00 CFT

   Same wood but different quality
   will NOT be combined.
   ============================================================ */

function buildCFTSummaryRows(
    woodData
) {

    const groups =
        groupCFTByWoodQuality(
            woodData
        );


    if (
        groups.length === 0
    ) {

        return `
            <tr>

                <td>
                    -
                </td>

                <td>
                    -
                </td>

                <td
                    class="right"
                >
                    0.00 CFT
                </td>

            </tr>
        `;
    }


    return groups
        .map(
            function(group, index) {

                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${
                                escapeHtml(
                                    group.wood
                                )
                            }
                        </td>

                        <td>
                            Quality ${
                                escapeHtml(
                                    group.quality
                                )
                            }
                        </td>

                        <td
                            class="right"
                        >
                            ${
                                group.cft.toFixed(
                                    2
                                )
                            }
                            CFT
                        </td>

                    </tr>
                `;
            }
        )
        .join("");
}


/* ============================================================
   PDF HTML

   NOTE:
   This is a QUOTATION-style document.
   Bill number is NOT printed here.

   The history table can still show BILL-xxxx,
   but inside this PDF we show:

       QUOTATION

   Date + Customer details are shown.
   ============================================================ */

function buildPDFHTML(
    bill
) {

    const billDate =
        formatDate(
            bill?.bill_date ??
            bill?.billDate ??
            bill?.date ??
            bill?.created_at
        );


    const customerId =
        getCustomerId(bill);


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


    const woodData =
        getWoodData(bill);


    const woodTotal =
        calculateWoodTotal(
            woodData
        );


    const totalCFT =
        calculateTotalCFT(
            woodData
        );


    const otherItems =
        getOtherItems(bill);


    const labour =
        getLabourCharge(
            bill
        );


    const otherCharge =
        getOtherCharge(
            bill
        );


    const itemOtherTotal =
        calculateOtherItemsTotal(
            otherItems
        );


    const othersTotal =
        getOthersTotal(
            bill,
            otherItems
        );


    const discount =
        getDiscount(bill);


    const grandTotal =
        getGrandTotal(bill);


    const advance =
        getAdvance(bill);


    const balance =
        getBalance(bill);


    const returnAmount =
        getReturnAmount(bill);


    /*
       If database grand total is zero,
       calculate a useful fallback.
    */

    let calculatedGrandTotal =
        grandTotal;


    if (
        calculatedGrandTotal === 0
    ) {

        calculatedGrandTotal =
            woodTotal +
            labour +
            otherCharge +
            itemOtherTotal -
            discount;
    }


    return `

        <div
            class="pdf-page"
        >

            <style>

                * {
                    box-sizing:
                        border-box;
                }


                html,
                body {
                    margin: 0;
                    padding: 0;
                    background: #ffffff;
                }


                .pdf-page {

                    width: 794px;

                    min-height:
                        1123px;

                    padding:
                        30px 34px;

                    background:
                        #ffffff;

                    color:
                        #111827;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    font-size:
                        11px;

                    line-height:
                        1.35;
                }


                .shop-header {

                    text-align:
                        center;

                    border-bottom:
                        2px solid
                        #111827;

                    padding-bottom:
                        12px;

                    margin-bottom:
                        14px;
                }


                .shop-header h1 {

                    margin:
                        0 0 5px 0;

                    font-size:
                        23px;

                    font-weight:
                        800;
                }


                .shop-header .subtitle {

                    margin:
                        3px 0;

                    font-size:
                        11px;
                }


                .quotation-title {

                    text-align:
                        center;

                    font-size:
                        18px;

                    font-weight:
                        800;

                    margin:
                        12px 0;

                    padding:
                        8px;

                    border:
                        1px solid
                        #111827;

                    background:
                        #f3f4f6;

                    letter-spacing:
                        1px;
                }


                .date-row {

                    display:
                        flex;

                    justify-content:
                        flex-end;

                    margin-bottom:
                        12px;

                    font-weight:
                        700;
                }


                .section-title {

                    margin-top:
                        14px;

                    margin-bottom:
                        6px;

                    padding:
                        7px 9px;

                    background:
                        #eef2f7;

                    border-left:
                        4px solid
                        #2563eb;

                    font-size:
                        13px;

                    font-weight:
                        800;

                    text-transform:
                        uppercase;
                }


                .customer-table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                    margin-bottom:
                        8px;
                }


                .customer-table td {

                    border:
                        1px solid
                        #1f2937;

                    padding:
                        7px;

                    vertical-align:
                        middle;
                }


                .customer-table .label {

                    width:
                        20%;

                    font-weight:
                        700;

                    background:
                        #f3f4f6;
                }


                .customer-table .value {

                    width:
                        30%;
                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;

                    margin:
                        0 0 8px 0;
                }


                th,
                td {

                    border:
                        1px solid
                        #1f2937;

                    padding:
                        6px 7px;

                    vertical-align:
                        middle;
                }


                th {

                    background:
                        #e5e7eb;

                    color:
                        #111827;

                    font-weight:
                        800;

                    text-align:
                        center;

                    white-space:
                        nowrap;
                }


                td {

                    font-size:
                        10px;
                }


                .right {

                    text-align:
                        right;
                }


                .center {

                    text-align:
                        center;
                }


                .wood-table th:nth-child(1) {
                    width: 6%;
                }


                .wood-table th:nth-child(2) {
                    width: 13%;
                }


                .wood-table th:nth-child(3) {
                    width: 9%;
                }


                .wood-table th:nth-child(4) {
                    width: 9%;
                }


                .wood-table th:nth-child(5) {
                    width: 12%;
                }


                .wood-table th:nth-child(6) {
                    width: 8%;
                }


                .wood-table th:nth-child(7) {
                    width: 8%;
                }


                .wood-table th:nth-child(8) {
                    width: 9%;
                }


                .wood-table th:nth-child(9) {
                    width: 11%;
                }


                .wood-table th:nth-child(10) {
                    width: 15%;
                }


                .summary-table {

                    width:
                        100%;
                }


                .summary-table td:first-child {

                    width:
                        70%;

                    font-weight:
                        700;
                }


                .summary-table td:last-child {

                    width:
                        30%;
                }


                .grand-total td {

                    font-size:
                        14px;

                    font-weight:
                        900;

                    background:
                        #eaf3ff;
                }


                .discount-row td:last-child {

                    color:
                        #dc2626;

                    font-weight:
                        800;
                }


                .quotation-note {

                    margin-top:
                        14px;

                    padding:
                        9px;

                    border:
                        1px solid
                        #d1d5db;

                    background:
                        #f9fafb;

                    font-size:
                        10px;
                }


                .footer {

                    margin-top:
                        20px;

                    padding-top:
                        10px;

                    border-top:
                        1px solid
                        #d1d5db;

                    text-align:
                        center;

                    color:
                        #6b7280;

                    font-size:
                        10px;
                }


                .avoid-break {

                    page-break-inside:
                        avoid;
                }

            </style>


            <!-- =================================================
                 HEADER
                 ================================================= -->

            <div
                class="shop-header"
            >

                <h1>
                    ஸ்ரீ அம்மன் சாமில்
                </h1>

                <div
                    class="subtitle"
                >
                    தேக்கு, வேம்பு, பூவரசு வியாபாரம்
                </div>

                <div
                    class="subtitle"
                >
                    Mobile :
                    9443076409 ,
                    9715050908
                </div>

                <div
                    class="subtitle"
                >
                    GST :
                    33DLKPK5760D1Z5
                </div>

            </div>


            <!-- =================================================
                 QUOTATION TITLE
                 ================================================= -->

            <div
                class="quotation-title"
            >
                WOOD QUOTATION
            </div>


            <div
                class="date-row"
            >
                Date :
                ${escapeHtml(
                    billDate
                )}
            </div>


            <!-- =================================================
                 CUSTOMER
                 ================================================= -->

            <div
                class="section-title"
            >
                Customer Information
            </div>


            <table
                class="customer-table"
            >

                <tr>

                    <td
                        class="label"
                    >
                        Customer Name
                    </td>

                    <td
                        class="value"
                    >
                        ${
                            escapeHtml(
                                customerName
                            )
                        }
                    </td>

                    <td
                        class="label"
                    >
                        Customer ID
                    </td>

                    <td
                        class="value"
                    >
                        ${
                            escapeHtml(
                                customerId
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td
                        class="label"
                    >
                        Mobile
                    </td>

                    <td
                        class="value"
                    >
                        ${
                            escapeHtml(
                                customerMobile
                            )
                        }
                    </td>

                    <td
                        class="label"
                    >
                        Place
                    </td>

                    <td
                        class="value"
                    >
                        ${
                            escapeHtml(
                                customerPlace
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td
                        class="label"
                    >
                        Payment Type
                    </td>

                    <td
                        class="value"
                    >
                        ${
                            escapeHtml(
                                paymentType
                            )
                        }
                    </td>

                    <td
                        class="label"
                    >
                        Payment Mode
                    </td>

                    <td
                        class="value"
                    >
                        ${
                            escapeHtml(
                                paymentMode
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td
                        class="label"
                    >
                        Status
                    </td>

                    <td
                        class="value"
                    >
                        ${
                            escapeHtml(
                                status
                            )
                        }
                    </td>

                    <td
                        class="label"
                    >
                        Total CFT
                    </td>

                    <td
                        class="value"
                    >
                        ${
                            totalCFT.toFixed(
                                2
                            )
                        }
                        CFT
                    </td>

                </tr>

            </table>


            <!-- =================================================
                 WOOD DETAILS
                 ================================================= -->

            <div
                class="section-title"
            >
                Wood Details
            </div>


            <table
                class="wood-table"
            >

                <thead>

                    <tr>

                        <th>
                            S.No
                        </th>

                        <th>
                            Wood
                        </th>

                        <th>
                            Breadth
                        </th>

                        <th>
                            Thickness
                        </th>

                        <th>
                            Length
                        </th>

                        <th>
                            Qty
                        </th>

                        <th>
                            Quality
                        </th>

                        <th>
                            CFT
                        </th>

                        <th>
                            Rate
                        </th>

                        <th>
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        buildWoodRows(
                            woodData
                        )
                    }

                </tbody>

            </table>


            <!-- =================================================
                 CFT SUMMARY
                 ================================================= -->

            <div
                class="section-title"
            >
                CFT Total - Wood & Quality Wise
            </div>


            <table
                class="avoid-break"
            >

                <thead>

                    <tr>

                        <th>
                            S.No
                        </th>

                        <th>
                            Wood
                        </th>

                        <th>
                            Quality
                        </th>

                        <th>
                            CFT Total
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        buildCFTSummaryRows(
                            woodData
                        )
                    }

                </tbody>

            </table>


            <!-- =================================================
                 OTHER CHARGES
                 ================================================= -->

            <div
                class="section-title"
            >
                Other Charges
            </div>


            <table
                class="avoid-break"
            >

                <thead>

                    <tr>

                        <th>
                            S.No
                        </th>

                        <th>
                            Charge / Description
                        </th>

                        <th>
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        buildOtherChargeRows(
                            otherItems
                        )
                    }


                    <tr>

                        <td>
                            -
                        </td>

                        <td>
                            Labour Charge
                        </td>

                        <td
                            class="right"
                        >
                            ₹ ${
                                formatMoney(
                                    labour
                                )
                            }
                        </td>

                    </tr>


                    <tr>

                        <td>
                            -
                        </td>

                        <td>
                            Other Charge
                        </td>

                        <td
                            class="right"
                        >
                            ₹ ${
                                formatMoney(
                                    otherCharge
                                )
                            }
                        </td>

                    </tr>


                    <tr>

                        <td
                            colspan="2"
                            style="
                                font-weight:800;
                            "
                        >
                            Others Total
                        </td>

                        <td
                            class="right"
                            style="
                                font-weight:800;
                            "
                        >
                            ₹ ${
                                formatMoney(
                                    othersTotal
                                )
                            }
                        </td>

                    </tr>

                </tbody>

            </table>


            <!-- =================================================
                 PAYMENT SUMMARY
                 ================================================= -->

            <div
                class="section-title"
            >
                Payment Summary
            </div>


            <table
                class="summary-table avoid-break"
            >

                <tr>

                    <td>
                        Wood Total
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${
                            formatMoney(
                                woodTotal
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td>
                        Labour Charge
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${
                            formatMoney(
                                labour
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td>
                        Other Charge
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${
                            formatMoney(
                                otherCharge
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td>
                        Other Items Total
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${
                            formatMoney(
                                itemOtherTotal
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td>
                        Others Total
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${
                            formatMoney(
                                othersTotal
                            )
                        }
                    </td>

                </tr>


                ${
                    discount > 0
                        ? `
                            <tr
                                class="discount-row"
                            >

                                <td>
                                    Discount
                                </td>

                                <td
                                    class="right"
                                >
                                    - ₹ ${
                                        formatMoney(
                                            discount
                                        )
                                    }
                                </td>

                            </tr>
                        `
                        : ""
                }


                <tr
                    class="grand-total"
                >

                    <td>
                        GRAND TOTAL
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${
                            formatMoney(
                                calculatedGrandTotal
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td>
                        Advance / Paid
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${
                            formatMoney(
                                advance
                            )
                        }
                    </td>

                </tr>


                <tr>

                    <td>
                        BALANCE
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${
                            formatMoney(
                                balance
                            )
                        }
                    </td>

                </tr>


                ${
                    returnAmount > 0
                        ? `
                            <tr>

                                <td>
                                    Return Amount
                                </td>

                                <td
                                    class="right"
                                >
                                    ₹ ${
                                        formatMoney(
                                            returnAmount
                                        )
                                    }
                                </td>

                            </tr>
                        `
                        : ""
                }

            </table>


            <!-- =================================================
                 NOTE
                 ================================================= -->

            <div
                class="quotation-note"
            >
                <strong>
                    Note:
                </strong>
                This document is a quotation.
                Final billing may be updated
                according to actual quantity,
                wood measurement and charges.
            </div>


            <div
                class="footer"
            >
                Thank You
            </div>

        </div>
    `;
}


/* ============================================================
   OPEN PDF IN NEW TAB

   IMPORTANT FIX

   OLD METHOD:
       hidden div
       opacity 0.01
       z-index -9999
       html2pdf.save()

   NEW METHOD:
       1. Open blank tab immediately
       2. Create visible off-screen PDF container
       3. Generate PDF as Blob
       4. Create blob URL
       5. Set new tab location to blob URL
       6. Browser PDF viewer opens it
       7. No automatic download
   ============================================================ */

async function openBillPDF(
    billId,
    button
) {

    const oldText =
        button?.textContent ||
        "PDF";


    /*
       Open tab IMMEDIATELY.
       This prevents popup blocker.
    */

    const pdfTab =
        window.open(
            "",
            "_blank"
        );


    if (!pdfTab) {

        alert(
            "Please allow pop-ups for this website to open the quotation."
        );

        return;
    }


    /*
       Show loading message in new tab.
    */

    try {

        pdfTab.document.open();

        pdfTab.document.write(`
            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    Creating Quotation...
                </title>

                <style>

                    body {

                        margin: 0;

                        height: 100vh;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        font-family:
                            Arial,
                            sans-serif;

                        background:
                            #111827;

                        color:
                            white;
                    }

                    .box {

                        text-align:
                            center;

                        padding:
                            30px;
                    }

                    .loader {

                        width:
                            35px;

                        height:
                            35px;

                        border:
                            4px solid
                            #555;

                        border-top:
                            4px solid
                            white;

                        border-radius:
                            50%;

                        animation:
                            spin 1s linear infinite;

                        margin:
                            0 auto 15px;
                    }

                    @keyframes spin {

                        to {
                            transform:
                                rotate(360deg);
                        }

                    }

                </style>

            </head>


            <body>

                <div
                    class="box"
                >

                    <div
                        class="loader"
                    ></div>

                    <div>
                        Creating quotation...
                    </div>

                </div>

            </body>

            </html>
        `);

        pdfTab.document.close();

    }
    catch (error) {

        console.warn(
            "Could not write loading page:",
            error
        );
    }


    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Opening...";
        }


        /*
           html2pdf library check.
        */

        if (
            typeof window.html2pdf !==
            "function"
        ) {

            throw new Error(
                "html2pdf library is not loaded. Add html2pdf.bundle.min.js before history.js."
            );
        }


        /*
           First use already loaded
           bill from history.
        */

        let bill =
            allBills.find(
                function(item) {

                    return (
                        String(
                            getBillId(item)
                        ) ===
                        String(billId)
                    );
                }
            );


        /*
           If not found, get from API.
        */

        if (!bill) {

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
                    `Bill API HTTP ${
                        response.status
                    }`
                );
            }


            const result =
                await response.json();


            bill =
                result?.bill ??
                result?.data ??
                result;


            if (!bill) {

                throw new Error(
                    "Bill data not found."
                );
            }
        }


        console.log(
            "PDF BILL DATA:",
            bill
        );


        /*
           Build HTML.
        */

        const html =
            buildPDFHTML(
                bill
            );


        /*
           Create container.
           It is NOT hidden with
           z-index -9999.
        */

        const container =
            document.createElement(
                "div"
            );


        container.innerHTML =
            html;


        container.style.position =
            "fixed";

        container.style.left =
            "-10000px";

        container.style.top =
            "0";

        container.style.width =
            "794px";

        container.style.background =
            "#ffffff";

        container.style.display =
            "block";

        container.style.opacity =
            "1";

        container.style.visibility =
            "visible";

        container.style.zIndex =
            "999999";


        document.body.appendChild(
            container
        );


        /*
           Wait until browser paints it.
        */

        await new Promise(
            function(resolve) {

                requestAnimationFrame(
                    function() {

                        requestAnimationFrame(
                            resolve
                        );
                    }
                );
            }
        );


        /*
           Small extra wait for fonts/layout.
        */

        await new Promise(
            function(resolve) {

                setTimeout(
                    resolve,
                    400
                );
            }
        );


        /*
           Generate PDF as Blob.

           IMPORTANT:
           We use .outputPdf("blob")
           instead of .save()

           Therefore:
           NO automatic download.
        */

        const worker =
            html2pdf()
                .set({

                    margin:
                        [8, 8, 8, 8],

                    image: {

                        type:
                            "jpeg",

                        quality:
                            0.98
                    },

                    html2canvas: {

                        scale:
                            2,

                        useCORS:
                            true,

                        allowTaint:
                            false,

                        backgroundColor:
                            "#ffffff",

                        logging:
                            false,

                        scrollX:
                            0,

                        scrollY:
                            0,

                        windowWidth:
                            794,

                        width:
                            794
                    },

                    jsPDF: {

                        unit:
                            "mm",

                        format:
                            "a4",

                        orientation:
                            "portrait",

                        compress:
                            true
                    },

                    pagebreak: {

                        mode:
                            [
                                "css",
                                "legacy"
                            ]
                    }

                })
                .from(
                    container
                );


        const pdfBlob =
            await worker.outputPdf(
                "blob"
            );


        /*
           Remove temporary HTML.
        */

        container.remove();


        /*
           Validate blob.
        */

        if (
            !pdfBlob ||
            pdfBlob.size === 0
        ) {

            throw new Error(
                "PDF was created but is empty."
            );
        }


        console.log(
            "PDF SIZE:",
            pdfBlob.size
        );


        /*
           Create browser blob URL.
        */

        const pdfUrl =
            URL.createObjectURL(
                pdfBlob
            );


        /*
           Open PDF directly
           inside new tab.
        */

        pdfTab.location.href =
            pdfUrl;


        /*
           Clean blob URL later.
           Give Edge enough time to load it.
        */

        setTimeout(
            function() {

                URL.revokeObjectURL(
                    pdfUrl
                );

            },
            10 * 60 * 1000
        );


    }
    catch (error) {

        console.error(
            "PDF ERROR:",
            error
        );


        try {

            pdfTab.document.open();

            pdfTab.document.write(`

                <!DOCTYPE html>

                <html>

                <head>

                    <title>
                        PDF Error
                    </title>

                </head>


                <body
                    style="
                        font-family:Arial;
                        padding:40px;
                    "
                >

                    <h2>
                        Unable to create quotation
                    </h2>

                    <p>
                        ${escapeHtml(
                            error.message
                        )}
                    </p>

                    <p>
                        Please close this tab
                        and try again.
                    </p>

                </body>

                </html>

            `);

            pdfTab.document.close();

        }
        catch (tabError) {

            console.error(
                tabError
            );

            try {

                pdfTab.close();

            }
            catch (e) {}

        }


        alert(
            "Unable to create quotation.\n\n" +
            error.message
        );

    }
    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                oldText;
        }
    }
}


/* ============================================================
   SEARCH BUTTON
   ============================================================ */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        applyFilters
    );
}


/* ============================================================
   LIVE SEARCH
   ============================================================ */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );


    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                applyFilters();
            }
        }
    );
}


/* ============================================================
   CLEAR SEARCH
   ============================================================ */

if (clearSearchBtn) {

    clearSearchBtn.addEventListener(
        "click",
        function() {

            if (searchInput) {

                searchInput.value =
                    "";
            }


            applyFilters();


            if (searchInput) {

                searchInput.focus();
            }
        }
    );
}


/* ============================================================
   STATUS FILTER
   ============================================================ */

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        applyFilters
    );
}


/* ============================================================
   REFRESH
   ============================================================ */

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async function() {

            const oldText =
                refreshBtn.textContent;


            refreshBtn.disabled =
                true;


            refreshBtn.textContent =
                "↻ Loading...";


            if (searchInput) {

                searchInput.value =
                    "";
            }


            if (statusFilter) {

                statusFilter.value =
                    "all";
            }


            try {

                await loadBills();

            }
            finally {

                refreshBtn.disabled =
                    false;

                refreshBtn.textContent =
                    oldText;
            }
        }
    );
}


/* ============================================================
   HOME
   ============================================================ */

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "index.html";
        }
    );
}


/* ============================================================
   START
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadBills
    );

}
else {

    loadBills();
}


/* ============================================================
   DEBUG
   ============================================================ */

console.log(
    "===================================="
);

console.log(
    "HISTORY.JS LOADED"
);

console.log(
    "Quotation PDF mode: NEW TAB"
);

console.log(
    "Automatic PDF download: DISABLED"
);

console.log(
    "Wood + Quality CFT grouping: ENABLED"
);

console.log(
    "Other Charges detection: ENABLED"
);

console.log(
    "===================================="
);
