/* =========================================================
   BILL.JS
   WOOD SHOP BILL
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       HELPER FUNCTIONS
    ===================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }


    function getNumber(value) {

        if (value === null || value === undefined || value === "") {
            return 0;
        }

        const number = parseFloat(
            String(value).replace(/[₹,\s]/g, "")
        );

        return Number.isFinite(number) ? number : 0;
    }


    /* ALL MONEY VALUES ARE INTEGER */

    function money(value) {
        return "₹ " + Math.round(getNumber(value));
    }


    function integer(value) {
        return Math.round(getNumber(value));
    }


    function getStorageValue(keys) {

        for (const key of keys) {

            const value = localStorage.getItem(key);

            if (
                value !== null &&
                value !== "" &&
                value !== "null" &&
                value !== "undefined"
            ) {
                return value;
            }
        }

        return null;
    }


    function getJSON(keys, defaultValue) {

        const value = getStorageValue(keys);

        if (!value) {
            return defaultValue;
        }

        try {
            return JSON.parse(value);
        }
        catch (error) {

            console.warn(
                "Could not parse localStorage:",
                keys
            );

            return defaultValue;
        }
    }


    function setText(id, value) {

        const element = getElement(id);

        if (element) {
            element.textContent = value;
        }
    }


    /* =====================================================
       CUSTOMER INFORMATION
    ===================================================== */

    const customerName = getStorageValue([
        "customerName",
        "customer_name",
        "name"
    ]) || "---";


    const customerMobile = getStorageValue([
        "customerMobile",
        "customer_mobile",
        "mobile",
        "phone"
    ]) || "---";


    const customerPlace = getStorageValue([
        "customerPlace",
        "customer_place",
        "place",
        "address"
    ]) || "---";


    setText(
        "customerName",
        customerName
    );


    setText(
        "customerMobile",
        customerMobile
    );


    setText(
        "customerPlace",
        customerPlace
    );


    /* =====================================================
       BILL NUMBER
    ===================================================== */

    let billNumber = getStorageValue([
        "billNo",
        "billNumber",
        "bill_no"
    ]);


    if (!billNumber) {

        billNumber = "BILL-0001";

        localStorage.setItem(
            "billNo",
            billNumber
        );
    }


    setText(
        "billNo",
        billNumber
    );


    /* =====================================================
       DATE & TIME
    ===================================================== */

    const now = new Date();


    const dateText =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");


    const timeText =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    const dayText =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long"
            }
        );


    setText(
        "billDate",
        dateText
    );


    setText(
        "billDayTime",
        dayText + " | " + timeText
    );


    /* =====================================================
       LOAD WOOD DATA
    ===================================================== */

    let woodItems = getJSON(
        [
            "woodData",
            "woodItems",
            "woodDetails",
            "woodDetailsData",
            "billWoodData",
            "woodRows",
            "woodList"
        ],
        []
    );


    /*
       Sometimes the stored object itself contains
       the wood array.
    */

    if (!Array.isArray(woodItems)) {

        if (
            woodItems &&
            Array.isArray(woodItems.woods)
        ) {
            woodItems = woodItems.woods;
        }

        else if (
            woodItems &&
            Array.isArray(woodItems.items)
        ) {
            woodItems = woodItems.items;
        }

        else {
            woodItems = [];
        }
    }


    /* =====================================================
       LOAD OTHER CHARGES
    ===================================================== */

    let otherCharges = getJSON(
        [
            "otherCharges",
            "charges",
            "chargeData",
            "otherChargeData",
            "billCharges",
            "chargesData"
        ],
        []
    );


    if (!Array.isArray(otherCharges)) {

        if (
            otherCharges &&
            Array.isArray(otherCharges.charges)
        ) {
            otherCharges = otherCharges.charges;
        }

        else if (
            otherCharges &&
            Array.isArray(otherCharges.items)
        ) {
            otherCharges = otherCharges.items;
        }

        else {
            otherCharges = [];
        }
    }


    /* =====================================================
       NORMALIZE WOOD DATA
    ===================================================== */

    function normalizeWood(item) {

        if (!item || typeof item !== "object") {
            return null;
        }


        const wood =
            item.wood ||
            item.woodName ||
            item.name ||
            item.type ||
            item.Wood ||
            "";


        const size =
            item.size ||
            item.Size ||
            "";


        const length =
            getNumber(
                item.length ??
                item.Length ??
                item.len
            );


        const qty =
            getNumber(
                item.qty ??
                item.quantity ??
                item.Qty
            );


        const totalLengthStored =
            item.totalLength ??
            item.total_length ??
            item.totalLen;


        const totalLength =
            totalLengthStored !== undefined &&
            totalLengthStored !== null &&
            totalLengthStored !== ""
                ? getNumber(totalLengthStored)
                : length * qty;


        const cft =
            getNumber(
                item.cft ??
                item.CFT ??
                item.cftValue
            );


        const rate =
            getNumber(
                item.rate ??
                item.Rate ??
                item.price
            );


        let amount =
            getNumber(
                item.amount ??
                item.Amount ??
                item.totalAmount
            );


        /*
           If amount was not stored,
           calculate from CFT × Rate.
        */

        if (!amount && cft && rate) {
            amount = cft * rate;
        }


        /*
           Quality is important.

           Example:
           Teak + Quality 1 = Teak (1)
           Teak + Quality 2 = Teak (2)
        */

        const quality =
            item.quality ??
            item.Quality ??
            item.qualityNo ??
            item.qualityNumber ??
            item.q ??
            1;


        return {

            wood: String(wood).trim(),

            size: String(size).trim(),

            length: length,

            qty: qty,

            totalLength: totalLength,

            cft: cft,

            rate: rate,

            amount: amount,

            quality: String(quality).trim()

        };
    }


    woodItems = woodItems
        .map(normalizeWood)
        .filter(item => item !== null);


    /* =====================================================
       WOOD TABLE
    ===================================================== */

    const woodTable =
        getElement("woodTable");


    let woodTotal = 0;


    if (woodTable) {

        woodTable.innerHTML = "";


        if (woodItems.length === 0) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td colspan="10">-</td>
            `;

            woodTable.appendChild(row);

        }


        woodItems.forEach(
            function (item, index) {

                woodTotal += item.amount;


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(item.wood)}
                    </td>

                    <td>
                        ${escapeHTML(item.size)}
                    </td>

                    <td>
                        ${formatNumber(item.length)}
                    </td>

                    <td>
                        ${formatNumber(item.qty)}
                    </td>

                    <td>
                        ${formatNumber(item.totalLength)}
                    </td>

                    <td>
                        ${formatCFT(item.cft)}
                    </td>

                    <td>
                        ${money(item.rate)}
                    </td>

                    <td>
                        ${money(item.amount)}
                    </td>

                    <td>
                        ${escapeHTML(item.quality)}
                    </td>

                `;


                woodTable.appendChild(row);

            }
        );
    }


    /* =====================================================
       OTHER CHARGES TABLE
    ===================================================== */

    const chargeTable =
        getElement("chargeTable");


    let othersTotal = 0;


    if (chargeTable) {

        chargeTable.innerHTML = "";


        if (otherCharges.length === 0) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `;

            chargeTable.appendChild(row);
        }


        otherCharges.forEach(
            function (charge, index) {

                const name =
                    charge.name ||
                    charge.chargeName ||
                    charge.title ||
                    charge.Name ||
                    "";


                const amount =
                    getNumber(
                        charge.amount ??
                        charge.Amount ??
                        charge.value
                    );


                othersTotal += amount;


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(String(name))}
                    </td>

                    <td>
                        ${money(amount)}
                    </td>

                `;


                chargeTable.appendChild(row);

            }
        );
    }


    /* =====================================================
       CFT SUMMARY
       
       IMPORTANT:
       GROUP BY WOOD + QUALITY

       Teak quality 1
       Teak quality 2

       will be displayed separately.
    ===================================================== */

    const cftSummary =
        getElement("cftSummary");


    if (cftSummary) {

        cftSummary.innerHTML = "";


        const groups = {};


        woodItems.forEach(
            function (item) {

                const woodName =
                    item.wood || "Unknown";


                const quality =
                    item.quality || "1";


                const key =
                    woodName.toLowerCase() +
                    "||" +
                    quality;


                if (!groups[key]) {

                    groups[key] = {

                        wood: woodName,

                        quality: quality,

                        cft: 0

                    };
                }


                groups[key].cft +=
                    item.cft;

            }
        );


        const groupValues =
            Object.values(groups);


        if (groupValues.length === 0) {

            const p =
                document.createElement("p");

            p.innerHTML = `
                <span>-</span>
                <span>0 CFT</span>
            `;

            cftSummary.appendChild(p);

        }


        groupValues.forEach(
            function (group) {

                const p =
                    document.createElement("p");


                p.innerHTML = `

                    <b>
                        ${escapeHTML(group.wood)}
                        (${escapeHTML(group.quality)})
                    </b>

                    <span>
                        : ${formatCFT(group.cft)} CFT
                    </span>

                `;


                cftSummary.appendChild(p);

            }
        );
    }


    /* =====================================================
       SUBTOTAL
    ===================================================== */

    const subtotal =
        woodTotal +
        othersTotal;


    setText(
        "woodTotal",
        money(woodTotal)
    );


    setText(
        "othersTotal",
        money(othersTotal)
    );


    setText(
        "subtotal",
        money(subtotal)
    );


    /* =====================================================
       DISCOUNT
       
       IMPORTANT:
       Read discount BEFORE using it.
       This prevents:

       "discount is not defined"
    ===================================================== */

    let discount =
        getNumber(
            getStorageValue([
                "discountAmount",
                "discount",
                "discountValue",
                "billDiscount"
            ])
        );


    /*
       Discount cannot be greater than subtotal.
    */

    if (discount < 0) {
        discount = 0;
    }


    if (discount > subtotal) {
        discount = subtotal;
    }


    /* =====================================================
       GRAND TOTAL
    ===================================================== */

    const grandTotal =
        Math.max(
            0,
            subtotal - discount
        );


    setText(
        "grandTotal",
        money(grandTotal)
    );


    /* =====================================================
       DISCOUNT DISPLAY
    ===================================================== */

    const discountRow =
        getElement("discountRow");


    const discountElement =
        getElement("discountAmount");


    if (discount > 0) {

        if (discountRow) {
            discountRow.style.display = "flex";
        }


        if (discountElement) {

            discountElement.textContent =
                "- " + money(discount);

        }

    }

    else {

        if (discountRow) {
            discountRow.style.display = "none";
        }

    }


    /* =====================================================
       PAYMENT INFORMATION
    ===================================================== */

    let paymentType =
        getStorageValue([
            "paymentType",
            "selectedPaymentType",
            "payment_type"
        ]);


    let paymentMode =
        getStorageValue([
            "paymentMode",
            "selectedPaymentMode",
            "payment_mode"
        ]);


    /*
       Normalize values.
    */

    if (
        paymentType === "readyCash" ||
        paymentType === "ready_cash"
    ) {
        paymentType = "cash";
    }


    if (!paymentType) {
        paymentType = "cash";
    }


    if (!paymentMode) {
        paymentMode = "cash";
    }


    /* =====================================================
       ADVANCE AMOUNT
    ===================================================== */

    let advanceAmount =
        getNumber(
            getStorageValue([
                "advanceAmount",
                "advance",
                "advanceValue",
                "paidAmount"
            ])
        );


    /*
       Ready Cash means full payment.
       Therefore advance = Grand Total.
    */

    if (
        paymentType === "cash" ||
        paymentType === "readyCash"
    ) {

        advanceAmount =
            grandTotal;

    }


    /*
       Advance cannot be greater than Grand Total.
    */

    if (advanceAmount < 0) {
        advanceAmount = 0;
    }


    if (advanceAmount > grandTotal) {
        advanceAmount = grandTotal;
    }


    /* =====================================================
       BALANCE
    ===================================================== */

    const balanceAmount =
        Math.max(
            0,
            grandTotal - advanceAmount
        );


    /* =====================================================
       ADVANCE ROW
    ===================================================== */

    const advanceRow =
        getElement("advanceRow");


    const advanceElement =
        getElement("advanceAmount");


    /*
       Show Advance Amount only when
       customer actually selected Advance.

       Ready Cash does not need an Advance row.
    */

    if (
        paymentType === "advance" &&
        advanceAmount > 0
    ) {

        if (advanceRow) {
            advanceRow.style.display = "flex";
        }


        if (advanceElement) {

            advanceElement.textContent =
                money(advanceAmount);

        }

    }

    else {

        if (advanceRow) {
            advanceRow.style.display = "none";
        }

    }


    /* =====================================================
       BALANCE DISPLAY
    ===================================================== */

    setText(
        "balanceAmount",
        money(balanceAmount)
    );


    /* =====================================================
       SAVE FINAL BILL CALCULATION
       
       This allows the next page / bill process
       to use the same values.
    ===================================================== */

    const finalBillData = {

        billNo: billNumber,

        customerName: customerName,

        customerMobile: customerMobile,

        customerPlace: customerPlace,

        woodItems: woodItems,

        otherCharges: otherCharges,

        woodTotal: integer(woodTotal),

        othersTotal: integer(othersTotal),

        subtotal: integer(subtotal),

        discount: integer(discount),

        grandTotal: integer(grandTotal),

        paymentType: paymentType,

        paymentMode: paymentMode,

        advanceAmount: integer(advanceAmount),

        balanceAmount: integer(balanceAmount),

        date: dateText,

        time: timeText

    };


    localStorage.setItem(
        "finalBillData",
        JSON.stringify(finalBillData)
    );


    /* =====================================================
       ALSO SAVE INDIVIDUAL VALUES
    ===================================================== */

    localStorage.setItem(
        "billGrandTotal",
        String(integer(grandTotal))
    );


    localStorage.setItem(
        "billDiscount",
        String(integer(discount))
    );


    localStorage.setItem(
        "billAdvanceAmount",
        String(integer(advanceAmount))
    );


    localStorage.setItem(
        "billBalanceAmount",
        String(integer(balanceAmount))
    );


    /* =====================================================
       EDIT BILL
       
       IMPORTANT:
       We DO NOT clear localStorage.

       So when user returns to wood page,
       previous entered values remain.
    ===================================================== */

    const editBtn =
        getElement("editBtn");


    if (editBtn) {

        editBtn.addEventListener(
            "click",
            function () {

                /*
                   Set editing flag.
                   The wood page can use this to
                   restore the previous values.
                */

                localStorage.setItem(
                    "editingBill",
                    "true"
                );


                /*
                   Change this ONLY if your wood-entry
                   page has another filename.
                */

                window.location.href =
                    "wood.html";

            }
        );

    }


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    const backBtn =
        getElement("backBtn");


    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                history.back();

            }
        );

    }


    /* =====================================================
       PRINT BUTTON
    ===================================================== */

    const printBtn =
        getElement("printBtn");


    if (printBtn) {

        printBtn.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }


    /* =====================================================
       CONFIRM BILL
    ===================================================== */

    const confirmBill =
        getElement("confirmBill");


    if (confirmBill) {

        confirmBill.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Are you sure you want to confirm this bill?"
                    );


                if (!confirmed) {
                    return;
                }


                /*
                   Mark bill as completed.
                */

                localStorage.setItem(
                    "billCompleted",
                    "true"
                );


                localStorage.setItem(
                    "billConfirmedAt",
                    new Date().toISOString()
                );


                /*
                   Stop editing mode.
                */

                localStorage.removeItem(
                    "editingBill"
                );


                alert(
                    "Bill confirmed successfully."
                );

            }
        );

    }


    /* =====================================================
       FINISHED
    ===================================================== */

    console.log(
        "Bill loaded successfully."
    );


    console.log(
        "Wood Total:",
        integer(woodTotal)
    );


    console.log(
        "Others Total:",
        integer(othersTotal)
    );


    console.log(
        "Subtotal:",
        integer(subtotal)
    );


    console.log(
        "Discount:",
        integer(discount)
    );


    console.log(
        "Grand Total:",
        integer(grandTotal)
    );


    console.log(
        "Advance:",
        integer(advanceAmount)
    );


    console.log(
        "Balance:",
        integer(balanceAmount)
    );

});


/* =========================================================
   FORMAT NUMBER
========================================================= */

function formatNumber(value) {

    const number =
        Math.round(
            Number(value) || 0
        );


    return number.toString();
}


/* =========================================================
   FORMAT CFT
========================================================= */

function formatCFT(value) {

    const number =
        Number(value) || 0;


    return number.toFixed(2);
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
