// ======================================
// SAVE DISCOUNT DATA
// ======================================

function saveDiscountData() {

    const discountAmount =
        parseFloat(discountInput.value) || 0;

    const originalGrandTotal =
        parseFloat(originalTotal) || 0;

    const finalTotal =
        originalGrandTotal - discountAmount;

    const discountData = {

        originalGrandTotal:
            originalGrandTotal,

        discountAmount:
            discountAmount,

        finalTotal:
            finalTotal

    };

    localStorage.setItem(
        "discountData",
        JSON.stringify(discountData)
    );

    // IMPORTANT
    localStorage.setItem(
        "finalTotal",
        finalTotal
    );

    console.log(
        "DISCOUNT DATA SAVED:",
        discountData
    );

}
