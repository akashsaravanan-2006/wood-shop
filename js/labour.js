<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Labour & Other Charges</title>

    <link
        rel="stylesheet"
        href="../css/labour.css">

</head>


<body>


<div class="container">

    <div class="card">


        <!-- =========================================
             TITLE
        ========================================== -->

        <h1>
            Labour & Other Charges
        </h1>


        <!-- =========================================
             WOOD TOTAL
             
             THIS VALUE COMES FROM WOOD PAGE.
             IT MUST NEVER BE MODIFIED HERE.
        ========================================== -->

        <div class="field">

            <label>
                Wood Total
            </label>

            <div class="amount-box">

                <strong id="woodTotal">
                    ₹ 0.00
                </strong>

            </div>

        </div>


        <!-- =========================================
             LABOUR CHARGE
        ========================================== -->

        <div class="field">

            <label for="labourCharge">
                Labour Charge
            </label>

            <input
                type="number"
                id="labourCharge"
                min="0"
                step="0.01"
                placeholder="Enter Labour Charge">

        </div>


        <!-- =========================================
             OTHER CHARGE
        ========================================== -->

        <div class="field">

            <label for="otherCharge">
                Other Charge
            </label>

            <input
                type="number"
                id="otherCharge"
                min="0"
                step="0.01"
                placeholder="Enter Other Charge">

        </div>


        <!-- =========================================
             ADD OTHER
        ========================================== -->

        <div class="button-row">

            <button
                type="button"
                id="addOtherBtn">

                + Add Other

            </button>

        </div>


        <!-- =========================================
             OTHER ITEMS
        ========================================== -->

        <div id="othersContainer"></div>


        <!-- =========================================
             OTHERS TOTAL
             
             ONLY ADDITIONAL OTHER ITEMS.
             LABOUR IS NOT INCLUDED HERE.
        ========================================== -->

        <div class="field">

            <label>
                Others Total
            </label>

            <div class="amount-box">

                <strong id="othersTotal">
                    ₹ 0.00
                </strong>

            </div>

        </div>


        <!-- =========================================
             GRAND TOTAL
             
             Wood + Labour + Others
        ========================================== -->

        <div class="field">

            <label>
                Grand Total
            </label>

            <div class="grand-total-box">

                <strong id="grandTotal">
                    ₹ 0.00
                </strong>

            </div>

        </div>


        <!-- =========================================
             CONFIRM
        ========================================== -->

        <div class="bottom-buttons">

            <button
                type="button"
                id="confirmBtn">

                Confirm

            </button>


            <button
                type="button"
                id="backBtn">

                Back

            </button>

        </div>


        <!-- =========================================
             NEXT
             
             LABOUR -> PERSONAL
        ========================================== -->

        <div class="next-row">

            <button
                type="button"
                id="nextBtn">

                Next

            </button>

        </div>


    </div>

</div>


<script src="../js/labour.js?v=400"></script>


</body>

</html>
