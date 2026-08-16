// =========================================
// BILL.JS - COMPLETE CODE
// =========================================


// =========================================
// GET ELEMENTS
// =========================================

const billNoElement =
    document.getElementById("billNo");

const customerIdElement =
    document.getElementById("customerId");

const customerNameElement =
    document.getElementById("customerName");

const customerMobileElement =
    document.getElementById("customerMobile");

const customerPlaceElement =
    document.getElementById("customerPlace");

const billDateElement =
    document.getElementById("billDate");

const billTimeElement =
    document.getElementById("billTime");

const paymentTypeElement =
    document.getElementById("paymentType");

const advanceAmountElement =
    document.getElementById("advanceAmount");

const balanceAmountElement =
    document.getElementById("balanceAmount");

const totalCFTElement =
    document.getElementById("totalCFT");

const woodTotalElement =
    document.getElementById("woodTotal");

const labourChargeElement =
    document.getElementById("labourCharge");

const otherChargeElement =
    document.getElementById("otherCharge");

const othersTotalElement =
    document.getElementById("othersTotal");

const grandTotalElement =
    document.getElementById("grandTotal");

const woodTableElement =
    document.getElementById("woodTable");

const othersTableElement =
    document.getElementById("othersTable");


// =========================================
// SAFE LOCAL STORAGE
// =========================================

function getStorage(
    key,
    defaultValue = ""
) {

    const value =
        localStorage.getItem(key);

    if (
        value === null ||
        value === undefined
    ) {

        return defaultValue;

    }

    return value;

}


// =========================================
// SAFE NUMBER
// =========================================

function getNumber(key) {

    return (
        Number(
            localStorage.getItem(key)
        ) || 0
    );

}


// =========================================
// SAFE JSON
// =========================================

function getJSON(key) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return [];
        }

        const parsed =
            JSON.parse(value);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            `Error reading ${key}:`,
            error
        );

        return [];

    }

}


// =========================================
// BILL NUMBER
// =========================================
//
// IMPORTANT:
// Use server-generated bill number.
//
// confirm.js saves:
//
// savedBillNo
//
// =========================================

const savedBillNo =
    getStorage(
        "savedBillNo",
        ""
    );


const oldBillNo =
    getStorage(
        "billNo",
        ""
    );


const displayBillNo =
    savedBillNo ||
    oldBillNo ||
    "---";


if (billNoElement) {

    billNoElement.textContent =
        displayBillNo;

}


// =========================================
// CUSTOMER ID
// =========================================

const savedCustomerId =
    getStorage(
        "savedCustomerId",
        ""
    );


const oldCustomerId =
    getStorage(
        "customerId",
        ""
    );


const displayCustomerId =
    savedCustomerId ||
    oldCustomerId ||
    "---";


if (customerIdElement) {

    customerIdElement.textContent =
        displayCustomerId;

}


// =========================================
// CUSTOMER DETAILS
// =========================================

if (customerNameElement) {

    customerNameElement.textContent =
        getStorage(
            "customerName",
            "---"
        );

}


if (customerMobileElement) {

    customerMobileElement.textContent =
        getStorage(
            "customerMobile",
            "---"
        );

}


if (customerPlaceElement) {

    customerPlaceElement.textContent =
        getStorage(
            "customerPlace",
            "---"
        );

}


// =========================================
// DATE
// =========================================

if (billDateElement) {

    billDateElement.textContent =
        getStorage(
            "billDate",
            "---"
        );

}


// =========================================
// TIME
// =========================================

if (billTimeElement) {

    billTimeElement.textContent =
        getStorage(
            "billTime",
            "---"
        );

}


// =========================================
// PAYMENT TYPE
// =========================================

if (paymentTypeElement) {

    billTimeElement.textContent =
        getStorage(
            "paymentType",
            "---"
        );

}


// =========================================
// AMOUNTS
// =========================================

const advanceAmount =
    getNumber(
        "advanceAmount"
    );

const balanceAmount =
    getNumber(
        "balanceAmount"
    );

const totalCFT =
    getNumber(
        "totalCFT"
    );

const woodTotal =
    getNumber(
        "woodTotal"
    );

const labourCharge =
    getNumber(
        "labourCharge"
    );

const otherCharge =
    getNumber(
        "otherCharge"
    );

