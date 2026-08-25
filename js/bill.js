// ============================================================
// BILL.JS
// FINAL CORRECTED VERSION
//
// WOOD TABLE:
//
// S.No | Wood | Size | Length | Qty | CFT | Rate | Amount | Quality
//
// TOTAL LENGTH IS NOT DISPLAYED
// ============================================================

console.clear();

console.log("====================================");
console.log("        BILL.JS LOADED");
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

    const number = parseFloat(
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

    return "₹ " + toNumber(value).toFixed(2);

}


// ============================================================
// HTML ESCAPE
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
// GET BILL DATA
// ============================================================

let billData = {};


// ============================================================
// GET DATA FROM STORE
// ============================================================

if (
    typeof getBillData === "function"
) {

    try {

        billData =
            getBillData() || {};

    }
    catch (error) {

        console.error(
            "ERROR IN getBillData():",
            error
        );

        billData = {};

    }

}


// ============================================================
// FALLBACK TO LOCAL STORAGE
// ============================================================

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
            "ERROR READING current_bill_data:",
            error
        );

        billData = {};

    }

}


console.log("====================================");
console.log("COMPLETE BILL DATA:");
console.log(billData);
console.log("====================================");


// ============================================================
// DATA SECTIONS
// ============================================================

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


// ============================================================
// CUSTOMER DETAILS
// ============================================================

const customerName =
    personalData.name ||
    personalData.customerName ||
    "";

const customerMobile =
    personalData.mobile ||
    personalData.customerMobile ||
    "";

const customerPlace =
    personalData.place ||
    personalData.customerPlace ||
    "";


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


if (
    billDateElement
) {

    billDateElement.textContent =
        currentDate;

}


if (
    billDayTimeElement
) {

    billDayTimeElement.textContent =
        currentTime;

}


// ============================================================
// BILL NUMBER
// ============================================================

const billNoElement =
    document.getElementById(
        "billNo"
    );


if (
    billNoElement
) {

    const billNumber =
        billData.billNo ||
        billData.billNumber ||
        billData.savedBillNo ||
        localStorage.getItem(
            "billNo"
        ) ||
        localStorage.getItem(
            "savedBillNo"
        );


    if (
        billNumber
    ) {

        billNoElement.textContent =
            billNumber;

    }
    else {

        console.log(
            "Bill number not available yet."
        );

    }

}


// ============================================================
// WOOD DATA
// ============================================================

let woodCalculations = [];


// ============================================================
// PRIMARY WOOD DATA
// ============================================================

if (
    Array.isArray(
        woodPage.calculations
    )
) {

    woodCalculations =
        woodPage.calculations;

}


// ============================================================
// FALLBACK WOOD DATA
// ============================================================

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
            "ERROR READING woodData:",
            error
        );

    }

}


console.log("====================================");

console.log(
    "WOOD CALCULATIONS COUNT:",
    woodCalculations.length
);

console.log(
    "WOOD CALCULATIONS:"
);

console.table(
    woodCalculations
);

console.log("====================================");


// ============================================================
// WOOD TABLE
// ============================================================

const woodTable =
    document.getElementById(
        "woodTable"
    );


