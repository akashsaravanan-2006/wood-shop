// ============================================================
// CBILL.JS
// FINAL SAVED BILL
// UPDATED VERSION
//
// IMPORTANT:
// Bill No comes from DATABASE.
// Customer details come from DATABASE.
// No new Bill No is generated here.
//
// UPDATED:
// 1. Wood details displayed correctly
// 2. Length -> Qty displayed separately
// 3. Wood Total calculated from wood item amounts
// 4. Other Charges displayed correctly
// 5. Labour Charge displayed
// 6. Additional charges displayed
// 7. Others Total calculated from actual charges
// 8. Subtotal / Grand Total recalculated
// 9. CFT grouped by Wood + Quality
// 10. Print / Clear / Home preserved
// ============================================================

console.clear();

console.log("==========================================");
console.log("              CBILL.JS LOADED");
console.log("==========================================");


// ============================================================
// API
// ============================================================

const API_URL =
    "https://wood-shop-backend.vercel.app/api";


// ============================================================
// ELEMENTS
// ============================================================

const billNoElement =
    document.getElementById("billNo");

const billDateElement =
    document.getElementById("billDate");

const billDayTimeElement =
    document.getElementById("billDayTime");

const customerNameElement =
    document.getElementById("customerName");

const customerMobileElement =
    document.getElementById("customerMobile");

const customerPlaceElement =
    document.getElementById("customerPlace");

const woodTable =
    document.getElementById("woodTable");

const chargeTable =
    document.getElementById("chargeTable");

const woodTotalElement =
    document.getElementById("woodTotal");

const woodDetailsTotalElement =
    document.getElementById("woodDetailsTotal");

const othersTotalElement =
    document.getElementById("othersTotal");

const subtotalAmountElement =
    document.getElementById("subtotalAmount");

const subtotalElement =
    document.getElementById("subtotal");

const discountRow =
    document.getElementById("discountRow");

const discountAmountElement =
    document.getElementById("discountAmount");

const grandTotalElement =
    document.getElementById("grandTotal");

const advanceRow =
    document.getElementById("advanceRow");

const advanceAmountElement =
    document.getElementById("advanceAmount");

const balanceAmountElement =
    document.getElementById("balanceAmount");

const cftSummary =
    document.getElementById("cftSummary");

const printBtn =
    document.getElementById("printBtn");

const clearBtn =
    document.getElementById("clearBtn");

const homeBtn =
    document.getElementById("homeBtn");


// ============================================================
// SAVED BILL ID
// ============================================================

let savedBillId =
    localStorage.getItem(
        "savedBillId"
    );

console.log(
    "SAVED BILL ID:",
    savedBillId
);


// ============================================================
// NUMBER HELPER
// ============================================================

function numberValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number =
        parseFloat(
            String(value)
                .replace(
                    /[₹,\s]/g,
                    ""
                )
        );

    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// MONEY
// ============================================================

function money(value) {

    return (
        "₹ " +
        numberValue(value)
            .toFixed(2)
    );

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// SAFE JSON
// ============================================================

function parseJSON(
    value,
    fallback = []
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    if (
        typeof value !== "string"
    ) {
        return value;
    }

    try {

        return JSON.parse(
            value
        );

    }
    catch (error) {

        console.error(
            "JSON ERROR:",
            error
        );

        return fallback;

    }

}


// ============================================================
// LOCAL BILL DATA
// ============================================================

function getLocalBillData() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    "current_bill_data"
                ) || "{}"
            );

        return data || {};

    }
    catch (error) {

        console.error(
            "LOCAL BILL DATA ERROR:",
            error
        );

        return {};

    }

}


const localBillData =
    getLocalBillData();


console.log(
    "LOCAL BILL DATA:",
    localBillData
);


// ============================================================
// LOCAL PERSONAL DATA
// ============================================================

const localPersonal =
    localBillData.personal ||
    {};


// ============================================================
// LOCAL CUSTOMER FALLBACK
// ============================================================

function getLocalCustomer() {

    const name =
        localPersonal.name ||
        localPersonal.customerName ||
        localStorage.getItem(
            "customerName"
        ) ||
        "";

    const mobile =
        localPersonal.mobile ||
        localPersonal.customerMobile ||
        localStorage.getItem(
            "customerMobile"
        ) ||
        "";

    const place =
        localPersonal.place ||
        localPersonal.customerPlace ||
        localStorage.getItem(
            "customerPlace"
        ) ||
        "";

    return {

        name:
            name,

        mobile:
            mobile,

        place:
            place

    };

}


// ============================================================
// DISCOUNT
// ============================================================

