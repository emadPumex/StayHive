package com.stayhive.dto;

import java.math.BigDecimal;

public record CancellationWindowDTO(
        Integer daysBeforeCheckIn,
        BigDecimal refundPercentage
) {
}
