// ============================================================
// CBILL.JS - FINAL BILL
// CLEAN + CORRECTED VERSION
// BASED ON bill.js TABLE DESIGN
//
// WOOD TABLE:
//
// S.No | Wood | Size | Length | Qty | CFT | Rate | Amount | Quality
//
// Multiple Length + Qty values are displayed as separate rows.
// S.No, Wood, Size, CFT, Rate, Amount and Quality use rowspan.
// ============================================================

console.clear();

console.log("====================================");
console.log("        CBILL.JS LOADED");
console.log("====================================");


// ============================================================
// API URL
// ============================================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// ============================================================
// ELEMENT HELPER
// ============================================================

const $ = (id) =>
    document.getElementById(id);


// ============================================================
// PAGE ELEMENTS
// ============================================================

const billNoElement =
    $("billNo");

const billDateElement =
    $("billDate");

const billDayTimeElement =
    $("billDayTime");


const customerNameElement =
    $("customerName");

const customerMobileElement =
    $("customerMobile");

const customerPlaceElement =
    $("customerPlace");


const woodTable =
    $("woodTable");

const chargeTable =
    $("chargeTable");


const woodTotalElement =
    $("woodTotal");

const woodDetailsTotalElement =
    $("woodDetailsTotal");

const othersTotalElement =
    $("othersTotal");


const subtotalAmountElement =
    $("subtotalAmount");

const subtotalElement =
    $("subtotal");


const discountRow =
    $("discountRow");

const discountAmountElement =
    $("discountAmount");


const grandTotalElement =
    $("grandTotal");


const advanceRow =
    $("advanceRow");

const advanceAmountElement =
    $("advanceAmount");

const balanceAmountElement =
    $("balanceAmount");


const cftSummary =
    $("cftSummary");


const printBtn =
    $("printBtn");

const clearBtn =
    $("clearBtn");

const homeBtn =
    $("homeBtn");


// ============================================================
// NUMBER HELPER
// ============================================================

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


// ============================================================
// MONEY FORMAT
// ============================================================

function money(value) {

    return (
        "₹ " +
        numberValue(value).toFixed(2)
    );
}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// SAFE JSON PARSER
// ============================================================

function parseJSON(
    value,
    fallback = []
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    if (
        typeof value !== "string"
    ) {
        return value;
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


// ============================================================
// GET LOCAL BILL DATA
// ============================================================

function getLocalBillData() {

    try {

        return (
            JSON.parse(
                localStorage.getItem(
                    "current_bill_data"
                ) || "{}"
            ) || {}
        );

    }
    catch (error) {

        console.error(
            "LOCAL BILL DATA ERROR:",
            error
        );

        return {};
    }
}


// ============================================================
// LOCAL BILL DATA
// ============================================================

const localBillData =
    getLocalBillData();


// ============================================================
// LOCAL PERSONAL DATA
// ============================================================

const localPersonal =
    localBillData.personal || {};


// ============================================================
// SAVED BILL ID
// ============================================================

const savedBillId =
    localStorage.getItem(
        "savedBillId"
    );


console.log(
    "SAVED BILL ID:",
    savedBillId
);

console.log(
    "LOCAL BILL DATA:",
    localBillData
);


// ============================================================
// LOCAL CUSTOMER FALLBACK
// ============================================================

function getLocalCustomer() {

    return {

        name:
            localPersonal.name ||
            localPersonal.customerName ||
            localStorage.getItem(
                "customerName"
            ) ||
            "",

        mobile:
            localPersonal.mobile ||
            localPersonal.customerMobile ||
            localStorage.getItem(
                "customerMobile"
            ) ||
            "",

        place:
            localPersonal.place ||
            localPersonal.customerPlace ||
            localStorage.getItem(
                "customerPlace"
            ) ||
            ""

    };
}


// ============================================================
// DATE FORMAT
// ============================================================

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

    return [

        String(
            date.getDate()
        ).padStart(2, "0"),

        String(
            date.getMonth() + 1
        ).padStart(2, "0"),

        date.getFullYear()

    ].join("/");
}


// ============================================================
// TIME FORMAT
// ============================================================

function formatTime(value) {

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

        return "-";
    }

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }
    );
}


// ============================================================
// DISCOUNT
// ============================================================

