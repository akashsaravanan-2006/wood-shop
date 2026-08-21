// ============================================================
// PERSONAL.JS
// CUSTOMER INFORMATION
//
// FLOW:
// Personal -> Discount
// Back     -> Labour
// ============================================================

console.log("==========================================");
console.log("PERSONAL.JS LOADED - NEW VERSION");
console.log("VERSION: PERSONAL-DISCOUNT-10000");
console.log("==========================================");


// ============================================================
// WAIT UNTIL PAGE IS READY
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("PERSONAL PAGE INITIALIZED");


    // ========================================================
    // GET HTML ELEMENTS
    // ========================================================

    const customerName =
        document.getElementById("customerName");

    const mobileNumber =
        document.getElementById("mobileNumber");

    const place =
        document.getElementById("place");

    const nextBtn =
        document.getElementById("nextBtn");

    const backBtn =
        document.getElementById("backBtn");


    // ========================================================
    // CHECK ELEMENTS
    // ========================================================

    if (!customerName) {
        console.error("ERROR: customerName element not found");
        return;
    }

    if (!mobileNumber) {
        console.error("ERROR: mobileNumber element not found");
        return;
    }

    if (!place) {
        console.error("ERROR: place element not found");
        return;
    }

    if (!nextBtn) {
        console.error("ERROR: nextBtn element not found");
        return;
    }

    if (!backBtn) {
        console.error("ERROR: backBtn element not found");
        return;
    }


    console.log("All Personal page elements found");


    // ========================================================
    // LOAD SAVED DATA
    // ========================================================

    function loadPersonalData() {

        try {

            customerName.value =
                localStorage.getItem("customerName") || "";

            mobileNumber.value =
                localStorage.getItem("customerMobile") || "";

            place.value =
                localStorage.getItem("customerPlace") || "";


            console.log("PERSONAL DATA LOADED");

            console.log(
                "Name:",
                customerName.value
            );

            console.log(
                "Mobile:",
                mobileNumber.value
            );

            console.log(
                "Place:",
                place.value
            );

        }

        catch (error) {

            console.error(
                "ERROR LOADING PERSONAL DATA:",
                error
            );

        }

    }


    // ========================================================
    // VALIDATE PERSONAL DATA
    // ========================================================

    function validatePersonalData() {

        const name =
            customerName.value.trim();

        const mobile =
            mobileNumber.value.trim();

        const customerPlace =
            place.value.trim();


        // -----------------------------
        // NAME
        // -----------------------------

        if (name === "") {

            alert("Please enter Customer Name");

            customerName.focus();

            return false;

        }


        // -----------------------------
        // MOBILE
        // -----------------------------

        if (mobile === "") {

            alert("Please enter Mobile Number");

            mobileNumber.focus();

            return false;

        }


        if (!/^[0-9]{10}$/.test(mobile)) {

            alert(
                "Please enter a valid 10-digit Mobile Number"
            );

            mobileNumber.focus();

            return false;

        }


        // -----------------------------
        // PLACE
        // -----------------------------

        if (customerPlace === "") {

            alert("Please enter Place");

            place.focus();

            return false;

        }


        return true;

    }


    // ========================================================
    // SAVE PERSONAL DATA
    // ========================================================

    function savePersonalData() {

        const name =
            customerName.value.trim();

        const mobile =
            mobileNumber.value.trim();

        const customerPlace =
            place.value.trim();


        // ====================================================
        // OLD STORAGE
        // Used by bill.js
        // ====================================================

        localStorage.setItem(
            "customerName",
            name
        );

        localStorage.setItem(
            "customerMobile",
            mobile
        );

        localStorage.setItem(
            "customerPlace",
            customerPlace
        );


        // ====================================================
        // CENTRAL STORAGE
        // If storedata.js is available
        // ====================================================

        if (
            typeof window.savePageData === "function"
        ) {

            window.savePageData(
                "personal",
                {
                    name: name,
                    mobile: mobile,
                    place: customerPlace
                }
            );

            console.log(
                "CENTRAL PERSONAL DATA SAVED"
            );

        }


        console.log(
            "PERSONAL DATA SAVED SUCCESSFULLY"
        );

    }


    // ========================================================
    // NEXT BUTTON
    //
    // IMPORTANT:
    //
    // Personal -> Discount
    //
    // NEVER -> Advance
    // ========================================================

    nextBtn.addEventListener("click", function (event) {

        event.preventDefault();

        event.stopPropagation();


        console.log("==========================================");
        console.log("PERSONAL NEXT BUTTON CLICKED");
        console.log("==========================================");


        // ====================================================
        // VALIDATE
        // ====================================================

        if (!validatePersonalData()) {

            console.log(
                "PERSONAL VALIDATION FAILED"
            );

            return;

        }


        // ====================================================
        // SAVE
        // ====================================================

        savePersonalData();


        console.log(
            "PERSONAL DATA SAVED"
        );


        // ====================================================
        // IMPORTANT REDIRECT
        //
        // ONLY DISCOUNT PAGE
        // ====================================================

        console.log(
            "REDIRECT TARGET: discount.html"
        );

        console.log(
            "ADVANCE.HTML WILL NOT BE OPENED FROM PERSONAL.JS"
        );


        // Use replace so old navigation history doesn't
        // interfere with this flow.

        window.location.replace(
            "discount.html"
        );

    });


    // ========================================================
    // BACK BUTTON
    //
    // Personal -> Labour
    // ========================================================

    backBtn.addEventListener("click", function (event) {

        event.preventDefault();

        event.stopPropagation();


        console.log(
            "PERSONAL BACK BUTTON CLICKED"
        );

        console.log(
            "REDIRECT TARGET: labour.html"
        );


        window.location.replace(
            "labour.html"
        );

    });


    // ========================================================
    // LOAD DATA
    // ========================================================

    loadPersonalData();


    console.log("==========================================");
    console.log("PERSONAL PAGE READY");
    console.log("NEXT = discount.html");
    console.log("BACK = labour.html");
    console.log("==========================================");

});
