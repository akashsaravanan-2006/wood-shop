// =========================================
// BILL.JS
// QUOTATION / BILL PREVIEW PAGE
// =========================================


// =========================================
// BILL NUMBER
// =========================================

const billNoElement =
    document.getElementById("billNo");

if (billNoElement) {

    billNoElement.textContent =
        localStorage.getItem("billNo") || "---";

}


// =========================================
// BILL DATE
// =========================================

const billDateElement =
    document.getElementById("billDate");

const billDayTimeElement =
    document.getElementById("billDayTime");

let savedDate =
    localStorage.getItem("billDate");

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


if (!savedDate) {

    const today = new Date();

    savedDate =
        today.getDate().toString().padStart(2, "0")
        + "/" +
        (today.getMonth() + 1).toString().padStart(2, "0")
        + "/" +
        today.getFullYear();

    localStorage.setItem(
        "billDate",
        savedDate
    );

}


if (billDateElement) {

    billDateElement.textContent =
        savedDate;

}


const now = new Date();

if (billDayTimeElement) {

    billDayTimeElement.textContent =
        days[now.getDay()]
        + " | "
        + now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );

}


// =========================================
// CUSTOMER DETAILS
// =========================================

const customerName =
    document.getElementById("customerName");

const customerMobile =
    document.getElementById("customerMobile");

const customerPlace =
    document.getElementById("customerPlace");


if (customerName) {

    customerName.textContent =
        localStorage.getItem("customerName") || "-";

}


if (customerMobile) {

    customerMobile.textContent =
        localStorage.getItem("customerMobile") || "-";

}


if (customerPlace) {

    customerPlace.textContent =
        localStorage.getItem("customerPlace") || "-";

}


// =========================================
// LOAD TOTALS
// =========================================

const woodTotal =
    Number(
        localStorage.getItem("woodTotal")
    ) || 0;


const othersTotal =
    Number(
        localStorage.getItem("othersTotal")
    ) || 0;


// =========================================
// SUBTOTAL
// =========================================

const subtotal =
    woodTotal + othersTotal;


// =========================================
// DISCOUNT
// =========================================

const discount =
    Number(
        localStorage.getItem("discountAmount")
    ) || 0;


// =========================================
// FINAL GRAND TOTAL
// =========================================

let finalGrandTotal =
    Number(
        localStorage.getItem("finalTotal")
    );


/*
    If finalTotal does not exist,
    calculate it here.
*/

if (isNaN(finalGrandTotal)) {

    finalGrandTotal =
        Math.max(
            0,
            subtotal - discount
        );

}


// =========================================
// ADVANCE
// =========================================

const advanceAmount =
    Number(
        localStorage.getItem("advanceAmount")
    ) || 0;


// =========================================
// BALANCE
// =========================================

const balanceAmount =
    Number(
        localStorage.getItem("balanceAmount")
    ) || 0;


// =========================================
// DISPLAY WOOD TOTAL
// =========================================

const woodTotalElement =
    document.getElementById("woodTotal");

if (woodTotalElement) {

    woodTotalElement.textContent =
    "₹ " + Math.round(woodTotal);

}


// =========================================
// DISPLAY OTHERS TOTAL
// =========================================

const othersTotalElement =
    document.getElementById("othersTotal");

if (othersTotalElement) {

    othersTotalElement.textContent =
    "₹ " + Math.round(othersTotal);

}


// =========================================
// DISPLAY SUBTOTAL
// =========================================

const subtotalElement =
    document.getElementById("subtotal");

if (subtotalElement) {

    subtotalElement.textContent =
    "₹ " + Math.round(subtotal);
}


// =========================================
// DISPLAY DISCOUNT
// =========================================

const discountRow =
    document.getElementById("discountRow");

const discountElement =
    document.getElementById("discountAmount");


if (discount > 0) {

    if (discountRow) {

        discountRow.style.display = "flex";

    }

    if (discountElement) {

        discountElement.textContent =
            "- ₹ " + discount.toFixed(2);

    }

} else {

    if (discountRow) {

        discountRow.style.display = "none";

    }

}


// =========================================
// DISPLAY GRAND TOTAL
// =========================================

const grandTotalElement =
    document.getElementById("grandTotal");

if (grandTotalElement) {

    grandTotalElement.textContent =
    "₹ " + Math.round(finalGrandTotal);
}


// =========================================
// DISPLAY ADVANCE
// =========================================

