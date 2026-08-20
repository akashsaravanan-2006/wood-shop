// ============================================================
// PERSONAL.JS
// Personal Details
//
// FLOW:
// Personal -> Discount
// ============================================================

console.log("PERSONAL.JS LOADED");


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
// VALIDATION
// ============================================================

function validateForm() {

    const name =
        customerName.value.trim();

    const mobile =
        mobileNumber.value.trim();

    const customerPlace =
        place.value.trim();


    if (name === "") {

        alert("Please enter Customer Name");

        customerName.focus();

        return false;
    }


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


    if (customerPlace === "") {

        alert("Please enter Place");

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


    // ========================================================
    // OLD STORAGE
    // Keep for existing bill.js compatibility
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
        "PERSONAL DATA SAVED:",
        data
    );

}


// ============================================================
// LOAD SAVED PERSONAL DATA
// ============================================================

function loadPersonalData() {

    let data = null;


    if (
        typeof getPageData === "function"
    ) {

        data =
            getPageData("personal");

    }


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


    customerName.value =
        data.name || "";

    mobileNumber.value =
        data.mobile || "";

    place.value =
        data.place || "";


    console.log(
        "PERSONAL DATA LOADED:",
        data
    );

}


// ============================================================
// NEXT
// Personal -> Discount
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function () {

            if (!validateForm()) {

                return;

            }


            savePersonalData();


            console.log(
                "GOING TO DISCOUNT PAGE"
            );


            window.location.href =
                "discount.html";

        }
    );

}


// ============================================================
// BACK
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "labour.html";

        }
    );

}


// ============================================================
// LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPersonalData();

    }
);
