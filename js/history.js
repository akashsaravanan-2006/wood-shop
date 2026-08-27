"use strict";

/* ============================================================
   AMMAN SAW MILL
   HISTORY.JS
   FULL UPDATED VERSION
   ============================================================

   FEATURES
   ------------------------------------------------------------
   1. Bill History
   2. Real Bill Number
   3. Search
   4. Status Filter
   5. Pending / Delivered / Return
   6. Return Bill
   7. PDF generated using jsPDF
   8. PDF opens in SAME TAB
   9. PDF is NOT automatically downloaded
   10. Complete bill fetched before PDF generation
   11. Wood details
   12. Quality
   13. Length and Quantity separately
   14. Individual piece length + quantity
   15. Same Wood + Same Quality CFT grouped
   16. CFT Total
   17. Labour Charge
   18. Other Charge
   19. Additional Other Charges
   20. Others Total
   21. Discount
   22. Grand Total
   23. Advance
   24. Balance
   ============================================================ */


/* ============================================================
   BACKEND
   ============================================================ */

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


console.log("======================================");
console.log("AMMAN SAW MILL - HISTORY.JS");
console.log("FULL UPDATED VERSION");
console.log("======================================");


/* ============================================================
   PAGE ELEMENTS
   ============================================================ */

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

const clearSearchBtn =
    document.getElementById("clearSearchBtn");

const totalBills =
    document.getElementById("totalBills");

const pendingBills =
    document.getElementById("pendingBills");

const finishedBills =
    document.getElementById("finishedBills");

const returnBills =
    document.getElementById("returnBills");

const resultCount =
    document.getElementById("resultCount");


/* ============================================================
   GLOBAL DATA
   ============================================================ */

let allBills = [];


/* ============================================================
   NUMBER HELPER
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

    const text =
        String(value)
            .replace(/[₹,\s]/g, "")
            .trim();

    const number =
        Number(text);

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
   HTML ESCAPE
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
   JSON PARSER
   ============================================================ */

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


/* ============================================================
   NORMALIZE ARRAY
   ============================================================ */

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

            parsed.additionalCharges,

            parsed.otherData,

            parsed.othersData

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


/* ============================================================
   BILL ID
   ============================================================ */

function getBillId(bill) {

    return (

        bill?.id ??

        bill?.bill_id ??

        bill?.billId ??

        bill?._id ??

        bill?.uuid ??

        ""
    );
}


/* ============================================================
   BILL NUMBER
   ============================================================ */

function getBillNumber(bill) {

    const number =

        bill?.bill_no ??

        bill?.billNo ??

        bill?.bill_number ??

        bill?.billNumber ??

        bill?.invoice_no ??

        bill?.invoiceNo ??

        "";

    if (
        String(number).trim()
    ) {

        return String(number);
    }

    const id =
        getBillId(bill);

    if (id) {

        return "BILL-" + id;
    }

    return "---";
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
   CUSTOMER NAME
   ============================================================ */

function getCustomerName(bill) {

    return (

        bill?.customer_name ??

        bill?.customerName ??

        bill?.customer ??

        bill?.name ??

        "-"
    );
}


/* ============================================================
   CUSTOMER MOBILE
   ============================================================ */

function getCustomerMobile(bill) {

    return (

        bill?.customer_mobile ??

        bill?.customerMobile ??

        bill?.mobile ??

        "-"
    );
}


/* ============================================================
   CUSTOMER PLACE
   ============================================================ */

function getCustomerPlace(bill) {

    return (

        bill?.customer_place ??

        bill?.customerPlace ??

        bill?.place ??

        "-"
    );
}


/* ============================================================
   PAYMENT TYPE
   ============================================================ */

function getPaymentType(bill) {

    return String(

        bill?.payment_type ??

        bill?.paymentType ??

        "-"

    )
        .trim()
        .toUpperCase();
}


/* ============================================================
   PAYMENT MODE
   ============================================================ */

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


/* ============================================================
   WOOD TOTAL
   ============================================================ */

function getWoodTotal(bill) {

    return numberValue(

        bill?.wood_total ??

        bill?.woodTotal ??

        bill?.wood_amount ??

        bill?.woodAmount

    );
}


/* ============================================================
   LABOUR CHARGE
   ============================================================ */

function getLabourCharge(bill) {

    const possibleValues = [

        bill?.labour_charge,

        bill?.labourCharge,

        bill?.labour_amount,

        bill?.labourAmount,

        bill?.labour?.labourCharge,

        bill?.labour?.labour_charge,

        bill?.labour_data?.labourCharge,

        bill?.labour_data?.labour_charge,

        bill?.labour_data?.labourAmount,

        bill?.labourData?.labourCharge,

        bill?.labourData?.labour_charge

    ];

    for (
        const value of possibleValues
    ) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {

            return numberValue(value);
        }
    }

    return 0;
}