const advanceRow =
    document.getElementById("advanceRow");

const advanceElement =
    document.getElementById("advanceAmount");


const paymentType =
    localStorage.getItem("paymentType") || "cash";


if (
    paymentType === "advance"
    && advanceAmount > 0
) {

    if (advanceRow) {

        advanceRow.style.display = "flex";

    }

    if (advanceElement) {

        advanceElement.textContent =
    "₹ " + Math.round(advanceAmount);

    }

} else {

    if (advanceRow) {

        advanceRow.style.display = "none";

    }

}


// =========================================
// PAYMENT MODE
// =========================================

const paymentMode =
    localStorage.getItem("paymentMode") || "";


const paymentModeRow =
    document.getElementById("paymentModeRow");

const paymentModeElement =
    document.getElementById("paymentMode");


if (paymentMode) {

    if (paymentModeRow) {

        paymentModeRow.style.display = "flex";

    }

    if (paymentModeElement) {

        paymentModeElement.textContent =
            paymentMode.toUpperCase();

    }

}


// =========================================
// DISPLAY BALANCE
// =========================================

const balanceElement =
    document.getElementById("balanceAmount");

if (balanceElement) {

    balanceElement.textContent =
    "₹ " + Math.round(balanceAmount);

}


// =========================================
// LOAD WOOD DATA
// =========================================

let woodData = [];

try {

    woodData =
        JSON.parse(
            localStorage.getItem("woodData")
        ) || [];

}
catch (error) {

    console.error(
        "Unable to read woodData:",
        error
    );

    woodData = [];

}


// =========================================
// WOOD TABLE
// =========================================

const woodTable =
    document.getElementById("woodTable");


let sno = 1;


if (woodTable) {

    woodData.forEach(function (item) {

        /*
            If there are no pieces
        */

        if (
            !item.pieces ||
            item.pieces.length === 0
        ) {

            const row =
                document.createElement("tr");

            const woodName =
                item.woodType === "Other"
                    ? item.otherWood || "-"
                    : item.woodType || "-";


            row.innerHTML = `

                <td>${sno}</td>

                <td>${woodName}</td>

                <td>
                    ${item.breadth || "-"}
                    ×
                    ${item.thickness || "-"}
                </td>

                <td>-</td>

                <td>-</td>

                <td>
                    ${Number(item.totalLength || 0).toFixed(2)}
                </td>

                <td>
                    ${Number(item.cubicFeet || 0).toFixed(2)}
                </td>

                <td>
                    ₹ ${Number(item.rate || 0).toFixed(2)}
                </td>

                <td>
                    ₹ ${Number(item.amount || 0).toFixed(2)}
                </td>

                <td>
                    ${item.quality || "-"}
                </td>

            `;

            woodTable.appendChild(row);

            sno++;

            return;
        }


        // =====================================
        // PIECES
        // =====================================

        item.pieces.forEach(function (piece, index) {

            const row =
                document.createElement("tr");


            const length =
                Number(piece.length) || 0;


            const extraLength =
                Number(piece.extraLength) || 0;


            const lengthText =
                length + extraLength;


            const woodName =
                item.woodType === "Other"
                    ? item.otherWood || "-"
                    : item.woodType || "-";


            // =================================
            // FIRST PIECE
            // =================================

            if (index === 0) {

                row.innerHTML = `

                    <td>${sno}</td>

                    <td>${woodName}</td>

                    <td>
                        ${item.breadth || "-"}
                        ×
                        ${item.thickness || "-"}
                    </td>

                    <td>
                        ${lengthText}
                    </td>

                    <td>
                        ${piece.qty || 0}
                    </td>

                    <td>
                        ${Number(
                            piece.totalLength || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${Number(
                            item.cubicFeet || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ₹ ${Number(
                            item.rate || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ₹ ${Number(
                            item.amount || 0
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${item.quality || "-"}
                    </td>

                `;

            }


            // =================================
            // ADDITIONAL PIECES
            // =================================

            else {

                row.innerHTML = `

                    <td></td>

                    <td></td>

                    <td></td>

                    <td>
                        ${lengthText}
                    </td>

                    <td>
                        ${piece.qty || 0}
                    </td>

                    <td>
                        ${Number(
                            piece.totalLength || 0
                        ).toFixed(2)}
                    </td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td></td>

                `;

            }


            woodTable.appendChild(row);

        });


        sno++;

    });

}


