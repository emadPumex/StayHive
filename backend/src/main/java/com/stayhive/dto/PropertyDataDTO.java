package com.stayhive.dto;

import com.stayhive.model.property.*;
import com.stayhive.model.property.Property.PropertyType;

import java.util.List;

public record PropertyDataDTO(
        String name,
        PropertyType propertyType,
        String summary,
        Host host,
        Address address,
        Image images,                        // ADD THIS
        List<Amenity> propertyAmenities,
        CancellationPolicy cancellationPolicy,
        List<RoomCategory> roomCategories,
        List<BlockRule> propertyBlockRules
) {}