/* ============================================================
   OTHER MAIN CHARGE
   ============================================================ */

function getOtherCharge(bill) {

    const possibleValues = [

        bill?.other_charge,

        bill?.otherCharge,

        bill?.other_amount,

        bill?.otherAmount,

        bill?.labour?.otherCharge,

        bill?.labour?.other_charge,

        bill?.labour_data?.otherCharge,

        bill?.labour_data?.other_charge,

        bill?.labourData?.otherCharge,

        bill?.labourData?.other_charge

    ];

    for (
        const value of possibleValues
    ) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {

            return numberValue(value);
        }
    }

    return 0;
}


/* ============================================================
   OTHER DATA
   ============================================================ */

function getOtherData(bill) {

    const sources = [

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

        bill?.labour?.otherData,

        bill?.labour_data?.othersData,

        bill?.labour_data?.otherItems,

        bill?.labour_data?.items,

        bill?.labour_data?.otherData,

        bill?.labourData?.othersData,

        bill?.labourData?.otherItems,

        bill?.labourData?.items,

        bill?.labourData?.otherData

    ];


    for (
        const source of sources
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


    console.log(
        "NO ADDITIONAL OTHER ITEMS FOUND"
    );

    return [];
}


/* ============================================================
   OTHER ITEM NAME
   ============================================================ */

function getOtherItemName(item) {

    return (

        item?.name ??

        item?.reason ??

        item?.title ??

        item?.description ??

        item?.type ??

        item?.chargeName ??

        item?.charge_name ??

        "Other Charge"
    );
}


/* ============================================================
   OTHER ITEM AMOUNT
   ============================================================ */

function getOtherItemAmount(item) {

    return numberValue(

        item?.amount ??

        item?.charge ??

        item?.value ??

        item?.price ??

        item?.total ??

        item?.chargeAmount ??

        item?.charge_amount

    );
}


/* ============================================================
   OTHERS TOTAL
   ============================================================ */

function getOthersTotal(bill) {

    const storedValues = [

        bill?.others_total,

        bill?.othersTotal,

        bill?.total_others,

        bill?.totalOthers

    ];

    for (
        const value of storedValues
    ) {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {

            const number =
                numberValue(value);

            if (
                number > 0
            ) {

                return number;
            }
        }
    }


    const labour =
        getLabourCharge(bill);

    const other =
        getOtherCharge(bill);

    const additional =
        getOtherData(bill)
            .reduce(
                function(total, item) {

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


/* ============================================================
   DISCOUNT
   ============================================================ */

function getDiscount(bill) {

    return numberValue(

        bill?.discount_amount ??

        bill?.discountAmount ??

        bill?.discount ??

        bill?.discount_value ??

        bill?.discountValue

    );
}


/* ============================================================
   GRAND TOTAL
   ============================================================ */

function getGrandTotal(bill) {

    return numberValue(

        bill?.grand_total ??

        bill?.grandTotal ??

        bill?.total_amount ??

        bill?.totalAmount

    );
}


/* ============================================================
   ADVANCE
   ============================================================ */

function getAdvance(bill) {

    return numberValue(

        bill?.advance_amount ??

        bill?.advanceAmount ??

        bill?.advance ??

        bill?.paid_amount ??

        bill?.paidAmount

    );
}


/* ============================================================
   BALANCE
   ============================================================ */

function getBalance(bill) {

    return numberValue(

        bill?.balance_amount ??

        bill?.balanceAmount ??

        bill?.balance ??

        bill?.due_amount ??

        bill?.dueAmount

    );
}


/* ============================================================
   RETURN AMOUNT
   ============================================================ */

function getReturnAmount(bill) {

    return numberValue(

        bill?.return_amount ??

        bill?.returnAmount ??

        bill?.returned_amount ??

        bill?.returnedAmount

    );
}


/* ============================================================
   STATUS
   ============================================================ */

function getStatus(bill) {

    const returned =
        getReturnAmount(bill);

    const dbStatus =
        String(

            bill?.status ??

            bill?.bill_status ??

            bill?.billStatus ??

            ""

        )
            .trim()
            .toLowerCase();


    if (

        returned > 0 ||

        dbStatus === "return" ||

        dbStatus === "returned"

    ) {

        return "return";
    }


    if (

        dbStatus === "pending" ||

        dbStatus === "pending bill" ||

        getBalance(bill) > 0

    ) {

        return "pending";
    }


    return "finished";
}


/* ============================================================
   STATUS TEXT
   ============================================================ */

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


/* ============================================================
   DATE
   ============================================================ */

function formatDate(value) {

    if (
        !value
    ) {

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
   TIME
   ============================================================ */

function getTime(bill) {

    return (

        bill?.bill_time ??

        bill?.billTime ??

        bill?.time ??

        bill?.created_time ??

        "-"
    );
}


/* ============================================================
   WOOD DATA
   ============================================================ */

function getWoodData(bill) {

    const possibleSources = [

        bill?.wood_data,

        bill?.woodData,

        bill?.wood_details,

        bill?.woodDetails,

        bill?.wood_items,

        bill?.woodItems,

        bill?.items,

        bill?.wood

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

            return array;
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

        item?.name ??

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


    return String(name);
}


/* ============================================================
   QUALITY
   ============================================================ */

function getQuality(item) {

    const quality =

        item?.quality ??

        item?.Quality ??

        item?.woodQuality ??

        item?.wood_quality ??

        item?.grade ??

        "-";


    return String(
        quality
    );
}


/* ============================================================
   BREADTH
   ============================================================ */

function getBreadth(item) {

    return numberValue(

        item?.breadth ??

        item?.breadthInch ??

        item?.breadth_inch

    );
}


/* ============================================================
   THICKNESS
   ============================================================ */

function getThickness(item) {

    return numberValue(

        item?.thickness ??

        item?.thicknessInch ??

        item?.thickness_inch

    );
}


/* ============================================================
   RATE
   ============================================================ */

function getRate(item) {

    return numberValue(

        item?.rate ??

        item?.pricePerCft ??

        item?.price_per_cft

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

        item?.CFT

    );
}


/* ============================================================
   WOOD AMOUNT
   ============================================================ */

function getWoodAmount(item) {

    return numberValue(

        item?.amount ??

        item?.totalAmount ??

        item?.total_amount ??

        item?.woodAmount ??

        item?.wood_amount

    );
}


/* ============================================================
   PIECES
   ============================================================ */

function getPieces(item) {

    if (
        Array.isArray(item?.pieces) &&
        item.pieces.length > 0
    ) {

        return item.pieces;
    }


    if (
        Array.isArray(item?.lengths) &&
        item.lengths.length > 0
    ) {

        return item.lengths;
    }


    return [];
}


/* ============================================================
   LENGTH
   ============================================================ */

function getPieceLength(piece) {

    const length =
        numberValue(

            piece?.length ??

            piece?.feet ??

            piece?.len

        );


    const extra =
        numberValue(

            piece?.extraLength ??

            piece?.extra_length ??

            piece?.extra

        );


    return length + extra;
}


/* ============================================================
   PIECE QTY
   ============================================================ */

function getPieceQty(piece) {

    const qty =
        numberValue(

            piece?.qty ??

            piece?.quantity ??

            piece?.pieces ??

            piece?.count

        );


    return qty > 0
        ? qty
        : 1;
}


/* ============================================================
   FALLBACK LENGTH
   ============================================================ */

function getItemLength(item) {

    return numberValue(

        item?.length ??

        item?.totalLength ??

        item?.total_length

    );
}


/* ============================================================
   FALLBACK QTY
   ============================================================ */

function getItemQty(item) {

    return numberValue(

        item?.qty ??

        item?.quantity ??

        item?.pieces_count ??

        item?.piecesCount

    );
}


/* ============================================================
   LENGTH TEXT
   ============================================================ */

function getLengthText(item) {

    const pieces =
        getPieces(item);


    if (
        pieces.length > 0
    ) {

        const values =
            pieces
                .map(
                    function(piece) {

                        const length =
                            getPieceLength(
                                piece
                            );

                        return length > 0
                            ? String(length)
                            : "";
                    }
                )
                .filter(Boolean);


        if (
            values.length > 0
        ) {

            return values.join(", ");
        }
    }


    const length =
        getItemLength(item);


    return length > 0
        ? String(length)
        : "-";
}


/* ============================================================
   QUANTITY TEXT
   ============================================================ */

function getQuantityText(item) {

    const pieces =
        getPieces(item);


    if (
        pieces.length > 0
    ) {

        const values =
            pieces
                .map(
                    function(piece) {

                        const qty =
                            getPieceQty(
                                piece
                            );

                        return qty > 0
                            ? String(qty)
                            : "";
                    }
                )
                .filter(Boolean);


        if (
            values.length > 0
        ) {

            return values.join(", ");
        }
    }


    const qty =
        getItemQty(item);


    return qty > 0
        ? String(qty)
        : "-";
}


/* ============================================================
   CFT CALCULATION FALLBACK
   ============================================================ */

function calculateCFTFromPieces(item) {

    const pieces =
        getPieces(item);


    if (
        pieces.length === 0
    ) {

        return getCFT(item);
    }


    const breadth =
        getBreadth(item);

    const thickness =
        getThickness(item);


    let totalCFT = 0;


    pieces.forEach(
        function(piece) {

            const length =
                getPieceLength(
                    piece
                );

            const qty =
                getPieceQty(
                    piece
                );


            /*
               CFT formula:

               Breadth × Thickness × Length × Qty
               ---------------------------------
                         144

               This assumes inch dimensions
               and length in feet.
            */

            if (
                breadth > 0 &&
                thickness > 0 &&
                length > 0 &&
                qty > 0
            ) {

                totalCFT +=

                    (
                        breadth *
                        thickness *
                        length *
                        qty
                    ) / 144;
            }
        }
    );


    return totalCFT;
}


/* ============================================================
   GET FINAL CFT
   ============================================================ */

function getFinalCFT(item) {

    const stored =
        getCFT(item);


    if (
        stored > 0
    ) {

        return stored;
    }


    return calculateCFTFromPieces(
        item
    );
}


/* ============================================================
   LOAD BILLS
   ============================================================ */

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
                    class="loading-cell"
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
                "Bills array not found."
            );
        }


        console.log(
            "TOTAL BILLS:",
            allBills.length
        );


        updateSummary();

        applyFilters();

    }
    catch (error) {

        console.error(
            "HISTORY LOAD ERROR:",
            error
        );


        if (
            historyBody
        ) {

            historyBody.innerHTML = `

                <tr>

                    <td
                        colspan="15"
                        class="error-cell"
                    >

                        Failed to load bills

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
    }
}


/* ============================================================
   DISPLAY BILLS
   ============================================================ */

function displayBills(
    bills
) {

    if (
        !historyBody
    ) {

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
                    class="empty-cell"
                >

                    <div
                        style="
                            font-size:32px;
                            margin-bottom:8px;
                        "
                    >
                        🔍
                    </div>

                    No bills found

                    <br>

                    <small>
                        Try another search or filter.
                    </small>

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
                getPaymentMode(bill);


            const returnAmount =
                getReturnAmount(bill);


            const row =
                document.createElement(
                    "tr"
                );


            /*
               IMPORTANT FOR CSS

               pendingRow = red
               returnRow  = yellow
               finishedRow = normal
            */

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
                    class="
                        payment-pill
                        paymentNone
                    "
                >
                    -
                </span>

            `;


            if (
                paymentMode === "CASH"
            ) {

                paymentModeHTML = `

                    <span
                        class="
                            payment-pill
                            paymentCash
                        "
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
                        class="
                            payment-pill
                            paymentUpi
                        "
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
                            ₹ ${formatMoney(
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
                            class="
                                returnBtn
                                returnedBtn
                            "
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


            const billNumber =
                getBillNumber(
                    bill
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <span
                        class="bill-number"
                    >
                        ${escapeHtml(
                            billNumber
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

                    <span
                        class="customer-name"
                    >
                        ${escapeHtml(
                            getCustomerName(
                                bill
                            )
                        )}
                    </span>

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

                        bill?.date ??

                        bill?.created_at

                    )}

                </td>


                <td>

                    <span
                        class="payment-type"
                    >
                        ${escapeHtml(
                            getPaymentType(
                                bill
                            )
                        )}
                    </span>

                </td>


                <td>

                    ${paymentModeHTML}

                </td>


                <td>

                    ₹ ${formatMoney(
                        getGrandTotal(
                            bill
                        )
                    )}

                </td>


                <td>

                    ₹ ${formatMoney(
                        getAdvance(
                            bill
                        )
                    )}

                </td>


                <td
                    class="
                        ${
                            getBalance(
                                bill
                            ) > 0
                                ? "balance-due"
                                : "balance-zero"
                        }
                    "
                >

                    ₹ ${formatMoney(
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
                        class="
                            status
                            ${status}
                        "
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


/* ============================================================
   SUMMARY
   ============================================================ */

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


/* ============================================================
   RESULT COUNT
   ============================================================ */

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


/* ============================================================
   FILTER
   ============================================================ */

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
        selectedStatus !== "all"
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


/* ============================================================
   LOAD JSPDF
   ============================================================ */

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


            script.async = true;


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
                                "jsPDF loaded but unavailable."
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


/* ============================================================
   PDF CELL
   ============================================================ */

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


/* ============================================================
   PDF HEADER
   ============================================================ */

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
        18
    );


    doc.text(
        "AMMAN SAW MILL",
        pageWidth / 2,
        13,
        {
            align: "center"
        }
    );


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(
        8
    );


    doc.text(
        "Wood Timber & Saw Mill",
        pageWidth / 2,
        18,
        {
            align: "center"
        }
    );


    doc.text(
        "Mobile : 9443076409 , 9715050908",
        pageWidth / 2,
        22,
        {
            align: "center"
        }
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(
        8
    );


    doc.text(
        "GST : 33DLKPK5760D1Z5",
        pageWidth / 2,
        26,
        {
            align: "center"
        }
    );


    doc.setLineWidth(
        0.5
    );


    doc.line(
        10,
        29,
        pageWidth - 10,
        29
    );
}


/* ============================================================
   CUSTOMER PDF
   ============================================================ */

function addCustomerPDFDetails(
    doc,
    bill,
    startY
) {

    const x = 10;

    const labelWidth = 30;

    const valueWidth = 65;

    const rowHeight = 8;


    const rows = [

        [
            "Bill No",
            getBillNumber(
                bill
            ),
            "Date",
            formatDate(

                bill?.bill_date ??

                bill?.billDate ??

                bill?.date ??

                bill?.created_at

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
            "Time",
            getTime(
                bill
            )
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
                labelWidth,
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
                x + labelWidth,
                y,
                valueWidth,
                rowHeight,
                {
                    fontSize: 7
                }
            );


            pdfCell(
                doc,
                row[2],
                x +
                labelWidth +
                valueWidth,
                y,
                labelWidth,
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
                labelWidth +
                valueWidth +
                labelWidth,
                y,
                valueWidth,
                rowHeight,
                {
                    fontSize: 7
                }
            );


            y += rowHeight;

        }
    );


    return y;
}


/* ============================================================
   WOOD PDF
   ============================================================ */

function addWoodPDF(
    doc,
    bill,
    startY
) {

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


    /*
       A4 width = 210mm
       Left/right margin = 10mm
       Available = 190mm
    */

    const columns = [

        {
            title: "S.No",
            width: 9
        },

        {
            title: "Wood",
            width: 23
        },

        {
            title: "Quality",
            width: 18
        },

        {
            title: "Size",
            width: 25
        },

        {
            title: "Length",
            width: 25
        },

        {
            title: "Qty",
            width: 13
        },

        {
            title: "CFT",
            width: 18
        },

        {
            title: "Rate",
            width: 22
        },

        {
            title: "Amount",
            width: 37
        }

    ];


    let headerX =
        margin;


    columns.forEach(
        function(column) {

            pdfCell(
                doc,
                column.title,
                headerX,
                y,
                column.width,
                8,
                {
                    fill: true,
                    bold: true,
                    fontSize: 6.2,
                    align: "center"
                }
            );


            headerX +=
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
                fontSize: 8,
                align: "center"
            }
        );


        return y + 15;
    }


    let serialNo =
        1;


    woodData.forEach(
        function(item) {

            let pieces =
                getPieces(
                    item
                );


            /*
               If pieces are not available,
               create one fallback row.
            */

            if (
                pieces.length === 0
            ) {

                pieces = [

                    {
                        length:
                            getItemLength(
                                item
                            ),

                        extraLength:
                            0,

                        qty:
                            getItemQty(
                                item
                            ) || 1
                    }

                ];
            }


            const woodName =
                getWoodName(
                    item
                );


            const quality =
                getQuality(
                    item
                );


            const size =
                `${getBreadth(
                    item
                )} x ${getThickness(
                    item
                )}`;


            const rate =
                getRate(
                    item
                );


            const totalCFT =
                getFinalCFT(
                    item
                );


            const totalAmount =
                getWoodAmount(
                    item
                );


            /*
               Calculate total measurement
               so CFT and amount can be
               divided correctly between
               individual length rows.
            */

            let totalMeasure =
                0;


            pieces.forEach(
                function(piece) {

                    const length =
                        getPieceLength(
                            piece
                        );

                    const qty =
                        getPieceQty(
                            piece
                        );


                    totalMeasure +=
                        length * qty;
                }
            );


            /*
               If there is no measurement,
               avoid division by zero.
            */

            if (
                totalMeasure <= 0
            ) {

                totalMeasure =
                    pieces.length;
            }


            pieces.forEach(
                function(
                    piece
                ) {

                    if (
                        y >
                        pageHeight - 35
                    ) {

                        doc.addPage();


                        addPDFHeader(
                            doc,
                            bill
                        );


                        y = 34;


                        let newHeaderX =
                            margin;


                        columns.forEach(
                            function(
                                column
                            ) {

                                pdfCell(
                                    doc,
                                    column.title,
                                    newHeaderX,
                                    y,
                                    column.width,
                                    8,
                                    {
                                        fill: true,
                                        bold: true,
                                        fontSize: 6.2,
                                        align: "center"
                                    }
                                );


                                newHeaderX +=
                                    column.width;
                            }
                        );


                        y += 8;
                    }


                    const length =
                        getPieceLength(
                            piece
                        );


                    const qty =
                        getPieceQty(
                            piece
                        );


                    const measure =
                        length * qty;


                    const proportion =

                        totalMeasure > 0

                            ? measure /
                              totalMeasure

                            : 1 /
                              pieces.length;


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

                        length > 0
                            ? String(length)
                            : "-",

                        qty > 0
                            ? String(qty)
                            : "-",

                        pieceCFT.toFixed(2),

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

                            let alignment =
                                "left";


                            if (

                                colIndex === 0 ||

                                colIndex === 2 ||

                                colIndex === 3 ||

                                colIndex === 4 ||

                                colIndex === 5 ||

                                colIndex === 6

                            ) {

                                alignment =
                                    "center";

                            }
                            else if (

                                colIndex === 7 ||

                                colIndex === 8

                            ) {

                                alignment =
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
                                    fontSize: 6.1,
                                    align: alignment
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

    const allWoodCFT =
        woodData.reduce(
            function(
                total,
                item
            ) {

                return total +
                    getFinalCFT(
                        item
                    );

            },
            0
        );


    if (
        y >
        pageHeight - 25
    ) {

        doc.addPage();

        addPDFHeader(
            doc,
            bill
        );

        y = 34;
    }


    pdfCell(
        doc,
        "",
        margin,
        y,
        137,
        9,
        {
            fill: true
        }
    );


    pdfCell(
        doc,
        "WOOD TOTAL CFT",
        margin + 137,
        y,
        28,
        9,
        {
            fill: true,
            bold: true,
            fontSize: 7,
            align: "center"
        }
    );


    pdfCell(
        doc,
        allWoodCFT.toFixed(2),
        margin + 165,
        y,
        25,
        9,
        {
            fill: true,
            bold: true,
            fontSize: 7,
            align: "right"
        }
    );


    y += 14;


    return y;
}


/* ============================================================
   CFT SUMMARY
   SAME WOOD + SAME QUALITY
   ============================================================ */

function addCFTSummaryPDF(
    doc,
    bill,
    startY
) {

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
            fill: true,
            bold: true,
            fontSize: 7,
            align: "center"
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
            fill: true,
            bold: true,
            fontSize: 7,
            align: "center"
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
            fill: true,
            bold: true,
            fontSize: 7,
            align: "center"
        }
    );


    y += 8;


    const grouped =
        new Map();


    getWoodData(
        bill
    ).forEach(
        function(item) {

            const wood =
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
                getFinalCFT(
                    item
                );


            const key =

                wood
                    .toLowerCase() +

                "|" +

                quality
                    .toLowerCase();


            if (
                grouped.has(
                    key
                )
            ) {

                grouped.get(
                    key
                ).cft +=
                    cft;

            }
            else {

                grouped.set(
                    key,
                    {

                        wood:
                            wood,

                        quality:
                            quality,

                        cft:
                            cft

                    }
                );
            }
        }
    );


    /*
       If there are no CFT values
    */

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
                fontSize: 7,
                align: "center"
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
                fontSize: 7
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
                fontSize: 7,
                align: "right"
            }
        );


        return y + 16;
    }


    let serial =
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
                    doc,
                    bill
                );


                y = 34;
            }


            pdfCell(
                doc,
                serial,
                margin,
                y,
                col1,
                8,
                {
                    fontSize: 7,
                    align: "center"
                }
            );


            pdfCell(
                doc,
                `${group.wood} / Quality ${group.quality}`,
                margin + col1,
                y,
                col2,
                8,
                {
                    fontSize: 7
                }
            );


            pdfCell(
                doc,
                group.cft.toFixed(2) +
                    " CFT",
                margin +
                col1 +
                col2,
                y,
                col3,
                8,
                {
                    fontSize: 7,
                    align: "right"
                }
            );


            grandCFT +=
                group.cft;


            y += 8;

            serial++;
        }
    );


    /*
       GRAND CFT
    */

    if (
        y >
        pageHeight - 25
    ) {

        doc.addPage();

        addPDFHeader(
            doc,
            bill
        );

        y = 34;
    }


    pdfCell(
        doc,
        "",
        margin,
        y,
        col1,
        9,
        {
            fill: true
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
            fill: true,
            bold: true,
            fontSize: 8,
            align: "right"
        }
    );


    pdfCell(
        doc,
        grandCFT.toFixed(2) +
            " CFT",
        margin +
        col1 +
        col2,
        y,
        col3,
        9,
        {
            fill: true,
            bold: true,
            fontSize: 8,
            align: "right"
        }
    );


    return y + 17;
}


/* ============================================================
   OTHER CHARGES PDF
   ============================================================ */

function addChargesPDF(
    doc,
    bill,
    startY
) {

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
            fill: true,
            bold: true,
            fontSize: 7,
            align: "center"
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
            fill: true,
            bold: true,
            fontSize: 7,
            align: "center"
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
            fill: true,
            bold: true,
            fontSize: 7,
            align: "center"
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
        labour > 0
    ) {

        rows.push(
            [
                "Labour Charge",
                labour
            ]
        );
    }


    /*
       MAIN OTHER CHARGE
    */

    const other =
        getOtherCharge(
            bill
        );


    if (
        other > 0
    ) {

        rows.push(
            [
                "Other Charge",
                other
            ]
        );
    }


    /*
       ADDITIONAL OTHER ITEMS
    */

    const additionalItems =
        getOtherData(
            bill
        );


    console.log(
        "PDF ADDITIONAL OTHER DATA:",
        additionalItems
    );


    additionalItems.forEach(
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
               Keep named items even
               when amount is zero.
            */

            if (
                amount > 0 ||
                String(
                    name
                ).trim() !==
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
       If nothing exists
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
                    doc,
                    bill
                );

                y = 34;
            }


            pdfCell(
                doc,
                index + 1,
                margin,
                y,
                col1,
                8,
                {
                    fontSize: 7,
                    align: "center"
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
                    fontSize: 7
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
                    fontSize: 7,
                    align: "right"
                }
            );


            y += 8;
        }
    );


    /*
       SHOW OTHERS TOTAL
    */

    const total =
        getOthersTotal(
            bill
        );


    if (
        y >
        pageHeight - 25
    ) {

        doc.addPage();

        addPDFHeader(
            doc,
            bill
        );

        y = 34;
    }


    pdfCell(
        doc,
        "",
        margin,
        y,
        col1,
        9,
        {
            fill: true
        }
    );


    pdfCell(
        doc,
        "OTHERS TOTAL",
        margin + col1,
        y,
        col2,
        9,
        {
            fill: true,
            bold: true,
            fontSize: 8,
            align: "right"
        }
    );


    pdfCell(
        doc,
        "Rs. " +
            formatMoney(
                total
            ),
        margin +
        col1 +
        col2,
        y,
        col3,
        9,
        {
            fill: true,
            bold: true,
            fontSize: 8,
            align: "right"
        }
    );


    return y + 17;
}


/* ============================================================
   TOTALS PDF
   ============================================================ */

function addTotalsPDF(
    doc,
    bill,
    startY
) {

    const pageHeight =
        doc.internal.pageSize.getHeight();


    const x = 105;

    const width = 95;


    let y =
        startY;


    const rows = [

        [
            "Wood Total",
            getWoodTotal(
                bill
            )
        ],

        [
            "Labour Charge",
            getLabourCharge(
                bill
            )
        ],

        [
            "Other Charge",
            getOtherCharge(
                bill
            )
        ],

        [
            "Others Total",
            getOthersTotal(
                bill
            )
        ],

        [
            "Discount",
            getDiscount(
                bill
            )
        ],

        [
            "Grand Total",
            getGrandTotal(
                bill
            )
        ],

        [
            "Advance / Paid",
            getAdvance(
                bill
            )
        ],

        [
            "Balance",
            getBalance(
                bill
            )
        ]

    ];


    const returned =
        getReturnAmount(
            bill
        );


    if (
        returned > 0
    ) {

        rows.splice(
            rows.length - 2,
            0,
            [
                "Return Amount",
                returned
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

                y = 34;
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
                    width *
                    0.55,
                y,
                width *
                    0.45,
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


/* ============================================================
   CREATE COMPLETE PDF
   ============================================================ */

function createBillPDF(
    bill,
    jsPDF
) {

    const doc =
        new jsPDF(
            {
                orientation:
                    "portrait",

                unit:
                    "mm",

                format:
                    "a4"
            }
        );


    addPDFHeader(
        doc,
        bill
    );


    let y =
        34;


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
       WOOD
    */

    y =
        addWoodPDF(
            doc,
            bill,
            y
        );


    y += 2;


    /*
       CFT TOTAL
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
       TOTALS
    */

    addTotalsPDF(
        doc,
        bill,
        y
    );


    /*
       FOOTER ON ALL PAGES
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
            `Bill No: ${getBillNumber(
                bill
            )}`,
            width / 2,
            height - 7,
            {
                align: "center"
            }
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


/* ============================================================
   GET COMPLETE BILL
   ============================================================

   IMPORTANT FIX:

   /bills may return only summary fields.

   For PDF we first request:

       /bill/:id

   so wood_data, labour data,
   other charges, quality,
   pieces etc. can be received.
   ============================================================ */

async function getCompleteBill(
    id
) {

    console.log(
        "Fetching complete bill:",
        id
    );


    /*
       FIRST:
       Try individual bill API.
    */

    try {

        const response =
            await fetch(

                `${API_URL}/bill/${encodeURIComponent(
                    id
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
            response.ok
        ) {

            const result =
                await response.json();


            console.log(
                "INDIVIDUAL BILL RESPONSE:",
                result
            );


            const completeBill =

                result?.bill ??

                result?.data ??

                result?.result ??

                result;


            if (
                completeBill &&
                typeof completeBill ===
                    "object"
            ) {

                return completeBill;
            }
        }

    }
    catch (error) {

        console.warn(
            "Individual bill API failed:",
            error
        );
    }


    /*
       SECOND:
       Fall back to history bill.
    */

    const existing =
        allBills.find(
            function(item) {

                return String(
                    getBillId(
                        item
                    )
                ) ===
                String(id);

            }
        );


    if (
        existing
    ) {

        return existing;
    }


    throw new Error(
        "Complete bill data not found."
    );
}


/* ============================================================
   OPEN PDF
   ============================================================

   SAME TAB
   NO DOWNLOAD
   NO html2pdf
   NO pdfHTML
   ============================================================ */

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


        if (
            button
        ) {

            button.disabled =
                true;

            button.textContent =
                "Creating...";
        }


        /*
           LOAD JSPDF
        */

        const jsPDF =
            await loadJsPDF();


        /*
           GET COMPLETE BILL
        */

        const bill =
            await getCompleteBill(
                billId
            );


        if (
            !bill
        ) {

            throw new Error(
                "Bill data not found."
            );
        }


        console.log(
            "COMPLETE BILL:",
            bill
        );


        console.log(
            "BILL NUMBER:",
            getBillNumber(
                bill
            )
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


        console.log(
            "LABOUR:",
            getLabourCharge(
                bill
            )
        );


        console.log(
            "OTHER:",
            getOtherCharge(
                bill
            )
        );


        console.log(
            "OTHERS TOTAL:",
            getOthersTotal(
                bill
            )
        );


        /*
           CREATE PDF
        */

        const doc =
            createBillPDF(
                bill,
                jsPDF
            );


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
            pdfBlob.size
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
           IMPORTANT

           This opens the generated
           PDF in the CURRENT TAB.

           It does NOT download it.

           It does NOT use:
             window.open()
             _blank
             download=""
             html2pdf
        */

        window.location.href =
            pdfURL;

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


/* ============================================================
   RETURN BILL
   ============================================================ */

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


    const total =
        getGrandTotal(
            bill
        );


    const value =
        prompt(

            `Enter Return Amount\n\n` +

            `Bill No: ${billNo}\n` +

            `Grand Total: ₹ ${formatMoney(
                total
            )}`

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
        total
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

            `Amount: ₹ ${formatMoney(
                returnAmount
            )}`

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
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            {
                                return_amount:
                                    returnAmount,

                                status:
                                    "return"
                            }
                        )
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


/* ============================================================
   ACTION EVENTS
   ============================================================ */

function attachActionEvents() {


    /*
       PDF BUTTONS
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
       RETURN BUTTONS
    */

    /* ============================================================
   RETURN BUTTON
   OPEN RETURN.HTML WITH SELECTED BILL ID
   ============================================================ */

function attachReturnPageEvents() {

    document
        .querySelectorAll(
            ".returnBtn:not(.returnedBtn)"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        const billId =
                            button.dataset.billId;

                        console.log(
                            "RETURN BUTTON CLICKED"
                        );

                        console.log(
                            "SELECTED BILL ID:",
                            billId
                        );

                        if (!billId) {

                            alert(
                                "Bill ID not found."
                            );

                            return;
                        }


                        /*
                         * Save selected Bill ID.
                         *
                         * return.html will read
                         * this value from localStorage.
                         */

                        localStorage.setItem(
                            "returnBillId",
                            String(billId)
                        );


                        /*
                         * Also save the bill number
                         * if it is available.
                         */

                        const bill =
                            allBills.find(
                                function(item) {

                                    return String(
                                        getBillId(item)
                                    ) ===
                                    String(billId);

                                }
                            );


                        if (bill) {

                            const billNo =
                                bill.bill_no ||
                                bill.billNo ||
                                "";

                            localStorage.setItem(
                                "returnBillNo",
                                String(billNo)
                            );

                        }


                        /*
                         * Go to Return page.
                         */

                        window.location.href =
                            "../html/return.html";

                    }
                );

            }
        );

}

/* ============================================================
   SEARCH BUTTON
   ============================================================ */

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


/* ============================================================
   SEARCH INPUT
   ============================================================ */

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

                event.preventDefault();

                applyFilters();
            }

        }
    );
}


/* ============================================================
   CLEAR SEARCH
   ============================================================ */

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


/* ============================================================
   STATUS FILTER
   ============================================================ */

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


/* ============================================================
   REFRESH
   ============================================================ */

if (
    refreshBtn
) {

    refreshBtn.addEventListener(
        "click",
        async function() {

            const oldText =
                refreshBtn.textContent;


            refreshBtn.disabled =
                true;


            refreshBtn.textContent =
                "↻ Loading...";


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


/* ============================================================
   INITIAL LOAD
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "HISTORY PAGE READY"
        );


        loadBills();

    }
);
