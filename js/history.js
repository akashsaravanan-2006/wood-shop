/* =========================================================
   HISTORY.JS
   BILL HISTORY + DIRECT PDF DOWNLOAD
   ========================================================= */

"use strict";

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


/* =========================================================
   DOM ELEMENTS
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


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let allBills = [];


/* =========================================================
   NUMBER HELPERS
   ========================================================= */

function num(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const n = Number(
        String(value)
            .replace(/,/g, "")
            .replace(/[₹$]/g, "")
            .trim()
    );

    return Number.isFinite(n)
        ? n
        : 0;
}


function money(value) {

    return num(value);

}


function fmt(value) {

    return money(value).toFixed(2);

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function esc(value) {

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

function parseJSON(
    value,
    fallback = []
) {

    if (Array.isArray(value)) {

        return value;

    }

    if (
        value &&
        typeof value === "object"
    ) {

        return value;

    }

    if (
        typeof value !== "string" ||
        !value.trim()
    ) {

        return fallback;

    }

    try {

        return JSON.parse(value);

    } catch {

        return fallback;

    }

}


/* =========================================================
   BILL ID
   ========================================================= */

function billId(bill) {

    return (
        bill?.id ??
        bill?.bill_id ??
        bill?.billId ??
        bill?._id ??
        ""
    );

}


/* =========================================================
   PAYMENT TYPE
   ========================================================= */

function paymentType(bill) {

    return String(

        bill?.payment_type ??
        bill?.paymentType ??
        "-"

    )
        .trim()
        .toUpperCase() || "-";

}


/* =========================================================
   PAYMENT MODE
   ========================================================= */

function paymentMode(bill) {

    const mode = String(

        bill?.payment_mode ??
        bill?.paymentMode ??
        ""

    )
        .trim()
        .toUpperCase();


    if (mode === "UPI") {

        return "UPI";

    }


    if (mode === "CASH") {

        return "CASH";

    }


    return "-";

}


/* =========================================================
   CUSTOMER NAME
   ========================================================= */

function customerName(bill) {

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

function customerMobile(bill) {

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

function customerPlace(bill) {

    return (
        bill?.customer_place ??
        bill?.customerPlace ??
        bill?.place ??
        "-"
    );

}


/* =========================================================
   GRAND TOTAL
   ========================================================= */

function grandTotal(bill) {

    return money(

        bill?.grand_total ??
        bill?.grandTotal

    );

}


/* =========================================================
   ADVANCE
   ========================================================= */

function advance(bill) {

    return money(

        bill?.advance_amount ??
        bill?.advanceAmount

    );

}


/* =========================================================
   BALANCE
   ========================================================= */

function balance(bill) {

    return money(

        bill?.balance_amount ??
        bill?.balanceAmount

    );

}


/* =========================================================
   RETURN AMOUNT
   ========================================================= */

function returnAmount(bill) {

    return money(

        bill?.return_amount ??
        bill?.returnAmount

    );

}


/* =========================================================
   WOOD TOTAL
   ========================================================= */

function woodTotal(bill) {

    return money(

        bill?.wood_total ??
        bill?.woodTotal

    );

}


/* =========================================================
   LABOUR CHARGE
   ========================================================= */

function labourCharge(bill) {

    return money(

        bill?.labour_charge ??
        bill?.labourCharge

    );

}


/* =========================================================
   OTHER CHARGE
   ========================================================= */

function otherCharge(bill) {

    return money(

        bill?.other_charge ??
        bill?.otherCharge

    );

}


/* =========================================================
   OTHERS TOTAL
   ========================================================= */

function othersTotal(bill) {

    return money(

        bill?.others_total ??
        bill?.othersTotal

    );

}


/* =========================================================
   DISCOUNT
   ========================================================= */

function discount(bill) {

    return money(

        bill?.discount_amount ??
        bill?.discountAmount ??
        bill?.discount

    );

}


/* =========================================================
   WOOD DATA
   ========================================================= */

function woodData(bill) {

    return parseJSON(

        bill?.wood_data ??
        bill?.woodData ??
        []

    );

}


/* =========================================================
   OTHER DATA
   ========================================================= */

function othersData(bill) {

    return parseJSON(

        bill?.others_data ??
        bill?.othersData ??
        []

    );

}


/* =========================================================
   DATE
   ========================================================= */

function dateText(value) {

    if (!value) {

        return "-";

    }

    const d = new Date(value);


    if (Number.isNaN(d.getTime())) {

        return String(value);

    }


    return d.toLocaleDateString("en-IN");

}


/* =========================================================
   STATUS
   ========================================================= */

function getStatus(bill) {

    const raw = String(

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

        returnAmount(bill) > 0 ||
        raw === "return" ||
        raw === "returned"

    ) {

        return "return";

    }


    /*
       PENDING
    */

    if (

        balance(bill) > 0 ||
        raw === "pending"

    ) {

        return "pending";

    }


    /*
       DELIVERED
    */

    return "finished";

}


/* =========================================================
   STATUS TEXT
   ========================================================= */

function statusText(bill) {

    const s = getStatus(bill);


    if (s === "return") {

        return "RETURNED";

    }


    if (s === "pending") {

        return "PENDING";

    }


    return "DELIVERED";

}


/* =========================================================
   PAYMENT HTML
   ========================================================= */

function paymentHTML(mode) {

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
            -
        </span>
    `;

}


/* =========================================================
   STATUS HTML
   ========================================================= */

function statusHTML(bill) {

    const s = getStatus(bill);


    return `
        <span class="status ${s}">
            ${statusText(bill)}
        </span>
    `;

}


/* =========================================================
   LOAD BILL HISTORY
   ========================================================= */

async function loadBills() {

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


        if (Array.isArray(data)) {

            allBills = data;

        }

        else if (
            Array.isArray(data?.bills)
        ) {

            allBills = data.bills;

        }

        else if (
            Array.isArray(data?.result)
        ) {

            allBills = data.result;

        }

        else {

            throw new Error(
                data?.message ||
                "Invalid bills response"
            );

        }


        console.log(
            "HISTORY RESPONSE:",
            data
        );


        console.log(
            "TOTAL BILLS:",
            allBills.length
        );


        applyFilters();


    } catch (error) {

        console.error(
            "HISTORY LOAD ERROR:",
            error
        );


        historyBody.innerHTML = `
            <tr>
                <td
                    colspan="15"
                    class="error-cell"
                >
                    Unable to load bill history.
                    <br>
                    <small>
                        ${esc(error.message)}
                    </small>
                </td>
            </tr>
        `;


        updateSummary([]);

        updateResultCount(0);

    }

}


/* =========================================================
   DISPLAY BILLS
   ========================================================= */

function displayBills(bills) {

    historyBody.innerHTML = "";


    if (!Array.isArray(bills)) {

        bills = [];

    }


    updateSummary(bills);

    updateResultCount(
        bills.length
    );


    if (!bills.length) {

        historyBody.innerHTML = `
            <tr>
                <td
                    colspan="15"
                    class="empty-cell"
                >
                    <div
                        style="
                            font-size:32px
                        "
                    >
                        ⌕
                    </div>

                    No bills found

                    <br>

                    <small>
                        Try another search
                        or filter.
                    </small>
                </td>
            </tr>
        `;

        return;

    }


    bills.forEach(
        (bill, index) => {

            const id =
                billId(bill);


            const no =
                bill?.bill_no ??
                bill?.billNo ??
                `BILL-${id}`;


            const cid =
                bill?.customer_id ??
                bill?.customerId ??
                "-";


            const gt =
                grandTotal(bill);


            const adv =
                advance(bill);


            const bal =
                balance(bill);


            const ret =
                returnAmount(bill);


            const status =
                getStatus(bill);


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    <span
                        class="bill-number"
                    >
                        ${esc(no)}
                    </span>
                </td>


                <td>
                    <span
                        class="customer-id"
                    >
                        ${esc(cid)}
                    </span>
                </td>


                <td>
                    <span
                        class="customer-name"
                    >
                        ${esc(
                            customerName(bill)
                        )}
                    </span>
                </td>


                <td>
                    ${esc(
                        customerMobile(bill)
                    )}
                </td>


                <td>
                    ${esc(
                        customerPlace(bill)
                    )}
                </td>


                <td>
                    ${esc(
                        dateText(
                            bill?.bill_date ??
                            bill?.billDate ??
                            bill?.date ??
                            bill?.created_at
                        )
                    )}
                </td>


                <td>
                    <span
                        class="payment-type"
                    >
                        ${esc(
                            paymentType(bill)
                        )}
                    </span>
                </td>


                <td>
                    ${paymentHTML(
                        paymentMode(bill)
                    )}
                </td>


                <td
                    class="money"
                >
                    ₹ ${fmt(gt)}
                </td>


                <td
                    class="money"
                >
                    ₹ ${fmt(adv)}
                </td>


                <td
                    class="
                        money
                        ${
                            bal > 0
                                ? "balance-due"
                                : "balance-zero"
                        }
                    "
                >
                    ₹ ${fmt(bal)}
                </td>


                <td
                    class="money"
                >
                    ₹ ${fmt(ret)}
                </td>


                <td>
                    ${statusHTML(bill)}
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
                            data-bill-id="${esc(id)}"
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
                                        data-bill-id="${esc(id)}"
                                    >
                                        Return
                                    </button>
                                `
                                : ""
                        }

                    </div>

                </td>

            `;


            historyBody.appendChild(row);

        }
    );


    bindActions();

}


/* =========================================================
   SUMMARY
   ========================================================= */

function updateSummary(bills) {

    let pending = 0;

    let finished = 0;

    let returned = 0;


    bills.forEach(
        bill => {

            const s =
                getStatus(bill);


            if (s === "pending") {

                pending++;

            }

            else if (
                s === "return"
            ) {

                returned++;

            }

            else {

                finished++;

            }

        }
    );


    totalBills.textContent =
        bills.length;


    pendingBills.textContent =
        pending;


    finishedBills.textContent =
        finished;


    returnBills.textContent =
        returned;

}


/* =========================================================
   RESULT COUNT
   ========================================================= */

function updateResultCount(count) {

    resultCount.textContent =
        `${count} ${
            count === 1
                ? "bill"
                : "bills"
        }`;

}


/* =========================================================
   SEARCH + FILTER
   ========================================================= */

function applyFilters() {

    const search =
        String(
            searchInput?.value || ""
        )
            .trim()
            .toLowerCase();


    const selected =
        String(
            statusFilter?.value ||
            "all"
        )
            .toLowerCase();


    const filtered =
        allBills.filter(
            bill => {

                const text = [

                    bill?.bill_no,

                    bill?.billNo,

                    bill?.customer_id,

                    bill?.customerId,

                    customerName(bill),

                    customerMobile(bill),

                    customerPlace(bill),

                    paymentType(bill),

                    paymentMode(bill),

                    statusText(bill)

                ]
                    .map(
                        value =>
                            String(
                                value ?? ""
                            ).toLowerCase()
                    )
                    .join(" ");


                return (

                    (
                        !search ||
                        text.includes(search)
                    )

                    &&

                    (
                        selected === "all" ||
                        getStatus(bill) ===
                            selected
                    )

                );

            }
        );


    displayBills(filtered);


    if (clearSearchBtn) {

        clearSearchBtn.classList.toggle(
            "visible",
            Boolean(search)
        );

    }

}


/* =========================================================
   ACTION BUTTONS
   ========================================================= */

function bindActions() {


    /* =====================================================
       PDF BUTTON
       ===================================================== */

    document
        .querySelectorAll(
            ".pdfBtn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.billId;


                        console.log(
                            "PDF CLICK:",
                            id
                        );


                        downloadBillPDF(
                            id,
                            button
                        );

                    }
                );

            }
        );


    /* =====================================================
       RETURN BUTTON
       
       IMPORTANT:
       DO NOT CALL handleReturn()
       
       Open return.html directly.
       ===================================================== */

    document
        .querySelectorAll(
            ".returnBtn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.billId;


                        if (!id) {

                            alert(
                                "Bill ID not found."
                            );

                            return;

                        }


                        console.log(
                            "RETURN CLICK:",
                            id
                        );


                        /*
                           Open Return Page
                           and send Bill ID
                        */

                        window.location.href =
                            `return.html?billId=${encodeURIComponent(
                                id
                            )}`;

                    }
                );

            }
        );

}


/* =========================================================
   PDF DATA HELPERS
   ========================================================= */

function woodRowsPDF(data) {

    if (
        !Array.isArray(data) ||
        !data.length
    ) {

        return `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center
                    "
                >
                    No wood details
                </td>
            </tr>
        `;

    }


    return data
        .map(
            (item, i) => {

                let type =
                    item?.woodType ??
                    item?.wood_type ??
                    "-";


                if (
                    String(type)
                        .toLowerCase() ===
                    "other"
                ) {

                    type =
                        item?.otherWood ??
                        item?.other_wood ??
                        "Other";

                }


                const breadth =

                    item?.breadth ??
                    item?.breadthInch ??
                    item?.breadth_inch ??
                    "-";


                const thickness =

                    item?.thickness ??
                    item?.thicknessInch ??
                    item?.thickness_inch ??
                    "-";


                const cft =
                    money(

                        item?.cubicFeet ??
                        item?.cubic_feet ??
                        item?.cft

                    );


                const amount =
                    money(

                        item?.amount ??
                        item?.totalAmount ??
                        item?.total_amount

                    );


                let lengthText =
                    "-";


                if (
                    Array.isArray(
                        item?.lengths
                    )
                ) {

                    lengthText =
                        item.lengths
                            .map(
                                x => {

                                    const length =
                                        num(
                                            x?.length ??
                                            x?.feet
                                        );


                                    const extra =
                                        num(
                                            x?.extraLength ??
                                            x?.extra_length
                                        );


                                    const qty =
                                        num(
                                            x?.qty ??
                                            x?.quantity
                                        );


                                    return `
                                        ${fmt(
                                            length +
                                            extra
                                        )}
                                        ft × ${qty}
                                    `;

                                }
                            )
                            .join(
                                "<br>"
                            );

                }

                else if (
                    item?.length !==
                    undefined
                ) {

                    const length =
                        num(
                            item.length
                        );


                    const extra =
                        num(
                            item?.extraLength ??
                            item?.extra_length
                        );


                    const qty =
                        num(
                            item?.qty ??
                            item?.quantity
                        );


                    lengthText =
                        `
                            ${fmt(
                                length +
                                extra
                            )}
                            ft × ${qty}
                        `;

                }


                return `

                    <tr>

                        <td>
                            ${i + 1}
                        </td>

                        <td>
                            ${esc(type)}
                        </td>

                        <td>
                            ${esc(breadth)}
                        </td>

                        <td>
                            ${esc(thickness)}
                        </td>

                        <td>
                            ${lengthText}
                        </td>

                        <td>
                            ${fmt(cft)}
                        </td>

                        <td>
                            ₹ ${fmt(amount)}
                        </td>

                    </tr>

                `;

            }
        )
        .join("");

}


/* =========================================================
   OTHER CHARGES PDF
   ========================================================= */

function otherRowsPDF(
    data,
    mainOther
) {

    let rows = "";


    if (mainOther > 0) {

        rows += `

            <tr>

                <td>
                    Other Charge
                </td>

                <td
                    class="right"
                >
                    ₹ ${fmt(mainOther)}
                </td>

            </tr>

        `;

    }


    if (Array.isArray(data)) {

        data.forEach(
            item => {

                if (!item) return;


                const name =

                    item?.name ??
                    item?.title ??
                    item?.description ??
                    item?.reason ??
                    "Other";


                rows += `

                    <tr>

                        <td>
                            ${esc(name)}
                        </td>

                        <td
                            class="right"
                        >
                            ₹ ${fmt(
                                item?.amount
                            )}
                        </td>

                    </tr>

                `;

            }
        );

    }


    return rows || `

        <tr>

            <td>
                No Other Charges
            </td>

            <td
                class="right"
            >
                ₹ 0.00
            </td>

        </tr>

    `;

}


/* =========================================================
   PDF TEMPLATE
   ========================================================= */

function pdfHTML(bill) {

    const id =
        billId(bill);


    const no =
        bill?.bill_no ??
        bill?.billNo ??
        `BILL-${id}`;


    const date =
        dateText(

            bill?.bill_date ??
            bill?.billDate ??
            bill?.date ??
            bill?.created_at

        );


    const time =

        bill?.bill_time ??
        bill?.billTime ??
        "-";


    const cid =

        bill?.customer_id ??
        bill?.customerId ??
        "-";


    const totalCFT =
        money(

            bill?.total_cft ??
            bill?.totalCFT

        );


    const wood =
        woodTotal(bill);


    const labour =
        labourCharge(bill);


    const other =
        otherCharge(bill);


    const others =
        othersTotal(bill);


    const disc =
        discount(bill);


    const total =
        grandTotal(bill);


    const adv =
        advance(bill);


    const bal =
        balance(bill);


    const ret =
        returnAmount(bill);


    return `

    <div class="pdf-bill">

      <style>

        *{
            box-sizing:border-box
        }


        .pdf-bill{

            width:794px;

            min-height:1123px;

            padding:34px;

            background:#fff;

            color:#172033;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            font-size:12px;

        }


        .pdf-head{

            text-align:center;

            border-bottom:
                2px solid #172033;

            padding-bottom:14px;

            margin-bottom:14px;

        }


        .pdf-head h1{

            margin:0;

            font-size:23px;

        }


        .pdf-head p{

            margin:4px 0;

            font-size:11px;

            color:#4b5563;

        }


        .bill-no{

            display:flex;

            justify-content:
                space-between;

            background:#f1f5f9;

            border:
                1px solid #d5dbe5;

            padding:9px 11px;

            font-weight:700;

        }


        .title{

            margin-top:14px;

            margin-bottom:7px;

            padding:7px 10px;

            background:#eef2f7;

            border-left:
                4px solid #2563eb;

            font-weight:800;

        }


        .grid{

            display:grid;

            grid-template-columns:
                1fr 1fr;

            gap:6px 18px;

            border:
                1px solid #d5dbe5;

            padding:10px;

        }


        .label{

            font-weight:700;

            color:#4b5563;

        }


        .pay{

            display:flex;

            gap:10px;

            margin-top:8px;

        }


        .pay div{

            flex:1;

            border:
                1px solid #d5dbe5;

            padding:8px;

        }


        .pay strong{

            display:block;

            margin-bottom:3px;

        }


        table{

            width:100%;

            border-collapse:
                collapse;

        }


        th,
        td{

            border:
                1px solid #d5dbe5;

            padding:6px 7px;

            vertical-align:
                middle;

        }


        th{

            background:#f1f5f9;

            text-align:left;

            font-weight:800;

        }


        .right{

            text-align:right;

        }


        .grand td{

            background:#eef6ff;

            font-size:14px;

            font-weight:900;

        }


        .discount{

            color:#b91c1c;

        }


        .footer{

            text-align:center;

            margin-top:22px;

            padding-top:12px;

            border-top:
                1px solid #d5dbe5;

            color:#6b7280;

        }

      </style>


      <div class="pdf-head">

        <h1>
            ஸ்ரீ அம்மன் சாமில்
        </h1>

        <p>
            தேக்கு, வேம்பு, பூவரசு வியாபாரம்
        </p>

        <p>
            Mobile :
            9443076409 ,
            9715050908
        </p>

        <p>
            GST :
            33DLKPK5760D1Z5
        </p>

      </div>


      <div class="bill-no">

        <span>
            BILL NO:
            ${esc(no)}
        </span>

        <span>
            DATE:
            ${esc(date)}
        </span>

      </div>


      <div class="title">
        Customer Information
      </div>


      <div class="grid">

        <div>
            <span class="label">
                Customer Name:
            </span>

            ${esc(
                customerName(bill)
            )}
        </div>


        <div>
            <span class="label">
                Mobile:
            </span>

            ${esc(
                customerMobile(bill)
            )}
        </div>


        <div>
            <span class="label">
                Place:
            </span>

            ${esc(
                customerPlace(bill)
            )}
        </div>


        <div>
            <span class="label">
                Customer ID:
            </span>

            ${esc(cid)}
        </div>


        <div>
            <span class="label">
                Date:
            </span>

            ${esc(date)}
        </div>


        <div>
            <span class="label">
                Time:
            </span>

            ${esc(time)}
        </div>

      </div>


      <div class="pay">

        <div>

            <strong>
                Payment Type
            </strong>

            ${esc(
                paymentType(bill)
            )}

        </div>


        <div>

            <strong>
                Payment Mode
            </strong>

            ${esc(
                paymentMode(bill)
            )}

        </div>


        <div>

            <strong>
                Status
            </strong>

            ${esc(
                statusText(bill)
            )}

        </div>

      </div>


      <div class="title">
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

            ${woodRowsPDF(
                woodData(bill)
            )}

        </tbody>

      </table>


      <div class="title">
        Wood Summary
      </div>


      <table>

        <tr>

            <td>
                Total CFT
            </td>

            <td class="right">
                ${fmt(totalCFT)}
            </td>

        </tr>


        <tr>

            <td>
                Wood Total
            </td>

            <td class="right">
                ₹ ${fmt(wood)}
            </td>

        </tr>

      </table>


      <div class="title">
        Labour & Other Charges
      </div>


      <table>

        <tr>

            <td>
                Labour Charge
            </td>

            <td class="right">
                ₹ ${fmt(labour)}
            </td>

        </tr>


        ${otherRowsPDF(
            othersData(bill),
            other
        )}


        <tr>

            <td>
                Other Charges Total
            </td>

            <td class="right">
                ₹ ${fmt(others)}
            </td>

        </tr>

      </table>


      <div class="title">
        Payment Summary
      </div>


      <table>

        <tr>

            <td>
                Wood Total
            </td>

            <td class="right">
                ₹ ${fmt(wood)}
            </td>

        </tr>


        <tr>

            <td>
                Labour Charge
            </td>

            <td class="right">
                ₹ ${fmt(labour)}
            </td>

        </tr>


        <tr>

            <td>
                Other Charge
            </td>

            <td class="right">
                ₹ ${fmt(other)}
            </td>

        </tr>


        <tr>

            <td>
                Additional Others
            </td>

            <td class="right">
                ₹ ${fmt(others)}
            </td>

        </tr>


        ${
            disc > 0
                ? `

                    <tr>

                        <td>
                            Discount
                        </td>

                        <td
                            class="
                                right
                                discount
                            "
                        >
                            - ₹ ${fmt(disc)}
                        </td>

                    </tr>

                  `
                : ""
        }


        <tr class="grand">

            <td>
                Grand Total
            </td>

            <td class="right">
                ₹ ${fmt(total)}
            </td>

        </tr>


        <tr>

            <td>
                Advance
            </td>

            <td class="right">
                ₹ ${fmt(adv)}
            </td>

        </tr>


        <tr>

            <td>
                Balance
            </td>

            <td class="right">
                ₹ ${fmt(bal)}
            </td>

        </tr>


        ${
            ret > 0
                ? `

                    <tr>

                        <td>
                            Return Amount
                        </td>

                        <td class="right">
                            ₹ ${fmt(ret)}
                        </td>

                    </tr>

                  `
                : ""
        }

      </table>


      <div class="footer">
        Thank You
      </div>


    </div>

    `;

}


/* =========================================================
   DIRECT PDF DOWNLOAD
   ========================================================= */

async function downloadBillPDF(
    id,
    button
) {

    const oldText =
        button?.textContent ||
        "PDF";


    try {

        if (button) {

            button.disabled =
                true;

            button.textContent =
                "Creating...";

        }


        if (
            typeof window.html2pdf !==
            "function"
        ) {

            throw new Error(
                "PDF library did not load. Check your internet connection."
            );

        }


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


        if (!response.ok) {

            throw new Error(
                `Bill API HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        const bill =
            result?.bill ??
            result?.data ??
            result;


        if (!bill) {

            throw new Error(
                "Bill data not found."
            );

        }


        const no =

            bill?.bill_no ??
            bill?.billNo ??
            `BILL-${id}`;


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.innerHTML =
            pdfHTML(bill);


        wrapper.style.position =
            "fixed";


        wrapper.style.left =
            "0";


        wrapper.style.top =
            "0";


        wrapper.style.width =
            "794px";


        wrapper.style.background =
            "#fff";


        wrapper.style.zIndex =
            "-9999";


        wrapper.style.opacity =
            "0.01";


        wrapper.style.pointerEvents =
            "none";


        document.body.appendChild(
            wrapper
        );


        await new Promise(
            resolve =>

                requestAnimationFrame(
                    () =>

                        requestAnimationFrame(
                            resolve
                        )

                )
        );


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    250
                )
        );


        const safeName =
            String(no).replace(
                /[\\/:*?"<>|]/g,
                "_"
            );


        await html2pdf()

            .set({

                margin: 8,

                filename:
                    `${safeName}.pdf`,

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

                    windowWidth: 794,

                    windowHeight:
                        Math.max(
                            1123,
                            wrapper.scrollHeight
                        )

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

            })

            .from(wrapper)

            .save();


        wrapper.remove();


        console.log(
            "PDF DOWNLOADED:",
            no
        );


    } catch (error) {

        console.error(
            "PDF ERROR:",
            error
        );


        alert(
            "Unable to create bill PDF.\n\n" +
            error.message
        );


    } finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                oldText;

        }

    }

}


/* =========================================================
   SEARCH BUTTON
   ========================================================= */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

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
        function () {

            applyFilters();

        }
    );


    searchInput.addEventListener(
        "keydown",
        function (event) {

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


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

if (clearSearchBtn) {

    clearSearchBtn.addEventListener(
        "click",
        function () {

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
        function () {

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
        async function () {

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

            } finally {

                refreshBtn.disabled =
                    false;

                refreshBtn.textContent =
                    oldText;

            }

        }
    );

}


/* =========================================================
   HOME
   ========================================================= */

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================"
        );

        console.log(
            "AMMAN SAW MILL - HISTORY.JS"
        );

        console.log(
            "HISTORY PAGE READY"
        );

        console.log(
            "================================"
        );


        loadBills();

    }
);
