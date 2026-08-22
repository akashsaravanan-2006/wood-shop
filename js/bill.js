// ============================================================
// BILL.JS
// FINAL DEBUG VERSION
// ============================================================

console.log("==========================================");
console.log("BILL.JS LOADED");
console.log("==========================================");


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

        console.warn(
            "Invalid JSON:",
            key
        );

        return null;

    }

}


// ============================================================
// GET CENTRAL BILL
// ============================================================

let bill = {};

const centralStorage =
    readJSON(
        "current_bill_data"
    );


if (centralStorage) {

    bill =
        centralStorage;

}


console.log(
    "CURRENT BILL DATA:",
    bill
);


// ============================================================
// PRINT ALL LOCAL STORAGE
// ============================================================

console.log(
    "=========================================="
);

console.log(
    "ALL LOCAL STORAGE DATA"
);

console.log(
    "=========================================="
);


for (
    let i = 0;
    i < localStorage.length;
    i++
) {

    const key =
        localStorage.key(i);

    console.log(
        key,
        ":",
        localStorage.getItem(key)
    );

}


console.log(
    "=========================================="
);


// ============================================================
// PERSONAL DATA
// ============================================================

const personal =
    bill.personal || {};


const customerNameValue =
    personal.customerName ||
    personal.name ||
    localStorage.getItem(
        "customerName"
    ) ||
    "-";


const customerMobileValue =
    personal.customerMobile ||
    personal.mobileNumber ||
    personal.mobile ||
    localStorage.getItem(
        "customerMobile"
    ) ||
    "-";


const customerPlaceValue =
    personal.customerPlace ||
    personal.place ||
    localStorage.getItem(
        "customerPlace"
    ) ||
    "-";


document.getElementById(
    "customerName"
).textContent =
    customerNameValue;


document.getElementById(
    "customerMobile"
).textContent =
    customerMobileValue;


document.getElementById(
    "customerPlace"
).textContent =
    customerPlaceValue;


// ============================================================
// WOOD DATA
// ============================================================

let woodData = [];


// Try central storage

if (
    Array.isArray(
        bill.wood
    )
) {

    woodData =
        bill.wood;

}


// Try woodData

if (
    woodData.length === 0
) {

    const oldWood =
        readJSON(
            "woodData"
        );


    if (
        Array.isArray(
            oldWood
        )
    ) {

        woodData =
            oldWood;

    }

}


// Try wood_page_data

if (
    woodData.length === 0
) {

    const oldWoodPage =
        readJSON(
            "wood_page_data"
        );


    if (
        Array.isArray(
            oldWoodPage
        )
    ) {

        woodData =
            oldWoodPage;

    }

}


console.log(
    "WOOD DATA:",
    woodData
);


// ============================================================
// WOOD TOTAL
// ============================================================

let woodTotal = 0;


// First central totals

if (
    bill.totals
) {

    woodTotal =
        num(
            bill.totals.woodTotal
        );

}


// Try wood object

if (
    woodTotal === 0 &&
    bill.wood &&
    !Array.isArray(
        bill.wood
    )
) {

    woodTotal =
        num(
            bill.wood.woodTotal
        );

}


// Try localStorage

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
// LABOUR DATA
// ============================================================

let labour = {};


// Central bill

if (
    bill.labour &&
    typeof bill.labour ===
    "object"
) {

    labour =
        bill.labour;

}


// Try old labourData

if (
    Object.keys(labour).length === 0
) {

    const oldLabour =
        readJSON(
            "labourData"
        );


    if (
        oldLabour &&
        typeof oldLabour ===
        "object"
    ) {

        labour =
            oldLabour;

    }

}


// Try labour

if (
    Object.keys(labour).length === 0
) {

    const oldLabour2 =
        readJSON(
            "labour"
        );


    if (
        oldLabour2 &&
        typeof oldLabour2 ===
        "object"
    ) {

        labour =
            oldLabour2;

    }

}


console.log(
    "LABOUR DATA FOUND:",
    labour
);


// ============================================================
// LABOUR CHARGE
// ============================================================

let labourCharge =
    num(
        labour.labourCharge
    );


if (
    labourCharge === 0
) {

    labourCharge =
        num(
            localStorage.getItem(
                "labourCharge"
            )
        );

}


console.log(
    "LABOUR CHARGE:",
    labourCharge
);


// ============================================================
// OTHER CHARGE
// ============================================================

let otherCharge =
    num(
        labour.otherCharge
    );


if (
    otherCharge === 0
) {

    otherCharge =
        num(
            localStorage.getItem(
                "otherCharge"
            )
        );

}


console.log(
    "OTHER CHARGE:",
    otherCharge
);


// ============================================================
// OTHER ITEMS
// ============================================================

let otherItems = [];


// Central labour.otherItems

if (
    Array.isArray(
        labour.otherItems
    )
) {

    otherItems =
        labour.otherItems;

}


// Try othersData

if (
    otherItems.length === 0 &&
    Array.isArray(
        labour.othersData
    )
) {

    otherItems =
        labour.othersData;

}


// Try old localStorage

if (
    otherItems.length === 0
) {

    const oldItems =
        readJSON(
            "othersData"
        );


    if (
        Array.isArray(
            oldItems
        )
    ) {

        otherItems =
            oldItems;

    }

}


