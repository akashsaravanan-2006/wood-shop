// ============================================================
// BILL.JS
// WOOD BILL - FULL DEBUG VERSION
// ============================================================
//
// FEATURES
// ------------------------------------------------------------
// Customer details
// Bill number
// Date and time
// Wood details
// Length + Quantity separately
// Total Length NOT displayed
// CFT calculation
// Same Wood + Same Quality CFT grouped
// Other charges
// Wood total
// Others total
// Subtotal
// Discount
// Grand total
// Advance
// Balance
// Print
// Edit
// Clear
// Confirm
// WhatsApp + PDF
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

    return "₹ " +
        toNumber(value).toFixed(2);

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
// FALLBACK LOCAL STORAGE
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


if (billDateElement) {

    billDateElement.textContent =
        currentDate;

}


if (billDayTimeElement) {

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


if (billNoElement) {

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


    if (billNumber) {

        billNoElement.textContent =
            billNumber;

    }
    else {

        billNoElement.textContent =
            "---";

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


console.log(
    "WOOD CALCULATIONS COUNT:",
    woodCalculations.length
);

console.table(
    woodCalculations
);


// ============================================================
// WOOD TABLE
// ============================================================

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
                    style="text-align:center;"
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


                if (!woodName) {

                    woodName = "-";

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


                // ==================================================
                // PIECES
                // ==================================================

                const pieces =
                    Array.isArray(
                        item.pieces
                    )
                        ? item.pieces
                        : [];


                let lengthValues = [];


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

                        if (!piece) {

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
                        ? String(
                            item.quality
                        )
                        : "1";


                // ==================================================
                // NO LENGTH DATA
                // ==================================================

                if (
                    lengthValues.length === 0
                ) {

                    lengthValues.push({

                        length: 0,

                        qty: totalQty

                    });

                }


                // ==================================================
                // ROW COUNT
                // ==================================================

                const rowCount =
                    lengthValues.length;


                // ==================================================
                // CREATE EACH LENGTH + QTY ROW
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
                                    ${money(rate)}
                                </td>

                                <td
                                    rowspan="${rowCount}"
                                    class="amount-cell"
                                >
                                    ${money(amount)}
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


                        // ==================================================
                        // ADDITIONAL ROW
                        // ==================================================

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


// ============================================================
// WOOD TOTAL
// ============================================================

let woodTotal = 0;


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
// SAME WOOD + SAME QUALITY = COMBINE
// ============================================================

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

                    woodName = "-";

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

                    const existing =
                        groupedCFT.get(
                            groupKey
                        );


                    existing.cft +=
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


        let serialNumber = 1;


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

        if (!item) {

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
// DISPLAY TOTALS
// ============================================================

const woodTotalElement =
    document.getElementById(
        "woodTotal"
    );


if (woodTotalElement) {

    woodTotalElement.textContent =
        money(
            woodTotal
        );

}


const othersTotalElement =
    document.getElementById(
        "othersTotal"
    );


if (othersTotalElement) {

    othersTotalElement.textContent =
        money(
            othersTotal
        );

}


const subtotalElement =
    document.getElementById(
        "subtotal"
    );


if (subtotalElement) {

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

    if (discountRow) {

        discountRow.style.display =
            "flex";

    }


    if (discountAmountElement) {

        discountAmountElement.textContent =
            "- " +
            money(
                discount
            );

    }

}
else {

    if (discountRow) {

        discountRow.style.display =
            "none";

    }

}


// ============================================================
// GRAND TOTAL DISPLAY
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
    "ADVANCE:",
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

    if (advanceRow) {

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

    if (advanceRow) {

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


if (printBtn) {

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


if (editBtn) {

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


if (clearBtn) {

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


            if (!confirmClear) {

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


if (confirmBill) {

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

    console.warn(
        "confirmBill button not found."
    );

}


// ============================================================
// WHATSAPP + PDF
// ============================================================
//
// IMPORTANT
// ------------------------------------------------------------
// This creates the PDF correctly first.
// Then sends the PDF to the backend.
//
// The backend endpoint must be:
//
// POST /api/whatsapp/send-bill
//
// FormData:
//   bill
//   customerName
//   mobile
//
// ============================================================

const whatsappBtn =
    document.getElementById(
        "whatsappBtn"
    );


if (whatsappBtn) {

    whatsappBtn.addEventListener(
        "click",
        async function () {

            console.log(
                "===================================="
            );

            console.log(
                "WHATSAPP BUTTON CLICKED"
            );

            console.log(
                "===================================="
            );


            // ==================================================
            // CUSTOMER NAME
            // ==================================================

            const customerNameForWhatsApp =
                personalData.name ||
                personalData.customerName ||
                customerName ||
                "";


            // ==================================================
            // CUSTOMER MOBILE
            // ==================================================

            let customerMobileForWhatsApp =
                personalData.mobile ||
                personalData.customerMobile ||
                customerMobile ||
                "";


            customerMobileForWhatsApp =
                String(
                    customerMobileForWhatsApp
                )
                .replace(
                    /\D/g,
                    ""
                );


            // ==================================================
            // INDIA PREFIX
            // ==================================================

            if (
                customerMobileForWhatsApp.length === 12 &&
                customerMobileForWhatsApp.startsWith("91")
            ) {

                customerMobileForWhatsApp =
                    customerMobileForWhatsApp.substring(
                        2
                    );

            }


            console.log(
                "WHATSAPP CUSTOMER:",
                customerNameForWhatsApp
            );

            console.log(
                "WHATSAPP MOBILE:",
                customerMobileForWhatsApp
            );


            // ==================================================
            // VALIDATE NAME
            // ==================================================

            if (
                !customerNameForWhatsApp
            ) {

                alert(
                    "Customer name is missing.\n\n" +
                    "Please enter the customer name in Personal Details."
                );

                return;

            }


            // ==================================================
            // VALIDATE MOBILE
            // ==================================================

            if (
                customerMobileForWhatsApp.length !== 10
            ) {

                alert(
                    "Customer mobile number is not valid.\n\n" +
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            // ==================================================
            // CHECK PDF LIBRARY
            // ==================================================

            if (
                typeof html2pdf ===
                "undefined"
            ) {

                alert(
                    "PDF generator is not loaded.\n\n" +
                    "Please add html2pdf.js to bill.html."
                );

                console.error(
                    "ERROR: html2pdf.js NOT FOUND"
                );

                return;

            }


            // ==================================================
            // BUTTON STATE
            // ==================================================

            const oldButtonText =
                whatsappBtn.textContent;


            whatsappBtn.disabled =
                true;


            whatsappBtn.textContent =
                "Creating PDF...";


            let pdfWrapper = null;


            try {

                // ==================================================
                // GET ORIGINAL BILL
                // ==================================================

                const billElement =
                    document.querySelector(
                        ".bill-container"
                    );


                if (!billElement) {

                    throw new Error(
                        "Bill container not found."
                    );

                }


                // ==================================================
                // BILL NUMBER
                // ==================================================

                const billNumber =
                    billData.billNo ||
                    billData.billNumber ||
                    document
                        .getElementById(
                            "billNo"
                        )
                        ?.textContent
                        ?.trim() ||
                    "Bill";


                // ==================================================
                // FILE NAME
                // ==================================================

                const safeCustomerName =
                    customerNameForWhatsApp
                        .replace(
                            /[^a-zA-Z0-9 ]/g,
                            ""
                        )
                        .trim()
                        .replace(
                            /\s+/g,
                            "_"
                        ) ||
                    "Customer";


                const safeBillNumber =
                    String(
                        billNumber
                    )
                    .replace(
                        /[^a-zA-Z0-9_-]/g,
                        "_"
                    );


                const pdfFileName =
                    `${safeCustomerName}_${safeBillNumber}.pdf`;


                // ==================================================
                // CREATE PDF WRAPPER
                //
                // IMPORTANT:
                // Do NOT use left:-100000px.
                // It can cause html2canvas to render blank.
                // ==================================================

                pdfWrapper =
                    document.createElement(
                        "div"
                    );


                pdfWrapper.id =
                    "temporaryBillPdf";


                pdfWrapper.style.position =
                    "fixed";

                pdfWrapper.style.left =
                    "0";

                pdfWrapper.style.top =
                    "0";

                pdfWrapper.style.width =
                    "794px";

                pdfWrapper.style.minHeight =
                    "1123px";

                pdfWrapper.style.background =
                    "#ffffff";

                pdfWrapper.style.zIndex =
                    "-9999";

                pdfWrapper.style.opacity =
                    "0.01";

                pdfWrapper.style.pointerEvents =
                    "none";

                pdfWrapper.style.overflow =
                    "visible";

                pdfWrapper.style.boxSizing =
                    "border-box";


                // ==================================================
                // CLONE BILL
                // ==================================================

                const billClone =
                    billElement.cloneNode(
                        true
                    );


                billClone.style.width =
                    "100%";

                billClone.style.maxWidth =
                    "none";

                billClone.style.margin =
                    "0 auto";

                billClone.style.background =
                    "#ffffff";


                // ==================================================
                // REMOVE BUTTONS
                // ==================================================

                const clonedButtons =
                    billClone.querySelector(
                        ".buttons"
                    );


                if (clonedButtons) {

                    clonedButtons.remove();

                }


                billClone
                    .querySelectorAll(
                        "button"
                    )
                    .forEach(
                        function (
                            button
                        ) {

                            button.remove();

                        }
                    );


                // ==================================================
                // REMOVE UNNECESSARY BREAK
                // ==================================================

                billClone
                    .querySelectorAll(
                        "br"
                    )
                    .forEach(
                        function (
                            br
                        ) {

                            if (
                                br.parentElement &&
                                br.parentElement.classList.contains(
                                    "bill-container"
                                )
                            ) {

                                br.remove();

                            }

                        }
                    );


                // ==================================================
                // APPEND CLONE
                // ==================================================

                pdfWrapper.appendChild(
                    billClone
                );


                document.body.appendChild(
                    pdfWrapper
                );


                // ==================================================
                // COPY IMPORTANT TABLE STYLES
                // ==================================================

                const clonedTables =
                    pdfWrapper.querySelectorAll(
                        "table"
                    );


                clonedTables.forEach(
                    function (
                        table
                    ) {

                        table.style.width =
                            "100%";

                        table.style.borderCollapse =
                            "collapse";

                    }
                );


                // ==================================================
                // WAIT FOR DOM
                // ==================================================

                await new Promise(
                    function (
                        resolve
                    ) {

                        requestAnimationFrame(
                            function () {

                                requestAnimationFrame(
                                    resolve
                                );

                            }
                        );

                    }
                );


                // ==================================================
                // WAIT FOR IMAGES
                // ==================================================

                const images =
                    pdfWrapper.querySelectorAll(
                        "img"
                    );


                await Promise.all(
                    Array.from(
                        images
                    ).map(
                        function (
                            img
                        ) {

                            if (
                                img.complete
                            ) {

                                return Promise.resolve();

                            }


                            return new Promise(
                                function (
                                    resolve
                                ) {

                                    img.onload =
                                        resolve;

                                    img.onerror =
                                        resolve;

                                }
                            );

                        }
                    )
                );


                // ==================================================
                // SMALL RENDER DELAY
                // ==================================================

                await new Promise(
                    function (
                        resolve
                    ) {

                        setTimeout(
                            resolve,
                            500
                        );

                    }
                );


                console.log(
                    "PDF SOURCE WIDTH:",
                    pdfWrapper.offsetWidth
                );

                console.log(
                    "PDF SOURCE HEIGHT:",
                    pdfWrapper.offsetHeight
                );


                if (
                    pdfWrapper.offsetWidth === 0 ||
                    pdfWrapper.offsetHeight === 0
                ) {

                    throw new Error(
                        "PDF source has zero width or height."
                    );

                }


                // ==================================================
                // GENERATE PDF
                // ==================================================

                whatsappBtn.textContent =
                    "Generating PDF...";


                const pdfOptions = {

                    margin:
                        8,

                    filename:
                        pdfFileName,

                    image: {

                        type:
                            "jpeg",

                        quality:
                            0.98

                    },

                    html2canvas: {

                        scale:
                            2,

                        useCORS:
                            true,

                        allowTaint:
                            false,

                        backgroundColor:
                            "#ffffff",

                        logging:
                            false,

                        scrollX:
                            0,

                        scrollY:
                            0,

                        windowWidth:
                            794,

                        windowHeight:
                            Math.max(
                                1123,
                                pdfWrapper
                                    .scrollHeight
                            )

                    },

                    jsPDF: {

                        unit:
                            "mm",

                        format:
                            "a4",

                        orientation:
                            "portrait",

                        compress:
                            true

                    },

                    pagebreak: {

                        mode: [
                            "css",
                            "legacy"
                        ]

                    }

                };


                const pdfBlob =
                    await html2pdf()
                        .set(
                            pdfOptions
                        )
                        .from(
                            pdfWrapper
                        )
                        .outputPdf(
                            "blob"
                        );


                console.log(
                    "PDF GENERATED"
                );

                console.log(
                    "PDF SIZE:",
                    pdfBlob.size
                );


                // ==================================================
                // VALIDATE PDF
                // ==================================================

                if (
                    !pdfBlob ||
                    pdfBlob.size < 1000
                ) {

                    throw new Error(
                        "Generated PDF is empty or invalid."
                    );

                }


                // ==================================================
                // REMOVE TEMPORARY ELEMENT
                // ==================================================

                if (pdfWrapper) {

                    pdfWrapper.remove();

                    pdfWrapper =
                        null;

                }


                // ==================================================
                // CREATE FILE
                // ==================================================

                const pdfFile =
                    new File(
                        [
                            pdfBlob
                        ],
                        pdfFileName,
                        {
                            type:
                                "application/pdf"
                        }
                    );


                console.log(
                    "PDF FILE CREATED:",
                    pdfFile.name
                );

                console.log(
                    "PDF FILE SIZE:",
                    pdfFile.size
                );


                // ==================================================
                // SEND TO BACKEND
                // ==================================================

                whatsappBtn.textContent =
                    "Sending WhatsApp...";


                const formData =
                    new FormData();


                formData.append(
                    "bill",
                    pdfFile
                );


                formData.append(
                    "customerName",
                    customerNameForWhatsApp
                );


                formData.append(
                    "mobile",
                    customerMobileForWhatsApp
                );


                console.log(
                    "Sending bill to backend..."
                );


                const response =
                    await fetch(
                        "/api/whatsapp/send-bill",
                        {

                            method:
                                "POST",

                            body:
                                formData

                        }
                    );


                console.log(
                    "BACKEND STATUS:",
                    response.status
                );


                let result;


                try {

                    result =
                        await response.json();

                }
                catch (
                    jsonError
                ) {

                    throw new Error(
                        "Backend returned an invalid response."
                    );

                }


                console.log(
                    "BACKEND RESULT:",
                    result
                );


                // ==================================================
                // SUCCESS
                // ==================================================

                if (
                    response.ok &&
                    result.success
                ) {

                    alert(
                        "Bill sent successfully to " +
                        customerNameForWhatsApp +
                        " on WhatsApp."
                    );


                    console.log(
                        "WHATSAPP MESSAGE SENT:",
                        result.messageId || ""
                    );


                    return;

                }


                // ==================================================
                // ERROR
                // ==================================================

                throw new Error(
                    result.message ||
                    "Unable to send the bill through WhatsApp."
                );

            }
            catch (
                error
            ) {

                console.error(
                    "===================================="
                );

                console.error(
                    "WHATSAPP PDF ERROR:"
                );

                console.error(
                    error
                );

                console.error(
                    "===================================="
                );


                // ==================================================
                // REMOVE TEMP ELEMENT
                // ==================================================

                if (pdfWrapper) {

                    pdfWrapper.remove();

                    pdfWrapper =
                        null;

                }


                alert(
                    "Unable to send the bill through WhatsApp.\n\n" +
                    error.message
                );

            }
            finally {

                // ==================================================
                // RESTORE BUTTON
                // ==================================================

                whatsappBtn.disabled =
                    false;


                whatsappBtn.textContent =
                    oldButtonText ||
                    "WhatsApp";

            }

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
