// ============================================================
// PERSONAL.JS
// Personal Details
//
// FLOW:
// Personal -> Discount
// ============================================================

console.log("======================================");
console.log("PERSONAL.JS LOADED");
console.log("======================================");


// ============================================================
// HTML ELEMENTS
// ============================================================

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


// ============================================================
// CHECK ELEMENTS
// ============================================================

console.log("Customer Name Element:", customerName);
console.log("Mobile Element:", mobileNumber);
console.log("Place Element:", place);
console.log("Next Button:", nextBtn);
console.log("Back Button:", backBtn);


// ============================================================
// VALIDATION
// ============================================================

function validateForm() {

    if (!customerName) {

        console.error(
            "ERROR: customerName element not found"
        );

        return false;
    }


    if (!mobileNumber) {

        console.error(
            "ERROR: mobileNumber element not found"
        );

        return false;
    }


    if (!place) {

        console.error(
            "ERROR: place element not found"
        );

        return false;
    }


    const name =
        customerName.value.trim();

    const mobile =
        mobileNumber.value.trim();

    const customerPlace =
        place.value.trim();


    // ========================================================
    // CUSTOMER NAME
    // ========================================================

    if (name === "") {

        alert(
            "Please enter Customer Name"
        );

        customerName.focus();

        return false;
    }


    // ========================================================
    // MOBILE
    // ========================================================

    if (mobile === "") {

        alert(
            "Please enter Mobile Number"
        );

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


    // ========================================================
    // PLACE
    // ========================================================

    if (customerPlace === "") {

        alert(
            "Please enter Place"
        );

        place.focus();

        return false;
    }


    return true;

}


// ============================================================
// SAVE PERSONAL DATA
// ============================================================

function savePersonalData() {

    const data = {

        name:
            customerName.value.trim(),

        mobile:
            mobileNumber.value.trim(),

        place:
            place.value.trim()

    };


    // ========================================================
    // CENTRAL STORAGE
    // ========================================================

    if (
        typeof savePageData === "function"
    ) {

        savePageData(
            "personal",
            data
        );

    }
    else {

        console.warn(
            "savePageData() not found"
        );

    }


    // ========================================================
    // OLD STORAGE
    // Keep compatibility with existing bill.js
    // ========================================================

    localStorage.setItem(
        "customerName",
        data.name
    );

    localStorage.setItem(
        "customerMobile",
        data.mobile
    );

    localStorage.setItem(
        "customerPlace",
        data.place
    );


    console.log(
        "======================================"
    );

    console.log(
        "PERSONAL DATA SAVED"
    );

    console.log(
        data
    );

    console.log(
        "======================================"
    );

}


// ============================================================
// LOAD SAVED PERSONAL DATA
// ============================================================

function loadPersonalData() {

    let data = null;


    // ========================================================
    // GET FROM CENTRAL STORAGE
    // ========================================================

    if (
        typeof getPageData === "function"
    ) {

        data =
            getPageData("personal");

    }


    // ========================================================
    // FALLBACK TO OLD STORAGE
    // ========================================================

    if (
        !data ||
        Object.keys(data).length === 0
    ) {

        data = {

            name:
                localStorage.getItem(
                    "customerName"
                ) || "",

            mobile:
                localStorage.getItem(
                    "customerMobile"
                ) || "",

            place:
                localStorage.getItem(
                    "customerPlace"
                ) || ""

        };

    }


    // ========================================================
    // PUT VALUES INTO HTML
    // ========================================================

    if (customerName) {

        customerName.value =
            data.name || "";

    }


    if (mobileNumber) {

        mobileNumber.value =
            data.mobile || "";

    }


    if (place) {

        place.value =
            data.place || "";

    }


    console.log(
        "PERSONAL DATA LOADED:",
        data
    );

}


// ============================================================
// NEXT BUTTON
//
// PERSONAL -> DISCOUNT
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "======================================"
            );

            console.log(
                "PERSONAL NEXT CLICKED"
            );


            // ==================================================
            // VALIDATE
            // ==================================================

            if (!validateForm()) {

                console.log(
                    "VALIDATION FAILED"
                );

                return;

            }


            // ==================================================
            // SAVE
            // ==================================================

            savePersonalData();


            // ==================================================
            // REDIRECT
            // ==================================================

            console.log(
                "PERSONAL DATA SAVED"
            );

            console.log(
                "REDIRECTING TO DISCOUNT.HTML"
            );

            console.log(
                "======================================"
            );


            // IMPORTANT
            // Personal ALWAYS goes to Discount

            window.location.assign(
                "discount.html"
            );

        }
    );

}
else {

    console.error(
        "ERROR: nextBtn NOT FOUND"
    );

}


// ============================================================
// BACK BUTTON
//
// PERSONAL -> LABOUR
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "BACK BUTTON CLICKED"
            );


            window.location.assign(
                "labour.html"
            );

        }
    );

}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "PERSONAL PAGE INITIALIZED"
        );

        loadPersonalData();

    }
);
