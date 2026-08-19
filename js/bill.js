// =====================================================
// BILL.JS
// FINAL BILL PAGE
// =====================================================


// =====================================================
// HELPER
// =====================================================

function money(value) {

    return "₹ " + Math.round(Number(value) || 0);

}


// =====================================================
// GET LOCAL STORAGE VALUES
// =====================================================

const customerName =
    localStorage.getItem("customerName") || "";

const customerMobile =
    localStorage.getItem("customerMobile") || "";

const customerPlace =
    localStorage.getItem("customerPlace") || "";

const billNo =
    localStorage.getItem("billNo") || "BILL-0001";

const billDate =
    localStorage.getItem("billDate") || "";


// =====================================================
// CUSTOMER DETAILS
// =====================================================

const customerNameElement =
    document.getElementById("customerName");

const customerMobileElement =
    document.getElementById("customerMobile");

const customerPlaceElement =
    document.getElementById("customerPlace");

const billNoElement =
    document.getElementById("billNo");

const billDateElement =
    document.getElementById("billDate");

const billDayTimeElement =
    document.getElementById("billDayTime");


if (customerNameElement) {

    customerNameElement.textContent =
        customerName;

}


if (customerMobileElement) {

    customerMobileElement.textContent =
        customerMobile;

}


if (customerPlaceElement) {

    customerPlaceElement.textContent =
        customerPlace;

}


if (billNoElement) {

    billNoElement.textContent =
        billNo;

}


if (billDateElement) {

    billDateElement.textContent =
        billDate;

}


// =====================================================
// DATE + DAY + TIME
// =====================================================

if (billDayTimeElement) {

    const now = new Date();

    const day =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long"
            }
        );

    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    billDayTimeElement.textContent =
        day + " | " + time;

}


// =====================================================
// WOOD DATA
// =====================================================

let woodData = [];


// Try main storage first
try {

    woodData =
        JSON.parse(
            localStorage.getItem("woodCalculations")
        ) || [];

}
catch (error) {

    woodData = [];

}


// =====================================================
// FALLBACK STORAGE NAMES
// =====================================================

if (!woodData.length) {

    try {

        woodData =
            JSON.parse(
                localStorage.getItem("calculations")
            ) || [];

    }
    catch (error) {

        woodData = [];

    }

}


// =====================================================
// WOOD TABLE
// =====================================================

const woodTable =
    document.getElementById("woodTable");


// =====================================================
// TOTALS
// =====================================================

let woodTotal = 0;

let totalCFT = 0;


// =====================================================
// QUALITY CFT
// =====================================================

// Example:
//
// Teak (1) → Quality 1 CFT
// Teak (2) → Quality 2 CFT
//
// Each wood + quality is kept separately.

let qualitySummary = {};


// =====================================================
// CREATE WOOD ROWS
// =====================================================

if (woodTable) {

    woodTable.innerHTML = "";

}