function getDiscount(bill) {

    let discount = 0;

    const discountData =
        bill.discount || {};


    // DATABASE
    discount =
        numberValue(
            bill.discount_amount
        );


    if (discount === 0) {

        discount =
            numberValue(
                bill.discount
            );
    }


    // CENTRAL DISCOUNT DATA
    if (discount === 0) {

        discount =
            numberValue(
                discountData.discountAmount
            );
    }


    if (discount === 0) {

        discount =
            numberValue(
                discountData.amount
            );
    }


    // LOCAL STORAGE
    if (discount === 0) {

        discount =
            numberValue(
                localStorage.getItem(
                    "discountAmount"
                )
            );
    }


    if (discount === 0) {

        discount =
            numberValue(
                localStorage.getItem(
                    "discount"
                )
            );
    }


    return Math.max(
        0,
        discount
    );
}


// ============================================================
// ADVANCE
// ============================================================

function getAdvanceAmount(bill) {

    let advance = 0;

    const advanceData =
        bill.advance || {};


    // DATABASE
    advance =
        numberValue(
            bill.advance_amount
        );


    if (advance === 0) {

        advance =
            numberValue(
                bill.advance
            );
    }


    // CENTRAL ADVANCE DATA
    if (advance === 0) {

        advance =
            numberValue(
                advanceData.advanceAmount
            );
    }


    if (advance === 0) {

        advance =
            numberValue(
                advanceData.amount
            );
    }


    // LOCAL STORAGE
    if (advance === 0) {

        advance =
            numberValue(
                localStorage.getItem(
                    "advanceAmount"
                )
            );
    }


    return Math.max(
        0,
        advance
    );
}


// ============================================================
// GET WOOD DATA
// ============================================================

function getWoodData(bill) {

    let data =
        parseJSON(
            bill.wood_data,
            []
        );


    // --------------------------------------------
    // woodData
    // --------------------------------------------

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        data =
            parseJSON(
                bill.woodData,
                []
            );
    }


    // --------------------------------------------
    // wood
    // --------------------------------------------

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        data =
            parseJSON(
                bill.wood,
                []
            );
    }


    // --------------------------------------------
    // LOCAL BILL DATA
    // --------------------------------------------

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        const localWood =
            localBillData.wood || {};


        // calculations
        if (
            Array.isArray(
                localWood.calculations
            )
        ) {

            data =
                localWood.calculations;
        }


        // woodCalculations
        if (
            (
                !Array.isArray(data) ||
                data.length === 0
            ) &&
            Array.isArray(
                localBillData.woodCalculations
            )
        ) {

            data =
                localBillData.woodCalculations;
        }


        // woodData
        if (
            (
                !Array.isArray(data) ||
                data.length === 0
            ) &&
            Array.isArray(
                localBillData.woodData
            )
        ) {

            data =
                localBillData.woodData;
        }
    }


    return Array.isArray(data)
        ? data
        : [];
}


// ============================================================
// GET OTHER DATA
// ============================================================

function getOthersData(bill) {

    const keys = [

        "others_data",

        "other_data",

        "charges",

        "additional_charges"

    ];


    for (
        const key of keys
    ) {

        const value =
            parseJSON(
                bill[key],
                []
            );


        if (
            Array.isArray(value) &&
            value.length > 0
        ) {

            return value;
        }
    }


    return [];
}


// ============================================================
// GET LABOUR DATA
// ============================================================

function getLabourData() {

    try {

        return (

            JSON.parse(
                localStorage.getItem(
                    "labourData"
                ) || "{}"
            ) || {}

        );

    }
    catch (error) {

        console.error(
            "LABOUR DATA ERROR:",
            error
        );

        return {};
    }
}


// ============================================================
// LABOUR CHARGE
// ============================================================

function getLabourCharge(
    bill,
    labourData
) {

    return numberValue(

        bill.labour_charge ??

        bill.labourCharge ??

        labourData.labourCharge ??

        0

    );
}


// ============================================================
// OTHER CHARGE
// ============================================================

function getOtherCharge(
    bill,
    labourData
) {

    return numberValue(

        bill.other_charge ??

        bill.otherCharge ??

        labourData.otherCharge ??

        0

    );
}


// ============================================================
// ADDITIONAL ITEMS
// ============================================================

