export const computeBookingTotals = ({ room, property, checkIn, checkOut }) => {
    const price = room.basePrice || property.basePrice || 0;
    const nights = (() => {
        try {
            return Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000) || 7;
        } catch {
            return 7;
        }
    })();
    const baseRate = price * nights;
    const cleaningFee = property?.cleaningFee ?? 0;
    const serviceFee = Math.round(baseRate * 0.08);
    const total = baseRate + cleaningFee + serviceFee;
    return { price, nights, baseRate, cleaningFee, serviceFee, total };
};