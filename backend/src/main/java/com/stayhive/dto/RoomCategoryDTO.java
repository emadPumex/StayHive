package com.stayhive.dto;

import com.stayhive.model.property.BlockRule;
import com.stayhive.model.property.Image;

import java.util.List;

public record RoomCategoryDTO(
        String id,
        String name,
        String roomType,
        Integer bedroomCount,
        Double basePrice,
        Integer totalInventory,
        Integer accommodates,
        Integer bedCount,
        Integer bathrooms,
        List<AmenityDTO> roomAmenities,
        Image images,             // passthrough, shape not owned by this endpoint
        List<BlockRule> roomBlockRules // passthrough
) {}