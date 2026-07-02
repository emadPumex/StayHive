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

    private String reason;

    private BlockType blockType;

    private LocalDate startDate;

    private LocalDate endDate;


    private List<DayOfWeek> daysOfWeek;


    private MonthlyRecurrenceRule monthlyRule;

    public enum MonthlyRecurrenceRule {
        START_OF_MONTH,
        END_OF_MONTH,
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