// Try otherItems

if (
    otherItems.length === 0
) {

    const oldItems2 =
        readJSON(
            "otherItems"
        );


    if (
        Array.isArray(
            oldItems2
        )
    ) {

        otherItems =
            oldItems2;

    }

}


console.log(
    "OTHER ITEMS:",
    otherItems
);


// ============================================================
// ADDITIONAL TOTAL
// ============================================================

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


console.log(
    "ADDITIONAL TOTAL:",
    additionalTotal
);


// ============================================================
// OTHERS TOTAL
// ============================================================
//
// IMPORTANT
//
// Labour + Other Charge + Additional Items
//
// Example:
//
// Labour = 100
// Other = 11
// Transport = 20
//
// Others Total = 131
//
// ============================================================

const othersTotal =
    Math.round(
        labourCharge +
        otherCharge +
        additionalTotal
    );


console.log(
    "=========================================="
);

console.log(
    "OTHERS CALCULATION"
);

console.log(
    "Labour       =",
    labourCharge
);

console.log(
    "Other Charge =",
    otherCharge
);

console.log(
    "Additional   =",
    additionalTotal
);

console.log(
    "Others Total =",
    othersTotal
);

console.log(
    "=========================================="
);


// ============================================================
// OTHER CHARGES TABLE
// ============================================================

const chargeTable =
    document.getElementById(
        "chargeTable"
    );


chargeTable.innerHTML = "";


let chargeNo = 1;


// Labour

if (
    labourCharge > 0
) {

    chargeTable.innerHTML += `

        <tr>

            <td>
                ${chargeNo++}
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


// Other charge

if (
    otherCharge > 0
) {

    chargeTable.innerHTML += `

        <tr>

            <td>
                ${chargeNo++}
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
    function(item) {

        const amount =
            num(
                item.amount
            );


        if (
            amount <= 0
        ) {
            return;
        }


        chargeTable.innerHTML += `

            <tr>

                <td>
                    ${chargeNo++}
                </td>

                <td>
                    ${item.name || "Other"}
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


// No charges

if (
    chargeNo === 1
) {

    chargeTable.innerHTML = `

        <tr>

            <td>-</td>

            <td>-</td>

            <td>-</td>

        </tr>

    `;

}


// ============================================================
// SUBTOTAL
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


if (
    bill.discount
) {

    discount =
        num(
            bill.discount.discountAmount
        );

}


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


// Discount cannot exceed subtotal

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
// GRAND TOTAL
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
// DISPLAY TOTALS
// ============================================================

document.getElementById(
    "woodTotal"
).textContent =
    money(
        woodTotal
    );


document.getElementById(
    "othersTotal"
).textContent =
    money(
        othersTotal
    );


document.getElementById(
    "subtotal"
).textContent =
    money(
        subtotal
    );


document.getElementById(
    "grandTotal"
).textContent =
    money(
        grandTotal
    );


// ============================================================
// DISCOUNT DISPLAY
// ============================================================

const discountRow =
    document.getElementById(
        "discountRow"
    );


if (
    discount > 0
) {

    discountRow.style.display =
        "flex";


    document.getElementById(
        "discountAmount"
    ).textContent =
        "- " +
        money(
            discount
        );

}
else {

    discountRow.style.display =
        "none";

}


// ============================================================
// ADVANCE
// ============================================================

let advanceAmount = 0;


if (
    bill.advance
) {

    advanceAmount =
        num(
            bill.advance.advanceAmount
        );

}


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


// Advance cannot exceed Grand Total

if (
    advanceAmount >
    grandTotal
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
// ADVANCE DISPLAY
// ============================================================

const advanceRow =
    document.getElementById(
        "advanceRow"
    );


if (
    advanceAmount > 0
) {

    advanceRow.style.display =
        "flex";


    document.getElementById(
        "advanceAmount"
    ).textContent =
        money(
            advanceAmount
        );

}
else {

    advanceRow.style.display =
        "none";

}


// ============================================================
// BALANCE DISPLAY
// ============================================================

document.getElementById(
    "balanceAmount"
).textContent =
    money(
        balanceAmount
    );


// ============================================================
// SAVE FINAL CALCULATED VALUES
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
    "=========================================="
);

console.log(
    "FINAL BILL DATA"
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
    additionalTotal
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
    "=========================================="
);


// ============================================================
// BUTTONS
// ============================================================


// EDIT

const editBtn =
    document.getElementById(
        "editBtn"
    );


if (editBtn) {

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


// PRINT

const printBtn =
    document.getElementById(
        "printBtn"
    );


if (printBtn) {

    printBtn.addEventListener(
        "click",
        function() {

            window.print();

        }
    );

}


// BACK

const backBtn =
    document.getElementById(
        "backBtn"
    );


if (backBtn) {

    backBtn.addEventListener(
        "click",
        function() {

            history.back();

        }
    );

}


// CLEAR

const clearBtn =
    document.getElementById(
        "clearBtn"
    );


if (clearBtn) {

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


// CONFIRM

const confirmBill =
    document.getElementById(
        "confirmBill"
    );


if (confirmBill) {

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
