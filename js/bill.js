"use strict";

/* ============================================================
   AMMAN SAW MILL
   BILL.JS - QUOTATION PAGE
   ============================================================

   IMPORTANT:

   1. This page is QUOTATION only.
   2. Bill number is always "---".
   3. THIS FILE DOES NOT SAVE TO DATABASE.
   4. confirm.js / cbill.js is responsible for final DB save.
   5. All quotation data is stored in localStorage only.
   6. Customer details are displayed.
   7. Wood details are displayed.
   8. Length and Quantity are separate.
   9. Quality is displayed.
   10. Same Wood + Same Quality CFT is grouped.
   11. Labour charge is displayed.
   12. Other charge is displayed.
   13. Additional other items are displayed.
   14. Others Total is calculated.
   15. Print works.
   16. Edit works.
   17. Clear works.
   18. WhatsApp PDF functionality is preserved.
   ============================================================ */


console.clear();

console.log("======================================");
console.log("       AMMAN SAW MILL - BILL.JS");
console.log("       QUOTATION VERSION");
console.log("       DATABASE SAVE DISABLED");
console.log("======================================");


/* ============================================================
   NUMBER HELPER
   ============================================================ */

function toNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number = parseFloat(
        String(value)
            .replace(/[₹,\s]/g, "")
    );

    return Number.isFinite(number)
        ? number
        : 0;
}


/* ============================================================
   MONEY
   ============================================================ */

function money(value) {

    return "₹ " +
        toNumber(value).toFixed(2);
}


/* ============================================================
   HTML ESCAPE
   ============================================================ */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ============================================================
   GET MAIN BILL DATA
   ============================================================ */

let billData = {};


/* ------------------------------------------------------------
   CENTRAL STORE
   ------------------------------------------------------------ */

if (
    typeof getBillData === "function"
) {

    try {

        billData =
            getBillData() || {};

    }
    catch (error) {

        console.error(
            "getBillData ERROR:",
            error
        );

        billData = {};
    }
}


/* ------------------------------------------------------------
   LOCAL STORAGE FALLBACK
   ------------------------------------------------------------ */

if (
    !billData ||
    Object.keys(billData).length === 0
) {

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
            "current_bill_data ERROR:",
            error
        );

        billData = {};
    }
}


console.log(
    "COMPLETE BILL DATA:",
    billData
);


/* ============================================================
   DATA SECTIONS
   ============================================================ */

const personalData =
    billData.personal || {};

const woodPage =
    billData.wood || {};

const labourCentral =
    billData.labour || {};

const advanceCentral =
    billData.advance || {};

const discountCentral =
    billData.discount || {};


/* ============================================================
   CUSTOMER
   ============================================================ */

const customerName =
    personalData.name ||
    personalData.customerName ||
    localStorage.getItem("customerName") ||
    "";

const customerMobile =
    personalData.mobile ||
    personalData.customerMobile ||
    localStorage.getItem("customerMobile") ||
    "";

const customerPlace =
    personalData.place ||
    personalData.customerPlace ||
    localStorage.getItem("customerPlace") ||
    "";


console.log(
    "CUSTOMER:",
    customerName,
    customerMobile,
    customerPlace
);


/* ============================================================
   DISPLAY CUSTOMER
   ============================================================ */

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


if (customerNameElement) {

    customerNameElement.textContent =
        customerName || "-";
}


if (customerMobileElement) {

    customerMobileElement.textContent =
        customerMobile || "-";
}


if (customerPlaceElement) {

    customerPlaceElement.textContent =
        customerPlace || "-";
}


/* ============================================================
   DATE / TIME
   ============================================================ */

const billDateElement =
    document.getElementById(
        "billDate"
    );

const billDayTimeElement =
    document.getElementById(
        "billDayTime"
    );


const now =
    new Date();


const day =
    String(
        now.getDate()
    ).padStart(
        2,
        "0"
    );


const month =
    String(
        now.getMonth() + 1
    ).padStart(
        2,
        "0"
    );


const year =
    now.getFullYear();


const currentDate =
    `${day}-${month}-${year}`;


let hours =
    now.getHours();