function getAdditionalItems(
    bill,
    othersData,
    labourData
) {

    if (
        Array.isArray(othersData) &&
        othersData.length > 0
    ) {

        return othersData;
    }


    if (
        Array.isArray(
            bill.otherItems
        )
    ) {

        return bill.otherItems;
    }


    if (
        Array.isArray(
            labourData.otherItems
        )
    ) {

        return labourData.otherItems;
    }


    if (
        Array.isArray(
            labourData.items
        )
    ) {

        return labourData.items;
    }


    if (
        Array.isArray(
            localBillData.others
        )
    ) {

        return localBillData.others;
    }


    if (
        Array.isArray(
            localBillData.otherCharges
        )
    ) {

        return localBillData.otherCharges;
    }


    return [];
}


// ============================================================
// CALCULATE WOOD TOTAL
// ============================================================

function calculateWoodTotal(
    woodData
) {

    return woodData.reduce(

        function(
            total,
            item
        ) {

            if (!item) {
                return total;
            }

            return (
                total +
                numberValue(
                    item.amount
                )
            );

        },

        0

    );
}


// ============================================================
// CALCULATE ADDITIONAL TOTAL
// ============================================================

function calculateAdditionalTotal(
    items
) {

    if (
        !Array.isArray(items)
    ) {

        return 0;
    }


    return items.reduce(

        function(
            total,
            item
        ) {

            if (!item) {
                return total;
            }

            return (

                total +

                numberValue(

                    item.amount ??

                    item.charge ??

                    item.value ??

                    0

                )

            );

        },

        0

    );
}


// ============================================================
// LOAD WOOD DATA
//
// SAME DESIGN AS bill.js
//
// S.No | Wood | Size | Length | Qty | CFT | Rate | Amount | Quality
// ============================================================

