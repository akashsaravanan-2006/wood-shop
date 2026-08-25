// ======================================================
// HISTORY.JS
// ======================================================

// ======================================================
// BACKEND API
// ======================================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// ======================================================
// ELEMENTS
// ======================================================

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

const totalBills =
    document.getElementById("totalBills");

const pendingBills =
    document.getElementById("pendingBills");

const paidBills =
    document.getElementById("paidBills");


// ======================================================
// GLOBAL DATA
// ======================================================

let allBills = [];


// ======================================================
// LOAD HTML2PDF
// ======================================================

function loadHtml2Pdf() {

    return new Promise(function (resolve, reject) {

        if (
            typeof html2pdf !== "undefined"
        ) {

            resolve();

            return;
        }


        const script =
            document.createElement("script");

        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";


        script.onload =
            function () {

                resolve();

            };


        script.onerror =
            function () {

                reject(
                    new Error(
                        "Unable to load PDF library"
                    )
                );

            };


        document.head.appendChild(script);

    });

}


// ======================================================
// NUMBER
// ======================================================

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    const number =
        parseFloat(
            String(value)
                .replace(/[₹,\s]/g, "")
        );


    return Number.isFinite(number)
        ? number
        : 0;

}


// ======================================================
// MONEY
// ======================================================

function money(value) {

    return (
        "₹ " +
        numberValue(value).toFixed(2)
    );

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    return String(value ?? "")

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


// ======================================================
// PARSE JSON
// ======================================================

function parseJSON(
    value,
    fallback = []
) {

    if (
        Array.isArray(value)
    ) {

        return value;

    }


    if (
        typeof value !== "string"
    ) {

        return fallback;

    }


    try {

        const parsed =
            JSON.parse(value);

        return parsed;

    }

    catch (error) {

        console.error(
            "JSON PARSE ERROR:",
            error
        );

        return fallback;

    }

}


// ======================================================
// GET BILL ID
// ======================================================

function getBillId(bill) {

    return (
        bill.id ||
        bill.bill_id ||
        bill.billId ||
        null
    );

}


// ======================================================
// GET PAYMENT MODE
// ======================================================

function getPaymentMode(bill) {

    let mode =
        bill.payment_mode ||
        bill.paymentMode ||
        bill.mode ||
        "CASH";


    mode =
        String(mode)
            .trim()
            .toUpperCase();


    if (
        mode === "UPI"
    ) {

        return "UPI";

    }


    return "CASH";

}


// ======================================================
// GET STATUS
//
// STATUS FLOW:
//
// BALANCE > 0      = PENDING
// BALANCE = 0      = DELIVERED
// RETURN > 0       = RETURN
// ======================================================

function getBillStatus(bill) {

    const returnAmount =
        numberValue(
            bill.return_amount
        );


    const explicitStatus =
        String(
            bill.status ||
            bill.bill_status ||
            bill.delivery_status ||
            ""
        )
            .trim()
            .toUpperCase();


    // RETURN HAS HIGHEST PRIORITY

    if (
        returnAmount > 0 ||
        explicitStatus === "RETURN" ||
        explicitStatus === "RETURNED"
    ) {

        return "RETURN";

    }


    const balance =
        numberValue(
            bill.balance_amount
        );


    if (
        balance > 0
    ) {

        return "PENDING";

    }


    return "DELIVERED";

}


// ======================================================
// STATUS CLASS
// ======================================================

function getStatusClass(status) {

    if (
        status === "RETURN"
    ) {

        return "returned";

    }


    if (
        status === "PENDING"
    ) {

        return "pending";

    }


    return "delivered";

}


// ======================================================
// LOAD ALL BILLS
// ======================================================

async function loadBills() {

    try {

        if (historyBody) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="15">
                        Loading...
                    </td>
                </tr>
            `;

        }


        console.log(
            "================================="
        );

        console.log(
            "LOADING BILL HISTORY"
        );

        console.log(
            "API:",
            `${API_URL}/bills`
        );


        const response =
            await fetch(
                `${API_URL}/bills`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        console.log(
            "History response:",
            response.status
        );


        if (
            !response.ok
        ) {

            const errorText =
                await response.text();

            console.error(
                "SERVER ERROR:",
                errorText
            );


            throw new Error(
                `Server returned HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "HISTORY DATA:",
            data
        );


        // --------------------------------------
        // RESPONSE FORMAT 1
        // --------------------------------------

        if (
            Array.isArray(data)
        ) {

            allBills = data;

        }


        // --------------------------------------
        // RESPONSE FORMAT 2
        // --------------------------------------

        else if (
            data &&
            Array.isArray(data.bills)
        ) {

            allBills =
                data.bills;

        }


        // --------------------------------------
        // RESPONSE FORMAT 3
        // --------------------------------------

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


        console.log(
            "TOTAL BILLS:",
            allBills.length
        );


        displayBills(
            allBills
        );

    }


    catch (error) {

        console.error(
            "HISTORY LOAD ERROR:",
            error
        );


        if (historyBody) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="15">
                        ❌ Unable to load bill history
                    </td>
                </tr>
            `;

        }


        updateSummary(
            0,
            0,
            0
        );

    }

}


// ======================================================
// DISPLAY BILLS
// ======================================================

function displayBills(
    bills
) {

    if (!historyBody) {

        return;

    }


    historyBody.innerHTML = "";


    let pendingCount = 0;

    let deliveredCount = 0;

    let returnCount = 0;


    if (
        !Array.isArray(bills)
    ) {

        bills = [];

    }


    // ==================================================
    // NO BILLS
    // ==================================================

    if (
        bills.length === 0
    ) {

        historyBody.innerHTML = `
            <tr>
                <td colspan="15">
                    No bills found
                </td>
            </tr>
        `;


        updateSummary(
            0,
            0,
            0
        );


        return;

    }


    // ==================================================
    // EACH BILL
    // ==================================================

    bills.forEach(
        function (
            bill,
            index
        ) {

            // ------------------------------------------
            // BASIC VALUES
            // ------------------------------------------

            const billId =
                getBillId(bill);


            const balance =
                numberValue(
                    bill.balance_amount
                );


            const grandTotal =
                numberValue(
                    bill.grand_total
                );


            const advance =
                numberValue(
                    bill.advance_amount
                );


            const returnAmount =
                numberValue(
                    bill.return_amount
                );


            const paymentType =
                bill.payment_type ||
                bill.paymentType ||
                "-";


            const paymentMode =
                getPaymentMode(
                    bill
                );


            const status =
                getBillStatus(
                    bill
                );


            const statusClass =
                getStatusClass(
                    status
                );


            // ------------------------------------------
            // SUMMARY
            // ------------------------------------------

            if (
                status === "PENDING"
            ) {

                pendingCount++;

            }

            else if (
                status === "RETURN"
            ) {

                returnCount++;

            }

            else {

                deliveredCount++;

            }


            // ------------------------------------------
            // DATE
            // ------------------------------------------

            let date = "-";


            if (
                bill.bill_date
            ) {

                const d =
                    new Date(
                        bill.bill_date
                    );


                if (
                    !isNaN(
                        d.getTime()
                    )
                ) {

                    date =
                        d.toLocaleDateString(
                            "en-IN"
                        );

                }

                else {

                    date =
                        bill.bill_date;

                }

            }


            // ------------------------------------------
            // CREATE ROW
            // ------------------------------------------

            const row =
                document.createElement(
                    "tr"
                );


            if (
                status === "PENDING"
            ) {

                row.classList.add(
                    "pendingRow"
                );

            }


            if (
                status === "RETURN"
            ) {

                row.classList.add(
                    "returnRow"
                );

            }


            // ==================================================
            // ROW HTML
            // ==================================================

            row.innerHTML = `

                <!-- S.NO -->

                <td>
                    ${index + 1}
                </td>


                <!-- BILL NO -->

                <td class="billNo">

                    ${escapeHtml(
                        bill.bill_no ||
                        "-"
                    )}

                </td>


                <!-- CUSTOMER ID -->

                <td>

                    ${escapeHtml(
                        bill.customer_id ||
                        "-"
                    )}

                </td>


                <!-- CUSTOMER NAME -->

                <td>

                    ${escapeHtml(
                        bill.customer_name ||
                        "-"
                    )}

                </td>


                <!-- MOBILE -->

                <td>

                    ${escapeHtml(
                        bill.customer_mobile ||
                        "-"
                    )}

                </td>


                <!-- PLACE -->

                <td>

                    ${escapeHtml(
                        bill.customer_place ||
                        "-"
                    )}

                </td>


                <!-- DATE -->

                <td>

                    ${escapeHtml(
                        date
                    )}

                </td>


                <!-- PAYMENT TYPE -->

                <td>

                    ${escapeHtml(
                        paymentType
                    )}

                </td>


                <!-- PAYMENT MODE -->

                <td>

                    <span
                        class="
                            payment-pill
                            ${
                                paymentMode ===
                                "UPI"
                                    ? "upi"
                                    : "cash"
                            }
                        "
                    >

                        ${
                            paymentMode ===
                            "UPI"
                                ? "UPI"
                                : "CASH"
                        }

                    </span>

                </td>


                <!-- GRAND TOTAL -->

                <td>

                    ${money(
                        grandTotal
                    )}

                </td>


                <!-- ADVANCE -->

                <td>

                    ${money(
                        advance
                    )}

                </td>


                <!-- BALANCE -->

                <td>

                    ${money(
                        balance
                    )}

                </td>


                <!-- RETURN AMOUNT -->

                <td>

                    ${
                        returnAmount > 0
                            ? `
                                <span
                                    class="return-amount"
                                >
                                    ${money(
                                        returnAmount
                                    )}
                                </span>
                            `
                            : `
                                ${money(0)}
                            `
                    }

                </td>


                <!-- STATUS -->

                <td>

                    <span
                        class="
                            status
                            ${statusClass}
                        "
                    >

                        ${status}

                    </span>

                </td>


                <!-- ACTIONS -->

                <td>

                    <div class="history-action-column">


                        <!-- RETURN BLOCK -->

                        <div
                            class="
                                action-block
                                return-action-block
                            "
                        >

                            ${
                                billId &&
                                status !== "RETURN"
                                    ? `
                                        <button
                                            type="button"
                                            class="return-btn"
                                            onclick="openReturnPage(
                                                '${String(
                                                    billId
                                                ).replace(
                                                    /'/g,
                                                    "\\'"
                                                )}'
                                            "
                                        >
                                            Return
                                        </button>
                                    `
                                    : `
                                        <span
                                            class="returned-label"
                                        >
                                            Returned
                                        </span>
                                    `
                            }

                        </div>


                        <!-- PDF BLOCK -->

                        <div
                            class="
                                action-block
                                pdf-action-block
                            "
                        >

                            ${
                                billId
                                    ? `
                                        <button
                                            type="button"
                                            class="pdf-btn"
                                            onclick="downloadBillPDF(
                                                '${String(
                                                    billId
                                                ).replace(
                                                    /'/g,
                                                    "\\'"
                                                )}'
                                            "
                                        >
                                            PDF
                                        </button>
                                    `
                                    : ""
                            }

                        </div>


                    </div>

                </td>

            `;


            historyBody.appendChild(
                row
            );

        }
    );


    // ==================================================
    // SUMMARY
    // ==================================================

    updateSummary(
        bills.length,
        pendingCount,
        deliveredCount
    );


    console.log(
        "PENDING:",
        pendingCount
    );

    console.log(
        "DELIVERED:",
        deliveredCount
    );

    console.log(
        "RETURN:",
        returnCount
    );

}


// ======================================================
// SUMMARY
// ======================================================

function updateSummary(
    total,
    pending,
    delivered
) {

    if (
        totalBills
    ) {

        totalBills.textContent =
            total;

    }


    if (
        pendingBills
    ) {

        pendingBills.textContent =
            pending;

    }


    if (
        paidBills
    ) {

        paidBills.textContent =
            delivered;

    }

}


// ======================================================
// SEARCH
// ======================================================

function searchBills() {

    if (!searchInput) {

        return;

    }


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    if (
        search === ""
    ) {

        displayBills(
            allBills
        );

        return;

    }


    const filtered =
        allBills.filter(
            function (
                bill
            ) {

                return (

                    String(
                        bill.bill_no ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)


                    ||


                    String(
                        bill.customer_id ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)


                    ||


                    String(
                        bill.customer_name ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)


                    ||


                    String(
                        bill.customer_mobile ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)


                    ||


                    String(
                        bill.customer_place ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)


                    ||


                    String(
                        bill.payment_type ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)


                    ||


                    String(
                        bill.payment_mode ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)


                    ||


                    String(
                        bill.status ||
                        bill.bill_status ||
                        ""
                    )
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    displayBills(
        filtered
    );

}


// ======================================================
// SEARCH BUTTON
// ======================================================

if (
    searchBtn
) {

    searchBtn.addEventListener(
        "click",
        searchBills
    );

}


// ======================================================
// LIVE SEARCH
// ======================================================

if (
    searchInput
) {

    searchInput.addEventListener(
        "input",
        searchBills
    );

}


// ======================================================
// ENTER KEY
// ======================================================

if (
    searchInput
) {

    searchInput.addEventListener(
        "keypress",
        function (
            event
        ) {

            if (
                event.key === "Enter"
            ) {

                searchBills();

            }

        }
    );

}


// ======================================================
// REFRESH
// ======================================================

if (
    refreshBtn
) {

    refreshBtn.addEventListener(
        "click",
        function () {

            loadBills();

        }
    );

}


// ======================================================
// HOME
// ======================================================

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


// ======================================================
// OPEN RETURN PAGE
// ======================================================

function openReturnPage(
    billId
) {

    if (
        !billId
    ) {

        alert(
            "Bill ID not found."
        );

        return;

    }


    console.log(
        "Opening return page for:",
        billId
    );


    window.location.href =
        `return.html?id=${encodeURIComponent(
            billId
        )}`;

}


// ======================================================
// GET WOOD DATA
// ======================================================

function getWoodData(
    bill
) {

    let woodData =
        parseJSON(
            bill.wood_data,
            []
        );


    if (
        !Array.isArray(woodData)
    ) {

        woodData =
            parseJSON(
                bill.woodData,
                []
            );

    }


    if (
        !Array.isArray(woodData)
    ) {

        woodData =
            parseJSON(
                bill.wood,
                []
            );

    }


    return Array.isArray(
        woodData
    )
        ? woodData
        : [];

}


// ======================================================
// GET OTHER DATA
// ======================================================

function getOthersData(
    bill
) {

    let othersData =
        parseJSON(
            bill.others_data,
            []
        );


    if (
        !Array.isArray(
            othersData
        )
    ) {

        othersData =
            parseJSON(
                bill.other_data,
                []
            );

    }


    if (
        !Array.isArray(
            othersData
        )
    ) {

        othersData =
            parseJSON(
                bill.charges,
                []
            );

    }


    if (
        !Array.isArray(
            othersData
        )
    ) {

        othersData =
            parseJSON(
                bill.additional_charges,
                []
            );

    }


    return Array.isArray(
        othersData
    )
        ? othersData
        : [];

}


// ======================================================
// WOOD NAME
// ======================================================

function getWoodName(
    item
) {

    let name =
        item.woodType ||
        item.wood ||
        item.woodName ||
        "-";


    if (
        name === "Other"
    ) {

        name =
            item.otherWood ||
            "Other";

    }


    return name;

}


// ======================================================
// WOOD SIZE
// ======================================================

function getWoodSize(
    item
) {

    const breadth =
        numberValue(
            item.breadth
        );


    const thickness =
        numberValue(
            item.thickness
        );


    if (
        breadth > 0 &&
        thickness > 0
    ) {

        return (
            `${breadth} × ${thickness}`
        );

    }


    if (
        breadth > 0
    ) {

        return String(
            breadth
        );

    }


    if (
        thickness > 0
    ) {

        return String(
            thickness
        );

    }


    return "-";

}


// ======================================================
// LENGTH / QTY
// ======================================================

function getLengthQty(
    item
) {

    const result = [];


    const pieces =
        Array.isArray(
            item.pieces
        )
            ? item.pieces
            : [];


    pieces.forEach(
        function (
            piece
        ) {

            if (
                !piece
            ) {

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


            if (
                finalLength > 0
            ) {

                result.push(
                    `${finalLength} → ${qty}`
                );

            }

        }
    );


    if (
        result.length === 0 &&
        item.length !== undefined
    ) {

        result.push(
            `${numberValue(
                item.length
            )} → ${numberValue(
                item.qty
            )}`
        );

    }


    return result.length
        ? result.join("<br>")
        : "-";

}


// ======================================================
// DOWNLOAD BILL PDF
// ======================================================

async function downloadBillPDF(
    billId
) {

    if (
        !billId
    ) {

        alert(
            "Bill ID not found."
        );

        return;

    }


    let pdfContainer = null;


    try {

        console.log(
            "Preparing PDF:",
            billId
        );


        await loadHtml2Pdf();


        // ------------------------------------------
        // GET EXACT BILL
        // ------------------------------------------

        const response =
            await fetch(
                `${API_URL}/bill/${encodeURIComponent(
                    billId
                )}`
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
            !data ||
            !data.bill
        ) {

            throw new Error(
                data?.message ||
                "Bill not found"
            );

        }


        const bill =
            data.bill;


        console.log(
            "PDF BILL:",
            bill
        );


        // ------------------------------------------
        // BILL NUMBER
        // ------------------------------------------

        const billNo =
            bill.bill_no ||
            `BILL-${billId}`;


        // ------------------------------------------
        // PAYMENT
        // ------------------------------------------

        const paymentMode =
            getPaymentMode(
                bill
            );


        // ------------------------------------------
        // DATA
        // ------------------------------------------

        const woodData =
            getWoodData(
                bill
            );


        const othersData =
            getOthersData(
                bill
            );


        const woodTotal =
            numberValue(
                bill.wood_total ||
                bill.woodTotal
            );


        const labourCharge =
            numberValue(
                bill.labour_charge ||
                bill.labourCharge
            );


        const otherCharge =
            numberValue(
                bill.other_charge ||
                bill.otherCharge
            );


        const othersTotal =
            numberValue(
                bill.others_total ||
                bill.othersTotal
            );


        const discount =
            numberValue(
                bill.discount_amount ||
                bill.discountAmount
            );


        const originalTotal =
            numberValue(
                bill.original_grand_total
            ) ||
            numberValue(
                bill.grand_total
            );


        const grandTotal =
            numberValue(
                bill.grand_total
            );


        const advance =
            numberValue(
                bill.advance_amount
            );


        const balance =
            numberValue(
                bill.balance_amount
            );


        const returnAmount =
            numberValue(
                bill.return_amount
            );


        const status =
            getBillStatus(
                bill
            );


        // ==========================================
        // CREATE PDF CONTAINER
        // ==========================================

        pdfContainer =
            document.createElement(
                "div"
            );


        pdfContainer.style.position =
            "fixed";

        pdfContainer.style.left =
            "0";

        pdfContainer.style.top =
            "0";

        pdfContainer.style.width =
            "794px";

        pdfContainer.style.minHeight =
            "1123px";

        pdfContainer.style.background =
            "#ffffff";

        pdfContainer.style.color =
            "#111111";

        pdfContainer.style.padding =
            "35px";

        pdfContainer.style.boxSizing =
            "border-box";

        pdfContainer.style.fontFamily =
            "Arial, sans-serif";

        pdfContainer.style.zIndex =
            "999999";


        // ==========================================
        // WOOD ROWS
        // ==========================================

        let woodRows = "";


        if (
            woodData.length === 0
        ) {

            woodRows = `
                <tr>
                    <td
                        colspan="9"
                        style="
                            border:1px solid #222;
                            padding:6px;
                            text-align:center;
                        "
                    >
                        No wood data
                    </td>
                </tr>
            `;

        }


        else {

            woodData.forEach(
                function (
                    item,
                    index
                ) {

                    const woodName =
                        getWoodName(
                            item
                        );


                    const size =
                        getWoodSize(
                            item
                        );


                    const lengthQty =
                        getLengthQty(
                            item
                        );


                    const pieces =
                        Array.isArray(
                            item.pieces
                        )
                            ? item.pieces
                            : [];


                    let totalQty = 0;


                    pieces.forEach(
                        function (
                            piece
                        ) {

                            totalQty +=
                                numberValue(
                                    piece?.qty
                                );

                        }
                    );


                    if (
                        totalQty === 0
                    ) {

                        totalQty =
                            numberValue(
                                item.qty
                            );

                    }


                    const cft =
                        numberValue(
                            item.cubicFeet
                        );


                    const rate =
                        numberValue(
                            item.rate
                        );


                    const amount =
                        numberValue(
                            item.amount
                        );


                    const quality =
                        item.quality ||
                        "-";


                    woodRows += `

                        <tr>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${index + 1}
                            </td>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${escapeHtml(
                                    woodName
                                )}
                            </td>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${escapeHtml(
                                    size
                                )}
                            </td>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${lengthQty}
                            </td>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${totalQty}
                            </td>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${cft.toFixed(2)}
                            </td>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${money(rate)}
                            </td>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${money(amount)}
                            </td>

                            <td
                                style="
                                    border:1px solid #222;
                                    padding:6px;
                                "
                            >
                                ${escapeHtml(
                                    quality
                                )}
                            </td>

                        </tr>

                    `;

                }
            );

        }


        // ==========================================
        // CHARGE ROWS
        // ==========================================

        let chargeRows = "";


        if (
            labourCharge > 0
        ) {

            chargeRows += `

                <tr>

                    <td
                        style="
                            border:1px solid #222;
                            padding:7px;
                        "
                    >
                        Labour Charge
                    </td>

                    <td
                        style="
                            border:1px solid #222;
                            padding:7px;
                            text-align:right;
                        "
                    >
                        ${money(
                            labourCharge
                        )}
                    </td>

                </tr>

            `;

        }


        if (
            otherCharge > 0
        ) {

            chargeRows += `

                <tr>

                    <td
                        style="
                            border:1px solid #222;
                            padding:7px;
                        "
                    >
                        Other Charge
                    </td>

                    <td
                        style="
                            border:1px solid #222;
                            padding:7px;
                            text-align:right;
                        "
                    >
                        ${money(
                            otherCharge
                        )}
                    </td>

                </tr>

            `;

        }


        othersData.forEach(
            function (
                item
            ) {

                if (
                    !item
                ) {

                    return;

                }


                const amount =
                    numberValue(
                        item.amount ||
                        item.charge ||
                        item.value
                    );


                if (
                    amount <= 0
                ) {

                    return;

                }


                const name =
                    item.name ||
                    item.reason ||
                    item.title ||
                    item.description ||
                    "Other Charge";


                chargeRows += `

                    <tr>

                        <td
                            style="
                                border:1px solid #222;
                                padding:7px;
                            "
                        >
                            ${escapeHtml(
                                name
                            )}
                        </td>

                        <td
                            style="
                                border:1px solid #222;
                                padding:7px;
                                text-align:right;
                            "
                        >
                            ${money(
                                amount
                            )}
                        </td>

                    </tr>

                `;

            }
        );


        if (
            chargeRows === ""
        ) {

            chargeRows = `

                <tr>

                    <td
                        style="
                            border:1px solid #222;
                            padding:7px;
                        "
                    >
                        No Additional Charges
                    </td>

                    <td
                        style="
                            border:1px solid #222;
                            padding:7px;
                            text-align:right;
                        "
                    >
                        ₹ 0.00
                    </td>

                </tr>

            `;

        }


        // ==========================================
        // PDF HTML
        // ==========================================

        pdfContainer.innerHTML = `

            <div
                style="
                    text-align:center;
                    margin-bottom:15px;
                "
            >

                <h1
                    style="
                        margin:0;
                        font-size:25px;
                    "
                >
                    AMMAN SAW MILL
                </h1>

                <div
                    style="
                        margin-top:5px;
                        font-size:13px;
                    "
                >
                    BILL
                </div>

            </div>


            <hr>


            <!-- BILL INFORMATION -->

            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                    margin-top:15px;
                    font-size:12px;
                "
            >

                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        <b>Bill No</b>
                    </td>

                    <td style="border:1px solid #ddd;padding:7px;">
                        ${escapeHtml(billNo)}
                    </td>

                    <td style="border:1px solid #ddd;padding:7px;">
                        <b>Date</b>
                    </td>

                    <td style="border:1px solid #ddd;padding:7px;">
                        ${escapeHtml(
                            bill.bill_date ||
                            "-"
                        )}
                    </td>

                </tr>


                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        <b>Customer ID</b>
                    </td>

                    <td style="border:1px solid #ddd;padding:7px;">
                        ${escapeHtml(
                            bill.customer_id ||
                            "-"
                        )}
                    </td>

                    <td style="border:1px solid #ddd;padding:7px;">
                        <b>Payment</b>
                    </td>

                    <td
                        style="
                            border:1px solid #ddd;
                            padding:7px;
                            font-weight:bold;
                        "
                    >
                        ${paymentMode}
                    </td>

                </tr>


                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        <b>Customer Name</b>
                    </td>

                    <td style="border:1px solid #ddd;padding:7px;">
                        ${escapeHtml(
                            bill.customer_name ||
                            "-"
                        )}
                    </td>

                    <td style="border:1px solid #ddd;padding:7px;">
                        <b>Mobile</b>
                    </td>

                    <td style="border:1px solid #ddd;padding:7px;">
                        ${escapeHtml(
                            bill.customer_mobile ||
                            "-"
                        )}
                    </td>

                </tr>


                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        <b>Place</b>
                    </td>

                    <td
                        colspan="3"
                        style="
                            border:1px solid #ddd;
                            padding:7px;
                        "
                    >
                        ${escapeHtml(
                            bill.customer_place ||
                            "-"
                        )}
                    </td>

                </tr>


                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        <b>Status</b>
                    </td>

                    <td
                        colspan="3"
                        style="
                            border:1px solid #ddd;
                            padding:7px;
                            font-weight:bold;
                        "
                    >
                        ${status}
                    </td>

                </tr>

            </table>


            <!-- WOOD -->

            <h3
                style="
                    margin-top:22px;
                "
            >
                Wood Details
            </h3>


            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:10px;
                "
            >

                <thead>

                    <tr>

                        <th style="border:1px solid #222;padding:6px;">
                            S.No
                        </th>

                        <th style="border:1px solid #222;padding:6px;">
                            Wood
                        </th>

                        <th style="border:1px solid #222;padding:6px;">
                            Size
                        </th>

                        <th style="border:1px solid #222;padding:6px;">
                            Length → Qty
                        </th>

                        <th style="border:1px solid #222;padding:6px;">
                            Qty
                        </th>

                        <th style="border:1px solid #222;padding:6px;">
                            CFT
                        </th>

                        <th style="border:1px solid #222;padding:6px;">
                            Rate
                        </th>

                        <th style="border:1px solid #222;padding:6px;">
                            Amount
                        </th>

                        <th style="border:1px solid #222;padding:6px;">
                            Quality
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${woodRows}

                </tbody>

            </table>


            <!-- OTHER CHARGES -->

            <h3
                style="
                    margin-top:22px;
                "
            >
                Other Charges
            </h3>


            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:12px;
                "
            >

                <thead>

                    <tr>

                        <th
                            style="
                                border:1px solid #222;
                                padding:7px;
                                text-align:left;
                            "
                        >
                            Charge
                        </th>

                        <th
                            style="
                                border:1px solid #222;
                                padding:7px;
                                text-align:right;
                            "
                        >
                            Amount
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${chargeRows}

                </tbody>

            </table>


            <!-- TOTALS -->

            <table
                style="
                    width:55%;
                    margin-left:auto;
                    margin-top:20px;
                    border-collapse:collapse;
                    font-size:12px;
                "
            >

                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        Wood Total
                    </td>

                    <td
                        style="
                            border:1px solid #ddd;
                            padding:7px;
                            text-align:right;
                        "
                    >
                        ${money(
                            woodTotal
                        )}
                    </td>

                </tr>


                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        Others Total
                    </td>

                    <td
                        style="
                            border:1px solid #ddd;
                            padding:7px;
                            text-align:right;
                        "
                    >
                        ${money(
                            othersTotal
                        )}
                    </td>

                </tr>


                ${
                    discount > 0
                        ? `

                            <tr>

                                <td style="border:1px solid #ddd;padding:7px;">
                                    Discount
                                </td>

                                <td
                                    style="
                                        border:1px solid #ddd;
                                        padding:7px;
                                        text-align:right;
                                    "
                                >
                                    ${money(
                                        discount
                                    )}
                                </td>

                            </tr>

                        `
                        : ""
                }


                <tr>

                    <td
                        style="
                            border:1px solid #222;
                            padding:8px;
                            font-weight:bold;
                        "
                    >
                        Original Total
                    </td>

                    <td
                        style="
                            border:1px solid #222;
                            padding:8px;
                            text-align:right;
                            font-weight:bold;
                        "
                    >
                        ${money(
                            originalTotal
                        )}
                    </td>

                </tr>


                ${
                    returnAmount > 0
                        ? `

                            <tr>

                                <td
                                    style="
                                        border:1px solid #ddd;
                                        padding:8px;
                                        font-weight:bold;
                                    "
                                >
                                    Return Amount
                                </td>

                                <td
                                    style="
                                        border:1px solid #ddd;
                                        padding:8px;
                                        text-align:right;
                                        font-weight:bold;
                                    "
                                >
                                    ${money(
                                        returnAmount
                                    )}
                                </td>

                            </tr>

                        `
                        : ""
                }


                <tr>

                    <td
                        style="
                            border:2px solid #222;
                            padding:10px;
                            font-weight:bold;
                            font-size:16px;
                        "
                    >
                        Grand Total
                    </td>

                    <td
                        style="
                            border:2px solid #222;
                            padding:10px;
                            text-align:right;
                            font-weight:bold;
                            font-size:16px;
                        "
                    >
                        ${money(
                            grandTotal
                        )}
                    </td>

                </tr>


                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        Advance / Paid
                    </td>

                    <td
                        style="
                            border:1px solid #ddd;
                            padding:7px;
                            text-align:right;
                        "
                    >
                        ${money(
                            advance
                        )}
                    </td>

                </tr>


                <tr>

                    <td style="border:1px solid #ddd;padding:7px;">
                        Balance
                    </td>

                    <td
                        style="
                            border:1px solid #ddd;
                            padding:7px;
                            text-align:right;
                        "
                    >
                        ${money(
                            balance
                        )}
                    </td>

                </tr>

            </table>


            ${
                bill.remark
                    ? `

                        <div
                            style="
                                margin-top:20px;
                                border-top:1px solid #ddd;
                                padding-top:8px;
                                font-size:11px;
                            "
                        >

                            <b>Remark:</b>

                            ${escapeHtml(
                                bill.remark
                            )}

                        </div>

                    `
                    : ""
            }


            <div
                style="
                    margin-top:30px;
                    text-align:center;
                    font-size:10px;
                "
            >
                Thank you
            </div>

        `;


        // ==========================================
        // ADD TO DOM
        //
        // IMPORTANT:
        // Keep visible while html2canvas captures.
        // ==========================================

        document.body.appendChild(
            pdfContainer
        );


        // ==========================================
        // WAIT FOR BROWSER PAINT
        // ==========================================

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


        // ==========================================
        // SAFE FILE NAME
        // ==========================================

        const safeFileName =
            String(
                billNo
            )
                .replace(
                    /[<>:"/\\|?*]+/g,
                    "_"
                )
                .trim();


        // ==========================================
        // GENERATE PDF
        // ==========================================

        await html2pdf()
            .set({

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

                    allowTaint: true,

                    backgroundColor:
                        "#ffffff",

                    logging: false

                },

                jsPDF: {

                    unit: "mm",

                    format: "a4",

                    orientation:
                        "portrait"

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


        console.log(
            `PDF SAVED: ${safeFileName}.pdf`
        );


    }


    catch (error) {

        console.error(
            "PDF ERROR:",
            error
        );


        alert(
            "Unable to generate PDF.\n\n" +
            error.message
        );

    }


    finally {

        // ==========================================
        // REMOVE PDF CONTAINER
        // ==========================================

        if (
            pdfContainer &&
            pdfContainer.parentNode
        ) {

            pdfContainer.parentNode.removeChild(
                pdfContainer
            );

        }

    }

}


// ======================================================
// START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "HISTORY PAGE READY"
        );

        loadBills();

    }
);
