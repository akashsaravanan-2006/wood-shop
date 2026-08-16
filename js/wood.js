// ==========================================
// Show / Hide Other Wood
// ==========================================

document.addEventListener("change", function (e) {

    if (!e.target.classList.contains("woodType")) return;

    const card = e.target.closest(".calculation");

    const other = card.querySelector(".otherWood");

    if (e.target.value === "Other") {

        other.style.display = "block";
        other.focus();

    } else {

        other.style.display = "none";
        other.value = "";

    }

});


// ==========================================
// Add Length Row
// ==========================================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("addLength")) return;

    const card = e.target.closest(".calculation");

    const container = card.querySelector(".lengthRows");

    const row = document.createElement("div");

    row.className = "lengthRow";

    row.innerHTML = `

        <div class="lengthInput">

            <input
                type="number"
                class="length"
                placeholder="Length"
                min="0"
                step="0.01">

            <input
                type="number"
                class="extraLength"
                placeholder="0"
                value="0"
                min="0"
                step="0.01">

        </div>

        <div class="qtyInput">

            <input
                type="number"
                class="qty"
                placeholder="Qty"
                min="1">

        </div>

        <button
            type="button"
            class="removeRow">

            ✖

        </button>

    `;

    container.appendChild(row);

});


// ==========================================
// Remove Length Row
// ==========================================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("removeRow")) return;

    const rows = e.target.closest(".lengthRows");

    if (rows.children.length === 1) {

        alert("At least one row is required.");

        return;

    }

    e.target.closest(".lengthRow").remove();

});


// ==========================================
// Calculate
// ==========================================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("calculate")) return;

    const card = e.target.closest(".calculation");

    const breadth =
        parseFloat(card.querySelector(".breadth").value) || 0;

    const thickness =
        parseFloat(card.querySelector(".thickness").value) || 0;

    const rate =
        parseFloat(card.querySelector(".rate").value) || 0;

    let totalLength = 0;

    card.querySelectorAll(".lengthRow").forEach(function (row) {

        const length =
            parseFloat(
                row.querySelector(".length").value
            ) || 0;

        const extra =
            parseFloat(
                row.querySelector(".extraLength").value
            ) || 0;

        const qty =
            parseFloat(
                row.querySelector(".qty").value
            ) || 0;

        const finalLength = length + extra;

        totalLength += finalLength * qty;

    });

    const cubicFeet =
        (breadth * thickness * totalLength) / 144;

    const amount =
        cubicFeet * rate;

    card.querySelector(".cf").textContent =
        cubicFeet.toFixed(2);

    card.querySelector(".amount").textContent =
        amount.toFixed(2);

    updateGrandTotal();

});


// ==========================================
// Grand Total
// ==========================================

function updateGrandTotal() {

    let total = 0;

    document.querySelectorAll(".amount").forEach(function (item) {

        total += parseFloat(item.textContent) || 0;

    });

    document.getElementById("grandTotal").textContent =
        total.toFixed(2);

}


// ==========================================
// Clear Calculation
// ==========================================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("clear")) return;

    const card =
        e.target.closest(".calculation");

    // Clear inputs

    card.querySelectorAll("input").forEach(input => {

        if (input.classList.contains("extraLength")) {

            input.value = "0";

        } else {

            input.value = "";

        }

    });


    // Reset wood type

    card.querySelector(".woodType").selectedIndex = 0;

    const other =
        card.querySelector(".otherWood");

    other.style.display = "none";

    other.value = "";


    // Reset result

    card.querySelector(".cf").textContent =
        "0.00";

    card.querySelector(".amount").textContent =
        "0.00";


    // Keep only one length row

    const rows =
        card.querySelector(".lengthRows");

    rows.innerHTML = `

        <div class="lengthRow">

            <div class="lengthInput">

                <input
                    type="number"
                    class="length"
                    step="0.01"
                    min="0"
                    placeholder="Length">

                <input
                    type="number"
                    class="extraLength"
                    step="0.01"
                    min="0"
                    value="0"
                    placeholder="0">

            </div>

            <div class="qtyInput">

                <input
                    type="number"
                    class="qty"
                    placeholder="Qty">

            </div>

            <button
                type="button"
                class="removeRow">

                ✖

            </button>

        </div>

    `;

    updateGrandTotal();

});


// ==========================================
// Remove Calculation
// ==========================================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("remove")) return;

    const cards =
        document.querySelectorAll(".calculation");

    if (cards.length == 1) {

        alert("At least one calculation is required.");

        return;

    }

    e.target.closest(".calculation").remove();


    // Rename cards

    document.querySelectorAll(".calculation")
        .forEach((card, index) => {

            card.querySelector("h2").textContent =
                "Calculation " + (index + 1);

        });

    updateGrandTotal();

});


// ==========================================
// Add Another Calculation
// ==========================================

