// =======================================
// HISTORY.JS
// =======================================

// =======================================
// BACKEND API
// =======================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// =======================================
// ELEMENTS
// =======================================

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


let allBills = [];


// =======================================
// LOAD HTML2PDF
// =======================================

function loadHtml2Pdf() {

    return new Promise(
        function (resolve, reject) {

            if (
                typeof html2pdf !==
                "undefined"
            ) {

                resolve();

                return;

            }


            const script =
                document.createElement(
                    "script"
                );

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

            document.head.appendChild(
                script
            );

        }
    );

}


// =======================================
// LOAD ALL BILLS
// =======================================

async function loadBills() {

    try {

        historyBody.innerHTML = `
            <tr>
                <td colspan="15">
                    Loading...
                </td>
            </tr>
        `;


        console.log(
            "Loading history..."
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
            "History response status:",
            response.status
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Server response:",
                errorText
            );

            throw new Error(
                `Server returned HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "History API response:",
            data
        );


        // ===================================
        // SUPPORT ALL RESPONSE FORMATS
        // ===================================

        if (
            Array.isArray(data)
        ) {

            allBills = data;

        }

        else if (
            data &&
            data.success &&
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
                data?.message ||
                "Invalid bills response"
            );

        }


        displayBills(
            allBills
        );

    }

    catch (error) {

        console.error(
            "HISTORY LOAD ERROR:",
            error
        );


        historyBody.innerHTML = `
            <tr>
                <td colspan="15">
                    ❌ Unable to load bill history
                </td>
            </tr>
        `;


        updateSummary(
            0,
            0,
            0
        );

    }

}


// =======================================
// DISPLAY BILLS
// =======================================

function displayBills(
    bills
) {

    historyBody.innerHTML =
        "";


    let pendingCount = 0;

    let paidCount = 0;


    if (
        !Array.isArray(bills)
    ) {

        bills = [];

    }


    // ===================================
    // NO BILLS
    // ===================================

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


    // ===================================
    // DISPLAY EACH BILL
    // ===================================

    bills.forEach(
        function (
            bill,
            index
        ) {

            const balance =
                Number(
                    bill.balance_amount
                ) || 0;


            const grandTotal =
                Number(
                    bill.grand_total
                ) || 0;


            const advance =
                Number(
                    bill.advance_amount
                ) || 0;


            const returnAmount =
                Number(
                    bill.return_amount
                ) || 0;


            const isPending =
                balance > 0;


            let statusText;


            if (
                isPending
            ) {

                statusText =
                    "PENDING";

                pendingCount++;

            }

            else {

                statusText =
                    "PAID";

                paidCount++;

            }


            // ===================================
            // DATE
            // ===================================

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


            // ===================================
            // PAYMENT TYPE
            // ===================================

            const paymentType =
                bill.payment_type ||
                bill.paymentType ||
                "-";


            // ===================================
            // PAYMENT MODE
            //
            // CASH / UPI
            // ===================================

            let paymentMode =
                bill.payment_mode ||
                bill.paymentMode ||
                "";


            paymentMode =
                String(
                    paymentMode
                )
                .trim()
                .toUpperCase();


            if (
                paymentMode !== "UPI"
            ) {

                paymentMode =
                    "CASH";

            }


            // ===================================
            // DATABASE BILL ID
            // ===================================

            const billId =
                bill.id ||
                bill.bill_id ||
                bill.billId;


            // ===================================
            // CREATE ROW
            // ===================================

            const row =
                document.createElement(
                    "tr"
                );


            if (
                isPending
            ) {

                row.classList.add(
                    "pendingRow"
                );

            }


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

                    ${date}

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

                    ₹ ${grandTotal.toFixed(2)}

                </td>


                <!-- ADVANCE -->

                <td>

                    ₹ ${advance.toFixed(2)}

                </td>


                <!-- BALANCE -->

                <td>

                    ₹ ${balance.toFixed(2)}

                </td>


                <!-- RETURN -->

                <td>

                    ₹ ${returnAmount.toFixed(2)}

                </td>


                <!-- STATUS -->

                <td
                    class="
                        status
                        ${
                            isPending
                                ? "pending"
                                : "paid"
                        }
                    "
                >

                    ${statusText}

                </td>


                <!-- ACTION -->

                <td>

                    <div
                        class="history-actions"
                    >

                        ${
                            billId
                                ? `
                                    <button
                                        type="button"
                                        class="return-btn"
                                        onclick="openReturnPage(${Number(
                                            billId
                                        )})"
                                    >
                                        Return
                                    </button>
                                `
                                : ""
                        }


                        ${
                            billId
                                ? `
                                    <button
                                        type="button"
                                        class="pdf-btn"
                                        onclick="downloadBillPDF(
                                            ${Number(
                                                billId
                                            )}
                                        )"
                                    >
                                        PDF
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


    updateSummary(
        bills.length,
        pendingCount,
        paidCount
    );

}