function getDiscount(
    bill
) {

    let discount = 0;


    if (
        bill.discount_amount !==
            undefined &&
        bill.discount_amount !==
            null &&
        bill.discount_amount !==
            ""
    ) {

        discount =
            numberValue(
                bill.discount_amount
            );

    }

    else if (
        bill.discount !==
            undefined &&
        bill.discount !==
            null &&
        bill.discount !==
            ""
    ) {

        discount =
            numberValue(
                bill.discount
            );

    }

    else {

        discount =
            numberValue(
                localStorage.getItem(
                    "discountAmount"
                )
            );

    }


    if (
        discount === 0
    ) {

        discount =
            numberValue(
                localStorage.getItem(
                    "discount"
                )
            );

    }


    if (
        discount < 0
    ) {

        discount = 0;

    }


    return discount;

}


// ============================================================
// ADVANCE
// ============================================================

function getAdvanceAmount(
    bill
) {

    let advance = null;


    if (
        bill.advance_amount !==
            undefined &&
        bill.advance_amount !==
            null &&
        bill.advance_amount !==
            ""
    ) {

        advance =
            numberValue(
                bill.advance_amount
            );

    }

    else if (
        bill.advance !==
            undefined &&
        bill.advance !==
            null &&
        bill.advance !==
            ""
    ) {

        advance =
            numberValue(
                bill.advance
            );

    }


    if (
        advance === null ||
        !Number.isFinite(
            advance
        )
    ) {

        advance =
            numberValue(
                localStorage.getItem(
                    "advanceAmount"
                )
            );

    }


    if (
        advance < 0
    ) {

        advance = 0;

    }


    return advance;

}


// ============================================================
// DATE
// ============================================================

function formatDate(
    value
) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(
            value
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return (

        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        )

        +

        "/" +

        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        )

        +

        "/" +

        date.getFullYear()

    );

}


// ============================================================
// TIME
// ============================================================

function formatTime(
    value
) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(
            value
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleTimeString(
        "en-IN",
        {

            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit",

            hour12:
                true

        }
    );

}


// ============================================================
// GET WOOD DATA
// ============================================================

function getWoodData(
    bill
) {

    let woodData =
        bill.wood_data;


    woodData =
        parseJSON(
            woodData,
            []
        );


    if (
        !Array.isArray(
            woodData
        )
    ) {

        woodData =
            bill.woodData;


        woodData =
            parseJSON(
                woodData,
                []
            );

    }


    if (
        !Array.isArray(
            woodData
        )
    ) {

        woodData =
            bill.wood;


        woodData =
            parseJSON(
                woodData,
                []
            );

    }


    if (
        !Array.isArray(
            woodData
        )
    ) {

        woodData = [];

    }


    return woodData;

}


// ============================================================
// GET OTHER CHARGES
// ============================================================

function getOthersData(
    bill
) {

    let othersData =
        [];


    if (
        bill.others_data !==
            undefined
    ) {

        othersData =
            parseJSON(
                bill.others_data,
                []
            );

    }


    if (
        !Array.isArray(
            othersData
        )
    ) {

        othersData =
            parseJSON(
                bill.other_data,
                []
            );

    }


    if (
        !Array.isArray(
            othersData
        )
    ) {

        othersData =
            parseJSON(
                bill.charges,
                []
            );

    }


    if (
        !Array.isArray(
            othersData
        )
    ) {

        othersData =
            parseJSON(
                bill.additional_charges,
                []
            );

    }


    if (
        !Array.isArray(
            othersData
        )
    ) {

        othersData = [];

    }


    return othersData;

}


// ============================================================
// GET LABOUR DATA
// ============================================================

function getLocalLabourData() {

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
        !labourData ||
        typeof labourData !== "object"
    ) {

        labourData = {};

    }


    return labourData;

}


// ============================================================
// GET LABOUR CHARGE
// ============================================================

function getLabourCharge(
    bill,
    labourData
) {

    let value = 0;


    if (
        bill.labour_charge !==
            undefined &&
        bill.labour_charge !==
            null &&
        bill.labour_charge !==
            ""
    ) {

        value =
            numberValue(
                bill.labour_charge
            );

    }


    if (
        value === 0 &&
        bill.labourCharge !==
            undefined
    ) {

        value =
            numberValue(
                bill.labourCharge
            );

    }


    if (
        value === 0 &&
        labourData.labourCharge !==
            undefined
    ) {

        value =
            numberValue(
                labourData.labourCharge
            );

    }


    return value;

}


// ============================================================
// GET OTHER CHARGE
// ============================================================

