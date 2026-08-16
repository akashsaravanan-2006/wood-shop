// =======================================
// WOODSHOP FORM PERSISTENCE
// Keeps entered values while moving
// between pages.
// =======================================

const STORAGE_KEY = "woodshop_bill_data";


// =======================================
// SAVE CURRENT PAGE VALUES
// =======================================

function savePageData() {

    const data = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "{}"
    );

    document.querySelectorAll("input, select, textarea").forEach(input => {

        if (!input.id && !input.name) return;

        const key = input.id || input.name;

        if (input.type === "checkbox") {
            data[key] = input.checked;
        }
        else if (input.type === "radio") {

            if (input.checked) {
                data[key] = input.value;
            }

        }
        else {
            data[key] = input.value;
        }

    });

    sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


// =======================================
// LOAD PREVIOUS VALUES
// =======================================

function loadPageData() {

    const data = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "{}"
    );

    document.querySelectorAll("input, select, textarea").forEach(input => {

        if (!input.id && !input.name) return;

        const key = input.id || input.name;

        if (!(key in data)) return;

        if (input.type === "checkbox") {
            input.checked = data[key];
        }
        else if (input.type === "radio") {

            input.checked = input.value === data[key];

        }
        else {
            input.value = data[key];
        }

    });
}


// =======================================
// LOAD WHEN PAGE OPENS
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    loadPageData();

});


// =======================================
// SAVE WHEN USER TYPES
// =======================================

document.addEventListener("input", () => {

    savePageData();

});


// =======================================
// SAVE WHEN SELECT CHANGES
// =======================================

document.addEventListener("change", () => {

    savePageData();

});


// =======================================
// CLEAR ONLY AFTER SAVE BILL
// =======================================

function clearBillData() {

    sessionStorage.removeItem(STORAGE_KEY);

}