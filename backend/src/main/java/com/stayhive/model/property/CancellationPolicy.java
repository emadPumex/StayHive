package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancellationPolicy {
    private PolicyType type;
    private String name;
    private String description;


    private List<CancellationWindow> windows;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CancellationWindow {
        private Integer daysBeforeCheckIn;
        private BigDecimal refundPercentage;

    }


    public enum PolicyType {
        FLEXIBLE, MODERATE, STRICT, CUSTOM
    }
}