function getOtherCharge(
    bill,
    labourData
) {

    let value = 0;


    if (
        bill.other_charge !==
            undefined &&
        bill.other_charge !==
            null &&
        bill.other_charge !==
            ""
    ) {

        value =
            numberValue(
                bill.other_charge
            );

    }


    if (
        value === 0 &&
        bill.otherCharge !==
            undefined
    ) {

        value =
            numberValue(
                bill.otherCharge
            );

    }


    if (
        value === 0 &&
        labourData.otherCharge !==
            undefined
    ) {

        value =
            numberValue(
                labourData.otherCharge
            );

    }


    return value;

}


// ============================================================
// GET ADDITIONAL ITEMS
// ============================================================

function getAdditionalItems(
    othersData,
    labourData
) {

    if (
        Array.isArray(
            othersData
        ) &&
        othersData.length > 0
    ) {

        return othersData;

    }


    if (
        Array.isArray(
            labourData.otherItems
        )
    ) {

        return labourData.otherItems;

    }


    if (
        Array.isArray(
            labourData.items
        )
    ) {

        return labourData.items;

    }


    if (
        Array.isArray(
            localBillData.others
        )
    ) {

        return localBillData.others;

    }


    if (
        Array.isArray(
            localBillData.otherCharges
        )
    ) {

        return localBillData.otherCharges;

    }


    return [];

}


// ============================================================
// CALCULATE WOOD TOTAL
// ============================================================
//
// IMPORTANT:
// Do NOT use bill.wood_total.
// Calculate directly from wood item amounts.
// ============================================================

function calculateWoodTotal(
    woodData
) {

    let total = 0;


    if (
        !Array.isArray(
            woodData
        )
    ) {

        return 0;

    }


    woodData.forEach(
        function (item) {

            if (!item) {
                return;
            }


            total +=
                numberValue(
                    item.amount
                );

        }
    );


    return total;

}


// ============================================================
// CALCULATE ADDITIONAL TOTAL
// ============================================================

function calculateAdditionalTotal(
    additionalItems
) {

    let total = 0;


    if (
        !Array.isArray(
            additionalItems
        )
    ) {

        return 0;

    }


    additionalItems.forEach(
        function (item) {

            if (!item) {
                return;
            }


            total +=
                numberValue(
                    item.amount ||
                    item.charge ||
                    item.value
                );

        }
    );


    return total;

}


// ============================================================
// LOAD FINAL BILL
// ============================================================

