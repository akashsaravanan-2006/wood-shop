// ============================================================
// BILL.JS
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


// If storedata.js provides getBillData()
if (typeof getBillData === "function") {

    try {

        billData = getBillData() || {};

    }
    catch (error) {

        console.error(
            "getBillData() error:",
            error
        );

        billData = {};

    }

}


// Fallback to localStorage
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
            "current_bill_data error:",
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


// ============================================================
// DISPLAY CUSTOMER
// ============================================================

const customerNameElement =
    document.getElementById("customerName");

const customerMobileElement =
    document.getElementById("customerMobile");

const customerPlaceElement =
    document.getElementById("customerPlace");


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
    document.getElementById("billDate");

const billDayTimeElement =
    document.getElementById("billDayTime");


const now = new Date();


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
// IMPORTANT:
// This JS does NOT generate a bill number.
// If your database/storedata.js already supplies the bill
// number, it will be displayed here.
// ============================================================

const billNoElement =
    document.getElementById("billNo");


if (billNoElement) {

    const billNumber =
        billData.billNo ||
        billData.billNumber ||
        personalData.billNo ||
        personalData.billNumber ||
        localStorage.getItem("billNo");


    // Only display if already available.
    // Never create a new bill number here.

    if (billNumber) {

        billNoElement.textContent =
            billNumber;

    }

}


// ============================================================
// ============================================================
// WOOD DATA
// IMPORTANT:
// EACH CALCULATION REMAINS SEPARATE.
// NO GROUPING.
// NO COMBINING SAME WOOD.
// ============================================================
// ============================================================

let woodCalculations = [];


// ------------------------------------------------------------
// PRIMARY SOURCE
// ------------------------------------------------------------

if (
    Array.isArray(
        woodPage.calculations
    )
) {

    woodCalculations =
        woodPage.calculations;

}


// ------------------------------------------------------------
// FALLBACK SOURCE
// ------------------------------------------------------------

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
            Array.isArray(storedWood)
        ) {

            woodCalculations =
                storedWood;

        }

    }
    catch (error) {

        console.error(
            "woodData error:",
            error
        );

    }

}


console.log(
    "===================================="
);

console.log(
    "TOTAL WOOD CALCULATIONS:",
    woodCalculations.length
);

console.log(
    woodCalculations
);

console.log(
    "===================================="
);


// ============================================================
// WOOD TABLE
// ONE CALCULATION = ONE ROW
// ============================================================

const woodTable =
    document.getElementById(
        "woodTable"
    );


