// =======================================
// WOOD PAGE ONLY PERSISTENCE
// =======================================
//
// Saves ONLY Wood page inputs.
//
// Values remain while moving:
// Wood → Labour → Advance → Bill → Confirm
//
// Values are cleared ONLY when:
// 1. User clicks Home
// 2. Bill is successfully saved
// =======================================


const WOOD_STORAGE_KEY = "wood_page_data";


// =======================================
// CHECK CURRENT PAGE
// =======================================

function isWoodPage() {

    const path =
        window.location.pathname.toLowerCase();

    return (
        path.endsWith("/wood.html") ||
        path.endsWith("/woodcalculation.html") ||
        path.endsWith("/wood-calculation.html")
    );

}


// =======================================
// SAVE WOOD PAGE
// =======================================

function saveWoodPageData() {

    if (!isWoodPage()) {
        return;
    }


    const data = {};


    document
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(function(input) {

            if (!input.id && !input.name) {
                return;
            }


            const key =
                input.id || input.name;


            // CHECKBOX
            if (input.type === "checkbox") {

                data[key] =
                    input.checked;

            }


            // RADIO
            else if (input.type === "radio") {

                if (input.checked) {

                    data[key] =
                        input.value;

                }

            }


            // NORMAL INPUT
            else {

                data[key] =
                    input.value;

            }

        });


    sessionStorage.setItem(
        WOOD_STORAGE_KEY,
        JSON.stringify(data)
    );


    console.log(
        "Wood page data saved."
    );

}


// =======================================
// LOAD WOOD PAGE
// =======================================

function loadWoodPageData() {

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


    let data;


    try {

        data =
            JSON.parse(saved);

    }
    catch (error) {

        console.error(
            "Unable to read wood page data:",
            error
        );

        return;

    }


    document
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(function(input) {

            if (!input.id && !input.name) {
                return;
            }


            const key =
                input.id || input.name;


            if (!(key in data)) {
                return;
            }


            // CHECKBOX
            if (input.type === "checkbox") {

                input.checked =
                    data[key];

            }


            // RADIO
            else if (input.type === "radio") {

                input.checked =
                    input.value === data[key];

            }


            // NORMAL INPUT
            else {

                input.value =
                    data[key];

            }

        });


    console.log(
        "Wood page data loaded."
    );

}


// =======================================
// CLEAR ONLY WOOD PAGE DATA
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
// SAVE WHEN USER TYPES
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
