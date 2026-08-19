/* =========================================================
   BILL.JS
   WOOD SHOP BILL
   COMPLETE UPDATED VERSION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       BASIC HELPERS
    ===================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }


    function getNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return 0;
        }

        const cleaned = String(value)
            .replace(/[₹,\s]/g, "")
            .trim();

        const number = parseFloat(cleaned);

        return Number.isFinite(number)
            ? number
            : 0;
    }


    /* ALL MONEY = INTEGER */

    function money(value) {
        return "₹ " + Math.round(getNumber(value));
    }


    function integer(value) {
        return Math.round(getNumber(value));
    }


    function formatNumber(value) {

        const number = getNumber(value);

        if (Number.isInteger(number)) {
            return String(number);
        }

        return String(
            Math.round(number * 100) / 100
        );
    }


    function formatCFT(value) {

        return getNumber(value).toFixed(2);
    }


    function setText(id, value) {

        const element = getElement(id);

        if (element) {
            element.textContent = value;
        }
    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       STORAGE HELPERS
    ===================================================== */

    function getFromStorage(key) {

        let value = null;

        try {
            value = localStorage.getItem(key);
        }
        catch (error) {
            console.warn(
                "localStorage error:",
                error
            );
        }

        if (
            value !== null &&
            value !== "" &&
            value !== "null" &&
            value !== "undefined"
        ) {
            return value;
        }


        try {
            value = sessionStorage.getItem(key);
        }
        catch (error) {
            console.warn(
                "sessionStorage error:",
                error
            );
        }

        if (
            value !== null &&
            value !== "" &&
            value !== "null" &&
            value !== "undefined"
        ) {
            return value;
        }

        return null;
    }


    function getStorageValue(keys) {

        for (const key of keys) {

            const value =
                getFromStorage(key);

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

        const value =
            getStorageValue(keys);

        if (!value) {
            return defaultValue;
        }

        try {

            return JSON.parse(value);

        }
        catch (error) {

            console.warn(
                "Could not parse storage:",
                keys
            );

            return defaultValue;
        }
    }


    /* =====================================================
       FIND ARRAY IN ANY SAVED JSON
       
       This is a fallback if the wood page used
       another localStorage key.
    ===================================================== */

    function findArrayInObject(object) {

        if (!object) {
            return null;
        }


        if (Array.isArray(object)) {
            return object;
        }


        if (typeof object !== "object") {
            return null;
        }


        const possibleKeys = [
            "woods",
            "wood",
            "woodItems",
            "woodData",
            "woodDetails",
            "woodRows",
            "woodList",
            "items",
            "rows",
            "data",
            "charges",
            "otherCharges"
        ];


        for (const key of possibleKeys) {

            if (Array.isArray(object[key])) {
                return object[key];
            }
        }


        return null;
    }


    /* =====================================================
       SEARCH ALL STORAGE FOR WOOD ARRAY
    ===================================================== */

    function findWoodDataFromStorage() {

        const knownKeys = [

            "woodData",
            "woodItems",
            "woodDetails",
            "woodDetailsData",
            "billWoodData",
            "woodRows",
            "woodList",

            "finalBillData",

            "billData",
            "formData",
            "formValues"
        ];


        /* First check known keys */

        for (const key of knownKeys) {

            const raw =
                getFromStorage(key);

            if (!raw) {
                continue;
            }


            try {

                const parsed =
                    JSON.parse(raw);

                const array =
                    findArrayInObject(parsed);

                if (array && array.length) {

                    return array;
                }

            }
            catch (error) {

                /* Not JSON - ignore */
            }
        }


        /* =================================================
           FALLBACK:
           SEARCH EVERY LOCAL STORAGE ITEM
        ================================================= */

        try {

            for (
                let i = 0;
                i < localStorage.length;
                i++
            ) {

                const key =
                    localStorage.key(i);

                if (!key) {
                    continue;
                }


                const raw =
                    localStorage.getItem(key);

                if (!raw) {
                    continue;
                }


                try {

                    const parsed =
                        JSON.parse(raw);

                    const array =
                        findArrayInObject(parsed);

                    if (
                        array &&
                        array.length &&
                        looksLikeWoodArray(array)
                    ) {

                        console.log(
                            "Wood data found in key:",
                            key
                        );

                        return array;
                    }

                }
                catch (error) {

                    /* Ignore non-JSON */
                }
            }

        }
        catch (error) {

            console.warn(
                "Could not search localStorage:",
                error
            );
        }


        return [];
    }


    /* =====================================================
       CHECK WHETHER ARRAY LOOKS LIKE WOOD DATA
    ===================================================== */

    function looksLikeWoodArray(array) {

        if (!Array.isArray(array)) {
            return false;
        }


        if (array.length === 0) {
            return false;
        }


        return array.some(function (item) {

            if (
                !item ||
                typeof item !== "object"
            ) {
                return false;
            }


            return (
                item.wood !== undefined ||
                item.woodName !== undefined ||
                item.Wood !== undefined ||
                item.size !== undefined ||
                item.length !== undefined ||
                item.qty !== undefined ||
                item.quantity !== undefined ||
                item.cft !== undefined ||
                item.rate !== undefined ||
                item.amount !== undefined
            );

        });
    }


    /* =====================================================
       CUSTOMER DATA
    ===================================================== */

    let customerName =
        getStorageValue([
            "customerName",
            "customer_name",
            "customer",
            "name"
        ]) || "---";


    let customerMobile =
        getStorageValue([
            "customerMobile",
            "customer_mobile",
            "mobile",
            "phone",
            "customerPhone"
        ]) || "---";


    let customerPlace =
        getStorageValue([
            "customerPlace",
            "customer_place",
            "place",
            "address",
            "customerAddress"
        ]) || "---";


    /* =====================================================
       FINAL BILL DATA
    ===================================================== */

    const savedFinalBill =
        getJSON(
            ["finalBillData"],
            null
        );


    /*
       If finalBillData exists, prefer its customer data.
    */

    if (
        savedFinalBill &&
        typeof savedFinalBill === "object"
    ) {

        customerName =
            savedFinalBill.customerName ||
            customerName;

        customerMobile =
            savedFinalBill.customerMobile ||
            customerMobile;

        customerPlace =
            savedFinalBill.customerPlace ||
            customerPlace;
    }


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

    let billNumber =
        savedFinalBill?.billNo ||
        getStorageValue([
            "billNo",
            "billNumber",
            "bill_no"
        ]);


    if (!billNumber) {

        billNumber =
            "BILL-0001";

        try {

            localStorage.setItem(
                "billNo",
                billNumber
            );

        }
        catch (error) {

            console.warn(error);
        }
    }


    setText(
        "billNo",
        billNumber
    );


    /* =====================================================
       DATE & TIME
    ===================================================== */

    const now =
        new Date();


    const dateText =
        now.getFullYear() +
        "-" +
        String(
            now.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            now.getDate()
        ).padStart(2, "0");


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
        dayText +
        " | " +
        timeText
    );


    /* =====================================================
       LOAD WOOD DATA
    ===================================================== */

    let woodItems = [];


    /*
       First priority:
       finalBillData.woodItems
    */

    if (
        savedFinalBill &&
        Array.isArray(
            savedFinalBill.woodItems
        )
    ) {

        woodItems =
            savedFinalBill.woodItems;
    }


    /*
       Second priority:
       known storage keys
    */

    if (
        !woodItems.length
    ) {

        woodItems =
            getJSON(
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
    }


    /*
       Third priority:
       search all storage
    */

    if (
        !Array.isArray(woodItems) ||
        woodItems.length === 0
    ) {

        woodItems =
            findWoodDataFromStorage();
    }


    /*
       If object contains array
    */

    if (
        !Array.isArray(woodItems)
    ) {

        const found =
            findArrayInObject(
                woodItems
            );

        woodItems =
            found || [];
    }


    /* =====================================================
       LOAD OTHER CHARGES
    ===================================================== */

    let otherCharges = [];


    if (
        savedFinalBill &&
        Array.isArray(
            savedFinalBill.otherCharges
        )
    ) {

        otherCharges =
            savedFinalBill.otherCharges;
    }


    if (
        !otherCharges.length
    ) {

        otherCharges =
            getJSON(
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
    }


    if (
        !Array.isArray(otherCharges)
    ) {

        const found =
            findArrayInObject(
                otherCharges
            );

        otherCharges =
            found || [];
    }


    /* =====================================================
       NORMALIZE WOOD DATA
    ===================================================== */

    function normalizeWood(item) {

        if (
            !item ||
            typeof item !== "object"
        ) {
            return null;
        }


        const wood =
            item.wood ??
            item.woodName ??
            item.name ??
            item.type ??
            item.Wood ??
            item.woodType ??
            "";


        const size =
            item.size ??
            item.Size ??
            item.dimensions ??
            item.dimension ??
            "";


        const length =
            getNumber(
                item.length ??
                item.Length ??
                item.len ??
                item.l
            );


        const qty =
            getNumber(
                item.qty ??
                item.quantity ??
                item.Qty ??
                item.count
            );


        let totalLength =
            getNumber(
                item.totalLength ??
                item.total_length ??
                item.totalLen ??
                item.total
            );


        /*
           If Total Length was not saved,
           calculate Length × Qty.
        */

        if (
            totalLength === 0 &&
            length !== 0 &&
            qty !== 0
        ) {

            totalLength =
                length * qty;
        }


        let cft =
            getNumber(
                item.cft ??
                item.CFT ??
                item.cftValue ??
                item.cftAmount
            );


        /*
           IMPORTANT:
           Some wood pages may not save CFT.
           
           If width, breadth, length and qty
           are available, calculate CFT.
        */

        if (
            cft === 0
        ) {

            const width =
                getNumber(
                    item.width ??
                    item.breadth ??
                    item.b ??
                    item.w
                );


            const thickness =
                getNumber(
                    item.thickness ??
                    item.height ??
                    item.t ??
                    item.h
                );


            if (
                width > 0 &&
                thickness > 0 &&
                totalLength > 0
            ) {

                /*
                   Standard CFT calculation:
                   Length × Breadth × Thickness × Qty / 144
                */

                cft =
                    (
                        width *
                        thickness *
                        totalLength
                    ) / 144;
            }
        }


        const rate =
            getNumber(
                item.rate ??
                item.Rate ??
                item.price ??
                item.unitRate
            );


        let amount =
            getNumber(
                item.amount ??
                item.Amount ??
                item.totalAmount ??
                item.totalPrice ??
                item.value
            );


        /*
           If amount was not stored,
           calculate CFT × Rate.
        */

        if (
            amount === 0 &&
            cft > 0 &&
            rate > 0
        ) {

            amount =
                cft * rate;
        }


        /*
           QUALITY
        */

        const quality =
            item.quality ??
            item.Quality ??
            item.qualityNo ??
            item.qualityNumber ??
            item.qualityType ??
            item.q ??
            1;


        return {

            wood:
                String(wood).trim(),

            size:
                String(size).trim(),

            length:
                length,

            qty:
                qty,

            totalLength:
                totalLength,

            cft:
                cft,

            rate:
                rate,

            amount:
                amount,

            quality:
                String(
                    quality
                ).trim()
        };
    }


    woodItems =
        woodItems
            .map(normalizeWood)
            .filter(
                item =>
                    item !== null
            );


    /* =====================================================
       WOOD TABLE
    ===================================================== */

    const woodTable =
        getElement("woodTable");


    let woodTotal = 0;


    if (woodTable) {

        woodTable.innerHTML = "";


        if (
            woodItems.length === 0
        ) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td colspan="10">
                    No wood data found
                </td>
            `;


            woodTable.appendChild(row);
        }


        woodItems.forEach(
            function (item, index) {

                woodTotal +=
                    getNumber(
                        item.amount
                    );


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.wood
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.size
                        )}
                    </td>

                    <td>
                        ${formatNumber(
                            item.length
                        )}
                    </td>

                    <td>
                        ${formatNumber(
                            item.qty
                        )}
                    </td>

                    <td>
                        ${formatNumber(
                            item.totalLength
                        )}
                    </td>

                    <td>
                        ${formatCFT(
                            item.cft
                        )}
                    </td>

                    <td>
                        ${money(
                            item.rate
                        )}
                    </td>

                    <td>
                        ${money(
                            item.amount
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.quality
                        )}
                    </td>

                `;


                woodTable.appendChild(
                    row
                );
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


        if (
            otherCharges.length === 0
        ) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `;


            chargeTable.appendChild(
                row
            );
        }


        otherCharges.forEach(
            function (charge, index) {

                if (
                    !charge ||
                    typeof charge !== "object"
                ) {
                    return;
                }


                const name =
                    charge.name ??
                    charge.chargeName ??
                    charge.title ??
                    charge.Name ??
                    charge.type ??
                    "";


                const amount =
                    getNumber(
                        charge.amount ??
                        charge.Amount ??
                        charge.value ??
                        charge.price
                    );


                othersTotal +=
                    amount;


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(
                            String(name)
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


    /* =====================================================
       CFT SUMMARY
       
       GROUP:
       
       Teak Quality 1
       Teak Quality 2
       
       separately.
       
       Example:
       
       Teak (1) : 20 CFT
       Teak (2) : 15 CFT
    ===================================================== */

    const cftSummary =
        getElement("cftSummary");


    if (cftSummary) {

        cftSummary.innerHTML = "";


        const groups = {};


        woodItems.forEach(
            function (item) {

                const woodName =
                    item.wood ||
                    "Unknown";


                const quality =
                    item.quality ||
                    "1";


                const key =
                    woodName
                        .trim()
                        .toLowerCase() +
                    "||" +
                    String(
                        quality
                    ).trim();


                if (
                    !groups[key]
                ) {

                    groups[key] = {

                        wood:
                            woodName,

                        quality:
                            quality,

                        cft:
                            0

                    };
                }


                groups[key].cft +=
                    getNumber(
                        item.cft
                    );
            }
        );


        const groupValues =
            Object.values(
                groups
            );


        if (
            groupValues.length === 0
        ) {

            const p =
                document.createElement(
                    "p"
                );


            p.innerHTML = `
                <span>-</span>
                <span>0.00 CFT</span>
            `;


            cftSummary.appendChild(
                p
            );
        }


        groupValues.forEach(
            function (group) {

                const p =
                    document.createElement(
                        "p"
                    );


                p.innerHTML = `

                    <b>
                        ${escapeHTML(
                            group.wood
                        )}
                        (${escapeHTML(
                            group.quality
                        )})
                    </b>

                    <span>
                        : ${formatCFT(
                            group.cft
                        )} CFT
                    </span>

                `;


                cftSummary.appendChild(
                    p
                );
            }
        );
    }


    /* =====================================================
       TOTALS
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
    ===================================================== */

    let discount =
        getNumber(
            savedFinalBill?.discount ??
            getStorageValue([
                "discountAmount",
                "discount",
                "discountValue",
                "billDiscount"
            ])
        );


    if (
        discount < 0
    ) {
        discount = 0;
    }


    if (
        discount > subtotal
    ) {
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
        getElement(
            "discountRow"
        );


    const discountElement =
        getElement(
            "discountAmount"
        );


    if (
        discount > 0
    ) {

        if (discountRow) {

            discountRow.style.display =
                "flex";
        }


        if (discountElement) {

            discountElement.textContent =
                "- " +
                money(discount);
        }

    }

    else {

        if (discountRow) {

            discountRow.style.display =
                "none";
        }
    }


    /* =====================================================
       PAYMENT TYPE
    ===================================================== */

    let paymentType =
        savedFinalBill?.paymentType ||
        getStorageValue([
            "paymentType",
            "selectedPaymentType",
            "payment_type"
        ]);


    let paymentMode =
        savedFinalBill?.paymentMode ||
        getStorageValue([
            "paymentMode",
            "selectedPaymentMode",
            "payment_mode"
        ]);


    if (
        paymentType === "readyCash" ||
        paymentType === "ready_cash"
    ) {

        paymentType =
            "cash";
    }


    if (
        !paymentType
    ) {

        paymentType =
            "cash";
    }


    if (
        !paymentMode
    ) {

        paymentMode =
            "cash";
    }


    /* =====================================================
       PAYMENT MODE DISPLAY
    ===================================================== */

    const paymentModeRow =
        getElement(
            "paymentModeRow"
        );


    const paymentModeElement =
        getElement(
            "paymentMode"
        );


    if (paymentModeElement) {

        let modeText =
            String(
                paymentMode
            ).toUpperCase();


        if (
            modeText === "UPI"
        ) {

            modeText =
                "UPI";
        }

        else {

            modeText =
                "CASH";
        }


        paymentModeElement.textContent =
            modeText;
    }


    if (paymentModeRow) {

        paymentModeRow.style.display =
            "flex";
    }


    /* =====================================================
       ADVANCE AMOUNT
    ===================================================== */

    let advanceAmount =
        getNumber(
            savedFinalBill?.advanceAmount ??
            getStorageValue([
                "advanceAmount",
                "advance",
                "advanceValue",
                "paidAmount",
                "billAdvanceAmount"
            ])
        );


    /*
       READY CASH:
       Full payment = Grand Total.
    */

    if (
        paymentType === "cash"
    ) {

        advanceAmount =
            grandTotal;
    }


    if (
        advanceAmount < 0
    ) {

        advanceAmount = 0;
    }


    if (
        advanceAmount > grandTotal
    ) {

        advanceAmount =
            grandTotal;
    }


    /* =====================================================
       BALANCE
    ===================================================== */

    const balanceAmount =
        Math.max(
            0,
            grandTotal -
            advanceAmount
        );


    /* =====================================================
       ADVANCE ROW
    ===================================================== */

    const advanceRow =
        getElement(
            "advanceRow"
        );


    const advanceElement =
        getElement(
            "advanceAmount"
        );


    /*
       Show Advance only when
       Advance payment was selected.
    */

    if (
        paymentType === "advance"
    ) {

        if (advanceRow) {

            advanceRow.style.display =
                "flex";
        }


        if (advanceElement) {

            advanceElement.textContent =
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


    /* =====================================================
       BALANCE
    ===================================================== */

    setText(
        "balanceAmount",
        money(balanceAmount)
    );


    /* =====================================================
       SAVE FINAL BILL DATA
       
       IMPORTANT:
       Only save after we have loaded the
       actual data.
    ===================================================== */

    const finalBillData = {

        billNo:
            billNumber,

        customerName:
            customerName,

        customerMobile:
            customerMobile,

        customerPlace:
            customerPlace,

        woodItems:
            woodItems,

        otherCharges:
            otherCharges,

        woodTotal:
            integer(
                woodTotal
            ),

        othersTotal:
            integer(
                othersTotal
            ),

        subtotal:
            integer(
                subtotal
            ),

        discount:
            integer(
                discount
            ),

        grandTotal:
            integer(
                grandTotal
            ),

        paymentType:
            paymentType,

        paymentMode:
            paymentMode,

        advanceAmount:
            integer(
                advanceAmount
            ),

        balanceAmount:
            integer(
                balanceAmount
            ),

        date:
            dateText,

        time:
            timeText
    };


    /*
       Do NOT save empty bill data
       over existing data.
    */

    if (
        woodItems.length > 0 ||
        otherCharges.length > 0 ||
        subtotal > 0
    ) {

        try {

            localStorage.setItem(
                "finalBillData",
                JSON.stringify(
                    finalBillData
                )
            );

        }
        catch (error) {

            console.warn(
                "Could not save finalBillData:",
                error
            );
        }
    }


    /* =====================================================
       SAVE INDIVIDUAL TOTALS
    ===================================================== */

    try {

        localStorage.setItem(
            "billGrandTotal",
            String(
                integer(grandTotal)
            )
        );


        localStorage.setItem(
            "billDiscount",
            String(
                integer(discount)
            )
        );


        localStorage.setItem(
            "billAdvanceAmount",
            String(
                integer(advanceAmount)
            )
        );


        localStorage.setItem(
            "billBalanceAmount",
            String(
                integer(balanceAmount)
            )
        );

    }
    catch (error) {

        console.warn(
            "Could not save bill totals:",
            error
        );
    }


    /* =====================================================
       EDIT BILL
    ===================================================== */

    const editBtn =
        getElement(
            "editBtn"
        );


    if (editBtn) {

        editBtn.addEventListener(
            "click",
            function () {

                /*
                   Keep all localStorage data.
                   
                   Wood page can restore
                   previous entered values.
                */

                localStorage.setItem(
                    "editingBill",
                    "true"
                );


                /*
                   IMPORTANT:
                   Change wood.html only if
                   your actual wood page has
                   another filename.
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
        getElement(
            "backBtn"
        );


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
        getElement(
            "printBtn"
        );


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
        getElement(
            "confirmBill"
        );


    if (confirmBill) {

        confirmBill.addEventListener(
            "click",
            function () {

                const confirmed =
                    window.confirm(
                        "Are you sure you want to confirm this bill?"
                    );


                if (!confirmed) {
                    return;
                }


                /*
                   Bill completed.
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
       DEBUG INFORMATION
       
       Open F12 → Console
       to see exactly what was loaded.
    ===================================================== */

    console.log(
        "=============================="
    );

    console.log(
        "WOOD BILL LOADED"
    );

    console.log(
        "Wood Items:",
        woodItems
    );

    console.log(
        "Other Charges:",
        otherCharges
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
        "Payment Type:",
        paymentType
    );

    console.log(
        "Payment Mode:",
        paymentMode
    );

    console.log(
        "Advance:",
        integer(advanceAmount)
    );

    console.log(
        "Balance:",
        integer(balanceAmount)
    );

    console.log(
        "=============================="
    );

});