// =======================================
// ESCAPE HTML
// =======================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

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


// =======================================
// SUMMARY
// =======================================

function updateSummary(
    total,
    pending,
    paid
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
            paid;

    }

}


// =======================================
// SEARCH
// =======================================

function searchBills() {

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

                );

            }
        );


    displayBills(
        filtered
    );

}


// =======================================
// SEARCH BUTTON
// =======================================

if (
    searchBtn
) {

    searchBtn.addEventListener(
        "click",
        searchBills
    );

}


// =======================================
// LIVE SEARCH
// =======================================

if (
    searchInput
) {

    searchInput.addEventListener(
        "input",
        searchBills
    );

}


// =======================================
// ENTER KEY
// =======================================

if (
    searchInput
) {

    searchInput.addEventListener(
        "keypress",
        function (
            event
        ) {

            if (
                event.key ===
                "Enter"
            ) {

                searchBills();

            }

        }
    );

}


// =======================================
// REFRESH
// =======================================

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


// =======================================
// HOME
// =======================================

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


// =======================================
// RETURN PAGE
// =======================================

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


    window.location.href =
        `return.html?id=${encodeURIComponent(
            billId
        )}`;

}


// =======================================
// PARSE JSON
// =======================================

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
        typeof value !==
        "string"
    ) {

        return fallback;

    }


    try {

        const parsed =
            JSON.parse(
                value
            );


        return parsed;

    }

    catch (
        error
    ) {

        console.error(
            "JSON PARSE ERROR:",
            error
        );


        return fallback;

    }

}


// =======================================
// NUMBER
// =======================================

function numberValue(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    const n =
        parseFloat(
            String(value)
                .replace(
                    /[₹,\s]/g,
                    ""
                )
        );


    return Number.isFinite(n)
        ? n
        : 0;

}


// =======================================
// MONEY
// =======================================

function money(
    value
) {

    return (
        "₹ " +
        numberValue(
            value
        ).toFixed(2)
    );

}


// =======================================
// GET WOOD DATA
// =======================================

