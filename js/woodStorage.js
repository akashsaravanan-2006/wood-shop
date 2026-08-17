// =======================================
// WOOD PAGE TEMPORARY STORAGE
// =======================================

const WOOD_STORAGE_KEYS = [

    "woodData",
    "woodTotal"

];


// =======================================
// CLEAR WOOD DATA
// =======================================

function clearWoodData() {

    WOOD_STORAGE_KEYS.forEach(function(key) {

        localStorage.removeItem(key);

    });

    console.log(
        "Wood page temporary data cleared."
    );

}