const minutes =
    String(
        now.getMinutes()
    ).padStart(
        2,
        "0"
    );


const ampm =
    hours >= 12
        ? "PM"
        : "AM";


hours =
    hours % 12 || 12;


const currentTime =
    `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;


if (billDateElement) {

    billDateElement.textContent =
        currentDate;
}


if (billDayTimeElement) {

    billDayTimeElement.textContent =
        currentTime;
}


/* ============================================================
   BILL NUMBER
   ============================================================

   THIS IS A QUOTATION.

   Therefore:
       Bill No = ---

   DO NOT USE:
       savedBillNo
       result.billNo
       generated bill number
   ============================================================ */

const billNoElement =
    document.getElementById(
        "billNo"
    );


const currentBillNumber =
    "---";


if (billNoElement) {

    billNoElement.textContent =
        "---";
}


console.log(
    "QUOTATION BILL NUMBER:",
    currentBillNumber
);


/* ============================================================
   WOOD DATA
   ============================================================ */

let woodCalculations = [];


if (
    Array.isArray(
        woodPage.calculations
    )
) {

    woodCalculations =
        woodPage.calculations;
}


/* ------------------------------------------------------------
   WOOD DATA FALLBACK
   ------------------------------------------------------------ */

if (
    woodCalculations.length === 0
) {

    try {

        const storedWood =
            JSON.parse(
                localStorage.getItem(
                    "woodData"
                ) || "[]"
            );


        if (
            Array.isArray(
                storedWood
            )
        ) {

            woodCalculations =
                storedWood;
        }

    }
    catch (error) {

        console.error(
            "WOOD DATA ERROR:",
            error
        );
    }
}


console.log(
    "WOOD CALCULATIONS:",
    woodCalculations
);


/* ============================================================
   LABOUR DATA
   ============================================================ */

let labourData = {};


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

    labourData = {};
}


/* ------------------------------------------------------------
   CENTRAL STORE FALLBACK
   ------------------------------------------------------------ */

if (
    Object.keys(
        labourData
    ).length === 0
) {

    labourData =
        labourCentral || {};
}


console.log(
    "LABOUR DATA:",
    labourData
);


/* ============================================================
   LABOUR CHARGE
   ============================================================ */

const labourCharge =
    toNumber(
        labourData.labourCharge
    );


/* ============================================================
   OTHER CHARGE
   ============================================================ */

const otherCharge =
    toNumber(
        labourData.otherCharge
    );


/* ============================================================
   OTHER ITEMS
   ============================================================

   IMPORTANT:
   Declare this BEFORE using it.

   This avoids:

   Cannot access 'otherItems'
   before initialization
   ============================================================ */

const otherItems =
    Array.isArray(
        labourData.otherItems
    )
        ? labourData.otherItems
        : [];


console.log(
    "OTHER ITEMS:",
    otherItems
);


/* ============================================================
   WOOD TABLE
   ============================================================ */

const woodTable =
    document.getElementById(
        "woodTable"
    );


if (woodTable) {

    woodTable.innerHTML = "";


    if (
        woodCalculations.length === 0
    ) {

        woodTable.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:12px;
                    "
                >
                    No wood data
                </td>
            </tr>
        `;

    }
    else {

        woodCalculations.forEach(
            function (
                item,
                index
            ) {

                if (!item) {
                    return;
                }


                /* ==================================================
                   WOOD NAME
                   ================================================== */

                let woodName =
                    item.woodType ||
                    item.wood ||
                    item.woodName ||
                    "";


                if (
                    woodName === "Other"
                ) {

                    woodName =
                        item.otherWood ||
                        "Other";
                }


                if (!woodName) {

                    woodName =
                        "-";
                }


                /* ==================================================
                   BREADTH
                   ================================================== */

                const breadth =
                    toNumber(
                        item.breadth
                    );


                /* ==================================================
                   THICKNESS
                   ================================================== */

                const thickness =
                    toNumber(
                        item.thickness
                    );


                /* ==================================================
                   SIZE
                   ================================================== */

                let size =
                    "-";


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
                        String(
                            breadth
                        );
                }

                else if (
                    thickness > 0
                ) {

                    size =
                        String(
                            thickness
                        );
                }


                /* ==================================================
                   PIECES
                   ================================================== */

                const pieces =
                    Array.isArray(
                        item.pieces
                    )
                        ? item.pieces
                        : [];


                let lengthValues =
                    [];


                pieces.forEach(
                    function (
                        piece
                    ) {

                        if (!piece) {
                            return;
                        }


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


                        const qty =
                            toNumber(
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


                /* ==================================================
                   DIRECT LENGTH FALLBACK
                   ================================================== */

                if (
                    lengthValues.length === 0 &&
                    item.length !== undefined
                ) {

                    const directLength =
                        toNumber(
                            item.length
                        );


                    const directQty =
                        toNumber(
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


                /* ==================================================
                   TOTAL QTY
                   ================================================== */

                let totalQty =
                    0;


                pieces.forEach(
                    function (
                        piece
                    ) {

                        if (!piece) {
                            return;
                        }


                        totalQty +=
                            toNumber(
                                piece.qty
                            );

                    }
                );


                if (
                    totalQty === 0 &&
                    item.qty !== undefined
                ) {

                    totalQty =
                        toNumber(
                            item.qty
                        );
                }


                /* ==================================================
                   CFT
                   ================================================== */

                const cubicFeet =
                    toNumber(
                        item.cubicFeet
                    );


                /* ==================================================
                   RATE
                   ================================================== */

                const rate =
                    toNumber(
                        item.rate
                    );


                /* ==================================================
                   AMOUNT
                   ================================================== */

                const amount =
                    toNumber(
                        item.amount
                    );


                /* ==================================================
                   QUALITY
                   ================================================== */

                const quality =
                    item.quality !== undefined &&
                    item.quality !== ""
                        ? String(
                            item.quality
                        )
                        : "1";


                /* ==================================================
                   NO LENGTH
                   ================================================== */

                if (
                    lengthValues.length === 0
                ) {

                    lengthValues.push({

                        length:
                            0,

                        qty:
                            totalQty

                    });

                }


                /* ==================================================
                   ROW COUNT
                   ================================================== */

                const rowCount =
                    lengthValues.length;


                /* ==================================================
                   CREATE ROWS
                   ================================================== */

                lengthValues.forEach(
                    function (
                        lengthItem,
                        pieceIndex
                    ) {

                        const row =
                            document.createElement(
                                "tr"
                            );


                        /* ==================================================
                           FIRST ROW
                           ================================================== */

                        if (
                            pieceIndex === 0
                        ) {

                            row.innerHTML = `

                                <td
                                    rowspan="${rowCount}"
                                    class="sno-cell"
                                >
                                    ${index + 1}
                                </td>


                                <td
                                    rowspan="${rowCount}"
                                    class="wood-cell"
                                >
                                    ${escapeHTML(
                                        woodName
                                    )}
                                </td>


                                <td
                                    rowspan="${rowCount}"
                                    class="size-cell"
                                >
                                    ${escapeHTML(
                                        size
                                    )}
                                </td>


                                <td
                                    class="length-cell"
                                >
                                    ${lengthItem.length}
                                </td>


                                <td
                                    class="qty-cell"
                                >
                                    ${lengthItem.qty}
                                </td>


                                <td
                                    rowspan="${rowCount}"
                                    class="cft-cell"
                                >
                                    ${cubicFeet.toFixed(2)}
                                </td>


                                <td
                                    rowspan="${rowCount}"
                                    class="rate-cell"
                                >
                                    ${money(
                                        rate
                                    )}
                                </td>


                                <td
                                    rowspan="${rowCount}"
                                    class="amount-cell"
                                >
                                    ${money(
                                        amount
                                    )}
                                </td>


                                <td
                                    rowspan="${rowCount}"
                                    class="quality-cell"
                                >
                                    ${escapeHTML(
                                        quality
                                    )}
                                </td>

                            `;

                        }


                        /* ==================================================
                           ADDITIONAL LENGTH / QTY ROW
                           ================================================== */

                        else {

                            row.innerHTML = `

                                <td
                                    class="length-cell"
                                >
                                    ${lengthItem.length}
                                </td>


                                <td
                                    class="qty-cell"
                                >
                                    ${lengthItem.qty}
                                </td>

                            `;

                        }


                        woodTable.appendChild(
                            row
                        );

                    }
                );

            }
        );

    }

}


/* ============================================================
   WOOD TOTAL
   ============================================================ */

let woodTotal =
    0;


woodCalculations.forEach(
    function (
        item
    ) {

        if (!item) {
            return;
        }


        woodTotal +=
            toNumber(
                item.amount
            );

    }
);


console.log(
    "WOOD TOTAL:",
    woodTotal
);


/* ============================================================
   WOOD DETAILS TOTAL DISPLAY
   ============================================================ */

const woodDetailsTotalElement =
    document.getElementById(
        "woodDetailsTotal"
    );


if (
    woodDetailsTotalElement
) {

    woodDetailsTotalElement.textContent =
        money(
            woodTotal
        );

}


/* ============================================================
   CFT SUMMARY
   ============================================================

   SAME WOOD + SAME QUALITY
   = GROUP TOGETHER

   Example:

   Teak Quality 1 = 5.20 CFT
   Teak Quality 2 = 8.40 CFT

   If the same wood and same quality
   occurs multiple times, CFT is added.
   ============================================================ */

const cftSummary =
    document.getElementById(
        "cftSummary"
    );


if (cftSummary) {

    cftSummary.innerHTML = "";


    if (
        woodCalculations.length === 0
    ) {

        cftSummary.innerHTML = `
            <div class="cft-item">
                -
            </div>
        `;

    }
    else {

        const groupedCFT =
            new Map();


        woodCalculations.forEach(
            function (
                item
            ) {

                if (!item) {
                    return;
                }


                let woodName =
                    item.woodType ||
                    item.wood ||
                    item.woodName ||
                    "";


                if (
                    woodName === "Other"
                ) {

                    woodName =
                        item.otherWood ||
                        "Other";
                }


                if (!woodName) {

                    woodName =
                        "-";
                }


                const quality =
                    item.quality !== undefined &&
                    item.quality !== ""
                        ? String(
                            item.quality
                        )
                        : "1";


                const cubicFeet =
                    toNumber(
                        item.cubicFeet
                    );


                const groupKey =
                    woodName
                        .trim()
                        .toLowerCase() +
                    "|" +
                    quality
                        .trim()
                        .toLowerCase();


                if (
                    groupedCFT.has(
                        groupKey
                    )
                ) {

                    groupedCFT
                        .get(
                            groupKey
                        )
                        .cft +=
                        cubicFeet;

                }
                else {

                    groupedCFT.set(
                        groupKey,
                        {

                            woodName:
                                woodName,

                            quality:
                                quality,

                            cft:
                                cubicFeet

                        }
                    );

                }

            }
        );


        let serialNumber =
            1;


        groupedCFT.forEach(
            function (
                group
            ) {

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

}


/* ============================================================
   ADDITIONAL OTHER ITEMS TOTAL
   ============================================================ */

let additionalTotal =
    0;


otherItems.forEach(
    function (
        item
    ) {

        if (!item) {
            return;
        }


        additionalTotal +=
            toNumber(
                item.amount
            );

    }
);


/* ============================================================
   OTHERS TOTAL
   ============================================================ */

let othersTotal =
    labourCharge +
    otherCharge +
    additionalTotal;


/* ------------------------------------------------------------
   USE SAVED OTHERS TOTAL IF AVAILABLE
   ------------------------------------------------------------ */

const storedOthersTotal =
    toNumber(
        labourData.othersTotal
    );


if (
    storedOthersTotal > 0
) {

    othersTotal =
        storedOthersTotal;
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
    "ADDITIONAL OTHER TOTAL:",
    additionalTotal
);

console.log(
    "OTHERS TOTAL:",
    othersTotal
);


/* ============================================================
   OTHER CHARGES TABLE
   ============================================================ */

const chargeTable =
    document.getElementById(
        "chargeTable"
    );


if (chargeTable) {

    chargeTable.innerHTML = "";


    let serialNumber =
        1;


    /* --------------------------------------------------------
       LABOUR
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       OTHER CHARGE
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       ADDITIONAL OTHER ITEMS
       -------------------------------------------------------- */

    otherItems.forEach(
        function (
            item
        ) {

            if (!item) {
                return;
            }


            const amount =
                toNumber(
                    item.amount
                );


            if (
                amount <= 0
            ) {

                return;
            }


            const reason =
                item.reason ||
                item.name ||
                item.description ||
                "Other";


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


    /* --------------------------------------------------------
       NO CHARGES
       -------------------------------------------------------- */

    if (
        serialNumber === 1
    ) {

        chargeTable.innerHTML = `

            <tr>

                <td>
                    -
                </td>

                <td>
                    No additional charges
                </td>

                <td>
                    ${money(0)}
                </td>

            </tr>

        `;

    }

}


/* ============================================================
   SUBTOTAL
   ============================================================ */

const subtotal =
    woodTotal +
    othersTotal;


console.log(
    "SUBTOTAL:",
    subtotal
);


/* ============================================================
   DISCOUNT
   ============================================================ */

let discount =
    toNumber(
        discountCentral.discountAmount
    );


if (
    discount === 0
) {

    discount =
        toNumber(
            discountCentral.amount
        );

}


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


/* ============================================================
   GRAND TOTAL
   ============================================================ */

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


/* ============================================================
   DISPLAY WOOD TOTAL
   ============================================================ */

const woodTotalElement =
    document.getElementById(
        "woodTotal"
    );


if (
    woodTotalElement
) {

    woodTotalElement.textContent =
        money(
            woodTotal
        );

}


/* ============================================================
   DISPLAY OTHERS TOTAL
   ============================================================ */

const othersTotalElement =
    document.getElementById(
        "othersTotal"
    );


if (
    othersTotalElement
) {

    othersTotalElement.textContent =
        money(
            othersTotal
        );

}


/* ============================================================
   DISPLAY SUBTOTAL
   ============================================================ */

const subtotalElement =
    document.getElementById(
        "subtotal"
    );


if (
    subtotalElement
) {

    subtotalElement.textContent =
        money(
            subtotal
        );

}


/* ============================================================
   DISCOUNT DISPLAY
   ============================================================ */

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


/* ============================================================
   GRAND TOTAL DISPLAY
   ============================================================ */

const grandTotalElement =
    document.getElementById(
        "grandTotal"
    );


if (
    grandTotalElement
) {

    grandTotalElement.textContent =
        money(
            grandTotal
        );

}


/* ============================================================
   ADVANCE
   ============================================================ */

let advanceAmount =
    toNumber(
        advanceCentral.advanceAmount
    );


if (
    advanceAmount === 0
) {

    advanceAmount =
        toNumber(
            advanceCentral.amount
        );

}


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


if (
    advanceAmount > grandTotal
) {

    advanceAmount =
        grandTotal;
}


/* ============================================================
   BALANCE
   ============================================================ */

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


/* ============================================================
   ADVANCE DISPLAY
   ============================================================ */

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


/* ============================================================
   BALANCE DISPLAY
   ============================================================ */

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


/* ============================================================
   SAVE QUOTATION TOTALS LOCALLY
   ============================================================

   IMPORTANT:

   These are ONLY localStorage values.

   NOTHING IS SENT TO DATABASE HERE.
   ============================================================ */

try {

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


    localStorage.setItem(
        "advanceAmount",
        String(
            advanceAmount
        )
    );


    localStorage.setItem(
        "quotationBillData",
        JSON.stringify({

            customerName:
                customerName,

            customerMobile:
                customerMobile,

            customerPlace:
                customerPlace,

            billDate:
                currentDate,

            billTime:
                currentTime,

            billNo:
                "---",

            woodData:
                woodCalculations,

            labourData:
                labourData,

            othersData:
                otherItems,

            woodTotal:
                woodTotal,

            labourCharge:
                labourCharge,

            otherCharge:
                otherCharge,

            additionalOtherTotal:
                additionalTotal,

            othersTotal:
                othersTotal,

            subtotal:
                subtotal,

            discount:
                discount,

            grandTotal:
                grandTotal,

            advanceAmount:
                advanceAmount,

            balanceAmount:
                balanceAmount

        })
    );


    console.log(
        "QUOTATION DATA STORED LOCALLY."
    );

}
catch (error) {

    console.error(
        "LOCAL STORAGE ERROR:",
        error
    );

}


/* ============================================================
   DEBUG
   ============================================================ */

console.log(
    "======================================"
);

console.log(
    "FINAL QUOTATION DATA"
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
    "Bill No:",
    "---"
);

console.log(
    "Wood Count:",
    woodCalculations.length
);

console.log(
    "Wood Total:",
    woodTotal
);

console.log(
    "Labour Charge:",
    labourCharge
);

console.log(
    "Other Charge:",
    otherCharge
);

console.log(
    "Other Items:",
    otherItems
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
    "DATABASE SAVE:",
    "DISABLED"
);

console.log(
    "======================================"
);


/* ============================================================
   PRINT
   ============================================================ */

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

            console.log(
                "PRINT BUTTON CLICKED"
            );

            window.print();

        }
    );

}


/* ============================================================
   EDIT
   ============================================================ */

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

            console.log(
                "EDIT BILL"
            );


            localStorage.setItem(
                "editingBill",
                "true"
            );


            window.location.href =
                "./wood.html";

        }
    );

}


/* ============================================================
   CLEAR
   ============================================================ */

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

            const confirmClear =
                confirm(
                    "Are you sure you want to clear this quotation?"
                );


            if (
                !confirmClear
            ) {

                return;

            }


            if (
                typeof clearBillData ===
                "function"
            ) {

                try {

                    clearBillData();

                }
                catch (error) {

                    console.error(
                        "clearBillData ERROR:",
                        error
                    );

                }

            }
            else {

                localStorage.clear();

                sessionStorage.clear();

            }


            window.location.href =
                "./index.html";

        }
    );

}


