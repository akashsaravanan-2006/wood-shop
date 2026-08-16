// =======================================
// NUMBER INPUT CONTROL
// =======================================

// Prevent laptop touchpad / mouse wheel
// from changing number input values.

document.addEventListener("wheel", function (event) {

    if (
        event.target.tagName === "INPUT" &&
        event.target.type === "number"
    ) {
        event.preventDefault();
    }

}, { passive: false });


// =======================================
// PREVENT ARROW UP / DOWN
// =======================================

// Number inputs will change only when
// the user actually types a value.

document.addEventListener("keydown", function (event) {

    if (
        event.target.tagName === "INPUT" &&
        event.target.type === "number"
    ) {

        if (
            event.key === "ArrowUp" ||
            event.key === "ArrowDown"
        ) {
            event.preventDefault();
        }

    }

});