// =========================================
// OTHER CHARGES
// =========================================

const chargeTable =
    document.getElementById("chargeTable");


let chargeSno = 1;

let hasCharge = false;


const labourCharge =
    Number(
        localStorage.getItem("labourCharge")
    ) || 0;


const otherCharge =
    Number(
        localStorage.getItem("otherCharge")
    ) || 0;


let othersData = [];

try {

    othersData =
        JSON.parse(
            localStorage.getItem("othersData")
        ) || [];

}
catch (error) {

    console.error(
        "Unable to read othersData:",
        error
    );

    othersData = [];

}


// =========================================
// LABOUR
// =========================================

if (
    chargeTable &&
    labourCharge > 0
) {

    hasCharge = true;

    const row =
        document.createElement("tr");

    row.innerHTML = `

        <td>${chargeSno++}</td>

        <td>Labour Charge</td>

        <td>
            ₹ ${labourCharge.toFixed(2)}
        </td>

    `;

    chargeTable.appendChild(row);

}


// =========================================
// OTHER CHARGE
// =========================================

if (
    chargeTable &&
    otherCharge > 0
) {

    hasCharge = true;

    const row =
        document.createElement("tr");

    row.innerHTML = `

        <td>${chargeSno++}</td>

        <td>Other Charge</td>

        <td>
            ₹ ${otherCharge.toFixed(2)}
        </td>

    `;

    chargeTable.appendChild(row);

}


// =========================================
// ADDITIONAL CHARGES
// =========================================

if (chargeTable) {

    othersData.forEach(function (item) {

        hasCharge = true;

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${chargeSno++}</td>

            <td>${item.name || "-"}</td>

            <td>
                ₹ ${Number(
                    item.amount || 0
                ).toFixed(2)}
            </td>

        `;

        chargeTable.appendChild(row);

    });

}


// =========================================
// NO CHARGES
// =========================================

if (
    chargeTable &&
    !hasCharge
) {

    const row =
        document.createElement("tr");

    row.innerHTML = `

        <td>-</td>
        <td>-</td>
        <td>-</td>

    `;

    chargeTable.appendChild(row);

}


// =========================================
// CFT SUMMARY
// WOOD + QUALITY
// =========================================

const cftSummary = {};

woodData.forEach(function (item) {

    let woodName =
        item.woodType || "Unknown";


    if (
        woodName === "Other"
    ) {

        woodName =
            item.otherWood || "Other";

    }


    const quality =
        item.quality || "1";


    /*
        IMPORTANT:

        Teak + Quality 1
        Teak + Quality 2

        will be separate.

        Example:

        Teak (1)
        Teak (2)
    */

    const groupName =
        woodName + " (" + quality + ")";


    const cft =
        Number(
            item.cubicFeet || 0
        );


    if (cftSummary[groupName]) {

        cftSummary[groupName] += cft;

    }
    else {

        cftSummary[groupName] = cft;

    }

});


// =========================================
// DISPLAY CFT SUMMARY
// =========================================

const cftDiv =
    document.getElementById("cftSummary");


if (cftDiv) {

    cftDiv.innerHTML = "";


    for (
        const groupName in cftSummary
    ) {

        const p =
            document.createElement("p");


        p.innerHTML = `

            <b>
                ${groupName}
            </b>

            <span>
                :
                ${cftSummary[groupName].toFixed(2)}
                CFT
            </span>

        `;


        cftDiv.appendChild(p);

    }

}


// =========================================
// EDIT BILL
// =========================================

const editBtn =
    document.getElementById("editBtn");


if (editBtn) {

    editBtn.addEventListener(
        "click",
        function () {

            /*
                IMPORTANT:

                Do NOT clear localStorage here.

                All previous wood values remain saved.

                User can edit/add/remove calculations.
            */

            window.location.href =
                "wood.html";

        }
    );

}


// =========================================
// CONFIRM BILL
// =========================================

const confirmBillBtn =
    document.getElementById("confirmBill");


if (confirmBillBtn) {

    confirmBillBtn.addEventListener(
        "click",
        function () {

            /*
                Do NOT clear data here yet.

                confirm.html will handle
                final confirmation and database save.
            */

            window.location.href =
                "../html/confirm.html";

        }
    );

}


// =========================================
// PRINT
// =========================================

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


// =========================================
// BACK
// =========================================

const backBtn =
    document.getElementById("backBtn");


if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            history.back();

        }
    );

}
