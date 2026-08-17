// =======================================
// WOOD PAGE ONLY PERSISTENCE
// =======================================
//
// Values are saved ONLY for the Wood page.
//
// They remain while the user moves through:
// Wood → Labour → Advance → Bill → Confirm
//
// They are cleared ONLY when:
// 1. Bill is confirmed/saved
// 2. User goes Home
// =======================================


const WOOD_STORAGE_KEY = "wood_page_data";


// =======================================
// CHECK IF CURRENT PAGE IS WOOD PAGE
// =======================================

function isWoodPage() {

    const path =
        window.location.pathname.toLowerCase();

    return (
        path.endsWith("/wood.html") ||
        path.endsWith("/wood") ||
        path.endsWith("/wood-calculation.html")
    );

}


// =======================================
// SAVE WOOD PAGE VALUES
// =======================================

function saveWoodPageData() {

    // Do nothing on other pages
    if (!isWoodPage()) {
        return;
    }


    const data = {};


    document
        .querySelectorAll("input, select, textarea")
        .forEach(function(input) {

            if (!input.id && !input.name) {
                return;
            }


            const key =
                input.id || input.name;


            // Checkbox
            if (input.type === "checkbox") {

                data[key] =
                    input.checked;

            }


            // Radio
            else if (input.type === "radio") {

                if (input.checked) {

                    data[key] =
                        input.value;

                }

            }


            // Normal input/select/textarea
            else {

                data[key] =
                    input.value;

            }

        });


    sessionStorage.setItem(
        WOOD_STORAGE_KEY,
        JSON.stringify(data)
    );

}


// =======================================
// LOAD WOOD PAGE VALUES
// =======================================

function loadWoodPageData() {

    // Do nothing on other pages
    if (!isWoodPage()) {
        return;
    }


    const saved =
        sessionStorage.getItem(
            WOOD_STORAGE_KEY
        );


    if (!saved) {
        return;
    }


    let data = {};

    try {

        data =
            JSON.parse(saved);

    }
    catch (error) {

        console.error(
            "Wood storage error:",
            error
        );

        return;

    }


    document
        .querySelectorAll("input, select, textarea")
        .forEach(function(input) {

            if (!input.id && !input.name) {
                return;
            }


            const key =
                input.id || input.name;


            if (!(key in data)) {
                return;
            }


            // Checkbox
            if (input.type === "checkbox") {

                input.checked =
                    data[key];

            }


            // Radio
            else if (input.type === "radio") {

                input.checked =
                    input.value === data[key];

            }


            // Normal input
            else {

                input.value =
                    data[key];

            }

        });

}


// =======================================
// CLEAR WOOD PAGE VALUES
// =======================================

function clearWoodPageData() {

    sessionStorage.removeItem(
        WOOD_STORAGE_KEY
    );


    console.log(
        "Wood page data cleared."
    );

}


// =======================================
// PAGE LOAD
// =======================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadWoodPageData();

    }
);


// =======================================
// SAVE WHILE USER TYPES
// =======================================

document.addEventListener(
    "input",
    function() {

        saveWoodPageData();

    }
);


// =======================================
// SAVE SELECT / CHECKBOX / RADIO
// =======================================

document.addEventListener(
    "change",
    function() {

        saveWoodPageData();

    }
);