/* ============================================================
   CONFIRM BUTTON
   ============================================================

   VERY IMPORTANT:

   DO NOT SAVE DATABASE HERE.

   This page only prepares quotation data.

   confirm.js / cbill.js must perform the
   ONE AND ONLY ONE database save.
   ============================================================ */

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

            console.log(
                "======================================"
            );

            console.log(
                "CONFIRM CLICKED"
            );

            console.log(
                "NO DATABASE SAVE FROM BILL.JS"
            );

            console.log(
                "======================================"
            );


            /* ------------------------------------------------
               FINAL DATA FOR CONFIRM PAGE
               ------------------------------------------------ */

            const quotationData = {

                customerName:
                    customerName,

                customerMobile:
                    customerMobile,

                customerPlace:
                    customerPlace,

                billDate:
                    currentDate,

                billTime:
                    currentTime,

                billNo:
                    "---",

                paymentType:
                    advanceCentral.paymentType ||
                    localStorage.getItem(
                        "paymentType"
                    ) ||
                    "cash",

                paymentMode:
                    advanceCentral.paymentMode ||
                    localStorage.getItem(
                        "paymentMode"
                    ) ||
                    "cash",

                advanceAmount:
                    Math.round(
                        advanceAmount
                    ),

                balanceAmount:
                    Math.round(
                        balanceAmount
                    ),

                totalCFT:
                    woodCalculations.reduce(
                        function (
                            total,
                            item
                        ) {

                            return total +
                                toNumber(
                                    item?.cubicFeet
                                );

                        },
                        0
                    ),

                woodTotal:
                    Math.round(
                        woodTotal
                    ),

                labourCharge:
                    Math.round(
                        labourCharge
                    ),

                otherCharge:
                    Math.round(
                        otherCharge
                    ),

                othersTotal:
                    Math.round(
                        othersTotal
                    ),

                discountAmount:
                    Math.round(
                        discount
                    ),

                grandTotal:
                    Math.round(
                        grandTotal
                    ),

                woodData:
                    woodCalculations,

                labourData:
                    labourData,

                othersData:
                    otherItems,

                remark:
                    ""

            };


            /* ------------------------------------------------
               STORE LOCALLY ONLY
               ------------------------------------------------ */

            try {

                localStorage.setItem(
                    "quotationBillData",
                    JSON.stringify(
                        quotationData
                    )
                );


                localStorage.setItem(
                    "currentQuotationData",
                    JSON.stringify(
                        quotationData
                    )
                );


                console.log(
                    "QUOTATION DATA READY FOR CONFIRM PAGE:"
                );


                console.log(
                    JSON.stringify(
                        quotationData,
                        null,
                        2
                    )
                );

            }
            catch (error) {

                console.error(
                    "QUOTATION STORAGE ERROR:",
                    error
                );


                alert(
                    "Unable to prepare quotation.\n\n" +
                    error.message
                );


                return;

            }


            /* ------------------------------------------------
               GO TO CONFIRM PAGE
               ------------------------------------------------ */

            window.location.href =
                "./confirm.html";

        }
    );

}


