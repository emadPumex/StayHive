package com.stayhive.dto;

import com.stayhive.model.property.BlockRule;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

public record BlockRuleDTO(
        String id,
        String reason,
        String blockType,
        LocalDate startDate,
        LocalDate endDate,
        List<DayOfWeek> daysOfWeek,
        BlockRule.MonthlyRecurrenceRule monthlyRule
) {
}