function loadWoodData(
    woodData
) {

    if (!woodTable) {

        console.error(
            "woodTable not found."
        );

        return;
    }


    woodTable.innerHTML = "";


    // ========================================================
    // NO WOOD DATA
    // ========================================================

    if (
        !Array.isArray(woodData) ||
        woodData.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="9">

                    No wood data

                </td>

            </tr>

        `;

        return;
    }


    let calculationNumber = 0;


    // ========================================================
    // EACH WOOD CALCULATION
    // ========================================================

    woodData.forEach(
        function(item) {

            if (!item) {
                return;
            }


            calculationNumber++;


            // ==================================================
            // WOOD NAME
            // ==================================================

            let woodName =

                item.woodType ||

                item.wood ||

                item.woodName ||

                "-";


            if (
                woodName === "Other"
            ) {

                woodName =

                    item.otherWood ||

                    "Other";
            }


            // ==================================================
            // BREADTH
            // ==================================================

            const breadth =
                numberValue(
                    item.breadth
                );


            // ==================================================
            // THICKNESS
            // ==================================================

            const thickness =
                numberValue(
                    item.thickness
                );


            // ==================================================
            // SIZE
            // ==================================================

            let size = "-";


            if (
                breadth > 0 &&
                thickness > 0
            ) {

                size =
                    `${breadth} × ${thickness}`;
            }

            else if (
                breadth > 0
            ) {

                size =
                    String(breadth);
            }

            else if (
                thickness > 0
            ) {

                size =
                    String(thickness);
            }


            // ==================================================
            // QUALITY
            // ==================================================

            const quality =

                item.quality !== undefined &&

                item.quality !== null &&

                item.quality !== ""

                    ? String(
                        item.quality
                    )

                    : "1";


            // ==================================================
            // PIECES
            // ==================================================

            const pieces =

                Array.isArray(
                    item.pieces
                )

                    ? item.pieces

                    : [];


            // ==================================================
            // LENGTH + QTY
            //
            // Example:
            //
            // Length = 7, Qty = 2
            // Length = 5, Qty = 3
            // Length = 4, Qty = 2
            //
            // Display:
            //
            // 7 | 2
            // 5 | 3
            // 4 | 2
            // ==================================================

            let lengthValues = [];


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


                    const finalLength =

                        length +
                        extraLength;


                    const qty =
                        numberValue(
                            piece.qty
                        );


                    if (
                        finalLength > 0
                    ) {

                        lengthValues.push({

                            length:
                                finalLength,

                            qty:
                                qty

                        });
                    }

                }
            );


            // ==================================================
            // DIRECT LENGTH FALLBACK
            // ==================================================

            if (

                lengthValues.length === 0 &&

                item.length !== undefined

            ) {

                const directLength =
                    numberValue(
                        item.length
                    );


                const directQty =
                    numberValue(
                        item.qty
                    );


                if (
                    directLength > 0
                ) {

                    lengthValues.push({

                        length:
                            directLength,

                        qty:
                            directQty

                    });
                }
            }


            // ==================================================
            // TOTAL QTY
            // ==================================================

            let totalQty = 0;


            pieces.forEach(
                function(piece) {

                    if (!piece) {
                        return;
                    }


                    totalQty +=

                        numberValue(
                            piece.qty
                        );

                }
            );


            // ==================================================
            // DIRECT QTY FALLBACK
            // ==================================================

            if (

                totalQty === 0 &&

                item.qty !== undefined

            ) {

                totalQty =

                    numberValue(
                        item.qty
                    );
            }


            // ==================================================
            // NO LENGTH DATA
            // ==================================================

            if (
                lengthValues.length === 0
            ) {

                lengthValues.push({

                    length: 0,

                    qty:
                        totalQty

                });
            }


            // ==================================================
            // CFT
            // ==================================================

            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );


            // ==================================================
            // RATE
            // ==================================================

            const rate =
                numberValue(
                    item.rate
                );


            // ==================================================
            // AMOUNT
            // ==================================================

            const amount =
                numberValue(
                    item.amount
                );


            // ==================================================
            // ROW COUNT
            // ==================================================

            const rowCount =
                lengthValues.length;


            // ==================================================
            // CREATE ROW FOR EACH LENGTH + QTY
            // ==================================================

            lengthValues.forEach(

                function(
                    lengthItem,
                    pieceIndex
                ) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    // =================================================
                    // FIRST ROW
                    // =================================================

                    if (
                        pieceIndex === 0
                    ) {

                        row.innerHTML = `

                            <td
                                rowspan="${rowCount}"
                                class="sno-cell">

                                ${calculationNumber}

                            </td>


                            <td
                                rowspan="${rowCount}"
                                class="wood-cell">

                                ${escapeHTML(
                                    woodName
                                )}

                            </td>


                            <td
                                rowspan="${rowCount}"
                                class="size-cell">

                                ${escapeHTML(
                                    size
                                )}

                            </td>


                            <td
                                class="length-cell">

                                ${lengthItem.length}

                            </td>


                            <td
                                class="qty-cell">

                                ${lengthItem.qty}

                            </td>


                            <td
                                rowspan="${rowCount}"
                                class="cft-cell">

                                ${cubicFeet.toFixed(2)}

                            </td>


                            <td
                                rowspan="${rowCount}"
                                class="rate-cell">

                                ${money(rate)}

                            </td>


                            <td
                                rowspan="${rowCount}"
                                class="amount-cell">

                                ${money(amount)}

                            </td>


                            <td
                                rowspan="${rowCount}"
                                class="quality-cell">

                                ${escapeHTML(
                                    quality
                                )}

                            </td>

                        `;
                    }


                    // =================================================
                    // ADDITIONAL ROW
                    //
                    // ONLY LENGTH + QTY
                    // =================================================

                    else {

                        row.innerHTML = `

                            <td
                                class="length-cell">

                                ${lengthItem.length}

                            </td>


                            <td
                                class="qty-cell">

                                ${lengthItem.qty}

                            </td>

                        `;
                    }


                    // =================================================
                    // APPEND ROW
                    // =================================================

                    woodTable.appendChild(
                        row
                    );

                }

            );

        }
    );
}


// ============================================================
// OTHER CHARGES TABLE
// ============================================================

function loadOtherCharges(

    additionalItems,

    labourCharge,

    otherCharge

) {

    if (!chargeTable) {

        console.error(
            "chargeTable not found."
        );

        return;
    }


    chargeTable.innerHTML = "";


    let serialNumber = 1;

    let hasCharge = false;


    // ========================================================
    // LABOUR
    // ========================================================

    if (
        labourCharge > 0
    ) {

        hasCharge = true;


        chargeTable.innerHTML += `

            <tr>

                <td>

                    ${serialNumber++}

                </td>


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


    // ========================================================
    // OTHER CHARGE
    // ========================================================

    if (
        otherCharge > 0
    ) {

        hasCharge = true;


        chargeTable.innerHTML += `

            <tr>

                <td>

                    ${serialNumber++}

                </td>


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


    // ========================================================
    // ADDITIONAL ITEMS
    // ========================================================

    if (
        Array.isArray(
            additionalItems
        )
    ) {

        additionalItems.forEach(
            function(item) {

                if (!item) {
                    return;
                }


                const amount =

                    numberValue(

                        item.amount ??

                        item.charge ??

                        item.value ??

                        0

                    );


                if (
                    amount <= 0
                ) {

                    return;
                }


                const name =

                    item.reason ||

                    item.name ||

                    item.title ||

                    item.description ||

                    "Other Charge";


                hasCharge = true;


                chargeTable.innerHTML += `

                    <tr>

                        <td>

                            ${serialNumber++}

                        </td>


                        <td>

                            ${escapeHTML(
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
    }


    // ========================================================
    // EMPTY
    // ========================================================

    if (!hasCharge) {

        chargeTable.innerHTML = `

            <tr>

                <td>-</td>

                <td>-</td>

                <td>-</td>

            </tr>

        `;
    }
}


// ============================================================
// CFT SUMMARY
//
// SAME WOOD + SAME QUALITY
// = COMBINED CFT
// ============================================================

function loadCftSummary(
    woodData
) {

    if (!cftSummary) {

        console.error(
            "cftSummary not found."
        );

        return;
    }


    cftSummary.innerHTML = "";


    if (

        !Array.isArray(woodData) ||

        woodData.length === 0

    ) {

        cftSummary.innerHTML =

            `<div class="cft-item">-</div>`;

        return;
    }


    const groupedCFT =
        new Map();


    woodData.forEach(
        function(item) {

            if (!item) {
                return;
            }


            // ----------------------------------------
            // WOOD NAME
            // ----------------------------------------

            let woodName =

                item.woodType ||

                item.wood ||

                item.woodName ||

                "-";


            if (
                woodName === "Other"
            ) {

                woodName =

                    item.otherWood ||

                    "Other";
            }


            // ----------------------------------------
            // QUALITY
            // ----------------------------------------

            const quality =

                item.quality !== undefined &&

                item.quality !== null &&

                item.quality !== ""

                    ? String(
                        item.quality
                    )

                    : "1";


            // ----------------------------------------
            // CFT
            // ----------------------------------------

            const cubicFeet =

                numberValue(
                    item.cubicFeet
                );


            // ----------------------------------------
            // GROUP KEY
            // ----------------------------------------

            const key =

                woodName
                    .trim()
                    .toLowerCase()

                +

                "|||"

                +

                quality
                    .trim()
                    .toLowerCase();


            // ----------------------------------------
            // CREATE GROUP
            // ----------------------------------------

            if (
                !groupedCFT.has(key)
            ) {

                groupedCFT.set(

                    key,

                    {

                        woodName:
                            woodName,

                        quality:
                            quality,

                        cft:
                            0

                    }

                );
            }


            // ----------------------------------------
            // ADD CFT
            // ----------------------------------------

            groupedCFT.get(key).cft +=
                cubicFeet;

        }
    );


    // ========================================================
    // DISPLAY
    // ========================================================

    let serialNumber = 1;


    groupedCFT.forEach(
        function(group) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "cft-item";


            div.innerHTML = `

                <strong>

                    ${serialNumber}.

                    ${escapeHTML(
                        group.woodName
                    )}

                    (${escapeHTML(
                        group.quality
                    )})

                </strong>


                <span>

                    ${group.cft.toFixed(2)}

                    CFT

                </span>

            `;


            cftSummary.appendChild(
                div
            );


            serialNumber++;

        }
    );
}


// ============================================================
// LOAD FINAL BILL
// ============================================================

async function loadFinalBill() {

    // ========================================================
    // CHECK BILL ID
    // ========================================================

    if (!savedBillId) {

        console.error(
            "savedBillId is missing."
        );


        alert(

            "Saved bill ID is missing.\n\n" +

            "Please open the Final Bill from Confirm Bill."

        );


        return;
    }


    try {

        console.log(
            "Loading bill:",
            savedBillId
        );


        // ====================================================
        // API REQUEST
        // ====================================================

        const response =

            await fetch(

                `${API_URL}/bill/${encodeURIComponent(
                    savedBillId
                )}`

            );


        console.log(
            "API STATUS:",
            response.status
        );


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        // ====================================================
        // API RESPONSE
        // ====================================================

        const result =
            await response.json();


        console.log(
            "DATABASE RESPONSE:",
            result
        );


        const bill =

            result.bill ||

            result.data ||

            result;


        if (!bill) {

            throw new Error(
                "Bill not found."
            );
        }


        // ====================================================
        // BILL NUMBER
        //
        // IMPORTANT:
        // Uses database bill number.
        // Does NOT generate a new bill number.
        // ====================================================

        const databaseBillNo =

            bill.bill_no ||

            bill.billNo ||

            bill.bill_number ||

            bill.billNumber ||

            "";


        if (
            billNoElement
        ) {

            billNoElement.textContent =

                databaseBillNo ||

                "---";
        }


        if (
            databaseBillNo
        ) {

            localStorage.setItem(

                "savedBillNo",

                databaseBillNo

            );
        }


        // ====================================================
        // CUSTOMER DETAILS
        // ====================================================

        const localCustomer =
            getLocalCustomer();


        const customerName =

            bill.customer_name ||

            bill.customerName ||

            bill.customer ||

            localCustomer.name ||

            "-";


        const customerMobile =

            bill.customer_mobile ||

            bill.customerMobile ||

            bill.mobile ||

            localCustomer.mobile ||

            "-";


        const customerPlace =

            bill.customer_place ||

            bill.customerPlace ||

            bill.place ||

            localCustomer.place ||

            "-";


        // ====================================================
        // DISPLAY CUSTOMER NAME
        // ====================================================

        if (
            customerNameElement
        ) {

            customerNameElement.textContent =

                customerName;
        }


        // ====================================================
        // DISPLAY CUSTOMER MOBILE
        // ====================================================

        if (
            customerMobileElement
        ) {

            customerMobileElement.textContent =

                customerMobile;
        }


        // ====================================================
        // DISPLAY CUSTOMER PLACE
        // ====================================================

        if (
            customerPlaceElement
        ) {

            customerPlaceElement.textContent =

                customerPlace;
        }


        // ====================================================
        // BILL DATE
        // ====================================================

        const billDate =

            bill.bill_date ||

            bill.billDate ||

            bill.date ||

            bill.created_at;


        // ====================================================
        // BILL TIME
        // ====================================================

        const billTime =

            bill.bill_time ||

            bill.billTime ||

            bill.time ||

            bill.created_at;


        if (
            billDateElement
        ) {

            billDateElement.textContent =

                formatDate(
                    billDate
                );
        }


        if (
            billDayTimeElement
        ) {

            billDayTimeElement.textContent =

                formatTime(
                    billTime
                );
        }


        // ====================================================
        // WOOD DATA
        // ====================================================

        const woodData =
            getWoodData(
                bill
            );


        console.log(
            "WOOD DATA:",
            woodData
        );


        // ====================================================
        // LABOUR DATA
        // ====================================================

        const labourData =
            getLabourData();


        // ====================================================
        // OTHER CHARGES
        // ====================================================

        const othersData =
            getOthersData(
                bill
            );


        const additionalItems =

            getAdditionalItems(

                bill,

                othersData,

                labourData

            );


        // ====================================================
        // LABOUR CHARGE
        // ====================================================

        const labourCharge =

            getLabourCharge(

                bill,

                labourData

            );


        // ====================================================
        // OTHER CHARGE
        // ====================================================

        const otherCharge =

            getOtherCharge(

                bill,

                labourData

            );


        // ====================================================
        // WOOD TOTAL
        // ====================================================

        const woodTotal =

            calculateWoodTotal(

                woodData

            );


        // ====================================================
        // ADDITIONAL TOTAL
        // ====================================================

        const additionalTotal =

            calculateAdditionalTotal(

                additionalItems

            );


        // ====================================================
        // OTHERS TOTAL
        // ====================================================

        let othersTotal =

            labourCharge +

            otherCharge +

            additionalTotal;


        // ====================================================
        // DATABASE OTHERS TOTAL FALLBACK
        // ====================================================

        if (
            othersTotal === 0
        ) {

            const databaseOthersTotal =

                numberValue(

                    bill.others_total

                );


            if (
                databaseOthersTotal > 0
            ) {

                othersTotal =

                    databaseOthersTotal;
            }
        }


        // ====================================================
        // SUBTOTAL
        // ====================================================

        const subtotal =

            woodTotal +

            othersTotal;


        // ====================================================
        // DISCOUNT
        // ====================================================

        const discount =

            getDiscount(
                bill
            );


        // ====================================================
        // GRAND TOTAL
        // ====================================================

        let grandTotal =

            subtotal -

            discount;


        if (
            grandTotal < 0
        ) {

            grandTotal = 0;
        }


        // ====================================================
        // ROUND GRAND TOTAL
        // ====================================================

        grandTotal =

            Math.round(
                grandTotal
            );


        // ====================================================
        // ADVANCE
        // ====================================================

        let advanceAmount =

            getAdvanceAmount(
                bill
            );


        // ====================================================
        // ADVANCE CANNOT EXCEED GRAND TOTAL
        // ====================================================

        if (
            advanceAmount >
            grandTotal
        ) {

            advanceAmount =
                grandTotal;
        }


        // ====================================================
        // BALANCE
        // ====================================================

        const balanceAmount =

            Math.max(

                0,

                grandTotal -

                advanceAmount

            );


        // ====================================================
        // LOAD WOOD TABLE
        // ====================================================

        loadWoodData(
            woodData
        );


        // ====================================================
        // LOAD OTHER CHARGES TABLE
        // ====================================================

        loadOtherCharges(

            additionalItems,

            labourCharge,

            otherCharge

        );


        // ====================================================
        // LOAD CFT SUMMARY
        // ====================================================

        loadCftSummary(
            woodData
        );


        // ====================================================
        // WOOD TOTAL DISPLAY
        // ====================================================

        if (
            woodTotalElement
        ) {

            woodTotalElement.textContent =

                money(
                    woodTotal
                );
        }


        // ====================================================
        // WOOD DETAILS TOTAL DISPLAY
        // ====================================================

        if (
            woodDetailsTotalElement
        ) {

            woodDetailsTotalElement.textContent =

                money(
                    woodTotal
                );
        }


        // ====================================================
        // OTHERS TOTAL DISPLAY
        // ====================================================

        if (
            othersTotalElement
        ) {

            othersTotalElement.textContent =

                money(
                    othersTotal
                );
        }


        // ====================================================
        // SUBTOTAL AMOUNT DISPLAY
        // ====================================================

        if (
            subtotalAmountElement
        ) {

            subtotalAmountElement.textContent =

                money(
                    subtotal
                );
        }


        // ====================================================
        // SUBTOTAL DISPLAY
        // ====================================================

        if (
            subtotalElement
        ) {

            subtotalElement.textContent =

                money(
                    subtotal
                );
        }


        // ====================================================
        // DISCOUNT DISPLAY
        // ====================================================

        if (
            discount > 0
        ) {

            if (
                discountRow
            ) {

                discountRow.style.display =
                    "flex";
            }


            if (
                discountAmountElement
            ) {

                discountAmountElement.textContent =

                    "- " +

                    money(
                        discount
                    );
            }

        }

        else {

            if (
                discountRow
            ) {

                discountRow.style.display =
                    "none";
            }
        }


        // ====================================================
        // GRAND TOTAL DISPLAY
        // ====================================================

        if (
            grandTotalElement
        ) {

            grandTotalElement.textContent =

                money(
                    grandTotal
                );
        }


        // ====================================================
        // ADVANCE DISPLAY
        // ====================================================

        if (
            advanceAmountElement
        ) {

            advanceAmountElement.textContent =

                money(
                    advanceAmount
                );
        }


        if (
            advanceRow
        ) {

            advanceRow.style.display =

                advanceAmount > 0

                    ? "flex"

                    : "none";
        }


        // ====================================================
        // BALANCE DISPLAY
        // ====================================================

        if (
            balanceAmountElement
        ) {

            balanceAmountElement.textContent =

                money(
                    balanceAmount
                );
        }


        // ====================================================
        // SAVE TOTALS
        // ====================================================

        localStorage.setItem(
            "woodTotal",
            String(woodTotal)
        );


        localStorage.setItem(
            "othersTotal",
            String(othersTotal)
        );


        localStorage.setItem(
            "subtotal",
            String(subtotal)
        );


        localStorage.setItem(
            "grandTotal",
            String(grandTotal)
        );


        localStorage.setItem(
            "finalTotal",
            String(grandTotal)
        );


        localStorage.setItem(
            "balanceAmount",
            String(balanceAmount)
        );


        // ====================================================
        // DEBUG
        // ====================================================

        console.log(
            "===================================="
        );

        console.log(
            "FINAL BILL DATA"
        );

        console.log(
            "Bill No:",
            databaseBillNo
        );

        console.log(
            "Customer:",
            customerName
        );

        console.log(
            "Mobile:",
            customerMobile
        );

        console.log(
            "Place:",
            customerPlace
        );

        console.log(
            "Wood Count:",
            woodData.length
        );

        console.log(
            "Wood Total:",
            woodTotal
        );

        console.log(
            "Labour:",
            labourCharge
        );

        console.log(
            "Other Charge:",
            otherCharge
        );

        console.log(
            "Additional:",
            additionalTotal
        );

        console.log(
            "Others Total:",
            othersTotal
        );

        console.log(
            "Subtotal:",
            subtotal
        );

        console.log(
            "Discount:",
            discount
        );

        console.log(
            "Grand Total:",
            grandTotal
        );

        console.log(
            "Advance:",
            advanceAmount
        );

        console.log(
            "Balance:",
            balanceAmount
        );

        console.log(
            "===================================="
        );

    }

    catch (error) {

        console.error(
            "CBILL ERROR:",
            error
        );


        alert(

            "Unable to load final bill.\n\n" +

            error.message

        );
    }
}


// ============================================================
// PRINT BILL
// ============================================================

if (
    printBtn
) {

    printBtn.addEventListener(

        "click",

        function() {

            console.log(
                "PRINT BILL"
            );


            window.print();

        }

    );
}


// ============================================================
// HOME BUTTON
// ============================================================

if (
    homeBtn
) {

    homeBtn.addEventListener(

        "click",

        function() {

            localStorage.removeItem(
                "savedBillId"
            );

            localStorage.removeItem(
                "savedBillNo"
            );

            localStorage.removeItem(
                "savedCustomerId"
            );


            window.location.href =
                "../html/index.html";

        }

    );
}


// ============================================================
// CLEAR BILL
// ============================================================

if (
    clearBtn
) {

    clearBtn.addEventListener(

        "click",

        function() {


            const ok =
                confirm(

                    "Are you sure you want to clear ALL bill data?"

                );


            if (!ok) {

                return;
            }


            // --------------------------------------------
            // ALL BILL RELATED LOCAL STORAGE
            // --------------------------------------------

            const keys = [

                "current_bill_data",

                "savedBillId",

                "savedBillNo",

                "savedCustomerId",


                "woodData",

                "wood_page_data",

                "wood",

                "woodDataStorage",

                "woodTotal",


                "customerName",

                "customerMobile",

                "customerPlace",


                "labour",

                "labourData",

                "labourCharge",

                "otherCharge",

                "othersData",

                "othersTotal",


                "discount",

                "discountAmount",

                "discountApplied",


                "advance",

                "advanceAmount",

                "balanceAmount",


                "grandTotal",

                "finalTotal",

                "subtotal",


                "billConfirmed",

                "billConfirmedAt",

                "editingBill"

            ];


            keys.forEach(

                function(key) {

                    localStorage.removeItem(
                        key
                    );

                }

            );


            // --------------------------------------------
            // CLEAR SESSION STORAGE
            // --------------------------------------------

            sessionStorage.clear();


            console.log(
                "ALL BILL DATA CLEARED"
            );


            // --------------------------------------------
            // GO HOME
            // --------------------------------------------

            window.location.href =
                "../html/index.html";

        }

    );
}


// ============================================================
// START APPLICATION
// ============================================================

loadFinalBill();
