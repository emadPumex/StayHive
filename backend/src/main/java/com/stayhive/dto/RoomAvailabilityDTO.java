package com.stayhive.dto;

import java.util.List;

public record RoomAvailabilityDTO(
        String id,
        List<BlockRuleDTO> roomBlockRules
) {
}
