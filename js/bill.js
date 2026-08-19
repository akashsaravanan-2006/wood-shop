function normalizeWood(item) {

    if (!item || typeof item !== "object") {
        return null;
    }

    const wood =
        item.wood ??
        item.woodName ??
        item.name ??
        item.type ??
        item.Wood ??
        "";

    const size =
        item.size ??
        item.Size ??
        item.dimension ??
        item.dimensions ??
        "";

    const length =
        getNumber(
            item.length ??
            item.Length ??
            item.len ??
            item.lengthValue ??
            item.woodLength
        );

    const breadth =
        getNumber(
            item.breadth ??
            item.Breadth ??
            item.width ??
            item.Width ??
            item.breadthValue
        );

    const qty =
        getNumber(
            item.qty ??
            item.quantity ??
            item.Qty ??
            item.qtyValue ??
            item.quantityValue
        );

    const totalLengthStored =
        item.totalLength ??
        item.total_length ??
        item.totalLen ??
        item.totalLengthValue;

    const totalLength =
        totalLengthStored !== undefined &&
        totalLengthStored !== null &&
        totalLengthStored !== ""
            ? getNumber(totalLengthStored)
            : length * qty;

    let cft =
        getNumber(
            item.cft ??
            item.CFT ??
            item.cftValue ??
            item.cftAmount
        );

    /*
       If CFT was not stored but dimensions are available,
       calculate it.

       IMPORTANT:
       This uses:
       Breadth × Thickness × Length × Qty / 144
       only if your stored size is represented that way.
    */

    if (!cft && breadth && length && qty) {

        const thickness =
            getNumber(
                item.thickness ??
                item.Thickness ??
                item.height ??
                item.Height
            );

        if (thickness) {
            cft =
                (breadth * thickness * length * qty) / 144;
        }
    }

    const rate =
        getNumber(
            item.rate ??
            item.Rate ??
            item.price ??
            item.rateValue
        );

    let amount =
        getNumber(
            item.amount ??
            item.Amount ??
            item.totalAmount ??
            item.total ??
            item.value
        );

    /*
       If amount was not stored,
       calculate CFT × Rate.
    */

    if (!amount && cft && rate) {
        amount = cft * rate;
    }

    const quality =
        item.quality ??
        item.Quality ??
        item.qualityNo ??
        item.qualityNumber ??
        item.q ??
        1;

    return {

        wood: String(wood).trim(),

        size: String(size).trim(),

        length: length,

        breadth: breadth,

        qty: qty,

        totalLength: totalLength,

        cft: cft,

        rate: rate,

        amount: amount,

        quality: String(quality).trim()

    };
}