document
    .getElementById("addCalculation")
    .addEventListener("click", function () {

        const first =
            document.querySelector(".calculation");

        const newCard =
            first.cloneNode(true);


        // Reset inputs

        newCard.querySelectorAll("input")
            .forEach(input => {

                if (
                    input.classList
                        .contains("extraLength")
                ) {

                    input.value = "0";

                } else {

                    input.value = "";

                }

            });


        // Reset wood type

        newCard
            .querySelector(".woodType")
            .selectedIndex = 0;

        const other =
            newCard.querySelector(".otherWood");

        other.style.display = "none";

        other.value = "";


        // Reset results

        newCard
            .querySelector(".cf")
            .textContent = "0.00";

        newCard
            .querySelector(".amount")
            .textContent = "0.00";


        // Reset rows

        newCard
            .querySelector(".lengthRows")
            .innerHTML = `

                <div class="lengthRow">

                    <div class="lengthInput">

                        <input
                            type="number"
                            class="length"
                            step="0.01"
                            min="0"
                            placeholder="Length">

                        <input
                            type="number"
                            class="extraLength"
                            step="0.01"
                            min="0"
                            value="0"
                            placeholder="0">

                    </div>

                    <div class="qtyInput">

                        <input
                            type="number"
                            class="qty"
                            placeholder="Qty">

                    </div>

                    <button
                        type="button"
                        class="removeRow">

                        ✖

                    </button>

                </div>

            `;


        document
            .getElementById("allCalculations")
            .appendChild(newCard);


        // Update heading

        document
            .querySelectorAll(".calculation")
            .forEach((card, index) => {

                card.querySelector("h2").textContent =
                    "Calculation " + (index + 1);

            });

    });


// ==========================================
// Final Calculation
// ==========================================

document
    .getElementById("finalCalculation")
    .addEventListener("click", function () {

        updateGrandTotal();

        alert(
            "Grand Total : ₹ " +
            document
                .getElementById("grandTotal")
                .textContent
        );

    });


// ==========================================
// CONFIRM
// ==========================================

document
    .getElementById("confirmBtn")
    .addEventListener("click", function () {

        // Update total first

        updateGrandTotal();


        // ==========================================
        // CHECK EMPTY CART
        // ==========================================

        const total =
            parseFloat(
                document
                    .getElementById("grandTotal")
                    .textContent
            ) || 0;


        if (total <= 0) {

            alert("Your cart is Empty!");

            return;

        }


        // ==========================================
        // CREATE WOOD DATA
        // ==========================================

        const woodData = [];


        document
            .querySelectorAll(".calculation")
            .forEach(card => {

                let pieces = [];

                let totalLength = 0;


                card
                    .querySelectorAll(".lengthRow")
                    .forEach(function (row) {

                        let length =
                            parseFloat(
                                row
                                    .querySelector(".length")
                                    .value
                            ) || 0;

                        let extra =
                            parseFloat(
                                row
                                    .querySelector(".extraLength")
                                    .value
                            ) || 0;

                        let qty =
                            parseFloat(
                                row
                                    .querySelector(".qty")
                                    .value
                            ) || 0;


                        let finalLength =
                            length + extra;


                        let rowTotal =
                            finalLength * qty;


                        totalLength += rowTotal;


                        pieces.push({

                            length: length,

                            extraLength: extra,

                            qty: qty,

                            totalLength: rowTotal

                        });

                    });


                // ==========================================
                // SAVE CALCULATION
                // ==========================================

                woodData.push({

                    woodType:
                        card
                            .querySelector(".woodType")
                            .value,

                    otherWood:
                        card
                            .querySelector(".otherWood")
                            .value,

                    breadth:
                        card
                            .querySelector(".breadth")
                            .value,

                    thickness:
                        card
                            .querySelector(".thickness")
                            .value,

                    rate:
                        card
                            .querySelector(".rate")
                            .value,

                    totalLength:
                        totalLength,

                    pieces:
                        pieces,

                    cubicFeet:
                        card
                            .querySelector(".cf")
                            .textContent,

                    amount:
                        card
                            .querySelector(".amount")
                            .textContent,

                    quality:
                        card
                            .querySelector(".quality")
                            .value

                });

            });


        // ==========================================
        // SAVE TO LOCAL STORAGE
        // ==========================================

        localStorage.setItem(
            "woodData",
            JSON.stringify(woodData)
        );


        localStorage.setItem(
            "woodTotal",
            document
                .getElementById("grandTotal")
                .textContent
        );


        // ==========================================
        // GO TO LABOUR PAGE
        // ==========================================

        window.location.href =
            "labour.html";

    });// ==========================================
// HOME BUTTON
// ==========================================

const homeBtn = document.getElementById("homeBtn");

if (homeBtn) {

    homeBtn.addEventListener("click", function () {

        window.location.href = "index.html";

    });

}