if (
    woodTable
) {

    woodTable.innerHTML = "";


    // ========================================================
    // NO WOOD
    // ========================================================

    if (
        woodCalculations.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="9">

                    No wood data

                </td>

            </tr>

        `;

    }


    // ========================================================
    // WOOD DATA EXISTS
    // ========================================================

    else {

        woodCalculations.forEach(
            function (
                item,
                index
            ) {

                console.log(
                    "------------------------------------"
                );

                console.log(
                    "PROCESSING WOOD CALCULATION:",
                    index + 1
                );

                console.log(
                    "WOOD ITEM:",
                    item
                );


                // ==================================================
                // SAFETY CHECK
                // ==================================================

                if (
                    !item
                ) {

                    console.warn(
                        "Empty wood calculation:",
                        index + 1
                    );

                    return;

                }


                // ==================================================
                // WOOD NAME
                // ==================================================

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


                if (
                    !woodName
                ) {

                    woodName =
                        "-";

                }


                // ==================================================
                // BREADTH
                // ==================================================

                const breadth =
                    toNumber(
                        item.breadth
                    );


                // ==================================================
                // THICKNESS
                // ==================================================

                const thickness =
                    toNumber(
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
                        `${breadth}`;

                }
                else if (
                    thickness > 0
                ) {

                    size =
                        `${thickness}`;

                }


                console.log(
                    "WOOD:",
                    woodName
                );

                console.log(
                    "SIZE:",
                    size
                );


                // ==================================================
                // PIECES
                // ==================================================

                const pieces =
                    Array.isArray(
                        item.pieces
                    )
                        ? item.pieces
                        : [];


                console.log(
                    "PIECES:",
                    pieces
                );


                // ==================================================
                // LENGTH + QUANTITY
                //
                // Example:
                //
                // Length 4, Qty 3
                // Length 5, Qty 6
                // Length 2, Qty 10
                //
                // DISPLAY:
                //
                // 4 | 3
                // 5 | 6
                // 2 | 10
                // ==================================================

                let lengthValues = [];


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


                console.log(
                    "LENGTH VALUES:",
                    lengthValues
                );


                // ==================================================
                // DIRECT LENGTH FALLBACK
                // ==================================================

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


                // ==================================================
                // TOTAL QUANTITY
                // ==================================================

                let totalQty = 0;


                pieces.forEach(
                    function (
                        piece
                    ) {

                        if (
                            !piece
                        ) {

                            return;

                        }


                        totalQty +=
                            toNumber(
                                piece.qty
                            );

                    }
                );


                // ==================================================
                // FALLBACK TOTAL QUANTITY
                // ==================================================

                if (
                    totalQty === 0 &&
                    item.qty !== undefined
                ) {

                    totalQty =
                        toNumber(
                            item.qty
                        );

                }


                console.log(
                    "TOTAL QUANTITY:",
                    totalQty
                );


                // ==================================================
                // INTERNAL TOTAL LENGTH
                //
                // IMPORTANT:
                //
                // This is NOT displayed in the table.
                //
                // It is retained internally so existing
                // calculations/data are not broken.
                // ==================================================

                let totalLength =
                    toNumber(
                        item.totalLength
                    );


                // ==================================================
                // CALCULATE TOTAL LENGTH IF NOT STORED
                // ==================================================

                if (
                    totalLength === 0
                ) {

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


                // ==================================================
                // DIRECT TOTAL LENGTH FALLBACK
                // ==================================================

                if (
                    totalLength === 0 &&
                    item.length !== undefined
                ) {

                    totalLength =
                        toNumber(
                            item.length
                        ) *
                        toNumber(
                            item.qty
                        );

                }


                console.log(
                    "INTERNAL TOTAL LENGTH:",
                    totalLength
                );


                // ==================================================
                // CFT
                // ==================================================

                const cubicFeet =
                    toNumber(
                        item.cubicFeet
                    );


                // ==================================================
                // RATE
                // ==================================================

                const rate =
                    toNumber(
                        item.rate
                    );


                // ==================================================
                // AMOUNT
                // ==================================================

                const amount =
                    toNumber(
                        item.amount
                    );


                // ==================================================
                // QUALITY
                // ==================================================

                const quality =
                    item.quality !== undefined &&
                    item.quality !== ""
                        ? item.quality
                        : "1";


                console.log(
                    "CFT:",
                    cubicFeet
                );

                console.log(
                    "RATE:",
                    rate
                );

                console.log(
                    "AMOUNT:",
                    amount
                );

                console.log(
                    "QUALITY:",
                    quality
                );


                // ==================================================
                // IF NO LENGTH DATA
                // ==================================================

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


                // ==================================================
                // ROW COUNT
                // ==================================================

                const rowCount =
                    lengthValues.length;


                console.log(
                    "ROW COUNT:",
                    rowCount
                );


                // ==================================================
                // CREATE ROW FOR EACH LENGTH + QTY
                //
                // EXACTLY 9 TABLE COLUMNS
                //
                // 1 S.No
                // 2 Wood
                // 3 Size
                // 4 Length
                // 5 Qty
                // 6 CFT
                // 7 Rate
                // 8 Amount
                // 9 Quality
                // ==================================================

                lengthValues.forEach(
                    function (
                        lengthItem,
                        pieceIndex
                    ) {

                        const row =
                            document.createElement(
                                "tr"
                            );


                        // ==================================================
                        // FIRST ROW
                        // ==================================================

                        if (
                            pieceIndex === 0
                        ) {

                            row.innerHTML = `

                                <!-- S.NO -->

                                <td
                                    rowspan="${rowCount}"
                                    class="sno-cell">

                                    ${index + 1}

                                </td>


                                <!-- WOOD -->

                                <td
                                    rowspan="${rowCount}"
                                    class="wood-cell">

                                    ${escapeHTML(
                                        woodName
                                    )}

                                </td>


                                <!-- SIZE -->

                                <td
                                    rowspan="${rowCount}"
                                    class="size-cell">

                                    ${escapeHTML(
                                        size
                                    )}

                                </td>


                                <!-- LENGTH -->

                                <td
                                    class="length-cell">

                                    ${lengthItem.length}

                                </td>


                                <!-- QUANTITY -->

                                <td
                                    class="qty-cell">

                                    ${lengthItem.qty}

                                </td>


                                <!-- CFT -->

                                <td
                                    rowspan="${rowCount}"
                                    class="cft-cell">

                                    ${cubicFeet.toFixed(2)}

                                </td>


                                <!-- RATE -->

                                <td
                                    rowspan="${rowCount}"
                                    class="rate-cell">

                                    ${money(
                                        rate
                                    )}

                                </td>


                                <!-- AMOUNT -->

                                <td
                                    rowspan="${rowCount}"
                                    class="amount-cell">

                                    ${money(
                                        amount
                                    )}

                                </td>


                                <!-- QUALITY -->

                                <td
                                    rowspan="${rowCount}"
                                    class="quality-cell">

                                    ${escapeHTML(
                                        quality
                                    )}

                                </td>

                            `;

                        }


                        // ==================================================
                        // ADDITIONAL ROW
                        //
                        // ONLY LENGTH AND QTY
                        // ==================================================

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


                        // ==================================================
                        // ADD ROW TO TABLE
                        // ==================================================

                        woodTable.appendChild(
                            row
                        );


                        console.log(
                            "WOOD PIECE ROW CREATED:",
                            {
                                calculation:
                                    index + 1,

                                piece:
                                    pieceIndex + 1,

                                length:
                                    lengthItem.length,

                                quantity:
                                    lengthItem.qty,

                                cft:
                                    cubicFeet,

                                rate:
                                    rate,

                                amount:
                                    amount,

                                quality:
                                    quality
                            }
                        );

                    }
                );

            }
        );

    }

}


// ============================================================
// WOOD TOTAL
// ============================================================

let woodTotal = 0;


woodCalculations.forEach(
    function (
        item
    ) {

        if (
            !item
        ) {

            return;

        }


        woodTotal +=
            toNumber(
                item.amount
            );

    }
);


console.log(
    "WOOD DETAILS TOTAL:",
    woodTotal
);


// ============================================================
// DISPLAY WOOD DETAILS TOTAL
// ============================================================

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
        woodCalculations.length === 0
    ) {

        cftSummary.innerHTML = `

            <div class="cft-item">
                -
            </div>

        `;

    }
    else {

        woodCalculations.forEach(
            function (
                item,
                index
            ) {

                if (
                    !item
                ) {

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


                if (
                    !woodName
                ) {

                    woodName =
                        "-";

                }


                const quality =
                    item.quality !== undefined &&
                    item.quality !== ""
                        ? item.quality
                        : "1";


                const cubicFeet =
                    toNumber(
                        item.cubicFeet
                    );


                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "cft-item";


                div.innerHTML = `

                    <strong>

                        ${index + 1}.
                        ${escapeHTML(
                            woodName
                        )}

                        (${escapeHTML(
                            quality
                        )})

                    </strong>

                    <span>

                        ${cubicFeet.toFixed(2)}
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
// LABOUR DATA
// ============================================================

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

}


if (
    Object.keys(
        labourData
    ).length === 0
) {

    labourData =
        labourCentral;

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


let additionalTotal = 0;


otherItems.forEach(
    function (
        item
    ) {

        if (
            !item
        ) {

            return;

        }


        additionalTotal +=
            toNumber(
                item.amount
            );

    }
);


// ============================================================
// OTHERS TOTAL
// ============================================================

let othersTotal =
    labourCharge +
    otherCharge +
    additionalTotal;


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


    // ========================================================
    // LABOUR
    // ========================================================

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


    // ========================================================
    // OTHER CHARGE
    // ========================================================

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


    // ========================================================
    // ADDITIONAL ITEMS
    // ========================================================

    otherItems.forEach(
        function (
            item
        ) {

            if (
                !item
            ) {

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


    // ========================================================
    // NO CHARGES
    // ========================================================

    if (
        serialNumber === 1
    ) {

        chargeTable.innerHTML = `

            <tr>

                <td>
                    -
                </td>

                <td>
                    -
                </td>

                <td>
                    -
                </td>

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


// ============================================================
// GRAND TOTAL
// ============================================================

let grandTotal =
    subtotal -
    discount;


if (
    grandTotal < 0
) {

    grandTotal = 0;

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
// DISPLAY WOOD TOTAL
// ============================================================

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


// ============================================================
// DISPLAY OTHERS TOTAL
// ============================================================

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


// ============================================================
// DISPLAY SUBTOTAL
// ============================================================

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
// DISPLAY GRAND TOTAL
// ============================================================

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


// ============================================================
// ADVANCE
// ============================================================

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


// ============================================================
// ADVANCE CANNOT EXCEED GRAND TOTAL
// ============================================================

if (
    advanceAmount > grandTotal
) {

    advanceAmount =
        grandTotal;

}


console.log(
    "ADVANCE AMOUNT:",
    advanceAmount
);


// ============================================================
// BALANCE
// ============================================================

const balanceAmount =
    Math.max(
        0,
        grandTotal -
        advanceAmount
    );


console.log(
    "BALANCE AMOUNT:",
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
// SAVE TOTALS
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

console.log("====================================");
console.log("           FINAL BILL DEBUG");
console.log("====================================");

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
    "Wood Calculations:",
    woodCalculations.length
);

console.log(
    "Wood Total:",
    woodTotal
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

console.log("====================================");


// ============================================================
// PRINT BILL
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

            console.log(
                "PRINT BUTTON CLICKED"
            );

            window.print();

        }
    );

}


// ============================================================
// EDIT BILL
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

            console.log(
                "EDIT BUTTON CLICKED"
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


// ============================================================
// CLEAR BILL
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

            console.log(
                "CLEAR BUTTON CLICKED"
            );


            const confirmClear =
                confirm(
                    "Are you sure you want to clear this bill?"
                );


            if (
                !confirmClear
            ) {

                console.log(
                    "CLEAR CANCELLED"
                );

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


            console.log(
                "ALL BILL DATA CLEARED"
            );


            window.location.href =
                "./index.html";

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

            console.log(
                "===================================="
            );

            console.log(
                "CONFIRM BUTTON CLICKED"
            );


            localStorage.setItem(
                "billConfirmed",
                "true"
            );


            localStorage.setItem(
                "billConfirmedAt",
                new Date().toISOString()
            );


            console.log(
                "Bill confirmed successfully"
            );


            window.location.href =
                "./confirm.html";

        }
    );

}
else {

    console.error(
        "ERROR: confirmBill button not found!"
    );

}


// ============================================================
// WHATSAPP
// ============================================================

const whatsappBtn =
    document.getElementById(
        "whatsappBtn"
    );


if (
    whatsappBtn
) {

    whatsappBtn.addEventListener(
        "click",
        function () {

            console.log(
                "WHATSAPP BUTTON CLICKED"
            );


            let mobile =
                String(
                    customerMobile || ""
                )
                .replace(
                    /\D/g,
                    ""
                );


            console.log(
                "WHATSAPP MOBILE:",
                mobile
            );


            // ==================================================
            // VALIDATE MOBILE
            // ==================================================

            if (
                mobile.length !== 10
            ) {

                alert(
                    "Customer mobile number is not valid.\n\n" +
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            // ==================================================
            // CONFIRM SEND
            // ==================================================

            const confirmSend =
                confirm(
                    "Do you want to send this bill through WhatsApp?"
                );


            if (
                !confirmSend
            ) {

                console.log(
                    "WHATSAPP SEND CANCELLED"
                );

                return;

            }


            // ==================================================
            // INDIA NUMBER
            // ==================================================

            const whatsappNumber =
                "91" + mobile;


            // ==================================================
            // WHATSAPP MESSAGE
            // ==================================================

            const message =

`🧾 *WOOD BILL*

Customer: ${customerName || "-"}
Mobile: ${customerMobile || "-"}
Place: ${customerPlace || "-"}

----------------------------

Wood Details Total: ${money(woodTotal)}

Others Total: ${money(othersTotal)}

Subtotal: ${money(subtotal)}

Discount: ${money(discount)}

*Grand Total: ${money(grandTotal)}*

Advance Amount: ${money(advanceAmount)}

Balance Amount: ${money(balanceAmount)}

----------------------------

Thank you 🙏
ஸ்ரீ அம்மன் சாமில்`;


            // ==================================================
            // WHATSAPP URL
            // ==================================================

            const whatsappURL =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                encodeURIComponent(
                    message
                );


            console.log(
                "WHATSAPP URL CREATED"
            );


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}
else {

    console.warn(
        "WhatsApp button not found."
    );

}


// ============================================================
// FINAL READY
// ============================================================

console.log("====================================");
console.log("          BILL.JS READY");
console.log("====================================");
