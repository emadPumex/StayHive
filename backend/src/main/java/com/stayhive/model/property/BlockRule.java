package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockRule {
    private String id;
    private String reason;         // Context label for logs (e.g., "Annual Pool Maintenance")
    private BlockType blockType;   // SPECIFIC_DATES, RECURRING_WEEKLY, RECURRING_MONTHLY, SPECIFIC_MONTHS

    // Active parameters if BlockType is SPECIFIC_DATES or SPECIFIC_MONTHS range windows
    private LocalDate startDate;
    private LocalDate endDate;

    // Active parameter if BlockType is RECURRING_WEEKLY (guarantees strict day-matching logic)
    private List<DayOfWeek> daysOfWeek;

    // Active parameter if BlockType is RECURRING_MONTHLY (calculates offsets on engine evaluations)
    private MonthlyRecurrenceRule monthlyRule;

    public enum MonthlyRecurrenceRule {
        START_OF_MONTH, // e.g., Auto-block days 1st-3rd for internal bookkeeping
        END_OF_MONTH,   // e.g., Auto-block days 29th-31st
        FIRST_WEEKEND,
        CUSTOM_DAY_RANGE
    }

    public enum BlockType {
        SPECIFIC_DATES,
        RECURRING_WEEKLY,
        RECURRING_MONTHLY,
        SPECIFIC_MONTHS
    }
}

