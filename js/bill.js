// ============================================================
// BILL.JS
// USES LABOURDATA AS THE SOURCE OF TRUTH
// ============================================================

console.log("====================================");
console.log("BILL.JS LOADED");
console.log("====================================");


// ============================================================
// NUMBER
// ============================================================

function num(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const result = parseFloat(
        String(value)
            .replace(/[₹,\s]/g, "")
    );

    return Number.isFinite(result)
        ? result
        : 0;
}


// ============================================================
// MONEY
// ============================================================

function money(value) {

    return "₹ " + Math.round(
        num(value)
    );
}


// ============================================================
// READ JSON
// ============================================================

function readJSON(key) {

    const value =
        localStorage.getItem(key);

    if (!value) {
        return null;
    }

    try {

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "JSON ERROR:",
            key,
            error
        );

        return null;
    }
}


// ============================================================
// LOAD LABOUR DATA
// ============================================================
//
// IMPORTANT:
// DO NOT MODIFY LABOUR DATA.
// READ EXACTLY WHAT labour.js SAVED.
// ============================================================

const labourData =
    readJSON("labourData") || {};

console.log(
    "===================================="
);

console.log(
    "LABOUR DATA USED BY BILL:"
);

console.log(
    labourData
);


// ============================================================
// WOOD TOTAL
// ============================================================

let woodTotal =
    num(
        labourData.woodTotal
    );


// Fallback only if labourData doesn't contain it.

