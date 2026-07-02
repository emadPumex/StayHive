package com.stayhive.dto;

import java.util.List;

public record PropertyAvailabilityUpdateDTO(

        List<BlockRuleDTO> propertyBlockRules,
        List<RoomAvailabilityDTO> roomCategories
) {
}
