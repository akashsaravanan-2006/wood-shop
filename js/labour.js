// ===========================================
// LABOUR.JS - PART 1
// ===========================================

// Load Wood Total
let woodTotal = parseFloat(localStorage.getItem("woodTotal")) || 0;

// HTML Elements
const woodTotalDisplay = document.getElementById("woodTotal");
const labourCharge = document.getElementById("labourCharge");
const otherCharge = document.getElementById("otherCharge");
const othersTotal = document.getElementById("othersTotal");
const finalTotal = document.getElementById("finalTotal");
const othersBody = document.getElementById("othersBody");
const otherSection = document.getElementById("otherSection");

// Display Wood Total
woodTotalDisplay.innerHTML = "₹ " + woodTotal.toFixed(2);

// ===========================================
// Calculate Totals
// ===========================================

function updateTotals() {

    let labour = Number(labourCharge.value) || 0;
    let other = Number(otherCharge.value) || 0;

    let extra = 0;

    document.querySelectorAll(".otherAmount").forEach(function (input) {
        extra += Number(input.value) || 0;
    });

    let others = labour + other + extra;
    let grand = woodTotal + others;

    othersTotal.innerHTML = "₹ " + others.toFixed(2);
    finalTotal.innerHTML = "₹ " + grand.toFixed(2);

}

// ===========================================
// Events
// ===========================================

labourCharge.addEventListener("input", updateTotals);
otherCharge.addEventListener("input", updateTotals);

document.addEventListener("input", function (e) {

    if (e.target.classList.contains("otherAmount")) {

        updateTotals();

    }

});

// First Calculation
updateTotals();
// ===========================================
// PART 2
// Add Other Charges
// ===========================================

const addOtherBtn = document.getElementById("addOther");

addOtherBtn.addEventListener("click", function () {

    // Show Table
    otherSection.style.display = "block";

    // Create Row
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <input
                type="text"
                class="otherName"
                placeholder="Charge Name">
        </td>

        <td>
            <input
                type="number"
                class="otherAmount"
                placeholder="0"
                min="0">
        </td>

        <td>
            <button
                type="button"
                class="removeBtn">
                Remove
            </button>
        </td>
    `;

    othersBody.appendChild(row);

    updateTotals();

});


// ===========================================
// Remove Other Charge
// ===========================================

othersBody.addEventListener("click", function (e) {

    if (e.target.classList.contains("removeBtn")) {

        e.target.closest("tr").remove();

        if (othersBody.rows.length === 0) {

            otherSection.style.display = "none";

        }

        updateTotals();

    }

});


// ===========================================
// Update Total Automatically
// ===========================================

othersBody.addEventListener("input", function (e) {

    if (e.target.classList.contains("otherAmount")) {

        updateTotals();

    }

});// ===========================================
// PART 3
// Confirm Button
// ===========================================

const confirmBtn = document.getElementById("confirmBtn");

confirmBtn.addEventListener("click", function () {

    let labour = Number(labourCharge.value) || 0;
    let other = Number(otherCharge.value) || 0;

    let othersData = [];
    let extraTotal = 0;

    document.querySelectorAll("#othersBody tr").forEach(function (row) {

        let name = row.querySelector(".otherName").value.trim();

        let amount = Number(row.querySelector(".otherAmount").value) || 0;

        if (name !== "" || amount > 0) {

            othersData.push({
                name: name,
                amount: amount
            });

            extraTotal += amount;
        }

    });

    let othersTotalValue = labour + other + extraTotal;
    let finalTotalValue = woodTotal + othersTotalValue;

    // Save Data
    localStorage.setItem("labourCharge", labour);
    localStorage.setItem("otherCharge", other);
    localStorage.setItem("othersData", JSON.stringify(othersData));
    localStorage.setItem("othersTotal", othersTotalValue);
    localStorage.setItem("finalTotal", finalTotalValue);

    // Next Page
    window.location.href = "personal.html";

});
// =======================================
// BACK BUTTON
// =======================================

const backBtn = document.getElementById("backBtn");

if (backBtn) {
    backBtn.addEventListener("click", () => {
        window.location.href = "wood.html";
    });
}
