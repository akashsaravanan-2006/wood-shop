// ===========================================
// PERSONAL.JS
// CENTRAL BILL STORAGE VERSION
// ===========================================


// ===========================================
// CHECK STORE DATA
// ===========================================

if (
    typeof getPageData !== "function" ||
    typeof savePageData !== "function"
) {

    console.error(
        "storedata.js is not loaded before personal.js"
    );

}


// ===========================================
// GET HTML ELEMENTS
// ===========================================

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


// ===========================================
// LOAD SAVED PERSONAL DATA
// ===========================================