if (woodTable) {

    woodTable.innerHTML = "";


    // --------------------------------------------------------
    // NO DATA
    // --------------------------------------------------------

    if (
        woodCalculations.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="10">
                    No wood data
                </td>

            </tr>

        `;

    }


    // --------------------------------------------------------
    // PRINT EVERY CALCULATION
    // --------------------------------------------------------

    else {

        woodCalculations.forEach(
            function (
                item,
                index
            ) {

                if (!item) {

                    return;

                }


                // ============================================
                // WOOD NAME
                // ============================================

                let woodName =
                    item.woodType ||
                    item.wood ||
                    "";


                if (
                    woodName === "Other"
                ) {

                    woodName =
                        item.otherWood ||
                        item.woodName ||
                        "Other";

                }


                if (!woodName) {

                    woodName =
                        "-";

                }


                // ============================================
                // BREADTH
                // ============================================

                const breadth =
                    toNumber(
                        item.breadth
                    );


                // ============================================
                // THICKNESS
                // ============================================

                const thickness =
                    toNumber(
                        item.thickness
                    );


                // ============================================
                // SIZE
                // ============================================

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


                // ============================================
                // PIECES
                // ============================================

                const pieces =
                    Array.isArray(
                        item.pieces
                    )
                        ? item.pieces
                        : [];


                // ============================================
                // LENGTHS
                // ============================================

                
                // ============================================
// LENGTH + QUANTITY SEPARATELY
// Example:
// 9 → 4
// 5 → 6
// ============================================

let lengthValues = [];

pieces.forEach(function (piece) {

    if (!piece) {
        return;
    }

    const length = toNumber(piece.length);

    const extraLength = toNumber(piece.extraLength);

    const finalLength = length + extraLength;

    const qty = toNumber(piece.qty);

    if (finalLength > 0) {

        lengthValues.push({
            length: finalLength,
            qty: qty
        });

    }

});


// ============================================
// FALLBACK TO DIRECT LENGTH
// ============================================

if (
    lengthValues.length === 0 &&
    item.length !== undefined
) {

    const directLength =
        toNumber(item.length);

    const directQty =
        toNumber(item.qty);

    if (directLength > 0) {

        lengthValues.push({
            length: directLength,
            qty: directQty
        });

    }

}


// ============================================
// DISPLAY EACH LENGTH SEPARATELY
// ============================================

let lengthText = "-";

if (lengthValues.length > 0) {

    lengthText =
        lengthValues
            .map(function (item) {

                return `
                    ${item.length}
                    → ${item.qty}
                `;

            })
            .join("<br>");

}


                // ============================================
                // QUANTITY
                // ============================================

                let totalQty = 0;


                pieces.forEach(
                    function (piece) {

                        if (!piece) {

                            return;

                        }


                        totalQty +=
                            toNumber(
                                piece.qty
                            );

                    }
                );


                // Fallback to calculation quantity
                if (
                    totalQty === 0 &&
                    item.qty !== undefined
                ) {

                    totalQty =
                        toNumber(
                            item.qty
                        );

                }


                // ============================================
                // TOTAL LENGTH
                // ============================================

                let totalLength =
                    toNumber(
                        item.totalLength
                    );


                // Calculate only if not already provided
                if (
                    totalLength === 0
                ) {

                    pieces.forEach(
                        function (piece) {

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


                            const qty =
                                toNumber(
                                    piece.qty
                                );


                            totalLength +=
                                (
                                    length +
                                    extraLength
                                ) * qty;

                        }
                    );

                }


                // ============================================
                // CFT
                // ============================================

                const cubicFeet =
                    toNumber(
                        item.cubicFeet
                    );


                // ============================================
                // RATE
                // ============================================

                const rate =
                    toNumber(
                        item.rate
                    );


                // ============================================
                // AMOUNT
                // ============================================

                const amount =
                    toNumber(
                        item.amount
                    );


                // ============================================
                // QUALITY
                // ============================================

                const quality =
                    item.quality !== undefined &&
                    item.quality !== ""
                        ? item.quality
                        : "1";


                // ============================================
                // CREATE ONE ROW
                // ============================================

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
                            woodName
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
                        ${totalQty}
                    </td>

                    <td>
                        ${totalLength.toFixed(2)}
                    </td>

                    <td>
                        ${cubicFeet.toFixed(2)}
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
                        ${escapeHTML(
                            quality
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
// WOOD TOTAL
// ADD ALL CALCULATIONS
// BUT DO NOT COMBINE THEIR DISPLAY
// ============================================================

let woodTotal = 0;


woodCalculations.forEach(
    function (item) {

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
// SEPARATE WOOD DETAILS TOTAL
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
// EACH CALCULATION SEPARATELY
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

        woodCalculations.forEach(
            function (
                item,
                index
            ) {

                if (!item) {

                    return;

                }


                let woodName =
                    item.woodType ||
                    item.wood ||
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
        "Labour localStorage error:",
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
// ADDITIONAL OTHER ITEMS
// ============================================================

const otherItems =
    Array.isArray(
        labourData.otherItems
    )
        ? labourData.otherItems
        : [];


let additionalTotal = 0;


otherItems.forEach(
    function (item) {

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


// Use saved othersTotal if available
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
    "ADDITIONAL:",
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


if (chargeTable) {

    chargeTable.innerHTML = "";


    let serialNumber = 1;


    // Labour
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


    // Other Charge
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


    // Additional items
    otherItems.forEach(
        function (item) {

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
// DISPLAY DISCOUNT
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


console.log(
    "ADVANCE:",
    advanceAmount
);

console.log(
    "BALANCE:",
    balanceAmount
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


// ============================================================
// DEBUG
// ============================================================

console.log(
    "===================================="
);

console.log(
    "FINAL BILL"
);

console.log(
    "NUMBER OF WOOD CALCULATIONS:",
    woodCalculations.length
);

console.log(
    "WOOD TOTAL:",
    woodTotal
);

console.log(
    "OTHERS TOTAL:",
    othersTotal
);

console.log(
    "SUBTOTAL:",
    subtotal
);

console.log(
    "DISCOUNT:",
    discount
);

console.log(
    "GRAND TOTAL:",
    grandTotal
);

console.log(
    "ADVANCE:",
    advanceAmount
);

console.log(
    "BALANCE:",
    balanceAmount
);

console.log(
    "===================================="
);


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

            const confirmClear =
                confirm(
                    "Are you sure you want to clear this bill?"
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
// CONFIRM
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
                "CONFIRM BUTTON CLICKED"
            );


            // Save confirmation status
            localStorage.setItem(
                "billConfirmed",
                "true"
            );


            // Save confirmation time
            localStorage.setItem(
                "billConfirmedAt",
                new Date().toISOString()
            );


            console.log(
                "Bill confirmed successfully"
            );


            // Go to Confirm Page
            window.location.href =
                "./confirm.html";

        }
    );

}
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

            let mobile =
                String(
                    customerMobile || ""
                )
                .replace(
                    /\D/g,
                    ""
                );


            if (
                mobile.length !== 10
            ) {

                alert(
                    "Customer mobile number is not valid."
                );

                return;

            }


            const confirmSend =
                confirm(
                    "Do you want to send this bill through WhatsApp?"
                );


            if (
                !confirmSend
            ) {

                return;

            }


            const whatsappNumber =
                "91" + mobile;


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


            const whatsappURL =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                encodeURIComponent(
                    message
                );


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}


// ============================================================
// READY
// ============================================================

console.log(
    "===================================="
);

console.log(
    "BILL.JS READY"
);

console.log(
    "WOOD CALCULATIONS DISPLAYED SEPARATELY:"
);

console.log(
    woodCalculations.length
);

console.log(
    "===================================="
);
