// ============================================================
// BILL.JS
// AMMAN SAW MILL - FINAL VERSION
// ============================================================
//
// FEATURES
// ------------------------------------------------------------
// Customer Details
// Bill Number
// Date / Time
// Wood Details
// Length + Quantity separately
// Total Length NOT displayed
// CFT calculation
// Same Wood + Same Quality CFT grouped
// Other Charges
// Wood Total
// Others Total
// Subtotal
// Discount
// Grand Total
// Advance
// Balance
// Print
// Edit
// Clear
// Confirm
// Automatic WhatsApp PDF Sending
// ============================================================

console.clear();

console.log("====================================");
console.log("       AMMAN SAW MILL BILL.JS");
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
        String(value).replace(/[₹,\s]/g, "")
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
// GET FROM STORE DATA
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
            "getBillData ERROR:",
            error
        );

        billData = {};

    }

}


// ============================================================
// LOCAL STORAGE FALLBACK
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
            "LOCAL STORAGE BILL DATA ERROR:",
            error
        );

        billData = {};

    }

}


console.log(
    "COMPLETE BILL DATA:",
    billData
);


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
// DATE AND TIME
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


let currentBillNumber = "---";


if (billNoElement) {

    currentBillNumber =
        billData.billNo ||
        billData.billNumber ||
        billData.savedBillNo ||
        localStorage.getItem(
            "billNo"
        ) ||
        localStorage.getItem(
            "savedBillNo"
        ) ||
        "---";


    billNoElement.textContent =
        currentBillNumber;

}


// ============================================================
// WOOD CALCULATIONS
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


// ============================================================
// WOOD DATA FALLBACK
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
            "WOOD DATA ERROR:",
            error
        );

    }

}


console.log("WOOD CALCULATIONS:", woodCalculations);

console.log(
    "FULL WOOD JSON:",
    JSON.stringify(woodCalculations, null, 2)
);

console.log(
    "FULL OTHER JSON:",
    JSON.stringify(otherItems, null, 2)
);

// ============================================================
// WOOD TABLE
// ============================================================
//
// Columns:
//
// S.No
// Wood
// Size
// Length
// Qty
// CFT
// Rate
// Amount
// Quality
//
// Total Length removed.
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


                // ==================================================
                // PIECES
                //
                // Example:
                //
                // 4 -> 3
                // 5 -> 6
                // 2 -> 10
                //
                // Display:
                //
                // Length | Qty
                // 4      | 3
                // 5      | 6
                // 2      | 10
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
                // NO LENGTH
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


                // ==================================================
                // CREATE ROWS
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

                        // ==================================================
                        // ADDITIONAL LENGTH/QUANTITY ROW
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


// ============================================================
// WOOD DETAILS TOTAL
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
//
// SAME WOOD + SAME QUALITY
// = COMBINE CFT
//
// Example:
//
// Teak (1) = 3.06
// Teak (2) = 3.65
// Teak (2) = 8.00
//
// Result:
//
// Teak (1) = 3.06 CFT
// Teak (2) = 11.65 CFT
// ============================================================

const cftSummary =
    document.getElementById(
        "cftSummary"
    );


if (cftSummary) {

    cftSummary.innerHTML =
        "";


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


// ============================================================
// LABOUR DATA
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
        labourCentral;

}


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


