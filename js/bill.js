// ============================================================
// BILL.JS
// FINAL BILL DISPLAY
// ============================================================

console.log("====================================");
console.log("BILL.JS LOADED");
console.log("====================================");


// ============================================================
// NUMBER HELPER
// ============================================================

function toNumber(value) {

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
// MONEY
// ============================================================

function money(value) {

    return (
        "₹ " +
        toNumber(value).toFixed(2)
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// GET COMPLETE BILL DATA
// ============================================================
//
// Your storedata.js uses:
//
// current_bill_data
//
// Structure:
//
// {
//     wood: {},
//     labour: {},
//     personal: {},
//     advance: {},
//     discount: {},
//     totals: {}
// }
//
// ============================================================

let billData = {};


// ------------------------------------------------------------
// FIRST: USE storedata.js
// ------------------------------------------------------------

if (
    typeof getBillData ===
    "function"
) {

    billData =
        getBillData();

}
else {

    // Compatibility fallback

    try {

        billData =
            JSON.parse(
                localStorage.getItem(
                    "current_bill_data"
                ) || "{}"
            );

    }
    catch (error) {

        console.error(
            "Unable to read current_bill_data:",
            error
        );

        billData = {};

    }

}


console.log(
    "===================================="
);

console.log(
    "COMPLETE BILL DATA:"
);

console.log(
    billData
);

console.log(
    "===================================="
);


// ============================================================
// PAGE DATA
// ============================================================

const personalData =
    billData.personal || {};

const woodPage =
    billData.wood || {};

const labourDataCentral =
    billData.labour || {};

const advanceDataCentral =
    billData.advance || {};

const discountDataCentral =
    billData.discount || {};

const totalsData =
    billData.totals || {};


// ============================================================
// CUSTOMER DETAILS
// ============================================================
//
// personal.js stores:
//
// name
// mobile
// place
//
// ============================================================

const customerName =
    personalData.name || "";

const customerMobile =
    personalData.mobile || "";

const customerPlace =
    personalData.place || "";


// ============================================================
// DISPLAY CUSTOMER
// ============================================================

const customerNameElement =
    document.getElementById(
        "customerName"
    );

const customerMobileElement =
    document.getElementById(
        "customerMobile"
    );

const customerPlaceElement =
    document.getElementById(
        "customerPlace"
    );


if (
    customerNameElement
) {

    customerNameElement.textContent =
        customerName || "-";

}


if (
    customerMobileElement
) {

    customerMobileElement.textContent =
        customerMobile || "-";

}


if (
    customerPlaceElement
) {

    customerPlaceElement.textContent =
        customerPlace || "-";

}


console.log(
    "CUSTOMER NAME:",
    customerName
);

console.log(
    "CUSTOMER MOBILE:",
    customerMobile
);

console.log(
    "CUSTOMER PLACE:",
    customerPlace
);


// ============================================================
// DATE
// ============================================================

const billDateElement =
    document.getElementById(
        "billDate"
    );

const billDayTimeElement =
    document.getElementById(
        "billDayTime"
    );


// ------------------------------------------------------------
// USE SAVED BILL DATE IF AVAILABLE
// ------------------------------------------------------------

let savedBillDate =
    localStorage.getItem(
        "billDate"
    );


// ------------------------------------------------------------
// CURRENT DATE
// ------------------------------------------------------------

const now =
    new Date();


const day =
    String(
        now.getDate()
    ).padStart(2, "0");


const month =
    String(
        now.getMonth() + 1
    ).padStart(2, "0");


const year =
    now.getFullYear();


const currentDate =
    `${day}-${month}-${year}`;


let hours =
    now.getHours();


const minutes =
    String(
        now.getMinutes()
    ).padStart(2, "0");


const ampm =
    hours >= 12
        ? "PM"
        : "AM";


hours =
    hours % 12;


if (
    hours === 0
) {

    hours = 12;

}


const currentTime =
    `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;


// ------------------------------------------------------------
// DISPLAY DATE
// ------------------------------------------------------------

if (
    billDateElement
) {

    billDateElement.textContent =
        savedBillDate ||
        currentDate;

}


// ------------------------------------------------------------
// DISPLAY TIME
// ------------------------------------------------------------

if (
    billDayTimeElement
) {

    billDayTimeElement.textContent =
        currentTime;

}


// ============================================================
// BILL NUMBER
// ============================================================
//
// IMPORTANT:
//
// DO NOT GENERATE BILL NUMBER HERE.
//
// Your database-generated bill number remains untouched.
//
// If another existing script puts the bill number into
// #billNo, this code will NOT overwrite it.
// ============================================================

const billNoElement =
    document.getElementById(
        "billNo"
    );


console.log(
    "BILL NUMBER ELEMENT:",
    billNoElement
);


// ============================================================
// WOOD DATA
// ============================================================
//
// REAL STRUCTURE FROM YOUR wood.js:
//
// woodPage.calculations[]
//
// Each calculation:
//
// {
//     woodType,
//     otherWood,
//     breadth,
//     thickness,
//     rate,
//     quality,
//     pieces: [
//         {
//             length,
//             extraLength,
//             qty,
//             totalLength
//         }
//     ],
//     totalLength,
//     cubicFeet,
//     amount
// }
//
// ============================================================

let woodCalculations = [];


if (
    Array.isArray(
        woodPage.calculations
    )
) {

    woodCalculations =
        woodPage.calculations;

}


// Compatibility fallback for old woodData

if (
    woodCalculations.length === 0
) {

    try {

        const oldWoodData =
            JSON.parse(
                localStorage.getItem(
                    "woodData"
                ) || "[]"
            );


        if (
            Array.isArray(
                oldWoodData
            )
        ) {

            woodCalculations =
                oldWoodData;

        }

    }
    catch (error) {

        console.log(
            "No old woodData"
        );

    }

}


console.log(
    "===================================="
);

console.log(
    "WOOD CALCULATIONS:"
);

console.log(
    woodCalculations
);

console.log(
    "===================================="
);


// ============================================================
// GROUP SAME WOOD + SAME QUALITY
// ============================================================
//
// IMPORTANT:
//
// Same Wood + Same Quality = ONE ROW
//
// Example:
//
// Teak + Quality 1
// Teak + Quality 1
// Teak + Quality 2
//
// becomes:
//
// Teak + Quality 1
// Teak + Quality 2
//
// ============================================================

const woodGroups = {};


// ============================================================
// PROCESS EACH WOOD CALCULATION
// ============================================================

woodCalculations.forEach(
    function (item) {

        if (
            !item
        ) {

            return;

        }


        // ----------------------------------------------------
        // WOOD NAME
        // ----------------------------------------------------

        let woodName =
            item.woodType ||
            "";


        if (
            woodName === "Other"
        ) {

            woodName =
                item.otherWood ||
                "Other";

        }


        if (
            !woodName
        ) {

            woodName =
                "-";

        }


        // ----------------------------------------------------
        // QUALITY
        // ----------------------------------------------------

        const quality =
            item.quality !== undefined &&
            item.quality !== ""
                ? item.quality
                : "1";


        // ----------------------------------------------------
        // GROUP KEY
        // ----------------------------------------------------

        const groupKey =
            String(
                woodName
            )
                .trim()
                .toLowerCase()
            +
            "___"
            +
            String(
                quality
            )
                .trim()
                .toLowerCase();


        // ----------------------------------------------------
        // BREADTH
        // ----------------------------------------------------

        const breadth =
            toNumber(
                item.breadth
            );


        // ----------------------------------------------------
        // THICKNESS
        // ----------------------------------------------------

        const thickness =
            toNumber(
                item.thickness
            );


        // ----------------------------------------------------
        // RATE
        // ----------------------------------------------------

        const rate =
            toNumber(
                item.rate
            );


        // ----------------------------------------------------
        // TOTAL CFT
        // ----------------------------------------------------

        const cubicFeet =
            toNumber(
                item.cubicFeet
            );


        // ----------------------------------------------------
        // TOTAL AMOUNT
        // ----------------------------------------------------

        const amount =
            toNumber(
                item.amount
            );


        // ----------------------------------------------------
        // PIECES
        // ----------------------------------------------------

        const pieces =
            Array.isArray(
                item.pieces
            )
                ? item.pieces
                : [];


        // ----------------------------------------------------
        // CALCULATE TOTAL QTY
        // ----------------------------------------------------

        let totalQty = 0;

        pieces.forEach(
            function (piece) {

                totalQty +=
                    toNumber(
                        piece.qty
                    );

            }
        );


        // ----------------------------------------------------
        // TOTAL LENGTH
        // ----------------------------------------------------

        let totalLength =
            toNumber(
                item.totalLength
            );


        // If totalLength is not saved,
        // calculate it from pieces.

        if (
            totalLength === 0
        ) {

            pieces.forEach(
                function (piece) {

                    const length =
                        toNumber(
                            piece.length
                        );


                    const extraLength =
                        toNumber(
                            piece.extraLength
                        );


                    const qty =
                        toNumber(
                            piece.qty
                        );


                    totalLength +=
                        (
                            length +
                            extraLength
                        ) *
                        qty;

                }
            );

        }


        // ----------------------------------------------------
        // CREATE GROUP
        // ----------------------------------------------------

        if (
            !woodGroups[groupKey]
        ) {

            woodGroups[groupKey] = {

                wood:
                    woodName,

                quality:
                    quality,

                breadths: [],

                thicknesses: [],

                lengths: [],

                rate:
                    rate,

                qty:
                    0,

                totalLength:
                    0,

                cubicFeet:
                    0,

                amount:
                    0

            };

        }


        const group =
            woodGroups[groupKey];


        // ----------------------------------------------------
        // ADD BREADTH
        // ----------------------------------------------------

        if (
            breadth > 0 &&
            !group.breadths.includes(
                breadth
            )
        ) {

            group.breadths.push(
                breadth
            );

        }


        // ----------------------------------------------------
        // ADD THICKNESS
        // ----------------------------------------------------

        if (
            thickness > 0 &&
            !group.thicknesses.includes(
                thickness
            )
        ) {

            group.thicknesses.push(
                thickness
            );

        }


        // ----------------------------------------------------
        // ADD PIECE LENGTHS
        // ----------------------------------------------------

        pieces.forEach(
            function (piece) {

                const length =
                    toNumber(
                        piece.length
                    );


                const extraLength =
                    toNumber(
                        piece.extraLength
                    );


                const finalLength =
                    length +
                    extraLength;


                if (
                    finalLength > 0
                ) {

                    if (
                        !group.lengths.includes(
                            finalLength
                        )
                    ) {

                        group.lengths.push(
                            finalLength
                        );

                    }

                }

            }
        );


        // ----------------------------------------------------
        // ADD QTY
        // ----------------------------------------------------

        group.qty +=
            totalQty;


        // ----------------------------------------------------
        // ADD TOTAL LENGTH
        // ----------------------------------------------------

        group.totalLength +=
            totalLength;


        // ----------------------------------------------------
        // ADD CFT
        // ----------------------------------------------------

        group.cubicFeet +=
            cubicFeet;


        // ----------------------------------------------------
        // ADD AMOUNT
        // ----------------------------------------------------

        group.amount +=
            amount;


        // ----------------------------------------------------
        // KEEP RATE
        // ----------------------------------------------------

        if (
            group.rate === 0 &&
            rate > 0
        ) {

            group.rate =
                rate;

        }

    }
);


// ============================================================
// FINAL WOOD GROUPS
// ============================================================

const finalWoodGroups =
    Object.values(
        woodGroups
    );


console.log(
    "===================================="
);

console.log(
    "FINAL WOOD GROUPS:"
);

console.table(
    finalWoodGroups
);

console.log(
    "===================================="
);


// ============================================================
// DISPLAY WOOD TABLE
// ============================================================

const woodTable =
    document.getElementById(
        "woodTable"
    );


if (
    woodTable
) {

    woodTable.innerHTML = "";


    if (
        finalWoodGroups.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="10">
                    No wood data
                </td>

            </tr>

        `;

    }
    else {

        finalWoodGroups.forEach(
            function (
                item,
                index
            ) {


                // --------------------------------------------
                // SIZE
                // --------------------------------------------

                let size = "-";


                if (
                    item.breadths.length > 0 ||
                    item.thicknesses.length > 0
                ) {

                    const breadthText =
                        item.breadths
                            .map(
                                function (value) {
                                    return value;
                                }
                            )
                            .join(" / ");


                    const thicknessText =
                        item.thicknesses
                            .map(
                                function (value) {
                                    return value;
                                }
                            )
                            .join(" / ");


                    if (
                        breadthText &&
                        thicknessText
                    ) {

                        size =
                            `${breadthText} × ${thicknessText}`;

                    }
                    else if (
                        breadthText
                    ) {

                        size =
                            breadthText;

                    }
                    else {

                        size =
                            thicknessText;

                    }

                }


                // --------------------------------------------
                // LENGTH
                // --------------------------------------------

                let lengthText =
                    "-";


                if (
                    item.lengths.length > 0
                ) {

                    lengthText =
                        item.lengths
                            .map(
                                function (value) {
                                    return value;
                                }
                            )
                            .join(" / ");

                }


                // --------------------------------------------
                // CREATE ROW
                // --------------------------------------------

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.wood
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            size
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            lengthText
                        )}
                    </td>

                    <td>
                        ${item.qty}
                    </td>

                    <td>
                        ${item.totalLength.toFixed(2)}
                    </td>

                    <td>
                        ${item.cubicFeet.toFixed(2)}
                    </td>

                    <td>
                        ${money(
                            item.rate
                        )}
                    </td>

                    <td>
                        ${money(
                            item.amount
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.quality
                        )}
                    </td>

                `;


                woodTable.appendChild(
                    row
                );

            }
        );

    }

}


// ============================================================
// CFT SUMMARY
// ============================================================

const cftSummary =
    document.getElementById(
        "cftSummary"
    );


if (
    cftSummary
) {

    cftSummary.innerHTML = "";


    if (
        finalWoodGroups.length === 0
    ) {

        cftSummary.innerHTML = `

            <div class="cft-item">

                <span>
                    -
                </span>

            </div>

        `;

    }
    else {

        finalWoodGroups.forEach(
            function (item) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "cft-item";


                div.innerHTML = `

                    <strong>
                        ${escapeHTML(
                            item.wood
                        )}
                        (${escapeHTML(
                            item.quality
                        )})
                    </strong>

                    <span>
                        ${item.cubicFeet.toFixed(2)}
                        CFT
                    </span>

                `;


                cftSummary.appendChild(
                    div
                );

            }
        );

    }

}


// ============================================================
// WOOD TOTAL
// ============================================================
//
// Use actual wood calculation amounts.
// Do NOT recalculate from labour.
// ============================================================

let woodTotal = 0;


finalWoodGroups.forEach(
    function (item) {

        woodTotal +=
            item.amount;

    }
);


// Fallback to stored wood total

if (
    woodTotal === 0
) {

    woodTotal =
        toNumber(
            woodPage.grandTotal
        );

}


if (
    woodTotal === 0
) {

    woodTotal =
        toNumber(
            localStorage.getItem(
                "woodTotal"
            )
        );

}


console.log(
    "WOOD TOTAL:",
    woodTotal
);


// ============================================================
// LABOUR DATA
// ============================================================
//
// Your labour.js stores this in:
//
// localStorage.labourData
//
// ============================================================

let labourData =
    {};


try {

    labourData =
        JSON.parse(
            localStorage.getItem(
                "labourData"
            ) || "{}"
        );

}
catch (error) {

    console.error(
        "LABOUR DATA ERROR:",
        error
    );

}


if (
    Object.keys(
        labourData
    ).length === 0
) {

    labourData =
        labourDataCentral;

}


console.log(
    "LABOUR DATA:",
    labourData
);


// ============================================================
// LABOUR CHARGE
// ============================================================

const labourCharge =
    toNumber(
        labourData.labourCharge
    );


// ============================================================
// OTHER CHARGE
// ============================================================

const otherCharge =
    toNumber(
        labourData.otherCharge
    );


// ============================================================
// OTHER ITEMS
// ============================================================

const otherItems =
    Array.isArray(
        labourData.otherItems
    )
        ? labourData.otherItems
        : [];


// ============================================================
// ADDITIONAL OTHER TOTAL
// ============================================================

let additionalTotal = 0;


otherItems.forEach(
    function (item) {

        if (
            item &&
            typeof item === "object"
        ) {

            additionalTotal +=
                toNumber(
                    item.amount
                );

        }

    }
);


// ============================================================
// OTHERS TOTAL
// ============================================================

let othersTotal =
    labourCharge +
    otherCharge +
    additionalTotal;


// If labour.js has a saved total,
// use it when valid.

if (
    toNumber(
        labourData.othersTotal
    ) > 0
) {

    othersTotal =
        toNumber(
            labourData.othersTotal
        );

}


console.log(
    "LABOUR CHARGE:",
    labourCharge
);

console.log(
    "OTHER CHARGE:",
    otherCharge
);

console.log(
    "ADDITIONAL TOTAL:",
    additionalTotal
);

console.log(
    "OTHERS TOTAL:",
    othersTotal
);


// ============================================================
// OTHER CHARGES TABLE
// ============================================================

const chargeTable =
    document.getElementById(
        "chargeTable"
    );


if (
    chargeTable
) {

    chargeTable.innerHTML = "";


    let serialNumber = 1;


    // --------------------------------------------------------
    // LABOUR
    // --------------------------------------------------------

    if (
        labourCharge > 0
    ) {

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


    // --------------------------------------------------------
    // OTHER CHARGE
    // --------------------------------------------------------

    if (
        otherCharge > 0
    ) {

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


    // --------------------------------------------------------
    // ADDITIONAL ITEMS
    // --------------------------------------------------------

    otherItems.forEach(
        function (item) {

            if (
                !item
            ) {

                return;

            }


            const amount =
                toNumber(
                    item.amount
                );


            const reason =
                item.reason ||
                "Other";


            if (
                amount <= 0
            ) {

                return;

            }


            chargeTable.innerHTML += `

                <tr>

                    <td>
                        ${serialNumber++}
                    </td>

                    <td>
                        ${escapeHTML(
                            reason
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


    // --------------------------------------------------------
    // EMPTY
    // --------------------------------------------------------

    if (
        serialNumber === 1
    ) {

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
// SUBTOTAL
// ============================================================

const subtotal =
    woodTotal +
    othersTotal;


console.log(
    "SUBTOTAL:",
    subtotal
);


// ============================================================
// DISCOUNT
// ============================================================
//
// discount.js stores:
//
// discountAmount
// newGrandTotal
//
// ============================================================

let discount =
    toNumber(
        discountDataCentral.discountAmount
    );


// Compatibility

if (
    discount === 0
) {

    discount =
        toNumber(
            localStorage.getItem(
                "discountAmount"
            )
        );

}


console.log(
    "DISCOUNT:",
    discount
);


// ============================================================
// GRAND TOTAL
// ============================================================

let grandTotal =
    subtotal -
    discount;


if (
    grandTotal < 0
) {

    grandTotal =
        0;

}


grandTotal =
    Math.round(
        grandTotal
    );


console.log(
    "GRAND TOTAL:",
    grandTotal
);


// ============================================================
// DISPLAY TOTALS
// ============================================================

const woodTotalElement =
    document.getElementById(
        "woodTotal"
    );

const othersTotalElement =
    document.getElementById(
        "othersTotal"
    );

const subtotalElement =
    document.getElementById(
        "subtotal"
    );

const grandTotalElement =
    document.getElementById(
        "grandTotal"
    );


if (
    woodTotalElement
) {

    woodTotalElement.textContent =
        money(
            woodTotal
        );

}


if (
    othersTotalElement
) {

    othersTotalElement.textContent =
        money(
            othersTotal
        );

}


if (
    subtotalElement
) {

    subtotalElement.textContent =
        money(
            subtotal
        );

}


if (
    grandTotalElement
) {

    grandTotalElement.textContent =
        money(
            grandTotal
        );

}


// ============================================================
// DISCOUNT DISPLAY
// ============================================================

const discountRow =
    document.getElementById(
        "discountRow"
    );

const discountAmountElement =
    document.getElementById(
        "discountAmount"
    );


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


// ============================================================
// ADVANCE
// ============================================================

let advanceAmount =
    toNumber(
        advanceDataCentral.advanceAmount
    );


if (
    advanceAmount === 0
) {

    advanceAmount =
        toNumber(
            localStorage.getItem(
                "advanceAmount"
            )
        );

}


// ------------------------------------------------------------
// LIMIT ADVANCE TO GRAND TOTAL
// ------------------------------------------------------------

if (
    advanceAmount > grandTotal
) {

    advanceAmount =
        grandTotal;

}


const balanceAmount =
    Math.max(
        0,
        grandTotal -
        advanceAmount
    );


console.log(
    "ADVANCE:",
    advanceAmount
);

console.log(
    "BALANCE:",
    balanceAmount
);


// ============================================================
// DISPLAY ADVANCE
// ============================================================

const advanceRow =
    document.getElementById(
        "advanceRow"
    );

const advanceAmountElement =
    document.getElementById(
        "advanceAmount"
    );


if (
    advanceAmount > 0
) {

    if (
        advanceRow
    ) {

        advanceRow.style.display =
            "flex";

    }


    if (
        advanceAmountElement
    ) {

        advanceAmountElement.textContent =
            money(
                advanceAmount
            );

    }

}
else {

    if (
        advanceRow
    ) {

        advanceRow.style.display =
            "none";

    }

}


// ============================================================
// DISPLAY BALANCE
// ============================================================

const balanceAmountElement =
    document.getElementById(
        "balanceAmount"
    );


if (
    balanceAmountElement
) {

    balanceAmountElement.textContent =
        money(
            balanceAmount
        );

}


// ============================================================
// SAVE FINAL TOTALS
// ============================================================

localStorage.setItem(
    "woodTotal",
    String(
        woodTotal
    )
);

localStorage.setItem(
    "othersTotal",
    String(
        othersTotal
    )
);

localStorage.setItem(
    "subtotal",
    String(
        subtotal
    )
);

localStorage.setItem(
    "grandTotal",
    String(
        grandTotal
    )
);

localStorage.setItem(
    "finalTotal",
    String(
        grandTotal
    )
);

localStorage.setItem(
    "balanceAmount",
    String(
        balanceAmount
    )
);


// ============================================================
// FINAL DEBUG
// ============================================================

console.log(
    "===================================="
);

console.log(
    "FINAL BILL VALUES"
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


// ============================================================
// PRINT
// ============================================================

const printBtn =
    document.getElementById(
        "printBtn"
    );


if (
    printBtn
) {

    printBtn.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}


// ============================================================
// BACK
// ============================================================

const backBtn =
    document.getElementById(
        "backBtn"
    );


if (
    backBtn
) {

    backBtn.addEventListener(
        "click",
        function () {

            history.back();

        }
    );

}


// ============================================================
// EDIT
// ============================================================

const editBtn =
    document.getElementById(
        "editBtn"
    );


if (
    editBtn
) {

    editBtn.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "editingBill",
                "true"
            );


            window.location.href =
                "wood.html";

        }
    );

}


// ============================================================
// CLEAR
// ============================================================

const clearBtn =
    document.getElementById(
        "clearBtn"
    );


if (
    clearBtn
) {

    clearBtn.addEventListener(
        "click",
        function () {

            const answer =
                confirm(
                    "Are you sure you want to clear this bill?"
                );


            if (
                !answer
            ) {

                return;

            }


            if (
                typeof clearBillData ===
                "function"
            ) {

                clearBillData();

            }
            else {

                localStorage.clear();
                sessionStorage.clear();

            }


            window.location.href =
                "index.html";

        }
    );

}


// ============================================================
// CONFIRM BILL
// ============================================================

const confirmBill =
    document.getElementById(
        "confirmBill"
    );


if (
    confirmBill
) {

    confirmBill.addEventListener(
        "click",
        function () {

            localStorage.setItem(
                "billConfirmed",
                "true"
            );


            localStorage.setItem(
                "billConfirmedAt",
                new Date().toISOString()
            );


            console.log(
                "BILL CONFIRMED"
            );

        }
    );

}


console.log(
    "===================================="
);

console.log(
    "BILL.JS READY"
);

console.log(
    "===================================="
);
// ============================================================
// WHATSAPP BUTTON
// ============================================================

const whatsappBtn =
    document.getElementById("whatsappBtn");


if (whatsappBtn) {

    whatsappBtn.addEventListener(
        "click",
        function () {

            console.log(
                "WHATSAPP BUTTON CLICKED"
            );


            // ------------------------------------------------
            // GET CUSTOMER MOBILE
            // ------------------------------------------------

            let mobile =
                personalData.mobile || "";


            mobile =
                String(mobile)
                    .replace(/\D/g, "");


            console.log(
                "CUSTOMER MOBILE:",
                mobile
            );


            // ------------------------------------------------
            // CHECK MOBILE NUMBER
            // ------------------------------------------------

            if (mobile.length !== 10) {

                alert(
                    "Customer mobile number is not valid.\n\n" +
                    "Please enter a valid 10-digit mobile number " +
                    "in the Personal page."
                );

                return;

            }


            // ------------------------------------------------
            // CONFIRM
            // ------------------------------------------------

            const confirmSend =
                confirm(
                    "Do you want to send this bill through WhatsApp?"
                );


            if (!confirmSend) {

                console.log(
                    "WHATSAPP SEND CANCELLED"
                );

                return;

            }


            // ------------------------------------------------
            // INDIA COUNTRY CODE
            // ------------------------------------------------

            const whatsappNumber =
                "91" + mobile;


            // ------------------------------------------------
            // BILL MESSAGE
            // ------------------------------------------------

            const message =

`🧾 *WOOD BILL*

Customer: ${customerName || "-"}
Mobile: ${customerMobile || "-"}
Place: ${customerPlace || "-"}

------------------------------

Wood Total: ${money(woodTotal)}
Others Total: ${money(othersTotal)}
Subtotal: ${money(subtotal)}
Discount: ${money(discount)}

*Grand Total: ${money(grandTotal)}*

Advance Amount: ${money(advanceAmount)}
Balance Amount: ${money(balanceAmount)}

------------------------------

Thank you 🙏
ஸ்ரீ அம்மன் சாமில்`;


            // ------------------------------------------------
            // WHATSAPP URL
            // ------------------------------------------------

            const whatsappURL =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                encodeURIComponent(
                    message
                );


            console.log(
                "WHATSAPP NUMBER:",
                whatsappNumber
            );

            console.log(
                "WHATSAPP MESSAGE:",
                message
            );

            console.log(
                "OPENING WHATSAPP"
            );


            // ------------------------------------------------
            // OPEN WHATSAPP
            // ------------------------------------------------

            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}