if (
    woodTotal === 0
) {

    woodTotal =
        num(
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
// LABOUR CHARGE
// ============================================================

const labourCharge =
    num(
        labourData.labourCharge
    );


console.log(
    "LABOUR CHARGE:",
    labourCharge
);


// ============================================================
// OTHER CHARGE
// ============================================================

const otherCharge =
    num(
        labourData.otherCharge
    );


console.log(
    "OTHER CHARGE:",
    otherCharge
);


// ============================================================
// ADDITIONAL ITEMS
// ============================================================

let otherItems = [];

if (
    Array.isArray(
        labourData.otherItems
    )
) {

    otherItems =
        labourData.otherItems;

}


console.log(
    "OTHER ITEMS:",
    otherItems
);


// ============================================================
// OTHERS TOTAL
// ============================================================
//
// IMPORTANT:
// Take the exact value calculated by labour.js.
// DO NOT calculate it again.
// ============================================================

let othersTotal =
    num(
        labourData.othersTotal
    );


console.log(
    "OTHERS TOTAL FROM LABOUR.JS:",
    othersTotal
);


// Fallback only if old labourData does not contain it.

if (
    othersTotal === 0 &&
    (
        labourCharge > 0 ||
        otherCharge > 0 ||
        otherItems.length > 0
    )
) {

    let additionalTotal = 0;


    otherItems.forEach(
        function(item) {

            if (!item) {
                return;
            }

            additionalTotal +=
                num(
                    item.amount
                );

        }
    );


    othersTotal =
        labourCharge +
        otherCharge +
        additionalTotal;

}


console.log(
    "FINAL OTHERS TOTAL:",
    othersTotal
);


// ============================================================
// GRAND TOTAL BEFORE DISCOUNT
// ============================================================
//
// Wood Total + Others Total
// ============================================================

const subtotal =
    Math.round(
        woodTotal +
        othersTotal
    );


console.log(
    "SUBTOTAL:",
    subtotal
);


// ============================================================
// DISCOUNT
// ============================================================

let discount = 0;


// First check current bill data.

const currentBill =
    readJSON(
        "current_bill_data"
    );


if (
    currentBill &&
    currentBill.discount
) {

    discount =
        num(
            currentBill.discount.discountAmount
        );

}


// Try discountAmount

if (
    discount === 0
) {

    discount =
        num(
            localStorage.getItem(
                "discountAmount"
            )
        );

}


// Try discount

if (
    discount === 0
) {

    discount =
        num(
            localStorage.getItem(
                "discount"
            )
        );

}


// Try billDiscount

if (
    discount === 0
) {

    discount =
        num(
            localStorage.getItem(
                "billDiscount"
            )
        );

}


// Discount cannot be greater than subtotal.

if (
    discount > subtotal
) {

    discount =
        subtotal;

}


console.log(
    "DISCOUNT:",
    discount
);


// ============================================================
// FINAL GRAND TOTAL
// ============================================================

const grandTotal =
    Math.max(
        0,
        Math.round(
            subtotal -
            discount
        )
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
        function(item) {

            if (!item) {
                return;
            }


            const amount =
                num(
                    item.amount
                );


            if (
                amount <= 0
            ) {

                return;

            }


            const itemName =
                item.reason ||
                item.name ||
                "Other";


            chargeTable.innerHTML += `

                <tr>

                    <td>
                        ${serialNumber++}
                    </td>

                    <td>
                        ${itemName}
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
    // NO CHARGES
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
// ADVANCE
// ============================================================

let advanceAmount = 0;


// Try advanceData first.

const advanceData =
    readJSON(
        "advanceData"
    );


if (
    advanceData &&
    typeof advanceData === "object"
) {

    advanceAmount =
        num(
            advanceData.advanceAmount
        );

}


// Try current bill data.

if (
    advanceAmount === 0 &&
    currentBill &&
    currentBill.advance
) {

    advanceAmount =
        num(
            currentBill.advance.advanceAmount
        );

}


// Try direct localStorage.

if (
    advanceAmount === 0
) {

    advanceAmount =
        num(
            localStorage.getItem(
                "advanceAmount"
            )
        );

}


// Advance cannot exceed grand total.

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
        Math.round(
            grandTotal -
            advanceAmount
        )
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

const balanceElement =
    document.getElementById(
        "balanceAmount"
    );


if (
    balanceElement
) {

    balanceElement.textContent =
        money(
            balanceAmount
        );

}


// ============================================================
// WOOD DETAILS TABLE
// ============================================================
//
// THIS IS THE IMPORTANT FIX.
//
// Reads the existing woodData saved by wood.js.
// Does NOT change woodTotal calculation.
// ============================================================

const woodTable =
    document.getElementById(
        "woodTable"
    );


if (
    woodTable
) {

    woodTable.innerHTML = "";


    const woodData =
        readJSON(
            "woodData"
        );


    console.log(
        "===================================="
    );

    console.log(
        "WOOD DATA FOR BILL TABLE:"
    );

    console.log(
        woodData
    );

    console.log(
        "===================================="
    );


    if (
        Array.isArray(
            woodData
        ) &&
        woodData.length > 0
    ) {


        woodData.forEach(
            function(item, index) {

                if (!item) {
                    return;
                }


                // ------------------------------------------------
                // WOOD NAME
                // ------------------------------------------------

                const woodName =
                    item.wood ??
                    item.name ??
                    item.woodName ??
                    "-";


                // ------------------------------------------------
                // SIZE
                // ------------------------------------------------

                const size =
                    item.size ??
                    item.dimension ??
                    item.dimensions ??
                    "-";


                // ------------------------------------------------
                // LENGTH
                // ------------------------------------------------

                const length =
                    item.length ??
                    item.len ??
                    item.lengthValue ??
                    0;


                // ------------------------------------------------
                // QUANTITY
                // ------------------------------------------------

                const qty =
                    item.qty ??
                    item.quantity ??
                    0;


                // ------------------------------------------------
                // TOTAL LENGTH
                // ------------------------------------------------

                const totalLength =
                    item.totalLength ??
                    item.total_length ??
                    (
                        num(length) *
                        num(qty)
                    );


                // ------------------------------------------------
                // CFT
                // ------------------------------------------------

                const cft =
                    item.cft ??
                    item.totalCFT ??
                    item.cftValue ??
                    0;


                // ------------------------------------------------
                // RATE
                // ------------------------------------------------

                const rate =
                    item.rate ??
                    item.ratePerCft ??
                    item.price ??
                    0;


                // ------------------------------------------------
                // AMOUNT
                // ------------------------------------------------

                const amount =
                    item.amount ??
                    item.totalAmount ??
                    item.total ??
                    0;


                // ------------------------------------------------
                // QUALITY
                // ------------------------------------------------

                const quality =
                    item.quality ??
                    item.grade ??
                    "-";


                // ------------------------------------------------
                // DISPLAY ROW
                // ------------------------------------------------

                woodTable.innerHTML += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${woodName}
                        </td>

                        <td>
                            ${size}
                        </td>

                        <td>
                            ${length}
                        </td>

                        <td>
                            ${qty}
                        </td>

                        <td>
                            ${totalLength}
                        </td>

                        <td>
                            ${num(cft).toFixed(2)}
                        </td>

                        <td>
                            ${money(rate)}
                        </td>

                        <td>
                            ${money(amount)}
                        </td>

                        <td>
                            ${quality}
                        </td>

                    </tr>

                `;

            }
        );


    }
    else {

        woodTable.innerHTML = `

            <tr>

                <td colspan="10">
                    -
                </td>

            </tr>

        `;


        console.warn(
            "WOOD DATA NOT FOUND"
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

    const woodData =
        readJSON(
            "woodData"
        );


    cftSummary.innerHTML = "";


    if (
        Array.isArray(
            woodData
        )
    ) {

        woodData.forEach(
            function(item) {

                if (!item) {
                    return;
                }


                const woodName =
                    item.wood ||
                    item.name ||
                    "Wood";


                const cft =
                    num(
                        item.cft ||
                        item.totalCFT ||
                        item.cftValue
                    );


                if (
                    cft <= 0
                ) {

                    return;

                }


                cftSummary.innerHTML += `

                    <div class="cft-item">

                        <strong>
                            ${woodName}
                        </strong>

                        <span>
                            ${cft.toFixed(2)} CFT
                        </span>

                    </div>

                `;

            }
        );

    }

}


// ============================================================
// SAVE FINAL VALUES
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
    "Wood Total     :",
    woodTotal
);

console.log(
    "Labour Charge  :",
    labourCharge
);

console.log(
    "Other Charge   :",
    otherCharge
);

console.log(
    "Additional     :",
    otherItems
);

console.log(
    "Others Total   :",
    othersTotal
);

console.log(
    "Subtotal       :",
    subtotal
);

console.log(
    "Discount       :",
    discount
);

console.log(
    "Grand Total    :",
    grandTotal
);

console.log(
    "Advance Amount :",
    advanceAmount
);

console.log(
    "Balance Amount :",
    balanceAmount
);

console.log(
    "===================================="
);


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
        function() {

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
        function() {

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
        function() {

            history.back();

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
        function() {

            const answer =
                confirm(
                    "Are you sure you want to clear the bill?"
                );


            if (!answer) {
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
        function() {

            const answer =
                confirm(
                    "Confirm this bill?"
                );


            if (!answer) {
                return;
            }


            localStorage.setItem(
                "billConfirmed",
                "true"
            );


            localStorage.setItem(
                "billConfirmedAt",
                new Date().toISOString()
            );


            window.location.href =
                "confirm.html";

        }
    );

}


console.log(
    "BILL.JS READY"
);