if (chargeTable) {

    chargeTable.innerHTML =
        "";


    let serialNumber =
        1;


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


if (
    advanceAmount > grandTotal
) {

    advanceAmount =
        grandTotal;

}


// ============================================================
// BALANCE
// ============================================================

const balanceAmount =
    Math.max(
        0,
        grandTotal -
        advanceAmount
    );


// ============================================================
// ADVANCE DISPLAY
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
// BALANCE DISPLAY
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
console.log("          FINAL BILL DEBUG");
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
    "Wood Count:",
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
// PRINT
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
// EDIT
// ============================================================

const editBtn =
    document.getElementById(
        "editBtn"
    );


if (editBtn) {

    editBtn.addEventListener(
        "click",
        function () {

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
// CLEAR
// ============================================================

const clearBtn =
    document.getElementById(
        "clearBtn"
    );


if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

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


            window.location.href =
                "./index.html";

        }
    );

}


// ============================================================
// CONFIRM BILL + SAVE TO TIDB
// ============================================================

const confirmBill =
    document.getElementById("confirmBill");


if (confirmBill) {

    confirmBill.addEventListener(
        "click",
        async function () {

            console.log(
                "===================================="
            );

            console.log(
                "CONFIRM BILL - SAVING TO DATABASE"
            );

            console.log(
                "===================================="
            );


            // ==================================================
            // GET PAYMENT DATA
            // ==================================================

            const paymentType =
                advanceCentral.paymentType ||
                localStorage.getItem("paymentType") ||
                "cash";


            const paymentMode =
                advanceCentral.paymentMode ||
                localStorage.getItem("paymentMode") ||
                "cash";


            // ==================================================
            // CREATE COMPLETE BILL OBJECT
            // ==================================================

            const billToSave = {

                // CUSTOMER
                customerName:
                    customerName,

                customerMobile:
                    customerMobile,

                customerPlace:
                    customerPlace,


                // DATE / TIME
                billDate:
                    new Date().toISOString().slice(0, 10),

                billTime:
                    new Date().toTimeString().slice(0, 8),


                // PAYMENT
                paymentType:
                    paymentType,

                paymentMode:
                    paymentMode,


                // AMOUNTS
                advanceAmount:
                    Math.round(advanceAmount),

                balanceAmount:
                    Math.round(balanceAmount),

                totalCFT:
                    Number(
                        woodCalculations.reduce(
                            function (total, item) {

                                return total +
                                    toNumber(
                                        item?.cubicFeet
                                    );

                            },
                            0
                        )
                    ),


                woodTotal:
                    Math.round(woodTotal),

                labourCharge:
                    Math.round(labourCharge),

                otherCharge:
                    Math.round(otherCharge),

                othersTotal:
                    Math.round(othersTotal),

                discountAmount:
                    Math.round(discount),

                grandTotal:
                    Math.round(grandTotal),


                // COMPLETE WOOD DETAILS
                woodData:
                    woodCalculations,


                // COMPLETE OTHER CHARGE DETAILS
                othersData:
                    otherItems,


                // REMARK
                remark:
                    ""

            };


            // ==================================================
            // DEBUG
            // ==================================================

            console.log(
                "BILL DATA BEING SENT TO SERVER:"
            );

            console.log(
                JSON.stringify(
                    billToSave,
                    null,
                    2
                )
            );


            // ==================================================
            // DISABLE BUTTON
            // ==================================================

            const oldText =
                confirmBill.textContent;

            confirmBill.disabled =
                true;

            confirmBill.textContent =
                "Saving...";


            try {

                // ==================================================
                // SEND TO BACKEND
                // ==================================================

                const response =
                    await fetch(
                        "https://wood-shop-backend.vercel.app/api/save-bill",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    billToSave
                                )

                        }
                    );


                // ==================================================
                // READ RESPONSE
                // ==================================================

                const result =
                    await response.json();


                console.log(
                    "SAVE BILL RESPONSE:",
                    result
                );


                // ==================================================
                // ERROR
                // ==================================================

                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        result.error ||
                        "Unable to save bill"
                    );

                }


                // ==================================================
                // SAVE GENERATED BILL INFORMATION
                // ==================================================

                localStorage.setItem(
                    "savedBillId",
                    String(
                        result.billId || ""
                    )
                );


                localStorage.setItem(
                    "savedBillNo",
                    result.billNo || ""
                );


                localStorage.setItem(
                    "savedCustomerId",
                    result.customerId || ""
                );


                localStorage.setItem(
                    "billConfirmed",
                    "true"
                );


                localStorage.setItem(
                    "billConfirmedAt",
                    new Date().toISOString()
                );


                // ==================================================
                // UPDATE CENTRAL STORAGE
                // ==================================================

                if (
                    typeof getBillData ===
                    "function" &&
                    typeof saveBillData ===
                    "function"
                ) {

                    const completeBill =
                        getBillData();


                    completeBill.billNo =
                        result.billNo;


                    completeBill.customerId =
                        result.customerId;


                    completeBill.totals = {

                        woodTotal:
                            Math.round(
                                woodTotal
                            ),

                        othersTotal:
                            Math.round(
                                othersTotal
                            ),

                        subtotal:
                            Math.round(
                                subtotal
                            ),

                        discount:
                            Math.round(
                                discount
                            ),

                        grandTotal:
                            Math.round(
                                grandTotal
                            ),

                        advanceAmount:
                            Math.round(
                                advanceAmount
                            ),

                        balanceAmount:
                            Math.round(
                                balanceAmount
                            )

                    };


                    saveBillData(
                        completeBill
                    );

                }


                // ==================================================
                // SUCCESS
                // ==================================================

                alert(
                    "Bill saved successfully.\n\n" +
                    "Bill No: " +
                    result.billNo
                );


                // ==================================================
                // GO TO CONFIRM PAGE
                // ==================================================

                window.location.href =
                    "./confirm.html";

            }
            catch (error) {

                console.error(
                    "SAVE BILL ERROR:",
                    error
                );


                alert(
                    "Bill could not be saved.\n\n" +
                    error.message
                );


                confirmBill.disabled =
                    false;

                confirmBill.textContent =
                    oldText;

            }

        }
    );

}
// ============================================================
// WHATSAPP + PDF
// ============================================================
//
// IMPORTANT
// ------------------------------------------------------------
// This version does NOT:
// - open wa.me
// - download the PDF manually
// - ask the user to attach the PDF
// - check whether WhatsApp exists
//
// It does:
//
// Personal Details
//       ↓
// Customer Name + Mobile
//       ↓
// Generate PDF
//       ↓
// Convert PDF to Base64
//       ↓
// POST /api/whatsapp/send-bill
//       ↓
// Backend sends through WhatsApp Cloud API
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
            // REMOVE +91
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
            // VALIDATE CUSTOMER
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
            // CHECK HTML2PDF
            // ==================================================

            if (
                typeof html2pdf ===
                "undefined"
            ) {

                alert(
                    "PDF generator is not loaded.\n\n" +
                    "Please check html2pdf.js in bill.html."
                );

                console.error(
                    "html2pdf.js NOT FOUND"
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


            let pdfWrapper =
                null;


            try {

                // ==================================================
                // BILL CONTAINER
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


                console.log(
                    "PDF FILE:",
                    pdfFileName
                );


                // ==================================================
                // CLONE BILL
                // ==================================================

                const billClone =
                    billElement.cloneNode(
                        true
                    );


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
                // CREATE PDF WRAPPER
                //
                // DO NOT PUT IT AT -100000px.
                // ==================================================

                pdfWrapper =
                    document.createElement(
                        "div"
                    );


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

                pdfWrapper.style.boxSizing =
                    "border-box";


                // ==================================================
                // CLONE WIDTH
                // ==================================================

                billClone.style.width =
                    "100%";

                billClone.style.maxWidth =
                    "none";

                billClone.style.margin =
                    "0";

                billClone.style.background =
                    "#ffffff";


                pdfWrapper.appendChild(
                    billClone
                );


                document.body.appendChild(
                    pdfWrapper
                );


                // ==================================================
                // TABLE FIX
                // ==================================================

                pdfWrapper
                    .querySelectorAll(
                        "table"
                    )
                    .forEach(
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
                // WAIT FOR BROWSER RENDER
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
                // WAIT 500ms
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


                // ==================================================
                // PDF OPTIONS
                // ==================================================

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
                                pdfWrapper.scrollHeight
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


                // ==================================================
                // GENERATE PDF
                // ==================================================

                whatsappBtn.textContent =
                    "Generating PDF...";


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
                // REMOVE PDF WRAPPER
                // ==================================================

                if (pdfWrapper) {

                    pdfWrapper.remove();

                    pdfWrapper =
                        null;

                }


                // ==================================================
                // VALIDATE PDF
                // ==================================================

                if (
                    !pdfBlob ||
                    pdfBlob.size < 1000
                ) {

                    throw new Error(
                        "Generated PDF is empty."
                    );

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
                // CONVERT PDF TO BASE64
                // ==================================================

                whatsappBtn.textContent =
                    "Preparing WhatsApp...";


                const pdfBase64 =
                    await new Promise(
                        function (
                            resolve,
                            reject
                        ) {

                            const reader =
                                new FileReader();


                            reader.onload =
                                function () {

                                    resolve(
                                        reader.result
                                    );

                                };


                            reader.onerror =
                                function (
                                    error
                                ) {

                                    reject(
                                        error
                                    );

                                };


                            reader.readAsDataURL(
                                pdfFile
                            );

                        }
                    );


                console.log(
                    "PDF BASE64 READY"
                );


                // ==================================================
                // SEND TO VERCEL API
                // ==================================================

                whatsappBtn.textContent =
                    "Sending WhatsApp...";


                console.log(
                    "Sending bill to backend..."
                );


                const response =
                    await fetch(
                        "/api/whatsapp/send-bill",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    pdfBase64:
                                        pdfBase64,

                                    fileName:
                                        pdfFileName,

                                    customerName:
                                        customerNameForWhatsApp,

                                    mobile:
                                        customerMobileForWhatsApp

                                })

                        }
                    );


                console.log(
                    "BACKEND STATUS:",
                    response.status
                );


                // ==================================================
                // READ RESPONSE
                // ==================================================

                let result;


                try {

                    result =
                        await response.json();

                }
                catch (
                    responseError
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
                        "MESSAGE ID:",
                        result.messageId
                    );


                    return;

                }


                // ==================================================
                // API ROUTE NOT FOUND
                // ==================================================

                if (
                    response.status === 404
                ) {

                    throw new Error(
                        "API route not found.\n\n" +
                        "Make sure api/whatsapp/send-bill.js " +
                        "exists in the project root and Vercel has redeployed."
                    );

                }


                // ==================================================
                // API ERROR
                // ==================================================

                throw new Error(
                    result.message ||
                    "Unable to send the bill through WhatsApp."
                );

            }
            catch (error) {

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
                // REMOVE TEMPORARY WRAPPER
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

console.log(
    "===================================="
);

console.log(
    "          BILL.JS READY"
);

console.log(
    "===================================="
);