woodData.forEach(function (item, index) {

    const wood =
        item.woodType ||
        item.wood ||
        "Unknown";

    const breadth =
        Number(
            item.breadth
        ) || 0;

    const thickness =
        Number(
            item.thickness
        ) || 0;

    const rate =
        Number(
            item.rate
        ) || 0;

    const quality =
        item.quality ||
        "1";


    // ---------------------------------------------
    // LENGTH
    // ---------------------------------------------

    let length = 0;

    if (Array.isArray(item.lengths)) {

        item.lengths.forEach(function (row) {

            const l =
                Number(row.length) || 0;

            const extra =
                Number(row.extraLength) || 0;

            const qty =
                Number(row.qty) || 0;

            length +=
                (l + extra) * qty;

        });

    }
    else {

        length =
            Number(item.totalLength) || 0;

    }


    // ---------------------------------------------
    // CFT
    // ---------------------------------------------

    let cft =
        Number(item.cft) || 0;


    if (!cft && breadth && thickness && length) {

        cft =
            (
                breadth *
                thickness *
                length
            ) / 144;

    }


    // ---------------------------------------------
    // AMOUNT
    // ---------------------------------------------

    let amount =
        Number(item.amount) || 0;


    if (!amount && cft && rate) {

        amount =
            cft * rate;

    }


    // ---------------------------------------------
    // INTEGER VALUES
    // ---------------------------------------------

    cft =
        Number(cft.toFixed(2));

    amount =
        Math.round(amount);

    length =
        Number(length.toFixed(2));

    rate =
        Math.round(rate);


    // ---------------------------------------------
    // TOTALS
    // ---------------------------------------------

    totalCFT += cft;

    woodTotal += amount;


    // ---------------------------------------------
    // QUALITY SUMMARY
    // ---------------------------------------------

    const summaryKey =
        wood + " (" + quality + ")";


    if (!qualitySummary[summaryKey]) {

        qualitySummary[summaryKey] = 0;

    }


    qualitySummary[summaryKey] += cft;


    // ---------------------------------------------
    // SIZE
    // ---------------------------------------------

    const size =
        breadth +
        " × " +
        thickness;


    // ---------------------------------------------
    // TABLE ROW
    // ---------------------------------------------

    if (woodTable) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${wood}
            </td>

            <td>
                ${size}
            </td>

            <td>
                ${length}
            </td>

            <td>
                ${item.qty || 1}
            </td>

            <td>
                ${length}
            </td>

            <td>
                ${cft.toFixed(2)}
            </td>

            <td>
                ₹ ${rate}
            </td>

            <td>
                ₹ ${amount}
            </td>

            <td>
                ${quality}
            </td>

        `;

        woodTable.appendChild(row);

    }

});


// =====================================================
// WOOD TOTAL
// =====================================================

const woodTotalElement =
    document.getElementById("woodTotal");


if (woodTotalElement) {

    woodTotalElement.textContent =
        money(woodTotal);

}


// =====================================================
// OTHER CHARGES
// =====================================================

let charges = [];

try {

    charges =
        JSON.parse(
            localStorage.getItem("charges")
        ) || [];

}
catch (error) {

    charges = [];

}


// Some projects may use otherCharges
if (!charges.length) {

    try {

        charges =
            JSON.parse(
                localStorage.getItem("otherCharges")
            ) || [];

    }
    catch (error) {

        charges = [];

    }

}


const chargeTable =
    document.getElementById("chargeTable");


let othersTotal = 0;


if (chargeTable) {

    chargeTable.innerHTML = "";

}


if (charges.length) {

    charges.forEach(function (charge, index) {

        const name =
            charge.name ||
            charge.chargeName ||
            "Charge";

        const amount =
            Math.round(
                Number(
                    charge.amount
                ) || 0
            );


        othersTotal += amount;


        if (chargeTable) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${name}
                </td>

                <td>
                    ₹ ${amount}
                </td>

            `;


            chargeTable.appendChild(row);

        }

    });

}
else {

    if (chargeTable) {

        chargeTable.innerHTML = `

            <tr>

                <td>-</td>

                <td>-</td>

                <td>-</td>

            </tr>

        `;

    }

}


// =====================================================
// OTHERS TOTAL
// =====================================================

const othersTotalElement =
    document.getElementById("othersTotal");


if (othersTotalElement) {

    othersTotalElement.textContent =
        money(othersTotal);

}


// =====================================================
// CFT SUMMARY
// =====================================================

const cftSummary =
    document.getElementById("cftSummary");


if (cftSummary) {

    cftSummary.innerHTML = "";


    Object.keys(qualitySummary).forEach(
        function (key) {

            const cft =
                qualitySummary[key];


            const p =
                document.createElement("p");


            p.innerHTML = `

                <b>
                    ${key}
                </b>

                <span>
                    : ${cft.toFixed(2)} CFT
                </span>

            `;


            cftSummary.appendChild(p);

        }
    );

}


// =====================================================
// SUBTOTAL
// =====================================================

const subtotal =
    Math.round(
        woodTotal +
        othersTotal
    );


// =====================================================
// DISCOUNT
// =====================================================

const discount =
    Math.max(
        0,
        Math.round(
            Number(
                localStorage.getItem("discountAmount")
            ) || 0
        )
    );


// =====================================================
// FINAL GRAND TOTAL
// =====================================================

const finalGrandTotal =
    Math.max(
        0,
        subtotal - discount
    );


// =====================================================
// SAVE FINAL TOTALS
// =====================================================

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
    "discountAmount",
    String(discount)
);

localStorage.setItem(
    "finalGrandTotal",
    String(finalGrandTotal)
);

localStorage.setItem(
    "grandTotal",
    String(finalGrandTotal)
);


// =====================================================
// DISPLAY DISCOUNT
// =====================================================

const discountRow =
    document.getElementById("discountRow");

const discountElement =
    document.getElementById("discountAmount");


if (discount > 0) {

    if (discountRow) {

        discountRow.style.display =
            "flex";

    }

    if (discountElement) {

        discountElement.textContent =
            "- ₹ " +
            Math.round(discount);

    }

}
else {

    if (discountRow) {

        discountRow.style.display =
            "none";

    }

}


// =====================================================
// DISPLAY GRAND TOTAL
// =====================================================

const grandTotalElement =
    document.getElementById("grandTotal");


if (grandTotalElement) {

    grandTotalElement.textContent =
        money(finalGrandTotal);

}


// =====================================================
// ADVANCE AMOUNT
// =====================================================