/* ============================================================
   WHATSAPP PDF - NO API / NO TOKEN
   ============================================================ */

const whatsappBtn =
    document.getElementById("whatsappBtn");

if (whatsappBtn) {

    whatsappBtn.addEventListener(
        "click",
        async function () {

            const customerNameForWhatsApp =
                customerName || "";

            let customerMobileForWhatsApp =
                customerMobile || "";

            /* ------------------------------------------------
               CLEAN MOBILE NUMBER
               ------------------------------------------------ */

            customerMobileForWhatsApp =
                String(customerMobileForWhatsApp)
                    .replace(/\D/g, "");

            /* ------------------------------------------------
               REMOVE 91 IF ALREADY PRESENT
               ------------------------------------------------ */

            if (
                customerMobileForWhatsApp.length === 12 &&
                customerMobileForWhatsApp.startsWith("91")
            ) {
                customerMobileForWhatsApp =
                    customerMobileForWhatsApp.substring(2);
            }

            /* ------------------------------------------------
               VALIDATION
               ------------------------------------------------ */

            if (!customerNameForWhatsApp) {

                alert(
                    "Customer name is missing."
                );

                return;
            }

            if (
                customerMobileForWhatsApp.length !== 10
            ) {

                alert(
                    "Please enter a valid 10-digit customer mobile number."
                );

                return;
            }

            /* ------------------------------------------------
               CHECK PDF GENERATOR
               ------------------------------------------------ */

            if (
                typeof html2pdf === "undefined"
            ) {

                alert(
                    "PDF generator is not loaded.\n\n" +
                    "Please check html2pdf.js in bill.html."
                );

                return;
            }

            const oldButtonText =
                whatsappBtn.textContent;

            whatsappBtn.disabled = true;

            whatsappBtn.textContent =
                "Creating PDF...";

            let pdfWrapper = null;

            try {

                /* =================================================
                   BILL ELEMENT
                   ================================================= */

                const billElement =
                    document.querySelector(".bill-container") ||
                    document.querySelector(".bill") ||
                    document.querySelector("main");

                if (!billElement) {

                    throw new Error(
                        "Bill section could not be found."
                    );
                }

                /* =================================================
                   CREATE TEMP PDF AREA
                   ================================================= */

                pdfWrapper =
                    document.createElement("div");

                pdfWrapper.style.position =
                    "fixed";

                pdfWrapper.style.left =
                    "-100000px";

                pdfWrapper.style.top =
                    "0";

                pdfWrapper.style.width =
                    "794px";

                pdfWrapper.style.background =
                    "#ffffff";

                pdfWrapper.style.padding =
                    "20px";

                const billClone =
                    billElement.cloneNode(true);

                pdfWrapper.appendChild(
                    billClone
                );

                document.body.appendChild(
                    pdfWrapper
                );

                /* =================================================
                   PDF FILE NAME
                   ================================================= */

                const safeCustomerName =
                    customerNameForWhatsApp
                        .replace(
                            /[^a-zA-Z0-9]/g,
                            "_"
                        );

                const pdfFileName =
                    "Amman_Saw_Mill_Bill_" +
                    safeCustomerName +
                    ".pdf";

                /* =================================================
                   GENERATE COMPLETE PDF
                   ================================================= */

                const pdfBlob =
                    await html2pdf()
                        .set({

                            margin: 0,

                            filename:
                                pdfFileName,

                            image: {
                                type: "jpeg",
                                quality: 0.98
                            },

                            html2canvas: {
                                scale: 2,
                                useCORS: true,
                                backgroundColor:
                                    "#ffffff"
                            },

                            jsPDF: {
                                unit: "mm",
                                format: "a4",
                                orientation:
                                    "portrait"
                            }

                        })
                        .from(pdfWrapper)
                        .outputPdf("blob");

                if (
                    !pdfBlob ||
                    pdfBlob.size < 1000
                ) {

                    throw new Error(
                        "Generated PDF is empty."
                    );
                }

                /* =================================================
                   CREATE PDF FILE
                   ================================================= */

                const pdfFile =
                    new File(
                        [pdfBlob],
                        pdfFileName,
                        {
                            type:
                                "application/pdf"
                        }
                    );

                /* =================================================
                   GREETING MESSAGE
                   ================================================= */

                const message =
                    "Hello " +
                    customerNameForWhatsApp +
                    " 👋\n\n" +

                    "Thank you for choosing " +
                    "Amman Saw Mill.\n\n" +

                    "Please find your bill attached.\n\n" +

                    "Thank you for your business! 🌳";

                /* =================================================
                   MOBILE - SHARE PDF DIRECTLY
                   ================================================= */

                if (
                    navigator.share &&
                    navigator.canShare &&
                    navigator.canShare({
                        files: [pdfFile]
                    })
                ) {

                    whatsappBtn.textContent =
                        "Opening WhatsApp...";

                    await navigator.share({

                        files: [
                            pdfFile
                        ],

                        text: message,

                        title:
                            "Amman Saw Mill Bill"

                    });

                    return;
                }

                /* =================================================
                   DESKTOP FALLBACK
                   ================================================= */

                const downloadURL =
                    URL.createObjectURL(
                        pdfBlob
                    );

                const downloadLink =
                    document.createElement("a");

                downloadLink.href =
                    downloadURL;

                downloadLink.download =
                    pdfFileName;

                document.body.appendChild(
                    downloadLink
                );

                downloadLink.click();

                downloadLink.remove();

                setTimeout(
                    function () {

                        URL.revokeObjectURL(
                            downloadURL
                        );

                    },
                    2000
                );

                /* =================================================
                   OPEN WHATSAPP CHAT
                   ================================================= */

                const whatsappURL =
                    "https://wa.me/91" +
                    customerMobileForWhatsApp +
                    "?text=" +
                    encodeURIComponent(
                        message +
                        "\n\n" +
                        "I have attached the bill PDF."
                    );

                window.open(
                    whatsappURL,
                    "_blank"
                );

                alert(
                    "Bill PDF downloaded.\n\n" +
                    "WhatsApp opened for " +
                    customerNameForWhatsApp +
                    ".\n\n" +
                    "Please attach the downloaded PDF and send it."
                );

            }
            catch (error) {

                console.error(
                    "WHATSAPP PDF ERROR:",
                    error
                );

                /*
                 * User cancelling the share sheet
                 * is not treated as a serious error.
                 */

                if (
                    error.name !==
                    "AbortError"
                ) {

                    alert(
                        "Unable to prepare the bill PDF.\n\n" +
                        error.message
                    );
                }

            }
            finally {

                if (pdfWrapper) {

                    pdfWrapper.remove();

                    pdfWrapper = null;
                }

                whatsappBtn.disabled =
                    false;

                whatsappBtn.textContent =
                    oldButtonText ||
                    "WhatsApp";
            }
        }
    );

}

/* ============================================================
   FINAL READY
   ============================================================ */

console.log(
    "======================================"
);

console.log(
    "       BILL.JS READY"
);

console.log(
    "       QUOTATION MODE"
);

console.log(
    "       DATABASE SAVE: OFF"
);

console.log(
    "======================================"
);