async function loadFinalBill() {

    console.log(
        "=========================================="
    );

    console.log(
        "STARTING CBILL"
    );

    console.log(
        "=========================================="
    );


    // ========================================================
    // CHECK SAVED BILL ID
    // ========================================================

    if (
        !savedBillId
    ) {

        console.error(
            "savedBillId is missing."
        );


        alert(
            "Saved bill ID is missing.\n\n" +
            "Please open the Final Bill from Confirm Bill."
        );


        return;

    }


    try {

        // ====================================================
        // FETCH DATABASE BILL
        // ====================================================

        const response =
            await fetch(
                `${API_URL}/bill/${savedBillId}`
            );


        console.log(
            "HTTP STATUS:",
            response.status
        );


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        // ====================================================
        // DATABASE RESPONSE
        // ====================================================

        const result =
            await response.json();


        console.log(
            "DATABASE RESPONSE:",
            result
        );


        const bill =
            result.bill ||
            result.data ||
            result;


        if (
            !bill
        ) {

            throw new Error(
                "Bill not found."
            );

        }


        console.log(
            "FINAL BILL OBJECT:",
            bill
        );


        // ====================================================
        // BILL NUMBER
        // ====================================================
        //
        // DATABASE VALUE ONLY.
        // NEVER GENERATE A NEW NUMBER.
        // ====================================================

        const databaseBillNo =
            bill.bill_no ||
            bill.billNo ||
            bill.bill_number ||
            bill.billNumber ||
            "";


        if (
            billNoElement
        ) {

            billNoElement.textContent =
                databaseBillNo ||
                "---";

        }


        if (
            databaseBillNo
        ) {

            localStorage.setItem(
                "savedBillNo",
                databaseBillNo
            );

        }


        // ====================================================
        // CUSTOMER
        // ====================================================

        const localCustomer =
            getLocalCustomer();


        const customerName =
            bill.customer_name ||
            bill.customerName ||
            bill.customer ||
            localCustomer.name ||
            "-";


        const customerMobile =
            bill.customer_mobile ||
            bill.customerMobile ||
            bill.mobile ||
            localCustomer.mobile ||
            "-";


        const customerPlace =
            bill.customer_place ||
            bill.customerPlace ||
            bill.place ||
            localCustomer.place ||
            "-";


        console.log(
            "CUSTOMER:",
            customerName
        );

        console.log(
            "MOBILE:",
            customerMobile
        );

        console.log(
            "PLACE:",
            customerPlace
        );


        if (
            customerNameElement
        ) {

            customerNameElement.textContent =
                customerName;

        }


        if (
            customerMobileElement
        ) {

            customerMobileElement.textContent =
                customerMobile;

        }


        if (
            customerPlaceElement
        ) {

            customerPlaceElement.textContent =
                customerPlace;

        }


        // ====================================================
        // DATE
        // ====================================================

        const billDate =
            bill.bill_date ||
            bill.date ||
            bill.created_at;


        if (
            billDateElement
        ) {

            billDateElement.textContent =
                formatDate(
                    billDate
                );

        }


        // ====================================================
        // TIME
        // ====================================================

        const billTime =
            bill.bill_time ||
            bill.time ||
            bill.created_at;


        if (
            billDayTimeElement
        ) {

            billDayTimeElement.textContent =
                formatTime(
                    billTime
                );

        }


        // ====================================================
        // WOOD DATA
        // ====================================================

        let woodData =
            getWoodData(
                bill
            );


        // ====================================================
        // LOCAL WOOD FALLBACK
        // ====================================================

        if (
            woodData.length === 0
        ) {

            const localWood =
                localBillData.wood ||
                {};


            if (
                Array.isArray(
                    localWood.calculations
                )
            ) {

                woodData =
                    localWood.calculations;

            }


            if (
                woodData.length === 0 &&
                Array.isArray(
                    localBillData.woodCalculations
                )
            ) {

                woodData =
                    localBillData.woodCalculations;

            }


            if (
                woodData.length === 0 &&
                Array.isArray(
                    localBillData.woodData
                )
            ) {

                woodData =
                    localBillData.woodData;

            }

        }


        console.log(
            "WOOD DATA:",
            woodData
        );


        console.log(
            "WOOD COUNT:",
            woodData.length
        );


        // ====================================================
        // LABOUR DATA
        // ====================================================

        const labourData =
            getLocalLabourData();


        // ====================================================
        // OTHER CHARGES DATA
        // ====================================================

        let othersData =
            getOthersData(
                bill
            );


        // ====================================================
        // ADDITIONAL ITEMS
        // ====================================================

        const additionalItems =
            getAdditionalItems(
                othersData,
                labourData
            );


        // ====================================================
        // LABOUR CHARGE
        // ====================================================

        const labourCharge =
            getLabourCharge(
                bill,
                labourData
            );


        // ====================================================
        // OTHER CHARGE
        // ====================================================

        const otherCharge =
            getOtherCharge(
                bill,
                labourData
            );


        // ====================================================
        // CALCULATE WOOD TOTAL
        // ====================================================

        const woodTotal =
            calculateWoodTotal(
                woodData
            );


        console.log(
            "CALCULATED WOOD TOTAL:",
            woodTotal
        );


        // ====================================================
        // CALCULATE ADDITIONAL TOTAL
        // ====================================================

        const additionalTotal =
            calculateAdditionalTotal(
                additionalItems
            );


        console.log(
            "ADDITIONAL TOTAL:",
            additionalTotal
        );


        // ====================================================
        // CALCULATE OTHERS TOTAL
        // ====================================================

        let othersTotal =
            labourCharge +
            otherCharge +
            additionalTotal;


        // ====================================================
        // DATABASE TOTAL FALLBACK
        // ====================================================
        //
        // Only use DB others_total when there are no individual
        // charge values available.
        // ====================================================

        if (
            othersTotal === 0
        ) {

            const databaseOthersTotal =
                numberValue(
                    bill.others_total
                );


            if (
                databaseOthersTotal > 0
            ) {

                othersTotal =
                    databaseOthersTotal;

            }

        }


        console.log(
            "CALCULATED OTHERS TOTAL:",
            othersTotal
        );


        // ====================================================
        // SUBTOTAL
        // ====================================================

        const subtotal =
            woodTotal +
            othersTotal;


        // ====================================================
        // DISCOUNT
        // ====================================================

        const discount =
            getDiscount(
                bill
            );


        // ====================================================
        // GRAND TOTAL
        // ====================================================

        let grandTotal =
            subtotal -
            discount;


        if (
            grandTotal < 0
        ) {

            grandTotal = 0;

        }


        // ====================================================
        // ADVANCE
        // ====================================================

        let advanceAmount =
            getAdvanceAmount(
                bill
            );


        if (
            advanceAmount >
            grandTotal
        ) {

            advanceAmount =
                grandTotal;

        }


        // ====================================================
        // BALANCE
        // ====================================================

        let balanceAmount =
            grandTotal -
            advanceAmount;


        if (
            balanceAmount < 0
        ) {

            balanceAmount = 0;

        }


        // ====================================================
        // DISPLAY WOOD
        // ====================================================

        loadWoodData(
            woodData
        );


        // ====================================================
        // DISPLAY OTHER CHARGES
        // ====================================================

        loadOtherCharges(
            bill,
            additionalItems,
            labourCharge,
            otherCharge
        );


        // ====================================================
        // CFT SUMMARY
        // ====================================================

        loadCftSummary(
            woodData
        );


        // ====================================================
        // DISPLAY WOOD TOTAL
        // ====================================================

        if (
            woodTotalElement
        ) {

            woodTotalElement.textContent =
                money(
                    woodTotal
                );

        }


        if (
            woodDetailsTotalElement
        ) {

            woodDetailsTotalElement.textContent =
                money(
                    woodTotal
                );

        }


        // ====================================================
        // DISPLAY OTHERS TOTAL
        // ====================================================

        if (
            othersTotalElement
        ) {

            othersTotalElement.textContent =
                money(
                    othersTotal
                );

        }


        // ====================================================
        // DISPLAY SUBTOTAL
        // ====================================================

        if (
            subtotalAmountElement
        ) {

            subtotalAmountElement.textContent =
                money(
                    subtotal
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


        // ====================================================
        // DISPLAY DISCOUNT
        // ====================================================

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


        // ====================================================
        // DISPLAY GRAND TOTAL
        // ====================================================

        if (
            grandTotalElement
        ) {

            grandTotalElement.textContent =
                money(
                    grandTotal
                );

        }


        // ====================================================
        // DISPLAY ADVANCE
        // ====================================================

        if (
            advanceAmountElement
        ) {

            advanceAmountElement.textContent =
                money(
                    advanceAmount
                );

        }


        if (
            advanceRow
        ) {

            advanceRow.style.display =
                advanceAmount > 0
                    ? "flex"
                    : "none";

        }


        // ====================================================
        // DISPLAY BALANCE
        // ====================================================

        if (
            balanceAmountElement
        ) {

            balanceAmountElement.textContent =
                money(
                    balanceAmount
                );

        }


        // ====================================================
        // SAVE CALCULATED TOTALS
        // ====================================================

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


        // ====================================================
        // LOG
        // ====================================================

        console.log(
            "=========================================="
        );

        console.log(
            "CBILL LOADED SUCCESSFULLY"
        );

        console.log(
            "Bill No:",
            databaseBillNo
        );

        console.log(
            "Customer:",
            customerName
        );

        console.log(
            "Wood Count:",
            woodData.length
        );

        console.log(
            "Wood Total:",
            woodTotal
        );

        console.log(
            "Labour Charge:",
            labourCharge
        );

        console.log(
            "Other Charge:",
            otherCharge
        );

        console.log(
            "Additional Total:",
            additionalTotal
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

        console.log(
            "=========================================="
        );

    }

    catch (
        error
    ) {

        console.error(
            "CBILL ERROR:",
            error
        );


        alert(
            "Unable to load final bill.\n\n" +
            error.message
        );

    }

}


// ============================================================
// LOAD WOOD DATA
// ============================================================
//
// SAME DISPLAY AS BILL.JS
//
// Length column:
//
// 7
// 4
//
// Qty column:
//
// 2
// 2
//
// Each piece gets its own line.
// ============================================================

function loadWoodData(woodData) {

    if (!woodTable) {

        console.error(
            "woodTable not found."
        );

        return;
    }

    woodTable.innerHTML = "";

    if (
        !Array.isArray(woodData) ||
        woodData.length === 0
    ) {

        woodTable.innerHTML = `
            <tr>
                <td colspan="9">
                    No wood data
                </td>
            </tr>
        `;

        return;
    }

    let sno = 1;

    woodData.forEach(function(item) {

        if (!item) {
            return;
        }


        // ====================================================
        // WOOD NAME
        // ====================================================

        let woodName =
            item.woodType ||
            item.wood ||
            item.woodName ||
            "";

        if (woodName === "Other") {

            woodName =
                item.otherWood ||
                "Other";
        }

        if (!woodName) {

            woodName = "-";
        }


        // ====================================================
        // SIZE
        // ====================================================

        const breadth =
            numberValue(
                item.breadth
            );

        const thickness =
            numberValue(
                item.thickness
            );

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
                String(breadth);

        }
        else if (
            thickness > 0
        ) {

            size =
                String(thickness);
        }


        // ====================================================
        // QUALITY
        // ====================================================

        const quality =
            item.quality !== undefined &&
            item.quality !== null &&
            item.quality !== ""
                ? item.quality
                : "-";


        // ====================================================
        // PIECES
        // ====================================================

        const pieces =
            Array.isArray(item.pieces)
                ? item.pieces
                : [];


        // ====================================================
        // LENGTH VALUES
        // ====================================================

        let lengthValues = [];

        pieces.forEach(function(piece) {

            if (!piece) {
                return;
            }

            const length =
                numberValue(
                    piece.length
                );

            const extraLength =
                numberValue(
                    piece.extraLength
                );

            const finalLength =
                length +
                extraLength;

            const qty =
                numberValue(
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

        });


        // ====================================================
        // DIRECT LENGTH FALLBACK
        // ====================================================

        if (
            lengthValues.length === 0 &&
            item.length !== undefined
        ) {

            const directLength =
                numberValue(
                    item.length
                );

            const directQty =
                numberValue(
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


        // ====================================================
        // LENGTH DISPLAY
        // ====================================================

        let lengthText = "-";

        if (
            lengthValues.length > 0
        ) {

            lengthText =
                lengthValues
                    .map(function(value) {

                        return `
                            <div
                                class="wood-length-item"
                            >

                                <span>
                                    ${escapeHTML(
                                        value.length
                                    )}
                                </span>

                            </div>
                        `;

                    })
                    .join("");
        }


        // ====================================================
        // QTY DISPLAY
        // ====================================================

        let qtyText = "-";

        if (
            lengthValues.length > 0
        ) {

            qtyText =
                lengthValues
                    .map(function(value) {

                        return `
                            <div
                                class="wood-qty-item"
                            >

                                <span>
                                    ${escapeHTML(
                                        value.qty
                                    )}
                                </span>

                            </div>
                        `;

                    })
                    .join("");
        }


        // ====================================================
        // TOTAL QTY
        // ====================================================

        let totalQty = 0;

        pieces.forEach(function(piece) {

            if (!piece) {
                return;
            }

            totalQty +=
                numberValue(
                    piece.qty
                );

        });


        if (
            totalQty === 0 &&
            item.qty !== undefined
        ) {

            totalQty =
                numberValue(
                    item.qty
                );
        }


        // ====================================================
        // CFT
        // ====================================================

        const cubicFeet =
            numberValue(
                item.cubicFeet
            );


        // ====================================================
        // RATE
        // ====================================================

        const rate =
            numberValue(
                item.rate
            );


        // ====================================================
        // AMOUNT
        // ====================================================

        const amount =
            numberValue(
                item.amount
            );


        // ====================================================
        // CREATE ROW
        // ====================================================

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${sno}
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

            <td
                class="wood-length-cell"
            >
                ${lengthText}
            </td>

            <td
                class="wood-qty-cell"
            >
                ${qtyText}
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


        sno++;

    });

}

            // =================================================
            // DIRECT LENGTH FALLBACK
            // =================================================

            if (
                lengthValues.length === 0 &&
                item.length !==
                    undefined
            ) {

                const directLength =
                    numberValue(
                        item.length
                    );


                const directQty =
                    numberValue(
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


            // =================================================
            // TOTAL QTY
            // =================================================

            let totalQty =
                0;


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
                        numberValue(
                            piece.qty
                        );

                }
            );


            if (
                totalQty === 0 &&
                item.qty !==
                    undefined
            ) {

                totalQty =
                    numberValue(
                        item.qty
                    );

            }


            // =================================================
            // CFT
            // =================================================

            const cubicFeet =
                numberValue(
                    item.cubicFeet
                );


            // =================================================
            // RATE
            // =================================================

            const rate =
                numberValue(
                    item.rate
                );


            // =================================================
            // AMOUNT
            // =================================================

            const amount =
                numberValue(
                    item.amount
                );


            // =================================================
            // NO LENGTH
            // =================================================

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


            // =================================================
            // LENGTH HTML
            // =================================================

            let lengthText =
                "-";


            if (
                lengthValues.length > 0
            ) {

                lengthText =
                    lengthValues
                        .map(
                            function (
                                value
                            ) {

                                return `

                                    <div
                                        class="wood-length-item"
                                    >

                                        <span>
                                            ${escapeHTML(
                                                value.length
                                            )}
                                        </span>

                                        <span>
                                            →
                                        </span>

                                        <span>
                                            ${escapeHTML(
                                                value.qty
                                            )}
                                        </span>

                                    </div>

                                `;

                            }
                        )
                        .join("");

            }


            // =================================================
            // CREATE ROW
            // =================================================

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${sno}
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


                <td
                    class="wood-length-cell"
                >
                    ${lengthText}
                </td>


                <td>
                    ${totalQty}
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


            console.log(
                "WOOD ROW:",
                {

                    sno:
                        sno,

                    wood:
                        woodName,

                    size:
                        size,

                    lengths:
                        lengthValues,

                    qty:
                        totalQty,

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


            sno++;

        }
    );

}


// ============================================================
// LOAD OTHER CHARGES
// ============================================================
//
// Displays:
//
// 1. Labour Charge
// 2. Other Charge
// 3. Additional Charges
//
// ============================================================

function loadOtherCharges(
    bill,
    additionalItems,
    labourCharge,
    otherCharge
) {

    if (
        !chargeTable
    ) {

        console.error(
            "chargeTable not found."
        );

        return;

    }


    chargeTable.innerHTML =
        "";


    let sno =
        1;


    let hasCharge =
        false;


    // ========================================================
    // LABOUR CHARGE
    // ========================================================

    if (
        labourCharge > 0
    ) {

        hasCharge =
            true;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${sno++}
            </td>


            <td>
                Labour Charge
            </td>


            <td>
                ${money(
                    labourCharge
                )}
            </td>

        `;


        chargeTable.appendChild(
            row
        );

    }


    // ========================================================
    // OTHER CHARGE
    // ========================================================

    if (
        otherCharge > 0
    ) {

        hasCharge =
            true;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${sno++}
            </td>


            <td>
                Other Charge
            </td>


            <td>
                ${money(
                    otherCharge
                )}
            </td>

        `;


        chargeTable.appendChild(
            row
        );

    }


    // ========================================================
    // ADDITIONAL CHARGES
    // ========================================================

    if (
        Array.isArray(
            additionalItems
        )
    ) {

        additionalItems.forEach(
            function (
                item
            ) {

                if (
                    !item
                ) {

                    return;

                }


                const amount =
                    numberValue(
                        item.amount ||
                        item.charge ||
                        item.value
                    );


                if (
                    amount <= 0
                ) {

                    return;

                }


                const name =
                    item.name ||
                    item.reason ||
                    item.title ||
                    item.description ||
                    "Other Charge";


                hasCharge =
                    true;


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${sno++}
                    </td>


                    <td>
                        ${escapeHTML(
                            name
                        )}
                    </td>


                    <td>
                        ${money(
                            amount
                        )}
                    </td>

                `;


                chargeTable.appendChild(
                    row
                );

            }
        );

    }


    // ========================================================
    // NO CHARGES
    // ========================================================

    if (
        !hasCharge
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


    console.log(
        "OTHER CHARGES DISPLAYED:",
        hasCharge
    );

}


// ============================================================
// CFT SUMMARY
// ============================================================
//
// Same Wood + Same Quality
// ========================
//
// Teak (1) = 3.06 CFT
// Teak (2) = 3.65 + 8.00
//
// Result:
//
// Teak (1) = 3.06 CFT
// Teak (2) = 11.65 CFT
//
// ============================================================

function loadCftSummary(
    woodData
) {

    if (
        !cftSummary
    ) {

        console.error(
            "cftSummary not found."
        );

        return;

    }


    cftSummary.innerHTML =
        "";


    if (
        !Array.isArray(
            woodData
        ) ||
        woodData.length === 0
    ) {

        cftSummary.innerHTML =
            `<p>-</p>`;

        return;

    }


    const groups =
        new Map();


    woodData.forEach(
        function (
            item
        ) {

            if (
                !item
            ) {

                return;

            }


            // ==================================================
            // WOOD NAME
            // ==================================================

            let woodName =
                item.woodType ||
                item.wood ||
                item.woodName ||
                "-";


            if (
                woodName ===
                "Other"
            ) {

                woodName =
                    item.otherWood ||
                    "Other";

            }


            // ==================================================
            // QUALITY
            // ==================================================

            const quality =
                item.quality !==
                    undefined &&
                item.quality !==
                    null &&
                item.quality !==
                    ""
                    ? String(
                        item.quality
                    )
                    : "-";


            // ==================================================
            // CFT
            // ==================================================

            const cft =
                numberValue(
                    item.cubicFeet
                );


            // ==================================================
            // GROUP KEY
            // ==================================================

            const key =
                String(
                    woodName
                )
                    .trim()
                    .toLowerCase()
                +
                "|||"
                +
                String(
                    quality
                )
                    .trim()
                    .toLowerCase();


            // ==================================================
            // CREATE GROUP
            // ==================================================

            if (
                !groups.has(
                    key
                )
            ) {

                groups.set(
                    key,
                    {

                        wood:
                            woodName,

                        quality:
                            quality,

                        cft:
                            0

                    }
                );

            }


            // ==================================================
            // ADD CFT
            // ==================================================

            const group =
                groups.get(
                    key
                );


            group.cft +=
                cft;

        }
    );


    // ========================================================
    // DISPLAY GROUPS
    // ========================================================

    let index =
        1;


    groups.forEach(
        function (
            group
        ) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cft-summary-row";


            row.innerHTML = `

                <span
                    class="cft-name"
                >

                    <b>

                        ${index}.
                        ${escapeHTML(
                            group.wood
                        )}

                        (${escapeHTML(
                            group.quality
                        )})

                    </b>

                </span>


                <span
                    class="cft-value"
                >

                    ${group.cft.toFixed(2)}
                    CFT

                </span>

            `;


            cftSummary.appendChild(
                row
            );


            index++;

        }
    );


    console.log(
        "GROUPED CFT:",
        Array.from(
            groups.values()
        )
    );

}


// ============================================================
// PRINT
// ============================================================

if (
    printBtn
) {

    printBtn.addEventListener(
        "click",
        function () {

            console.log(
                "PRINT BILL"
            );


            window.print();

        }
    );

}


// ============================================================
// HOME
// ============================================================

if (
    homeBtn
) {

    homeBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "savedBillId"
            );


            localStorage.removeItem(
                "savedBillNo"
            );


            localStorage.removeItem(
                "savedCustomerId"
            );


            window.location.href =
                "../html/index.html";

        }
    );

}


// ============================================================
// CLEAR
// ============================================================

if (
    clearBtn
) {

    clearBtn.addEventListener(
        "click",
        function () {

            const ok =
                confirm(
                    "Are you sure you want to clear ALL bill data?"
                );


            if (
                !ok
            ) {

                return;

            }


            // ================================================
            // CURRENT BILL
            // ================================================

            localStorage.removeItem(
                "current_bill_data"
            );


            // ================================================
            // SAVED BILL
            // ================================================

            localStorage.removeItem(
                "savedBillId"
            );


            localStorage.removeItem(
                "savedBillNo"
            );


            localStorage.removeItem(
                "savedCustomerId"
            );


            // ================================================
            // WOOD
            // ================================================

            localStorage.removeItem(
                "woodData"
            );


            localStorage.removeItem(
                "wood_page_data"
            );


            localStorage.removeItem(
                "wood"
            );


            localStorage.removeItem(
                "woodDataStorage"
            );


            localStorage.removeItem(
                "woodTotal"
            );


            // ================================================
            // CUSTOMER
            // ================================================

            localStorage.removeItem(
                "customerName"
            );


            localStorage.removeItem(
                "customerMobile"
            );


            localStorage.removeItem(
                "customerPlace"
            );


            // ================================================
            // LABOUR
            // ================================================

            localStorage.removeItem(
                "labour"
            );


            localStorage.removeItem(
                "labourData"
            );


            localStorage.removeItem(
                "labourCharge"
            );


            localStorage.removeItem(
                "otherCharge"
            );


            localStorage.removeItem(
                "othersData"
            );


            localStorage.removeItem(
                "othersTotal"
            );


            // ================================================
            // DISCOUNT
            // ================================================

            localStorage.removeItem(
                "discount"
            );


            localStorage.removeItem(
                "discountAmount"
            );


            localStorage.removeItem(
                "discountApplied"
            );


            // ================================================
            // ADVANCE
            // ================================================

            localStorage.removeItem(
                "advance"
            );


            localStorage.removeItem(
                "advanceAmount"
            );


            localStorage.removeItem(
                "balanceAmount"
            );


            // ================================================
            // TOTALS
            // ================================================

            localStorage.removeItem(
                "grandTotal"
            );


            localStorage.removeItem(
                "finalTotal"
            );


            localStorage.removeItem(
                "subtotal"
            );


            // ================================================
            // BILL STATUS
            // ================================================

            localStorage.removeItem(
                "billConfirmed"
            );


            localStorage.removeItem(
                "billConfirmedAt"
            );


            localStorage.removeItem(
                "editingBill"
            );


            // ================================================
            // SESSION
            // ================================================

            sessionStorage.clear();


            console.log(
                "ALL BILL DATA CLEARED"
            );


            window.location.href =
                "../html/index.html";

        }
    );

}


// ============================================================
// START
// ============================================================

console.log(
    "STARTING CBILL..."
);


loadFinalBill();
