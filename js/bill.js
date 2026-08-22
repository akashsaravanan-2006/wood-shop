// ============================================================
// BILL.JS
// FINAL BILL DISPLAY
//
// IMPORTANT:
// 1. Labour data is READ ONLY.
// 2. Bill number is NOT generated here.
//    It continues to come from your database.
// 3. Customer details are read from saved localStorage data.
// 4. Wood details are read from woodData.
// 5. Same Wood + Same Quality are combined.
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
// READ FIRST AVAILABLE VALUE
// ============================================================

function readFirst(keys) {

    for (const key of keys) {

        const value =
            localStorage.getItem(key);

        if (
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        ) {

            return value;
        }
    }

    return "";
}


// ============================================================
// CUSTOMER DETAILS
// ============================================================

console.log("====================================");
console.log("CUSTOMER DETAILS");
console.log("====================================");


// ------------------------------------------------------------
// Try customerData
// ------------------------------------------------------------

let customerData =
    readJSON("customerData");


// ------------------------------------------------------------
// Try personalData
// ------------------------------------------------------------

if (
    !customerData
) {

    customerData =
        readJSON("personalData");

}


// ------------------------------------------------------------
// Try current customer data
// ------------------------------------------------------------

if (
    !customerData
) {

    customerData =
        readJSON("customerInfo");

}


// ------------------------------------------------------------
// CUSTOMER NAME
// ------------------------------------------------------------

let customerName = "";

if (
    customerData &&
    typeof customerData === "object"
) {

    customerName =
        customerData.customerName ??
        customerData.name ??
        customerData.customer ??
        "";

}


if (
    !customerName
) {

    customerName =
        readFirst([
            "customerName",
            "customer_name",
            "customer"
        ]);

}


// ------------------------------------------------------------
// MOBILE
// ------------------------------------------------------------

let customerMobile = "";

if (
    customerData &&
    typeof customerData === "object"
) {

    customerMobile =
        customerData.mobileNumber ??
        customerData.mobile ??
        customerData.phone ??
        customerData.phoneNumber ??
        "";

}


if (
    !customerMobile
) {

    customerMobile =
        readFirst([
            "mobileNumber",
            "mobile",
            "phone",
            "phoneNumber"
        ]);

}


// ------------------------------------------------------------
// PLACE
// ------------------------------------------------------------

let customerPlace = "";

if (
    customerData &&
    typeof customerData === "object"
) {

    customerPlace =
        customerData.place ??
        customerData.address ??
        customerData.location ??
        "";

}


if (
    !customerPlace
) {

    customerPlace =
        readFirst([
            "place",
            "customerPlace",
            "address",
            "location"
        ]);

}


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
    "Customer Name:",
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


// ------------------------------------------------------------
// CURRENT DATE
// ------------------------------------------------------------

const now =
    new Date();


// DD-MM-YYYY
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


const formattedDate =
    `${day}-${month}-${year}`;


// ------------------------------------------------------------
// TIME
// ------------------------------------------------------------

let hours =
    now.getHours();

const minutes =
    String(
        now.getMinutes()
    ).padStart(2, "0");