function getWoodData(
    bill
) {

    let woodData =
        bill.wood_data;


    woodData =
        parseJSON(
            woodData,
            []
        );


    if (
        !Array.isArray(
            woodData
        )
    ) {

        woodData =
            parseJSON(
                bill.woodData,
                []
            );

    }


    if (
        !Array.isArray(
            woodData
        )
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


// =======================================
// GET OTHER DATA
// =======================================

function getOthersData(
    bill
) {

    let othersData =
        bill.others_data;


    othersData =
        parseJSON(
            othersData,
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


// =======================================
// GET WOOD NAME
// =======================================

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


// =======================================
// GET WOOD SIZE
// =======================================

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

        return `${breadth} × ${thickness}`;

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


// =======================================
// GET WOOD LENGTH / QTY
// =======================================

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
        item.length !==
        undefined
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


// =======================================
// BUILD PDF
// =======================================

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


    try {

        console.log(
            "Preparing PDF for bill:",
            billId
        );


        await loadHtml2Pdf();


        // ===================================
        // GET EXACT BILL
        // ===================================

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
            !data.success ||
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
            "PDF BILL DATA:",
            bill
        );


        // ===================================
        // BILL NUMBER
        // ===================================

        const billNo =
            bill.bill_no ||
            `BILL-${billId}`;


        // ===================================
        // PAYMENT MODE
        // ===================================

        let paymentMode =
            bill.payment_mode ||
            bill.paymentMode ||
            "CASH";


        paymentMode =
            String(
                paymentMode
            )
            .toUpperCase();


        if (
            paymentMode !==
            "UPI"
        ) {

            paymentMode =
                "CASH";

        }


        // ===================================
        // DATA
        // ===================================

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


        // ===================================
        // CREATE PDF CONTAINER
        // ===================================

        const pdfContainer =
            document.createElement(
                "div"
            );


        pdfContainer.style.width =
            "794px";

        pdfContainer.style.background =
            "#ffffff";

        pdfContainer.style.padding =
            "35px";

        pdfContainer.style.boxSizing =
            "border-box";

        pdfContainer.style.position =
            "fixed";

        pdfContainer.style.left =
            "-10000px";

        pdfContainer.style.top =
            "0";

        pdfContainer.style.fontFamily =
            "Arial, sans-serif";

        pdfContainer.style.color =
            "#111111";


        // ===================================
        // WOOD ROWS
        // ===================================

        let woodRows =
            "";


        if (
            woodData.length === 0
        ) {

            woodRows = `
                <tr>
                    <td colspan="9">
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
                                    size
                                )}
                            </td>

                            <td>
                                ${lengthQty}
                            </td>

                            <td>
                                ${totalQty}
                            </td>

                            <td>
                                ${cft.toFixed(2)}
                            </td>

                            <td>
                                ${money(
                                    rate
                                )}
                            </td>

                            <td>
                                ${money(
                                    amount
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    quality
                                )}
                            </td>

                        </tr>

                    `;

                }
            );

        }


        // ===================================
        // OTHER CHARGE ROWS
        // ===================================

        let chargeRows =
            "";


        if (
            labourCharge > 0
        ) {

            chargeRows += `

                <tr>

                    <td>
                        Labour Charge
                    </td>

                    <td>
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

                    <td>
                        Other Charge
                    </td>

                    <td>
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

                        <td>
                            ${escapeHtml(
                                name
                            )}
                        </td>

                        <td>
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

                    <td>
                        -
                    </td>

                    <td>
                        ₹ 0.00
                    </td>

                </tr>

            `;

        }


        // ===================================
        // PDF HTML
        // ===================================

        pdfContainer.innerHTML = `

            <div
                style="
                    text-align:center;
                    margin-bottom:20px;
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
                        font-size:13px;
                        margin-top:6px;
                    "
                >
                    BILL
                </div>

            </div>


            <hr>


            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                    margin-top:15px;
                    margin-bottom:20px;
                    font-size:13px;
                "
            >

                <tr>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        <b>Bill No</b>
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        ${escapeHtml(
                            billNo
                        )}
                    </td>


                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        <b>Date</b>
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        ${escapeHtml(
                            bill.bill_date ||
                            "-"
                        )}
                    </td>

                </tr>


                <tr>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        <b>Customer ID</b>
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        ${escapeHtml(
                            bill.customer_id ||
                            "-"
                        )}
                    </td>


                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        <b>Payment</b>
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                            font-weight:bold;
                        "
                    >
                        ${paymentMode}
                    </td>

                </tr>


                <tr>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        <b>Customer Name</b>
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        ${escapeHtml(
                            bill.customer_name ||
                            "-"
                        )}
                    </td>


                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        <b>Mobile</b>
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        ${escapeHtml(
                            bill.customer_mobile ||
                            "-"
                        )}
                    </td>

                </tr>


                <tr>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        <b>Place</b>
                    </td>

                    <td
                        colspan="3"
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        ${escapeHtml(
                            bill.customer_place ||
                            "-"
                        )}
                    </td>

                </tr>

            </table>


            <h3>
                Wood Details
            </h3>


            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                    font-size:11px;
                "
            >

                <thead>

                    <tr>

                        <th style="border:1px solid #222;padding:6px">
                            S.No
                        </th>

                        <th style="border:1px solid #222;padding:6px">
                            Wood
                        </th>

                        <th style="border:1px solid #222;padding:6px">
                            Size
                        </th>

                        <th style="border:1px solid #222;padding:6px">
                            Length → Qty
                        </th>

                        <th style="border:1px solid #222;padding:6px">
                            Qty
                        </th>

                        <th style="border:1px solid #222;padding:6px">
                            CFT
                        </th>

                        <th style="border:1px solid #222;padding:6px">
                            Rate
                        </th>

                        <th style="border:1px solid #222;padding:6px">
                            Amount
                        </th>

                        <th style="border:1px solid #222;padding:6px">
                            Quality
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${woodRows}

                </tbody>

            </table>


            <h3
                style="
                    margin-top:25px;
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


            <table
                style="
                    width:55%;
                    margin-left:auto;
                    margin-top:25px;
                    border-collapse:collapse;
                    font-size:13px;
                "
            >

                <tr>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        Wood Total
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                            text-align:right;
                        "
                    >
                        ${money(
                            woodTotal
                        )}
                    </td>

                </tr>


                <tr>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        Others Total
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
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

                                <td
                                    style="
                                        padding:7px;
                                        border:1px solid #ddd;
                                    "
                                >
                                    Discount
                                </td>

                                <td
                                    style="
                                        padding:7px;
                                        border:1px solid #ddd;
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
                            padding:9px;
                            border:1px solid #222;
                            font-weight:bold;
                        "
                    >
                        Original Total
                    </td>

                    <td
                        style="
                            padding:9px;
                            border:1px solid #222;
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
                                        padding:9px;
                                        border:1px solid #ddd;
                                    "
                                >
                                    Return
                                </td>

                                <td
                                    style="
                                        padding:9px;
                                        border:1px solid #ddd;
                                        text-align:right;
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
                            padding:11px;
                            border:2px solid #222;
                            font-weight:bold;
                            font-size:16px;
                        "
                    >
                        Grand Total
                    </td>

                    <td
                        style="
                            padding:11px;
                            border:2px solid #222;
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

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        Advance / Paid
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                            text-align:right;
                        "
                    >
                        ${money(
                            advance
                        )}
                    </td>

                </tr>


                <tr>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
                        "
                    >
                        Balance
                    </td>

                    <td
                        style="
                            padding:7px;
                            border:1px solid #ddd;
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
                                margin-top:25px;
                                border-top:1px solid #ddd;
                                padding-top:10px;
                                font-size:12px;
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
                    margin-top:35px;
                    text-align:center;
                    font-size:10px;
                "
            >
                Thank you
            </div>

        `;


        document.body.appendChild(
            pdfContainer
        );


        // ===================================
        // PDF FILENAME
        // ===================================

        const safeFileName =
            String(
                billNo
            )
            .replace(
                /[<>:"/\\|?*]+/g,
                "_"
            )
            .trim();


        // ===================================
        // GENERATE PDF
        // ===================================

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

                    useCORS: true

                },

                jsPDF: {

                    unit: "mm",

                    format: "a4",

                    orientation:
                        "portrait"

                },

                pagebreak: {
                    mode: [
                        "avoid-all",
                        "css",
                        "legacy"
                    ]
                }

            })

            .from(
                pdfContainer
            )

            .save();


        // ===================================
        // REMOVE TEMP PDF HTML
        // ===================================

        document.body.removeChild(
            pdfContainer
        );


        console.log(
            `PDF saved as ${safeFileName}.pdf`
        );

    }

    catch (
        error
    ) {

        console.error(
            "PDF ERROR:",
            error
        );


        alert(
            "Unable to generate PDF.\n\n" +
            error.message
        );

    }

}


// =======================================
// START
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBills();

    }
);
