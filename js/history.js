"use strict";

/* =========================================================
   AMMAN SAW MILL
   HISTORY.JS
   FINAL QUOTATION PDF VERSION
   =========================================================

   IMPORTANT:

   1. No quotation.js required.
   2. PDF is generated directly from history.js.
   3. PDF opens in the SAME TAB.
   4. PDF is NOT automatically downloaded.
   5. Bill No inside quotation is ALWAYS "---".
   6. Length and Quantity are separate.
   7. Quality is displayed.
   8. Same Wood + Same Quality CFT is grouped.
   9. Other Charges are displayed.
   10. Others Total is calculated.
   ========================================================= */


console.log("======================================");
console.log("AMMAN SAW MILL - HISTORY.JS");
console.log("FINAL QUOTATION VERSION");
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
   NUMBER HELPER
   ========================================================= */

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const n =
        Number(
            String(value)
                .replace(/[₹,\s]/g, "")
        );

    return Number.isFinite(n)
        ? n
        : 0;
}


/* =========================================================
   MONEY
   ========================================================= */

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


/* =========================================================
   NORMALIZE ARRAY
   ========================================================= */

function normalizeArray(value) {

    const parsed =
        parseJSON(value);

    if (
        Array.isArray(parsed)
    ) {
        return parsed;
    }

    if (
        parsed &&
        typeof parsed === "object"
    ) {

        const possibleArrays = [

            parsed.items,

            parsed.data,

            parsed.others,

            parsed.otherItems,

            parsed.otherCharges,

            parsed.charges,

            parsed.additionalItems,

            parsed.additionalCharges
        ];

        for (
            const item of possibleArrays
        ) {

            if (
                Array.isArray(item)
            ) {

                return item;
            }
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
   =========================================================

   IMPORTANT:

   This is retained for the history table and
   return confirmation.

   IT IS NOT USED INSIDE THE QUOTATION PDF.
   PDF always shows "---".
   ========================================================= */

function getBillNumber(bill) {

    return (

        bill?.bill_no ??

        bill?.billNo ??

        `BILL-${getBillId(bill)}`
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


    if (
        mode === "upi"
    ) {
        return "UPI";
    }


    if (
        mode === "cash"
    ) {
        return "CASH";
    }


    return "-";
}


/* =========================================================
   WOOD TOTAL
   ========================================================= */

function getWoodTotal(bill) {

    const stored =
        numberValue(

            bill?.wood_total ??

            bill?.woodTotal
        );


    if (
        stored > 0
    ) {
        return stored;
    }


    const woodData =
        getWoodData(bill);


    return woodData.reduce(

        function(total, item) {

            return total +
                getWoodAmount(item);

        },

        0
    );
}


/* =========================================================
   LABOUR CHARGE
   ========================================================= */

function getLabourCharge(bill) {

    return numberValue(

        bill?.labour_charge ??

        bill?.labourCharge ??

        bill?.labour?.labourCharge ??

        bill?.labour?.labour_charge
    );
}


/* =========================================================
   OTHER CHARGE
   ========================================================= */

function getOtherCharge(bill) {

    return numberValue(

        bill?.other_charge ??

        bill?.otherCharge ??

        bill?.labour?.otherCharge ??

        bill?.labour?.other_charge
    );
}


/* =========================================================
   OTHER ITEM NAME
   ========================================================= */

function getOtherItemName(item) {

    return (

        item?.name ??

        item?.reason ??

        item?.title ??

        item?.description ??

        item?.type ??

        "Other Charge"
    );
}


/* =========================================================
   OTHER ITEM AMOUNT
   ========================================================= */

function getOtherItemAmount(item) {

    return numberValue(

        item?.amount ??

        item?.charge ??

        item?.value ??

        item?.price ??

        item?.total
    );
}


/* =========================================================
   OTHER DATA
   ========================================================= */

function getOtherData(bill) {

    const possibleSources = [

        bill?.others_data,

        bill?.othersData,

        bill?.other_data,

        bill?.otherData,

        bill?.other_items,

        bill?.otherItems,

        bill?.other_charges,

        bill?.otherCharges,

        bill?.additional_items,

        bill?.additionalItems,

        bill?.additional_charges,

        bill?.additionalCharges,

        bill?.charges,

        bill?.labour?.othersData,

        bill?.labour?.otherItems,

        bill?.labour?.items,

        bill?.labour_data?.othersData,

        bill?.labour_data?.otherItems,

        bill?.labour_data?.items
    ];


    for (
        const source of possibleSources
    ) {

        const array =
            normalizeArray(source);


        if (
            Array.isArray(array) &&
            array.length > 0
        ) {

            console.log(
                "OTHER CHARGES FOUND:",
                array
            );

            return array;
        }
    }


    return [];
}


/* =========================================================
   OTHERS TOTAL
   ========================================================= */

function getOthersTotal(bill) {

    const stored =
        numberValue(

            bill?.others_total ??

            bill?.othersTotal
        );


    /*
       If backend already saved Others Total,
       use it.
    */

    if (
        stored > 0
    ) {

        return stored;
    }


    const labour =
        getLabourCharge(bill);


    const other =
        getOtherCharge(bill);


    const additional =
        getOtherData(bill)
            .reduce(

                function(
                    total,
                    item
                ) {

                    return total +
                        getOtherItemAmount(item);

                },

                0
            );


    return (
        labour +
        other +
        additional
    );
}


/* =========================================================
   DISCOUNT
   ========================================================= */

function getDiscount(bill) {

    return numberValue(

        bill?.discount_amount ??

        bill?.discountAmount ??

        bill?.discount
    );
}


/* =========================================================
   GRAND TOTAL
   ========================================================= */

function getGrandTotal(bill) {

    const stored =
        numberValue(

            bill?.grand_total ??

            bill?.grandTotal
        );


    if (
        stored > 0
    ) {

        return stored;
    }


    const wood =
        getWoodTotal(bill);


    const others =
        getOthersTotal(bill);


    const discount =
        getDiscount(bill);


    return (
        wood +
        others -
        discount
    );
}


/* =========================================================
   ADVANCE
   ========================================================= */

function getAdvance(bill) {

    return numberValue(

        bill?.advance_amount ??

        bill?.advance
    );
}


/* =========================================================
   BALANCE
   ========================================================= */

function getBalance(bill) {

    const stored =
        numberValue(

            bill?.balance_amount ??

            bill?.balance
        );


    if (
        stored >= 0 &&
        (
            bill?.balance_amount !== undefined ||
            bill?.balance !== undefined
        )
    ) {

        return stored;
    }


    return Math.max(
        0,
        getGrandTotal(bill) -
        getAdvance(bill)
    );
}


/* =========================================================
   RETURN AMOUNT
   ========================================================= */

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


/* =========================================================
   STATUS TEXT
   ========================================================= */

function getStatusText(bill) {

    const status =
        getStatus(bill);


    if (
        status === "pending"
    ) {

        return "PENDING";
    }


    if (
        status === "return"
    ) {

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

    const data =

        bill?.wood_data ??

        bill?.woodData ??

        bill?.wood ??

        [];


    return normalizeArray(data);
}


/* =========================================================
   WOOD NAME
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
            .toLowerCase()
            .trim() === "other"
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

    const value =

        item?.quality ??

        item?.Quality;


    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {

        return "-";
    }


    return String(value);
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
   SIZE
   ========================================================= */

function getSize(item) {

    const breadth =
        getBreadth(item);

    const thickness =
        getThickness(item);


    if (
        breadth > 0 ||
        thickness > 0
    ) {

        return (
            breadth +
            " x " +
            thickness
        );
    }


    return "-";
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
   WOOD PIECES
   ========================================================= */

function getWoodPieces(item) {

    if (
        Array.isArray(item?.pieces) &&
        item.pieces.length > 0
    ) {

        return item.pieces;
    }


    const directLength =
        numberValue(
            item?.length
        );


    const directExtra =
        numberValue(
            item?.extraLength
        );


    const directQty =
        numberValue(

            item?.qty ??

            item?.quantity ??

            item?.pieces_count
        );


    if (
        directLength > 0
    ) {

        return [

            {
                length:
                    directLength,

                extraLength:
                    directExtra,

                qty:
                    directQty > 0
                        ? directQty
                        : 1
            }
        ];
    }


    return [];
}


/* =========================================================
   PIECE FINAL LENGTH
   ========================================================= */

function getPieceLength(piece) {

    return (

        numberValue(
            piece?.length
        ) +

        numberValue(
            piece?.extraLength
        )
    );
}


/* =========================================================
   TOTAL QTY
   ========================================================= */

function getWoodTotalQuantity(item) {

    const pieces =
        getWoodPieces(item);


    if (
        pieces.length > 0
    ) {

        const total =
            pieces.reduce(

                function(
                    sum,
                    piece
                ) {

                    return sum +
                        numberValue(
                            piece?.qty ??
                            piece?.quantity
                        );

                },

                0
            );


        if (
            total > 0
        ) {

            return total;
        }
    }


    return numberValue(

        item?.qty ??

        item?.quantity ??

        item?.pieces_count
    );
}


/* =========================================================
   TOTAL LENGTH
   ========================================================= */

function getWoodTotalLength(item) {

    const saved =
        numberValue(
            item?.totalLength
        );


    if (
        saved > 0
    ) {

        return saved;
    }


    const pieces =
        getWoodPieces(item);


    return pieces.reduce(

        function(
            total,
            piece
        ) {

            const length =
                getPieceLength(piece);


            const qty =
                numberValue(
                    piece?.qty ??
                    piece?.quantity
                );


            return total +
                length *
                (
                    qty > 0
                        ? qty
                        : 1
                );

        },

        0
    );
}


/* =========================================================
   LOAD BILLS
   ========================================================= */

async function loadBills() {

    console.log(
        "Loading bill history..."
    );


    if (
        historyBody
    ) {

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


        if (
            !response.ok
        ) {

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

            allBills = data;
        }

        else if (
            data &&
            Array.isArray(
                data.bills
            )
        ) {

            allBills =
                data.bills;
        }

        else if (
            data &&
            Array.isArray(
                data.result
            )
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


        if (
            historyBody
        ) {

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

function displayBills(
    bills
) {

    if (
        !historyBody
    ) {
        return;
    }


    historyBody.innerHTML =
        "";


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
        function(
            bill,
            index
        ) {

            const status =
                getStatus(bill);


            const paymentMode =
                getPaymentMode(
                    bill
                );


            const returnAmount =
                getReturnAmount(
                    bill
                );


            const row =
                document.createElement(
                    "tr"
                );


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


            const returnHTML =

                returnAmount > 0

                    ? `

                        <span
                            class="returnAmount"
                        >

                            Rs.
                            ${formatMoney(
                                returnAmount
                            )}

                        </span>
                    `

                    : `

                        <span
                            class="noReturn"
                        >

                            -

                        </span>
                    `;


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
                                getBillId(
                                    bill
                                )
                            )}"
                        >

                            Return

                        </button>
                    `;


            const pdfButtonHTML = `

                <button
                    type="button"
                    class="pdfBtn"
                    data-bill-id="${escapeHtml(
                        getBillId(
                            bill
                        )
                    )}"
                >

                    PDF

                </button>
            `;


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>

                    <span
                        class="bill-number"
                    >

                        ${escapeHtml(
                            getBillNumber(
                                bill
                            )
                        )}

                    </span>

                </td>

                <td>

                    ${escapeHtml(
                        getCustomerId(
                            bill
                        )
                    )}

                </td>

                <td>

                    ${escapeHtml(
                        getCustomerName(
                            bill
                        )
                    )}

                </td>

                <td>

                    ${escapeHtml(
                        getCustomerMobile(
                            bill
                        )
                    )}

                </td>

                <td>

                    ${escapeHtml(
                        getCustomerPlace(
                            bill
                        )
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

                    ${escapeHtml(
                        getPaymentType(
                            bill
                        )
                    )}

                </td>

                <td>

                    ${paymentModeHTML}

                </td>

                <td>

                    Rs.
                    ${formatMoney(
                        getGrandTotal(
                            bill
                        )
                    )}

                </td>

                <td>

                    Rs.
                    ${formatMoney(
                        getAdvance(
                            bill
                        )
                    )}

                </td>

                <td>

                    Rs.
                    ${formatMoney(
                        getBalance(
                            bill
                        )
                    )}

                </td>

                <td>

                    ${returnHTML}

                </td>

                <td>

                    <span
                        class="status ${status}"
                    >

                        ${getStatusText(
                            bill
                        )}

                    </span>

                </td>

                <td>

                    <div
                        class="actions"
                    >

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


    if (
        totalBills
    ) {

        totalBills.textContent =
            allBills.length;
    }


    if (
        pendingBills
    ) {

        pendingBills.textContent =
            pending;
    }


    if (
        finishedBills
    ) {

        finishedBills.textContent =
            finished;
    }


    if (
        returnBills
    ) {

        returnBills.textContent =
            returned;
    }
}


/* =========================================================
   RESULT COUNT
   ========================================================= */

function updateResultCount(
    count
) {

    if (
        !resultCount
    ) {

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


    if (
        search
    ) {

        filtered =
            filtered.filter(
                function(bill) {

                    const text = [

                        getBillNumber(
                            bill
                        ),

                        getCustomerId(
                            bill
                        ),

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
                        .join(" ")
                        .toLowerCase();


                    return text.includes(
                        search
                    );
                }
            );
    }


    if (
        selectedStatus !==
        "all"
    ) {

        filtered =
            filtered.filter(
                function(bill) {

                    return (

                        getStatus(
                            bill
                        ) ===
                        selectedStatus

                    );
                }
            );
    }


    displayBills(
        filtered
    );


    if (
        clearSearchBtn
    ) {

        clearSearchBtn.classList.toggle(
            "visible",
            search.length > 0
        );
    }
}


/* =========================================================
   LOAD JSPDF
   ========================================================= */

function loadJsPDF() {

    return new Promise(
        function(
            resolve,
            reject
        ) {

            if (

                window.jspdf &&

                typeof
                    window.jspdf.jsPDF ===
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


            if (
                existing
            ) {

                existing.addEventListener(
                    "load",
                    function() {

                        if (

                            window.jspdf &&

                            typeof
                                window.jspdf.jsPDF ===
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


            script.async =
                true;


            script.dataset.ammanJspdf =
                "true";


            script.onload =
                function() {

                    if (

                        window.jspdf &&

                        typeof
                            window.jspdf.jsPDF ===
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
   PDF CELL
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


    if (
        fill
    ) {

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


    let tx =
        x + 2;


    if (
        align === "center"
    ) {

        tx =
            x +
            width / 2;
    }


    if (
        align === "right"
    ) {

        tx =
            x +
            width -
            2;
    }


    doc.text(
        String(
            text ?? "-"
        ),
        tx,
        y +
        height / 2 +
        2.2,
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
   PDF HEADER
   ========================================================= */

function addPDFHeader(
    doc
) {

    const pageWidth =
        doc.internal.pageSize
            .getWidth();


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
            align:
                "center"
        }
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(
        9
    );


    /*
       IMPORTANT:

       This is quotation.
       Bill number intentionally
       remains "---".
    */

    doc.text(
        "BILL - ---",
        pageWidth / 2,
        20,
        {
            align:
                "center"
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
   CUSTOMER DETAILS
   ========================================================= */

function addCustomerPDFDetails(
    doc,
    bill,
    startY
) {

    const x = 10;

    const label1 = 30;

    const value1 = 65;

    const label2 = 30;

    const value2 = 65;

    const rowHeight = 8;


    const rows = [

        [
            "Bill No",
            "---",
            "Date",
            formatDate(

                bill?.bill_date ??

                bill?.billDate ??

                bill?.date
            )
        ],

        [
            "Customer ID",
            getCustomerId(
                bill
            ),

            "Customer",
            getCustomerName(
                bill
            )
        ],

        [
            "Mobile",
            getCustomerMobile(
                bill
            ),

            "Place",
            getCustomerPlace(
                bill
            )
        ],

        [
            "Payment Type",
            getPaymentType(
                bill
            ),

            "Payment Mode",
            getPaymentMode(
                bill
            )
        ],

        [
            "Status",
            getStatusText(
                bill
            ),

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
                    fill:
                        true,

                    bold:
                        true,

                    fontSize:
                        7
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
                    fontSize:
                        7
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
                    fill:
                        true,

                    bold:
                        true,

                    fontSize:
                        7
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
                    fontSize:
                        7
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
   =========================================================

   IMPORTANT:

   Each piece gets its own row.

   Example:

   Length     Qty
   10         2
   20         3
   12         3

   Quality is printed separately.

   CFT is distributed according
   to the length × quantity.
   ========================================================= */

function addWoodPDF(
    doc,
    bill,
    startY
) {

    const pageHeight =
        doc.internal.pageSize
            .getHeight();


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


    /*
       TOTAL WIDTH = 190

       S.No     8
       Wood     21
       Quality  17
       Size     24
       Length   25
       Qty      12
       CFT      18
       Rate     22
       Amount   43

       TOTAL = 190
    */

    const columns = [

        {
            title:
                "S.No",

            width:
                8
        },

        {
            title:
                "Wood",

            width:
                21
        },

        {
            title:
                "Quality",

            width:
                17
        },

        {
            title:
                "Size",

            width:
                24
        },

        {
            title:
                "Length",

            width:
                25
        },

        {
            title:
                "Qty",

            width:
                12
        },

        {
            title:
                "CFT",

            width:
                18
        },

        {
            title:
                "Rate",

            width:
                22
        },

        {
            title:
                "Amount",

            width:
                43
        }
    ];


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
                    fill:
                        true,

                    bold:
                        true,

                    fontSize:
                        6.2,

                    align:
                        "center"
                }
            );


            x +=
                column.width;
        }
    );


    y += 8;


    const woodData =
        getWoodData(
            bill
        );


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
                fontSize:
                    8,

                align:
                    "center"
            }
        );


        return y + 15;
    }


    let serialNo =
        1;


    woodData.forEach(
        function(item) {

            const pieces =
                getWoodPieces(
                    item
                );


            let rowsToPrint =
                pieces
                    .map(
                        function(piece) {

                            return {

                                length:
                                    getPieceLength(
                                        piece
                                    ),

                                qty:
                                    numberValue(
                                        piece?.qty ??
                                        piece?.quantity
                                    )
                            };
                        }
                    )
                    .filter(
                        function(piece) {

                            return (
                                piece.length > 0
                            );
                        }
                    );


            /*
               If no piece data exists,
               still print one row.
            */

            if (
                rowsToPrint.length === 0
            ) {

                rowsToPrint = [

                    {
                        length:
                            numberValue(
                                item?.length
                            ),

                        qty:
                            getWoodTotalQuantity(
                                item
                            )
                    }
                ];
            }


            const totalMeasure =
                rowsToPrint.reduce(

                    function(
                        total,
                        piece
                    ) {

                        const qty =
                            piece.qty > 0
                                ? piece.qty
                                : 1;


                        return total +
                            piece.length *
                            qty;

                    },

                    0
                );


            const totalCFT =
                getCFT(
                    item
                );


            const totalAmount =
                getWoodAmount(
                    item
                );


            const woodName =
                getWoodName(
                    item
                );


            const quality =
                getQuality(
                    item
                );


            const size =
                getSize(
                    item
                );


            const rate =
                getRate(
                    item
                );


            rowsToPrint.forEach(
                function(piece) {

                    /*
                       PAGE BREAK
                    */

                    if (
                        y >
                        pageHeight - 35
                    ) {

                        doc.addPage();


                        addPDFHeader(
                            doc
                        );


                        y = 31;


                        let headerX =
                            margin;


                        columns.forEach(
                            function(
                                column
                            ) {

                                pdfCell(
                                    doc,
                                    column.title,
                                    headerX,
                                    y,
                                    column.width,
                                    8,
                                    {
                                        fill:
                                            true,

                                        bold:
                                            true,

                                        fontSize:
                                            6.2,

                                        align:
                                            "center"
                                    }
                                );


                                headerX +=
                                    column.width;
                            }
                        );


                        y += 8;
                    }


                    const qty =
                        piece.qty > 0
                            ? piece.qty
                            : 1;


                    const measure =
                        piece.length *
                        qty;


                    const proportion =

                        totalMeasure > 0

                            ? measure /
                              totalMeasure

                            : 1;


                    const pieceCFT =
                        totalCFT *
                        proportion;


                    const pieceAmount =
                        totalAmount *
                        proportion;


                    const values = [

                        serialNo,

                        woodName,

                        quality,

                        size,

                        piece.length > 0

                            ? String(
                                piece.length
                              )

                            : "-",

                        piece.qty > 0

                            ? String(
                                piece.qty
                              )

                            : "-",

                        pieceCFT.toFixed(
                            2
                        ),

                        "Rs. " +
                        formatMoney(
                            rate
                        ),

                        "Rs. " +
                        formatMoney(
                            pieceAmount
                        )
                    ];


                    let rowX =
                        margin;


                    columns.forEach(
                        function(
                            column,
                            colIndex
                        ) {

                            let align =
                                "left";


                            if (
                                colIndex === 0 ||
                                colIndex === 2 ||
                                colIndex === 3 ||
                                colIndex === 4 ||
                                colIndex === 5 ||
                                colIndex === 6
                            ) {

                                align =
                                    "center";
                            }


                            if (
                                colIndex === 7 ||
                                colIndex === 8
                            ) {

                                align =
                                    "right";
                            }


                            pdfCell(
                                doc,
                                values[
                                    colIndex
                                ],
                                rowX,
                                y,
                                column.width,
                                9,
                                {
                                    fontSize:
                                        6.1,

                                    align:
                                        align
                                }
                            );


                            rowX +=
                                column.width;
                        }
                    );


                    y += 9;


                    serialNo++;
                }
            );
        }
    );


    /*
       TOTAL WOOD CFT
    */

    y += 2;


    const totalAllCFT =
        woodData.reduce(

            function(
                total,
                item
            ) {

                return total +
                    getCFT(item);

            },

            0
        );


    const totalAllAmount =
        woodData.reduce(

            function(
                total,
                item
            ) {

                return total +
                    getWoodAmount(item);

            },

            0
        );


    pdfCell(
        doc,
        "WOOD DETAILS TOTAL",
        margin,
        y,
        135,
        9,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                8,

            align:
                "right"
        }
    );


    pdfCell(
        doc,
        "CFT " +
        totalAllCFT.toFixed(2),
        margin + 135,
        y,
        25,
        9,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                7,

            align:
                "center"
        }
    );


    pdfCell(
        doc,
        "Rs. " +
        formatMoney(
            totalAllAmount
        ),
        margin + 160,
        y,
        30,
        9,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                7,

            align:
                "right"
        }
    );


    return y + 17;
}


/* =========================================================
   CFT TOTAL BY WOOD + QUALITY
   ========================================================= */

function addCFTSummaryPDF(
    doc,
    bill,
    startY
) {

    const pageHeight =
        doc.internal.pageSize
            .getHeight();


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
        "CFT TOTAL BY WOOD / QUALITY",
        margin,
        y
    );


    y += 5;


    const col1 = 15;

    const col2 = 95;

    const col3 = 80;


    pdfCell(
        doc,
        "S.No",
        margin,
        y,
        col1,
        8,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                7,

            align:
                "center"
        }
    );


    pdfCell(
        doc,
        "Wood / Quality",
        margin + col1,
        y,
        col2,
        8,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                7,

            align:
                "center"
        }
    );


    pdfCell(
        doc,
        "Total CFT",
        margin +
        col1 +
        col2,
        y,
        col3,
        8,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                7,

            align:
                "center"
        }
    );


    y += 8;


    const grouped =
        new Map();


    const woodData =
        getWoodData(
            bill
        );


    woodData.forEach(
        function(item) {

            const woodName =
                String(
                    getWoodName(
                        item
                    )
                )
                    .trim() ||
                "-";


            const quality =
                String(
                    getQuality(
                        item
                    )
                )
                    .trim() ||
                "-";


            const cft =
                getCFT(
                    item
                );


            /*
               SAME WOOD + SAME QUALITY
               = ONE GROUP
            */

            const key =

                woodName
                    .toLowerCase() +

                "||" +

                quality
                    .toLowerCase();


            if (
                !grouped.has(
                    key
                )
            ) {

                grouped.set(
                    key,
                    {
                        wood:
                            woodName,

                        quality:
                            quality,

                        cft:
                            0
                    }
                );
            }


            grouped.get(
                key
            ).cft +=
                cft;
        }
    );


    if (
        grouped.size === 0
    ) {

        pdfCell(
            doc,
            "-",
            margin,
            y,
            col1,
            8,
            {
                fontSize:
                    7,

                align:
                    "center"
            }
        );


        pdfCell(
            doc,
            "No CFT details",
            margin + col1,
            y,
            col2,
            8,
            {
                fontSize:
                    7
            }
        );


        pdfCell(
            doc,
            "0.00 CFT",
            margin +
            col1 +
            col2,
            y,
            col3,
            8,
            {
                fontSize:
                    7,

                align:
                    "right"
            }
        );


        return y + 16;
    }


    let serialNo =
        1;


    let grandCFT =
        0;


    grouped.forEach(
        function(group) {

            if (
                y >
                pageHeight - 30
            ) {

                doc.addPage();


                addPDFHeader(
                    doc
                );


                y = 31;
            }


            pdfCell(
                doc,
                serialNo,
                margin,
                y,
                col1,
                8,
                {
                    fontSize:
                        7,

                    align:
                        "center"
                }
            );


            pdfCell(
                doc,
                group.wood +
                " / Quality " +
                group.quality,
                margin + col1,
                y,
                col2,
                8,
                {
                    fontSize:
                        7
                }
            );


            pdfCell(
                doc,
                group.cft.toFixed(
                    2
                ) +
                " CFT",
                margin +
                col1 +
                col2,
                y,
                col3,
                8,
                {
                    fontSize:
                        7,

                    align:
                        "right"
                }
            );


            grandCFT +=
                group.cft;


            y += 8;


            serialNo++;
        }
    );


    /*
       FINAL TOTAL CFT
    */

    pdfCell(
        doc,
        "",
        margin,
        y,
        col1,
        9,
        {
            fill:
                true
        }
    );


    pdfCell(
        doc,
        "TOTAL CFT",
        margin + col1,
        y,
        col2,
        9,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                8,

            align:
                "right"
        }
    );


    pdfCell(
        doc,
        grandCFT.toFixed(
            2
        ) +
        " CFT",
        margin +
        col1 +
        col2,
        y,
        col3,
        9,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                8,

            align:
                "right"
        }
    );


    return y + 17;
}


/* =========================================================
   OTHER CHARGES
   ========================================================= */

function addChargesPDF(
    doc,
    bill,
    startY
) {

    const pageHeight =
        doc.internal.pageSize
            .getHeight();


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
        "OTHER CHARGES",
        margin,
        y
    );


    y += 5;


    const col1 = 15;

    const col2 = 115;

    const col3 = 60;


    pdfCell(
        doc,
        "S.No",
        margin,
        y,
        col1,
        8,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                7,

            align:
                "center"
        }
    );


    pdfCell(
        doc,
        "Charge / Description",
        margin + col1,
        y,
        col2,
        8,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                7,

            align:
                "center"
        }
    );


    pdfCell(
        doc,
        "Amount",
        margin +
        col1 +
        col2,
        y,
        col3,
        8,
        {
            fill:
                true,

            bold:
                true,

            fontSize:
                7,

            align:
                "center"
        }
    );


    y += 8;


    const rows = [];


    /*
       LABOUR
    */

    const labour =
        getLabourCharge(
            bill
        );


    if (
        labour !== 0
    ) {

        rows.push(
            [
                "Labour Charge",
                labour
            ]
        );
    }


    /*
       OTHER CHARGE
    */

    const other =
        getOtherCharge(
            bill
        );


    if (
        other !== 0
    ) {

        rows.push(
            [
                "Other Charge",
                other
            ]
        );
    }


    /*
       ADDITIONAL CHARGES
    */

    const otherData =
        getOtherData(
            bill
        );


    otherData.forEach(
        function(item) {

            if (
                !item
            ) {
                return;
            }


            const name =
                getOtherItemName(
                    item
                );


            const amount =
                getOtherItemAmount(
                    item
                );


            /*
               Show named items even
               when their value is 0.
            */

            if (
                amount !== 0 ||
                name !==
                    "Other Charge"
            ) {

                rows.push(
                    [
                        name,
                        amount
                    ]
                );
            }
        }
    );


    /*
       IMPORTANT:

       Do NOT show "No additional charges"
       if there are actual charges.
    */

    if (
        rows.length === 0
    ) {

        rows.push(
            [
                "No additional charges",
                0
            ]
        );
    }


    rows.forEach(
        function(
            row,
            index
        ) {

            if (
                y >
                pageHeight - 30
            ) {

                doc.addPage();


                addPDFHeader(
                    doc
                );


                y = 31;


                /*
                   Recreate table header
                */

                pdfCell(
                    doc,
                    "S.No",
                    margin,
                    y,
                    col1,
                    8,
                    {
                        fill:
                            true,

                        bold:
                            true,

                        fontSize:
                            7,

                        align:
                            "center"
                    }
                );


                pdfCell(
                    doc,
                    "Charge / Description",
                    margin + col1,
                    y,
                    col2,
                    8,
                    {
                        fill:
                            true,

                        bold:
                            true,

                        fontSize:
                            7,

                        align:
                            "center"
                    }
                );


                pdfCell(
                    doc,
                    "Amount",
                    margin +
                    col1 +
                    col2,
                    y,
                    col3,
                    8,
                    {
                        fill:
                            true,

                        bold:
                            true,

                        fontSize:
                            7,

                        align:
                            "center"
                    }
                );


                y += 8;
            }


            pdfCell(
                doc,
                index + 1,
                margin,
                y,
                col1,
                8,
                {
                    fontSize:
                        7,

                    align:
                        "center"
                }
            );


            pdfCell(
                doc,
                row[0],
                margin + col1,
                y,
                col2,
                8,
                {
                    fontSize:
                        7
                }
            );


            pdfCell(
                doc,
                "Rs. " +
                formatMoney(
                    row[1]
                ),
                margin +
                col1 +
                col2,
                y,
                col3,
                8,
                {
                    fontSize:
                        7,

                    align:
                        "right"
                }
            );


            y += 8;
        }
    );


    return y + 8;
}


/* =========================================================
   TOTALS
   ========================================================= */

function addTotalsPDF(
    doc,
    bill,
    startY
) {

    const pageHeight =
        doc.internal.pageSize
            .getHeight();


    const x = 105;

    const width = 95;

    let y =
        startY;


    const woodTotal =
        getWoodTotal(
            bill
        );


    const labour =
        getLabourCharge(
            bill
        );


    const other =
        getOtherCharge(
            bill
        );


    const othersTotal =
        getOthersTotal(
            bill
        );


    const discount =
        getDiscount(
            bill
        );


    const grandTotal =
        getGrandTotal(
            bill
        );


    const advance =
        getAdvance(
            bill
        );


    const balance =
        getBalance(
            bill
        );


    const rows = [

        [
            "Wood Total",
            woodTotal
        ],

        [
            "Labour Charge",
            labour
        ],

        [
            "Other Charge",
            other
        ],

        [
            "Others Total",
            othersTotal
        ],

        [
            "Discount",
            discount
        ],

        [
            "Grand Total",
            grandTotal
        ],

        [
            "Advance / Paid",
            advance
        ],

        [
            "Balance",
            balance
        ]
    ];


    const returnAmount =
        getReturnAmount(
            bill
        );


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
                    doc
                );


                y = 31;
            }


            const isGrand =
                row[0] ===
                "Grand Total";


            const isBalance =
                row[0] ===
                "Balance";


            const height =

                isGrand ||
                isBalance

                    ? 10

                    : 8;


            pdfCell(
                doc,
                row[0],
                x,
                y,
                width * 0.55,
                height,
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
                formatMoney(
                    row[1]
                ),
                x +
                width * 0.55,
                y,
                width * 0.45,
                height,
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

                    align:
                        "right"
                }
            );


            y +=
                height;
        }
    );


    return y;
}


/* =========================================================
   COMPLETE PDF
   ========================================================= */

function createBillPDF(
    bill,
    jsPDF
) {

    const doc =
        new jsPDF({

            orientation:
                "portrait",

            unit:
                "mm",

            format:
                "a4"
        });


    /*
       HEADER
    */

    addPDFHeader(
        doc
    );


    let y =
        31;


    /*
       CUSTOMER
    */

    y =
        addCustomerPDFDetails(
            doc,
            bill,
            y
        );


    y += 7;


    /*
       WOOD DETAILS

       Length
       Qty
       Quality
       CFT
    */

    y =
        addWoodPDF(
            doc,
            bill,
            y
        );


    y += 2;


    /*
       CFT GROUPING

       SAME WOOD
       +
       SAME QUALITY
       =
       ONE CFT TOTAL
    */

    y =
        addCFTSummaryPDF(
            doc,
            bill,
            y
        );


    y += 2;


    /*
       OTHER CHARGES
    */

    y =
        addChargesPDF(
            doc,
            bill,
            y
        );


    y += 2;


    /*
       FINAL TOTALS
    */

    addTotalsPDF(
        doc,
        bill,
        y
    );


    /*
       FOOTER
    */

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
            doc.internal.pageSize
                .getWidth();


        const height =
            doc.internal.pageSize
                .getHeight();


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
                align:
                    "right"
            }
        );
    }


    return doc;
}


/* =========================================================
   OPEN QUOTATION PDF
   SAME TAB
   NO DOWNLOAD
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
            "QUOTATION PDF OPEN START"
        );

        console.log(
            "Bill ID:",
            billId
        );


        /*
           FIND BILL
        */

        const bill =
            allBills.find(
                function(item) {

                    return String(
                        getBillId(
                            item
                        )
                    ) ===
                    String(
                        billId
                    );
                }
            );


        if (
            !bill
        ) {

            throw new Error(
                "Bill not found."
            );
        }


        console.log(
            "SELECTED BILL:",
            bill
        );


        console.log(
            "WOOD DATA:",
            getWoodData(
                bill
            )
        );


        console.log(
            "OTHER DATA:",
            getOtherData(
                bill
            )
        );


        if (
            button
        ) {

            button.disabled =
                true;

            button.textContent =
                "Creating...";
        }


        /*
           LOAD jsPDF
        */

        const jsPDF =
            await loadJsPDF();


        if (
            !jsPDF
        ) {

            throw new Error(
                "jsPDF is not available."
            );
        }


        /*
           CREATE PDF
        */

        const doc =
            createBillPDF(
                bill,
                jsPDF
            );


        if (
            !doc
        ) {

            throw new Error(
                "PDF document was not created."
            );
        }


        /*
           VERIFY PAGE COUNT
        */

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


        /*
           CREATE BLOB
        */

        const pdfBlob =
            doc.output(
                "blob"
            );


        console.log(
            "PDF BLOB SIZE:",
            pdfBlob
                ? pdfBlob.size
                : 0
        );


        if (
            !pdfBlob ||
            pdfBlob.size < 1000
        ) {

            throw new Error(
                "Generated PDF is empty."
            );
        }


        /*
           CREATE BLOB URL
        */

        const pdfURL =
            URL.createObjectURL(
                pdfBlob
            );


        console.log(
            "PDF URL:",
            pdfURL
        );


        /*
           IMPORTANT:

           OPEN IN CURRENT TAB.

           NOT:

           window.open()

           NOT:

           "_blank"

           NOT:

           download=""
        */

        window.location.assign(
            pdfURL
        );


        /*
           DO NOT revoke immediately.

           Browser PDF viewer needs
           the Blob URL.
        */

    }

    catch (error) {

        console.error(
            "======================================"
        );

        console.error(
            "QUOTATION PDF ERROR:",
            error
        );

        console.error(
            "======================================"
        );


        alert(
            "PDF creation failed.\n\n" +
            error.message
        );


        if (
            button
        ) {

            button.disabled =
                false;

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
        getBillId(
            bill
        );


    const billNo =
        getBillNumber(
            bill
        );


    const grandTotal =
        getGrandTotal(
            bill
        );


    const value =
        prompt(

            `Enter Return Amount\n\n` +

            `Bill No: ${billNo}\n` +

            `Grand Total: Rs. ${
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
        Number(
            value
        );


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

            `Amount: Rs. ${
                formatMoney(
                    returnAmount
                )
            }`
        );


    if (
        !confirmed
    ) {

        return;
    }


    try {

        const response =
            await fetch(

                `${API_URL}/bills/${encodeURIComponent(
                    billId
                )}`,

                {

                    method:
                        "PATCH",

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


/* =========================================================
   ACTION EVENTS
   ========================================================= */

function attachActionEvents() {


    /*
       PDF BUTTON
    */

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


    /*
       RETURN BUTTON
    */

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
                                        getBillId(
                                            item
                                        )
                                    ) ===
                                    String(
                                        billId
                                    );
                                }
                            );


                        if (
                            !bill
                        ) {

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

if (
    searchBtn
) {

    searchBtn.addEventListener(
        "click",
        function() {

            applyFilters();
        }
    );
}


/* =========================================================
   SEARCH INPUT
   ========================================================= */

if (
    searchInput
) {

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
                event.key ===
                "Enter"
            ) {

                applyFilters();
            }
        }
    );
}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

if (
    clearSearchBtn
) {

    clearSearchBtn.addEventListener(
        "click",
        function() {

            if (
                searchInput
            ) {

                searchInput.value =
                    "";
            }


            if (
                statusFilter
            ) {

                statusFilter.value =
                    "all";
            }


            applyFilters();


            if (
                searchInput
            ) {

                searchInput.focus();
            }
        }
    );
}


/* =========================================================
   STATUS FILTER
   ========================================================= */

if (
    statusFilter
) {

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

if (
    refreshBtn
) {

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

if (
    homeBtn
) {

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