const othersTotal =
    getNumber(
        "othersTotal"
    );


// =========================================
// GRAND TOTAL
// =========================================
//
// IMPORTANT:
// Your confirm.js saves:
//
// grandTotal
//
// NOT:
//
// finalTotal
//
// =========================================

const grandTotal =
    getNumber(
        "grandTotal"
    );


// =========================================
// DISPLAY AMOUNTS
// =========================================

if (advanceAmountElement) {

    advanceAmountElement.textContent =
        advanceAmount.toFixed(2);

}


if (balanceAmountElement) {

    balanceAmountElement.textContent =
        balanceAmount.toFixed(2);

}


if (totalCFTElement) {

    totalCFTElement.textContent =
        totalCFT.toFixed(2);

}


if (woodTotalElement) {

    woodTotalElement.textContent =
        woodTotal.toFixed(2);

}


if (labourChargeElement) {

    labourChargeElement.textContent =
        labourCharge.toFixed(2);

}


if (otherChargeElement) {

    otherChargeElement.textContent =
        otherCharge.toFixed(2);

}


if (othersTotalElement) {

    othersTotalElement.textContent =
        othersTotal.toFixed(2);

}


if (grandTotalElement) {

    grandTotalElement.textContent =
        grandTotal.toFixed(2);

}


// =========================================
// WOOD DATA
// =========================================

const woodData =
    getJSON(
        "woodData"
    );


// =========================================
// OTHER DATA
// =========================================

const othersData =
    getJSON(
        "othersData"
    );


// =========================================
// FORMAT NUMBER
// =========================================

function formatNumber(value) {

    const number =
        Number(value) || 0;

    return number.toFixed(2);

}


// =========================================
// DISPLAY WOOD TABLE
// =========================================

function displayWoodData() {

    if (!woodTableElement) {
        return;
    }


    // Find tbody if table contains one
    const tbody =
        woodTableElement.tagName === "TBODY"
            ? woodTableElement
            : woodTableElement.querySelector(
                "tbody"
            );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (
        !Array.isArray(woodData) ||
        woodData.length === 0
    ) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td colspan="10">
                No wood items
            </td>
        `;


        tbody.appendChild(row);

        return;
    }


    woodData.forEach(
        function (item, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${item.name || item.woodName || ""}
                </td>

                <td>
                    ${item.length || ""}
                </td>

                <td>
                    ${item.width || ""}
                </td>

                <td>
                    ${item.thickness || ""}
                </td>

                <td>
                    ${item.quantity || item.qty || ""}
                </td>

                <td>
                    ${item.cft || item.totalCFT || ""}
                </td>

                <td>
                    ${item.rate || ""}
                </td>

                <td>
                    ${item.amount || item.total || ""}
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// =========================================
// DISPLAY OTHER ITEMS
// =========================================

function displayOthersData() {

    if (!othersTableElement) {
        return;
    }


    const tbody =
        othersTableElement.tagName === "TBODY"
            ? othersTableElement
            : othersTableElement.querySelector(
                "tbody"
            );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (
        !Array.isArray(othersData) ||
        othersData.length === 0
    ) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td colspan="10">
                No other items
            </td>
        `;


        tbody.appendChild(row);

        return;
    }


    othersData.forEach(
        function (item, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${item.name || item.itemName || ""}
                </td>

                <td>
                    ${item.quantity || item.qty || ""}
                </td>

                <td>
                    ${item.rate || ""}
                </td>

                <td>
                    ${item.amount || item.total || ""}
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// =========================================
// PRINT STATUS
// =========================================

const printStatus =
    getStorage(
        "printStatus",
        "Not Printed"
    );


console.log(
    "Print Status:",
    printStatus
);


// =========================================
// INITIALIZE
// =========================================

displayWoodData();

displayOthersData();


// =========================================
// DEBUG
// =========================================

console.log(
    "================================"
);

console.log(
    "BILL PAGE LOADED"
);

console.log(
    "Bill No:",
    displayBillNo
);

console.log(
    "Customer ID:",
    displayCustomerId
);

console.log(
    "Customer Name:",
    getStorage(
        "customerName"
    )
);

console.log(
    "Grand Total:",
    grandTotal
);

console.log(
    "================================"
);
