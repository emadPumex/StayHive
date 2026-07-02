package com.stayhive.dto;

import java.util.List;

import com.stayhive.model.property.Property.PropertyType;
import com.stayhive.model.property.RoomCategory.RoomType;

public record PropertyUpdateDTO(
        String name,
        String summary,
        String propertyType,
        String city,
        List<AmenityDTO> propertyAmenities,
        CancellationPolicyDTO cancellationPolicy,
        List<RoomCategoryDTO> roomCategories
) {
}
