/* =========================================================
   HISTORY.JS
   BILL HISTORY
   DIRECT PDF DOWNLOAD
   NO PRINT PAGE
   ========================================================= */

"use strict";


/* =========================================================
   BACKEND API
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
                .replace(/,/g, "")
                .replace(/[₹$]/g, "")
                .trim()
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
   JSON
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
        value.trim() === ""
    ) {
        return fallback;
    }

    try {

        return JSON.parse(value);

    }
    catch (error) {

        console.error(
            "JSON ERROR:",
            error
        );

        return fallback;
    }

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
   PAYMENT TYPE
   ========================================================= */

function getPaymentType(bill) {

    const value =
        bill?.payment_type ??
        bill?.paymentType ??
        "-";

    return String(value)
        .trim()
        .toUpperCase() || "-";

}


/* =========================================================
   PAYMENT MODE
   ========================================================= */

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

    return "-";

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
   TOTALS
   ========================================================= */

function getGrandTotal(bill) {

    return money(
        bill?.grand_total ??
        bill?.grandTotal ??
        0
    );

}


function getAdvance(bill) {

    return money(
        bill?.advance_amount ??
        bill?.advanceAmount ??
        0
    );

}


function getBalance(bill) {

    return money(
        bill?.balance_amount ??
        bill?.balanceAmount ??
        0
    );

}


function getReturnAmount(bill) {

    return money(
        bill?.return_amount ??
        bill?.returnAmount ??
        0
    );

}


function getWoodTotal(bill) {

    return money(
        bill?.wood_total ??
        bill?.woodTotal ??
        0
    );

}


function getLabourCharge(bill) {

    return money(
        bill?.labour_charge ??
        bill?.labourCharge ??
        0
    );

}


function getOtherCharge(bill) {

    return money(
        bill?.other_charge ??
        bill?.otherCharge ??
        0
    );

}


function getOthersTotal(bill) {

    return money(
        bill?.others_total ??
        bill?.othersTotal ??
        0
    );

}


function getDiscount(bill) {

    return money(
        bill?.discount_amount ??
        bill?.discountAmount ??
        bill?.discount ??
        0
    );

}


/* =========================================================
   WOOD DATA
   ========================================================= */

function getWoodData(bill) {

    return parseJSON(
        bill?.wood_data ??
        bill?.woodData ??
        []
    );

}


/* =========================================================
   OTHER DATA
   ========================================================= */