const seconds =
    String(
        now.getSeconds()
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


const formattedTime =
    `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;


// ------------------------------------------------------------
// DISPLAY DATE
// ------------------------------------------------------------

if (
    billDateElement
) {

    billDateElement.textContent =
        formattedDate;

}


// ------------------------------------------------------------
// DISPLAY TIME
// ------------------------------------------------------------

if (
    billDayTimeElement
) {

    billDayTimeElement.textContent =
        formattedTime;

}


console.log(
    "Bill Date:",
    formattedDate
);

console.log(
    "Bill Time:",
    formattedTime
);


// ============================================================
// BILL NUMBER
// ============================================================
//
// DO NOT GENERATE OR MODIFY BILL NUMBER HERE.
//
// Your database-generated bill number should be handled
// by your existing database/bill-number code.
// ============================================================

const billNoElement =
    document.getElementById(
        "billNo"
    );

console.log(
    "Bill Number element:",
    billNoElement
);


// ============================================================
// LABOUR DATA
// ============================================================

const labourData =
    readJSON(
        "labourData"
    ) || {};

console.log("====================================");
console.log("LABOUR DATA USED BY BILL");
console.log(labourData);
console.log("====================================");


// ============================================================
// WOOD TOTAL
// ============================================================

let woodTotal =
    num(
        labourData.woodTotal
    );


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

let othersTotal =
    num(
        labourData.othersTotal
    );


// Fallback for older saved data

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
        function (item) {

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
    "OTHERS TOTAL:",
    othersTotal
);


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
            currentBill
                .discount
                .discountAmount
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
// WOOD DATA
// ============================================================

const woodTable =
    document.getElementById(
        "woodTable"
    );


let woodData =
    readJSON(
        "woodData"
    );


console.log("====================================");
console.log("RAW WOOD DATA:");
console.log(woodData);
console.log("====================================");


if (
    woodTable
) {

    woodTable.innerHTML = "";


    let woodItems = [];


    // --------------------------------------------------------
    // SUPPORT DIFFERENT STORAGE STRUCTURES
    // --------------------------------------------------------

    if (
        Array.isArray(
            woodData
        )
    ) {

        woodItems =
            woodData;

    }
    else if (
        woodData &&
        Array.isArray(
            woodData.items
        )
    ) {

        woodItems =
            woodData.items;

    }
    else if (
        woodData &&
        Array.isArray(
            woodData.woodItems
        )
    ) {

        woodItems =
            woodData.woodItems;

    }
    else if (
        woodData &&
        Array.isArray(
            woodData.data
        )
    ) {

        woodItems =
            woodData.data;

    }


    console.log(
        "WOOD ITEMS:",
        woodItems
    );


    // ========================================================
    // GROUP SAME WOOD + SAME QUALITY
    // ========================================================

    const groups = {};


    woodItems.forEach(
        function (item) {

            if (!item) {
                return;
            }


            // ------------------------------------------------
            // WOOD
            // ------------------------------------------------

            const wood =
                item.wood ??
                item.woodName ??
                item.woodType ??
                item.type ??
                item.name ??
                item.species ??
                "-";


            // ------------------------------------------------
            // SIZE
            // ------------------------------------------------

            const size =
                item.size ??
                item.dimension ??
                item.dimensions ??
                item.sizeValue ??
                item.sizeName ??
                "-";


            // ------------------------------------------------
            // LENGTH
            // ------------------------------------------------

            const length =
                num(
                    item.length ??
                    item.lengthValue ??
                    item.lengthFeet ??
                    item.len ??
                    item.feet ??
                    0
                );


            // ------------------------------------------------
            // QUANTITY
            // ------------------------------------------------

            const qty =
                num(
                    item.qty ??
                    item.quantity ??
                    item.count ??
                    item.pieces ??
                    0
                );


            // ------------------------------------------------
            // TOTAL LENGTH
            // ------------------------------------------------

            let totalLength =
                num(
                    item.totalLength ??
                    item.total_length ??
                    item.totalLen ??
                    item.totalLengthValue
                );


            if (
                totalLength === 0 &&
                length > 0 &&
                qty > 0
            ) {

                totalLength =
                    length *
                    qty;

            }


            // ------------------------------------------------
            // CFT
            // ------------------------------------------------

            const cft =
                num(
                    item.cft ??
                    item.CFT ??
                    item.totalCFT ??
                    item.totalCft ??
                    item.cftValue ??
                    item.cftTotal ??
                    0
                );


            // ------------------------------------------------
            // RATE
            // ------------------------------------------------

            const rate =
                num(
                    item.rate ??
                    item.ratePerCft ??
                    item.ratePerCFT ??
                    item.price ??
                    item.rateValue ??
                    0
                );


            // ------------------------------------------------
            // AMOUNT
            // ------------------------------------------------

            const amount =
                num(
                    item.amount ??
                    item.totalAmount ??
                    item.total ??
                    item.amountValue ??
                    0
                );


            // ------------------------------------------------
            // QUALITY
            // ------------------------------------------------

            const quality =
                item.quality ??
                item.grade ??
                item.qualityName ??
                "-";


            // ------------------------------------------------
            // SAME WOOD + SAME QUALITY
            // ------------------------------------------------

            const key =
                String(wood)
                    .trim()
                    .toLowerCase()
                +
                "___"
                +
                String(quality)
                    .trim()
                    .toLowerCase();


            // ------------------------------------------------
            // CREATE GROUP
            // ------------------------------------------------

            if (
                !groups[key]
            ) {

                groups[key] = {

                    wood:
                        wood,

                    size:
                        size,

                    length:
                        length,

                    qty:
                        0,

                    totalLength:
                        0,

                    cft:
                        0,

                    rate:
                        rate,

                    amount:
                        0,

                    quality:
                        quality

                };

            }


            // ------------------------------------------------
            // ADD VALUES
            // ------------------------------------------------

            groups[key].qty +=
                qty;

            groups[key].totalLength +=
                totalLength;

            groups[key].cft +=
                cft;

            groups[key].amount +=
                amount;


            // Keep first valid size

            if (
                groups[key].size === "-" &&
                size !== "-"
            ) {

                groups[key].size =
                    size;

            }


            // Keep first valid length

            if (
                groups[key].length === 0 &&
                length > 0
            ) {

                groups[key].length =
                    length;

            }


            // Keep valid rate

            if (
                groups[key].rate === 0 &&
                rate > 0
            ) {

                groups[key].rate =
                    rate;

            }

        }
    );


    const finalWoodData =
        Object.values(
            groups
        );


    console.log(
        "===================================="
    );

    console.log(
        "FINAL WOOD TABLE DATA:"
    );

    console.table(
        finalWoodData
    );

    console.log(
        "===================================="
    );


    // ========================================================
    // DISPLAY WOOD TABLE
    // ========================================================

    if (
        finalWoodData.length === 0
    ) {

        woodTable.innerHTML = `

            <tr>

                <td colspan="10">
                    -
                </td>

            </tr>

        `;

    }
    else {

        finalWoodData.forEach(
            function (
                item,
                index
            ) {

                woodTable.innerHTML += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${item.wood}
                        </td>

                        <td>
                            ${item.size}
                        </td>

                        <td>
                            ${item.length}
                        </td>

                        <td>
                            ${item.qty}
                        </td>

                        <td>
                            ${item.totalLength}
                        </td>

                        <td>
                            ${item.cft.toFixed(2)}
                        </td>

                        <td>
                            ${money(item.rate)}
                        </td>

                        <td>
                            ${money(item.amount)}
                        </td>

                        <td>
                            ${item.quality}
                        </td>

                    </tr>

                `;

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


    const cftGroups = {};


    let woodItems = [];


    if (
        Array.isArray(
            woodData
        )
    ) {

        woodItems =
            woodData;

    }
    else if (
        woodData &&
        Array.isArray(
            woodData.items
        )
    ) {

        woodItems =
            woodData.items;

    }
    else if (
        woodData &&
        Array.isArray(
            woodData.woodItems
        )
    ) {

        woodItems =
            woodData.woodItems;

    }
    else if (
        woodData &&
        Array.isArray(
            woodData.data
        )
    ) {

        woodItems =
            woodData.data;

    }


    woodItems.forEach(
        function (item) {

            if (!item) {
                return;
            }


            const wood =
                item.wood ??
                item.woodName ??
                item.woodType ??
                item.name ??
                "Wood";


            const quality =
                item.quality ??
                item.grade ??
                "-";


            const cft =
                num(
                    item.cft ??
                    item.CFT ??
                    item.totalCFT ??
                    item.totalCft ??
                    item.cftValue ??
                    item.cftTotal ??
                    0
                );


            const key =
                String(wood)
                    .trim()
                    .toLowerCase()
                +
                "___"
                +
                String(quality)
                    .trim()
                    .toLowerCase();


            if (
                !cftGroups[key]
            ) {

                cftGroups[key] = {

                    wood:
                        wood,

                    quality:
                        quality,

                    cft:
                        0

                };

            }


            cftGroups[key].cft +=
                cft;

        }
    );


    Object.values(
        cftGroups
    ).forEach(
        function (item) {

            if (
                item.cft <= 0
            ) {

                return;

            }


            cftSummary.innerHTML += `

                <div class="cft-item">

                    <strong>
                        ${item.wood}
                        (${item.quality})
                    </strong>

                    <span>
                        ${item.cft.toFixed(2)}
                        CFT
                    </span>

                </div>

            `;

        }
    );


    if (
        cftSummary.innerHTML === ""
    ) {

        cftSummary.innerHTML = `

            <div class="cft-item">

                <span>
                    -
                </span>

            </div>

        `;

    }

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

    let serial =
        1;


    // Labour

    if (
        labourCharge > 0
    ) {

        chargeTable.innerHTML += `

            <tr>

                <td>
                    ${serial++}
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
                    ${serial++}
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
                num(
                    item.amount
                );


            if (
                amount <= 0
            ) {

                return;

            }


            const name =
                item.reason ??
                item.name ??
                item.title ??
                "Other";


            chargeTable.innerHTML += `

                <tr>

                    <td>
                        ${serial++}
                    </td>

                    <td>
                        ${name}
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
        serial === 1
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

let advanceAmount =
    0;


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


if (
    advanceAmount === 0 &&
    currentBill &&
    currentBill.advance
) {

    advanceAmount =
        num(
            currentBill
                .advance
                .advanceAmount
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


if (
    advanceAmount > grandTotal
) {

    advanceAmount =
        grandTotal;

}


const balanceAmount =
    Math.max(
        0,
        Math.round(
            grandTotal -
            advanceAmount
        )
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
// FINAL CONSOLE
// ============================================================

console.log("====================================");
console.log("FINAL BILL VALUES");
console.log("====================================");

console.log(
    "Customer Name :",
    customerName
);

console.log(
    "Mobile        :",
    customerMobile
);

console.log(
    "Place         :",
    customerPlace
);

console.log(
    "Date          :",
    formattedDate
);

console.log(
    "Time          :",
    formattedTime
);

console.log(
    "Wood Total    :",
    woodTotal
);

console.log(
    "Labour Charge :",
    labourCharge
);

console.log(
    "Other Charge  :",
    otherCharge
);

console.log(
    "Other Items   :",
    otherItems
);

console.log(
    "Others Total  :",
    othersTotal
);

console.log(
    "Subtotal      :",
    subtotal
);

console.log(
    "Discount      :",
    discount
);

console.log(
    "Grand Total   :",
    grandTotal
);

console.log(
    "Advance       :",
    advanceAmount
);

console.log(
    "Balance       :",
    balanceAmount
);

console.log("====================================");


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
        function () {

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


console.log("====================================");
console.log("BILL.JS READY");
console.log("====================================");