const paymentType =
    localStorage.getItem("paymentType") ||
    "cash";


let advanceAmount = 0;


// -----------------------------------------------------
// READY CASH
// -----------------------------------------------------

if (paymentType === "cash") {

    advanceAmount =
        finalGrandTotal;

}


// -----------------------------------------------------
// ADVANCE
// -----------------------------------------------------

else {

    advanceAmount =
        Math.max(
            0,
            Math.round(
                Number(
                    localStorage.getItem(
                        "advanceAmount"
                    )
                ) || 0
            )
        );

}


// =====================================================
// BALANCE
// =====================================================

// IMPORTANT:
//
// Balance is calculated from FINAL GRAND TOTAL
// after discount.
//
// Example:
//
// Subtotal = 694
// Discount = 4
// Grand Total = 690
// Advance = 90
//
// Balance = 690 - 90
//         = 600

const balanceAmount =
    Math.max(
        0,
        finalGrandTotal -
        advanceAmount
    );


// =====================================================
// SAVE ADVANCE + BALANCE
// =====================================================

localStorage.setItem(
    "advanceAmount",
    String(advanceAmount)
);

localStorage.setItem(
    "balanceAmount",
    String(balanceAmount)
);


// =====================================================
// DISPLAY ADVANCE
// =====================================================

const advanceElement =
    document.getElementById("advanceAmount");


if (advanceElement) {

    advanceElement.textContent =
        money(advanceAmount);

}


// =====================================================
// DISPLAY BALANCE
// =====================================================

const balanceElement =
    document.getElementById("balanceAmount");


if (balanceElement) {

    balanceElement.textContent =
        money(balanceAmount);

}


// =====================================================
// PAYMENT MODE
// =====================================================

const paymentMode =
    localStorage.getItem("paymentMode") ||
    "cash";


const paymentModeElement =
    document.getElementById("paymentMode");


if (paymentModeElement) {

    paymentModeElement.textContent =
        paymentMode.toUpperCase();

}


// =====================================================
// OPTIONAL PAYMENT MODE ROW
// =====================================================

const paymentModeRow =
    document.getElementById(
        "paymentModeRow"
    );


if (paymentModeRow) {

    paymentModeRow.style.display =
        "flex";

}


// =====================================================
// EDIT BILL
// =====================================================

const editBtn =
    document.getElementById("editBtn");


if (editBtn) {

    editBtn.addEventListener(
        "click",
        function () {

            // Do NOT clear localStorage.
            // Wood values remain available.

            localStorage.setItem(
                "editingBill",
                "true"
            );

            window.location.href =
                "wood.html";

        }
    );

}


// =====================================================
// PRINT BILL
// =====================================================

const printBtn =
    document.getElementById("printBtn");


if (printBtn) {

    printBtn.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}


// =====================================================
// BACK BUTTON
// =====================================================

const backBtn =
    document.getElementById("backBtn");


if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}


// =====================================================
// CONFIRM BILL
// =====================================================

const confirmBill =
    document.getElementById("confirmBill");


if (confirmBill) {

    confirmBill.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Confirm this bill?"
                );


            if (!confirmed) {

                return;

            }


            // -----------------------------------------
            // Increase bill counter
            // -----------------------------------------

            let billCount =
                Number(
                    localStorage.getItem(
                        "billCount"
                    )
                ) || 0;


            billCount++;


            localStorage.setItem(
                "billCount",
                String(billCount)
            );


            // -----------------------------------------
            // Mark bill completed
            // -----------------------------------------

            localStorage.setItem(
                "billConfirmed",
                "true"
            );


            // -----------------------------------------
            // Remove editing state
            // -----------------------------------------

            localStorage.removeItem(
                "editingBill"
            );


            alert(
                "Bill confirmed successfully."
            );


            // -----------------------------------------
            // Go Home
            // -----------------------------------------

            window.location.href =
                "index.html";

        }
    );

}


// =====================================================
// HOME BUTTON
// =====================================================

const homeBtn =
    document.getElementById("homeBtn");


if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Go to Home?"
                );


            if (!confirmed) {

                return;

            }


            window.location.href =
                "index.html";

        }
    );

}


// =====================================================
// DEBUG INFORMATION
// =====================================================

console.log(
    "===================================="
);

console.log(
    "FINAL BILL"
);

console.log(
    "Wood Total :",
    woodTotal
);

console.log(
    "Others Total :",
    othersTotal
);

console.log(
    "Subtotal :",
    subtotal
);

console.log(
    "Discount :",
    discount
);

console.log(
    "Final Grand Total :",
    finalGrandTotal
);

console.log(
    "Payment Type :",
    paymentType
);

console.log(
    "Payment Mode :",
    paymentMode
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
