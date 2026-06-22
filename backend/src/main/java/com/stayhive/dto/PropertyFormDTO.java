package com.stayhive.dto;

import org.springframework.web.multipart.MultipartFile;
import com.stayhive.model.property.Property.PropertyType;
import com.stayhive.model.property.Property.RoomType;
import com.stayhive.model.property.Property.CancellationPolicy;

import java.util.List;

public record PropertyFormDTO(

        // Property Details
        String name,
        PropertyType propertyType,
        RoomType roomType,
        Double price,
        Integer accommodates,
        Integer bedrooms,
        Integer bathrooms,
        String summary,
        List<String> amenities,
        CancellationPolicy cancellationPolicy,

        // Host Details
        String hostName,
        MultipartFile profileImageUrl,

        // Address Details
        String country,
        String state,
        String city,
        Double latitude,
        Double longitude,

        // Property Images
        List<MultipartFile> images

) {
}