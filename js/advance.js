// ============================================================
// ADVANCE.JS
// ============================================================
// PAYMENT FLAG:
//
// Ready Cash  -> paymentFlag = 1
// Advance     -> paymentFlag = 0
//
// Discount page reads this flag.
//
// 1 = Ready Cash
// 0 = Advance
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("==========================================");
    console.log("ADVANCE.JS STARTED");
    console.log("==========================================");


    // ========================================================
    // HTML ELEMENTS
    // ========================================================

    const grandTotalInput =
        document.getElementById("grandTotal");

    const paymentTypes =
        document.querySelectorAll(
            'input[name="paymentType"]'
        );

    const paymentModes =
        document.querySelectorAll(
            'input[name="paymentMode"]'
        );

    const advanceSection =
        document.getElementById("advanceSection");

    const advanceAmountInput =
        document.getElementById("advanceAmount");

    const balanceAmountInput =
        document.getElementById("balanceAmount");

    const calculateBtn =
        document.getElementById("calculateBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    const backBtn =
        document.getElementById("backBtn");


    // ========================================================
    // NUMBER FUNCTION
    // ========================================================

    function toNumber(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return 0;
        }

        if (typeof value === "number") {

            return Number.isFinite(value)
                ? value
                : 0;

        }

        const cleaned =
            String(value)
                .replace(/₹/g, "")
                .replace(/,/g, "")
                .trim();

        const number =
            Number(cleaned);

        return Number.isFinite(number)
            ? number
            : 0;
    }


    // ========================================================
    // GET ORIGINAL GRAND TOTAL
    // ========================================================

    function getOriginalGrandTotal() {

        let total = 0;


        // Central totals
        if (typeof getTotals === "function") {

            try {

                const totals =
                    getTotals();

                if (
                    totals &&
                    totals.finalTotal !== undefined
                ) {

                    total =
                        toNumber(
                            totals.finalTotal
                        );

                }

            }
            catch (error) {

                console.error(
                    "Error reading totals:",
                    error
                );

            }
        }


        // localStorage finalTotal
        if (total <= 0) {

            total =
                toNumber(
                    localStorage.getItem(
                        "finalTotal"
                    )
                );

        }


        // localStorage grandTotal
        if (total <= 0) {

            total =
                toNumber(
                    localStorage.getItem(
                        "grandTotal"
                    )
                );

        }


        // Wood + labour/others
        if (total <= 0) {

            const wood =
                toNumber(
                    localStorage.getItem(
                        "woodTotal"
                    )
                );

            const others =
                toNumber(
                    localStorage.getItem(
                        "othersTotal"
                    )
                );

            total =
                wood + others;

        }


        return Math.round(
            total * 100
        ) / 100;

    }


    // ========================================================
    // GRAND TOTAL
    // ========================================================

    const grandTotal =
        getOriginalGrandTotal();


    // ========================================================
    // DISPLAY GRAND TOTAL
    // ========================================================

    if (grandTotalInput) {

        grandTotalInput.value =
            "₹ " +
            grandTotal.toFixed(2);

    }


    // ========================================================
    // LOAD OLD PAYMENT DATA
    // ========================================================

    let savedAdvance = {};

    if (
        typeof getPageData === "function"
    ) {

        try {

            savedAdvance =
                getPageData("advance") || {};

        }
        catch (error) {

            console.error(
                "Error loading advance:",
                error
            );

        }

    }


    // ========================================================
    // RESTORE PAYMENT TYPE
    // ========================================================

    if (savedAdvance.paymentType) {

        const savedType =
            document.querySelector(
                'input[name="paymentType"][value="' +
                savedAdvance.paymentType +
                '"]'
            );

        if (savedType) {

            savedType.checked = true;

        }

    }


    // ========================================================
    // RESTORE PAYMENT MODE
    // ========================================================

    if (savedAdvance.paymentMode) {

        const savedMode =
            document.querySelector(
                'input[name="paymentMode"][value="' +
                savedAdvance.paymentMode +
                '"]'
            );

        if (savedMode) {

            savedMode.checked = true;

        }

    }


    // ========================================================
    // RESTORE ADVANCE AMOUNT
    // ========================================================

    if (
        advanceAmountInput &&
        savedAdvance.advanceAmount !== undefined
    ) {

        advanceAmountInput.value =
            savedAdvance.advanceAmount;

    }


    // ========================================================
    // SAVE DATA FUNCTION
    // ========================================================

    function saveAdvanceData() {

        const selectedType =
            document.querySelector(
                'input[name="paymentType"]:checked'
            );

        const selectedMode =
            document.querySelector(
                'input[name="paymentMode"]:checked'
            );


        const paymentType =
            selectedType
                ? selectedType.value
                : "";


        const paymentMode =
            selectedMode
                ? selectedMode.value
                : "";


        let advanceAmount = 0;

        let balanceAmount =
            grandTotal;


        // ====================================================
        // READY CASH
        // ====================================================

        if (paymentType === "cash") {

            advanceAmount =
                grandTotal;

            balanceAmount =
                0;

        }


        // ====================================================
        // ADVANCE
        // ====================================================

        else if (paymentType === "advance") {

            advanceAmount =
                toNumber(
                    advanceAmountInput
                        ? advanceAmountInput.value
                        : 0
                );

            balanceAmount =
                grandTotal -
                advanceAmount;

            if (balanceAmount < 0) {

                balanceAmount = 0;

            }

        }


        // ====================================================
        // ⭐ PAYMENT FLAG
        // ====================================================

        let paymentFlag = 0;

        if (paymentType === "cash") {

            paymentFlag = 1;

        }
        else if (paymentType === "advance") {

            paymentFlag = 0;

        }


        // ====================================================
        // SAVE FLAG
        // ====================================================

        localStorage.setItem(
            "paymentFlag",
            String(paymentFlag)
        );


        // ====================================================
        // SAVE OLD STORAGE
        // ====================================================

        localStorage.setItem(
            "paymentType",
            paymentType
        );

        localStorage.setItem(
            "paymentMode",
            paymentMode
        );

        localStorage.setItem(
            "grandTotal",
            String(grandTotal)
        );

        localStorage.setItem(
            "advanceAmount",
            String(advanceAmount)
        );

        localStorage.setItem(
            "balanceAmount",
            String(balanceAmount)
        );

        localStorage.setItem(
            "discountBaseAmount",
            String(grandTotal)
        );


        // ====================================================
        // CENTRAL STORAGE
        // ====================================================

        const advanceData = {

            paymentType:
                paymentType,

            paymentMode:
                paymentMode,

            paymentFlag:
                paymentFlag,

            grandTotal:
                grandTotal,

            advanceAmount:
                advanceAmount,

            balanceAmount:
                balanceAmount,

            discountBaseAmount:
                grandTotal

        };


        if (
            typeof savePageData === "function"
        ) {

            savePageData(
                "advance",
                advanceData
            );

        }


        // ====================================================
        // DEBUG
        // ====================================================

        console.log(
            "=========================================="
        );

        console.log(
            "PAYMENT TYPE:",
            paymentType
        );

        console.log(
            "PAYMENT FLAG:",
            paymentFlag
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
            "=========================================="
        );


        return advanceData;

    }


    // ========================================================
    // PAYMENT TYPE CHANGE
    // ========================================================

    paymentTypes.forEach(function (radio) {

        radio.addEventListener(
            "change",
            function () {

                // ============================================
                // READY CASH
                // ============================================

                if (this.value === "cash") {

                    console.log(
                        "READY CASH SELECTED"
                    );


                    // ⭐ FLAG = 1
                    localStorage.setItem(
                        "paymentFlag",
                        "1"
                    );


                    if (advanceSection) {

                        advanceSection.style.display =
                            "none";

                    }


                    if (advanceAmountInput) {

                        advanceAmountInput.value =
                            "";

                    }


                    if (balanceAmountInput) {

                        balanceAmountInput.value =
                            "₹ 0.00";

                    }


                    // Save immediately
                    saveAdvanceData();

                }


                // ============================================
                // ADVANCE
                // ============================================

                else if (this.value === "advance") {

                    console.log(
                        "ADVANCE PAYMENT SELECTED"
                    );


                    // ⭐ FLAG = 0
                    localStorage.setItem(
                        "paymentFlag",
                        "0"
                    );


                    if (advanceSection) {

                        advanceSection.style.display =
                            "block";

                    }

                }

            }
        );

    });


    // ========================================================
    // PAYMENT MODE
    // ========================================================

    paymentModes.forEach(function (radio) {

        radio.addEventListener(
            "change",
            function () {

                console.log(
                    "PAYMENT MODE:",
                    this.value
                );

                saveAdvanceData();

            }
        );

    });


    // ========================================================
    // CALCULATE ADVANCE BALANCE
    // ========================================================

    if (calculateBtn) {

        calculateBtn.addEventListener(
            "click",
            function () {

                const selectedType =
                    document.querySelector(
                        'input[name="paymentType"]:checked'
                    );


                if (
                    !selectedType ||
                    selectedType.value !== "advance"
                ) {

                    alert(
                        "Please select Advance payment."
                    );

                    return;

                }


                const advance =
                    toNumber(
                        advanceAmountInput
                            ? advanceAmountInput.value
                            : 0
                    );


                if (advance <= 0) {

                    alert(
                        "Please enter Advance Amount."
                    );

                    if (advanceAmountInput) {

                        advanceAmountInput.focus();

                    }

                    return;

                }


                if (advance > grandTotal) {

                    alert(
                        "Advance cannot be greater than Grand Total."
                    );

                    return;

                }


                const balance =
                    grandTotal -
                    advance;


                if (balanceAmountInput) {

                    balanceAmountInput.value =
                        "₹ " +
                        balance.toFixed(2);

                }


                saveAdvanceData();

            }
        );

    }


    // ========================================================
    // NEXT BUTTON
    // ========================================================

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                const selectedType =
                    document.querySelector(
                        'input[name="paymentType"]:checked'
                    );


                if (!selectedType) {

                    alert(
                        "Please select Payment Type."
                    );

                    return;

                }


                const selectedMode =
                    document.querySelector(
                        'input[name="paymentMode"]:checked'
                    );


                if (!selectedMode) {

                    alert(
                        "Please select Payment Mode."
                    );

                    return;

                }


                // ==================================================
                // ⭐ READY CASH
                // ==================================================

                if (
                    selectedType.value === "cash"
                ) {

                    // FLAG = 1
                    localStorage.setItem(
                        "paymentFlag",
                        "1"
                    );


                    const data = {

                        paymentType:
                            "cash",

                        paymentMode:
                            selectedMode.value,

                        paymentFlag:
                            1,

                        grandTotal:
                            grandTotal,

                        advanceAmount:
                            grandTotal,

                        balanceAmount:
                            0,

                        discountBaseAmount:
                            grandTotal

                    };


                    if (
                        typeof savePageData ===
                        "function"
                    ) {

                        savePageData(
                            "advance",
                            data
                        );

                    }


                    localStorage.setItem(
                        "paymentType",
                        "cash"
                    );

                    localStorage.setItem(
                        "paymentMode",
                        selectedMode.value
                    );

                    localStorage.setItem(
                        "grandTotal",
                        String(grandTotal)
                    );

                    localStorage.setItem(
                        "advanceAmount",
                        String(grandTotal)
                    );

                    localStorage.setItem(
                        "balanceAmount",
                        "0"
                    );

                    localStorage.setItem(
                        "discountBaseAmount",
                        String(grandTotal)
                    );


                    console.log(
                        "READY CASH → FLAG = 1"
                    );

                }


                // ==================================================
                // ⭐ ADVANCE PAYMENT
                // ==================================================

                else if (
                    selectedType.value === "advance"
                ) {

                    const advance =
                        toNumber(
                            advanceAmountInput
                                ? advanceAmountInput.value
                                : 0
                        );


                    if (advance <= 0) {

                        alert(
                            "Please enter Advance Amount."
                        );

                        if (advanceAmountInput) {

                            advanceAmountInput.focus();

                        }

                        return;

                    }


                    if (advance > grandTotal) {

                        alert(
                            "Advance cannot be greater than Grand Total."
                        );

                        return;

                    }


                    const balance =
                        grandTotal -
                        advance;


                    if (balanceAmountInput) {

                        balanceAmountInput.value =
                            "₹ " +
                            balance.toFixed(2);

                    }


                    // ⭐ FLAG = 0
                    localStorage.setItem(
                        "paymentFlag",
                        "0"
                    );


                    const data = {

                        paymentType:
                            "advance",

                        paymentMode:
                            selectedMode.value,

                        paymentFlag:
                            0,

                        grandTotal:
                            grandTotal,

                        advanceAmount:
                            advance,

                        balanceAmount:
                            balance,

                        discountBaseAmount:
                            grandTotal

                    };


                    if (
                        typeof savePageData ===
                        "function"
                    ) {

                        savePageData(
                            "advance",
                            data
                        );

                    }


                    localStorage.setItem(
                        "paymentType",
                        "advance"
                    );

                    localStorage.setItem(
                        "paymentMode",
                        selectedMode.value
                    );

                    localStorage.setItem(
                        "grandTotal",
                        String(grandTotal)
                    );

                    localStorage.setItem(
                        "advanceAmount",
                        String(advance)
                    );

                    localStorage.setItem(
                        "balanceAmount",
                        String(balance)
                    );

                    localStorage.setItem(
                        "discountBaseAmount",
                        String(grandTotal)
                    );


                    console.log(
                        "ADVANCE → FLAG = 0"
                    );

                }


                // ==================================================
                // GO DISCOUNT
                // ==================================================

                console.log(
                    "Going to Discount"
                );

                console.log(
                    "paymentFlag:",
                    localStorage.getItem(
                        "paymentFlag"
                    )
                );


                window.location.href =
                    "discount.html";

            }
        );

    }


    // ========================================================
    // BACK BUTTON
    // ========================================================

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "personal.html";

            }
        );

    }


    // ========================================================
    // INITIAL DISPLAY
    // ========================================================

    const currentType =
        document.querySelector(
            'input[name="paymentType"]:checked'
        );


    if (
        currentType &&
        currentType.value === "advance"
    ) {

        if (advanceSection) {

            advanceSection.style.display =
                "block";

        }

    }
    else {

        if (advanceSection) {

            advanceSection.style.display =
                "none";

        }

    }


    console.log(
        "INITIAL PAYMENT FLAG:",
        localStorage.getItem(
            "paymentFlag"
        )
    );

});
