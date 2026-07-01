package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancellationPolicy {
    private PolicyType type;          // Core tag group matching (FLEXIBLE, MODERATE, STRICT, CUSTOM)
    private String name;              // Front UI Title text (e.g., "Moderate Tiered Policy")
    private String description;       // Explanatory text for consumers

    // Supports multi-tier sequential timeline windows (ordered from highest daysBeforeCheckIn to lowest)
    private List<CancellationWindow> windows;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CancellationWindow {
        private Integer daysBeforeCheckIn; // The day margin threshold required to clear (e.g., 14, 7, 0)
        private Double refundPercentage;   // Total calculated return ratio window (e.g., 100.0, 50.0, 0.0)

    }


    public enum PolicyType {
        FLEXIBLE, MODERATE, STRICT, CUSTOM
    }
}