function getOthersData(bill) {

    return parseJSON(
        bill?.others_data ??
        bill?.othersData ??
        []
    );

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
   STATUS
   ========================================================= */

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


/* =========================================================
   PAYMENT HTML
   ========================================================= */

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
            -
        </span>
    `;

}


/* =========================================================
   STATUS HTML
   ========================================================= */

function statusHTML(bill) {

    const status =
        getStatus(bill);

    return `
        <span class="status ${status}">
            ${getStatusText(bill)}
        </span>
    `;

}


/* =========================================================
   LOAD BILLS
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
                data?.message ||
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


    if (bills.length === 0) {

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
                        ⌕
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
        function (bill, index) {

            const id =
                getBillId(bill);


            const billNo =
                bill?.bill_no ??
                bill?.billNo ??
                `BILL-${id}`;


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
                        ${escapeHtml(
                            billNo
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="customer-id"
                    >
                        ${escapeHtml(
                            customerId
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="customer-name"
                    >
                        ${escapeHtml(
                            customerName
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        customerMobile
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        customerPlace
                    )}
                </td>


                <td>

                    ${escapeHtml(
                        formatDate(
                            bill?.bill_date ??
                            bill?.billDate ??
                            bill?.date ??
                            bill?.created_at
                        )
                    )}

                </td>


                <!-- PAYMENT TYPE -->

                <td>

                    <span
                        class="payment-type"
                    >
                        ${escapeHtml(
                            paymentType
                        )}
                    </span>

                </td>


                <!-- PAYMENT MODE -->

                <td>

                    ${paymentModeHTML(
                        paymentMode
                    )}

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

                    ${statusHTML(
                        bill
                    )}

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
                            ?
                            `
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
                            :
                            ""
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


/* =========================================================
   SUMMARY
   ========================================================= */

function updateSummary(bills) {

    let pending = 0;

    let finished = 0;

    let returned = 0;


    bills.forEach(
        function (bill) {

            const status =
                getStatus(bill);


            if (status === "pending") {

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
   SEARCH / FILTER
   ========================================================= */

function applyFilters() {

    const search =
        String(
            searchInput.value || ""
        )
        .trim()
        .toLowerCase();


    const selectedStatus =
        String(
            statusFilter.value || "all"
        )
        .toLowerCase();


    const filtered =
        allBills.filter(
            function (bill) {

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
                    function (value) {

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


    clearSearchBtn.classList.toggle(
        "visible",
        search !== ""
    );

}


/* =========================================================
   ACTIONS
   ========================================================= */

function bindRowActions() {


    document
        .querySelectorAll(
            ".pdfBtn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        downloadBillPDF(
                            button.dataset
                                .billId,

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
            function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const id =
                            button.dataset
                                .billId;


                        const bill =
                            allBills.find(
                                function (
                                    item
                                ) {

                                    return String(
                                        getBillId(
                                            item
                                        )
                                    ) ===
                                    String(id);

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


/* =========================================================
   RETURN BILL
   ========================================================= */

async function handleReturn(
    bill
) {

    const id =
        getBillId(bill);


    const billNo =
        bill?.bill_no ??
        bill?.billNo ??
        `BILL-${id}`;


    const grandTotal =
        getGrandTotal(bill);


    const value =
        prompt(
            `Enter Return Amount\n\n` +
            `Bill No: ${billNo}\n` +
            `Grand Total: ₹ ${formatMoney(
                grandTotal
            )}`
        );


    if (value === null) {

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
            `Confirm return?\n\n` +
            `Bill: ${billNo}\n` +
            `Return: ₹ ${formatMoney(
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


        if (!response.ok) {

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
   PDF WOOD ROWS
   ========================================================= */

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
                    colspan="7"
                    style="
                        text-align:center;
                    "
                >
                    No wood details
                </td>
            </tr>
        `;

    }


    return woodData
        .map(
            function (
                item,
                index
            ) {

                let woodType =
                    item?.woodType ??
                    item?.wood_type ??
                    "-";


                if (
                    String(
                        woodType
                    )
                    .toLowerCase() ===
                    "other"
                ) {

                    woodType =
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


                const quality =
                    item?.quality ??
                    "-";


                const cft =
                    money(
                        item?.cubicFeet ??
                        item?.cubic_feet ??
                        item?.cft ??
                        0
                    );


                const rate =
                    money(
                        item?.rate ??
                        0
                    );


                const amount =
                    money(
                        item?.amount ??
                        item?.totalAmount ??
                        item?.total_amount ??
                        0
                    );


                let lengthText =
                    "-";


                let quantityText =
                    "-";


                if (
                    Array.isArray(
                        item?.pieces
                    )
                ) {

                    const lengths =
                        item.pieces
                            .map(
                                function (
                                    piece
                                ) {

                                    const length =
                                        numberValue(
                                            piece?.length
                                        );


                                    const extra =
                                        numberValue(
                                            piece?.extraLength ??
                                            piece?.extra_length ??
                                            0
                                        );


                                    const qty =
                                        numberValue(
                                            piece?.qty ??
                                            piece?.quantity ??
                                            0
                                        );


                                    return `
                                        ${formatMoney(
                                            length +
                                            extra
                                        )} ft
                                    `;

                                }
                            );


                    const quantities =
                        item.pieces
                            .map(
                                function (
                                    piece
                                ) {

                                    return numberValue(
                                        piece?.qty ??
                                        piece?.quantity ??
                                        0
                                    );

                                }
                            );


                    if (
                        lengths.length
                    ) {

                        lengthText =
                            lengths.join(
                                "<br>"
                            );

                    }


                    if (
                        quantities.length
                    ) {

                        quantityText =
                            quantities.join(
                                "<br>"
                            );

                    }

                }
                else {

                    if (
                        item?.length !==
                        undefined
                    ) {

                        const length =
                            numberValue(
                                item.length
                            );


                        const extra =
                            numberValue(
                                item?.extraLength ??
                                item?.extra_length ??
                                0
                            );


                        lengthText =
                            formatMoney(
                                length +
                                extra
                            );

                    }


                    quantityText =
                        numberValue(
                            item?.qty ??
                            item?.quantity ??
                            0
                        );

                }


                return `

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
                                breadth
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                thickness
                            )}
                        </td>

                        <td>
                            ${lengthText}
                        </td>

                        <td>
                            ${quantityText}
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

            }
        )
        .join("");

}


/* =========================================================
   PDF OTHER ROWS
   ========================================================= */

function buildOtherRows(
    othersData,
    otherCharge
) {

    let rows = "";


    if (
        otherCharge > 0
    ) {

        rows += `

            <tr>

                <td>
                    Other Charge
                </td>

                <td
                    style="
                        text-align:right;
                    "
                >
                    ₹ ${formatMoney(
                        otherCharge
                    )}
                </td>

            </tr>

        `;

    }


    if (
        Array.isArray(
            othersData
        )
    ) {

        othersData.forEach(
            function (item) {

                if (!item) {

                    return;

                }


                const name =
                    item?.name ??
                    item?.title ??
                    item?.description ??
                    item?.reason ??
                    "Other";


                const amount =
                    money(
                        item?.amount
                    );


                rows += `

                    <tr>

                        <td>
                            ${escapeHtml(
                                name
                            )}
                        </td>

                        <td
                            style="
                                text-align:right;
                            "
                        >
                            ₹ ${formatMoney(
                                amount
                            )}
                        </td>

                    </tr>

                `;

            }
        );

    }


    if (!rows) {

        rows = `

            <tr>

                <td>
                    No Other Charges
                </td>

                <td
                    style="
                        text-align:right;
                    "
                >
                    ₹ 0.00
                </td>

            </tr>

        `;

    }


    return rows;

}


/* =========================================================
   BUILD PDF HTML
   ========================================================= */

function buildPDFHTML(
    bill
) {

    const id =
        getBillId(bill);


    const billNo =
        bill?.bill_no ??
        bill?.billNo ??
        `BILL-${id}`;


    const billDate =
        formatDate(
            bill?.bill_date ??
            bill?.billDate ??
            bill?.date ??
            bill?.created_at
        );


    const customerId =
        bill?.customer_id ??
        bill?.customerId ??
        "-";


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


    const paymentType =
        getPaymentType(
            bill
        );


    const paymentMode =
        getPaymentMode(
            bill
        );


    const status =
        getStatusText(
            bill
        );


    const totalCFT =
        money(
            bill?.total_cft ??
            bill?.totalCFT ??
            0
        );


    const wood =
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


    const others =
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


    const returnAmount =
        getReturnAmount(
            bill
        );


    return `

        <div
            class="pdf-bill"
        >

            <style>

                * {
                    box-sizing:
                        border-box;
                }


                .pdf-bill {

                    width: 794px;

                    min-height:
                        1123px;

                    padding:
                        34px;

                    background:
                        #ffffff;

                    color:
                        #172033;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    font-size:
                        11px;
                }


                .pdf-header {

                    text-align:
                        center;

                    border-bottom:
                        2px solid
                        #172033;

                    padding-bottom:
                        14px;

                    margin-bottom:
                        14px;
                }


                .pdf-header h1 {

                    margin: 0;

                    font-size:
                        23px;

                    font-weight:
                        800;
                }


                .pdf-header p {

                    margin:
                        4px 0;

                    font-size:
                        11px;

                    color:
                        #4b5563;
                }


                .bill-no {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    gap: 20px;

                    padding:
                        10px 12px;

                    margin-bottom:
                        13px;

                    background:
                        #f3f4f6;

                    border:
                        1px solid
                        #d9dee7;

                    font-weight:
                        700;
                }


                .section-title {

                    margin-top:
                        15px;

                    margin-bottom:
                        7px;

                    padding:
                        7px 10px;

                    background:
                        #eef2f7;

                    border-left:
                        4px solid
                        #2563eb;

                    font-weight:
                        800;
                }


                .customer-grid {

                    display:
                        grid;

                    grid-template-columns:
                        1fr 1fr;

                    gap:
                        7px 18px;

                    border:
                        1px solid
                        #d9dee7;

                    padding:
                        10px;
                }


                .customer-item {

                    padding:
                        3px 0;
                }


                .label {

                    font-weight:
                        700;

                    color:
                        #4b5563;
                }


                .payment-grid {

                    display:
                        grid;

                    grid-template-columns:
                        repeat(
                            3,
                            1fr
                        );

                    gap:
                        8px;

                    margin-top:
                        8px;
                }


                .payment-box {

                    border:
                        1px solid
                        #d5dbe5;

                    padding:
                        8px;
                }


                .payment-box strong {

                    display:
                        block;

                    margin-bottom:
                        3px;
                }


                table {

                    width:
                        100%;

                    border-collapse:
                        collapse;
                }


                th,
                td {

                    border:
                        1px solid
                        #d5dbe5;

                    padding:
                        6px 7px;

                    vertical-align:
                        middle;
                }


                th {

                    background:
                        #f1f5f9;

                    font-weight:
                        800;

                    text-align:
                        left;
                }


                .right {

                    text-align:
                        right;
                }


                .grand-row td {

                    font-size:
                        14px;

                    font-weight:
                        900;

                    background:
                        #eef6ff;
                }


                .discount {

                    color:
                        #b91c1c;
                }


                .footer {

                    text-align:
                        center;

                    margin-top:
                        22px;

                    padding-top:
                        12px;

                    border-top:
                        1px solid
                        #d5dbe5;

                    color:
                        #6b7280;
                }

            </style>


            <div
                class="pdf-header"
            >

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


            <div
                class="bill-no"
            >

                <span>

                    BILL NO:
                    ${escapeHtml(
                        billNo
                    )}

                </span>


                <span>

                    DATE:
                    ${escapeHtml(
                        billDate
                    )}

                </span>

            </div>


            <div
                class="section-title"
            >
                Customer Information
            </div>


            <div
                class="customer-grid"
            >

                <div
                    class="customer-item"
                >

                    <span
                        class="label"
                    >
                        Customer Name:
                    </span>

                    ${escapeHtml(
                        customerName
                    )}

                </div>


                <div
                    class="customer-item"
                >

                    <span
                        class="label"
                    >
                        Mobile:
                    </span>

                    ${escapeHtml(
                        customerMobile
                    )}

                </div>


                <div
                    class="customer-item"
                >

                    <span
                        class="label"
                    >
                        Place:
                    </span>

                    ${escapeHtml(
                        customerPlace
                    )}

                </div>


                <div
                    class="customer-item"
                >

                    <span
                        class="label"
                    >
                        Customer ID:
                    </span>

                    ${escapeHtml(
                        customerId
                    )}

                </div>

            </div>


            <div
                class="payment-grid"
            >

                <div
                    class="payment-box"
                >

                    <strong>
                        Payment Type
                    </strong>

                    ${escapeHtml(
                        paymentType
                    )}

                </div>


                <div
                    class="payment-box"
                >

                    <strong>
                        Payment Mode
                    </strong>

                    ${escapeHtml(
                        paymentMode
                    )}

                </div>


                <div
                    class="payment-box"
                >

                    <strong>
                        Status
                    </strong>

                    ${escapeHtml(
                        status
                    )}

                </div>

            </div>


            <div
                class="section-title"
            >
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
                            Length
                        </th>

                        <th>
                            Quantity
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

                    ${buildWoodRows(
                        getWoodData(
                            bill
                        )
                    )}

                </tbody>

            </table>


            <div
                class="section-title"
            >
                Wood Summary
            </div>


            <table>

                <tr>

                    <td>
                        Total CFT
                    </td>

                    <td
                        class="right"
                    >
                        ${formatMoney(
                            totalCFT
                        )}
                    </td>

                </tr>


                <tr>

                    <td>
                        Wood Total
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            wood
                        )}
                    </td>

                </tr>

            </table>


            <div
                class="section-title"
            >
                Labour & Other Charges
            </div>


            <table>

                <tr>

                    <td>
                        Labour Charge
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            labour
                        )}
                    </td>

                </tr>


                ${buildOtherRows(
                    getOthersData(
                        bill
                    ),
                    other
                )}


                <tr>

                    <td>
                        Other Charges Total
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            others
                        )}
                    </td>

                </tr>

            </table>


            <div
                class="section-title"
            >
                Payment Summary
            </div>


            <table>

                <tr>

                    <td>
                        Wood Total
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            wood
                        )}
                    </td>

                </tr>


                <tr>

                    <td>
                        Labour Charge
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            labour
                        )}
                    </td>

                </tr>


                <tr>

                    <td>
                        Other Charge
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            other
                        )}
                    </td>

                </tr>


                <tr>

                    <td>
                        Others Total
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            others
                        )}
                    </td>

                </tr>


                ${
                    discount > 0
                    ?
                    `
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
                                - ₹ ${formatMoney(
                                    discount
                                )}
                            </td>

                        </tr>
                    `
                    :
                    ""
                }


                <tr
                    class="grand-row"
                >

                    <td>
                        Grand Total
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            grandTotal
                        )}
                    </td>

                </tr>


                <tr>

                    <td>
                        Advance
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            advance
                        )}
                    </td>

                </tr>


                <tr>

                    <td>
                        Balance
                    </td>

                    <td
                        class="right"
                    >
                        ₹ ${formatMoney(
                            balance
                        )}
                    </td>

                </tr>


                ${
                    returnAmount > 0
                    ?
                    `
                        <tr>

                            <td>
                                Return Amount
                            </td>

                            <td
                                class="right"
                            >
                                ₹ ${formatMoney(
                                    returnAmount
                                )}
                            </td>

                        </tr>
                    `
                    :
                    ""
                }

            </table>


            <div
                class="footer"
            >
                Thank You
            </div>

        </div>

    `;

}


/* =========================================================
   DIRECT PDF DOWNLOAD
   NO PRINT PAGE
   ========================================================= */

async function downloadBillPDF(
    billId,
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


        if (!response.ok) {

            throw new Error(
                `Bill API HTTP ${
                    response.status
                }`
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


        const billNo =
            bill?.bill_no ??
            bill?.billNo ??
            `BILL-${billId}`;


        const pdfContainer =
            document.createElement(
                "div"
            );


        pdfContainer.innerHTML =
            buildPDFHTML(
                bill
            );


        /*
         * PDF is generated inside
         * the current page.
         *
         * NO window.open()
         *
         * NO window.print()
         */

        pdfContainer.style.position =
            "fixed";

        pdfContainer.style.left =
            "0";

        pdfContainer.style.top =
            "0";

        pdfContainer.style.width =
            "794px";

        pdfContainer.style.background =
            "#ffffff";

        pdfContainer.style.zIndex =
            "-9999";

        pdfContainer.style.opacity =
            "0.01";

        pdfContainer.style.pointerEvents =
            "none";


        document.body.appendChild(
            pdfContainer
        );


        await new Promise(
            function (resolve) {

                requestAnimationFrame(
                    function () {

                        requestAnimationFrame(
                            resolve
                        );

                    }
                );

            }
        );


        await new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    250
                );

            }
        );


        const safeBillNo =
            String(
                billNo
            )
            .replace(
                /[\\/:*?"<>|]/g,
                "_"
            );


        await html2pdf()
            .set({

                margin: 8,

                filename:
                    `${safeBillNo}.pdf`,

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

            })

            .from(
                pdfContainer
            )

            .save();


        pdfContainer.remove();


        console.log(
            "PDF DOWNLOADED:",
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
    finally {

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
        applyFilters
    );

}


/* =========================================================
   LIVE SEARCH
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
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

            searchInput.value =
                "";

            applyFilters();

            searchInput.focus();

        }
    );

}


/* =========================================================
   STATUS FILTER
   ========================================================= */

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        applyFilters
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


            searchInput.value =
                "";


            statusFilter.value =
                "all";


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
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBills();

    }
);
